const { app, BrowserWindow, dialog } = require('electron');

let win;

const createWindow = () => {
    win = new BrowserWindow({
        frame: true,
        width: 1024,
        height: 768,
        autoHideMenuBar: false,
        title: 'Tsunami Pool V 0.1',
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            enableRemoteModule: true,
            backgroundThrottling: false,
        }
    });

    win.loadFile('src/ui/main.html');

    // Manejar el evento de cierre de la ventana principal
    win.on('close', (event) => {
        event.preventDefault(); // Evitar que la ventana se cierre directamente
        confirmClose();
    });
};

app.whenReady().then(createWindow);

// Manejar el caso cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

async function confirmClose() {
    const choice = await dialog.showMessageBox(win, {
        type: 'question',
        buttons: ['Sí', 'No'],
        title: 'Confirmación',
        message: '¿Está seguro que desea cerrar la Tsunami Pool?'
    });

    if (choice.response === 0) {
        win.destroy(); // Cerrar la ventana manualmente después de la confirmación
        app.quit(); // Salir de la aplicación
    }
}
