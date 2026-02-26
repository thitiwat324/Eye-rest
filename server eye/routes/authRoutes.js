const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            email: user.email,
            username: user.username
        });
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            message: 'Login successful',
            email: user.email,
            username: user.username
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;
