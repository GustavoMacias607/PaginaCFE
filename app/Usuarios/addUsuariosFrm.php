<?php

session_start();
/*
if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}
*/
require("../../scripts/connect.php");
require("../../scripts/Conexion.php");
require("../../scripts/Materiales.php");

$c = new Conexion($conData);
$m = new Materiales($c->getConnection());
$datos = array(
    "estatus" => false
);
//$resM = $m->getAllMateriales($datos);
?>

<div class="row container mt-5 text-lg-start">
    <div class="bottom-rectangle">
        <button type="button" class="btn btn-agregar-material" data-bs-toggle="modal" data-bs-target="#AgregarModal" style="--bs-btn-padding-y: .3rem; --bs-btn-padding-x: 2.5rem; --bs-btn-font-size: 1rem;" onclick="javascript:AddlimpiarModal();">Agregar
            Usuario</button>
    </div>
    <div class="label-container">
        <input type="text" placeholder="Buscar" id="searchInput" oninput="GetBuscarMateriales()">
        <i class="fas fa-search green-icon" id="searchIcon"></i>
    </div>

</div>


<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous">
</script>