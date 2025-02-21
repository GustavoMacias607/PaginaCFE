<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>


<div class="fondBlancoCatalogo">
    <div class="bottom-rectangle-Catalogo">
        <div class="text-materiales">Catalogo de conceptos</div>
        <button type="button" class="btn btn-agregar-Proyecto" data-bs-toggle="modal" data-bs-target="#AgregarModal"
            onclick="javascript:AbrirModal();">Editar datos de proyecto</button>
        <button type="button" class="btn btn-agregar-Proyecto d-none" onclick="">Cargar cuadro de dispositivos</button>
        <input type="text" class="form-control inputLleno d-none" id="idUsuario" value="<?= $_SESSION['idusuario'] ?>">
        <a onclick="opcion('proyecto')" class="text-inicio-conceptos">
            <div>Ir al inicio</div>
        </a>
    </div>
    <div>
        <label for=""
            style="color:#303030; font-family: 'LatoBold', sans-serif; margin-left: 2rem; margin-top: 8rem; align-content: center;">Para
            la obra:</label>
        <div style="display: flex; flex-wrap: wrap; margin-top: 6rem; float: right; margin-bottom: 1rem;">
            <label for=""
                style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Id:</label>
            <label for="" id="lblId"
                style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
            <label for=""
                style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Zona:</label>
            <label for="" id="lblZona"
                style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
            <label for=""
                style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Tipo
                de obra:</label>
            <label for="" id="lblTipoObra"
                style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
            <label for=""
                style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Fecha
                posible de inicio:</label>
            <label for="" id="lblFechaInicio"
                style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
            <label for=""
                style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Periodo:</label>
            <label for="" id="lblPeriodo"
                style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
            <label for=""
                style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Fecha
                de término:</label>
            <label for="" id="lblFechaTermino"
                style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
        </div>
    </div>
    <textarea type="text" class="form-control inputLleno" disabled
        style="margin: 0px 2rem 0px 2rem; width: calc(100% - 4rem);" onblur="javascript:CompruebaTieneAlgoInput(this)"
        id="lblNombre" rows="3"></textarea>

    <div class="label-container-zonas">
        <form autocomplete="off">
            <input type="text" placeholder="Buscar" id="search-inputConceptos" placeholder="Buscar"
                name="no-autocomplete" autocomplete="off">
            <i class="fas fa-search icon-zonas" id="searchIcon"></i>
        </form>
    </div>


    <div class="pagRegistroszonas">
        <nav class="pSeccion">
            <div class="cantregzonas">
                <div class="text1">Mostrar</div>
                <select class="cantregistrosmanodeobra" id="rows-per-page">
                    <option value="10" selected>10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <div class="text2">Registros </div>
            </div>

            <ul class="pagination" id="pagination">

                <li class="page-item active"></li>
            </ul>
        </nav>
    </div>
</div>

<div style="padding-top: 27rem;">
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
                        <th style="width: 9rem;">
                            Cantidad
                        </th>
                    </tr>
                </thead>
                <tbody id="table-bodyConceptos">
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
    <div style="margin: 2rem 2rem 2rem 2rem; width: calc(100% - 4rem); display: flex; justify-content: end;">
        <button type="button" class="btn fa-solid-Siguiente-catalogo"
            onclick="javascript:irPresupuesto()">Siguiente</button>
    </div>
</div>
<!-- Modal insertar proyecto -->
<div class="modal modal-maquinaria" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Editar proyecto</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-maquinaria" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-maquinaria">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <div class="row mb-3">
                    <input type="text" class="form-control inputLleno d-none" id="inputTotal" disabled>
                    <div class="col-6">
                        <label for="precioInput" class="form-label" style="color: #303030;">Id</label>
                        <input type="text" class="form-control inputLleno" id="inputIdProyecto" disabled>
                    </div>
                    <div class="col-6">
                        <label for="unidadInput" class="form-label" style="color: #303030;">Zona*</label>
                        <input type="text" class="form-control inputLleno" id="inputZona"
                            oninput="mostrarSugerenciasZonas(this)" onfocus="mostrarSugerenciasZonas(this)"
                            onblur="ocultarSugerenciasZonas();CompruebaTieneAlgoInput(this)" autocomplete="off">
                        <div id="Addsugerencias" class="sugerencias-box" style="font-family: 'latoBold', sans-serif;">
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
                        onclick="javascript:UpdProyectoCatalogo();">Guardar</button>
                </div>
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