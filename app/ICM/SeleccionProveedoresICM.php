<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}
?>

<div class="fondBlanProveedores">
    <div class="bottom-rectangle-conceptos" style="gap: 1rem;">
        <div class="text-conceptos">Selección proveedores ICM</div>
        <button type="button" class="btn btn-agregar-zonas" data-bs-toggle="modal" data-bs-target="#AgregarModal"
            onclick="javascript:AbrirApartadoAgregar();">Agregar proveedor</button>
        <button type="button" class="btn btn-agregar-zonas" onclick="opcion('SeleccionConceptosICMReturn')">Selección
            conceptos</button>
        <a onclick="opcion('proyecto')" class="text-inicio-conceptos">
            <div>Ir al inicio</div>
        </a>
    </div>
</div>
<div style="padding-top: 5rem;">
    <div class="contenidoBuscador">
        <input type="text" placeholder="Buscar" id="search-Proveedores">
        <i class="fas fa-search icon-conceptos" id="searchIcon"></i>
    </div>
    <div class="pagRegistrosProveedores">
        <nav class="pSeccion">
            <div class="cantregconceptos">
                <div class="text1">Mostrar</div>
                <select class="cantregistrosconceptos" name="" id="rows-per-pageProveedores">
                    <option value="10" selected>10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <div class="text2">Registros </div>
            </div>

            <ul class="pagination" id="paginationProveedores">
                <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                <li class="page-item active"></li>
            </ul>
        </nav>
        <div class="toggle-estatus-materiales">
            <div class="text">Estatus</div>
            <div class="">
                <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                <img id="ValEstatus" src="../img/toggle_on_35px.png" onclick="javascript:valStatusProveedores();">
            </div>
        </div>
    </div>
</div>

<div class="contTabla-proveedores">
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
                    <th style="width: 12rem;">
                        <div style="display: flex; min-width: 144px; justify-content: space-between;">
                            <span>Acciones</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody id="table-bodyProveedoresICM">
                <!-- Aquí se llenará con los registros -->
                <td colspan="8">Sin resultados</td>
            </tbody>
        </table>
    </div>
</div>
<div class="titulo-materiales">
    <nav class="pSeccion-catalogo">
        <div>Propuestas seleccionadas</div>
    </nav>
</div>
<div class="contTabla-catalogo-conceptos">
    <div class="tabla-container-catalogo-conceptos">
        <table id="tabla-conceptos">
            <thead class="">
                <tr>
                    <th>
                        Proveedor
                    </th>
                    <th>
                        Propuesta
                    </th>
                    <th style="width: 10rem;">
                        Fecha
                    </th>
                    <th style="width: 8rem;">
                        Zona
                    </th>
                    <th style="width: 8rem;">
                        Obra
                    </th>
                    <th style="width: 8rem;">
                        Acciones
                    </th>
                </tr>
            </thead>
            <tbody id="table-bodyPropuestasPag">
                <!-- Aquí se llenará con los registros -->
                <td colspan="8">Sin resultados</td>
            </tbody>
        </table>
    </div>
</div>

<div style="margin: 2rem 2rem 2rem 2rem; width: calc(100% - 4rem); display: flex; justify-content: end;">
    <button type="button" class="btn fa-solid-Siguiente-catalogo" onclick="opcion('ICM')">Generar
        ICM</button>
</div>
<div class="modal modal-zonas fade" id="AgregarModal" tabindex="9999" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="tituloProveedores" style="color: #303030; font-weight:bold;">
                </h1>
                <button type="button" class="fa-solid fa-xmark btnclose-zonas" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <form name="no-autocomplete" autocomplete="off">
                <div class="modal-body modal-body-zonas">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030; font-weight:600;">Es
                        requerido: *</h1>
                    <input type="text" class="d-none" id="inputIdProv">
                    <div class="col-md-6 mb-3 w-100">
                        <label for="idInput" class="form-label" style="color: #303030; font-weight:600; ">Nombre
                            proveedor*</label>
                        <textarea class="form-control inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this);"
                            id="txtNombreProveedor"></textarea>
                    </div>
                    <div class="modal-footer modal-footer-zonas">
                        <button type="button" class="btn btn-primary" id="btnGuardarForm"
                            style="background-color: #008E5A; border: 3px solid #008E5A;"
                            onclick="javascript:AddUpdProveedorValidar();">Agregar</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>





<!-- modal para activar el registro de proveedores -->
<div class="modal" id="confirmActivationModal" tabindex="-1" aria-labelledby="activationModalLabel" aria-hidden="true"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header" style="border: 3px solid #008e5a; border-radius: 5px;">
                <h5 class="modal-title" id="activationModalLabel" style="font-family: 'LatoBold', sans-serif;">
                    ¿Habilitar este proveedor?</h5>
                <button type="button" class="btn" id="confirmActivationButton"
                    onclick="javascript:ActivarCerrarModal(); CambioEstatusProveedores();"
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
                    ¿Deshabilitar este proveedor?</h5>
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
                <h5 class="modal-title" id="exampleModalLabel" style="font-family: 'LatoBold', sans-serif;">
                    ¿Está
                    seguro de que desea deshabilitar este proveedor?</h5>
                <button type="button" onclick="javascript:EliminarCerrarModal(); CambioEstatusProveedores();"
                    class="btn" id="confirmAdditionalButton"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif; margin: 0 1rem 0 1rem;">Confirmar</button>
                <button type="button" class="btn" data-bs-dismiss="modal"
                    style="background-color: #858585; color: #ffffff; font-family: 'LatoBold', sans-serif;">Cancelar</button>
            </div>
        </div>
    </div>
</div>


<div class="modal modal-zonas fade" id="AgregarModalPropuesta" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="tituloPropuestas" style="color: #303030; font-weight:bold;">
                    Proveedores
                </h1>
                <button type="button" class="fa-solid fa-xmark btnclose-zonas" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <form name="no-autocomplete" autocomplete="off">
                <div class="modal-body modal-body-zonas">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030; font-weight:600;">Es
                        requerido: *</h1>
                    <input type="text" class="d-none" id="inputIdProv">
                    <div class="col-md-6 mb-3 w-100">
                        <label for="idInput" class="form-label" style="color: #303030; font-weight:600; ">
                            Propuesta*</label>
                        <input type="text" class="form-control inputLleno" style="font-weight:500;" id="addNoPropuesta"
                            onblur="javascript:CompruebaTieneAlgoInput(this); ">
                    </div>
                    <div class="col-md-6 mb-3 w-100">
                        <label for="idInput" class="form-label" style="color: #303030; font-weight:600; ">Fecha*</label>
                        <input type="date" class="form-control inputLleno" id="AddFechaProv"
                            onblur="javascript:CompruebaTieneAlgoInput(this);">
                    </div>
                    <div class="row mb-3">
                        <div class="col-6">
                            <label for="unidadInput" class="form-label" style="color: #303030;">Zona*</label>
                            <input type="text" class="form-control inputLleno" id="inputZona"
                                oninput="mostrarSugerenciasZonas(this)" onfocus="mostrarSugerenciasZonas(this)"
                                onblur="ocultarSugerenciasZonas();CompruebaTieneAlgoInput(this)" autocomplete="off">
                            <div id="Addsugerencias" class="sugerencias-boxZona"
                                style="font-family: 'latoBold', sans-serif;">
                            </div>
                        </div>
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
                    </div>
                    <div class="modal-footer modal-footer-zonas">
                        <button type="button" class="btn btn-primary" id="btnGuardarFormPropuesta"
                            style="background-color: #008E5A; border: 3px solid #008E5A;"
                            onclick="javascript:AgregarPropuesta();">Agregar</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>





<div class="modal fade modal-materiales_catalogo" id="AgregarModalPropuestas" data-bs-backdrop="static"
    data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog_catalogo">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0px;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030; padding:0px 0px 0px 1rem;">
                    Agregar propuesta</h1>
                <div class="label-container-materiales_catalogo">
                    <input type="text" placeholder="Buscar" id="search-Propuestas">
                    <i class="fas fa-search icon-materiales" id="searchIcon"></i>
                </div>
                <button type="button" class="fa-solid fa-xmark btnclose-materiales_catalogo" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>

            <div>

                <button type="button" onclick="abrirModalAddPropuesta();" class="btn fa-solid-agregar-materiales"
                    style="margin-left: 2rem; margin-top: 1rem;">Agregar</button>
                <div class="pagRegistrosconceptos">
                    <nav class="pSeccion">
                        <div class="cantregconceptos">
                            <div class="text1">Mostrar</div>
                            <select class="cantregistrosconceptos" name="" id="rows-per-pagePropuestas">
                                <option value="10" selected>10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <div class="text2">Registros </div>
                        </div>

                        <ul class="pagination" id="paginationPropuestas">
                            <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                            <li class="page-item active"></li>
                        </ul>
                    </nav>
                    <div style="display: flex;">
                        <div class="d-flex align-items-center">
                            <span style="margin-right: .5rem; font-size: 1.1rem;">zona:</span>
                            <select class="form-select form-select-sm ml-2" id="unidad-filterZona"
                                style="font-size: 1.1rem; background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif; width: 8rem;">
                            </select>
                        </div>
                        <div class="d-flex align-items-center" style="margin-left: 1rem;">
                            <span style="margin-right: .5rem; font-size: 1.1rem;">obra: </span>
                            <select class="form-select form-select-sm ml-2" id="unidad-filterObra"
                                style="font-size: 1.1rem; background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                <option value="" selected>Todo</option>
                                <option value="Nueva">Nueva</option>
                                <option value="Mejora de red">Mejora de red</option>
                                <option value="Solicitudes">Solicitudes</option>
                            </select>
                        </div>
                        <div class="d-flex align-items-center" style="margin-left: 1rem;">
                            <span style="margin-right: .5rem; font-size: 1.1rem;">Año: </span>
                            <select class="form-select form-select-sm ml-2" id="filtro-anio"
                                style="font-size: 1.1rem; background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                <option value="" selected>Todo</option>
                            </select>
                        </div>
                    </div>
                    <!-- <div class="toggle-estatus-materiales">
                        <div class="text">Estatus</div>
                        <div class="">
                            <input style="display: none;" type="checkbox" id="ValCheEstaPropuestas" checked>
                            <img id="ValEstatusPropuestas" src="../img/toggle_on_35px.png"
                                onclick="javascript:valStatusPropuestas();">
                        </div>
                    </div> -->
                </div>
                <div class="contTabla-catalogo-conceptos">
                    <div class="tabla-container-catalogo-conceptos">
                        <table id="tabla-conceptos">
                            <thead class="">
                                <tr>
                                    <th>
                                        Propuesta
                                    </th>
                                    <th style="width: 10rem;">
                                        Fecha
                                    </th>
                                    <th style="width: 8rem;">
                                        Zona
                                    </th>
                                    <th style="width: 8rem;">
                                        Obra
                                    </th>
                                    <th style="width: 8rem;">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="table-bodyPropuestas">
                                <!-- Aquí se llenará con los registros -->
                                <td colspan="8">Sin resultados</td>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            <div style="text-align: end; margin-right: 2rem; margin-top: 2rem;"><button type="button"
                    class="btn fa-solid-agregar-materiales" style="margin: 0 0 1rem 0" data-bs-dismiss="modal"
                    aria-label="Close" onclick="displayTablePropuestasICMPagina();">Aceptar</button>
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