window.addEventListener("DOMContentLoaded", () => {
  const requestDataButton = document.getElementById("request-data");
  const responseParagraph = document.getElementById("response");
  const urlInput = document.getElementById("url");

  requestDataButton.addEventListener("click", async () => {
    const data = await window.electron.getYouTubeVideoData(urlInput.value);
    responseParagraph.textContent = data.url;
  });
});
