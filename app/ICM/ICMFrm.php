<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

require("../../scripts/connect.php");
require("../../scripts/Conexion.php");
require("../../scripts/Materiales.php");

?>

<div class="fondBlancoICM">
    <div class="bottom-rectangle-materiales">
        <div class="text-materiales">ICM</div>
        <a onclick="opcion('proyecto')" class="text-inicio-materiales">
            <div>Ir al inicio</div>
        </a>
    </div>
</div>

<div>
    <label for=""
        style="color:#303030; font-family: 'LatoBold', sans-serif; margin-left: 2rem; margin-top: 12rem; align-content: center;">Para
        la obra:</label>
    <div style="display: flex; flex-wrap: wrap; margin-top: 9.8rem; float: right; margin-bottom: 1rem;">
        <label for=""
            style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Id:</label>
        <label for="" id="lblId"
            style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
        <label for=""
            style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Zona:</label>
        <label for="" id="lblZona"
            style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
        <label for=""
            style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Tipo
            de obra:</label>
        <label for="" id="lblTipoObra"
            style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>

        <label for=""
            style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Fecha
            posible de inicio:</label>
        <label for="" id="lblFechaInicio"
            style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
        <label for=""
            style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Periodo:</label>
        <label for="" id="lblPeriodo"
            style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
        <label for=""
            style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Fecha
            de término:</label>
        <label for="" id="lblFechaTermino"
            style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
    </div>
</div>
<textarea type="text" class="form-control inputLleno" disabled
    style="margin: 0px 2rem 0px 2rem; width: calc(100% - 4rem);" id="lblNombre" rows="4"></textarea>


<div class="btnMostrarTabla modal-footer-zonas">
    <button type="button" class="btn btn-primary" id="nomBtnMosProv"
        style="background-color: #008E5A; border: 3px solid #008E5A;" onclick="javascript:MostrarProvedores();">Mostrar
        provedores</button>
</div>
<div id="apartadoTablaProve" class="ocultarProvedor">
    <div class="proveedores-container">
        <div style="display: flex; gap:2rem ; margin-bottom: 1rem;">
            <h3>Selecciona los proveedores:</h3>
            <div id="btnAgregarProvee" class="modal-footer modal-footer-zonas">
                <button type="button" class="btn btn-primary"
                    style="background-color: #008E5A; border: 3px solid #008E5A;"
                    onclick="javascript:AbrirApartadoAgregar();">Agregar</button>
            </div>
        </div>
        <table id="tabla-proveedores" border="1">
            <thead>
                <tr class="textCen">
                    <th class="textCen">Nombre del Proveedor</th>
                    <th class="textCen">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <!-- Filas dinámicas de proveedores -->
            </tbody>
        </table>
    </div>

    <div id="apartadoFormProve" class="proveedores-container" style="display: none;">
        <div class="provForm">
            <h1 class="modal-title fs-5" id="tituloProveedores" style="color: #303030; font-weight:bold;">
            </h1>
            <form name="no-autocomplete" autocomplete="off">
                <div class="modal-body modal-body-zonas">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030; font-weight:600;">Es
                        requerido: *</h1>
                    <input type="text" class="d-none" id="inputIdProv">
                    <div class="col-md-6 mb-3" style="width: 45rem;">
                        <label for="idInput" class="form-label"
                            style="color: #303030; font-weight:600; margin: 0 2rem 0 2rem;">Nombre
                            proveedor*</label>
                        <textarea class="form-control inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this);"
                            id="txtNombreProveedor" style="margin: 0 2rem 0 2rem;"></textarea>
                    </div>
                    <div class="col-md-6 mb-3" style="width: 45rem;">
                        <label for="idInput" class="form-label"
                            style="color: #303030; font-weight:600; margin: 0 2rem 0 2rem;">No.
                            propuesta*</label>
                        <input type="text" class="form-control inputLleno" style="margin: 0 2rem 0 2rem;"
                            id="addNoPropuesta" onblur="javascript:CompruebaTieneAlgoInput(this); ">
                    </div>
                    <div class="col-md-6 mb-3 " style="width: 45rem;">
                        <label for="idInput" class="form-label"
                            style="color: #303030; font-weight:600; margin: 0 2rem 0 2rem;">Fecha*</label>
                        <input type="date" class="form-control inputLleno" style="margin: 0 2rem 0 2rem;"
                            id="AddFechaProv" onblur="javascript:CompruebaTieneAlgoInput(this);">
                    </div>
                    <div class="modal-footer modal-footer-zonas d-flex gap-3">
                        <button type="button" class="btn btn-primary" id="btnGuardarForm"
                            style="background-color: #008E5A; border: 3px solid #008E5A;"
                            onclick="javascript:AddUpdProveedorValidar();">Agregar</button>
                        <button type="button" class="btn btn-primary"
                            style="background-color:rgb(74, 74, 74); border: 3px solid rgb(74, 74, 74);"
                            onclick="javascript:CerrarFormProv();">Cancelar</button>
                    </div>
                </div>
            </form>

        </div>
    </div>
</div>
<div class="contTabla-ICM">
    <div class="tabla-container-ICM">
        <table id="tabla-ICM">
            <thead>
                <!-- Encabezados dinámicos -->
            </thead>
            <tbody class="tbody-ICM">
                <!-- Filas dinámicas -->
            </tbody>
        </table>
    </div>
</div>

<!-- Modal Mensaje -->
<div class="centrarMsg modMsgEsconder" id="modalMsgUsuarios">
    <div class="modMsg" id="modUsu">
        <div class="modImg">
            <img id="imgPic" src="../img/imgPalomita.png" alt="Mensaje" height="100%">
        </div>
        <div class="modCon">
            <p id="modParrafo">Hola</p>
        </div>
    </div>
</div>
<!-- Modal Mensaje -->
<div class="centrarMsg modMsgEsconder" id="modalMsgUsuarios">
    <div class="modMsg" id="modUsu">
        <div class="modImg">
            <img id="imgPic" src="../img/imgPalomita.png" alt="Mensaje" height="100%">
        </div>
        <div class="modCon">
            <p id="modParrafo">Hola</p>
        </div>
    </div>
</div>