const { app, BrowserWindow } = require('electron');
const path = require('path');
let mainWindow;
let deeplinkingUrl;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 750,
    icon: __dirname + '/icon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.setMenu(null);
  mainWindow.maximize();
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
  if (process.platform == 'win32') {
    // Keep only command line / deep linked arguments
    deeplinkingUrl = process.argv.slice(1);
    //console.log(deeplinkingUrl);
  }
  mainWindow.webContents.on('did-finish-load', function() {
    // mainWindow.webContents.executeJavaScript(`console.log("${deeplinkingUrl}")`);
    if((deeplinkingUrl[0] == ".") || (deeplinkingUrl[0] == null) || (deeplinkingUrl[0] == '--squirrel-firstrun')){
      mainWindow.webContents.send('stand_alone_run', deeplinkingUrl);
    }else{
      mainWindow.webContents.send('room_data', deeplinkingUrl);
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

if (!app.isDefaultProtocolClient('teleconsulta-sigma')) {
  // Define custom protocol handler. Deep linking works on packaged versions of the application!
  app.setAsDefaultProtocolClient('teleconsulta-sigma');
}

app.on('will-finish-launching', function() {
  // Protocol handler for osx
  app.on('open-url', function(event, url) {
    event.preventDefault();
    deeplinkingUrl = url;
  });
});


