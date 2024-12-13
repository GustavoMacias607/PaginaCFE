<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

<div class="fondBlanco" style="height: 4rem;">
    <div class="bottom-rectangle-proyecto">
        <div class="text-materiales">Proyecto términado</div>
        <button type="button" class="btn btn-agregar-Proyecto" onclick="">Conceptos</button>
        <button type="button" class="btn btn-agregar-Proyecto" onclick="">Tarjetas</button>
        <button type="button" class="btn btn-agregar-Proyecto" onclick="">Materiales suminsitrados CFE</button>
        <button type="button" class="btn btn-agregar-Proyecto" onclick="">Materiales fuera de CFE</button>
        <button type="button" class="btn btn-agregar-Proyecto" onclick="">Mano de obra</button>
        <button type="button" class="btn btn-agregar-Proyecto" onclick="">Herramienta de mano</button>
        <button type="button" class="btn btn-agregar-Proyecto" onclick="">Equipo de seguridad</button>
        <button type="button" class="btn btn-agregar-Proyecto" onclick="">Maquinaria</button>
            <a href="index.php" class="text-inicio-conceptos">
                <div>Ir al inicio</div>
            </a>
    </div>
</div>

<div>
    <label for="" style="color:#303030; font-family: 'LatoBold', sans-serif; margin-left: 2rem; margin-top: 12rem; align-content: center;">Para la obra:</label>
    <div style="display: flex; flex-wrap: wrap; margin-top: 9.8rem; float: right; margin-bottom: 1rem;">
        <label for="" style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Zona:</label>
        <input type="text" class="form-control inputLleno" style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem;"
            onblur="javascript:CompruebaTieneAlgoInput(this);checkConcepto('upd');" id="UpdidInput">
        <label for="" style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Tipo de obra:</label>
        <input type="text" class="form-control inputLleno" style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem;"
            onblur="javascript:CompruebaTieneAlgoInput(this);checkConcepto('upd');" id="UpdidInput">
            <label for="" style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Fecha posible de inicio:</label>
        <input type="text" class="form-control inputLleno" style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem;"
            onblur="javascript:CompruebaTieneAlgoInput(this);checkConcepto('upd');" id="UpdidInput">
            <label for="" style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Fecha de término:</label>
        <input type="text" class="form-control inputLleno" style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem;"
            onblur="javascript:CompruebaTieneAlgoInput(this);checkConcepto('upd');" id="UpdidInput">
            
    </div>
</div>
    
        <textarea type="text" class="form-control inputLleno" style="margin: 0px 2rem 0px 2rem; width: calc(100% - 4rem);"
                    onblur="javascript:CompruebaTieneAlgoInput(this)" id="UpdnombreInput" rows="4"></textarea>
    

<div style="margin: 1rem 2rem 0px 2rem; display: flex; justify-content: center; display: none;">
    <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;" onclick="">Exportar a Excel</button>
    <button type="button" class="btn fa-solid-Siguiente-catalogo" style="margin-left: 0.5rem; margin-right: 0.5rem;" onclick="">Exportar a PDF</button>

</div>

<!--tabla materiales suministrados por cfe-->
<div style="display: none;">
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
    <div style="padding-top: 7.5rem; margin-bottom: 5rem; display: block;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumas" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>
</div>

<!--tabla materiales no suministrados por cfe-->
<div style="display: none;">
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
    <div style="padding-top: 7.5rem; margin-bottom: 5rem; display: block;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumas" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>
</div>
<!--tabla mano de obra-->
<div style="display: none;">
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
                            Rendimiento
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
    <div style="padding-top: 7.5rem; margin-bottom: 5rem; display: block;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumas" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>
</div>
<!--tabla maquinaria-->
<div style="display: none;">
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
    <div style="padding-top: 7.5rem; margin-bottom: 5rem; display: block;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumas" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>
</div>

<!--tabla herramienta de mano-->
<div style="display: none;">
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
    <div style="padding-top: 7.5rem; margin-bottom: 5rem; display: block;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumas" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>
</div>

<!--tabla equipo de seguridad-->
<div style="display: none;">
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
    <div style="padding-top: 7.5rem; margin-bottom: 5rem; display: block;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumas" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>
</div>

<div style="display: none;">
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

    <div style="padding-top: 7.5rem; margin-bottom: 5rem; display: block;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumas" class="subtotales_numeros_top">$0.00</label>
        </div>
    </div>
</div>