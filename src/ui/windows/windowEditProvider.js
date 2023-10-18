const ventanaModificarProveedor=`
<div class="ventana">
            <h1>Modificar Proveedor</h1>
            <div class="field">
            <label for="id">Codigo:</label>
            <input type="number" name="id" id="id">
            </div>
            <div class="field">
            <label for="razonSocial">Razon Social:</label>
            <input type="text" name="razonSocial" id="ipRazonSocial" disabled>
            </div>
            <div class="field">
            <label for="nombreFantasia">Nombre Fantasia:</label>
            <input type="text" name="nombreFantasia" id="ipNombreFantasia" disabled>
            </div>
            <div class="field">
            <label for="cuit">Cuit:</label>
            <input type="number" name="cuit" id="ipCuit" disabled>
            <select name="respInsc" id=respInsc disabled>
            <option value=true>Resp. Insc</option>
            <option value=false>Monotributista</option>
            </select>
            </div>
            <div class="field">
            <label for="direccion">Direccion:</label>
            <input type="text" name="direccion" id="ipDireccion" disabled>
            </div>
            <div class="field">
            <label for="ciudad">Ciudad:</label>
            <input type="text" name="ciudad" id="ipCiudad" disabled>
            </div>
            <div class="field">
            <label for="telefono">Telefono:</label>
            <input type="text" name="telefono" id="ipTelefono" disabled>
            </div>
            <div>
            <button id="btnProvOk">&#9989; Guardar</button>
            <button id="btnProvCancel">&#10060; Cancelar</button>
            </div>
</div>

`
export default ventanaModificarProveedor