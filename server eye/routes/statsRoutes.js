const express = require('express');
const router = express.Router();
const EyeStats = require('../models/EyeStats');

// POST /api/stats - บันทึกข้อมูลสถิติ
router.post('/', async (req, res) => {
    try {
        const stats = new EyeStats(req.body);
        const savedStats = await stats.save();

        res.status(201).json({
            success: true,
            message: 'Statistics saved successfully',
            data: savedStats
        });
    } catch (error) {
        console.error('❌ Error saving stats:', error);
        res.status(400).json({
            success: false,
            message: 'Error saving statistics',
            error: error.message
        });
    }
});

// GET /api/stats/:email - ดึงข้อมูลสถิติของผู้ใช้
router.get('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { limit = 100, skip = 0 } = req.query;

        const stats = await EyeStats
            .find({ email })
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        res.json({
            success: true,
            count: stats.length,
            data: stats
        });
    } catch (error) {
        console.error('❌ Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
});

// GET /api/stats/:email/summary - สรุปสถิติของผู้ใช้
router.get('/:email/summary', async (req, res) => {
    try {
        const { email } = req.params;

        const stats = await EyeStats.aggregate([
            { $match: { email } },
            {
                $group: {
                    _id: '$email',
                    totalSessions: { $sum: 1 },
                    totalDurationMinutes: { $sum: '$durationMinutes' },
                    totalBlinks: { $sum: '$blinkCount' },
                    totalAlerts: { $sum: '$alertCount' },
                    totalBreaksTaken: { $sum: '$breaksTaken' },
                    totalBreaksSkipped: { $sum: '$breaksSkipped' },
                    avgDistance: { $avg: '$averageDistanceCm' },
                    firstSession: { $min: '$timestamp' },
                    lastSession: { $max: '$timestamp' }
                }
            }
        ]);

        if (stats.length === 0) {
            return res.json({
                success: true,
                message: 'No statistics found for this user',
                data: null
            });
        }

        res.json({
            success: true,
            data: stats[0]
        });
    } catch (error) {
        console.error('❌ Error generating summary:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating summary',
            error: error.message
        });
    }
});

module.exports = router;
