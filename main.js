const { app, BrowserWindow, Menu, Tray } = require("electron");

const path = require("path");
const { GlobalKeyboardListener } = require("node-global-key-listener");

const modifiersMap = {
	"LEFT CTRL": "LCTRL",
	"LEFT SHIFT": "LSHIFT",
	"LEFT ALT": "LALT",
	"LEFT META": "WIN",
	"RIGHT CTRL": "RCTRL",
	"RIGHT SHIFT": "RSHIFT",
	"RIGHT ALT": "RALT",
	"RIGHT META": "WIN",
	TAB: "TAB",
};

const modifierNames = Object.keys(modifiersMap);

const mapModifierToShortname = (modifier) => {
	return modifiersMap[modifier] || modifier;
};

const createKeyboardListener = (win) => {
	const keys = new GlobalKeyboardListener();

	keys.addListener((e, down) => {
		if (e.state !== "DOWN") return;

		const modifiers = Object.keys(down)
			.filter((key) => modifierNames.includes(key) && down[key])
			.sort((a, b) => {
				const indexOfA = modifierNames.indexOf(a);
				const indexOfB = modifierNames.indexOf(b);

				if (indexOfA < indexOfB) return 1;
				if (indexOfA > indexOfB) return -1;
				return 0;
			});

		const normal = Object.keys(down).filter(
			(key) => down[key] && !modifierNames.includes(key)
		);

		if (normal.length > 0 && modifiers.length > 0) {
			win.webContents.send("key", {
				normal: normal.map(mapModifierToShortname),
				modifiers: modifiers.map(mapModifierToShortname),
			});
		}
	});
};

const createTrayMenu = (window) => {
	const tray = new Tray("./caster.png");

	tray.on("click", () => {
		window.focus();
	});

	const contextMenu = Menu.buildFromTemplate([
		{
			label: "Exit",
			type: "normal",
			click: () => app.exit(0),
		},
	]);

	tray.setToolTip("This is my application.");
	tray.setContextMenu(contextMenu);
};

const createWindow = async (width, height) => {
	const win = new BrowserWindow({
		frame: false,
		titleBarStyle: "hidden",
		transparent: true,
		alwaysOnTop: true,
		minimizable: false,
		skipTaskbar: true,
		width: width - 20,
		height: height - 20,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	win.setIgnoreMouseEvents(true, { forward: false });
	await win.loadFile("index.html");

	createKeyboardListener(win);

	return win;
};

app.whenReady().then(async () => {
	const { screen } = require("electron");
	const primaryDisplay = screen.getPrimaryDisplay();
	const { width, height } = primaryDisplay.workAreaSize;

	const window = await createWindow(width, height);
	createTrayMenu(window);

	window.focus();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
			window.focus();
		}
	});
});
