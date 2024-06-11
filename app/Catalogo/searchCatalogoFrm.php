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
            <a href="index.php" class="text-inicio-catalogo">
            <div>Ir al inicio</div>
            </a>
    </div>
    <div class=" label-container-catalogo">
        <input type="text" placeholder="Buscar" id="searchInput" oninput="GetCatalogo();EstablecerPag()">
        <i class="fas fa-search icon-catalogo" id="searchIcon"></i>
    </div>

    <!-- Paginacion  -->
    <div class="pagRegistroscatalogo">
        <div class="toggle-estatus-catalogo">
            <div class="text">Estatus</div>
            <div class="">
                <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                <img id="ValEstatus" src="../img/toggle_on_35px.png"
                    onclick="javascript:valStatusCatalogo(); javascript:GetCatalogo(); javascript:EstablecerPag()">
            </div>
        </div>
    </div>

    

</div>