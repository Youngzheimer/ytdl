const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // 여기를 수정합니다.
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile("index.html");
}

app.on("ready", createWindow);

// ipcMain.handle("request-data", async (event, arg) => {
//   // 여기서 백엔드 작업을 수행합니다.
//   const data = { message: "Hello from the main process!" };
//   return data;
// });

ipcMain.handle("get-youtube-video-data", async (event, url) => {
  const data = { message: "Hello from the main process!", url: url };
  return data;
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
