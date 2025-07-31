<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

<div class="fondBlanco" style="height: 4rem;">
    <div class="bottom-rectangle-proyecto">
        <input type="text" class="form-control inputLleno d-none" id="idUsuario" value="<?= $_SESSION['idusuario'] ?>">
        <div class="text-materiales" style="margin-right: 1rem;">Proyecto terminado</div>
        <button type="button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaConceptos', this)">Conceptos</button>
        <button type="button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaTarjetasProyecto', this)">Tarjetas</button>
        <button type=" button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaMaterialesSuministrados', this)">Materiales CFE</button>
        <button type=" button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaMaterialesNoSuministrados', this)">Materiales contratista</button>
        <button type="button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaManoObra', this)">Mano de obra</button>
        <button type="button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaHerramientas', this)">Herramienta de mano</button>
        <button type="button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaEquipoSeguridad', this)">Equipo de seguridad</button>
        <button type="button" class="btn btnTabla btnTerminadoBn"
            onclick="mostrarTablaTerminado('tablaMaquinaria', this)">Maquinaria</button>
        <?php
        if ($_SESSION["rol"] != "Invitado") {
            echo    ' <button type="button" class="btn btnTabla btnTerminadoBn" data-bs-toggle="modal" data-bs-target="#AgregarModal"
            onclick="javascript:addProyectoLimpiarModal();">Reutilizar</button>';
        }
        ?>

        <a onclick="opcion('proyecto')" class="text-inicio-conceptos">
            <div>Ir al inicio</div>
        </a>
    </div>
</div>

<div>
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
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="ExportarExcelMaterialesSi();">Exportar a Excel</button>
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
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="ExportarExcelMaterialesNo();">Exportar a Excel</button>
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
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="ExportarExcelManoObra();">Exportar a Excel</button>
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
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="ExportarExcelMaquinarias();">Exportar a Excel</button>
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
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="ExportarExcelHerramientasMano();">Exportar a Excel</button>
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
                        <td style="text-align: right;" id="KhHerramientas">0.03</td>
                        <td style="text-align: right;" id="ActualizarPrecioMoHerramientas">0</td>
                        <td style="text-align: right;" id="importeHerramientas">0</td>
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
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="ExportarExcelEquipoSeguridad();">Exportar a Excel</button>
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
                        <td style="text-align: right;" id="KhEquipo">0.02</td>
                        <td style="text-align: right;" id="ActualizarPrecioMoEquipo">0</td>
                        <td style="text-align: right;" id="importeEquipo">0</td>
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
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="ExportarExcelConceptosProyecto();">Exportar a Excel</button>
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="ExportarPDFConceptos()">Exportar a PDF</button>
    </div>
    <div
        style="margin-bottom: 1rem; margin-top: 1rem; display: flex; justify-content: end; gap: 1rem; margin-right: 2rem;">
        <button id="toggleCostoDirecto" class=" btn fa-solid-Siguiente-catalogo">
            <i class="fa fa-eye-slash" id="iconCostoDirecto"></i> CD
        </button>
        <button id="togglePrecioUnitario" class=" btn fa-solid-Siguiente-catalogo">
            <i class="fa fa-eye-slash" id="iconPrecioUnitario"></i> PU
        </button>
        <button id="togglePUCantidad" class=" btn fa-solid-Siguiente-catalogo">
            <i class="fa fa-eye-slash" id="iconPUCantidad"></i> PU * C
        </button>
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
                            Nombre
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
                        <th style="width: 8rem;" class="col-costo-directo">
                            Costo directo
                        </th>
                        <th style="width: 8rem;" class="col-precio-unitario">
                            Precio unitario
                        </th>
                        <th style="width: 8rem;" class="col-pu-cantidad">
                            PU * Cantidad
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

    <!-- Total -->
    <div id="totalContainer" style="padding-top: 1rem; padding-bottom: 3rem; margin-bottom: 3rem; display: block;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumaImporteConceptos" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>
</div>
<!-- Modal insertar proyecto -->
<div class="modal modal-maquinaria" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar proyecto</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-maquinaria" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-maquinaria">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <div class="row mb-3">

                    <div class="col-6">
                        <label for="precioInput" class="form-label" style="color: #303030;">Id</label>
                        <input type="text" class="form-control inputLleno" id="inputIdProyecto" disabled>
                    </div>
                    <div class="col-6">
                        <label for="unidadInput" class="form-label" style="color: #303030;">Zona*</label>
                        <input type="text" class="form-control inputLleno" id="inputZona"
                            oninput="mostrarSugerenciasZonas(this)" onfocus="mostrarSugerenciasZonas(this)"
                            onblur="ocultarSugerenciasZonas();CompruebaTieneAlgoInput(this)" autocomplete="off">
                        <div id="Addsugerencias" class="sugerencias-boxZona"
                            style="font-family: 'latoBold', sans-serif;">
                        </div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <label for="unidadInput" class="form-label" style="color: #303030;">Tipo de obra*</label>
                        <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            id="AddTipoObra">
                            <option value="" selected>Selecciona</option>
                            <option value="Nueva">Nueva</option>
                            <option value="Mejora de red">Mejora de red</option>
                            <option value="Solicitudes">Solicitudes</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <label for="AddfechaPrecioInput" class="form-label" style="color: #303030;">Fecha posible de
                            inicio*</label>
                        <input type="date" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            class="form-control inputLleno" id="AddfechaInicioInput">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <label for="precioInput" class="form-label" style="color: #303030;">Periodo*</label>
                        <input type="number" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            class="form-control inputLleno" id="inputPeriodo" min="1">
                    </div>
                    <div class="col-6">
                        <label for="AddfechaPrecioInput" class="form-label" style="color: #303030;">Fecha de
                            término</label>
                        <input type="date" onblur="javascript:CompruebaTieneAlgoInput(this)" disabled
                            class="form-control inputLleno" id="AddfechaTerminoInput">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Nombre de la obra*</label>
                    <textarea type="text" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        class="form-control inputLleno" id="inputNombreObra" rows="4"></textarea>
                </div>
                <div class="modal-footer modal-footer-maquinaria">
                    <button type="button" class="btn btn-primary"
                        onclick="javascript:AddReescribirProyecto();">Siguiente</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Tarjetas del proyecto -->
<div>
    <div id="mostrarBtnPdf" style="margin: 1rem 2rem 0px 2rem; display: none; justify-content: center;">
        <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;"
            onclick="ExportarExcelTarjetas(true);">Exportar a Excel</button>
        <button type="button" id="btnExportarPDF" class="btn fa-solid-Siguiente-catalogo"
            style="margin-left: 0.5rem; margin-right: 0.5rem;" onclick="exportarPDFConHtml(false)">Exportar a
            PDF</button>
    </div>
    <div id="tablaTarjetasProyecto" style="display: none;">

    </div>

</div>


<div id="contenedor-cfe" style="font-size: 20px; display: none;">
</div>