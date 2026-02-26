# 🔔 OS Notification System - Quick Reference

## ฟังก์ชัน trigger_alert()

ระบบแจ้งเตือนผ่าน OS Notification รองรับ **Windows**, **macOS**, และ **Linux**

---

## 📱 Client Eye (Electron)

### ใช้งานใน renderer.js

```javascript
trigger_alert('หัวข้อ', 'ข้อความ');
```

### ตัวอย่าง

```javascript
// แจ้งเตือนระยะห่าง
trigger_alert('⚠️ คำเตือน: ใกล้จอเกินไป!', 'กรุณาเลื่อนออกห่างจากจอ');

// แจ้งเตือนพักสายตา
trigger_alert('⏰ ถึงเวลาพักสายตา!', 'มองวัตถุห่างๆ 20 วินาที');
```

### ทดสอบ

เปิด Developer Console ใน Electron แล้วรัน:
```javascript
trigger_alert('ทดสอบ', 'Notification ทำงานแล้ว!');
```

---

## 🖥️ Server Eye (Node.js)

### Import

```javascript
const { trigger_alert } = require('./utils/notifier');
```

### ใช้งาน

```javascript
// พื้นฐาน
trigger_alert('หัวข้อ', 'ข้อความ');

// แบบมี options
trigger_alert('หัวข้อ', 'ข้อความ', {
    timeout: 10,      // แสดง 10 วินาที
    sound: true,      // เปิดเสียง
    icon: './icon.png' // กำหนด icon
});
```

### ตัวอย่างการใช้งาน

```javascript
// แจ้งเตือนเมื่อ server เริ่มต้น (ใส่ไว้แล้วใน server.js)
trigger_alert('✅ Server Started', `Running on port ${PORT}`);

// แจ้งเตือนเมื่อ database error
mongoose.connect(URI).catch(err => {
    trigger_alert('❌ Database Error', 'Cannot connect to MongoDB');
});

// แจ้งเตือนเมื่อ API error
app.use((err, req, res, next) => {
    trigger_alert('⚠️ API Error', err.message);
});
```

### ทดสอบ

```bash
cd "server eye"
node test-notifications.js
```

---

## ⚙️ Options (Server Only)

| Option | Type | Default | คำอธิบาย |
|--------|------|---------|----------|
| `timeout` | number | 5 | แสดงกี่วินาที |
| `sound` | boolean | true | เปิด/ปิดเสียง |
| `icon` | string | - | ไฟล์ icon |
| `wait` | boolean | false | รอให้ปิด notification |

---

## 🎯 เมื่อไหร่ควรใช้

### Client Side
- ✅ แจ้งเตือนผู้ใช้นั่งใกล้จอเกินไป
- ✅ แจ้งเตือนถึงเวลาพักสายตา
- ✅ แจ้งเตือนอัตรากะพริบตาต่ำเกินไป
- ✅ แจ้งเตือนออกจากหน้าจอนานเกินไป

### Server Side
- ✅ แจ้งเตือนเมื่อ server เริ่มต้น/หยุด
- ✅ แจ้งเตือน database connection error
- ✅ แจ้งเตือน API endpoint failures
- ✅ แจ้งเตือนเมื่อ sync data เสร็จ

---

## 🛠️ Troubleshooting

### ไม่เห็น notification?

1. **ตรวจสอบ Permission**
   - Windows: Settings > System > Notifications
   - macOS: System Preferences > Notifications
   - Linux: System Settings > Notifications

2. **ตรวจสอบ Do Not Disturb**
   - ปิด DND mode

3. **Client: ตรวจสอบ console**
   ```
   ✅ = ส่งสำเร็จ
   ⚠️ = ไม่ได้รับอนุญาต
   ❌ = มี error
   ```

4. **Server: ต้องรันบน Desktop**
   - Docker/Headless จะไม่แสดง notification

---

## 📚 เพิ่มเติม

- [Full Documentation](./walkthrough.md)
- [Client Test Script](./client%20eye/test-notifications.js)
- [Server Test Script](./server%20eye/test-notifications.js)
