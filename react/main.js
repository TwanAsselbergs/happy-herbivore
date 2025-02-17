import { app, BrowserWindow } from "electron";

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1080,
		height: 1920,
	});

	win.loadFile("./dist/index.html");
};

app.whenReady().then(() => {
	createWindow();
});
