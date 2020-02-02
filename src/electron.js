// Modules to control application life and create native browser window
require("v8-compile-cache");
const {app, BrowserWindow, Tray, Menu, session} = require('electron');
const path = require('path');

// Keep a global reference of the window object and tray item, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let trayItem;
let gmail = `https://mail.google.com`;
let googleauth = `https://accounts.google.com`;
let apis = 'https://*.google.com';
let gstatic = "https://*.gstatic.com";
let userAgent = {userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.74 Safari/537.36 Edg/79.0.309.43'};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', init);

function init(){
    createWindow();
}


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
        show: false,
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: false,
        }
    });

    mainWindow.maximize();
    mainWindow.show();
    mainWindow.loadURL(gmail, userAgent).then(() => mainWindow.show());


    mainWindow.webContents.on('new-window', (e,url) => {
        e.preventDefault();
        if(url.startsWith(googleauth) || url.startsWith(gmail)) mainWindow.loadURL(url, userAgent).then(() => mainWindow.show());
        else contentWindow(url)
    });



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

function contentWindow(url){
    let newWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: false,
        }
    });

    newWindow.removeMenu();
    newWindow.loadURL(url, userAgent).then();

    newWindow.on('closed', function() {
        newWindow = null
    })
}

