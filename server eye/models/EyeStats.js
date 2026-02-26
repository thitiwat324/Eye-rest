const mongoose = require('mongoose');
const { toLocalTime } = require('../utils/timezone');

const eyeStatsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    username: {
        type: String,
        default: ''
    },
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    durationMinutes: {
        type: Number,
        required: true,
        min: 0
    },
    blinkCount: {
        type: Number,
        required: true,
        min: 0
    },
    averageDistanceCm: {
        type: Number,
        required: true,
        min: 0
    },
    alertCount: {
        type: Number,
        required: true,
        min: 0
    },
    breaksTaken: {
        type: Number,
        default: 0,
        min: 0
    },
    breaksSkipped: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true // เพิ่ม createdAt และ updatedAt อัตโนมัติ
});

// แปลง timestamp เป็น GMT+7 เมื่อ serialize JSON
eyeStatsSchema.set('toJSON', {
    transform: (doc, ret) => {
        if (ret.timestamp) ret.timestamp = toLocalTime(ret.timestamp);
        if (ret.createdAt) ret.createdAt = toLocalTime(ret.createdAt);
        if (ret.updatedAt) ret.updatedAt = toLocalTime(ret.updatedAt);
        return ret;
    }
});

// สร้าง index สำหรับการค้นหา
eyeStatsSchema.index({ email: 1, timestamp: -1 });

module.exports = mongoose.model('EyeStats', eyeStatsSchema);
