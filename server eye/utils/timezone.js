/**
 * แปลง Date เป็น ISO string พร้อม timezone offset จริงจาก process.env.TZ
 * ไม่มี hardcode — offset อ่านจาก Node.js runtime ที่ตั้ง TZ=Asia/Bangkok ไว้ใน .env
 * @param {Date|string|number} date
 * @returns {string} e.g. "2026-02-23T10:48:42.000+07:00"
 */
function toLocalTime(date) {
    if (!date) return null;
    const d = new Date(date);

    // getTimezoneOffset() คืนค่า offset เทียบ UTC เป็น minutes (negative = ahead of UTC)
    // เมื่อ TZ=Asia/Bangkok Node.js จะคืน -420 (= UTC+7)
    const offsetMinutes = -d.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absMin = Math.abs(offsetMinutes);
    const hh = String(Math.floor(absMin / 60)).padStart(2, '0');
    const mm = String(absMin % 60).padStart(2, '0');
    const offsetStr = `${sign}${hh}:${mm}`;

    // Shift time value to local and format as ISO
    const localMs = d.getTime() + offsetMinutes * 60 * 1000;
    const local = new Date(localMs);
    return local.toISOString().replace('Z', offsetStr);
}

module.exports = { toLocalTime };
