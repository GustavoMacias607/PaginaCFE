<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}
?>

<div class="fondBlancoconceptos">
    <div class="bottom-rectangle-conceptos">
        <div class="text-conceptos">Seleccion conceptos ICM</div>
        <a onclick="opcion('proyecto')" class="text-inicio-conceptos">
            <div>Ir al inicio</div>
        </a>
    </div>
    <div class=" label-container-conceptos">
        <input type="text" placeholder="Buscar" id="search-inputConcepto">
        <i class="fas fa-search icon-conceptos" id="searchIcon"></i>
    </div>
    <!-- Paginacion  -->
    <div class="pagRegistrosconceptos">
        <nav class="pSeccion">
            <div class="cantregconceptos">
                <div class="text1">Mostrar</div>
                <select class="cantregistrosconceptos" name="" id="rows-per-page">
                    <option value="10" selected>10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <div class="text2">Registros </div>
            </div>

            <ul class="pagination" id="pagination">
                <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                <li class="page-item active"></li>
            </ul>
        </nav>
    </div>
</div>


<div style="padding-top: 15rem;">
    <div class="contTabla-materialesmodal_catalogo">
        <div class="tabla-container-tablaTarjeta">
            <table id="tabla-MaterialesCatalogo">
                <thead class="encabezadoTablasTarjeta">
                    <tr>
                        <th style="width: 8rem;">
                            ID
                        </th>
                        <th>
                            Nombre
                        </th>
                        <th style="width: 10rem;">
                            <div class="d-flex align-items-center">
                                <span>Unidad: </span>
                                <select class="form-select form-select-sm ml-2" id="unidad-filterConcepto"
                                    style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                    <option value="" selected>Todo</option>
                                    <option value="Estructuras">Estructura</option>
                                    <option value="PZA">PZA</option>
                                </select>
                            </div>
                        </th>
                        <th id="columFamilia" style="width: 10rem; ">
                            Familia
                        </th>
                        <th style="width: 12rem;">
                            <div style="display: flex; min-width: 144px; justify-content: space-between;">
                                <span>Acciones</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody id="table-bodyConceptosICM">
                    <!-- Aquí se llenará con los registros -->
                    <td colspan="8">Sin resultados</td>
                </tbody>
            </table>
        </div>
    </div>
    <div style="margin: 2rem 2rem 2rem 2rem; width: calc(100% - 4rem); display: flex; justify-content: end;">
        <button type="button" class="btn fa-solid-Siguiente-catalogo"
            onclick="opcion('SeleccionProveedoresICM')">Siguiente</button>
    </div>
</div>