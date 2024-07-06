window.addEventListener("DOMContentLoaded", () => {
  const downloadButton = document.getElementById("download-data");
  const requestDataButton = document.getElementById("request-data");
  const responseParagraph = document.getElementById("response");
  const thumbnail = document.getElementById("thumbnail");
  const urlInput = document.getElementById("url");

  requestDataButton.addEventListener("click", async () => {
    const data = await window.electron.getYouTubeVideoData(urlInput.value);
    responseParagraph.textContent = data.title;
    thumbnail.src = data.thumbnail;
  });

  downloadButton.addEventListener("click", async () => {
    const data = await window.electron.downloadYoutube(urlInput.value);
    responseParagraph.textContent = data.title;
    thumbnail.src = data.thumbnail;
  });

  window.electron.onReceiveData("download-progress", (progress) => {
    console.log(progress);
  });
});
