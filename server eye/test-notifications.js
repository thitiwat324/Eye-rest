/**
 * Server-Side Notification Test Script
 * Demonstrates trigger_alert() usage in Node.js server
 */

const { trigger_alert } = require('./utils/notifier');

console.log('🧪 Starting Server Notification Test Script...\n');

// Test 1: Basic notification
console.log('Test 1: Basic notification...');
setTimeout(() => {
    trigger_alert(
        '📊 Server Alert',
        'Testing basic server notification'
    );
    console.log('✅ Basic notification sent!\n');
}, 1000);

// Test 2: Notification with custom options
console.log('Test 2: Notification with long timeout...');
setTimeout(() => {
    trigger_alert(
        '⏰ Long Notification',
        'This notification will stay for 10 seconds',
        { timeout: 10, sound: true }
    );
    console.log('✅ Long timeout notification sent!\n');
}, 3000);

// Test 3: Silent notification
console.log('Test 3: Silent notification (no sound)...');
setTimeout(() => {
    trigger_alert(
        '🔇 Silent Alert',
        'This notification has no sound',
        { sound: false, timeout: 5 }
    );
    console.log('✅ Silent notification sent!\n');
}, 6000);

// Test 4: Series of notifications (like monitoring alerts)
console.log('Test 4: Notification series...');
const monitoringMessages = [
    { title: '📈 CPU Alert', message: 'CPU usage above 80%' },
    { title: '💾 Memory Alert', message: 'Memory usage above 90%' },
    { title: '📁 Disk Alert', message: 'Disk space running low' }
];

monitoringMessages.forEach((alert, index) => {
    setTimeout(() => {
        trigger_alert(alert.title, alert.message, { timeout: 4 });
        console.log(`✅ Alert ${index + 1}/3 sent: ${alert.title}`);
    }, 9000 + (index * 2000));
});

console.log('\n📝 Instructions:');
console.log('1. Make sure you\'re running on a desktop environment');
console.log('2. Check system notification settings');
console.log('3. Watch for 6 notifications total');
console.log('\n⏳ Running tests...');

setTimeout(() => {
    console.log('\n✅ All server notification tests completed!');
    console.log('\n💡 Integration Ideas:');
    console.log('  - Alert on database connection errors');
    console.log('  - Notify on API endpoint failures');
    console.log('  - Alert when user sessions exceed threshold');
    console.log('  - Notify on data sync completion');
}, 16000);
