// Modules to control application life and create native browser window
require("v8-compile-cache");
const {app, BrowserWindow, Tray, Menu} = require('electron');
const path = require('path');

// Keep a global reference of the window object and tray item, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let trayItem;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


function createWindow () {

    // Returns false if there is already an instance running
    const firstInstance = app.requestSingleInstanceLock();

    // Quit if process is a redundant instance
    if (!firstInstance) {
        app.quit();
        return null;
    }

    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            mainWindow.show()
        }
    });

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // and load the index.html of the app.
    mainWindow.loadURL(`https://gmail.com`);

    // hide function toolbar
    mainWindow.removeMenu();


    trayItem = new Tray(path.join(__dirname, 'icon.png'));
    trayItem.on("click", () => mainWindow.show());
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App', click: function () {
                mainWindow.show()
            }
        },
        {
            label: 'Quit', click: function () {
                app.isQuiting = true;
                app.quit()
            }
        }
    ]);

    trayItem.setContextMenu(contextMenu);

    mainWindow.on('close', function (event) {
        if (!app.isQuiting) {
            event.preventDefault();
            mainWindow.hide();
            event.returnValue = false;
        }
    });
}

