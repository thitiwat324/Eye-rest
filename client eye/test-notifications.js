/**
 * Test Script for OS Notifications
 * This file demonstrates how to use trigger_alert() in different scenarios
 */


// Test 1: Test proximity alert notification
setTimeout(() => {
    trigger_alert(
        '⚠️ คำเตือน: ใกล้จอเกินไป!',
        'กรุณาเลื่อนออกห่างจากจอคอมพิวเตอร์'
    );
}, 2000);

// Test 2: Test break time notification
setTimeout(() => {
    trigger_alert(
        '⏰ ถึงเวลาพักสายตา!',
        'มองวัตถุระยะ 20 ฟุต (6.1 เมตร) เป็นเวลา 20 วินาที'
    );
}, 5000);

// Test 3: Test custom notification
setTimeout(() => {
    trigger_alert(
        '🎉 Custom Notification',
        'This is a test notification with custom message!'
    );
}, 8000);


setTimeout(() => {
}, 10000);
