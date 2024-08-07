<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

<div class="fondBlancoconceptos">
    <div class="bottom-rectangle-conceptos">
        <div class="text-conceptos">Conceptos</div>
        <button type="button" class="btn btn-agregar-conceptos" data-bs-toggle="modal" data-bs-target="#AgregarModal"
            onclick="javascript:AddlimpiarModalConcepto();">Agregar
            concepto</button>
        <a href="index.php" class="text-inicio-conceptos">
            <div>Ir al inicio</div>
        </a>
    </div>
    <div class=" label-container-conceptos">
        <input type="text" placeholder="Buscar" id="searchInput" oninput="GetConcepto();EstablecerPag()">
        <i class="fas fa-search icon-conceptos" id="searchIcon"></i>
    </div>


    <!-- Paginacion  -->
    <div class="pagRegistrosconceptos">
        <nav class="pSeccion">

            <div class="cantregconceptos">
                <div class="text">Mostrar</div>
                <select class="cantregistrosconceptos" name="" id="cantRegistros"
                    onchange="javascript:cambiarTamanoConcepto()">
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
        <div class="toggle-estatus-conceptos">
            <div class="text">Estatus</div>
            <div class="">
                <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                <img id="ValEstatus" src="../img/toggle_on_35px.png"
                    onclick="javascript:valStatusConcepto(); javascript:GetConcepto(); javascript:EstablecerPag()">
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
                        <div style="display: flex; gap:10px">
                            <div>ID</div>
                            <div onclick="javascript:filtrarOrden(1);" style="cursor: pointer;"><i id="iconoId"
                                    class="fa-solid fa-chevron-down"></i></div>
                        </div>
                    </th>
                    <th style="width: 28rem;">
                        <div style="display: flex; gap:10px">
                            <div>Nombre</div>
                            <div onclick="javascript:filtrarOrden(2);" style="cursor: pointer;"><i id="iconoNombre"
                                    class="fa-solid fa-chevron-up"></i></div>
                        </div>
                    </th>
                    <th class=" col-1" style="width: 9rem;">
                        <div class="d-flex align-items-center">
                            <span>Tipo: </span>
                            <select class="form-select form-select-sm ml-2" id="selectTipo"
                                onchange="javacript:GetConcepto();EstablecerPag()"
                                style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                <option value="todo" selected>Todo</option>
                                <option value="Retenidas">Retenidas</option>
                                <option value="Sist. Tierra">Sist. Tierra</option>
                                <option value="Cables">Cables</option>
                                <option value="Postes">Postes</option>
                                <option value="Tros´s">Tros´s</option>
                                <option value="Acometidas">Acometidas</option>
                                <option value="Capacitores">Capacitores</option>
                                <option value="Seccionamiento">Seccionamiento</option>
                                <option value="Apartarrayos">Apartarrayos</option>
                                <option value="Alumbrado">Alumbrado</option>
                            </select>
                        </div>
                    </th>
                    <th style="width: 8rem;">
                        Plazo
                    </th>
                    <th class=" col-1" style="width: 8rem;">
                        <div class="d-flex align-items-center">
                            <span>Unidad: </span>
                            <select class="form-select form-select-sm ml-2" id="selectUnidad"
                                onchange="javacript:GetConcepto();EstablecerPag()"
                                style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                <option value="todo" selected>Todo</option>
                                <option value="Estructuras">Estructura</option>
                                <option value="PZA">PZA</option>
                            </select>
                        </div>
                    </th>
                    <th class="col-1" style="width: 100px;">
                        <div style="display: flex; min-width: 144px; justify-content: space-between;">
                            <span>Acciones</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <td colspan="8">Sin resultados</td>
            </tbody>
        </table>
    </div>
</div>


<!-- Modal insertar conceptos -->
<div class="modal modal-conceptos" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar concepto</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-conceptos" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-conceptos">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <div class="mb-3">
                    <label for="idInput" class="form-label" style="color: #303030;">ID*</label>
                    <input type="number" class="form-control inputLleno" id="AddidInputConcepto"
                        onblur="javascript:CompruebaTieneAlgoInput(this);checkConcepto('Add');">
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Nombre*</label>
                    <input type="text" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno"
                        id="AddnombreInputConcepto">
                </div>
                <div class="mb-3">
                    <label for="unidadInput" class="form-label" style="color: #303030;">Tipo*</label>
                    <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="AddtipoInputConcepto">
                        <option value="" selected>Seleccciona un tipo</option>
                        <option value="Retenidas">Retenidas</option>
                        <option value="Sist. Tierra">Sist. Tierra</option>
                        <option value="Cables">Cables</option>
                        <option value="Postes">Postes</option>
                        <option value="Tros´s">Tros´s</option>
                        <option value="Acometidas">Acometidas</option>
                        <option value="Capacitores">Capacitores</option>
                        <option value="Seccionamiento">Seccionamiento</option>
                        <option value="Apartarrayos">Apartarrayos</option>
                        <option value="Alumbrado">Alumbrado</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="precioInput" class="form-label" style="color: #303030;">Plazo*</label>
                    <input type="number" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        class="form-control inputLleno" id="AddplazoInputConcepto">
                </div>
                <div class="mb-3">
                    <label for="unidadInput" class="form-label" style="color: #303030;">Unidad*</label>
                    <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="AddunidadInputConcepto">
                        <option selected value="">Seleccione una unidad</option>
                        <option value="Estructuras">Estructuras</option>
                        <option value="PZA">PZA</option>
                    </select>
                </div>
                <div class="modal-footer modal-footer-conceptos">
                    <button type="button" class="btn btn-primary" onclick="javascript:AddConceptoValidar();"
                        style="background-color: #008E5A; border-color: #008E5A;">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Modal modificar conceptos-->
<div class="modal fade modal-conceptos" id="EditarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Modificar concepto
                </h1>
                <button type="button" class="fa-solid fa-xmark btnclose-conceptos" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <input type="text" class="form-control d-none" id="UpdidAnterior" style="border: 3px solid #008E5A;">

                <div class="mb-3">
                    <label for="idInput" class="form-label" style="color: #303030;">ID*</label>
                    <input type="number" class="form-control inputLleno"
                        onblur="javascript:CompruebaTieneAlgoInput(this);checkConcepto('upd');" id="UpdidInput">
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Nombre*</label>
                    <input type="text" class="form-control inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="UpdnombreInput">
                </div>
                <div class="mb-3">
                    <label for="unidadInput" class="form-label" style="color: #303030;">Tipo</label>
                    <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="UpdTipoInput">
                        <option selected value="">Seleccione un tipo</option>
                        <option value="Retenidas">Retenidas</option>
                        <option value="Sist. Tierra">Sist. Tierra</option>
                        <option value="Cables">Cables</option>
                        <option value="Postes">Postes</option>
                        <option value="Tros´s">Tros´s</option>
                        <option value="Acometidas">Acometidas</option>
                        <option value="Capacitores">Capacitores</option>
                        <option value="Seccionamiento">Seccionamiento</option>
                        <option value="Apartarrayos">Apartarrayos</option>
                        <option value="Alumbrado">Alumbrado</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="precioInput" class="form-label" style="color: #303030;">Plazo*</label>
                    <input type="number" class="form-control inputLleno"
                        onblur="javascript:CompruebaTieneAlgoInput(this)" id="UpdPlazoInput">
                </div>
                <div class="mb-3">
                    <label for="unidadInput" class="form-label" style="color: #303030;">Unidad</label>
                    <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="UpdunidadInput">
                        <option value="" selected>Seleccione una unidad</option>
                        <option value="Estructuras">Estructura</option>
                        <option value="PZA">PZA</option>
                    </select>
                </div>
            </div>
            <div class=" modal-footer modal-footer-conceptos">
                <button type="button" class="btn btn-primary" style="background-color: #008E5A; border-color: #008E5A;"
                    onclick="javascript:UpdConceptoValidar()">Guardar</button>
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
                    ¿Activar este concepto?</h5>
                <button type="button" class="btn" id="confirmActivationButton"
                    onclick="javascript:ActivarCerrarModal(); CambioEstatusConcepto();"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif;">Activar</button>
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
                    ¿Eliminar este concepto?</h5>
                <button type="button" class="btn" data-bs-dismiss="modal" onclick="javascript:AbrirModalConfirm();"
                    id="confirmDeleteButton"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif;">Eliminar</button>
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
                    seguro de que desea eliminar este concepto?</h5>
                <button type="button" onclick="javascript:EliminarCerrarModal(); CambioEstatusConcepto();" class="btn"
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