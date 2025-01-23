<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

<div class="fondBlanco" style="height: 4rem;">
    <div class="bottom-rectangle-proyecto">
        <div class="text-materiales" style="margin-right: 1rem;">Proyecto terminado</div>
        <button type="button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaConceptos', this)">Conceptos</button>
        <button type="button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaTarjetasProyecto', this)">Tarjetas</button>
        <button type=" button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaMaterialesSuministrados', this)">Materiales suministrados</button>
        <button type=" button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaMaterialesNoSuministrados', this)">Materiales fuera de CFE</button>
        <button type="button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaManoObra', this)">Mano de obra</button>
        <button type="button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaHerramientas', this)">Herramienta de mano</button>
        <button type="button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaEquipoSeguridad', this)">Equipo de seguridad</button>
        <button type="button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaMaquinaria', this)">Maquinaria</button>
            <button type="button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaMaquinaria', this)">Reutilizar</button>
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
    style="margin: 0px 2rem 0px 2rem; width: calc(100% - 4rem);" id="lblNombre" rows="4"></textarea>
</div>

<!--tabla materiales suministrados por cfe-->
<div id="tablaMaterialesSuministrados" style="display: none;">
    <div style="margin: 1rem 2rem 0px 2rem; display: flex; justify-content: center;">
        <button type="button" class="btn fa-solid-Siguiente-catalogo"
            style="margin-left: 0.5rem; margin-right: 0.5rem;">Exportar a Excel</button>
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="ExportarPDFMaterialesSi()">Exportar a PDF</button>
    </div>
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
    <div style="margin: 1rem 2rem 0px 2rem; display: flex; justify-content: center;">
        <button type="button" class="btn fa-solid-Siguiente-catalogo"
            style="margin-left: 0.5rem; margin-right: 0.5rem;">Exportar a Excel</button>
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="ExportarPDFMaterialesNo()">Exportar a PDF</button>
    </div>
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
    <div style="margin: 1rem 2rem 0px 2rem; display: flex; justify-content: center;">
        <button type="button" class="btn fa-solid-Siguiente-catalogo"
            style="margin-left: 0.5rem; margin-right: 0.5rem;">Exportar a Excel</button>
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="ExportarPDFManoObra()">Exportar a PDF</button>
    </div>
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
    <div style="margin: 1rem 2rem 0px 2rem; display: flex; justify-content: center;">
        <button type="button" class="btn fa-solid-Siguiente-catalogo"
            style="margin-left: 0.5rem; margin-right: 0.5rem;">Exportar a Excel</button>
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="ExportarPDFMaquinarias()">Exportar a PDF</button>
    </div>
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
    <div style="margin: 1rem 2rem 0px 2rem; display: flex; justify-content: center;">
        <button type="button" class="btn fa-solid-Siguiente-catalogo"
            style="margin-left: 0.5rem; margin-right: 0.5rem;">Exportar a Excel</button>
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="ExportarPDFHerramientasMano()">Exportar a PDF</button>
    </div>
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
    <div style="margin: 1rem 2rem 0px 2rem; display: flex; justify-content: center;">
        <button type="button" class="btn fa-solid-Siguiente-catalogo"
            style="margin-left: 0.5rem; margin-right: 0.5rem;">Exportar a Excel</button>
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="ExportarPDFEquipoSeguirdad()">Exportar a PDF</button>
    </div>
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

<div id="tablaConceptos" style="display: none;">
    <div style="margin: 1rem 2rem 0px 2rem; display: flex; justify-content: center;">
        <button type="button" class="btn fa-solid-Siguiente-catalogo"
            style="margin-left: 0.5rem; margin-right: 0.5rem;">Exportar a Excel</button>
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="ExportarPDFConceptos()">Exportar a PDF</button>
    </div>
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

    <div style="padding-top: 1rem; margin-bottom: 5rem; display: block;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumaImporteConceptos" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>
</div>

<!-- Tarjetas del proyecto -->
<div>
    <div id="mostrarBtnPdf" style="margin: 1rem 2rem 0px 2rem; display: none; justify-content: center;">
        <button type="button" class="btn fa-solid-Siguiente-catalogo"
            style="margin-left: 0.5rem; margin-right: 0.5rem;">Exportar a Excel</button>
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="exportarPDFConHtml()">Exportar a PDF</button>
    </div>
    <div id="tablaTarjetasProyecto" style="display: none;">

    </div>

</div>


<div id="contenedor-cfe" style="font-size: 20px; display: none;">

</div>