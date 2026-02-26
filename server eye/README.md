# Backend Server Setup Guide

## ขั้นตอนการติดตั้ง

### 1. ติดตั้ง MongoDB (Local)

**Windows:**
1. ดาวน์โหลด MongoDB Community Server จาก: https://www.mongodb.com/try/download/community
2. ติดตั้งและเลือก "Complete" installation
3. เลือก "Run service as Network Service user"
4. เปิด MongoDB Compass (GUI tool) หรือใช้ command line

**หรือใช้ MongoDB Atlas (Cloud - ฟรี 512MB):**
1. สมัครที่ https://cloud.mongodb.com
2. สร้าง free cluster
3. แก้ไข `.env` file ให้ใช้ connection string จาก Atlas

### 2. ติดตั้ง Dependencies สำหรับ Server

```bash
cd "server eye"
npm install
```

### 3. เริ่มต้น MongoDB (ถ้าใช้ local)

**Windows:**
```bash
# MongoDB จะเริ่มอัตโนมัติถ้าติดตั้งแบบ service
# หรือเริ่มด้วยตัวเอง:
mongod
```

### 4. เริ่ม API Server

```bash
cd "server eye"
npm start
```

คุณควรเห็น:
```
✅ Connected to MongoDB successfully
🚀 Eye-Rest API Server is running
📡 Server: http://localhost:3000
```

### 5. เริ่ม Client App

เปิด terminal ใหม่:
```bash
cd "client eye"
npm start
```

## การทดสอบ API

### ทดสอบด้วย Browser
เปิด: http://localhost:3000

### ทดสอบด้วย curl (PowerShell)
```powershell
# Health check
curl http://localhost:3000/health

# Send test stats
curl -Method POST -Uri http://localhost:3000/api/stats `
  -ContentType "application/json" `
  -Body '{"userId":"user_001","sessionId":"test123","timestamp":"2024-01-01T00:00:00Z","durationMinutes":30,"blinkCount":150,"averageDistanceCm":60,"alertCount":2,"breaksTaken":1,"breaksSkipped":0}'

# Get user stats
curl http://localhost:3000/api/stats/user_001

# Get summary
curl http://localhost:3000/api/stats/user_001/summary
```

## โครงสร้างข้อมูล

ข้อมูลที่เก็บใน MongoDB:
```javascript
{
  userId: "user_001",
  sessionId: "session_1234567890_abc123",
  timestamp: "2024-01-01T10:30:00Z",
  durationMinutes: 45,
  blinkCount: 200,
  averageDistanceCm: 55,
  alertCount: 3,
  breaksTaken: 2,
  breaksSkipped: 1
}
```

## การใช้งาน

1. เปิด API Server (`npm start` ใน `server eye/`)
2. เปิด Client App (`npm start` ใน `client eye/`)
3. ใช้งานแอปตามปกติ
4. ข้อมูลจะถูกส่งไปยัง server:
   - ทุก 1 ชั่วโมง (auto-sync)
   - เมื่อปิดแอป

## ตรวจสอบข้อมูลใน MongoDB

**MongoDB Compass:**
1. เปิด MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. เลือก database: `eyerest`
4. เลือก collection: `eyestats`

**Command Line:**
```bash
mongosh
use eyerest
db.eyestats.find().pretty()
```

## ปัญหาที่พบบ่อย

**MongoDB ไม่ทำงาน:**
- ตรวจสอบว่า MongoDB service เริ่มแล้ว
- ลองรัน `mongod` ใน terminal

**API Server ไม่ทำงาน:**
- ตรวจสอบ port 3000 ว่าว่างหรือไม่
- ดู error log ใน console

**Client ไม่ส่งข้อมูล:**
- เปิด DevTools ใน Electron app
- ดู console log ว่ามี error อะไร
- ตรวจสอบว่า API server ทำงานอยู่
