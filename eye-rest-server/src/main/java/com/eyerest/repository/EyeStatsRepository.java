package com.eyerest.repository;

import com.eyerest.model.EyeStats;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EyeStatsRepository extends MongoRepository<EyeStats, String> {
    List<EyeStats> findByEmailOrderByTimestampDesc(String email, Pageable pageable);
}
