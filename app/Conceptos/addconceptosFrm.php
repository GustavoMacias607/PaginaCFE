<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

<div class="fondBlancoconceptos">
    <div class="bottom-rectangle-conceptos">
        <div class="text-conceptos esconderBoton" id="textoConceptoNormal">Conceptos</div>
        <div class="text-conceptos esconderBoton" id="textoConceptoBasicos">Básicos</div>
        <button type="button" class="btn btn-agregar-conceptos esconderBoton" id="btnConceptoNormal"
            data-bs-toggle="modal" data-bs-target="#AgregarModal"
            onclick="javascript:AddlimpiarModalConcepto();">Agregar
            concepto</button>
        <button type="button" class="btn btn-agregar-conceptos esconderBoton" data-bs-toggle="modal"
            data-bs-target="#AgregarModalBasi" id="btnConceptoBasicos"
            onclick="javascript:AddlimpiarModalConceptoBasico();">Agregar básico</button>
        <button id="btnExportar" onclick="javascript:Exportar()" class="btn btn-agregar-conceptos esconderBoton">
            Exportar datos a Excel
        </button>
        <button id="btnExportarPDF" onclick="javascript:exportarPDF()" class="btn btn-agregar-conceptos">
            Exportar datos a PDF
        </button>
        <a href="index.php" class="text-inicio-conceptos">
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

        <div class="toggle-estatus-conceptos">
            <div class="text">Estatus</div>
            <div class="">
                <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                <img id="ValEstatus" src="../img/toggle_on_35px.png" onclick="javascript:valStatusConcepto();">
            </div>
        </div>
    </div>

</div>



<div class="contTabla-conceptos">
    <div class="tabla-container tabla-container-conceptos">
        <table id="tabla-conceptos">
            <thead class="">
                <tr>
                    <th style="width: 8rem; ">
                        <button id="sort-id" class="sort-button">
                            ID <i class="fa-solid fa-arrow-up-wide-short"></i>
                        </button>
                    </th>
                    <th>
                        <button id="sort-name" class="sort-button">
                            Nombre <i class="fa-solid fa-arrow-up-wide-short"></i>
                        </button>
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
                    <th id="columFamilia" style="width: 8rem; ">
                        Familia
                    </th>
                    <th style="width: 8rem;">
                        Precio unitario
                    </th>
                    <th style="width: 100px;">
                        <div style="display: flex; min-width: 144px; justify-content: space-between;">
                            <span>Acciones</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody id="table-bodyConceptos">
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


<!-- Modal insertar conceptos -->
<div class="modal modal-conceptos fade" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog" modal-dialog-centered">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar concepto</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-conceptos" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-conceptosbasicos">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <div class="mb-3">
                    <label for="idInput" class="form-label" style="color: #303030;">ID*</label>
                    <input type="text" class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;"
                        id="AddidInputConcepto" onblur="javascript:CompruebaTieneAlgoInput(this);checkConcepto('Add');">
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Nombre*</label>
                    <textarea type="text" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        class="form-control inputLleno" id="AddnombreInputConcepto" rows="4"></textarea>
                </div>
                <div class="mb-3">
                    <label for="unidadInput" class="form-label" style="color: #303030;">Unidad*</label>
                    <input type="text" oninput="mostrarSugerencias(this, 'AddUnidad')"
                        onfocus="mostrarSugerencias(this, 'AddUnidad')"
                        onblur="ocultarSugerencias('AddUnidad');CompruebaTieneAlgoInput(this)"
                        class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;"
                        id="AddunidadInputConcepto" autocomplete="off">
                    <div id="Addsugerencias" class="sugerencias-box" style="font-family: 'latoBold', sans-serif;"></div>
                </div>
                <div class="modal-footer modal-footer-conceptos">
                    <button type="button" class="btn btn-primary"
                        onclick="javascript:AddConceptoValidar();">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal modificar conceptos-->
<div class="modal fade modal-conceptos" id="EditarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Modificar concepto
                </h1>
                <button type="button" class="fa-solid fa-xmark btnclose-conceptos" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-conceptosbasicos">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <input type="text" class="form-control d-none" id="UpdidAnterior" style="border: 3px solid #008E5A;">
                <input type="text" class="form-control d-none" id="UpdTotal" style="border: 3px solid #008E5A;">
                <div class="mb-3">
                    <label for="idInput" class="form-label" style="color: #303030;">ID*</label>
                    <input type="text" class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;"
                        onblur="javascript:CompruebaTieneAlgoInput(this);checkConcepto('upd');" id="UpdidInput">
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Nombre*</label>
                    <textarea type="text" class="form-control inputLleno"
                        onblur="javascript:CompruebaTieneAlgoInput(this)" id="UpdnombreInput" rows="4"></textarea>
                </div>
                <div class="mb-3">
                    <label for="unidadInput" class="form-label" style="color: #303030;">Unidad*</label>
                    <input type="text" oninput="mostrarSugerencias(this, 'UpdUnidad')"
                        onfocus="mostrarSugerencias(this, 'UpdUnidad')"
                        onblur="ocultarSugerencias('UpdUnidad');CompruebaTieneAlgoInput(this)"
                        class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;" id="UpdunidadInput"
                        autocomplete="off">
                    <div id="Updsugerencias" class="sugerencias-box" style="font-family: 'latoBold', sans-serif;"></div>
                </div>
                <div class=" modal-footer modal-footer-conceptos">
                    <button type="button" class="btn btn-primary"
                        onclick="javascript:UpdConceptoValidar()">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal insertar conceptos de basicos -->
<div class="modal modal-conceptos" id="AgregarModalBasi" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog" modal-dialog-centered">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar básico
                </h1>
                <button type="button" class="fa-solid fa-xmark btnclose-conceptos" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-conceptosbasicos">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <div class="mb-3">
                    <label for="idInputConceptoBasico" class="form-label" style="color: #303030;">ID*</label>
                    <input type="text" class="form-control inputLleno" disabled id="idInputConceptoBasico"
                        onblur="javascript:CompruebaTieneAlgoInput(this);">
                </div>
                <div class="mb-3">
                    <label for="normaInputConceptoBasico" class="form-label" style="color: #303030;">Nombre*</label>
                    <textarea type="text" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        class="form-control inputLleno" id="AddnombreInputConceptoBasico" rows="3"></textarea>
                </div>
                <div class="mb-3">
                    <label for="unidadInput" class="form-label" style="color: #303030;">Unidad*</label>
                    <input type="text" oninput="mostrarSugerencias(this, 'AddUnidadBasico')"
                        onfocus="mostrarSugerencias(this, 'AddUnidadBasico')"
                        onblur="ocultarSugerencias('AddUnidadBasico');CompruebaTieneAlgoInput(this)"
                        class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;"
                        id="AddunidadInputConceptoBasico" autocomplete="off">
                    <div id="AddsugerenciasBasico" class="sugerencias-box" style="font-family: 'latoBold', sans-serif;">
                    </div>
                </div>
                <div class="modal-footer modal-footer-conceptos">
                    <button type="button" class="btn btn-primary"
                        onclick="javascript:AddConceptoBasicoValidar();">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Modal modificar conceptos de basicos -->
<div class="modal fade modal-conceptos" id="EditarModalBasi" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog" modal-dialog-centered">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Modificar
                    básico
                </h1>
                <button type="button" class="fa-solid fa-xmark btnclose-conceptos" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-conceptosbasicos">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <input type="text" class="form-control d-none" id="UpdidAnteriorBasico"
                    style="border: 3px solid #008E5A;">
                <input type="text" class="form-control d-none" id="UpdTotalBasicos" style="border: 3px solid #008E5A;">

                <div class="mb-3">
                    <label for="idInput" class="form-label" style="color: #303030;">ID*</label>
                    <input type="text" class="form-control inputLleno" disabled
                        onblur="javascript:CompruebaTieneAlgoInput(this);checkConcepto('upd');" id="UpdidInputBasico">
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Nombre*</label>
                    <textarea type="text" class="form-control inputLleno"
                        onblur="javascript:CompruebaTieneAlgoInput(this)" id="UpdnombreInputBasico" rows="3"></textarea>
                </div>
                <div class="mb-3">
                    <label for="unidadInput" class="form-label" style="color: #303030;">Unidad*</label>
                    <input type="text" oninput="mostrarSugerencias(this, 'UpdUnidadBasico')"
                        onfocus="mostrarSugerencias(this, 'UpdUnidadBasico')"
                        onblur="ocultarSugerencias('UpdUnidadBasico');CompruebaTieneAlgoInput(this)"
                        class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;"
                        id="UpdunidadInputConceptoBasico" autocomplete="off">
                    <div id="UpdsugerenciasBasico" class="sugerencias-box" style="font-family: 'latoBold', sans-serif;">
                    </div>
                </div>
                <div class=" modal-footer modal-footer-conceptos">
                    <button type="button" class="btn btn-primary"
                        onclick="javascript:UpdConceptoBasicoValidar()">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- modal para activar el registro de conceptos -->
<div class="modal" id="confirmActivationModal" tabindex="-1" aria-labelledby="activationModalLabel" aria-hidden="true"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header" style="border: 3px solid #008e5a; border-radius: 5px;">
                <h5 class="modal-title" id="activationModalLabel" style="font-family: 'LatoBold', sans-serif;">
                    ¿Habilitar este concepto?</h5>
                <button type="button" class="btn" id="confirmActivationButton"
                    onclick="javascript:ActivarCerrarModal(); CambioEstatusConcepto();"
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
                    ¿Deshabilitar este concepto?</h5>
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
                    seguro de que desea deshabilitar este concepto?</h5>
                <button type="button" onclick="javascript:EliminarCerrarModal(); CambioEstatusConcepto();" class="btn"
                    id="confirmAdditionalButton"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif; margin: 0 1rem 0 1rem;">Confirmar</button>
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

<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous">
</script>