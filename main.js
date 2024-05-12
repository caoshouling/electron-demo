// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const { app, BrowserWindow,ipcMain, dialog,Menu  } = require('electron')
const path = require('path')

const createWindow = () => {
  // 创建浏览窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 300,
    resizable : true,  // false禁止改变窗口大小，true 可以改变
    show: false,
    title: "title", //注意：如果index.html中设置了title，那么这个title会被覆盖。
    frame: true, // 隐藏最上方标题栏和菜单栏，如果隐藏了那么放大、缩小、退出按钮也会隐藏
    autoHideMenuBar: false, //隐藏菜单栏
    icon: './images/red256.ico', // 设置窗口左上角的图标
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment'
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement'
        }
      ]
    }

  ])

  Menu.setApplicationMenu(menu)

  // 加载 index.html
  // mainWindow.loadFile('./server/demo/preset.html')
  mainWindow.loadFile('index.html');
  // mainWindow.loadURL('https://video.remoteinquest.com:8233/cloudvideo/admin/login.html');
  // 打开开发工具
  // mainWindow.webContents.openDevTools()
  mainWindow.on('ready-to-show',()=>{
    mainWindow.show(); 
  })
  // 在页面准备好之后，可以发送通知
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('---did-finish-load---');
    mainWindow.webContents.executeJavaScript(`new Notification('Hello', { body: '这是一个桌面通知！' })`);
  });
  //// 一个窗口中的文本加载完成
  mainWindow.webContents.on('dom-ready', () => {
    console.log('---dom-ready---');
  });
  mainWindow.on('close', () => {
    console.log('---close---');
  });


   // Open the DevTools.
   mainWindow.webContents.openDevTools()
}



// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  console.log('---ready---');
  createWindow()

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态, 
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  console.log('---window-all-closed---');
  if (process.platform !== 'darwin') app.quit()
})
app.on('before-quit', () => {
  console.log('---before-quit---');
});
app.on('will-quit', () => {
  console.log('---will-quit---');
});
app.on('quit', () => {
  console.log('---quit---');
});
// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。

ipcMain.on('sync-title',(event,data)=>{
  console.log('---main.js---',data);
});
ipcMain.on('async-title',(event,data)=>{
  console.log('---main.js---',data);
});

ipcMain.handle('dialog:openFile', handleFileOpen)
async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}

ipcMain.on('counter-value', (_event, value) => {
  console.log(value) // will print value to Node console
})
