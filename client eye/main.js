const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: false, // ปิด node integration เพื่อให้ทำงานแบบ web บริสุทธิ์
            contextIsolation: true, // เปิด isolation เพื่อความปลอดภัย
            webSecurity: true, // เปิด web security เพื่อความปลอดภัย
            sandbox: false // ปิด sandbox เพื่อให้เข้าถึงกล้องได้
        }
    })

    win.loadFile('index.html')
    // win.webContents.openDevTools() // เปิด Console เพื่อดู log
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// Send stats before app quits
app.on('before-quit', async (event) => {
    event.preventDefault()

    // Give renderer time to send stats
    setTimeout(() => {
        app.exit(0)
    }, 1000)
})
