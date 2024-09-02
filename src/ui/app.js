const fs=require('fs');
const {getConnection}=require('../database.js');

//Ventanas
import ventanaOpciones from "./windows/windowOption.js";
import ventanaNuevoProveedor from "./windows/windowNewProvider.js";
import ventanaModificarProveedor from "./windows/windowEditProvider.js";
import ventanaAgregarComanda from "./windows/windowAddFood.js";
import ventanaNuevoProducto from "./windows/windowNewProduct.js";
import ventanaEstadoDeCuenta from "./windows/windowAccountStatus.js";
import ventanaProductos from "./windows/windowProduct.js";
import ventanaEditarProducto from "./windows/windowEditProduct.js";

//Elementos capturados
const app = document.getElementById("app");
const sectorMesas = document.getElementById("sectorMesas");
const sectorPools = document.getElementById("sectorPools");
const salon = document.getElementById("salon");
const menuOpt = document.getElementById("menuOpt");
const menuNewProv = document.getElementById("menuNewProv");
const menuEditProv = document.getElementById("menuEditProv");
const menuSalon = document.getElementById("menuSalon");
const menuProduct = document.getElementById("menuProduct");

//Cargar el archivo Opciones
const RUTA_OPCIONES='src/data/options.json';
let data=fs.readFileSync(RUTA_OPCIONES,'utf8');
const opciones=JSON.parse(data);
const precio_minuto=opciones.tarifa / 60;

//Cargar el archivo Productos
const RUTA_PRODUCTOS='src/data/products.json';
data=fs.readFileSync(RUTA_PRODUCTOS,'utf8');
let productos=[];
try {
    productos=JSON.parse(data)
} catch (error) {
    console.log(error);
}

//Crear arreglo con cada mesa de pool
let arrPools = new Array(opciones.pools)
for (let i = 0; i < opciones.pools; i++) {
    arrPools[i]=({idInterval:0,seg:0,min:0,hor:0, importe_pool:0, importe_comanda:0, comanda:[]});
}

//Crear arreglo con cada mesa
let arrMesas = new Array(opciones.mesas)
for (let i = 0; i < opciones.mesas; i++) {
    arrMesas[i]=({importe_comanda:0, comanda:[]});
}
//funcion que carga las ventanas en main.html
const cargarVentana=(ventana)=> {
    app.innerHTML = ventana;
}
const detenerTiempo = (i) => {
    const botonesHabilitar = document.querySelectorAll(".btnHabilitar");
    const botonesDetener = document.querySelectorAll(".btnDetener");
    const botonesPausar = document.querySelectorAll(".btnPausa");
    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    const botonesCobrarPool = document.querySelectorAll(".btnCobrar");
    const cronometros = document.querySelectorAll(".cronometro");
    
    clearInterval(arrPools[i].idInterval);
    botonesHabilitar[i].disabled=false;
    botonesPausar[i].disabled=true;
    botonesAgregar[i].disabled=false;
    botonesCobrarPool[i].disabled=false;
    botonesDetener[i].disabled=true;
    arrPools[i].seg=0;
    arrPools[i].min=0;
    arrPools[i].hor=0;
    cronometros[i].textContent="00:00:00";
}
const cerrarMesa = (i, isPool) => {
    const importesPools = document.querySelectorAll(".importe");
    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    const botonesCobrarPool = document.querySelectorAll(".btnCobrar");
    const ocupadas=document.querySelectorAll('.ocupada');
    const botonesCobrarMesa=document.querySelectorAll('.btnMesaCobrar');

    if(isPool){
        detenerTiempo(i);
        arrPools[i].importe_pool=0;
        arrPools[i].importe_comanda=0;
        arrPools[i].comanda=[];
        botonesAgregar[i].disabled=true;
        botonesCobrarPool[i].disabled=true;
        importesPools[i].textContent="$ 0,00"
    }else{
        arrMesas[i].importe_comanda=0;
        arrMesas[i].comanda=[];
        ocupadas[i].textContent="";
        botonesCobrarMesa[i].disabled=true;
    }
    

}
const showComanda = (i,isPool) => {
        cargarVentana(ventanaAgregarComanda)
        const btnCancelarComanda=document.getElementById('btnCancelarComanda')
        const listProducts=document.getElementById('lista-comanda');
        const buscador=document.getElementById('buscar');

        let productosParaFiltrar = [...productos];
        const renderizarProductos=()=>{
            listProducts.innerHTML='';
            productosParaFiltrar.forEach((prod) => {
            listProducts.innerHTML += `<tr><td>${prod.nombre}</td><td>$ ${prod.precio}</td></tr>`;
        })}
       
        listProducts.addEventListener('click',(e)=>{
            if(isPool){
                if(e.target.previousElementSibling){
                    arrPools[i].comanda.push({
                        descripcion:e.target.previousElementSibling.textContent,
                        precio:parseFloat(e.target.textContent.match(/\d+/g).join('.')) || 0,
                    })
                        arrPools[i].importe_comanda+=parseFloat(e.target.textContent.match(/\d+/g).join('.'))
                        cargarVentana('')
                    }
                    if(e.target.nextElementSibling){
                    arrPools[i].comanda.push({
                        descripcion:e.target.textContent,
                        precio:parseFloat(e.target.nextElementSibling.textContent.match(/\d+/g).join('.')),
                    })
                        arrPools[i].importe_comanda+=parseFloat(e.target.nextElementSibling.textContent.match(/\d+/g).join('.'))
                        cargarVentana('')
                    }
            }else{
                if(e.target.previousElementSibling){
                    arrMesas[i].comanda.push({
                        descripcion:e.target.previousElementSibling.textContent,
                        precio:parseFloat(e.target.textContent.match(/\d+/g).join('.')) || 0,
                    })
                    arrMesas[i].importe_comanda+=parseFloat(e.target.textContent.match(/\d+/g).join('.'))
                    cargarVentana('')
                }
                if(e.target.nextElementSibling){
                    arrMesas[i].comanda.push({
                        descripcion:e.target.textContent,
                        precio:parseFloat(e.target.nextElementSibling.textContent.match(/\d+/g).join('.')),
                    })
                    arrMesas[i].importe_comanda+=parseFloat(e.target.nextElementSibling.textContent.match(/\d+/g).join('.'))
                    cargarVentana('')
                }
            }
        })
        renderizarProductos();
        buscador.addEventListener('input',()=>{
                const criterioBusqueda = buscador.value.toLowerCase();
                productosParaFiltrar = productos.filter((prod) =>
                    prod.nombre.toLowerCase().includes(criterioBusqueda) ||
                    prod.codigo.toLowerCase().includes(criterioBusqueda)
                );
                renderizarProductos();
            })
        btnCancelarComanda.addEventListener('click',()=>{
            cargarVentana('');
        })
    buscador.focus();
}
const showAccountStatus = (i,isPool) => {
    cargarVentana(ventanaEstadoDeCuenta);
    const listProducts=document.getElementById('lista-comanda')
    const btnCobrar=document.getElementById('btnCobrar')
    const btnCancelar=document.getElementById('btnCancelar')
    if(isPool){ 

        const renderizarProductos = ()=>{
            listProducts.innerHTML='';
            arrPools[i].comanda.forEach((prod,i) => {
            listProducts.innerHTML += `<tr><td>${prod.descripcion}</td><td>$ ${prod.precio.toFixed(2)}<a id="delete-${i}">🗑️</a></td></tr>`;
            })
        }

        renderizarProductos();
        listProducts.innerHTML+=`<p>Comanda: $ ${parseFloat(arrPools[i].importe_comanda).toFixed(2)}</p>`
        listProducts.innerHTML+=`<p>Pool: $ ${arrPools[i].importe_pool.toFixed(2)}</p>`
        listProducts.innerHTML+=`<hr>`
        listProducts.innerHTML+=`<p>Total: $${(parseFloat(arrPools[i].importe_comanda)+parseFloat(arrPools[i].importe_pool)).toFixed(2)}`
    }else{
        const renderizarProductos = ()=>{
            listProducts.innerHTML='';
            arrMesas[i].comanda.forEach((prod,i) => {
            listProducts.innerHTML += `<tr><td>${prod.descripcion}</td><td>$ ${prod.precio.toFixed(2)}<a id="delete-${i}">🗑️</a></td></tr>`;
            })
        }

        renderizarProductos();

        listProducts.innerHTML+=`<hr>`
        listProducts.innerHTML+=`<p>Total: $${parseFloat(arrMesas[i].importe_comanda).toFixed(2)}`
    }
   
    listProducts.addEventListener('click', (e)=>{
        if (e.target.id && e.target.id.startsWith('delete-')){
            const indice=e.target.id.split('-')[1]

            if(e.target.id.startsWith("delete-")){
                if(isPool){
                    arrPools[i].importe_comanda-=arrPools[i].comanda[indice].precio;
                    arrPools[i].comanda.splice(indice,1);
                    showAccountStatus(i,true)
                    renderizarProductos();
                }else{
                    arrMesas[i].importe_comanda-=arrMesas[i].comanda[indice].precio;
                    arrMesas[i].comanda.splice(indice,1);
                    showAccountStatus(i,false)
                    renderizarProductos();
                }
            }
        }
    })

    btnCancelar.addEventListener('click',()=>{cargarVentana('')})
    btnCobrar.addEventListener('click',()=>{isPool? generarComprobante(i,true):generarComprobante(i,false)})
}
const generarComprobante=(i, isPool) => {
    cargarVentana('');
    let contenido='';
    if(isPool){
        contenido=`
        <hr style="width: 220px; margin:0px">
        ***************************<br>
        ********Tsunami Pool********<br>
        ***************************<br>
        <hr style="width: 220px; margin:0px">
        <strong>Mesa de Pool Nº ${i+1}</strong><br>
        FECHA: ${new Date().toLocaleDateString()}<br>
        HORA: ${new Date().toLocaleTimeString()}<br>
        <div style="width: 220px;"> <!-- Contenedor centrado -->
            <table style="width: 100%;">
            <tr>
                <td colspan="2" style="border-bottom: 1px solid black;"></td>
            </tr>
            <tr>
                <th>Descripción</th>
                <th>Precio</th>
            </tr>
            ${arrPools[i].comanda.map((prod) => {
                return `<tr><td>${prod.descripcion}</td><td>$ ${prod.precio.toFixed(2)}</td></tr>`;
            }).join('')}
            <tr><td></td></tr>
            <tr><td></td></tr>
            <tr><td></td></tr>
            <tr><td>Pool:</td><td>$ ${arrPools[i].importe_pool.toFixed(2)}</td></tr>
            <tr><td></td></tr>
            <tr><td></td></tr>
            <tr>
                <td colspan="2" style="border-bottom: 1px solid black;"></td>
            </tr>
            <tr><td><strong>TOTAL:</strong></td> <td><strong>$${(arrPools[i].importe_comanda+arrPools[i].importe_pool).toFixed(2)}</strong></td></tr>
            </table>
        </div>
        `
    let ventanaImprimir = window.open('', '_blank');
    ventanaImprimir.document.write(contenido);
    ventanaImprimir.document.close();
    ventanaImprimir.print();
    detenerTiempo(i);
    cerrarMesa(i,true)
    }else{
        contenido=`
        <hr style="width: 220px; margin:0px">
        ***************************<br>
        ********Tsunami Pool********<br>
        ***************************<br>
        <hr style="width: 220px; margin:0px">
        <strong>Mesa Nº ${i+1}</strong><br>
        FECHA: ${new Date().toLocaleDateString()}<br>
        HORA: ${new Date().toLocaleTimeString()}<br>
        <div style="width: 220px;"> <!-- Contenedor centrado -->
            <table style="width: 100%;">
            <tr>
                <td colspan="2" style="border-bottom: 1px solid black;"></td>
            </tr>
            <tr>
                <th>Descripción</th>
                <th>Precio</th>
            </tr>
            ${arrMesas[i].comanda.map((prod) => {
                return `<tr><td>${prod.descripcion}</td><td>$ ${prod.precio.toFixed(2)}</td></tr>`;
            }).join('')}
            <tr><td></td></tr>
            <tr><td></td></tr>
            <tr>
                <td colspan="2" style="border-bottom: 1px solid black;"></td>
            </tr>
            <tr><td><strong>TOTAL:</strong></td> <td><strong>$${(arrMesas[i].importe_comanda).toFixed(2)}</strong></td></tr>
            </table>
        </div>
        `
    let ventanaImprimir = window.open('', '_blank');
    ventanaImprimir.document.write(contenido);
    ventanaImprimir.document.close();
    ventanaImprimir.print();
    cerrarMesa(i,false)
    }
}
const showOptions=() => {
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
            window.close()
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
    btnProvCancel.addEventListener('click', cargarVentana(''))
}
const showProducts=()=>{
    cargarVentana(ventanaProductos);
    
    const listaProductos=document.getElementById('lista-comanda');
    const buscador=document.getElementById('buscar');
    const btnNuevoProducto=document.getElementById('btnNewProduct');
    const btnCancelar=document.getElementById('btnCancel');

    let productosParaFiltrar = [...productos];

    const renderizarProductos = () => {
        listaProductos.innerHTML = '';
        productosParaFiltrar.forEach((prod,i) => {
            listaProductos.innerHTML += `<tr><td>${prod.codigo}</td><td>${prod.nombre}</td><td>$ ${prod.precio}</td><td><a id="edit-${i}">✍️</a><a id="delete-${i}">🗑️</a></td></tr>`;
        });
        
        listaProductos.addEventListener('click', (e)=>{
            if (e.target.id && (e.target.id.startsWith('edit-') || e.target.id.startsWith('delete-'))){
                const indice=e.target.id.split('-')[1]
                const elementoSeleccionado = productos.indexOf(productos.find(producto => producto.nombre === productosParaFiltrar[indice].nombre));
                
                if(e.target.id.startsWith("edit-")){
                    editarElemento(elementoSeleccionado);
                }
                if(e.target.id.startsWith("delete-")){
                    eliminarElemento(elementoSeleccionado);
                }
            }
        })
        const editarElemento=(indice)=>{
            cargarVentana(ventanaEditarProducto)
             document.getElementById('codigo').value=productos[indice].codigo;
             document.getElementById('nombre').value=productos[indice].nombre;
             document.getElementById('precio').value=productos[indice].precio;
            const btnOk=document.getElementById('btnOk');
            const btnCancel=document.getElementById('btnCancel');    
            
            
            btnOk.addEventListener('click',()=>{
                productos[indice].codigo=document.getElementById('codigo').value
                productos[indice].nombre=document.getElementById('nombre').value
                productos[indice].precio=document.getElementById('precio').value
                fs.writeFileSync(RUTA_PRODUCTOS,JSON.stringify(productos));
                showProducts();
            })
            btnCancel.addEventListener('click',()=>{cargarVentana('')})
        }
        const eliminarElemento=(indice)=>{
                productos.splice(indice,1)
                fs.writeFileSync(RUTA_PRODUCTOS,JSON.stringify(productos));
                showProducts();
            }
    }
    
    renderizarProductos();
    
    buscador.addEventListener('input', () => {
        const criterioBusqueda = buscador.value.toLowerCase();
        productosParaFiltrar = productos.filter((prod) =>
            prod.nombre.toLowerCase().includes(criterioBusqueda) ||
            prod.codigo.toLowerCase().includes(criterioBusqueda)
    );
        renderizarProductos();
    });

    btnNuevoProducto.addEventListener('click',()=>showNewProduct());
    btnCancelar.addEventListener('click',()=>cargarVentana(''));
    
}
const showNewProduct=()=>{
    cargarVentana(ventanaNuevoProducto)
    const btnOk=document.getElementById('btnOk')
    const btnCancel=document.getElementById('btnCancel')

    btnOk.addEventListener('click', async  ()=>{

            const codigo=document.getElementById('codigo').value;
            const nombre=document.getElementById('nombre').value;
            const precio=document.getElementById('precio').value;

            data=fs.readFileSync(RUTA_PRODUCTOS,'utf-8')
            try {
            productos=JSON.parse(data)    
            } catch (error) 
            {
           
            }
            const newProduct={codigo, nombre, precio}
            newProduct.precio=parseFloat(newProduct.precio)
            productos.push(newProduct);
            
            fs.writeFileSync(RUTA_PRODUCTOS,JSON.stringify(productos))
            cargarVentana('')
            
    })
    btnCancel.addEventListener('click',()=>{cargarVentana('')})
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

    btnProvOk.addEventListener('click', ()=>{
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
const saveMesas = () => {
    data = {mesas: arrMesas, pools: arrPools}
    try {
        fs.writeFileSync('src/data/temp.json',JSON.stringify(data))
    } catch (error) {
        console.log(error);
    }
    }
const loadMesas = () => {
    const ocupadas=document.querySelectorAll('.ocupada') 
    const botonesCobrarMesa=document.querySelectorAll('.btnMesaCobrar')
    const botonesHabilitar = document.querySelectorAll(".btnHabilitar");
    const importesPools = document.querySelectorAll(".importe");
    try {
        data=fs.readFileSync('src/data/temp.json','utf8');
        const parsed=JSON.parse(data);
        arrMesas=parsed.mesas
        arrPools=parsed.pools
    } catch (error) {
        console.log(error);
    }
    arrMesas.forEach((mesa,i)=>{
        if(mesa.importe_comanda > 0){
            ocupadas[i].textContent="OCUPADA";
            botonesCobrarMesa[i].disabled=false;
        } 
    })
    arrPools.forEach((pool,i)=>{
        if(pool.importe_pool > 0){
            botonesHabilitar[i].click()
            importesPools[i].textContent='$ ' + pool.importe_pool.toFixed(2)
        } 
    })
    }
const crearSalon=(mesas,pools)=>{

    for (let i = 0; i < mesas; i++) {
       sectorMesas.innerHTML+=`
            <div class="tarjeta">
            <div class="container">
            <img class="img-mesa" src='../img/mesa.png' alt="Mesa de Restorant"/>
            <div class="ocupada"></div>
            </div>
                <div class="container">
                    <div class="nombre">Mesa ${i+1}</div>
                    <div>
                    <button class="btnMesa">➕</button>
                    <button class="btnMesaCobrar" disabled>💲</button>
                    </div>
                </div>
            </div>`
    }
    for (let i = 0; i < pools; i++) {
       sectorPools.innerHTML+=`
            <div class="tarjeta">
            <div class="container">
            <img class="img-pool" src='../img/pool.jpg' alt="Mesa de Pool"/>
            <div class="importe"> $ 0,00</div>
            </div>
                <div class="container">
                    <div class="nombre">Pool ${i+1}</div>
                    <div class="cronometro">00:00:00</div>
                    <div>
                    <button class="btnHabilitar">▶️</button>
                    <button class="btnPausa" disabled>⏸️</button>
                    <button class="btnDetener" disabled>⏹️</button>
                    <button class="btnAgregar" disabled>➕</button>
                    <button class="btnCobrar" disabled>💲</button>
                    </div>
                </div>
            </div>`
    }

    const botonesMesa=document.querySelectorAll(".btnMesa")
    const ocupadas=document.querySelectorAll('.ocupada')
    const botonesCobrarMesa=document.querySelectorAll('.btnMesaCobrar')
    const botonesHabilitar = document.querySelectorAll(".btnHabilitar");
    const botonesDetener = document.querySelectorAll(".btnDetener");
    const botonesPausar = document.querySelectorAll(".btnPausa");
    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    const botonesCobrarPool = document.querySelectorAll(".btnCobrar");
    const cronometros = document.querySelectorAll(".cronometro");
    const importesPools = document.querySelectorAll(".importe");


   
    botonesMesa.forEach((btn,i)=>{
       btn.addEventListener('click',()=>{
        showComanda(i,false);
        botonesCobrarMesa[i].disabled=false;
        ocupadas[i].textContent='OCUPADA'
       })
    })
    botonesCobrarMesa.forEach((btn,i)=>{
        btn.addEventListener('click',()=>{
            showAccountStatus(i,false)
        })
    })
    botonesHabilitar.forEach((btn,i) =>{
        btn.addEventListener("click", ()=>{
            btn.disabled=true;
            botonesDetener[i].disabled=false;
            botonesPausar[i].disabled=false;
            botonesAgregar[i].disabled=false;
            botonesCobrarPool[i].disabled=false;


            arrPools[i].idInterval=setInterval(()=>{
                arrPools[i].seg++;
                if(arrPools[i].seg>=60){
                    arrPools[i].seg=0;
                    arrPools[i].min++;
                    arrPools[i].importe_pool+=precio_minuto;
                    importesPools[i].textContent='$ '+ arrPools[i].importe_pool.toFixed(2);
                }
                if(arrPools[i].min>=60){
                    arrPools[i].min=0;
                    arrPools[i].hor++;
                }
                cronometros[i].innerHTML=arrPools[i].hor.toString().padStart(2,'0')+':'+arrPools[i].min.toString().padStart(2,'0')+':'+arrPools[i].seg.toString().padStart(2,'0');
            },1000)
        })
    })
            botonesDetener.forEach((btn,i)=>{
                btn.addEventListener('click',()=>{
                    detenerTiempo(i);
                })
            })

            botonesPausar.forEach((btn,i)=>{
                btn.addEventListener('click',()=>{
                        btn.disabled=true;
                        botonesHabilitar[i].disabled=false;
                        clearInterval(arrPools[i].idInterval);
                })
            })

            botonesAgregar.forEach((btn,i)=>{
                btn.addEventListener('click',()=>{
                    showComanda(i,true);
                })
            })

            botonesCobrarPool.forEach((btn,i)=>{
                btn.addEventListener('click',()=>{
                    showAccountStatus(i,true)
                    })
            })
            loadMesas()
            setInterval(saveMesas,5000)
}
document.addEventListener('DOMContentLoaded', () => {
    //Click en Opciones
    menuOpt.addEventListener("click", () => {
        showOptions()
    });
    //Click en Nuevo Proveedores
    // menuNewProv.addEventListener("click", () => {
    //     showNewProvider()
    // });
    //Click en Modificar Proveedores
    // menuEditProv.addEventListener("click", () => {
    //     showEditProvider()
    // });
    //Click en Productos
    menuProduct.addEventListener("click", () => {
        showProducts();
    });
    //Click en Salon
    menuSalon.addEventListener("click", () => {
        salon.classList.toggle("visible")
    });
});
//Creamos el salon apartir del archivo options.json
crearSalon(opciones.mesas,opciones.pools);