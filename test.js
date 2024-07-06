const YTDlpWrap = require("yt-dlp-wrap").default;
const path = require("path");
const fs = require("fs");

const ytDlpWrap = new YTDlpWrap();

async function downloadVideo(videoUrl, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputTemplate = path.join(outputDir, "%(title)s.%(ext)s");

  return new Promise((resolve, reject) => {
    const process = ytDlpWrap.exec([
      videoUrl,
      "-o",
      outputTemplate,
      "--newline",
    ]);

    process.on("ytDlpEvent", (eventType, eventData) => {
      if (eventType === "progress") {
        const { percent, totalSize, downloadedBytes, speed, eta } = eventData;
        const progressBar = `[${"=".repeat(
          Math.floor(percent / 2)
        )}${" ".repeat(50 - Math.floor(percent / 2))}]`;
        process.stdout.write(
          `\r${progressBar} ${percent.toFixed(
            1
          )}% of ${totalSize} at ${speed}/s ETA ${eta}`
        );
      }
    });

    process.on("error", (error) => {
      console.error("\nAn error occurred:", error.message);
      reject(error);
    });

    process.on("close", () => {
      console.log("\nDownload completed successfully!");
      resolve();
    });
  });
}

// 사용 예시
const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const outputDir = path.join(__dirname, "downloads");

async function main() {
  try {
    await downloadVideo(videoUrl, outputDir);
  } catch (error) {
    console.error("Failed to download video:", error);
  }
}

main();
