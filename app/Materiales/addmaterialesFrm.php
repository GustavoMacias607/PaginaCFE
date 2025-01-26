<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

require("../../scripts/connect.php");
require("../../scripts/Conexion.php");
require("../../scripts/Materiales.php");

?>


<div class="fondBlanco">
    <div class="bottom-rectangle-materiales">
        <div class="text-materiales">Materiales</div>
        <button type="button" class="btn btn-agregar-material" data-bs-toggle="modal" data-bs-target="#AgregarModal"
            onclick="javascript:AddlimpiarModal();">Agregar material</button>

        <button id="btnExportar" onclick="javascript:ExportarMateriales()" class="btn btn-agregar-material">
            Exportar a Excel
        </button>

        <input type="file" id="upload" class="btn btn-agregar-material" accept=".xlsx, .xls" />

        <a onclick="opcion('proyecto')" class="text-inicio-materiales">
            <div>Ir al inicio</div>
        </a>
    </div>
    <div class="label-container-materiales">
        <input type="text" placeholder="Buscar" id="search-inputMateriales">
        <i class="fas fa-search icon-materiales" id="searchIcon"></i>
    </div>


    <!-- Paginacion  -->

    <div class="pagRegistrosmateriales">
        <nav class="pSeccion">
            <div class="cantregmateriales">
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

        <div class="toggle-estatus-materiales">
            <div class="text">Estatus</div>
            <div class="">
                <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                <img id="ValEstatus" src="../img/toggle_on_35px.png" onclick="javascript:valStatus();">
            </div>
        </div>
    </div>
</div>


<div class="contTabla-materiales">
    <div class="tabla-container-materiales">
        <table id="tabla-materiales">
            <thead class="">
                <tr>
                    <th style="width: 8rem;">
                        ID
                    </th>
                    <th style="width: 8rem;">
                        Norma
                    </th>
                    <th>
                        Descripción
                    </th>
                    <th style="width: 8rem;">
                        Precio
                    </th>
                    <th style="width: 9rem;">
                        Fecha del precio
                    </th>
                    <th style="width: 14rem;">
                        <div class="d-flex align-items-center">
                            <span>Familia: </span>
                            <select class="form-select form-select-sm ml-2" id="selectFamiliaMateriales"
                                style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                <option value="" selected>Todo</option>
                                <option value="Sin Clasificacion">Sin clasificación</option>
                                <option value="Accesorios">Accesorios</option>
                                <option value="Aislamiento">Aislamiento</option>
                                <option value="Bobedas">Bobedas</option>
                                <option value="Conductores">Conductores</option>
                                <option value="Ductos">Ductos</option>
                                <option value="Equipos">Equipos</option>
                                <option value="Herrajes">Herrajes</option>
                                <option value="Miselaneos">Miselaneos</option>
                                <option value="Postes">Postes</option>
                                <option value="Pozos">Pozos</option>
                                <option value="Protecciones">Protecciones</option>
                                <option value="Registros">Registros</option>
                                <option value="Seccionamiento">Seccionamiento</option>
                                <option value="Transformadores">Transformadores</option>
                            </select>
                        </div>
                    </th>
                    <th style="width: 9.5rem;">
                        <div class="d-flex align-items-center">
                            <span>Unidad: </span>
                            <select class="form-select form-select-sm ml-2" id="selectUnidadMateriales"
                                style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">

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
            <tbody id="table-bodyMateriales">
                <td colspan="8">Sin resultados</td>
                <!-- Aquí se llenará con los registros -->
            </tbody>
        </table>
    </div>
</div>


<!-- Modal insertar material -->
<div class="modal modal-materiales fade" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar material</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-materiales" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-materiales">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <div class="row mb-3">
                    <div class="col-6">
                        <label for="idInput" class="form-label" style="color: #303030;">ID*</label>
                        <input type="number" class="form-control inputLleno" id="AddidInput"
                            onblur="javascript:CompruebaTieneAlgoInput(this); checkMaterial('Add');">
                    </div>
                    <div class="col-6">
                        <label for="normaInput" class="form-label" style="color: #303030;">Norma*</label>
                        <input type="text" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;"
                            id="AddnormaInput">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="descripcionInput" class="form-label" style="color: #303030;">Descripción*</label>
                    <textarea class="form-control inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="AdddescripcionInput" rows="3"></textarea>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <label for="precioInput" class="form-label" style="color: #303030;">Precio*</label>
                        <input type="number" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            class="form-control inputLleno" id="AddprecioInput">
                    </div>
                    <div class="col-6">
                        <label for="fechaPrecioInput" class="form-label" style="color: #303030;">Fecha de precio</label>
                        <input type="date" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            class="form-control inputLleno" id="AddfechaPrecioInput">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <label for="familiaInput" class="form-label" style="color: #303030;">Familia*</label>
                        <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            id="AddfamiliaInput">
                            <option selected value="">Seleccione una familia</option>
                            <option value="Sin Clasificacion">Sin clasificación</option>
                            <option value="Accesorios">Accesorios</option>
                            <option value="Aislamiento">Aislamiento</option>
                            <option value="Bobedas">Bobedas</option>
                            <option value="Conductores">Conductores</option>
                            <option value="Ductos">Ductos</option>
                            <option value="Equipos">Equipos</option>
                            <option value="Herrajes">Herrajes</option>
                            <option value="Miselaneos">Miselaneos</option>
                            <option value="Postes">Postes</option>
                            <option value="Pozos">Pozos</option>
                            <option value="Protecciones">Protecciones</option>
                            <option value="Registros">Registros</option>
                            <option value="Seccionamiento">Seccionamiento</option>
                            <option value="Transformadores">Transformadores</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <label for="unidadInput" class="form-label" style="color: #303030;">Unidad*</label>
                        <input type="text" oninput="mostrarSugerenciasMateriales(this, 'AddUnidad')"
                            onfocus="mostrarSugerenciasMateriales(this, 'AddUnidad')"
                            onblur="ocultarSugerenciasMateriales('AddUnidad');CompruebaTieneAlgoInput(this)"
                            class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;"
                            id="AddunidadInput" autocomplete="off">
                        <div id="Addsugerencias" class="sugerencias-box" style="font-family: 'latoBold', sans-serif;">
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="imagenInput" class="form-label" style="color: #303030;">Añadir imagen</label>
                    <input type="file" class="form-control inputLleno" id="AddimagenInput"
                        onchange="AddmostrarImagen(this)" style="border: 3px solid #008E5A;">
                </div>
                <img id="AddimagenPreview" src="" alt="Imagen" width="200px"
                    style="border: 3px solid #008e5a; border-radius: 5px; transform: translateX(60%);">

                <div class="modal-footer modal-footer-materiales">
                    <button type="button" class="btn btn-primary"
                        onclick="javascript:AddMaterialValidar();">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>






<!-- Modal modificar Material-->
<div class="modal fade modal-materiales fade" id="EditarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Modificar material</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-materiales" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-materiales">
                <input type="text" class="form-control d-none" id="UpdidAnteriorMaterial"
                    style="border: 3px solid #008E5A;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>

                <div class="row mb-3">
                    <div class="col-6">
                        <label for="idInput" class="form-label" style="color: #303030;">ID*</label>
                        <input type="number" class="form-control inputLleno "
                            onblur="javascript:CompruebaTieneAlgoInput(this); checkMaterial('upd');" id="UpdidInput">
                    </div>
                    <div class="col-6">
                        <label for="normaInput" class="form-label" style="color: #303030;">Norma*</label>
                        <input type="text" class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;"
                            onblur="javascript:CompruebaTieneAlgoInput(this)" id="UpdnormaInput">
                    </div>
                </div>

                <div class="mb-3">
                    <label for="descripcionInput" class="form-label" style="color: #303030;">Descripción*</label>
                    <textarea class="form-control inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="UpddescripcionInput" rows="3"></textarea>
                </div>

                <div class="row mb-3">
                    <div class="col-6">
                        <label for="precioInput" class="form-label" style="color: #303030;">Precio*</label>
                        <input type="number" class="form-control inputLleno"
                            onblur="javascript:CompruebaTieneAlgoInput(this)" id="UpdprecioInput">
                    </div>
                    <div class="col-6">
                        <label for="fechaPrecioInput" class="form-label" style="color: #303030;">Fecha de precio</label>
                        <input type="date" class="form-control inputLleno"
                            onblur="javascript:CompruebaTieneAlgoInput(this)" id="UpdfechaPrecioInput">
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-6">
                        <label for="familiaInput" class="form-label" style="color: #303030;">Familia*</label>
                        <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            id="UpdfamiliaInput">
                            <option value="" selected>Seleccione una familia</option>
                            <option value="Sin Clasificacion">Sin clasificación</option>
                            <option value="Accesorios">Accesorios</option>
                            <option value="Aislamiento">Aislamiento</option>
                            <option value="Bobedas">Bobedas</option>
                            <option value="Conductores">Conductores</option>
                            <option value="Ductos">Ductos</option>
                            <option value="Equipos">Equipos</option>
                            <option value="Herrajes">Herrajes</option>
                            <option value="Miselaneos">Miselaneos</option>
                            <option value="Postes">Postes</option>
                            <option value="Pozos">Pozos</option>
                            <option value="Protecciones">Protecciones</option>
                            <option value="Registros">Registros</option>
                            <option value="Seccionamiento">Seccionamiento</option>
                            <option value="Transformadores">Transformadores</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <label for="unidadInput" class="form-label" style="color: #303030;">Unidad*</label>
                        <input type="text" oninput="mostrarSugerenciasMateriales(this, 'UpdUnidad')"
                            onfocus="mostrarSugerenciasMateriales(this, 'UpdUnidad')"
                            onblur="ocultarSugerenciasMateriales('UpdUnidad');CompruebaTieneAlgoInput(this)"
                            class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;"
                            id="UpdunidadInput" autocomplete="off">
                        <div id="Updsugerencias" class="sugerencias-box" style="font-family: 'latoBold', sans-serif;">
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="imagenInput" class="form-label" style="color: #303030;">Añadir imagen</label>
                    <input type="file" class="form-control" id="UpdimagenInput" onchange="UpdmostrarImagen(this)"
                        style="border: 3px solid #008E5A;">
                </div>

                <img id="UpdimagenPreview" src="" width="200px"
                    style="border: 3px solid #008e5a; border-radius: 5px; transform: translateX(60%);">
                <div class="modal-footer modal-footer-materiales">
                    <button type="button" class="btn btn-primary"
                        onclick="javascript:UpdMaterialValidar()">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>


<!-- modal para activar el registro de materiales -->
<div class="modal" id="confirmActivationModal" tabindex="-1" aria-labelledby="activationModalLabel" aria-hidden="true"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header" style="border: 3px solid #008e5a; border-radius: 5px;">
                <h5 class="modal-title" id="activationModalLabel" style="font-family: 'LatoBold', sans-serif;">
                    ¿Habilitar este material?</h5>
                <button type="button" class="btn" id="confirmActivationButton"
                    onclick="javascript:ActivarCerrarModal(); CambioEstatus();"
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
                    ¿Deshabilitar este material?</h5>
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
                    seguro de que desea deshabilitar este material?</h5>
                <button type="button" onclick="javascript:EliminarCerrarModal(); CambioEstatus();" class="btn"
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

<script>
    window.addEventListener('resize', function() {
        const logoImage = document.getElementById('logoImage');
        const windowWidth = window.innerWidth;
        const originalWidth = logoImage.naturalWidth;

        if (windowWidth < originalWidth) {
            logoImage.src =
                'img/Logocfeverde.png'; // Cambia la ruta por la imagen que deseas mostrar al hacer zoom
            logoImage.alt = 'Otra imagen'; // Cambia el atributo alt de la imagen


        } else {
            logoImage.src = 'img/Logocfelargo.png'; // Vuelve a la imagen original
            logoImage.alt = 'Logo'; // Restaura el atributo alt
        }
    });
</script>