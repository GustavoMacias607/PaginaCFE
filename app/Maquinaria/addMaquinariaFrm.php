<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>


<div class="fondBlancomaquinaria">
    <div class="bottom-rectangle-maquinaria">
        <div class="text-maquinaria">Maquinaria</div>
        <button type="button" class="btn btn-agregar-maquinaria" data-bs-toggle="modal" data-bs-target="#AgregarModal"
            onclick="javascript:AddlimpiarModalMaquinaria();">Agregar maquinaria</button>
        <a onclick="opcion('proyecto')" class="text-inicio-maquinaria">
            <div>Ir al inicio</div>
        </a>
    </div>
    <div class=" label-container-maquinaria">
        <input type="text" id="search-inputMaqui" placeholder="Buscar">
        <i class="fas fa-search icon-maquinaria" id="searchIcon"></i>
    </div>

    <!-- Paginacion  -->
    <div class="pagRegistrosmaquinaria">
        <nav class="pSeccion">
            <div class="cantregmaquinaria">
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
                <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                <li class="page-item active"></li>
            </ul>

        </nav>
        <div class="toggle-estatus-maquinaria">
            <div class="text">Estatus</div>
            <div class="">
                <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                <img id="ValEstatus" src="../img/toggle_on_35px.png" onclick="javascript:valStatusMaquinaria();">
            </div>
        </div>
    </div>
</div>

<div class="contTabla-maquinaria">
    <div class="tabla-container tabla-container-maquinaria">
        <table id="tabla-maquinaria">
            <thead class="">
                <tr>
                    <th style="width: 8rem;">
                        ID
                    </th>
                    <th>
                        Descripción
                    </th>
                    <th style="width: 9.5rem;">
                        <div class="d-flex align-items-center">
                            <span>Unidad: </span>
                            <select class="form-select form-select-sm ml-2" id="unidad-filterMaqui"
                                style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                <option value="" selected>Todo</option>
                                <option value="HR">HR</option>
                                <option value="%MO">%MO</option>
                            </select>
                        </div>
                    </th>
                    <th style="width: 8rem;">
                        PhM
                    </th>
                    <th style="width: 8rem;">
                        Fecha del PhM</th>

                    <th style="width: 100px;">
                        <div style="display: flex; min-width: 144px; justify-content: space-between;">
                            <span>Acciones</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody id="table-bodyMaquinaria">
                <td colspan="8">Sin resultados</td>
                <!-- Aquí se llenará con los registros -->
            </tbody>
        </table>
    </div>
</div>


<!-- Modal insertar maquinaria -->
<div class="modal modal-maquinaria fade" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar maquinaria</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-maquinaria" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-maquinaria">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <div class="mb-3">
                    <label for="idInput" class="form-label" style="color: #303030;">ID*</label>
                    <input type="text" class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;"
                        id="AddidInputMaquinaria" disabled
                        onblur="javascript:CompruebaTieneAlgoInput(this);checkMaquinaria('Add');">
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Descripción*</label>
                    <textarea type="text" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        class="form-control inputLleno" id="AdddescripcionInputMaquinaria" rows="2"></textarea>
                </div>

                <!-- Nueva fila para Unidad, PhM y Fecha -->
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label for="unidadInput" class="form-label" style="color: #303030;">Unidad*</label>
                        <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            id="AddUnidadInputMaquinaria">
                            <option value="" selected></option>
                            <option value="HR">HR</option>
                            <option value="%MO">%MO</option>
                        </select>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="precioInput" class="form-label" style="color: #303030;">PhM*</label>
                        <input type="number" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            class="form-control inputLleno" id="AddphmInputMaquinaria">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="AddfechaPrecioInput" class="form-label" style="color: #303030;">Fecha de
                            precio</label>
                        <input type="date" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            class="form-control inputLleno" id="AddfechaPrecioInput">
                    </div>
                </div>

                <div class="mb-3">
                    <label for="pdfInput" class="form-label" style="color: #303030;">Añadir PDF</label>
                    <input type="file" class="form-control inputLleno" id="AddpdfInput"
                        style="border: 3px solid #008E5A;">
                </div>
                <div class="modal-footer modal-footer-maquinaria">
                    <button type="button" class="btn btn-primary"
                        onclick="javascript:AddMaquinariaValidar();">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>


<!-- Modal modificar maquinaria -->
<div class="modal fade modal-maquinaria" id="EditarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Modificar maquinaria
                </h1>
                <button type="button" class="fa-solid fa-xmark btnclose-maquinaria" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-maquinaria">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <input type="text" class="form-control d-none" id="UpdidAnteriorMaqui"
                    style="border: 3px solid #008E5A;">

                <div class="mb-3">
                    <label for="idInput" class="form-label" style="color: #303030;">ID*</label>
                    <input type="text" class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;"
                        onblur="javascript:CompruebaTieneAlgoInput(this);checkMaquinaria('upd');" disabled
                        id="UpdidInput">
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Descripción*</label>
                    <textarea type="text" class="form-control inputLleno"
                        onblur="javascript:CompruebaTieneAlgoInput(this)" id="UpddescripcionInput" rows="2"></textarea>
                </div>

                <!-- Fila para Unidad, PhM y Fecha -->
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label for="unidadInput" class="form-label" style="color: #303030;">Unidad*</label>
                        <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            id="UpdUnidadInputMaquinaria">
                            <option value="" selected></option>
                            <option value="HR">HR</option>
                            <option value="%MO">%MO</option>
                        </select>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="precioInput" class="form-label" style="color: #303030;">PhM*</label>
                        <input type="number" class="form-control inputLleno"
                            onblur="javascript:CompruebaTieneAlgoInput(this)" id="UpdphmInput">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="UpdfechaPrecioInput" class="form-label" style="color: #303030;">Fecha de
                            precio</label>
                        <input type="date" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            class="form-control inputLleno" id="UpdfechaPrecioInput">
                    </div>
                </div>

                <div class="mb-3">
                    <label for="pdfInput" class="form-label" style="color: #303030;">Añadir PDF</label>
                    <input type="file" class="form-control inputLleno" id="UpdpdfInput"
                        style="border: 3px solid #008E5A;">
                </div>
                <div class="modal-footer modal-footer-maquinaria">
                    <button type="button" class="btn btn-primary"
                        onclick="javascript:UpdMaquinariaValidar()">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>


<!-- modal para activar el registro de maquinaria -->
<div class="modal" id="confirmActivationModal" tabindex="-1" aria-labelledby="activationModalLabel" aria-hidden="true"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header" style="border: 3px solid #008e5a; border-radius: 5px;">
                <h5 class="modal-title" id="activationModalLabel" style="font-family: 'LatoBold', sans-serif;">
                    ¿Habilitar ésta maquinaria?</h5>
                <button type="button" class="btn" id="confirmActivationButton"
                    onclick="javascript:ActivarCerrarModal(); CambioEstatusMaquinaria();"
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
                    ¿Deshabilitar ésta maquinaria?</h5>
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
                    seguro de que desea deshabilitar ésta maquinaria?</h5>
                <button type="button" onclick="javascript:EliminarCerrarModal(); CambioEstatusMaquinaria();" class="btn"
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