const {app, BrowserWindow}=require('electron');

const createWindow=()=>{
    const win=new BrowserWindow({
        frame:'false',
        width:1024,
        hiegth: 768,
        autoHideMenuBar: true,
        title: 'Tsunami Pool V 0.1',
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            enableRemoteModule: true,
            backgroundThrottling: false,
        }
    })
    
    win.loadFile('src/ui/main.html')

}

app.whenReady().then(createWindow);
