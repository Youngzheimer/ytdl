const { app, BrowserWindow, ipcMain } = require("electron");
const YTDlpWrap = require("yt-dlp-wrap").default;
const path = require("path");

const fs = require("fs");

const ytDlp = new YTDlpWrap();

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
  console.log(url);
  const data = await ytDlp.getVideoInfo(url);
  // const data = await ytDlp.execPromise([url, "-F"]);
  // save this data to a file
  fs.writeFileSync("video.json", JSON.stringify(data));
  return data;
  // ytDlp
  //   .execPromise(["https://www.youtube.com/watch?v=videoID", "-f", "best"])
  //   .then((output) => console.log(output))
  //   .catch((error) => console.error(error));
});

ipcMain.handle("download-youtube-video", async (event, url) => {
  console.log(url);
  const data = await ytDlp.execPromise([url, "-f", "best"]);
  fs.writeFileSync("videodownlaod.json", JSON.stringify(data));
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
