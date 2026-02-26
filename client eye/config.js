// API Configuration
const API_CONFIG = {
    baseUrl: 'http://localhost:3000',
    enabled: true // ตั้งเป็น false ถ้าไม่ต้องการส่งข้อมูล
};

// User Configuration (อ่านจาก localStorage ที่ถูกเซฟตอน login)
const USER_CONFIG = {
    get userId() { return localStorage.getItem('userId') || 'guest'; },
    get username() { return localStorage.getItem('username') || 'Guest'; },
    syncInterval: 60 * 60 * 1000 // 1 hour in milliseconds
};

module.exports = { API_CONFIG, USER_CONFIG };
