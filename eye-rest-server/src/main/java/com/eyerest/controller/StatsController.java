package com.eyerest.controller;

import com.eyerest.dto.StatsSummary;
import com.eyerest.model.EyeStats;
import com.eyerest.repository.EyeStatsRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    private final EyeStatsRepository eyeStatsRepository;
    private final MongoTemplate mongoTemplate;

    public StatsController(EyeStatsRepository eyeStatsRepository, MongoTemplate mongoTemplate) {
        this.eyeStatsRepository = eyeStatsRepository;
        this.mongoTemplate = mongoTemplate;
    }

    // POST /api/stats - บันทึกสถิติ session
    @PostMapping
    public ResponseEntity<Map<String, Object>> saveStats(@RequestBody EyeStats stats) {
        try {
            if (stats.getTimestamp() == null) {
                stats.setTimestamp(Instant.now());
            }
            EyeStats saved = eyeStatsRepository.save(stats);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "success", true,
                    "message", "Statistics saved successfully",
                    "data", saved));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Error saving statistics",
                    "error", e.getMessage()));
        }
    }

    // GET /api/stats/{email} - ดึงสถิติของผู้ใช้
    @GetMapping("/{email}")
    public ResponseEntity<Map<String, Object>> getStats(
            @PathVariable String email,
            @RequestParam(defaultValue = "100") int limit,
            @RequestParam(defaultValue = "0") int skip) {
        try {
            int page = (limit > 0) ? skip / limit : 0;
            PageRequest pageRequest = PageRequest.of(page, limit);
            List<EyeStats> stats = eyeStatsRepository
                    .findByEmailOrderByTimestampDesc(email, pageRequest);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "count", stats.size(),
                    "data", stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Error fetching statistics",
                    "error", e.getMessage()));
        }
    }

    // GET /api/stats/{email}/summary - สรุปสถิติรวม
    @GetMapping("/{email}/summary")
    public ResponseEntity<Map<String, Object>> getSummary(@PathVariable String email) {
        try {
            MatchOperation match = Aggregation.match(Criteria.where("email").is(email));

            GroupOperation group = Aggregation.group("email")
                    .count().as("totalSessions")
                    .sum("durationMinutes").as("totalDurationMinutes")
                    .sum("blinkCount").as("totalBlinks")
                    .sum("alertCount").as("totalAlerts")
                    .sum("breaksTaken").as("totalBreaksTaken")
                    .sum("breaksSkipped").as("totalBreaksSkipped")
                    .avg("averageDistanceCm").as("avgDistance")
                    .min("timestamp").as("firstSession")
                    .max("timestamp").as("lastSession");

            Aggregation aggregation = Aggregation.newAggregation(match, group);
            AggregationResults<StatsSummary> results = mongoTemplate.aggregate(aggregation, "eyestats",
                    StatsSummary.class);

            List<StatsSummary> mapped = results.getMappedResults();

            if (mapped.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "No statistics found for this user",
                        "data", "null"));
            }

            StatsSummary summary = mapped.get(0);
            summary.setEmail(email);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", summary));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Error generating summary",
                    "error", e.getMessage()));
        }
    }
}
