<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

<div class="fondBlanco" style="height: 4rem;">
    <div class="bottom-rectangle-proyecto">
        <div class="text-materiales">Presupuesto</div>
        <button type="button" class="btn btn-agregar-Proyecto" data-bs-toggle="modal" data-bs-target="#AgregarModal"
            onclick="javascript:opcion('addCatConFrm');">Catálogo de conceptos</button>
        <a href="index.php" class="text-inicio-conceptos">
            <div>Ir al inicio</div>
        </a>
    </div>
</div>


<div style="">
    <label for=""
        style="color:#303030; font-family: 'LatoBold', sans-serif; margin-left: 2rem; margin-top: 12rem; align-content: center;">Para
        la obra:</label>
    <div style="display: flex; flex-wrap: wrap; margin-top: 9.8rem; float: right; margin-bottom: 1rem;">
        <label for=""
            style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Id:</label>
        <label for="" id="lblId"
            style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
        <label for=""
            style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Zona:</label>
        <label for="" id="lblZona"
            style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
        <label for=""
            style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Tipo
            de obra:</label>
        <label for="" id="lblTipoObra"
            style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>

        <label for=""
            style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Fecha
            posible de inicio:</label>
        <label for="" id="lblFechaInicio"
            style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
        <label for=""
            style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Periodo:</label>
        <label for="" id="lblPeriodo"
            style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
        <label for=""
            style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Fecha
            de término:</label>
        <label for="" id="lblFechaTermino"
            style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
    </div>
</div>

<textarea type="text" class="form-control inputLleno" disabled
    style="margin: 0px 2rem 0px 2rem; width: calc(100% - 4rem);" onblur="javascript:CompruebaTieneAlgoInput(this)"
    id="lblNombre" rows="4"></textarea>
</div>



<div style="margin: 1rem 2rem 0px 2rem; display: flex; justify-content: space-between;">
    <button id="btnMaterialesSuministrados" class="btnTabla btn fa-solid-Siguiente-catalogo"
        onclick="mostrarTabla('tablaMaterialesSuministrados', this)">Materiales suministrados</button>
    <button id="btnMaterialesNoSuministrados" class="btnTabla btn fa-solid-Siguiente-catalogo"
        onclick="mostrarTabla('tablaMaterialesNoSuministrados', this)">Materiales no suministrados</button>
    <button id="btnManoObra" class="btnTabla btn fa-solid-Siguiente-catalogo"
        onclick="mostrarTabla('tablaManoObra', this)">Mano de obra</button>
    <button id="btnMaquinaria" class="btnTabla btn fa-solid-Siguiente-catalogo"
        onclick="mostrarTabla('tablaMaquinaria', this)">maquinaria</button>
    <button id="btnHerramientas" class="btnTabla btn fa-solid-Siguiente-catalogo"
        onclick="mostrarTabla('tablaHerramientas', this)">herramientas de mano</button>
    <button id="btnEquipoSeguridad" class="btnTabla btn fa-solid-Siguiente-catalogo"
        onclick="mostrarTabla('tablaEquipoSeguridad', this)">Equipo de seguridad</button>
</div>

<!--tabla materiales suministrados por cfe-->
<div id="tablaMaterialesSuministrados" style="display: none;">
    <div class="contTabla-catalogo-conceptos">
        <div class="tabla-container-catalogo-conceptos">
            <table id="tabla-conceptos">
                <thead class="">
                    <tr>
                        <th style="width: 8rem;">
                            ID
                        </th>
                        <th>
                            Descripción
                        </th>
                        <th style="width: 10rem;">
                            <div class="d-flex align-items-center">
                                <span>Unidad</span>
                                <select class="form-select form-select-sm ml-2" id="unidad-filterConcepto"
                                    style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif; display: none;">
                                    <option value="" selected>Todo</option>
                                </select>
                            </div>
                        </th>
                        <th style="width: 8rem;">
                            Precio U
                        </th>
                        <th style="width: 8rem;">
                            Cantidad
                        </th>
                        <th style="width: 8rem;">
                            Importe
                        </th>
                    </tr>
                </thead>
                <tbody id="table-bodyMaterialesSuministrados">
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
    <div style="padding-top: 1rem; margin-bottom: 5rem; display: block;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumaMaterialesSi" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>
</div>

<!--tabla materiales no suministrados por cfe-->
<div id="tablaMaterialesNoSuministrados" style="display: none;">
    <div class="contTabla-catalogo-conceptos">
        <div class="tabla-container-catalogo-conceptos">
            <table id="tabla-conceptos">
                <thead class="">
                    <tr>
                        <th style="width: 8rem;">
                            ID
                        </th>
                        <th>
                            Descripción
                        </th>
                        <th style="width: 10rem;">
                            <div class="d-flex align-items-center">
                                <span>Unidad</span>
                                <select class="form-select form-select-sm ml-2" id="unidad-filterConcepto"
                                    style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif; display: none;">
                                    <option value="" selected>Todo</option>
                                </select>
                            </div>
                        </th>
                        <th style="width: 8rem;">
                            Precio U
                        </th>
                        <th style="width: 8rem;">
                            Cantidad
                        </th>
                        <th style="width: 8rem;">
                            Importe
                        </th>
                    </tr>
                </thead>
                <tbody id="table-bodyMaterialesNosuministrados">
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
    <div style="padding-top: 1rem; margin-bottom: 5rem; display: block;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumaMaterialesNo" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>
</div>
<!--tabla mano de obra-->
<div id="tablaManoObra" style="display: none;">
    <div class="contTabla-catalogo-conceptos">
        <div class="tabla-container-catalogo-conceptos">
            <table id="tabla-conceptos">
                <thead class="">
                    <tr>
                        <th style="width: 8rem;">
                            ID
                        </th>
                        <th>
                            Categoría
                        </th>
                        <th style="width: 10rem;">
                            <div class="d-flex align-items-center">
                                <span>Unidad</span>
                                <select class="form-select form-select-sm ml-2" id="unidad-filterConcepto"
                                    style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif; display: none;">
                                    <option value="" selected>Todo</option>
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
                            Importe
                        </th>
                    </tr>
                </thead>
                <tbody id="table-bodyManoObra">
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
    <div style="padding-top: 1rem; margin-bottom: 5rem; display: block;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumaManoObra" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>
</div>
<!--tabla maquinaria-->
<div id="tablaMaquinaria" style="display: none;">
    <div class="contTabla-catalogo-conceptos">
        <div class="tabla-container-catalogo-conceptos">
            <table id="tabla-conceptos">
                <thead class="">
                    <tr>
                        <th style="width: 8rem;">
                            ID
                        </th>
                        <th>
                            Descripción
                        </th>
                        <th style="width: 10rem;">
                            <div class="d-flex align-items-center">
                                <span>Unidad</span>
                                <select class="form-select form-select-sm ml-2" id="unidad-filterConcepto"
                                    style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif; display: none;">
                                    <option value="" selected>Todo</option>
                                </select>
                            </div>
                        </th>
                        <th style="width: 8rem;">
                            PhM
                        </th>
                        <th style="width: 8rem;">
                            RhM
                        </th>
                        <th style="width: 8rem;">
                            Importe
                        </th>
                    </tr>
                </thead>
                <tbody id="table-bodyMaquinaria">
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
    <div style="padding-top: 1rem; margin-bottom: 5rem; display: block;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumaMaquinaria" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>
</div>

<!--tabla herramienta de mano-->
<div id="tablaHerramientas" style="display: none;">
    <div class="contTabla-catalogo-conceptos">
        <div class="tabla-container-catalogo-conceptos">
            <table id="tabla-conceptos">
                <thead class="">
                    <tr>
                        <th>
                            Descripción
                        </th>
                        <th style="width: 8rem;">
                            Kh
                        </th>
                        <th style="width: 8rem;">
                            Mano de obra
                        </th>
                        <th style="width: 8rem;">
                            Importe
                        </th>
                    </tr>
                </thead>
                <tbody id="table-bodyHerramientas">
                    <tr class="fila">
                        <td class="Code">Herramientas de mano</td>
                        <td id="KhHerramientas">0.03</td>
                        <td id="ActualizarPrecioMoHerramientas">0</td>
                        <td id="importeHerramientas">0</td>
                    </tr>
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
    <div style="padding-top: 1rem; margin-bottom: 5rem; display: block;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumaHerramientas" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>
</div>

<!--tabla equipo de seguridad-->
<div id="tablaEquipoSeguridad" style="display: none;">
    <div class="contTabla-catalogo-conceptos">
        <div class="tabla-container-catalogo-conceptos">
            <table id="tabla-conceptos">
                <thead class="">
                    <tr>
                        <th>
                            Descripción
                        </th>
                        <th style="width: 8rem;">
                            Ks
                        </th>
                        <th style="width: 8rem;">
                            Mano de obra
                        </th>
                        <th style="width: 8rem;">
                            Importe
                        </th>
                    </tr>
                </thead>
                <tbody id="table-bodyEquipoSeguridad">
                    <tr class="fila">
                        <td class="Code">Equipo y seguridad</td>
                        <td id="KhEquipo">0.02</td>
                        <td id="ActualizarPrecioMoEquipo">0</td>
                        <td id="importeEquipo">0</td>
                    </tr>
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
    <div style="padding-top: 1rem; margin-bottom: 5rem; display: block;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumaEquipo" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>
</div>

<div class="label-container-zonas">
    <form autocomplete="off">
        <input type="text" placeholder="Buscar" id="search-inputConceptos" placeholder="Buscar" name="no-autocomplete"
            autocomplete="off">
        <i class="fas fa-search icon-zonas" id="searchIcon"></i>
    </form>
</div>
<!-- Paginacion  -->
<div class="pagRegistroszonas d-none">
    <nav class="pSeccion">
        <div class="cantregzonas">
            <div class="text1">Mostrar</div>
            <select class="cantregistrosmanodeobra" id="rows-per-pageCon">
                <option value="10" selected>10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
            <div class="text2">Registros </div>
        </div>

        <ul class="pagination" id="paginationCon">
            <!-- Aquí se agregarán dinámicamente los enlaces de página -->
            <li class="page-item active"></li>
        </ul>

    </nav>
</div>
<div>
    <div class="contTabla-catalogo-conceptos">
        <div class="tabla-container-catalogo-conceptos">
            <table id="tabla-conceptos">
                <thead class="">
                    <tr>
                        <th style="width: 8rem;">
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
                                <span>Unidad</span>
                                <select class="form-select form-select-sm ml-2" id="unidad-filterConcepto"
                                    style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif; display: none;">
                                    <option value="" selected>Todo</option>
                                </select>
                            </div>
                        </th>
                        <th style="width: 8rem;">
                            Cantidad
                        </th>
                        <th style="width: 8rem;">
                            Precio Unitario
                        </th>
                        <th style="width: 8rem;">
                            Importe
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
</div>
<div style="padding-top: 1rem; padding-bottom: 3rem; margin-bottom: 3rem; display: block;">
    <div class="grid-container">
        <label class="subtotales_textos">Total:</label>
        <label id="TotalSumaImporteConceptos" class="subtotales_numeros_top">$0.00</label>
        <button type="button" class="btn fa-solid-Guardar-catalogo"
            onclick="javascript:TerminacionProyecto();">Terminar</button>
    </div>
</div>