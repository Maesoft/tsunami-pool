const ventanaNuevoProducto=`
<div class="ventana">
            <h1>Nuevo Producto</h1>
            <div class="field">
            <label for="id">Codigo:</label>
            <input type="number" name="id" id="codigo">
            </div>
            <div class="field">
            <label for="nombre">Nombre:</label>
            <input type="text" name="nombre" id="nombre">
            </div>
            <div class="field">
            <label for="precio">Precio:</label>
            <input type="number" name="precio" id="precio">
            </div>
            <div>
            <button id="btnOk">&#9989; Guardar</button>
            <button id="btnCancel">&#10060; Cancelar</button>
            </div>
</div>

`
export default ventanaNuevoProducto