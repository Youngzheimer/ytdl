const { app, BrowserWindow, ipcMain, clipboard } = require("electron");
const YTDlpWrap = require("yt-dlp-wrap").default;
const path = require("path");

const fs = require("fs");

const ytDlp = new YTDlpWrap();

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // 여기를 수정합니다.
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile("index.html");

  win.on("focus", () => {
    const clipboardText = clipboard.readText();
    console.log("클립보드 내용:", clipboardText);

    // 필요하다면 여기서 renderer process로 내용을 보낼 수 있습니다
    // win.webContents.send("clipboard-content", clipboardText);
  });
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
  return new Promise((resolve, reject) => {
    const ytDlpEventEmitter = ytDlp.exec([
      url,
      "-f",
      "best",
      "-o",
      "output.mp4",
    ]);

    ytDlpEventEmitter.on("progress", (progress) => {
      // win.webContents.send("download-progress", progress);
      console.log(
        progress.percent,
        progress.totalSize,
        progress.currentSpeed,
        progress.eta
      );
    });

    ytDlpEventEmitter.on("ytDlpEvent", (eventType, eventData) => {
      console.log(eventType, eventData);
      if (eventType === "download") {
        const parts = eventData.trim().split(/\s+/);
        let file = null;
        let percentage, size, speed, eta;

        if (parts[0] === "renderer.js:21") {
          file = parts.shift();
        }

        percentage = parseFloat(parts[0]);
        size = parts[2];
        speed = parts[4];
        eta = parts[6] === "in" ? parts[7] : parts[6];

        const downloadData = {
          file,
          percentage,
          size,
          speed,
          eta,
        };

        if (downloadData.speed === "Unknown") return;
        if (downloadData.percentage === 100) return;
        if (downloadData.eta === "ETA") return;
        if (downloadData.percentage === NaN) return;

        win.webContents.send("download-progress", downloadData);
      }
    });

    ytDlpEventEmitter.on("error", (error) => {
      reject(error);
    });

    ytDlpEventEmitter.on("close", () => {
      console.log("all done");
      resolve();
    });

    console.log(ytDlpEventEmitter.ytDlpProcess.pid);
  });
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
