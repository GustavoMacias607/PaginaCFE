<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

<div class="fondBlanco-proyecto">
    <div class="bottom-rectangle-proyecto">
        <div class="text-materiales">Proyectos</div>

        <?php
        if ($_SESSION["rol"] != "Invitado") {
            echo    '<button type="button" class="btn btn-agregar-Proyecto" data-bs-toggle="modal" data-bs-target="#AgregarModal"
            onclick="javascript:addProyectoLimpiarModal();">Agregar proyecto</button>';
        }
        ?>

        <input type="text" class="form-control inputLleno d-none" id="idUsuario" value="<?= $_SESSION['idusuario'] ?>">
    </div>
    <div class="label-container-proyecto">
        <input type="text" placeholder="Buscar" id="search-inputProyecto">
        <i class="fas fa-search icon-proyecto" id="searchIcon"></i>
    </div>
    <div class="pagRegistrosconceptos" style="justify-content: space-around;">
        <label for="" class="titulos-tiposde-proyecto">En proceso</label>
        <label for="" class="titulos-tiposde-proyecto">Terminados</label>
    </div>
</div>


<div class="contenedor-columnas">
    <!-- Primera columna -->
    <div class="columna">
        <div class="pagRegistroszonas" style="margin-top: 14rem;">
            <nav class="pSeccion">
                <div class="cantregzonas">
                    <div class="text1">Mostrar</div>
                    <select class="cantregistrosmanodeobra" id="rows-per-pageProceso">
                        <option value="10" selected>10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <div class="text2">Registros </div>
                </div>
                <ul class="pagination" id="paginationProceso">
                    <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                    <li class="page-item active"></li>
                </ul>
            </nav>

        </div>
        <div class="contTabla-proyecto">
            <div class="tabla-container-proyecto">
                <table id="tabla-conceptos">
                    <thead>
                        <tr>
                            <th style="width: 8rem;">
                                ID
                            </th>
                            <th>Nombre</th>
                            <th style="width: 8rem;">Fecha registro</th>
                            <th style="width: 8rem;">Zona</th>

                            <th style="width: 8rem;">Tipo de obra</th>
                            <th style="width: 8rem;">Estado</th>
                        </tr>
                    </thead>
                    <tbody id="table-bodyProyectosProceso">
                        <!-- Aquí se llenará con los registros -->
                        <td colspan="8">Sin resultados</td>
                    </tbody>
                </table>
                <div class="sk-circle">
                    <div class="sk-circle1 sk-child"></div>
                    <div class="sk-circle2 sk-child"></div>
                    <div class="sk-circle3 sk-child"></div>
                    <div class="sk-circle4 sk-child"></div>
                    <div class="sk-circle5 sk-child"></div>
                    <div class="sk-circle6 sk-child"></div>
                    <div class="sk-circle7 sk-child"></div>
                    <div class="sk-circle8 sk-child"></div>
                    <div class="sk-circle9 sk-child"></div>
                    <div class="sk-circle10 sk-child"></div>
                    <div class="sk-circle11 sk-child"></div>
                    <div class="sk-circle12 sk-child"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Segunda columna -->
    <div class="columna">
        <div class="pagRegistroszonas" style="margin-top: 14rem;">
            <nav class="pSeccion">
                <div class="cantregzonas">
                    <div class="text1">Mostrar</div>
                    <select class="cantregistrosmanodeobra" id="rows-per-pageTerminados">
                        <option value="10" selected>10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <div class="text2">Registros </div>
                </div>

                <ul class="pagination" id="paginationTerminados">
                    <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                    <li class="page-item active"></li>
                </ul>
            </nav>
            <div class="toggle-estatus-materiales">
                <div class="text">Estatus</div>
                <div class="">
                    <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                    <img id="ValEstatus" src="../img/toggle_on_35px.png" onclick="javascript:valStatusProyecto();">
                </div>
            </div>
        </div>
        <div class="contTabla-proyecto">
            <div class="tabla-container-proyecto">
                <table id="tabla-conceptos">
                    <thead>
                        <tr>
                            <th style="width: 8rem;">
                                ID
                            </th>
                            <th>Nombre</th>
                            <th style="width: 8rem;">Fecha registro</th>
                            <th style="width: 8rem;">Zona</th>
                            <th style="width: 8rem;">Tipo de obra</th>
                            <th style="width: 8rem;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="table-bodyProyectosTerminados">
                        <!-- Aquí se llenará con los registros -->
                        <td colspan="8">Sin resultados</td>
                    </tbody>
                </table>
                <div class="sk-circle">
                    <div class="sk-circle1 sk-child"></div>
                    <div class="sk-circle2 sk-child"></div>
                    <div class="sk-circle3 sk-child"></div>
                    <div class="sk-circle4 sk-child"></div>
                    <div class="sk-circle5 sk-child"></div>
                    <div class="sk-circle6 sk-child"></div>
                    <div class="sk-circle7 sk-child"></div>
                    <div class="sk-circle8 sk-child"></div>
                    <div class="sk-circle9 sk-child"></div>
                    <div class="sk-circle10 sk-child"></div>
                    <div class="sk-circle11 sk-child"></div>
                    <div class="sk-circle12 sk-child"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal insertar proyecto -->
<div class="modal modal-maquinaria" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar proyecto</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-maquinaria" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-maquinaria">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <div class="row mb-3">

                    <div class="col-6">
                        <label for="precioInput" class="form-label" style="color: #303030;">Id</label>
                        <input type="text" class="form-control inputLleno" id="inputIdProyecto" disabled>
                    </div>
                    <div class="col-6">
                        <label for="unidadInput" class="form-label" style="color: #303030;">Zona*</label>
                        <input type="text" class="form-control inputLleno" id="inputZona"
                            oninput="mostrarSugerenciasZonas(this)" onfocus="mostrarSugerenciasZonas(this)"
                            onblur="ocultarSugerenciasZonas();CompruebaTieneAlgoInput(this)" autocomplete="off">
                        <div id="Addsugerencias" class="sugerencias-boxZona"
                            style="font-family: 'latoBold', sans-serif;">
                        </div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <label for="unidadInput" class="form-label" style="color: #303030;">Tipo de obra*</label>
                        <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            id="AddTipoObra">
                            <option value="" selected>Selecciona</option>
                            <option value="Nueva">Nueva</option>
                            <option value="Mejora de red">Mejora de red</option>
                            <option value="Solicitudes">Solicitudes</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <label for="AddfechaPrecioInput" class="form-label" style="color: #303030;">Fecha posible de
                            inicio*</label>
                        <input type="date" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            class="form-control inputLleno" id="AddfechaInicioInput">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <label for="precioInput" class="form-label" style="color: #303030;">Periodo*</label>
                        <input type="number" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            class="form-control inputLleno" id="inputPeriodo" min="1">
                    </div>
                    <div class="col-6">
                        <label for="AddfechaPrecioInput" class="form-label" style="color: #303030;">Fecha de
                            término</label>
                        <input type="date" onblur="javascript:CompruebaTieneAlgoInput(this)" disabled
                            class="form-control inputLleno" id="AddfechaTerminoInput">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Nombre de la obra*</label>
                    <textarea type="text" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        class="form-control inputLleno" id="inputNombreObra" rows="4"></textarea>
                </div>
                <div class="modal-footer modal-footer-maquinaria">
                    <button type="button" class="btn btn-primary"
                        onclick="javascript:AddProyectoFase1();">Siguiente</button>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="loading" style="display:none; background: #f0f0f0; padding: 10px; margin: 10px 0;">
    <p>🔄 Creando respaldo de la base de datos, por favor espere...</p>
</div>


<div id="resultado" style="display:none; padding: 10px; margin: 10px 0;"></div>
<!-- modal para activar el registro de materiales -->
<div class="modal" id="confirmActivationModal" tabindex="-1" aria-labelledby="activationModalLabel" aria-hidden="true"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header" style="border: 3px solid #008e5a; border-radius: 5px;">
                <h5 class="modal-title" id="activationModalLabel" style="font-family: 'LatoBold', sans-serif;">
                    ¿Habilitar este proyecto?</h5>
                <button type="button" class="btn" id="confirmActivationButton"
                    onclick="javascript:ActivarCerrarModal(); cambioEstatusProyecto();"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif; margin: 0 1rem 0 1rem;">Habilitar</button>
                <button type="button" class="btn" data-bs-dismiss="modal"
                    style="background-color: #858585; color: #ffffff; font-family: 'LatoBold', sans-serif;">Cancelar</button>
            </div>
        </div>
    </div>
</div>


<!-- Modal de Confirmación de Eliminación -->
<div class="modal" id="confirmDeleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header" style=" border: 3px solid #008e5a; border-radius: 5px;">
                <h5 class="modal-title" id="exampleModalLabel" style="font-family: 'LatoBold', sans-serif;">
                    ¿Deshabilitar este proyecto?</h5>
                <button type="button" class="btn" data-bs-dismiss="modal" onclick="javascript:AbrirModalConfirm();"
                    id="confirmDeleteButton"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif; margin: 0 1rem 0 1rem;">Deshabilitar</button>
                <button type="button" class="btn" data-bs-dismiss="modal"
                    style="background-color: #858585; color: #ffffff; font-family: 'LatoBold', sans-serif;">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal de Confirmación Adicional -->
<div class="modal" id="confirmAdditionalModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header"
                style=" border: 3px solid #008e5a; border-radius: 5px; width: 700px; background-color: #ffffff; align-self: center;">
                <h5 class="modal-title" id="exampleModalLabel" style="font-family: 'LatoBold', sans-serif;">¿Está
                    seguro de que desea deshabilitar este proyecto?</h5>
                <button type="button" onclick="javascript:EliminarCerrarModal(); cambioEstatusProyecto();" class="btn"
                    id="confirmAdditionalButton"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif; margin: 0 1rem 0 1rem;">Confirmar</button>
                <button type="button" class="btn" data-bs-dismiss="modal"
                    style="background-color: #858585; color: #ffffff; font-family: 'LatoBold', sans-serif;">Cancelar</button>
            </div>
        </div>
    </div>
</div>