<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>


<div class="fondBlancomanodeobra">
    <div class="bottom-rectangle-manodeobra">
        <div class="text-manodeobra">Mano de obra</div>
        <button type="button" class="btn btn-agregar-manodeobra" data-bs-toggle="modal" data-bs-target="#AgregarModal"
            onclick="javascript:AddlimpiarModalManoObra();">Agregar mano de obra</button>
        <a href="index.php" class="text-inicio-manodeobra">
            <div>Ir al inicio</div>
        </a>
    </div>

    <div class=" label-container-manodeobra">
        <input type="text" id="search-input" placeholder="Buscar" />
        <i class="fas fa-search icon-manodeobra" id="searchIcon"></i>
    </div>


    <div class="pagRegistrosmanodeobra">
        <nav class="pSeccion">
            <div class="cantregmanodeobra">
                <div class="text">Mostrar</div>
                <select class="cantregistrosmanodeobra" id="rows-per-page">
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
        <div class="toggle-estatus-manodeobra">
            <label for="status-filter" class="text">Estatus</label>
            <div class="">
                <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                <img id="ValEstatus" src="../img/toggle_on_35px.png" onclick="javascript:valStatusManoObra();">
            </div>
        </div>


    </div>
</div>

<div class="contTabla-manodeobra">
    <div class="tabla-container tabla-container-manodeobra">
        <table id="tabla-manodeobra">
            <thead>
                <tr>
                    <th style="width: 16%;">
                        ID
                    </th>

                    <th class=" col-1" style="width: 16%;">
                        <div class="d-flex align-items-center">
                            <span>Categoría: </span>
                            <select id="categoria-filter" class="form-select form-select-sm ml-2"
                                style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                <option value="" selected>Todo</option>
                                <option value="AYUDANTE GENERAL">Ayudante General</option>
                                <option value="OFICIAL ELECTRICISTA">Oficial Electricista</option>
                                <option value="OFICIAL ALBAÑIL">Oficial Albañil</option>
                                <option value="OFICIAL PINTOR">Oficial Pintor</option>
                                <!-- Agrega más opciones según sea necesario -->
                            </select>

                    </th>

                    <th class=" col-1" style="width: 16%;">
                        <div class="d-flex align-items-center">
                            <span>Unidad: </span>
                            <select class="form-select form-select-sm ml-2" id="unidad-filter"
                                style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                <option value="">Todo</option>
                                <option value="JOR">JOR</option>
                                <!-- Agrega más opciones según sea necesario -->
                            </select>
                        </div>
                    </th>
                    <th style="width: 16%;">
                        Salario
                    </th>
                    <th style="width: 16%;">
                        Fecha del salario
                    </th>
                    <th class="col-1" style="width: 16%;">
                        <div style="display: flex; min-width: 144px; justify-content: space-between;">
                            <span>Acciones</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody id="table-body">
                <!-- Aquí se llenará con los registros -->
            </tbody>
        </table>
    </div>
</div>


<!-- Modal insertar manodeobra -->
<div class="modal modal-manodeobra" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar mano de obra</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-manodeobra" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-manodeobra">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <div class="mb-3">
                    <label for="idInput" class="form-label" style="color: #303030;">ID*</label>
                    <input type="number" class="form-control inputLleno" id="AddidInputManodeobra"
                        onblur="javascript:CompruebaTieneAlgoInput(this); checkManoObra('Add')">
                </div>
                <div class="mb-3">
                    <label for="categoriaInput" class="form-label" style="color: #303030;">Categoría*</label>
                    <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this);"
                        id="AddCategoriaInputManodeobra">
                        <option value="" selected>Seleccciona una categoría</option>
                        <option value="AYUDANTE GENERAL">Ayudante General</option>
                        <option value="OFICIAL ELECTRICISTA">Oficial Electricista</option>
                        <option value="OFICIAL ALBAÑIL">Oficial Albañil</option>
                        <option value="OFICIAL PINTOR">Oficial Pintor</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="unidadInput" class="form-label" style="color: #303030;">Unidad*</label>
                    <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="AddUnidadInputManodeobra">
                        <option value="" selected>Seleccciona una unidad</option>
                        <option value="JOR">JOR</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="precioInput" class="form-label" style="color: #303030;">Salario*</label>
                    <input type="number" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        class="form-control inputLleno" id="AddsalarioInputManodeobra">
                </div>
                <div class="mb-3">
                    <label for="AddfechaSalarioInput" class="form-label" style="color: #303030;">Fecha salario</label>
                    <input type="date" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno"
                        id="AddfechaSalarioInput">
                </div>
                <div class="modal-footer modal-footer-manodeobra">
                    <button type="button" class="btn btn-primary" onclick="javascript:AddManoObraValidar();"
                        style="background-color: #008E5A; border: 3px solid #008E5A;">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Modal modificar manodeobra-->
<div class="modal fade modal-manodeobra" id="EditarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Modificar mano de obra
                </h1>
                <button type="button" class="fa-solid fa-xmark btnclose-manodeobra" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-manodeobra">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <input type="text" class="form-control d-none" id="UpdidAnteriorMano"
                    style="border: 3px solid #008E5A;">

                <div class="mb-3">
                    <label for="idInput" class="form-label" style="color: #303030;">ID*</label>
                    <input type="number" class="form-control inputLleno"
                        onblur="javascript:CompruebaTieneAlgoInput(this); checkManoObra('upd')" id="UpdidInput">
                </div>
                <div class="mb-3">
                    <label for="categoriaInput" class="form-label" style="color: #303030;">Categoría*</label>
                    <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="UpdCategoriaInputManodeobra">
                        <option value="" selected>Seleccciona una categoría</option>
                        <option value="AYUDANTE GENERAL">Ayudante General</option>
                        <option value="OFICIAL ELECTRICISTA">Oficial Electricista</option>
                        <option value="OFICIAL ALBAÑIL">Oficial Albañil</option>
                        <option value="OFICIAL PINTOR">Oficial Pintor</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="unidadInput" class="form-label" style="color: #303030;">Unidad*</label>
                    <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="updUnidadInputManodeobra">
                        <option value="" selected>Seleccciona una unidad</option>
                        <option value="JOR">JOR</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="precioInput" class="form-label" style="color: #303030;">Salario*</label>
                    <input type="number" class="form-control inputLleno"
                        onblur="javascript:CompruebaTieneAlgoInput(this)" id="UpdsalarioInput">
                </div>
                <div class="mb-3">
                    <label for="UpdfechaSalarioInput" class="form-label" style="color: #303030;">Fecha salario</label>
                    <input type="date" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno"
                        id="UpdfechaSalarioInput">
                </div>
                <div class=" modal-footer modal-footer-manodeobra">
                    <button type="button" class="btn btn-primary"
                        style="background-color: #008E5A; border: 3px solid #008E5A;"
                        onclick="javascript:UpdManoObraValidar()">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- modal para activar el registro de manodeobra -->
<div class="modal" id="confirmActivationModal" tabindex="-1" aria-labelledby="activationModalLabel" aria-hidden="true"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header" style="border: 3px solid #008e5a; border-radius: 5px;">
                <h5 class="modal-title" id="activationModalLabel" style="font-family: 'LatoBold', sans-serif;">
                    ¿Habilitar ésta mano de obra?</h5>
                <button type="button" class="btn" id="confirmActivationButton"
                    onclick="javascript:ActivarCerrarModal(); CambioEstatusManoObra();"
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
                    ¿Deshabilitar ésta mano de obra?</h5>
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
                    seguro de que desea deshabilitar ésta mano de obra?</h5>
                <button type="button" onclick="javascript:EliminarCerrarModal(); CambioEstatusManoObra();" class="btn"
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