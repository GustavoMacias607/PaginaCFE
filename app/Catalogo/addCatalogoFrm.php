<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>
<div class="fondBlancoCatalogo">
    <div class="bottom-rectangle-Catalogo">
        <div class="text-Catalogo">Catalogo</div>
        <button type="button" class="btn btn-agregar-Catalogo" data-bs-toggle="modal"
            data-bs-target="#AgregarModal">Agregar catalogo</button>
    </div>
</div>