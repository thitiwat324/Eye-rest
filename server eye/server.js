require('dotenv').config();
process.env.TZ = process.env.TZ || 'Asia/Bangkok'; // ตั้ง timezone GMT+7

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const statsRoutes = require('./routes/statsRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { trigger_alert } = require('./utils/notifier');
const { toLocalTime } = require('./utils/timezone');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27018/eyerest';

// Middleware
app.use(cors()); // อนุญาตให้ Desktop App เข้าถึงได้
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    next();
});

// Routes
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'Eye-Rest API Server',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/health',
            saveStats: 'POST /api/stats',
            getStats: 'GET /api/stats/:userId',
            getSummary: 'GET /api/stats/:userId/summary'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        // Start server
        app.listen(PORT, () => {
            // Send OS notification when server starts
            trigger_alert(
                '✅ Eye-Rest Server Started',
                `Server is running on port ${PORT}`,
                { timeout: 3 }
            );
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    });

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});
