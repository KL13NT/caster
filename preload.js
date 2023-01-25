const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	handleKey: (callback) => ipcRenderer.on("key", callback),
});
