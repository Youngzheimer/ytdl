const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  //   requestData: async () => await ipcRenderer.invoke("request-data"),
  getYouTubeVideoData: async (url) =>
    await ipcRenderer.invoke("get-youtube-video-data", url),
  downloadYoutube: async (url) =>
    await ipcRenderer.invoke("download-youtube-video", url),
});
