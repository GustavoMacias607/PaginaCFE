<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}
?>

<div class="fondBlanco">
    <div class="bottom-rectangle-zonas">
        <div class="text-zonas">Zonas</div>
        <button type="button" class="btn btn-agregar-zonas" data-bs-toggle="modal" data-bs-target="#AgregarModal"
            onclick="javascript:AddlimpiarModalZona();">Agregar zona</button>
        <a onclick="opcion('proyecto'); deseleccionar()" class="text-inicio-zonas">
            <div>Ir al inicio</div>
        </a>
    </div>
    <div class="label-container-zonas" style="margin-top: 4.5rem;">
        <form autocomplete="off">
            <input type="text" placeholder="Buscar" id="search-inputZona" placeholder="Buscar" name="no-autocomplete"
                autocomplete="off">
            <i class="fas fa-search icon-zonas" id="searchIcon"></i>
        </form>
    </div>


    <!-- Paginacion  -->
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
                <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                <li class="page-item active"></li>
            </ul>

        </nav>
        <div class="toggle-estatus-zonas">
            <div class="text">Estatus</div>
            <div class="">
                <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                <img id="ValEstatus" src="../img/toggle_on_35px.png" onclick="javascript:valStatusZona();">
            </div>
        </div>
    </div>

</div>



<div class="contTabla-zonas">
    <div class="tabla-container tabla-container-zonas">
        <table id="tabla-zonas">
            <thead class="">
                <tr>
                    <th style="width: 8rem;">
                        ID
                    </th>
                    <th>
                        Zona
                    </th>
                    <th style="width: 18rem;">
                        <div class="d-flex align-items-center">
                            <span>Obra: </span>
                            <select class="form-select form-select-sm ml-2" id="FilterObra"
                                style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                <option value="" selected>Todo</option>
                                <option value="Nueva">Nueva</option>
                                <option value="Mejora red">Mejora de red</option>
                                <option value="Solicitud">Solicitudes</option>
                            </select>
                        </div>
                    </th>
                    <th style="width: 8rem;">
                        C. indirecto
                    </th>
                    <th style="width: 8rem;">
                        Financiamiento
                    </th>
                    <th style="width: 8rem;">
                        Utilidad
                    </th>
                    <th style="width: 8rem;">
                        C. adicionales
                    </th>
                    <th style="width: 100px;">
                        <div style="display: flex; min-width: 144px; justify-content: space-between;">
                            <span>Acciones</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody id="table-bodyZona">
                <td colspan="8">Sin resultados</td>
                <!-- Aquí se llenará con los registros -->
            </tbody>
        </table>
    </div>
</div>

</div>

<!-- Modal insertar zonas -->
<div class="modal modal-zonas fade" id="AgregarModal" tabindex="9999" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar zona</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-zonas" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <form name="no-autocomplete" autocomplete="off">
                <div class="modal-body modal-body-zonas">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                    <div class="mb-3">
                        <label for="idInput" class="form-label" style="color: #303030;">ID</label>
                        <input type="number" class="form-control inputLleno" disabled id="AddidInput"
                            onblur="javascript:CompruebaTieneAlgoInput(this);">
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="nombreInput" class="form-label" style="color: #303030;">Zona*</label>
                            <input type="text" class="form-control inputLleno"
                                onblur="javascript:CompruebaTieneAlgoInput(this)" id="AddZonaInput">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="rolInput" class="form-label" style="color: #303030;">Obra*</label>
                            <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                                id="AddObraInput">
                                <option selected value="">Selecciona una opción</option>
                                <option value="Nueva">Nueva</option>
                                <option value="Mejora de red">Mejora de red</option>
                                <option value="Solicitudes">Solicitudes</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="idInput" class="form-label" style="color: #303030;">C. indirecto*</label>
                            <input type="number" class="form-control inputLleno" id="AddIndirecto"
                                onblur="javascript:CompruebaTieneAlgoInput(this);">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="idInput" class="form-label" style="color: #303030;">Financiamiento*</label>
                            <input type="number" class="form-control inputLleno" id="AddFinanciamiento"
                                onblur="javascript:CompruebaTieneAlgoInput(this); ">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="idInput" class="form-label" style="color: #303030;">Utilidad*</label>
                            <input type="number" class="form-control inputLleno" id="AddUtilidad"
                                onblur="javascript:CompruebaTieneAlgoInput(this);">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="idInput" class="form-label" style="color: #303030;">C. adicionales*</label>
                            <input type="number" class="form-control inputLleno" id="AddAdicionales"
                                onblur="javascript:CompruebaTieneAlgoInput(this); ">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="pdfInput" class="form-label" style="color: #303030;">Añadir PDF</label>
                        <input type="file" class="form-control inputLleno" id="AddpdfInput"
                            style="border: 3px solid #008E5A;">
                    </div>
                    <div class="modal-footer modal-footer-zonas">
                        <button type="button" class="btn btn-primary"
                            style="background-color: #008E5A; border: 3px solid #008E5A;"
                            onclick="javascript:AddZonaValidar();">Guardar</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal modificar zonas-->
<div class="modal modal-zonas fade" id="EditarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Modificar zona</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-zonas" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <form autocomplete="off">
                <input type="text" class="form-control d-none" disabled id="UpdFecha"
                    style="border: 3px solid #008E5A;">
                <div class="modal-body modal-body-zonas">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                    <div class="mb-3">
                        <label for="idInput" class="form-label" style="color: #303030;">ID</label>
                        <input type="text" class="form-control" disabled id="UpdidInput"
                            style="border: 3px solid #008E5A;">
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="nombreInput" class="form-label" style="color: #303030;">Zona*</label>
                            <input type="text" class="form-control inputLleno" id="UpdZonaInput"
                                onblur="javascript:CompruebaTieneAlgoInput(this)">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="urolInput" class="form-label" style="color: #303030;">Obra*</label>
                            <select class="form-select inputLleno" id="UpdObraInput"
                                onblur="javascript:CompruebaTieneAlgoInput(this)">
                                <option selected value="">Selecciona una opción</option>
                                <option value="Nueva">Nueva</option>
                                <option value="Mejora de red">Mejora de red</option>
                                <option value="Solicitudes">Solicitudes</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="idInput" class="form-label" style="color: #303030;">C. indirecto*</label>
                            <input type="text" class="form-control" id="UpdIndirecto"
                                onblur="javascript:CompruebaTieneAlgoInput(this)" style="border: 3px solid #008E5A;">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="idInput" class="form-label" style="color: #303030;">Financiamiento*</label>
                            <input type="text" class="form-control" onblur="javascript:CompruebaTieneAlgoInput(this)"
                                id="UpdFinanciamiento" style="border: 3px solid #008E5A;">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="idInput" class="form-label" style="color: #303030;">Utilidad*</label>
                            <input type="text" class="form-control" onblur="javascript:CompruebaTieneAlgoInput(this)"
                                id="UpdUtilidad" style="border: 3px solid #008E5A;">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="idInput" class="form-label" style="color: #303030;">C. adicionales*</label>
                            <input type="text" class="form-control" onblur="javascript:CompruebaTieneAlgoInput(this)"
                                id="UpdAdicionales" style="border: 3px solid #008E5A;">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="pdfInput" class="form-label" style="color: #303030;">Añadir PDF</label>
                        <input type="file" class="form-control inputLleno" id="UpdpdfInput"
                            style="border: 3px solid #008E5A;">
                    </div>
                    <div class="modal-footer modal-footer-zonas">
                        <button type="button" class="btn btn-primary"
                            style="background-color: #008E5A; border: 3px solid #008E5A;"
                            onclick="javascript:UpdZonaValidar()">Guardar</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>



<!-- modal para activar el registro de zonas -->
<div class="modal" id="confirmActivationModal" tabindex="-1" aria-labelledby="activationModalLabel"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header" style="border: 3px solid #008e5a; border-radius: 5px;">
                <h5 class="modal-title" id="activationModalLabel" style="font-family: 'LatoBold', sans-serif;">
                    ¿Habilitar esta zona?</h5>
                <button type="button" class="btn" id="confirmActivationButton"
                    onclick="javascript:ActivarCerrarModal(); CambioEstatusZona();"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif;">Habilitar</button>
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
                    ¿Deshabilitar esta zona?</h5>
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
<div class="modal" id="confirmAdditionalModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header"
                style=" border: 3px solid #008e5a; border-radius: 5px; width: 700px; background-color: #ffffff; align-self: center;">
                <h5 class="modal-title" id="exampleModalLabel" style="font-family: 'LatoBold', sans-serif;">¿Está
                    seguro de que desea deshabilitar esta zona?</h5>
                <button type="button" onclick="javascript:EliminarCerrarModal(); CambioEstatusZona();" class="btn"
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