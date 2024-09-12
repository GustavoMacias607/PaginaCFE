<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

<div class="bottom-rectangle-manodeobra">
    <div class="text-manodeobra">Especificaciones</div>
    <button type="button" class="btn btn-agregar-manodeobra" data-bs-toggle="modal" data-bs-target="#AgregarModal"
        onclick="javascript:AddlimpiarModalManoObra();">Agregar Especificacion</button>
    <a href="index.php" class="text-inicio-manodeobra">
        <div>Ir al inicio</div>
    </a>
</div>