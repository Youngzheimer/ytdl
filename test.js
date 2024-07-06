// const YTDlpWrap = require("yt-dlp-wrap").default;
// const ytDlpWrap = new YTDlpWrap();

// let ytDlpEventEmitter = ytDlpWrap
//   .exec([
//     "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
//     "-f",
//     "best",
//     "-o",
//     "output.mp4",
//   ])
//   .on("progress", (progress) =>
//     console.log(
//       progress.percent,
//       progress.totalSize,
//       progress.currentSpeed,
//       progress.eta
//     )
//   )
//   .on("ytDlpEvent", (eventType, eventData) => console.log(eventType, eventData))
//   .on("error", (error) => console.error(error))
//   .on("close", () => console.log("all done"));

// console.log(ytDlpEventEmitter.ytDlpProcess.pid);

const YTDlpWrap = require("yt-dlp-wrap").default;
const ytDlpWrap = new YTDlpWrap();

function downloadVideo() {
  return new Promise((resolve, reject) => {
    const ytDlpEventEmitter = ytDlpWrap.exec([
      "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      "-f",
      "best",
      "-o",
      "output.mp4",
    ]);

    ytDlpEventEmitter.on("progress", (progress) => {
      console.log(
        progress.percent,
        progress.totalSize,
        progress.currentSpeed,
        progress.eta
      );
    });

    ytDlpEventEmitter.on("ytDlpEvent", (eventType, eventData) => {
      console.log(eventType, eventData);
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
}

// Promise 사용
downloadVideo()
  .then(() => {
    console.log("다운로드가 성공적으로 완료되었습니다.");
  })
  .catch((error) => {
    console.error("다운로드 중 오류 발생:", error);
  });
