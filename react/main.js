import { app, BrowserWindow } from "electron/main";

const createWindow = () => {
	const win = new BrowserWindow({
		fullscreen: true,
		frame: false,
	});

	win.loadFile("./dist/index.html");
};

app.whenReady().then(() => {
	createWindow();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
