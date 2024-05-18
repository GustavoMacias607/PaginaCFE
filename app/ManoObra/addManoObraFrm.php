<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>
<div class="fondBlancoManoObra">
    <div class="bottom-rectangle-ManoObra">
        <div class="text-ManoObra">Mano de obra</div>
        <button type="button" class="btn btn-agregar-ManoObra" data-bs-toggle="modal"
            data-bs-target="#AgregarModal">Agregar mano de obra</button>
    </div>
</div>