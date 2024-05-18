<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>
<div class="fondBlancoMaquinaria">
    <div class="bottom-rectangle-Maquinaria">
        <div class="text-Maquinaria">Maquinaria</div>
        <button type="button" class="btn btn-agregar-Maquinaria" data-bs-toggle="modal"
            data-bs-target="#AgregarModal">Agregar maquinaria</button>
    </div>
</div>