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

        <a href="index.php" class="text-inicio-materiales">
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
    <div class="tabla-container tabla-container-materiales">
        <table id="tabla-materiales">
            <thead class="">
                <tr>
                    <th style="width: 8rem;">
                        ID
                    </th>
                    <th style="width: 12rem;">
                        Norma
                    </th>
                    <th style="width: 28rem;">
                        Descripción
                    </th>
                    <th style="width: 8rem;">
                        Precio
                    </th>
                    <th style="width: 100px;">
                        Fecha del precio
                    </th>
                    <th clas="col-1" style="width: 100px;">
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
                    <th class=" col-1" style="width: 100px;">
                        <div class="d-flex align-items-center">
                            <span>Unidad: </span>
                            <select class="form-select form-select-sm ml-2" id="selectUnidadMateriales"
                                style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                <option value="" selected>Todo</option>
                                <option value="PZA">PZA</option>
                                <option value="KG">KG</option>
                                <option value="JG">JG</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
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
            <tbody id="table-bodyMateriales">
                <!-- Aquí se llenará con los registros -->
            </tbody>

        </table>
        <input type="file" id="upload" accept=".xlsx, .xls" />
        <button id="btnExportar" onclick="javascript:Exportar()" class="btn btn-success">
            <i class="fas fa-file-excel"></i> Exportar datos a Excel
        </button>
    </div>

</div>


<!-- Modal insertar material -->
<div class="modal modal-materiales fade" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar material</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-materiales" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-materiales">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <div class="mb-3">
                    <label for="idInput" class="form-label" style="color: #303030;">ID*</label>
                    <input type="number" class="form-control inputLleno" id="AddidInput"
                        onblur="javascript:CompruebaTieneAlgoInput(this); checkMaterial('Add');">
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Norma*</label>
                    <input type="text" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno"
                        id="AddnormaInput">
                </div>
                <div class="mb-3">
                    <label for="descripcionInput" class="form-label" style="color: #303030;">Descripción*</label>
                    <textarea class="form-control inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="AdddescripcionInput" rows="3"></textarea>
                </div>
                <div class="mb-3">
                    <label for="precioInput" class="form-label" style="color: #303030;">Precio*</label>
                    <input type="number" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        class="form-control inputLleno" id="AddprecioInput">
                </div>
                <div class="mb-3">
                    <label for="fechaPrecioInput" class="form-label" style="color: #303030;">Fecha de precio</label>
                    <input type="date" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno"
                        id="AddfechaPrecioInput">
                </div>
                <div class="mb-3">
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
                <div class="mb-3">
                    <label for="unidadInput" class="form-label" style="color: #303030;">Unidad*</label>
                    <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="AddunidadInput">
                        <option selected value="">Seleccione una unidad</option>
                        <option value="PZA">PZA</option>
                        <option value="KG">KG</option>
                        <option value="JG">JG</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="imagenInput" class="form-label" style="color: #303030;">Añadir imagen</label>
                    <input type="file" class="form-control inputLleno" id="AddimagenInput"
                        onchange="AddmostrarImagen(this)" style="border: 3px solid #008E5A;">
                </div>
                <img id="AddimagenPreview" src="" alt="Imagen" width="200px"
                    style="border: 3px solid #008e5a; border-radius: 5px; transform: translateX(60%);">
            </div>
            <div class="modal-footer modal-footer-materiales">
                <button type="button" class="btn btn-primary" onclick="javascript:AddMaterialValidar();"
                    style="background-color: #008E5A; border-color: 3px solid #008E5A;">Guardar</button>
            </div>
        </div>
    </div>
</div>






<!-- Modal modificar Material-->
<div class="modal fade modal-materiales fade" id="EditarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Modificar material</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-materiales" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-materiales">
                <input type="text" class="form-control d-none" id="UpdidAnteriorMaterial"
                    style="border: 3px solid #008E5A;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>

                <div class="mb-3">
                    <label for="idInput" class="form-label" style="color: #303030;">ID*</label>
                    <input type="number" class="form-control inputLleno "
                        onblur="javascript:CompruebaTieneAlgoInput(this); checkMaterial('upd');" id="UpdidInput">
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Norma*</label>
                    <input type="text" class="form-control inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="UpdnormaInput">
                </div>
                <div class="mb-3">
                    <label for="descripcionInput" class="form-label" style="color: #303030;">Descripción*</label>
                    <textarea class="form-control inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="UpddescripcionInput" rows="3"></textarea>
                </div>
                <div class="mb-3">
                    <label for="precioInput" class="form-label" style="color: #303030;">Precio*</label>
                    <input type="number" class="form-control inputLleno"
                        onblur="javascript:CompruebaTieneAlgoInput(this)" id="UpdprecioInput">
                </div>
                <div class="mb-3">
                    <label for="fechaPrecioInput" class="form-label" style="color: #303030;">Fecha de precio</label>
                    <input type="date" class="form-control inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="UpdfechaPrecioInput">
                </div>
                <div class="mb-3">
                    <label for="familiaInput" class="form-label" style="color: #303030;">Familia*</label>
                    <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="UpdfamiliaInput">
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
                <div class="mb-3">
                    <label for="unidadInput" class="form-label" style="color: #303030;">Unidad</label>
                    <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="UpdunidadInput">
                        <option selected value="">Seleccione una unidad</option>
                        <option value="PZA">PZA</option>
                        <option value="KG">KG</option>
                        <option value="JG">JG</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="imagenInput" class="form-label" style="color: #303030;">Añadir imagen</label>
                    <input type="file" class="form-control" id="UpdimagenInput" onchange="UpdmostrarImagen(this)"
                        style=" border: 3px solid #008E5A;">
                </div>

                <img id="UpdimagenPreview" src="" width="200px"
                    style="border: 3px solid #008e5a; border-radius: 5px; transform: translateX(60%);">
                <div class=" modal-footer modal-footer-materiales">
                    <button type="button" class="btn btn-primary"
                        style="background-color: #008E5A; border-color: #008E5A;"
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
                    ¿Deshabilitar este material?</h5>
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
                <h5 class="modal-title" id="exampleModalLabel" style="font-family: 'LatoBold', sans-serif;">¿Está
                    seguro de que desea deshabilitar este material?</h5>
                <button type="button" onclick="javascript:EliminarCerrarModal(); CambioEstatus();" class="btn"
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