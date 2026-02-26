package com.eyerest.dto;

import java.time.Instant;

public class StatsSummary {
    private String email;
    private long totalSessions;
    private double totalDurationMinutes;
    private long totalBlinks;
    private long totalAlerts;
    private long totalBreaksTaken;
    private long totalBreaksSkipped;
    private double avgDistance;
    private Instant firstSession;
    private Instant lastSession;

    public StatsSummary() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public long getTotalSessions() {
        return totalSessions;
    }

    public void setTotalSessions(long totalSessions) {
        this.totalSessions = totalSessions;
    }

    public double getTotalDurationMinutes() {
        return totalDurationMinutes;
    }

    public void setTotalDurationMinutes(double totalDurationMinutes) {
        this.totalDurationMinutes = totalDurationMinutes;
    }

    public long getTotalBlinks() {
        return totalBlinks;
    }

    public void setTotalBlinks(long totalBlinks) {
        this.totalBlinks = totalBlinks;
    }

    public long getTotalAlerts() {
        return totalAlerts;
    }

    public void setTotalAlerts(long totalAlerts) {
        this.totalAlerts = totalAlerts;
    }

    public long getTotalBreaksTaken() {
        return totalBreaksTaken;
    }

    public void setTotalBreaksTaken(long totalBreaksTaken) {
        this.totalBreaksTaken = totalBreaksTaken;
    }

    public long getTotalBreaksSkipped() {
        return totalBreaksSkipped;
    }

    public void setTotalBreaksSkipped(long totalBreaksSkipped) {
        this.totalBreaksSkipped = totalBreaksSkipped;
    }

    public double getAvgDistance() {
        return avgDistance;
    }

    public void setAvgDistance(double avgDistance) {
        this.avgDistance = avgDistance;
    }

    public Instant getFirstSession() {
        return firstSession;
    }

    public void setFirstSession(Instant firstSession) {
        this.firstSession = firstSession;
    }

    public Instant getLastSession() {
        return lastSession;
    }

    public void setLastSession(Instant lastSession) {
        this.lastSession = lastSession;
    }
}
