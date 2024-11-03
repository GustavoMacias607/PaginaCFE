<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

<div class="fondBlancobasicos">
    <div class="bottom-rectangle-basicos">
        <div class="text-basicos">Materiales basicos</div>
        <button type="button" class="btn btn-agregar-basicos" data-bs-toggle="modal" data-bs-target="#AgregarModal"
            onclick="javascript:AddlimpiarModalBasico();">Agregar material basico</button>
        <a href="index.php" class="text-inicio-basicos">
            <div>Ir al inicio</div>
        </a>
    </div>

    <div class=" label-container-basicos">
        <input type="text" placeholder="Buscar" id="search-inputBasico">
        <i class="fas fa-search icon-basicos" id="searchIcon"></i>
    </div>

    <!-- Paginacion  -->
    <div class="pagRegistrosbasicos">
        <nav class="pSeccion">
            <div class="cantregbasicos">
                <div class="text">Mostrar</div>
                <select class="cantregistrosbasicos" name="" id="rows-per-page">
                    <option value="10" selected>10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <div class="text">Registros </div>
            </div>

            <ul class="pagination" id="pagination">
                <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                <li class="page-item active"></li>
            </ul>

        </nav>
        <div class="toggle-estatus-basicos">
            <div class="text">Estatus</div>
            <div class="">
                <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                <img id="ValEstatus" src="../img/toggle_on_35px.png" onclick="javascript:valStatusBasico();">
            </div>
        </div>
    </div>
</div>
</div>

<div class="contTabla-basicos">
    <div class="tabla-container tabla-container-basicos">
        <table id="tabla-basicos">
            <thead class="">
                <tr>
                    <th>
                        ID
                    </th>
                    <th>
                        Descripción
                    </th>
                    <th class=" col-1" style="width: 200px;">
                        <div class="d-flex align-items-center">
                            <span>Unidad: </span>
                            <select class="form-select form-select-sm ml-2" id="unidad-filterBasico"
                                style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                <option value="" selected>Todo</option>
                                <option value="M3">M3</option>
                                <option value="Poste">Poste</option>
                                <option value="ML">ML</option>
                            </select>
                        </div>
                    </th>
                    <th>
                        Precio
                    </th>
                    <th>
                        Fecha del precio
                    </th>
                    <th class="col-1" style="width: 170px;">
                        <div style="display: flex; min-width: 144px; justify-content: space-between;">
                            <span>Acciones</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody id="table-bodyBasico">
                <td colspan="8">Sin resultados</td>
                <!-- Aquí se llenará con los registros -->
            </tbody>
        </table>
    </div>
</div>


<!-- Modal insertar basicos -->
<div class="modal modal-basicos" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar material basico</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-basicos" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-basicos">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <div class="mb-3">
                    <label for="idInput" class="form-label" style="color: #303030;">ID*</label>
                    <input type="number" class="form-control inputLleno" id="AddidInputBasicos"
                        onblur="javascript:CompruebaTieneAlgoInput(this);checkBasico('Add');">
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Descripción*</label>
                    <input type="text" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno"
                        id="AdddescripcionInputBasicos">
                </div>
                <div class="mb-3">
                    <label for="unidadInput" class="form-label" style="color: #303030;">Unidad*</label>
                    <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="AddUnidadInputBasicos">
                        <option value="" selected>Seleccciona una unidad</option>
                        <option value="M3">M3</option>
                        <option value="Poste">Poste</option>
                        <option value="ML">ML</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="precioInput" class="form-label" style="color: #303030;">Precio</label>
                    <input type="number" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        class="form-control inputLleno" id="AddphmInputBasicos">
                </div>
                <div class="mb-3">
                    <label for="fechaPrecioInput" class="form-label" style="color: #303030;">Fecha de precio</label>
                    <input type="date" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno"
                        id="AddfechaPrecioInput">
                </div>
                <div class="modal-footer modal-footer-basicos">
                    <button type="button" class="btn btn-primary" onclick="javascript:AddBasicoValidar();"
                        style="background-color: #008E5A; border-color: 3px solid #008E5A;">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Modal modificar basicos-->
<div class="modal fade modal-basicos" id="EditarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Modificar material basico
                </h1>
                <button type="button" class="fa-solid fa-xmark btnclose-basicos" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-basicos">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <input type="text" class="form-control d-none" id="UpdidAnteriorBasicos"
                    style="border: 3px solid #008E5A;">

                <div class="mb-3">
                    <label for="idInput" class="form-label" style="color: #303030;">ID*</label>
                    <input type="number" class="form-control inputLleno"
                        onblur="javascript:CompruebaTieneAlgoInput(this);checkBasico('upd');" id="UpdidInput">
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Descripción*</label>
                    <input type="text" class="form-control inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="UpddescripcionInput">
                </div>
                <div class="mb-3">
                    <label for="unidadInput" class="form-label" style="color: #303030;">Unidad*</label>
                    <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="UpdUnidadInputBasicos">
                        <option value="" selected>Seleccciona una unidad</option>
                        <option value="M3">M3</option>
                        <option value="Poste">Poste</option>
                        <option value="ML">ML</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="precioInput" class="form-label" style="color: #303030;">Precio</label>
                    <input type="number" class="form-control inputLleno"
                        onblur="javascript:CompruebaTieneAlgoInput(this)" id="UpdphmInput">
                </div>
                <div class="mb-3">
                    <label for="fechaPrecioInput" class="form-label" style="color: #303030;">Fecha de precio</label>
                    <input type="date" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno"
                        id="UpdfechaPrecioInput">
                </div>
                <div class=" modal-footer modal-footer-basicos">
                    <button type="button" class="btn btn-primary"
                        style="background-color: #008E5A; border-color: #008E5A;"
                        onclick="javascript:UpdBasicoValidar()">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- modal para activar el registro de basicos -->
<div class="modal" id="confirmActivationModal" tabindex="-1" aria-labelledby="activationModalLabel" aria-hidden="true"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header" style="border: 3px solid #008e5a; border-radius: 5px;">
                <h5 class="modal-title" id="activationModalLabel" style="font-family: 'LatoBold', sans-serif;">
                    ¿Habilitar éste material?</h5>
                <button type="button" class="btn" id="confirmActivationButton"
                    onclick="javascript:ActivarCerrarModal(); CambioEstatusBasicos();"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif;">Habilitar</button>
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
                    ¿Deshabilitar éste material?</h5>
                <button type="button" class="btn" data-bs-dismiss="modal" onclick="javascript:AbrirModalConfirm();"
                    id="confirmDeleteButton"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif;">Deshabilitar</button>
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
                    seguro de que desea Deshabilitar éste material?</h5>
                <button type="button" onclick="javascript:EliminarCerrarModal(); CambioEstatusBasicos();" class="btn"
                    id="confirmAdditionalButton"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif; ">Confirmar</button>
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