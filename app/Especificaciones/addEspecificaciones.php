<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

<div class="fondBlanco">
    <div class="bottom-rectangle-especificaciones">
        <div class="text-especificaciones">Especificaciones</div>

        <?php
        if ($_SESSION["rol"] == "Administrador" || $_SESSION["rol"] == "Analista de Precios") {
            echo    ' <button type="button" class="btn btn-agregar-especificaciones" data-bs-toggle="modal"
            id="btnAgregarEspecificaciones" data-bs-target="#AgregarModalEspecificaciones"
            onclick="javascript:LlenarCamposAgregar(true);">Agregar
            Especificación</button>';
        }
        ?>

        <a onclick="opcion('proyecto')" class="text-inicio-especificaciones">
            <div>Ir al inicio</div>
        </a>
    </div>

    <div class=" label-container-especificaciones" id="BuscadorTipoEsp">
        <input type="text" placeholder="Buscar" id="search-inputEspecificaciones">
        <i class="fas fa-search icon-especificaciones" id="searchIcon"></i>
    </div>



    <!-- Paginacion  -->
    <div class="pagRegistrosusuarios">
        <nav class="pSeccion d-none" id="contenidoTipoEsp">
            <div class="cantregusuarios">
                <div class="text1">Mostrar</div>
                <select class="cantregistrosmanodeobra" id="rows-per-pagePrincipal">
                    <option value="10" selected>10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <div class="text2">Registros </div>
            </div>

            <ul class="pagination" id="paginationPrincipal">
                <!-- Aquí se agregarán dinámicamente los enlaces de página -->
            </ul>
        </nav>

        <div class="buttons-and-status" style="display: contents;">
            <button type="button" class="btn btn-tiposde-especificaciones"
                style="margin-left: 1rem; margin-right: 0.5rem;"
                onclick="seleccionEspecificacion('1'); precionaBtnEsp(this);">Redes aéreas
            </button>
            <button type="button" class="btn btn-tiposde-especificaciones"
                style="margin-left: 0.5rem; margin-right: 1rem;"
                onclick="seleccionEspecificacion('2'); precionaBtnEsp(this);">Redes subterráneas
            </button>
        </div>

        <div class="toggle-estatus-especificaciones d-none" id="btnEsta">
            <div class="text" style=" padding-left: 0px;">Estatus</div>
            <div class="">
                <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                <img id="ValEstatus" src="../img/toggle_on_35px.png" onclick="javascript:valStatusTipoEsp();">
            </div>
        </div>
    </div>


    <div class="contTabla-especificaciones d-none" id="TablaTipoEsp">
        <div class="tabla-container-especificaciones">
            <table id="tabla-MaterialesCatalogo">
                <thead>
                    <tr>
                        <th style="width: 8rem;">
                            ID
                        </th>
                        <th>
                            Especificación
                        </th>
                        <th style="width: 100px;">
                            <div style="display: flex; min-width: 144px; justify-content: space-between;">
                                <span>Acciones</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody id="table-bodyTipoEsp">
                    <td colspan="3">Sin resultados</td>
                    <!-- Aquí se llenará con los registros -->
                </tbody>
            </table>
        </div>
    </div>
</div>




<!-- Modal insertar especificaciones -->
<div class="modal fade modal-especificaciones" id="AgregarModalEspecificaciones" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog_especificaciones">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0px;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030; padding-left: 1rem;">Agregar
                    especificación</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-especificaciones" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>

            <div class="modal-body modal-body-conceptos">
                <h1 class="modal-title fs-5" id="lblRequerido" style="color: #303030;">Es requerido: *</h1>


                <div class="seccion-fami-espe-id">
                    <div style="display: flex; flex-wrap: wrap;">
                        <label for="unidadInput" class="form-label" id="lblFam"
                            style="color: #303030; align-content: end; margin-right: .5rem;">Familia*</label>
                        <div>
                            <select class="form-select inputLleno" id="addFamilia"
                                onblur="javascript:CompruebaTieneAlgoInput(this);"
                                onchange="javascript:seleccionarFamilia();">
                                <option value="" selected>Seleccione una familia</option>
                                <option value="1">Redes aéreas</option>
                                <option value="2">Redes subterráneas</option>
                            </select>
                        </div>
                    </div>
                    <div style="display: flex; flex-wrap: wrap;">
                        <label for="idInput" class="form-label" id="lblEsp"
                            style="color: #303030; align-content: end; margin-right: .5rem;">Especificación*</label>
                        <div>
                            <input type="text" class="form-control inputLleno"
                                style="font-family: 'latoBold', sans-serif; width: 50rem;" id="addNombreEspecificacion"
                                onblur="javascript:CompruebaTieneAlgoInput(this);">
                        </div>
                    </div>
                    <div style="display: flex; flex-wrap: wrap;">
                        <label for="idInput" class="form-label"
                            style="color: #303030; align-content: end; margin-right: .5rem;">ID</label>
                        <div>
                            <input type="text" class="form-control inputLleno"
                                style="font-family: 'latoBold', sans-serif;" id="AddidCodigoInput" disabled
                                onblur="javascript:CompruebaTieneAlgoInput(this);">
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;" id="lblDes">Descripción*</label>
                    <textarea type="text" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        class="form-control inputLleno" id="AddDescripcionInput" rows="17"></textarea>
                </div>
            </div>

            <div class="contTabla-especificaciones" style="margin-top: 0; padding-top: 0.5rem;">
                <div class="titulo-especificaciones" style="margin-left: 0px; padding-top: 0px;">
                    <nav class="pSeccion-especificaciones">
                        <div>Conceptos</div>
                        <div>
                            <!-- Button without data-bs-toggle/data-bs-target -->
                            <button type="button" onclick="AbrirModalConceptoEspecificacion()"
                                class="btn fa-solid-agregar-especificaciones" id="btnAgregarCon">Agregar</button>
                            <div id="LecturaConcepto" style="display: none;">Hay un concepto inactivo</div>
                        </div>
                    </nav>
                </div>
                <div class="tabla-container tabla-container-materialesmodal_catalogo">
                    <table id="tabla-MaterialesCatalogo">
                        <thead class="">
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
                                        <select class="form-select form-select-sm ml-2 d-none"
                                            id="selectUnidadConceptoPrincipal"
                                            style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                            <option value="" selected>Todo</option>
                                            <option value="Estructuras">Estructura</option>
                                            <option value="PZA">PZA</option>
                                        </select>
                                    </div>
                                </th>
                                <th style="width: 100px;">
                                    <div style="display: flex; min-width: 144px; justify-content: space-between;">
                                        <span>Acciones</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody id="table-bodyConceptoEspecificacionPrincipal">
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
                <div style="text-align: end;"><button type="button" class="btn fa-solid-agregar-especificaciones"
                        style="margin: 0 0 1rem 0" onclick="javascript:AddTipoValidar();"
                        id="btnGuardarModalTipoEsp">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>



<!-- Modal insertar conceptos -->
<div class="modal fade modal-especificaciones" id="AgregarModalConceptoEspecificaciones" data-bs-backdrop="static"
    data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog_catalogo">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0px;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030; padding:0px 0px 0px 1rem;">
                    Agregar conceptos</h1>

                <button type="button" class="fa-solid fa-xmark btnclose-especificaciones" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="label-container-materiales_catalogo">
                <input type="text" placeholder="Buscar" id="search-inputConceptoEps">
                <i class="fas fa-search icon-materiales" id="searchIcon"></i>
            </div>
            <div class="pagRegistrosespecificaciones">
                <nav class="pSeccion">
                    <div class="cantregespecificaciones">
                        <div class="text1">Mostrar</div>
                        <select class="cantregistrosespecificaciones" id="rows-per-pageModalSeg">
                            <option value="10" selected>10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <div class="text2">Registros </div>
                    </div>

                    <ul class="pagination" id="paginationModalSeg">
                        <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                        <li class="page-item active"></li>
                    </ul>
                </nav>
            </div>

            <div class="contTabla-conceptosmodal_especificaciones">
                <div class="tabla-container-concepto-especificaciones">
                    <table id="tabla-MaterialesCatalogo">
                        <thead>
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
                            </tr>
                        </thead>
                        <tbody id="table-bodyEspecificacionesModal">
                            <td colspan="8">Sin resultados</td>
                        </tbody>
                    </table>
                    <div class="sk-circle" id="cargaModal">
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

            <div class="contTabla-conceptosmodal_especificaciones" style="margin-top: 0;">
                <label for=""
                    style=" font-family: 'LatoBold', sans-serif; color: #303030; font-size: 1.2rem; ">Conceptos
                    seleccionados</label>
                <div class="tabla-container-concepto-especificaciones">
                    <table id="tabla-MaterialesCatalogo">
                        <thead>
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
                                        <select class="form-select d-none form-select-sm ml-2"
                                            id="selectUnidadConceptoModal"
                                            style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                            <option value="" selected>Todo</option>
                                            <option value="Estructuras">Estructura</option>
                                            <option value="PZA">PZA</option>
                                        </select>
                                    </div>
                                </th>
                                <th style="width: 100px;">
                                    <div style="display: flex; min-width: 144px; justify-content: space-between;">
                                        <span>Acciones</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody id="table-bodyEspecificacionesModal2">
                            <td colspan="8">Sin resultados</td>
                        </tbody>
                    </table>
                </div>
                <div style="text-align: end;"><button type="button"
                        onclick="javascript:guardarConceptoSeleccionados();llenarTablaConceptoSeleccionadosP();"
                        class="btn fa-solid-agregar-especificaciones" style="margin: 0 0 1rem 0" data-bs-dismiss="modal"
                        aria-label="Close">Aceptar</button>
                </div>
            </div>
        </div>
    </div>
</div>


<!-- modal para activar el registro de especificaciones -->
<div class="modal" id="confirmActivationModal" tabindex="-1" aria-labelledby="activationModalLabel"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header" style="border: 3px solid #008e5a; border-radius: 5px;">
                <h5 class="modal-title" id="activationModalLabel" style="font-family: 'LatoBold', sans-serif;">
                    ¿Habilitar esta especificación?</h5>
                <button type="button" class="btn" id="confirmActivationButton"
                    onclick="javascript:ActivarCerrarModal(); CambioEstatusTipoEsp();"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif; margin: 0px 1rem 0px 1rem;">Habilitar</button>
                <button type="button" class="btn" data-bs-dismiss="modal"
                    style="background-color: #858585; color: #ffffff; font-family: 'LatoBold', sans-serif;">Cancelar</button>
            </div>
        </div>
    </div>
</div>


<!-- Modal de Confirmación de Eliminación -->
<div class="modal" id="confirmDeleteModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header" style=" border: 3px solid #008e5a; border-radius: 5px;">
                <h5 class="modal-title" id="exampleModalLabel" style="font-family: 'LatoBold', sans-serif;">
                    ¿Deshabilitar esta especificación?</h5>
                <button type="button" class="btn" data-bs-dismiss="modal" onclick="javascript:AbrirModalConfirm();"
                    id="confirmDeleteButton"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif; margin: 0px 1rem 0px 1rem;">Deshabilitar</button>
                <button type="button" class="btn" data-bs-dismiss="modal"
                    style="background-color: #858585; color: #ffffff; font-family: 'LatoBold', sans-serif;">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal de Confirmación Adicional -->
<div class="modal" id="confirmAdditionalModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header"
                style=" border: 3px solid #008e5a; border-radius: 5px; width: 700px; background-color: #ffffff; align-self: center;">
                <h5 class="modal-title" id="exampleModalLabel" style="font-family: 'LatoBold', sans-serif;">¿Está
                    seguro de que desea deshabilitar esta especificación?</h5>
                <button type="button" onclick="javascript:EliminarCerrarModal(); CambioEstatusTipoEsp();" class="btn"
                    id="confirmAdditionalButton"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif; margin: 0px 1rem 0px 1rem;">Confirmar</button>
                <button type="button" class="btn" data-bs-dismiss="modal"
                    style="background-color: #858585; color: #ffffff; font-family: 'LatoBold', sans-serif;">Cancelar</button>
            </div>
        </div>
    </div>
</div>



<!-- Modal Mensaje -->
<div class="centrarMsg modMsgEsconder" id="modalMsgUsuarios">
    <div class="modMsg" id="modUsu">
        <div class="modImg">
            <img id="imgPic" src="../img/imgPalomita.png" alt="Mensaje" height="100%">
        </div>
        <div class="modCon">
            <p id="modParrafo">Hola</p>
        </div>
    </div>
</div>