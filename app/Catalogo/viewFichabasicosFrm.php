<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>
<div class="fondBlancoCatalogo">
    <div class="bottom-rectangle-Catalogo">
        <div class="text-Catalogo">Agregar catálogo</div>
        <a href="index.php" class="text-inicio-Catalogo">
            <div>Ir al inicio</div>
        </a>
    </div>
</div>

<div class="contenidoagg-catalogo">

    <div class="titulo-concepto">
        <nav class="pSeccion-catalogo">
            <div>Concepto</div>
        </nav>
        <div class="btncancelarconcepto"><button type="button" class="btn fa-solid-cancelar"
                onclick="javascript:pantallaIr()">Cancelar</button></div>
    </div>
    <div class="contTabla-conceptoscatalogo">
        <div class="tabla-container tabla-container-conceptosCatalogo">
            <table id="tabla-conceptosCatalogo">
                <thead class="">
                    <tr>
                        <th style="width: 8rem;">
                            ID
                        </th>
                        <th style="width: 28rem;">
                            Nombre
                        </th>
                        <th style="width: 8rem;">
                            Unidad
                        </th>
                        <th>
                            Familia
                        </th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>


    <div class="titulo-materiales">
        <nav class="pSeccion-catalogo">
            <div>Materiales</div>
            <div><button type="button" onclick="javascript:AbrirModalMaterialesTarjeta();"
                    class="btn fa-solid-agregar-materiales">Agregar</button></div>
            <div id="LecturaMaterial" style="display: none;">Hay un material Inactivo</div>

        </nav>
    </div>

    <div class="contTabla-materialescatalogo">
        <div class="tabla-container tabla-container-materialescatalogo">
            <table id="tabla-materiales">
                <thead class="">
                    <tr>
                        <th style="width: 8rem;">
                            ID
                        </th>
                        <th style="width: 38rem;">
                            Descripción
                        </th>
                        <th class=" col-1" style="width: 10rem">
                            <div class="d-flex align-items-center">
                                <span>Unidad: </span>
                                <select class="form-select form-select-sm ml-2" id="selectUnidadMaterialesPrincipal"
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
                        <th style="width: 8rem;">
                            Precio U
                        </th>
                        <th style="width: 8rem;">
                            Cantidad
                        </th>
                        <th style="width: 11rem;">
                            Suministrado por CFE
                        </th>
                        <th style=" width: 9rem;">
                            Importe
                        </th>
                    </tr>
                </thead>
                <tbody id="table-bodyMaterialesTarjetaPrincipal">
                    <td colspan="8">Sin resultados</td>
                </tbody>
            </table>
        </div>
    </div>
    <div class="grid-container">
        <label class="subtotales_textos">Suma:</label>
        <div>
            <label id="Suma1" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>

    <div class="titulo-materiales">
        <nav class="pSeccion-catalogo">
            <div>Mano de obra</div>
            <div><button type="button" onclick="javascript:AbrirModalManoObraTarjeta();"
                    class="btn fa-solid-agregar-materiales" data-bs-toggle="modal"
                    data-bs-target="#AgregarModalManodeobraesConcepto">Agregar</button></div>
            <div id="LecturaManoObra" style="display: none;">Hay una mano de obra inactiva</div>

        </nav>
    </div>

    <div class="contTabla-materialescatalogo">
        <div class="tabla-container tabla-container-materialescatalogo">
            <table id="tabla-manodeobra">
                <thead>
                    <tr>
                        <th style="width: 16%;">
                            ID
                        </th>

                        <th class=" col-1" style="width: 16%;">
                            <div class="d-flex align-items-center">
                                <span>Categoría: </span>
                                <select id="selectCategoriaManoObraPrincipal" class="form-select form-select-sm ml-2"
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
                                <select class="form-select form-select-sm ml-2" id="selectUnidadManoObraPrincipal"
                                    style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                    <option value="">Todo</option>
                                    <option value="JOR">JOR</option>
                                    <!-- Agrega más opciones según sea necesario -->
                                </select>
                            </div>
                        </th>
                        <th style="width: 8rem;">
                            Salario
                        </th>
                        <th style="width: 8rem;">
                            Cantidad
                        </th>
                        <th style="width: 8rem;">
                            Sr
                        </th>
                        <th style="width: 8rem;">
                            Rendimiento
                        </th>
                        <th style="width: 8rem;">
                            Importe
                        </th>
                    </tr>
                </thead>
                <tbody id="table-bodyManoObraTarjetaPrincipal">
                    <td colspan="8">Sin resultados</td>
                </tbody>
            </table>
        </div>
    </div>
    <div class="grid-container">
        <label class="subtotales_textos">Suma:</label>
        <div>
            <label id="Suma2" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>

    <div class="titulo-materiales" style="display: none;">
        <nav class="pSeccion-catalogo">
            <div>Herramienta y equipo de seguridad</div>
        </nav>
    </div>


    <div class="contTabla-materialescatalogo" style="display: none;">
        <div class=" tabla-container tabla-container-materialescatalogo">
            <table id="tabla-manodeobra">
                <thead>
                    <tr>
                        <th style="width: 28rem;">
                            Descripción
                        </th>
                        <th style="width: 8rem;">
                            Kh o Ks
                        </th>
                        <th style="width: 8rem;">
                            Mo
                        </th>
                        </th>
                        <th style="width: 9rem;">
                            importe
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <td colspan="8">Sin resultados</td>
                </tbody>
            </table>
        </div>
    </div>


    <div class="titulo-materiales">
        <nav class="pSeccion-catalogo">
            <div>Maquinaria</div>
            <div><button type="button" onclick="javascript:AbrirModalMaquinariaTarjeta();"
                    class="btn fa-solid-agregar-materiales" data-bs-toggle="modal"
                    data-bs-target="#AgregarModalMaquinariaesConcepto">Agregar</button></div>
            <div id="LecturaMaquinaria" style="display: none;">Hay una maquinaria inactiva</div>

        </nav>
    </div>
    <div class="contTabla-materialescatalogo">
        <div class="tabla-container tabla-container-materialescatalogo">
            <table id="tabla-maquinaria">
                <thead class="">
                    <tr>
                        <th style="width: 8rem;">
                            ID
                        </th>
                        <th style="width: 8rem;">
                            Descripción
                        </th>
                        <th class=" col-1" style="width: 8rem;">
                            <div class="d-flex align-items-center">
                                <span>Unidad: </span>
                                <select class="form-select form-select-sm ml-2" id="selectUnidadMaquinariaPrincipal"
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
                            RhM
                        </th>
                        <th style="width: 9rem;">
                            Importe
                        </th>
                    </tr>
                </thead>
                <tbody id="table-bodyMaquinariaTarjetaPrincipal">
                    <td colspan="8">Sin resultados</td>
                </tbody>
            </table>
        </div>
    </div>

    <div class="grid-container">
        <label class="subtotales_textos">Suma:</label>
        <div>
            <label id="Suma3" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>
    <div style="margin-top: 5rem; margin-bottom: 5rem;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumas" class="subtotales_numeros_top">$0.00</label>
            <button type="button" class="btn fa-solid-Guardar-catalogo"
                onclick="javascript:guardarTablasEnBD()">Guardar</button>
        </div>
    </div>

    <div class="titulo-materiales" style="display: none;">
        <nav class="pSeccion-catalogo">
            <div>Basicos</div>
            <div><button type="button" onclick="javascript:AbrirModalMateriales();"
                    class="btn fa-solid-agregar-materiales">Agregar</button></div>
            <div id="LecturaMaterial" style="display: none;">Hay un material Inactivo</div>

        </nav>
    </div>

    <div class="contTabla-materialescatalogo" style="display: none;">
        <div class="tabla-container tabla-container-materialescatalogo">
            <table id="tabla-basicos">
                <thead class="">
                    <tr>
                        <th style="width: 8rem;">
                            ID
                        </th>
                        <th style="width: 28rem;">
                            Descripción
                        </th>
                        <th class=" col-1" style="width: 8rem;">
                            <div class="d-flex align-items-center">
                                <span>Unidad: </span>
                                <select class="form-select form-select-sm ml-2" id="selectUnidad"
                                    onchange="javacript:GetBasicos();EstablecerPag()"
                                    style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                    <option value="todo" selected>Todo</option>
                                    <option value=""></option>
                                    <option value=""></option>
                                </select>
                            </div>
                        </th>
                        <th style="width: 8rem;">
                            Precio U
                        </th>
                        <th style="width: 8rem;">
                            Cantidad
                        </th>
                        <th style="width: 9rem;">
                            Importe
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <td colspan="8">Sin resultados</td>
                </tbody>
            </table>
        </div>
    </div>

    <div></div>

    <!--<div style="display: grid; grid-template-columns: auto auto auto; gap: 0px; column-gap: 1rem; align-items: center; justify-content: end; margin-bottom: 2rem; margin-right: 2rem;">
        <div style="grid-column: 1;">
        </div>
        <div style="grid-column: 2;">
            <label class="subtotales_textos">Costo directo:</label>
        </div>
        <div style="grid-column: 3;">
            <input type="number" class="subtotales_numeros_top">
        </div>

        <div style="grid-column: 1;">
            <button class="btn anexos">Agregar anexo</button>
        </div>
        <div style="grid-column: 2;">
            <label class="costosadicionales">Costos indirectos:</label>
        </div>
        <div style="grid-column: 3;">
            <input type="number" class="subtotales_numeros_bottom">
        </div>

        <div style="grid-column: 1;"></div>
        <div style="grid-column: 2;">
            <label class="subtotales_textos">Subtotal 1:</label>
        </div>
        <div style="grid-column: 3;">
            <input type="number" class="subtotales_numeros">
        </div>

        <div style="grid-column: 1;">
            <button class="btn anexos">Agregar anexo</button>
        </div>
        <div style="grid-column: 2;">
            <label class="costosadicionales">Financiamiento:</label>
        </div>
        <div style="grid-column: 3;">
            <input type="number" class="subtotales_numeros_bottom">
        </div>

        <div style="grid-column: 1;"></div>
        <div style="grid-column: 2;">
            <label class="subtotales_textos">Subtotal 2:</label>
        </div>
        <div style="grid-column: 3;">
            <input type="number" class="subtotales_numeros">
        </div>

        <div style="grid-column: 1;">
            <button class="btn anexos">Agregar anexo</button>
        </div>
        <div style="grid-column: 2;">
            <label class="costosadicionales">Utilidad:</label>
        </div>
        <div style="grid-column: 3;">
            <input type="number" class="subtotales_numeros_bottom">
        </div>

        <div style="grid-column: 1;"></div>
        <div style="grid-column: 2;">
            <label class="subtotales_textos">Subtotal 3:</label>
        </div>
        <div style="grid-column: 3;">
            <input type="number" class="subtotales_numeros">
        </div>

        <div style="grid-column: 1;">
            <button class="btn anexos">Agregar anexo</button>
        </div>
        <div style="grid-column: 2;">
            <label class="costosadicionales">Cargos adicionales:</label>
        </div>
        <div style="grid-column: 3;">
            <input type="number" class="subtotales_numeros_bottom">
        </div>

        <div style="grid-column: 1;"></div>
        <div style="grid-column: 2;">
            <label class="subtotales_textos">Total:</label>
        </div>
        <div style="grid-column: 3;">
            <input type="number" class="subtotales_numeros_top">
        </div>

            <div style="grid-column: 3; margin-top: 1rem; justify-self: end;">
                <button type="button" class="btn fa-solid-Guardar-catalogo"
                    onclick="javascript:AgregarCatalogoConcepto()">Guardar</button>
            </div>
    </div> -->



</div>

<!-- Modal insertar materiales -->
<div class="modal fade modal-materiales_catalogo" id="AgregarModalMaterialesConcepto" data-bs-backdrop="static"
    data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog_catalogo">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0px;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar materiales</h1>
                <div class="label-container-materiales_catalogo">
                    <input type="text" placeholder="Buscar" id="search-inputMateriales">
                    <i class="fas fa-search icon-materiales" id="searchIcon"></i>
                </div>
                <button type="button" class="fa-solid fa-xmark btnclose-materiales_catalogo" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>

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
            </div>

            <div class="contTabla-materialesmodal_catalogo">
                <div class="tabla-container tabla-container-materialesmodal_catalogo">
                    <table id="tabla-MaterialesCatalogo">
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
                                        <span>Ver imagen</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody id="table-bodyMaterialesTarjetaModal">
                            <td colspan="8">Sin resultados</td>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="contTabla-materialesmodal_catalogo">
                <label for=""
                    style=" font-family: 'LatoBold', sans-serif; color: #303030; font-size: 1.2rem; ">Materiales
                    seleccionados</label>
                <div class="tabla-container tabla-container-materialesmodal_catalogo">
                    <table id="tabla-MaterialesCatalogo">
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
                                <th class=" col-1" style="width: 100px;">
                                    <div class="d-flex align-items-center">
                                        <span>Unidad: </span>
                                        <select class="form-select form-select-sm ml-2" id="selectUnidadMaterialesModal"
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
                        <tbody id="table-bodyMaterialesTarjetaModal2">
                            <td colspan="8">Sin resultados</td>
                        </tbody>
                    </table>
                </div>
                <div style="text-align: end; margin: 1rem"><button type="button"
                        onclick="javascript:llenarTablaMaterialesSeleccionadosP();"
                        class="btn fa-solid-agregar-materiales" data-bs-dismiss="modal"
                        aria-label="Close">Aceptar</button>
                </div>
            </div>

        </div>

    </div>

</div>




<!-- Modal insertar mano de obra -->
<div class="modal fade modal-manodeobra_catalogo" id="AgregarModalManodeobraesConcepto" data-bs-backdrop="static"
    data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog_catalogo">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0px;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar mano de obra
                </h1>
                <div class="label-container-materiales_catalogo">
                    <input type="text" placeholder="Buscar" id="search-inputManoObra">
                    <i class="fas fa-search icon-materiales" id="searchIcon"></i>
                </div>
                <button type="button" class="fa-solid fa-xmark btnclose-materiales_catalogo" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>

            <div class="pagRegistrosmateriales">
                <nav class="pSeccion">
                    <div class="cantregmateriales">
                        <div class="text">Mostrar</div>
                        <select class="cantregistrosmanodeobra" id="rows-per-pageManoObra">
                            <option value="10" selected>10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <div class="text">Registros </div>
                    </div>

                    <ul class="pagination" id="paginationManoObra">
                        <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                        <li class="page-item active"></li>
                    </ul>
                </nav>
            </div>


            <div class="contTabla-materialesmodal_catalogo">
                <div class="tabla-container tabla-container-materialesmodal_catalogo">
                    <table id="tabla-MaterialesCatalogo">
                        <thead>
                            <tr>
                                <th style="width: 16%;">
                                    ID
                                </th>
                                <th class=" col-1" style="width: 16%;">
                                    <div class="d-flex align-items-center">
                                        <span>Categoría: </span>
                                        <select id="categoria-filterManoObra" class="form-select form-select-sm ml-2"
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
                                        <select class="form-select form-select-sm ml-2" id="unidad-filterManoObra"
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
                            </tr>
                        </thead>
                        <tbody id="table-bodyManoObra">
                            <!-- Aquí se llenará con los registros -->
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="contTabla-materialesmodal_catalogo">
                <label for="" style=" font-family: 'LatoBold', sans-serif; color: #303030; font-size: 1.2rem; ">Mano
                    de
                    obra
                    seleccionados</label>
                <div class="tabla-container tabla-container-materialesmodal_catalogo">
                    <table id="tabla-MaterialesCatalogo">
                        <thead>
                            <tr>
                                <th style="width: 16%;">
                                    ID
                                </th>

                                <th class=" col-1" style="width: 16%;">
                                    <div class="d-flex align-items-center">
                                        <span>Categoría: </span>
                                        <select id="selectCategoriaManoObraModal"
                                            class="form-select form-select-sm ml-2"
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
                                        <select class="form-select form-select-sm ml-2" id="selectUnidadManoObraModal"
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
                                <th class="col-1" style="width: 16%;">
                                    <div style="display: flex; min-width: 144px; justify-content: space-between;">
                                        <span>Acciones</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody id="table-bodyManoObraTarjetaModal2">
                            <!-- Aquí se llenará con los registros -->
                        </tbody>
                    </table>
                </div>
                <div style="text-align: end; margin: 1rem"><button type="button"
                        onclick="javascript:llenarTablaManoObraSeleccionadosP(); guardarDatosManoObra();"
                        class="btn fa-solid-agregar-materiales" data-bs-dismiss="modal"
                        aria-label="Close">Aceptar</button>
                </div>
            </div>
        </div>
    </div>
</div>





<!-- Modal insertar maquinaria -->
<div class="modal fade modal-maquinaria_catalogo" id="AgregarModalMaquinariaesConcepto" data-bs-backdrop="static"
    data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog_catalogo">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0px;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar maquinaria</h1>
                <div class="label-container-materiales_catalogo">
                    <input type="text" placeholder="Buscar" id="search-inputMaquinaria">
                    <i class="fas fa-search icon-materiales" id="searchIcon"></i>
                </div>
                <button type="button" class="fa-solid fa-xmark btnclose-materiales_catalogo" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>

            <div class="pagRegistrosmateriales">
                <nav class="pSeccion">
                    <div class="cantregmateriales">
                        <div class="text">Mostrar</div>
                        <select class="cantregistrosmanodeobra" id="rows-per-pageMaquinaria">
                            <option value="10" selected>10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <div class="text">Registros </div>
                    </div>

                    <ul class="pagination" id="paginationMaquinaria">
                        <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                        <li class="page-item active"></li>
                    </ul>
                </nav>
            </div>


            <div class="contTabla-materialesmodal_catalogo">
                <div class="tabla-container tabla-container-materialesmodal_catalogo">
                    <table id="tabla-MaterialesCatalogo">
                        <thead class="">
                            <tr>
                                <th style="width: 8rem;">
                                    ID
                                </th>
                                <th>
                                    Descripción
                                </th>
                                <th class=" col-1" style="width: 200px;">
                                    <div class="d-flex align-items-center">
                                        <span>Unidad: </span>
                                        <select class="form-select form-select-sm ml-2" id="unidad-filterMaquinaria"
                                            style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                            <option value="" selected>Todo</option>
                                            <option value="HR">HR</option>
                                            <option value="%MO">%MO</option>
                                        </select>
                                    </div>
                                </th>
                                <th>PhM
                                </th>
                            </tr>
                        </thead>
                        <tbody id="table-bodyMaquinaria">
                            <td colspan="8">Sin resultados</td>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="contTabla-materialesmodal_catalogo">
                <label for=""
                    style=" font-family: 'LatoBold', sans-serif; color: #303030; font-size: 1.2rem; ">Maquinarias
                    seleccionadas</label>
                <div class="tabla-container tabla-container-materialesmodal_catalogo">
                    <table id="tabla-MaterialesCatalogo">
                        <thead>
                            <tr>
                                <th style="width: 16%;">
                                    ID
                                </th>
                                <th>
                                    Descripción
                                </th>
                                <th class=" col-1" style="width: 16%;">
                                    <div class="d-flex align-items-center">
                                        <span>Unidad: </span>
                                        <select class="form-select form-select-sm ml-2" id="selectUnidadMaquinariaModal"
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
                                <th class="col-1" style="width: 16%;">
                                    <div style="display: flex; min-width: 144px; justify-content: space-between;">
                                        <span>Acciones</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody id="table-bodyMaquinariaTarjetaModal2">
                            <!-- Aquí se llenará con los registros -->
                        </tbody>
                    </table>
                </div>
                <div style="text-align: end; margin: 1rem"><button type="button"
                        onclick="javascript:llenarTablaMaquinariaSeleccionadosP(); guardarDatosMaquinaria()"
                        class="btn fa-solid-agregar-materiales" data-bs-dismiss="modal"
                        aria-label="Close">Aceptar</button>
                </div>
            </div>
        </div>
    </div>
</div>







<!-- Modal insertar basicos -->
<div class="modal fade modal-basicos_catalogo" id="AgregarModalBasicosesConcepto" data-bs-backdrop="static"
    data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog_catalogo">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0px;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar mano de obra
                </h1>
                <div class="label-container-basicos_catalogo">
                    <input type="text" placeholder="Buscar" id="searchInput"
                        oninput="GetBasicosCatalogo();EstablecerPag()">
                    <i class="fas fa-search icon-basicos_catalogo" id="searchIcon"></i>
                </div>
                <button type="button" class="fa-solid fa-xmark btnclose-basicos_catalogo" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>

            <div class="pagRegistroscatalogo">
                <nav class="pSeccion">
                    <div class="cantregbasicos">
                        <select class="cantregistrosbasicos" name="" id="cantRegistros"
                            onchange="javascript:LlenarCatalogoTabla()">
                            <option value="10" selected>10</option>
                        </select>
                    </div>

                    <ul class="pagination" id="pagination-list">
                        <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                        <li class="page-item active"></li>
                    </ul>
                </nav>
            </div>

            <div class="contTabla-basicosmodal_catalogo">
                <div class="tabla-container tabla-container-basicosmodal_catalogo">
                    <table id="tabla-BasicosCatalogo">
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
                                        <select class="form-select form-select-sm ml-2" id="selectUnidad"
                                            onchange="javacript:GetBasicos();EstablecerPag()"
                                            style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                            <option value="todo" selected>Todo</option>
                                            <option value=""></option>
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </th>
                                <th>
                                    Precio
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <td colspan="8">Sin resultados</td>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="contTabla-basicosmodal_catalogo">
                <label for="" style=" font-family: 'LatoBold', sans-serif; color: #303030; font-size: 1.2rem; ">Mano
                    de
                    obra seleccionados</label>
                <div class="tabla-container tabla-container-basicosmodal_catalogo">
                    <table id="tabla-BasicosCatalogo">
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
                                        <select class="form-select form-select-sm ml-2" id="selectUnidad"
                                            onchange="javacript:GetBasicos();EstablecerPag()"
                                            style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                            <option value="todo" selected>Todo</option>
                                            <option value=""></option>
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </th>
                                <th>
                                    Precio
                                </th>
                                <th class="col-1" style="width: 170px;">
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