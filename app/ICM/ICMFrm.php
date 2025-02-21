<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}
?>

<div class="fondBlancoICM">
    <div class="bottom-rectangle-materiales">
        <div class="text-materiales">ICM</div>
        <button type="button" class="btn btn-agregar-zonas"
            onclick="opcion('SeleccionProveedoresICM')">Proveedores</button>
        <a onclick="opcion('proyecto')" class="text-inicio-conceptos">
            <div>Ir al inicio</div>
        </a>
        </a>
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