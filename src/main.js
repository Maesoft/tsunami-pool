const {app, dialog, BrowserWindow}=require('electron');

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
const showMessageYesOrNo=(mensaje, titulo, funcionSi,funcionNo)=>{
    const opciones = {
        type: 'question',
        buttons: ['Sí', 'No'],
        defaultId: 0,
        title: titulo,
        message: mensaje,
      };

      dialog.showMessageBox(win, opciones, (respuesta) => {
        if (respuesta === 0) {
          funcionSi()
        } else {
          funcionNo()
        }
      });
}

app.whenReady().then(createWindow);

module.exports={
    showMessageYesOrNo,
}