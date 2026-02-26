package com.eyerest.controller;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HealthController {

    private final MongoTemplate mongoTemplate;

    public HealthController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    // GET /health
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        String mongoStatus;
        try {
            mongoTemplate.getDb().runCommand(new Document("ping", 1));
            mongoStatus = "connected";
        } catch (Exception e) {
            mongoStatus = "disconnected";
        }

        return ResponseEntity.ok(Map.of(
                "status", "OK",
                "timestamp", Instant.now().toString(),
                "mongodb", mongoStatus));
    }

    // GET /
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
                "name", "Eye-Rest API Server",
                "version", "1.0.0",
                "status", "running",
                "endpoints", Map.of(
                        "health", "/health",
                        "saveStats", "POST /api/stats",
                        "getStats", "GET /api/stats/{email}",
                        "getSummary", "GET /api/stats/{email}/summary")));
    }
}
