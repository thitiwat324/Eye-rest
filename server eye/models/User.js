const mongoose = require('mongoose');
const { toLocalTime } = require('../utils/timezone');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// แปลง timestamp เป็น GMT+7 เมื่อ serialize JSON
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        if (ret.createdAt) ret.createdAt = toLocalTime(ret.createdAt);
        if (ret.updatedAt) ret.updatedAt = toLocalTime(ret.updatedAt);
        delete ret.password; // ไม่ให้ password ส่งทาง API
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);
