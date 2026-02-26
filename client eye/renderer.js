const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const blinkCountDisplay = document.getElementById('blink-count');
const eyeStatusDisplay = document.getElementById('eye-status');
const distStatusDisplay = document.getElementById('dist-status');
const presenceStatusDisplay = document.getElementById('presence-status');

// Settings Elements
const cameraToggle = document.getElementById('camera-toggle');
const notificationToggle = document.getElementById('notification-toggle');
const distanceSensitivity = document.getElementById('distance-sensitivity');
const blinkSensitivity = document.getElementById('blink-sensitivity');
const alertTime = document.getElementById('alert-time');
const distanceValue = document.getElementById('distance-value');
const blinkValue = document.getElementById('blink-value');
const alertTimeValue = document.getElementById('alert-time-value');

// Timer Elements
const timerDisplay = document.getElementById('timer-display');
const timerProgress = document.getElementById('timer-progress');
const breakOverlay = document.getElementById('break-overlay');
const breakCountdown = document.getElementById('break-countdown');
const skipBreakBtn = document.getElementById('skip-break');

// Custom Timer Elements
const customWorkTime = document.getElementById('custom-work-time');
const customBreakTime = document.getElementById('custom-break-time');
const customViewingDistance = document.getElementById('custom-viewing-distance');
const customWorkValue = document.getElementById('custom-work-value');
const customBreakValue = document.getElementById('custom-break-value');
const customDistanceValue = document.getElementById('custom-distance-value');
const resetTimerBtn = document.getElementById('reset-timer-btn');
const timerWorkInfo = document.getElementById('timer-work-info');
const timerBreakInfo = document.getElementById('timer-break-info');
const timerDistanceInfo = document.getElementById('timer-distance-info');
const openTimerSettingsBtn = document.getElementById('open-timer-settings');
const closeTimerSettingsBtn = document.getElementById('close-timer-settings');
const defaultTimerBtn = document.getElementById('default-timer-btn');
const timerSettingsOverlay = document.getElementById('timer-settings-overlay');

// Alert Elements
// Alert Elements
const alertPopup = document.getElementById('alert-popup');
const soundToggle = document.getElementById('sound-toggle');
const soundFileInput = document.getElementById('sound-file');
const testSoundBtn = document.getElementById('test-sound-btn');

// Ringtone Elements
const openRingtoneBtn = document.getElementById('open-ringtone-btn');
const closeRingtonePopup = document.getElementById('close-ringtone-popup');
const ringtoneOverlay = document.getElementById('ringtone-overlay');
const ringtoneList = document.getElementById('ringtone-list');

// State Variables
let blinkCount = 0;
let closedFrameCount = 0;
let cameraActive = true;
let notificationsEnabled = true;
let cameraStream = null;
let modelsLoaded = false;
let soundEnabled = true;
let customSoundUrl = null;
let currentAudio = null;
let selectedRingtone = null; // Currently selected ringtone path

// Built-in ringtones from musicvoice directory
const builtInSounds = [
    {
        name: 'Christmas Bells',
        file: '../musicvoice/Christmas Bells Sound Effect.mp3'
    }
];

// Set default ringtone on startup
if (!customSoundUrl && builtInSounds.length > 0) {
    selectedRingtone = builtInSounds[0].file;
    customSoundUrl = builtInSounds[0].file;
}

// Distance Alert State
let tooCloseStartTime = null;
let alertShown = false;
let activeNotification = null; // Track active OS notification

// 20-20-20 Timer State (now customizable)
let WORK_DURATION = 20 * 60; // 20 minutes in seconds (default)
let BREAK_DURATION = 20; // 20 seconds (default)
let VIEWING_DISTANCE = 20; // 20 feet (default)
let workTimeElapsed = 0;
let breakTimeRemaining = BREAK_DURATION;
let isOnBreak = false;
let timerInterval = null;
let detectionInterval = null; // Track face detection interval

// Session Tracking for API
const sessionData = {
    sessionId: generateSessionId(),
    email: localStorage.getItem('email') || 'guest',       // ใช้ username เป็น key (อ่านง่าย)
    username: localStorage.getItem('username') || 'Guest',     // เหมือนกัน
    startTime: Date.now(),
    totalBlinks: 0,
    totalAlerts: 0,
    breaksTaken: 0,
    breaksSkipped: 0,
    distanceSamples: []
};

let lastSyncTime = Date.now();
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 นาที (sync บ่อยขึ้นเพื่อเห็นข้อมูลใน Compass)

// เปิดใช้งาน sessionData และ sendStatsToAPI สำหรับ auth.js
window.sessionData = sessionData;
window.sendStatsToAPI = sendStatsToAPI;

// ฟังก์ชันสร้าง Session ID
function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ฟังก์ชันส่งข้อมูลไปยัง API
async function sendStatsToAPI() {
    try {
        const durationMinutes = Math.floor((Date.now() - sessionData.startTime) / 60000);

        // คำนวณค่าเฉลี่ยระยะห่าง
        const avgDistance = sessionData.distanceSamples.length > 0
            ? sessionData.distanceSamples.reduce((a, b) => a + b, 0) / sessionData.distanceSamples.length
            : 0;

        const stats = {
            email: sessionData.email,
            username: sessionData.username,
            sessionId: sessionData.sessionId,
            timestamp: (() => {
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const d = new Date(sessionData.startTime);
                const offset = -d.getTimezoneOffset();
                const sign = offset >= 0 ? '+' : '-';
                const hh = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
                const mm = String(Math.abs(offset) % 60).padStart(2, '0');
                const localMs = d.getTime() + offset * 60 * 1000;
                return new Date(localMs).toISOString().replace('Z', `${sign}${hh}:${mm}`);
            })(),
            durationMinutes: durationMinutes,
            blinkCount: sessionData.totalBlinks,
            averageDistanceCm: Math.round(avgDistance * 2.54), // แปลง pixels เป็น cm โดยประมาณ
            alertCount: sessionData.totalAlerts,
            breaksTaken: sessionData.breaksTaken,
            breaksSkipped: sessionData.breaksSkipped
        };


        const serverUrl = 'http://localhost:3000';
        const response = await fetch(`${serverUrl}/api/stats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stats)
        });

        if (response.ok) {
            const result = await response.json();

            // Reset session data for next period
            sessionData.sessionId = generateSessionId();
            sessionData.startTime = Date.now();
            sessionData.distanceSamples = [];
            lastSyncTime = Date.now();
        } else {
            const error = await response.text();
            console.error('❌ Failed to send stats:', response.status, error);
        }
    } catch (error) {
        console.error('❌ Error sending stats to API:', error.message);
        // ไม่ต้อง throw error เพราะไม่ต้องการให้แอปหยุดทำงาน
    }
}

// Settings Values
let distanceThreshold = 200; // ระยะห่าง (pixels)
let blinkThreshold = 0.25; // Eye Aspect Ratio threshold
let alertDelay = 5; // seconds

// Update slider displays
distanceValue.textContent = distanceThreshold;
distanceSensitivity.value = distanceThreshold;
distanceSensitivity.min = "50";
distanceSensitivity.max = "200";
distanceSensitivity.step = "10";

// ฟังก์ชันคำนวณ EAR (Eye Aspect Ratio)
function getEAR(eye) {
    // คำนวณระยะแนวตั้ง
    const A = Math.hypot(eye[1].x - eye[5].x, eye[1].y - eye[5].y);
    const B = Math.hypot(eye[2].x - eye[4].x, eye[2].y - eye[4].y);
    // คำนวณระยะแนวนอน
    const C = Math.hypot(eye[0].x - eye[3].x, eye[0].y - eye[3].y);
    // EAR = (A + B) / (2 * C)
    return (A + B) / (2.0 * C);
}

// ฟังก์ชันแสดง Alert Popup
function showAlert() {
    if (!notificationsEnabled || alertShown) return;
    console.warn('⚠️ PROXIMITY ALERT: User too close to screen!');
    alertPopup.classList.add('show');
    alertShown = true;

    // Play sound if enabled and available
    if (soundEnabled && customSoundUrl) {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        currentAudio = new Audio(customSoundUrl);
        currentAudio.play().catch(e => console.error('Error playing sound:', e));
    }

    // Trigger OS notification
    trigger_alert('⚠️ คำเตือน: ใกล้จอเกินไป!', 'กรุณาเลื่อนออกห่างจากจอคอมพิวเตอร์');

    // Track alert
    sessionData.totalAlerts++;

    setTimeout(() => {
        alertPopup.classList.remove('show');
    }, 5000);
}

/**
 * ฟังก์ชันแสดง OS Notification (รองรับ Windows/Mac/Linux)
 * @param {string} title - หัวข้อการแจ้งเตือน
 * @param {string} message - ข้อความการแจ้งเตือน
 */
function trigger_alert(title, message) {
    try {
        // ตรวจสอบว่า Browser รองรับ Notification API หรือไม่
        if (!('Notification' in window)) {
            console.error('❌ Browser does not support notifications');
            return;
        }

        // ตรวจสอบสิทธิ์การแจ้งเตือน
        if (Notification.permission === 'granted') {
            // ปิด notification เก่าถ้ามี
            if (activeNotification) {
                activeNotification.close();
            }

            // สร้างการแจ้งเตือน
            activeNotification = new Notification(title, {
                body: message,
                // icon: './icon.png', // เพิ่มเมื่อมีไฟล์ icon
                // badge: './badge.png', // เพิ่มเมื่อมีไฟล์ badge
                requireInteraction: false, // ให้ notification หายไปเองหลังไม่กี่วินาที
                silent: soundEnabled ? false : true, // ปิดเสียงถ้า soundEnabled = false
                tag: 'eye-rest-alert', // ป้องกัน notification ซ้ำซ้อน
                vibrate: [200, 100, 200], // สั่นเบาๆ (ถ้ารองรับ)
                renotify: true, // แจ้งเตือนซ้ำแม้มี tag เดิม
            });

            // Event เมื่อคลิกที่การแจ้งเตือน
            activeNotification.onclick = () => {
                window.focus(); // โฟกัสที่หน้าต่างแอป
                activeNotification.close();
                activeNotification = null;
            };

            // Event เมื่อ notification ถูกปิด
            activeNotification.onclose = () => {
                activeNotification = null;
            };

            // Log status
        } else if (Notification.permission !== 'denied') {
            // ขอสิทธิ์ในการแจ้งเตือน
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    trigger_alert(title, message); // เรียกใช้ซ้ำหลังได้สิทธิ์
                } else {
                    console.warn('⚠️ Notification permission denied');
                }
            });
        } else {
            console.warn('⚠️ Notifications are blocked');
        }
    } catch (error) {
        console.error('❌ Error triggering notification:', error);
    }
}

// ฟังก์ชันเริ่ม Break
function startBreak() {
    if (!notificationsEnabled || isOnBreak) return;

    isOnBreak = true;
    breakTimeRemaining = BREAK_DURATION;

    // Update break message with custom viewing distance
    const breakMessage = document.querySelector('.notification-message');
    const feetToMeters = (VIEWING_DISTANCE * 0.3048).toFixed(1);
    breakMessage.innerHTML = `${getT('break_msg_1', 'ตามกฎ 20-20-20<br>มองไปที่วัตถุระยะ')} ${VIEWING_DISTANCE} ${getT('break_msg_2', 'ฟุต')} (${feetToMeters} ${getT('break_msg_3', 'เมตร)<br>เป็นเวลา')} ${BREAK_DURATION} ${getT('unit_sec', 'วินาที')}`;

    breakOverlay.classList.add('show');

    // Trigger OS notification for break time
    trigger_alert(
        '⏰ ถึงเวลาพักสายตา!',
        `มองวัตถุระยะ ${VIEWING_DISTANCE} ฟุต (${feetToMeters} เมตร) เป็นเวลา ${BREAK_DURATION} วินาที`
    );

    // Track break start
    sessionData.breaksTaken++;

    const breakInterval = setInterval(() => {
        breakTimeRemaining--;
        breakCountdown.textContent = breakTimeRemaining;

        if (breakTimeRemaining <= 0) {
            clearInterval(breakInterval);
            endBreak();
        }
    }, 1000);
}

// ฟังก์ชันจบ Break
function endBreak() {
    isOnBreak = false;
    breakOverlay.classList.remove('show');
    workTimeElapsed = 0;
    updateTimerDisplay();
}

// ฟังก์ชันอัพเดท Timer Display
function updateTimerDisplay() {
    const remainingSeconds = WORK_DURATION - workTimeElapsed;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const progress = (workTimeElapsed / WORK_DURATION) * 100;
    timerProgress.style.width = `${progress}%`;
}

// เริ่ม Timer
function startTimer() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        if (!isOnBreak && cameraActive) {
            workTimeElapsed++;
            updateTimerDisplay();

            if (workTimeElapsed >= WORK_DURATION) {
                startBreak();
            }

            // Auto-sync every hour
            if (Date.now() - lastSyncTime >= SYNC_INTERVAL) {
                sendStatsToAPI();
            }
        }
    }, 1000);
}

// โหลด face-api.js models
async function loadModels() {
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        modelsLoaded = true;
        return true;
    } catch (error) {
        console.error('❌ Error loading models:', error);
        alert('ไม่สามารถโหลด Face Detection models ได้\nกรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
        return false;
    }
}

// ฟังก์ชันตรวจจับใบหน้า
async function detectFace() {
    if (!cameraActive || !modelsLoaded || videoElement.readyState !== 4) {
        return;
    }

    try {
        const detections = await faceapi
            .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks();

        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

        if (detections) {
            const landmarks = detections.landmarks;
            const box = detections.detection.box;

            // วาด landmarks
            canvasCtx.fillStyle = '#00ffcc';
            landmarks.positions.forEach(point => {
                canvasCtx.beginPath();
                canvasCtx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
                canvasCtx.fill();
            });

            // Update presence status - user is at screen
            presenceStatusDisplay.innerText = getT('presence_active', "อยู่หน้าจอ");
            presenceStatusDisplay.className = "stat-value";

            // 1. Distance Detection (ใช้ความกว้างของกล่อง bounding box)
            const faceWidth = box.width;

            // Track distance sample
            sessionData.distanceSamples.push(faceWidth);

            const currentTime = Date.now();

            if (faceWidth > distanceThreshold) {
                distStatusDisplay.innerText = getT('status_too_close', "ใกล้เกินไป!");
                distStatusDisplay.className = "stat-value danger";

                if (!tooCloseStartTime) {
                    tooCloseStartTime = currentTime;
                }

                const tooCloseDuration = (currentTime - tooCloseStartTime) / 1000;

                if (tooCloseDuration >= alertDelay) {
                    showAlert();
                }
            } else {
                distStatusDisplay.innerText = getT('status_ok', "OK");
                distStatusDisplay.className = "stat-value";
                tooCloseStartTime = null;
                alertShown = false;

                // ปิด OS notification เมื่อผู้ใช้อยู่ในระยะปลอดภัยแล้ว
                if (activeNotification) {
                    activeNotification.close();
                    activeNotification = null;
                }
            }

            // 2. Blink Detection
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();

            const leftEAR = getEAR(leftEye);
            const rightEAR = getEAR(rightEye);
            const avgEAR = (leftEAR + rightEAR) / 2.0;


            if (avgEAR < blinkThreshold) {
                eyeStatusDisplay.innerText = getT('status_inactive', "ปิด");
                eyeStatusDisplay.className = "stat-value warning";
                closedFrameCount++;
            } else {
                eyeStatusDisplay.innerText = getT('status_active', "เปิด");
                eyeStatusDisplay.className = "stat-value";

                if (closedFrameCount > 2 && closedFrameCount < 15) {
                    blinkCount++;
                    blinkCountDisplay.innerText = blinkCount;
                    sessionData.totalBlinks++; // Track in session
                }
                closedFrameCount = 0;
            }
        } else {
            // No face detected - user is away from screen
            presenceStatusDisplay.innerText = getT('presence_inactive', "ไม่อยู่หน้าจอ");
            presenceStatusDisplay.className = "stat-value warning";
        }
    } catch (error) {
        console.error('Error in face detection:', error);
    }
}

// ฟังก์ชันเริ่มการตรวจจับใบหน้าด้วย setInterval (ทำงานต่อเนื่องแม้ minimize)
function startDetection() {
    if (detectionInterval) return;

    detectionInterval = setInterval(detectFace, 100); // 10 FPS - ใช้ทรัพยากรน้อยกว่า 60 FPS
}

// ฟังก์ชันหยุดการตรวจจับใบหน้า
function stopDetection() {
    if (detectionInterval) {
        clearInterval(detectionInterval);
        detectionInterval = null;
    }
}

// เริ่มกล้อง
async function startCamera() {
    if (cameraStream) return; // Prevent multiple streams


    // โหลด models ก่อน
    if (!modelsLoaded) {
        const loaded = await loadModels();
        if (!loaded) return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
        });
        cameraStream = stream;
        videoElement.srcObject = stream;

        videoElement.addEventListener('loadeddata', async () => {
            await videoElement.play();
            startDetection(); // เริ่ม detection interval
            startTimer();
        });
    } catch (err) {
        console.error('❌ Error accessing camera:', err);
        alert('ไม่สามารถเข้าถึงกล้องได้: ' + err.message);
    }
}

// ฟังก์ชันหยุดกล้อง
function stopCamera() {
    stopDetection(); // หยุด detection interval
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        videoElement.srcObject = null;
    }
}

// Event Listeners

// Camera Toggle
cameraToggle.addEventListener('click', () => {
    cameraActive = !cameraActive;

    if (cameraActive) {
        cameraToggle.textContent = getT('camera_on', '🎥 กล้องเปิดอยู่');
        cameraToggle.classList.remove('off');
        if (!cameraStream) {
            startCamera();
        }
    } else {
        cameraToggle.textContent = getT('camera_off', '🎥 กล้องปิดอยู่');
        cameraToggle.classList.add('off');
        stopCamera();
    }
});

// Notification Toggle
notificationToggle.addEventListener('click', () => {
    notificationsEnabled = !notificationsEnabled;

    if (notificationsEnabled) {
        notificationToggle.textContent = getT('noti_on', '🔔 เปิดการแจ้งเตือน');
        notificationToggle.classList.remove('off');
    } else {
        notificationToggle.textContent = getT('noti_off', '🔕 ปิดการแจ้งเตือน');
        notificationToggle.classList.add('off');
    }
});

// Distance Sensitivity Slider
distanceSensitivity.addEventListener('input', (e) => {
    distanceThreshold = parseInt(e.target.value);
    distanceValue.textContent = distanceThreshold;
});

// Blink Sensitivity Slider
blinkSensitivity.addEventListener('input', (e) => {
    blinkThreshold = parseFloat(e.target.value);
    blinkValue.textContent = blinkThreshold.toFixed(2);
});

// Alert Time Slider
alertTime.addEventListener('input', (e) => {
    alertDelay = parseInt(e.target.value);
    alertTimeValue.textContent = alertDelay;
});

// Skip Break Button
skipBreakBtn.addEventListener('click', () => {
    sessionData.breaksSkipped++;
    sessionData.breaksTaken--; // ลบออกเพราะไม่ได้พักจริง
    endBreak();
});

// Sound Alert Logic
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
        soundToggle.textContent = getT('sound_on', '🔊 เปิดเสียงแจ้งเตือน');
        soundToggle.classList.remove('off');
    } else {
        soundToggle.textContent = getT('sound_off', '🔇 ปิดเสียงแจ้งเตือน');
        soundToggle.classList.add('off');
    }
});

soundFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (customSoundUrl) {
            URL.revokeObjectURL(customSoundUrl);
        }
        customSoundUrl = URL.createObjectURL(file);
        testSoundBtn.style.background = '#00d4ff'; // Highlight test button
        testSoundBtn.style.color = '#1a1a2e';
    }
});

testSoundBtn.addEventListener('click', () => {
    if (customSoundUrl) {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        currentAudio = new Audio(customSoundUrl);
        currentAudio.play().catch(e => console.error('Error playing test sound:', e));
    } else {
        alert('กรุณาเลือกไฟล์เสียงก่อนทดสอบ');
    }
});

// Ringtone Selection Logic
function populateRingtoneList() {
    ringtoneList.innerHTML = '';

    builtInSounds.forEach((sound, index) => {
        const item = document.createElement('div');
        item.style.cssText = `
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid ${selectedRingtone === sound.file ? '#667eea' : 'rgba(255, 255, 255, 0.1)'};
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        item.innerHTML = `
            <div style="flex: 1;">
                <div style="font-weight: 600; color: #fff; margin-bottom: 5px;">${sound.name}</div>
                <div style="font-size: 0.85em; color: #aaa;">${selectedRingtone === sound.file ? getT('ringtone_selected', '✅ เลือกแล้ว') : getT('ringtone_click_to_select', 'คลิกเพื่อเลือก')}</div>
            </div>
            <button class="notification-btn" style="padding: 8px 15px; font-size: 0.9em;">${getT('ringtone_play', '▶️ ฟัง')}</button>
        `;

        // Preview button
        const previewBtn = item.querySelector('button');
        previewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            previewSound(sound.file);
        });

        // Select ringtone on click
        item.addEventListener('click', () => {
            selectedRingtone = sound.file;
            customSoundUrl = sound.file;
            populateRingtoneList(); // Refresh to show selection
        });

        ringtoneList.appendChild(item);
    });
}

function previewSound(soundPath) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = new Audio(soundPath);
    currentAudio.play().catch(e => console.error('Error playing preview:', e));
}

openRingtoneBtn.addEventListener('click', () => {
    populateRingtoneList();
    ringtoneOverlay.classList.add('show');
});

closeRingtonePopup.addEventListener('click', () => {
    ringtoneOverlay.classList.remove('show');
});

// Custom Timer Settings
customWorkTime.addEventListener('input', (e) => {
    const minutes = parseInt(e.target.value);
    WORK_DURATION = minutes * 60;
    customWorkValue.textContent = minutes;
    timerWorkInfo.textContent = `${minutes} ${getT('unit_min', 'นาที')}`;
});

customBreakTime.addEventListener('input', (e) => {
    const seconds = parseInt(e.target.value);
    BREAK_DURATION = seconds;
    customBreakValue.textContent = seconds;
    timerBreakInfo.textContent = `${seconds} ${getT('unit_sec', 'วินาที')}`;
});

customViewingDistance.addEventListener('input', (e) => {
    const feet = parseInt(e.target.value);
    VIEWING_DISTANCE = feet;
    customDistanceValue.textContent = feet;
    timerDistanceInfo.textContent = `${feet} ${getT('unit_foot', 'ฟุต')}`;
});

resetTimerBtn.addEventListener('click', () => {
    workTimeElapsed = 0;
    if (isOnBreak) {
        endBreak();
    }
    updateTimerDisplay();
});

// Timer Settings Popup
openTimerSettingsBtn.addEventListener('click', () => {
    timerSettingsOverlay.classList.add('show');
});

closeTimerSettingsBtn.addEventListener('click', () => {
    timerSettingsOverlay.classList.remove('show');
});

// Default Timer Button (Reset to 20-20-20)
defaultTimerBtn.addEventListener('click', () => {

    // Reset to default values
    WORK_DURATION = 20 * 60;
    BREAK_DURATION = 20;
    VIEWING_DISTANCE = 20;

    // Update sliders
    customWorkTime.value = 20;
    customBreakTime.value = 20;
    customViewingDistance.value = 20;

    // Update display values
    customWorkValue.textContent = 20;
    customBreakValue.textContent = 20;
    customDistanceValue.textContent = 20;

    // Update timer info
    timerWorkInfo.textContent = `20 ${getT('unit_min', 'นาที')}`;
    timerBreakInfo.textContent = `20 ${getT('unit_sec', 'วินาที')}`;
    timerDistanceInfo.textContent = `20 ${getT('unit_foot', 'ฟุต')}`;

});

// Start application

window.startCamera = startCamera;
window.stopCamera = stopCamera;

// เริ่มต้นกล้องเฉพาะเมื่อผู้ใช้ล็อกอินแล้ว
function initCameraIfLoggedIn() {
    if (localStorage.getItem('email')) {
        startCamera();
    }
}

// รอให้ face-api.js โหลดเสร็จก่อน
if (typeof faceapi !== 'undefined') {
    initCameraIfLoggedIn();
} else {
    window.addEventListener('load', () => {
        setTimeout(initCameraIfLoggedIn, 500);
    });
}

// AI Advisor Logic
const getAiAdviceBtn = document.getElementById('get-ai-advice-btn');
const aiAdviceContent = document.getElementById('ai-advice-content');

getAiAdviceBtn.addEventListener('click', async () => {
    // ต้องแน่ใจว่าได้อัปเดตสถิติล่าสุดไปที่ server ก่อนขอคำแนะนำ
    await sendStatsToAPI();

    const email = sessionData.email;
    aiAdviceContent.innerHTML = `<span style="color: #00d4ff;">${getT('ai_analyzing', 'กำลังวิเคราะห์ข้อมูล... ⏳')}</span>`;
    getAiAdviceBtn.disabled = true;

    try {
        const serverUrl = 'http://localhost:3000';
        const response = await axios.get(`${serverUrl}/api/ai/advice/${email}?lang=${currentLang}`);

        if (response.data && response.data.success) {
            aiAdviceContent.innerHTML = `<strong>${getT('ai_advice_prefix', '💡 คำแนะนำ:')}</strong> ${response.data.advice}`;
        } else {
            aiAdviceContent.innerHTML = `<span style="color: #ff4444;">${getT('ai_error', 'ไม่สามารถดึงคำแนะนำจาก AI ได้ในขณะนี้')}</span>`;
        }
    } catch (error) {
        console.error('❌ Error fetching AI advice:', error);
        aiAdviceContent.innerHTML = `<span style="color: #ff4444;">${getT('ai_network_error', 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์')}</span>`;
    } finally {
        getAiAdviceBtn.disabled = false;
    }
});

// Send stats before closing
window.addEventListener('beforeunload', (e) => {
    sendStatsToAPI();
});

// -------------------------------------------------------------
// Translation Helpers & Event Listener
// -------------------------------------------------------------
function getT(key, defaultStr) {
    if (typeof translations !== 'undefined' && typeof currentLang !== 'undefined' && translations[currentLang] && translations[currentLang][key]) {
        return translations[currentLang][key];
    }
    return defaultStr;
}

function applyLanguageToRenderer() {
    // 1. Refresh Dynamic info
    const minutes = Math.floor(WORK_DURATION / 60);
    timerWorkInfo.textContent = `${minutes} ${getT('unit_min', 'นาที')}`;
    timerBreakInfo.textContent = `${BREAK_DURATION} ${getT('unit_sec', 'วินาที')}`;
    timerDistanceInfo.textContent = `${VIEWING_DISTANCE} ${getT('unit_foot', 'ฟุต')}`;

    // 2. Refresh Toggles
    cameraToggle.textContent = cameraActive ? getT('camera_on', '🎥 กล้องเปิดอยู่') : getT('camera_off', '🎥 กล้องปิดอยู่');
    notificationToggle.textContent = notificationsEnabled ? getT('noti_on', '🔔 เปิดการแจ้งเตือน') : getT('noti_off', '🔕 ปิดการแจ้งเตือน');
    soundToggle.textContent = soundEnabled ? getT('sound_on', '🔊 เปิดเสียงแจ้งเตือน') : getT('sound_off', '🔇 ปิดเสียงแจ้งเตือน');

    // 3. Refresh Status Flags if not initial state Let's just blindly refresh based on their current classes or state vars
    if (presenceStatusDisplay.innerText !== "Guest" && presenceStatusDisplay.innerText !== "Active") {
        presenceStatusDisplay.innerText = presenceStatusDisplay.classList.contains('warning') ? getT('presence_inactive', 'ไม่อยู่หน้าจอ') : getT('presence_active', 'อยู่หน้าจอ');
    }

    if (distStatusDisplay.innerText !== "OK" && distStatusDisplay.innerText !== "OK") {
        distStatusDisplay.innerText = distStatusDisplay.classList.contains('danger') ? getT('status_too_close', 'ใกล้เกินไป!') : getT('status_ok', 'OK');
    } else {
        distStatusDisplay.innerText = getT('status_ok', 'OK');
    }

    if (eyeStatusDisplay.innerText !== "Active") {
        eyeStatusDisplay.innerText = eyeStatusDisplay.classList.contains('warning') ? getT('status_inactive', 'ปิด') : getT('status_active', 'เปิด');
    }

    if (isOnBreak) {
        const breakMessage = document.querySelector('.notification-message');
        const feetToMeters = (VIEWING_DISTANCE * 0.3048).toFixed(1);
        breakMessage.innerHTML = `${getT('break_msg_1', 'ตามกฎ 20-20-20<br>มองไปที่วัตถุระยะ')} ${VIEWING_DISTANCE} ${getT('break_msg_2', 'ฟุต')} (${feetToMeters} ${getT('break_msg_3', 'เมตร)<br>เป็นเวลา')} ${BREAK_DURATION} ${getT('unit_sec', 'วินาที')}`;
    }

    // Update AI Advice Button if exists
    const aiAdviceContent = document.getElementById('ai-advice-content');
    if (aiAdviceContent) {
        if (aiAdviceContent.innerText.includes('⏳')) {
            aiAdviceContent.innerHTML = `<span style="color: #00d4ff;">${getT('ai_analyzing', 'กำลังวิเคราะห์ข้อมูล... ⏳')}</span>`;
        } else if (aiAdviceContent.querySelector('strong')) {
            // Keep the previous advice but change the prefix using the strong tag
            const strongTag = aiAdviceContent.querySelector('strong');
            strongTag.innerText = getT('ai_advice_prefix', '💡 คำแนะนำ:');
        } else if (aiAdviceContent.innerText.includes('AI') && aiAdviceContent.innerText.includes('"')) {
            aiAdviceContent.innerHTML = getT('ai_advice_desc', 'กดปุ่ม "ขอคำแนะนำ" เพื่อให้ AI วิเคราะห์สถิติการใช้งานของคุณ');
        } else if (aiAdviceContent.innerText.includes('เซิร์ฟเวอร์') || aiAdviceContent.innerText.includes('server')) {
            aiAdviceContent.innerHTML = `<span style="color: #ff4444;">${getT('ai_network_error', 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์')}</span>`;
        } else if (aiAdviceContent.innerText.includes('ดึง') || aiAdviceContent.innerText.includes('Unable')) {
            aiAdviceContent.innerHTML = `<span style="color: #ff4444;">${getT('ai_error', 'ไม่สามารถดึงคำแนะนำจาก AI ได้ในขณะนี้')}</span>`;
        }
    }

    // Refresh Ringtone List
    populateRingtoneList();
}

window.addEventListener('languageChanged', applyLanguageToRenderer);

// Initialize text strings safely on start
setTimeout(applyLanguageToRenderer, 100);
