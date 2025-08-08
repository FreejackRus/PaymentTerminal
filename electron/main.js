const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
  // Размеры для вертикального 32" экрана (обычно 1080x1920)
  const windowWidth = 1080;
  const windowHeight = 1920;

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minWidth: windowWidth,
    minHeight: windowHeight,
    maxWidth: windowWidth,
    maxHeight: windowHeight,
    resizable: false,
    fullscreen: true,
    kiosk: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true
  });

  mainWindow.loadURL('http://localhost:3000');
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);