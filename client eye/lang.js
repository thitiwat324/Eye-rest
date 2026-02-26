const translations = {
    th: {
        app_title: "👁️ ระบบจัดท่านั่งและแจ้งเตือน",
        app_subtitle: "ผู้ช่วย AI ดูแลสุขภาพตาและท่านั่งของคุณ",
        login_title: "เข้าสู่ระบบ",
        login_error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        label_email: "อีเมล",
        label_password: "รหัสผ่าน",
        placeholder_email: "กรอกอีเมลของคุณ",
        placeholder_password: "กรอกรหัสผ่านของคุณ",
        btn_signin: "เข้าสู่ระบบ",
        switch_to_register: "ยังไม่มีบัญชีใช่หรือไม่? <a id=\"show-register-btn\" style=\"cursor:pointer; color:#00d4ff;\">ลงทะเบียนที่นี่</a>",
        register_title: "ลงทะเบียน",
        register_error: "เกิดข้อผิดพลาดในการลงทะเบียน",
        label_username: "ชื่อผู้ใช้",
        placeholder_username: "ตั้งชื่อผู้ใช้ของคุณ",
        btn_register: "สร้างบัญชี",
        switch_to_login: "มีบัญชีอยู่แล้วใช่หรือไม่? <a id=\"show-login-btn\" style=\"cursor:pointer; color:#00d4ff;\">เข้าสู่ระบบที่นี่</a>",
        stat_blink: "การกระพริบตา",
        stat_eye: "สถานะดวงตา",
        stat_dist: "ระยะห่าง",
        stat_user: "สถานะผู้ใช้",
        stat_logged_in: "เข้าสู่ระบบเป็น",
        btn_logout: "ออกจากระบบ",
        ai_advisor_title: "🤖 ผู้ช่วย AI",
        btn_ai_advice: "✨ ขอคำแนะนำ",
        ai_advice_desc: "กดปุ่ม \"ขอคำแนะนำ\" เพื่อให้ AI วิเคราะห์สถิติการใช้งานของคุณ",
        settings_title: "⚙️ การตั้งค่า",
        setting_camera: "กล้อง",
        setting_dist_sens: "ความไวการตรวจจับระยะ",
        setting_blink_sens: "ความไวการกระพริบตา",
        setting_alert_time: "เวลาแจ้งเตือนใกล้เกินไป (วินาที)",
        setting_notification: "การแจ้งเตือน",
        setting_sound: "เสียงแจ้งเตือน",
        btn_test_sound: "▶️ ทดสอบเสียง",
        btn_ringtone: "🎵 Ringtone",
        setting_20_20_20: "⏰ กำหนดเวลา 20-20-20",
        btn_setting_20_20_20: "🕐 ตั้งค่ากฎ 20-20-20",
        timer_title: "⏱️ 20-20-20 Rule Timer",
        timer_work: "⏱️ ทำงาน:",
        timer_break: "☕ พัก:",
        timer_dist: "👀 ระยะมอง:",
        alert_warning: "⚠️ คำเตือน!",
        alert_too_close: "คุณนั่งใกล้จอเกินไป กรุณาถอยหลังออกมา",
        break_title: "ถึงเวลาพักสายตา!",
        break_desc: "ตามกฎ 20-20-20<br>มองไปที่วัตถุระยะ 20 ฟุต (6 เมตร)<br>เป็นเวลา 20 วินาที",
        btn_skip_break: "ข้ามการพัก",
        timer_settings_title: "ตั้งค่ากฎ 20-20-20",
        setting_work_time: "⏱️ เวลาทำงาน (นาที)",
        setting_break_time: "☕ เวลาพัก (วินาที)",
        setting_view_dist: "👀 ระยะมอง (ฟุต)",
        btn_reset: "🔄 รีเซ็ต",
        btn_default: "🔙 ค่าเดิม",
        btn_ok: "✅ ตกลง",
        ringtone_title: "เลือกเสียงแจ้งเตือน",
        btn_close: "✅ ปิด",
        unit_min: "นาที",
        unit_sec: "วินาที",
        unit_foot: "ฟุต",
        camera_on: "🎥 กล้องเปิดอยู่",
        camera_off: "🎥 กล้องปิดอยู่",
        noti_on: "🔔 เปิดการแจ้งเตือน",
        noti_off: "🔕 ปิดการแจ้งเตือน",
        sound_on: "🔊 เปิดเสียงแจ้งเตือน",
        sound_off: "🔇 ปิดเสียงแจ้งเตือน",
        status_active: "เปิด",
        status_inactive: "ปิด",
        status_too_close: "ใกล้เกินไป!",
        status_ok: "OK",
        presence_active: "อยู่หน้าจอ",
        presence_inactive: "ไม่อยู่หน้าจอ",
        ai_analyzing: "กำลังวิเคราะห์ข้อมูล... ⏳",
        ai_advice_prefix: "💡 คำแนะนำ:",
        ai_error: "ไม่สามารถดึงคำแนะนำจาก AI ได้ในขณะนี้",
        ai_network_error: "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์",
        break_msg_1: "ตามกฎ 20-20-20<br>มองไปที่วัตถุระยะ",
        break_msg_2: "ฟุต",
        break_msg_3: "เมตร)<br>เป็นเวลา",
        ringtone_selected: "✅ เลือกแล้ว",
        ringtone_click_to_select: "คลิกเพื่อเลือก",
        ringtone_play: "▶️ ฟัง"
    },
    en: {
        app_title: "👁️ Eye-Rest Monitor",
        app_subtitle: "AI-Powered Eye Health & Posture Guardian",
        login_title: "Login",
        login_error: "Incorrect email or password",
        label_email: "Email",
        label_password: "Password",
        placeholder_email: "Enter your email",
        placeholder_password: "Enter your password",
        btn_signin: "Sign In",
        switch_to_register: "Don't have an account? <a id=\"show-register-btn\" style=\"cursor:pointer; color:#00d4ff;\">Register here</a>",
        register_title: "Register",
        register_error: "Error registering account",
        label_username: "Username",
        placeholder_username: "Choose a username",
        btn_register: "Create Account",
        switch_to_login: "Already have an account? <a id=\"show-login-btn\" style=\"cursor:pointer; color:#00d4ff;\">Login here</a>",
        stat_blink: "Blink Count",
        stat_eye: "Eye Status",
        stat_dist: "Distance",
        stat_user: "User Status",
        stat_logged_in: "Logged in as",
        btn_logout: "Logout",
        ai_advisor_title: "🤖 AI Advisor",
        btn_ai_advice: "✨ Get Advice",
        ai_advice_desc: "Click \"Get Advice\" to let AI analyze your usage statistics.",
        settings_title: "⚙️ Settings",
        setting_camera: "Camera",
        setting_dist_sens: "Distance Sensitivity",
        setting_blink_sens: "Blink Sensitivity",
        setting_alert_time: "Too Close Alert Time (sec)",
        setting_notification: "Notifications",
        setting_sound: "Alert Sound",
        btn_test_sound: "▶️ Test Sound",
        btn_ringtone: "🎵 Ringtone",
        setting_20_20_20: "⏰ 20-20-20 Rule Settings",
        btn_setting_20_20_20: "🕐 Configure 20-20-20 Rule",
        timer_title: "⏱️ 20-20-20 Rule Timer",
        timer_work: "⏱️ Work:",
        timer_break: "☕ Break:",
        timer_dist: "👀 View Dist:",
        alert_warning: "⚠️ Warning!",
        alert_too_close: "You are sitting too close to the screen. Please move back.",
        break_title: "Time for a Screen Break!",
        break_desc: "Following the 20-20-20 rule<br>Look at an object 20 feet (6 meters) away<br>for 20 seconds",
        btn_skip_break: "Skip Break",
        timer_settings_title: "Configure 20-20-20 Rule",
        setting_work_time: "⏱️ Work Time (min)",
        setting_break_time: "☕ Break Time (sec)",
        setting_view_dist: "👀 Viewing Distance (ft)",
        btn_reset: "🔄 Reset",
        btn_default: "🔙 Default",
        btn_ok: "✅ OK",
        ringtone_title: "Choose Alert Sound",
        btn_close: "✅ Close",
        unit_min: "min",
        unit_sec: "sec",
        unit_foot: "ft",
        camera_on: "🎥 Camera On",
        camera_off: "🎥 Camera Off",
        noti_on: "🔔 Notifications On",
        noti_off: "🔕 Notifications Off",
        sound_on: "🔊 Sound On",
        sound_off: "🔇 Sound Off",
        status_active: "Open",
        status_inactive: "Closed",
        status_too_close: "Too Close!",
        status_ok: "OK",
        presence_active: "At Screen",
        presence_inactive: "Away",
        ai_analyzing: "Analyzing data... ⏳",
        ai_advice_prefix: "💡 Advice:",
        ai_error: "Unable to get AI advice at this time",
        ai_network_error: "Error connecting to server",
        break_msg_1: "Following the 20-20-20 rule<br>Look at an object",
        break_msg_2: "feet",
        break_msg_3: "meters) away<br>for",
        ringtone_selected: "✅ Selected",
        ringtone_click_to_select: "Click to select",
        ringtone_play: "▶️ Play"
    }
};

let currentLang = localStorage.getItem('appLang') || 'th';

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('appLang', lang);

    // Update active button styling
    const btnTh = document.getElementById('lang-btn-th');
    const btnEn = document.getElementById('lang-btn-en');

    if (btnTh && btnEn) {
        if (lang === 'th') {
            btnTh.style.background = 'rgba(0, 212, 255, 0.3)';
            btnEn.style.background = 'rgba(255, 255, 255, 0.1)';
        } else {
            btnEn.style.background = 'rgba(0, 212, 255, 0.3)';
            btnTh.style.background = 'rgba(255, 255, 255, 0.1)';
        }
    }

    const dict = translations[lang];
    if (!dict) return;

    // elements with data-key
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (dict[key]) {
            el.innerHTML = dict[key];
        }
    });

    // elements with data-key-placeholder
    document.querySelectorAll('[data-key-placeholder]').forEach(el => {
        const key = el.getAttribute('data-key-placeholder');
        if (dict[key]) {
            el.setAttribute('placeholder', dict[key]);
        }
    });

    // special handlers for re-attaching event listeners if innerHTML changed links
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', () => {
            loginFormContainer.style.display = 'none';
            registerFormContainer.style.display = 'block';
            loginError.style.display = 'none';
        });
    }
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => {
            registerFormContainer.style.display = 'none';
            loginFormContainer.style.display = 'block';
            registerError.style.display = 'none';
        });
    }

    // specific status texts updates if needed, e.g. toggle buttons might need re-evaluation
    // Note: If toggle buttons have state text (e.g. "Camera On" vs "Camera Off"), 
    // it's better to update those in the main logic, so we dispatch an event to let renderer.js know
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
}

function setLanguage(lang) {
    applyLanguage(lang);
}

// Initial application
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
});
