<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

<div class="fondBlancoCatalogo">
    <div class="bottom-rectangle-Catalogo">
        <div class="text-Catalogo">Tarjetas de precios unitarios</div>
        <a href="index.php" class="text-inicio-Catalogo">
            <div>Ir al inicio</div>
        </a>
    </div>
    <div class=" label-container-Catalogo">
        <input type="text" placeholder="Buscar" id="search-inputConcepto">
        <i class="fas fa-search icon-Catalogo" id="searchIcon"></i>
    </div>


    <!-- Paginacion  -->
    <div class="pagRegistrosCatalogo">

        <div class="toggle-estatus-Catalogo">
            <div class="text">Estatus</div>
            <div class="">
                <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                <img id="ValEstatus" src="../img/toggle_on_35px.png" onclick="javascript:valStatusConcepto();">
            </div>
        </div>
    </div>
</div>