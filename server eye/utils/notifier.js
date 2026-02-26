const notifier = require('node-notifier');
const path = require('path');

/**
 * ฟังก์ชันแสดง OS Notification (รองรับ Windows/Mac/Linux)
 * @param {string} title - หัวข้อการแจ้งเตือน
 * @param {string} message - ข้อความการแจ้งเตือน
 * @param {Object} options - ตัวเลือกเพิ่มเติม
 */
function trigger_alert(title, message, options = {}) {
    try {
        // ตั้งค่าเริ่มต้น
        const notificationOptions = {
            title: title || 'Eye-Rest Server',
            message: message || 'Notification from Eye-Rest Server',
            icon: options.icon || path.join(__dirname, '../icon.png'), // เส้นทาง icon (ถ้ามี)
            sound: options.sound !== false, // เปิดเสียงเริ่มต้น
            wait: options.wait || false, // รอจนกว่า notification จะถูกปิด
            timeout: options.timeout || 5, // ระยะเวลาแสดง (วินาที)
            ...options // รวมตัวเลือกเพิ่มเติม
        };

        // แสดง notification
        notifier.notify(notificationOptions, (err, response, metadata) => {
            if (err) {
                console.error('❌ Error triggering notification:', err);
            }
        });



    } catch (error) {
        console.error('❌ Error in trigger_alert:', error);
    }
}

module.exports = {
    trigger_alert
};
