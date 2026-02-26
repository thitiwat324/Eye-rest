package com.eyerest.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Document(collection = "eyestats")
@CompoundIndex(name = "email_timestamp", def = "{'email': 1, 'timestamp': -1}")
public class EyeStats {

    @Id
    private String id;

    @Indexed
    private String email;

    private String username = "";

    @Indexed(unique = true)
    private String sessionId;

    private Instant timestamp;

    private double durationMinutes;

    private int blinkCount;

    private double averageDistanceCm;

    private int alertCount;

    private int breaksTaken = 0;

    private int breaksSkipped = 0;

    @CreatedDate
    @Field("createdAt")
    private Instant createdAt;

    @LastModifiedDate
    @Field("updatedAt")
    private Instant updatedAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public double getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(double durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public int getBlinkCount() {
        return blinkCount;
    }

    public void setBlinkCount(int blinkCount) {
        this.blinkCount = blinkCount;
    }

    public double getAverageDistanceCm() {
        return averageDistanceCm;
    }

    public void setAverageDistanceCm(double averageDistanceCm) {
        this.averageDistanceCm = averageDistanceCm;
    }

    public int getAlertCount() {
        return alertCount;
    }

    public void setAlertCount(int alertCount) {
        this.alertCount = alertCount;
    }

    public int getBreaksTaken() {
        return breaksTaken;
    }

    public void setBreaksTaken(int breaksTaken) {
        this.breaksTaken = breaksTaken;
    }

    public int getBreaksSkipped() {
        return breaksSkipped;
    }

    public void setBreaksSkipped(int breaksSkipped) {
        this.breaksSkipped = breaksSkipped;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
