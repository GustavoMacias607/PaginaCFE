<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>
<div class="">
    <div class="fondBlancosearchCatalogo">
        <div class="bottom-rectangle-Catalogo">
            <div class="text-Catalogo">Catálogo</div>
            <button type="button" class="btn btn-agregar-Catalogo" data-bs-toggle="modal"
                data-bs-target="#AgregarModal">Agregar catalogo</button>
                <a href="index.php" class="text-inicio-Catalogo">
                <div>Ir al inicio</div>
                </a>
        </div>
        <div class="label-container-Catalogo">
            <input type="text" placeholder="Buscar" id="searchInput" oninput="GetCatalogo();EstablecerPag()">
            <i class="fas fa-search icon-Catalogo" id="searchIcon"></i>
        </div>

        <!-- Paginacion  -->
        <div class="pagRegistroscatalogo">
            <nav class="pSeccion">
                <div class="cantregcatalogo">
                    <div class="text">Mostrar</div>
                    <select class="cantregistroscatalogo" name="" id="cantRegistros" onchange="javascript:cambiarTamano()">
                        <option value="10" selected>10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <div class="text">Registros </div>
                </div>

                <ul class="pagination" id="pagination-list">
                    <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                    <li class="page-item active"></li>
                </ul>

            </nav>
            <div class="toggle-estatus-catalogo">
                <div class="text">Estatus</div>
                <div class="">
                    <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                    <img id="ValEstatus" src="../img/toggle_on_35px.png"
                        onclick="javascript:valStatusCatalogo(); javascript:GetCatalogo(); javascript:EstablecerPag()">
                </div>
            </div>
        </div>

    <div class="div-mayor" style="display: flex; flex-wrap; gap: 1.5rem; margin-left: 2rem; margin-right: 2rem; padding-top: 1rem;">

        <div class="div-card">
            <div class="titulocatalogo">
                Catalogo 1
            </div>
            <div class="contenidocatalogo">
                <div>
                    <div class="titulosdecontenido">Concepto: <span class="textotitulosdecontenido">Nombre de concepto</span></div>
                    <div class="titulosdecontenido">Tipo: <span class="textotitulosdecontenido">Tipo concepto</span></div> 
                </div>
                <div >
                    <button class="btn apartadoeliminarcatalogo">Eliminar</button> 
                </div>
            </div>
        </div> 
        <div class="div-card">
            <div class="titulocatalogo">
                Catalogo 1
            </div>
            <div class="contenidocatalogo">
                <div>
                    <div>Todo el Conceptohhhhhfgggfgf</div>
                    <div>AAAAAAAAAABBBB</div> 
                </div>
                <div >
                    <button class="btn apartadoeliminarcatalogo">Eliminar</button> 
                </div>
            </div>
        </div> 
    </div>



<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous">
</script>