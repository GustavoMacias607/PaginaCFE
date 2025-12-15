<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}
?>

<div class="fondBlancoICM">
    <div class="bottom-rectangle-materiales">
        <div class="text-materiales">Investigación de Condiciones de Mercado</div>
        <button type="button" class="btn btn-agregar-zonas" onclick="opcion('SeleccionProveedoresICM')">Selección de
            proveedores</button>
        <a onclick="opcion('proyecto'); deseleccionar()" class="text-inicio-conceptos">
            <div>Ir al inicio</div>
        </a>
        </a>
    </div>
</div>
<div style="padding-top: 11rem; justify-content: center; display: flex; justify-content: center;">


    <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
        onclick="ExportarTablaICMExcel();">Exportar a Excel</button>
    <button type="button" id="btnExportarPDF" class="btn fa-solid-Siguiente-catalogo"
        style="margin-left: 0.5rem; margin-right: 0.5rem;" onclick="exportarPDFTablaICM()">Exportar a
        PDF</button>

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