// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('app/index.html')

  // ipcMain.on('new-window', function () {
  //   mainWindow.loadURL(url.format({
  //     pathname: path.join(__dirname, '/app/help.html'),
  //     protocol: 'file:',
  //     slashes: true
  //   }))
  // })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

function createMenu () {
  const dockMenu = Menu.buildFromTemplate([
    {
      label: '文件',
      submenu: [
        {
          label: '退出',
          accelerator: 'Shift+Ctrl+Q',
          click () {
            app.quit()
          }
        }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '联系作者',
          submenu: [
            {
              label: '简书',
              click () {
                const { shell } = require('electron')
                shell.openExternal('https://www.jianshu.com/u/bfea62dd0faf')
              }
            },
            {
              label: 'syl18188@163.com',
              click () {
                const { shell } = require('electron')
                shell.openExternal('https://mail.163.com/')
              }
            }
          ]
        }
      ]
    }
  ])
  Menu.setApplicationMenu(dockMenu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  createMenu()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
