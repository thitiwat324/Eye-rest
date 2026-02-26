const express = require('express');
const router = express.Router();
const EyeStats = require('../models/EyeStats');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// GET /api/ai/advice/:email - ขอคำแนะนำจาก AI
router.get('/advice/:email', async (req, res) => {
    try {
        const { email } = req.params;

        // ดึงสถิติของ user
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
                    avgDistance: { $avg: '$averageDistanceCm' }
                }
            }
        ]);

        if (stats.length === 0) {
            return res.json({
                success: true,
                advice: req.query.lang === 'en'
                    ? 'Not enough statistics to provide advice. Please use the system for a while to gather data.'
                    : 'ไม่มีข้อมูลสถิติเพียงพอในการให้คำแนะนำ กรุณาใช้งานระบบเพื่อเก็บข้อมูลสักระยะ'
            });
        }

        const userStats = stats[0];

        // คำนวณอัตราการกระพริบตาต่อนาที (โดยเฉลี่ย)
        const blinksPerMinute = userStats.totalDurationMinutes > 0
            ? (userStats.totalBlinks / userStats.totalDurationMinutes).toFixed(2)
            : 0;

        const langInstruction = req.query.lang === 'en'
            ? 'Please provide a short, concise response (no more than 3-4 sentences) in English in a friendly and encouraging tone.'
            : 'ช่วยให้คำแนะนำสั้นๆ กระชับ (ไม่เกิน 3-4 ประโยค) เป็นภาษาไทยแบบเป็นกันเองและให้กำลังใจ';

        const prompt = `
คุณคือผู้เชี่ยวชาญด้านสุขภาพดวงตาและการยศาสตร์ (Ergonomics) ที่ให้คำปรึกษาปัญหาออฟฟิศซินโดรม
นี่คือข้อมูลสถิติการใช้งานหน้าจอของผู้ใช้รายนี้:
- เวลาใช้งานรวม: ${userStats.totalDurationMinutes} นาที
- จำนวนการกระพริบตารวม: ${userStats.totalBlinks} ครั้ง (เฉลี่ย ${blinksPerMinute} ครั้งต่อนาที)
- จำนวนครั้งที่เข้าไปใกล้หน้าจอเกินไป: ${userStats.totalAlerts} ครั้ง
- จำนวนครั้งที่พักสายตาตามเวลา: ${userStats.totalBreaksTaken} ครั้ง
- จำนวนครั้งที่ข้ามการพักสายตา: ${userStats.totalBreaksSkipped} ครั้ง
- ระยะห่างจากหน้าจอเฉลี่ย: ${userStats.avgDistance.toFixed(2)} ฟุต (เทียบเท่า cm เพื่อใช้ประเมิน)

${langInstruction} 
เพื่อช่วยเตือนหรือแนะนำวิธีปรับปรุงพฤติกรรมให้ดีขึ้น โดยดูจากสถิติที่น่าเป็นห่วงที่สุด 
(เช่น หากกระพริบตาน้อยไป, ใกล้จอเกินไปเยอะ, หรือข้ามพักบ่อย ให้เน้นตักเตือนเรื่องนั้น 
แต่ถ้าดีอยู่แล้วให้ชมเชย)
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({
            success: true,
            advice: response.text
        });

    } catch (error) {
        console.error('❌ Error generating AI advice:', error);

        // ถ้า error เป็น 429 (quota) หรือ 503 (busy) ให้ตอบกลับ friendly message แทน 500
        const isQuotaError = error?.status === 429 || (error?.message && error.message.includes('429'));
        const isUnavailable = error?.status === 503 || (error?.message && error.message.includes('503'));

        if (isQuotaError || isUnavailable) {
            const lang = req.query.lang;
            const fallback = lang === 'en'
                ? '⏳ The AI service is currently busy or has reached its daily limit. Please try again in a few minutes!'
                : '⏳ ขณะนี้ AI ให้บริการไม่ได้ชั่วคราว (โควตารายวันเต็ม) กรุณาลองใหม่ในอีกสักครู่นะครับ!';
            return res.json({ success: true, advice: fallback });
        }

        res.status(500).json({
            success: false,
            message: 'Error generating AI advice',
            error: error.message
        });
    }
});

module.exports = router;
