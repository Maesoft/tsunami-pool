const fs=require('fs');
const {getConnection}=require('../database.js')
const conn = getConnection(); // Obtiene la conexión a la base de datos

// Realiza la consulta
const queryString = 'SELECT * FROM tblproveedores';
conn.query(queryString, (error, results, fields) => {
    if (error) {
        console.error('Error en la consulta: ' + error);
        return;
    }

    // Procesa los resultados de la consulta
    console.log('Resultados de la consulta: ', results);

    // Cierra la conexión cuando hayas terminado (opcional)
    conn.end();
});

//Elementos capturados
const app = document.getElementById("app");
const sectorMesas = document.getElementById("sectorMesas");
const sectorPools = document.getElementById("sectorPools");
const salon = document.getElementById("salon");
const menuOpt = document.getElementById("menuOpt");
const menuNewProv = document.getElementById("menuNewProv");
const menuEditProv = document.getElementById("menuEditProv")
const menuSalon = document.getElementById("menuSalon")


//Ventanas
import ventanaOpciones from "./windows/windowOption.js";
import ventanaNuevoProveedor from "./windows/windowNewProvider.js";
import ventanaModificarProveedor from "./windows/windowEditProvider.js";

//Cargar el archivo Opciones
const RUTA_OPCIONES='src/data/options.json'
const data=fs.readFileSync(RUTA_OPCIONES,'utf8')
const opciones=JSON.parse(data)


//funcion que carga las ventanas en main.html
const cargarVentana=(ventana)=> {
    app.innerHTML = ventana;
}
const showOptions=()=>{
    cargarVentana(ventanaOpciones);
    document.getElementById('cantidadMesas').value=opciones.mesas;
    document.getElementById('cantidadPools').value=opciones.pools;
    document.getElementById('tarifa').value=opciones.tarifa; 

    const btnOptOk = document.getElementById("btnOptOk");
    const btnOptCancel = document.getElementById("btnOptCancel");
        btnOptOk.addEventListener("click", () => {
            opciones.mesas=document.getElementById('cantidadMesas').value
            opciones.pools=document.getElementById('cantidadPools').value
            opciones.tarifa=document.getElementById('tarifa').value
            fs.writeFileSync(RUTA_OPCIONES,JSON.stringify(opciones))
            cargarVentana("");
            sectorMesas.innerHTML="";
            sectorPools.innerHTML="";
            crearSalon(opciones.mesas,opciones.pools)
        });
        btnOptCancel.addEventListener("click", () => {
            cargarVentana("");
        });
}  

const showNewProvider=()=>{
    cargarVentana(ventanaNuevoProveedor);
    const ipRazonSocial=document.getElementById('ipRazonSocial')
    const ipNombreFantasia=document.getElementById('ipNombreFantasia')
    const ipCuit=document.getElementById('ipCuit')
    const respInsc=document.getElementById('respInsc')
    const ipDireccion=document.getElementById('ipDireccion')
    const ipCiudad=document.getElementById('ipCiudad')
    const ipTelefono=document.getElementById('ipTelefono')
    const btnProvOk=document.getElementById('btnProvOk')
    const btnProvCancel=document.getElementById('btnProvCancel')

    btnProvOk.addEventListener('click', async  ()=>{
        const objProvider={
            razonSocial:ipRazonSocial.value,
            nombreFantacia:ipNombreFantasia.value,
            cuit:ipCuit.value,
            respInsc:respInsc.value,
            direccion:ipDireccion.value,
            ciudad:ipCiudad.value,
            telefono:ipTelefono.value
        }
      newProvider(objProvider);
    })
}
const showEditProvider=()=>{
    cargarVentana(ventanaModificarProveedor);
    const ipRazonSocial=document.getElementById('ipRazonSocial')
    const ipNombreFantasia=document.getElementById('ipNombreFantasia')
    const ipCuit=document.getElementById('ipCuit')
    const respInsc=document.getElementById('respInsc')
    const ipDireccion=document.getElementById('ipDireccion')
    const ipCiudad=document.getElementById('ipCiudad')
    const ipTelefono=document.getElementById('ipTelefono')
    const btnProvOk=document.getElementById('btnProvOk')
    const btnProvCancel=document.getElementById('btnProvCancel')

    btnProvOk.addEventListener('click', async  ()=>{
        const objProvider={
            razonSocial:ipRazonSocial.value,
            nombreFantacia:ipNombreFantasia.value,
            cuit:ipCuit.value,
            respInsc:respInsc.value,
            direccion:ipDireccion.value,
            ciudad:ipCiudad.value,
            telefono:ipTelefono.value
        }
        
    })
}
const crearSalon=(mesas,pools)=>{
    for (let i = 0; i < mesas; i++) {
       sectorMesas.innerHTML+=`
            <div class="tarjeta">
            <img class="img-mesa" src='../img/mesa.png' alt="Mesa de Restorant"/>
                <div class="container">
                    <div class="nombre">Mesa ${i+1}</div>
                    <button class="btnMesa">🍽️</button>
                </div>
            </div>`
    }
    for (let i = 0; i < pools; i++) {
       sectorPools.innerHTML+=`
            <div class="tarjeta">
            <div class="container">
            <img class="img-pool" src='../img/pool.jpg' alt="Mesa de Pool"/>
            <div class="importe">$ 0.00,00</div>
            </div>
                <div class="container">
                    <div class="nombre">Pool ${i+1}</div>
                    <div class="cronometro">00:00:00</div>
                    <div>
                    <button class="btnHabilitar">▶️</button>
                    <button class="btnPausa" disabled>⏸️</button>
                    <button class="btnDetener" disabled>⏹️</button>
                    </div>
                </div>
            </div>`
    }
    const botonesHabilitar = document.querySelectorAll(".btnHabilitar");
    const botonesDetener = document.querySelectorAll(".btnDetener");
    const botonesPausar = document.querySelectorAll(".btnPausa");
    const cronometros = document.querySelectorAll(".cronometro");

    let intervalos = new Array(pools)
    for (let i = 0; i < pools; i++) {
        intervalos[i]=({idInterval:0,seg:0,min:0,hor:0});
    }
    
    botonesHabilitar.forEach((btn,i) =>{
        btn.addEventListener("click", ()=>{
            btn.disabled=true;
            botonesDetener[i].disabled=false;
            botonesPausar[i].disabled=false;


            intervalos[i].idInterval=setInterval(()=>{
                intervalos[i].seg++;
                if(intervalos[i].seg>=60){
                    intervalos[i].seg=0;
                    intervalos[i].min++;
                }
                if(intervalos[i].min>=60){
                    intervalos[i].min=0;
                    intervalos[i].hor++;
                }
                cronometros[i].innerHTML=intervalos[i].hor.toString().padStart(2,'0')+':'+intervalos[i].min.toString().padStart(2,'0')+':'+intervalos[i].seg.toString().padStart(2,'0');
            },1000)
        })
    })
            botonesDetener.forEach((btn,i)=>{
                btn.addEventListener('click',()=>{
                    clearInterval(intervalos[i].idInterval);
                    botonesHabilitar[i].disabled=false;
                    botonesPausar[i].disabled=true;
                    btn.disabled=true;
                    intervalos[i].seg=0;
                    intervalos[i].min=0;
                    intervalos[i].hor=0;
                    cronometros[i].innerHTML="00:00:00";
                })
            })
            botonesPausar.forEach((btn,i)=>{
                btn.addEventListener('click',()=>{
                        btn.disabled=true;
                        botonesHabilitar[i].disabled=false;
                        clearInterval(intervalos[i].idInterval);
                })
            })
}
document.addEventListener('DOMContentLoaded', () => {
    //Click en Opciones
    menuOpt.addEventListener("click", () => {
        showOptions()
    });
    //Click en Nuevo Proveedores
    menuNewProv.addEventListener("click", () => {
        showNewProvider()
    });
    //Click en Modificar Proveedores
    menuEditProv.addEventListener("click", () => {
        showEditProvider()
    });
    //Click en Salon
    menuSalon.addEventListener("click", () => {
        salon.classList.toggle("visible")
    });
});
//Creamos el salon apartir del archivo options.json
crearSalon(opciones.mesas,opciones.pools);