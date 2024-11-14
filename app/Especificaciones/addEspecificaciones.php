<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

    
    

<div class="fondBlanco">
    <div class="bottom-rectangle-especificaciones">
        <div class="text-especificaciones">Especificaciones</div>
        <button type="button" class="btn btn-agregar-especificaciones" data-bs-toggle="modal" data-bs-target="#AgregarModalEspecificaciones"
            onclick="javascript:AddlimpiarModalEspecificaciones();">Agregar Especificación</button>
        <a href="index.php" class="text-inicio-especificaciones">
            <div>Ir al inicio</div>
        </a>
    </div>
    <div class=" label-container-especificaciones">
        <input type="text" placeholder="Buscar" id="search-inputEspecificaciones">
        <i class="fas fa-search icon-especificaciones" id="searchIcon"></i>
    </div>

    <!-- Paginacion  -->
    <div class="pagRegistrosespecificaciones">
        

        <button type="button" class="btn btn-tiposde-especificaciones">Redes áereas</button>
        <button type="button" class="btn btn-tiposde-especificaciones">Redes subterraneas</button>

        <div class="toggle-estatus-especificaciones">
            <div class="text">Estatus</div>
            <div class="">
                <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                <img id="ValEstatus" src="../img/toggle_on_35px.png" onclick="javascript:valStatusConcepto();">
            </div>
        </div>
    </div>
</div>

<div class="contTabla-especificaciones">
    <div class="tabla-container tabla-container-especificaciones">
        <table id="tabla-especificaciones">
            <thead>
                <tr>
                    <th style="width: 8rem;">
                        ID
                    </th>
                    <th>
                        Tipo
                    </th>
                    <th style="width: 100px;">
                        <div style="display: flex; min-width: 144px; justify-content: space-between;">
                            <span>Acciones</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody id="table-bodyEspecificaciones">
                <!-- Aquí se llenará con los registros -->
            </tbody>
            <!-- Primera fila adicional con un label -->
            <tr>
                <td colspan="3">
                    <label for="infoExtra">Descripción:</label>
                </td>
            </tr>

            <!-- Segunda fila adicional -->
            <tr>
                <td colspan="3">
                </td>
            </tr>

            <!-- Repetición de encabezado -->
            <tr>
                <th style="width: 8rem; ">
                    ID
                </th>
                <th>
                    Descripción
                </th>
                <th style="width: 8rem;">
                    Unidad
                </th>
                <th style="width: 8rem;">
                    Precio unitario
                </th>
            </tr>
            <tbody id="table-bodyConceptos">
                <!-- Aquí se llenará con los registros -->
            </tbody>
        </table>
    </div>
</div>


<!-- Modal insertar especificaciones -->
<div class="modal fade modal-especificaciones" id="AgregarModalEspecificaciones"
    data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog_catalogo">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0px;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar especificación</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-especificaciones" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>

            <div class="modal-body modal-body-conceptos">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                

                <div class="seccion-fami-espe-id">
                    <div>
                        <label for="unidadInput" class="form-label" style="color: #303030;">Familia*</label>
                        <div>
                        <input type="text" oninput="mostrarSugerencias(this, 'AddUnidad')"
                            onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno" style="font-family: 'latoBold', sans-serif; width: 19.5rem;" 
                            id="AddunidadInputConcepto" autocomplete="off">
                        <div id="Addsugerencias" class="sugerencias-box" style="font-family: 'latoBold', sans-serif;"></div>
                        </div>
                    </div>
                    <div>
                        <label for="idInput" class="form-label" style="color: #303030;">Especificación*</label>
                        <div>
                        <input type="text" class="form-control inputLleno" style="font-family: 'latoBold', sans-serif; width: 50rem;" id="AddidInputConcepto"
                            onblur="javascript:CompruebaTieneAlgoInput(this);checkConcepto('Add');">
                            </div>
                    </div>
                    <div>
                        <label for="idInput" class="form-label" style="color: #303030; width: 18rem;">ID</label>
                        <div>
                        <input type="text" class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;" id="AddidInputConcepto"
                            onblur="javascript:CompruebaTieneAlgoInput(this);checkConcepto('Add');">
                            </div>
                    </div>
                    </div>
                    <div class="mb-3">
                        <label for="normaInput" class="form-label" style="color: #303030;">Descripción*</label>
                        <textarea type="text" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            class="form-control inputLleno" id="AddnombreInputConcepto" rows="14"></textarea>
                    </div>
            </div>

            <div class="contTabla-especificaciones" style="margin-top: 0;">
            <div class="titulo-especificaciones">
                <nav class="pSeccion-catalogo">
                    <div>Conceptos</div>
                    <div>
                            <!-- Button without data-bs-toggle/data-bs-target -->
                            <button type="button" onclick="AbrirModalConceptoEspecificaciones()"
                                    class="btn fa-solid-agregar-especificaciones">Agregar</button>
                        </div>
                </nav>
            </div>
                <div class="tabla-container tabla-container-materialesmodal_catalogo">
                    <table id="tabla-MaterialesCatalogo">
                        <thead class="">
                            <tr>
                                <th style="width: 8rem;">
                                    ID
                                </th>
                                <th>
                                    Nombre
                                </th>
                                <th style="width: 8rem;">
                                <th >
                                    Unidad
                                </th>
                                <th style="width: 8rem;">
                                    Total
                                </th>
                                <th style="width: 100px;">
                                    <div style="display: flex; min-width: 144px; justify-content: space-between;">
                                        <span>Acciones</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody id="table-bodyConceptosEspecificaciones">
                            <td colspan="8">Sin resultados</td>
                        </tbody>
                    </table>
                </div>
                <div style="text-align: end;"><button type="button"
                        onclick="javascript:guardarConceptosSeleccionados();llenarTablaConceptosSeleccionadosP();"
                        class="btn fa-solid-agregar-especificaciones" style="margin: 0 0 1rem 0" data-bs-dismiss="modal"
                        aria-label="Close">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>



<!-- Modal insertar conceptos -->
<div class="modal fade modal-especificaciones" id="AgregarModalConceptoEspecificaciones" data-bs-backdrop="static"
    data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog_catalogo">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0px;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar conceptos</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-especificaciones" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>

            <div class="pagRegistrosespecificaciones">
                <nav class="pSeccion">
                    <div class="cantregespecificaciones">
                        <div class="text1">Mostrar</div>
                        <select class="cantregistrosespecificaciones" id="rows-per-page">
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
            </div>

            <div class="contTabla-especificaciones">
                <div class="tabla-container tabla-container-materialesmodal_catalogo">
                    <table id="tabla-ConceptosEspecificaciones">
                        <thead class="">
                            <tr>
                                <th style="width: 8rem;">
                                    ID
                                </th>
                                <th>
                                    Nombre
                                </th>
                                <th style="width: 8rem;">
                                    Unidad
                                </th>
                                <th style="width: 9rem;">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody id="table-bodyEspecificacionesModal">
                            <td colspan="8">Sin resultados</td>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="contTabla-materialesmodal_catalogo" style="margin-top: 0;">
                <label for=""
                    style=" font-family: 'LatoBold', sans-serif; color: #303030; font-size: 1.2rem; ">Conceptos
                    seleccionados</label>
                <div class="tabla-container tabla-container-materialesmodal_catalogo">
                    <table id="tabla-ConceptosEspecificaciones">
                        <thead class="">
                            <tr>
                                <th style="width: 8rem;">
                                    ID
                                </th>
                                <th>
                                    Nombre
                                </th>
                                <th style="width: 8rem;">
                                    Unidad
                                </th>
                                <th style="width: 9rem;">
                                    Total
                                </th>
                                <th style="width: 100px;">
                                    <div style="display: flex; min-width: 144px; justify-content: space-between;">
                                        <span>Acciones</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody id="table-bodyEspecificacionesModal2">
                            <td colspan="8">Sin resultados</td>
                        </tbody>
                    </table>
                </div>
                <div style="text-align: end;"><button type="button"
                        onclick="javascript:guardarConceptosSeleccionados();llenarTablaConceptosSeleccionadosP();"
                        class="btn fa-solid-agregar-especificaciones" style="margin: 0 0 1rem 0" data-bs-dismiss="modal"
                        aria-label="Close">Aceptar</button>
                </div>
            </div>
        </div>
    </div>
</div>


    

    



    


