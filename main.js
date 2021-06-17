// Modules
const {app, BrowserWindow, ipcMain, Menu} = require('electron');
const windowStateKeeper = require('electron-window-state');
const mainMenu = require('./menu');

// Pega o emissor da tela para futura respostas
let emiter;

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  // Mantem na memório o estado da Tela
  let state = windowStateKeeper({
    defaultWidth: 500, defaultHeight: 650
  })

  mainWindow = new BrowserWindow({
    x: state.x, y: state.y,
    width: state.width, height: state.height,
    minWidth: 350,  minHeight: 300,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  // Menu da Aplicação
  Menu.setApplicationMenu(mainMenu);

  //Passa os parametros da chamada
  ipcMain.on('online', (e, args) => {
    console.log('Main online');

    // Passa os parametros para a tela
    e.sender.send('params', process.argv);
    emiter = e;
  });  

  ipcMain.once('User-Proibido', (e, args) => {
    app.quit();
  });

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('renderer/main.html');

  // Manage new window state
  state.manage(mainWindow);

  // Abre DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null;
  })
 }

// Electron `app` is ready
app.on('ready', ()=> {
  createWindow();
});

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow();
})
