<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

<div class="fondBlancoconceptos">
    <div class="bottom-rectangle-especificaciones">
        <div class="text-especificaciones">Especificaciones</div>
        <button type="button" class="btn btn-agregar-especificaciones" data-bs-toggle="modal" data-bs-target="#AgregarModal"
            onclick="javascript:AddlimpiarModalManoObra();">Agregar Especificación</button>
        <a href="index.php" class="text-inicio-especificaciones">
            <div>Ir al inicio</div>
        </a>
    </div>
    <div class=" label-container-especificaciones">
        <input type="text" placeholder="Buscar" id="search-inputEspecificaciones">
        <i class="fas fa-search icon-especificaciones" id="searchIcon"></i>
    </div>

    <!-- Paginacion  -->
    <div class="pagRegistrosconceptos">
        

        <button type="button" class="btn btn-tiposde-conceptos">Redes áereas</button>
        <button type="button" class="btn btn-tiposde-conceptos">Obra civíl</button>
        <button type="button" class="btn btn-tiposde-conceptos">Obra electromecánica</button>

        <div class="toggle-estatus-conceptos">
            <div class="text">Estatus</div>
            <div class="">
                <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                <img id="ValEstatus" src="../img/toggle_on_35px.png" onclick="javascript:valStatusConcepto();">
            </div>
        </div>
    </div>

</div>

<div class="contTabla-materiales">
    <div class="tabla-container tabla-container-materiales">
        <table id="tabla-materiales">
            <thead class="">
                <tr>
                    <th style="width: 8rem;">
                        ID
                    </th>
                    <th style="width: 12rem;">
                        Tipo
                    </th>
                    <th class="col-1" style="width: 100px;">
                        <div style="display: flex; min-width: 144px; justify-content: space-between;">
                            <span>Acciones</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody id="table-bodyMateriales">
                <!-- Aquí se llenará con los registros -->
            </tbody>
            <!-- Primera fila adicional con un label -->
            <tr>
                <td colspan="3">
                    <label for="infoExtra">Descripción:</label>
                </td>
            </tr>

            <!-- Segunda fila adicional -->
            <tr>
                <td colspan="3">
                </td>
            </tr>

            <!-- Repetición de encabezado -->
            <tr>
                <th style="width: 8rem; ">
                    <button id="sort-id" class="sort-button">
                        ID <i class="fa-solid fa-arrow-up-wide-short"></i>
                    </button>
                </th>
                <th style="width: 28rem;">
                    <button id="sort-name" class="sort-button">
                        Descripción <i class="fa-solid fa-arrow-up-wide-short"></i>
                    </button>
                </th>
                <th class=" col-1" style="width: 8rem;">
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
            </tr>
            <tbody id="table-bodyConceptos">
                <!-- Aquí se llenará con los registros -->
            </tbody>
        </table>
    </div>
</div>