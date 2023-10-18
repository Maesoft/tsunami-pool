const ventanaOpciones=`
<div class="ventana">
<h1>Opciones</h1>
<h2>Configuración de Mesas y Pools</h2>

    <label for="cantidadMesas">Cantidad de Mesas:</label>
    <input type="number" id="cantidadMesas" name="cantidadMesas" min="1" value="1"><br><br>
    
    <label for="cantidadPools">Cantidad de Pools:</label>
    <input type="number" id="cantidadPools" name="cantidadPools" min="1" value="1"><br><br>
    
    <label for="tarifa">Tarifa por Hora:</label>
    <input type="number" id="tarifa" name="tarifa" step="100"><br><br>
    
    <div>
    <button id="btnOptOk">&#9989; Guardar</button>
    <button id="btnOptCancel">&#10060; Cancelar</button>
    </div>
</div>`
export default ventanaOpciones
