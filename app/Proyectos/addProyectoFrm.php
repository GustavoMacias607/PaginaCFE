<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

<div class="fondBlanco-proyecto">
    <div class="bottom-rectangle-proyecto">
    <div class="text-materiales">Proyectos</div>
    <button type="button" class="btn btn-agregar-Proyecto" data-bs-toggle="modal" data-bs-target="#AgregarModal" 
        onclick="javascript:AddlimpiarModalMaquinaria();">Agregar proyecto</button>
    </div>
    <div class="label-container-proyecto">
        <input type="text" placeholder="Buscar" id="search-inputProyecto">
        <i class="fas fa-search icon-proyecto" id="searchIcon"></i>
    </div>
    <div class="pagRegistrosconceptos" style="justify-content: space-around;">
        <label for="" class="titulos-tiposde-proyecto">En proceso</label>
        <label for="" class="titulos-tiposde-proyecto">Terminados</label>
    </div>
</div>




<div class="contenedor-columnas">
    <!-- Primera columna -->
    <div class="columna">
        <div class="contTabla-proyecto">
            <div class="tabla-container-proyecto">
                <table id="tabla-conceptos">
                    <thead>
                        <tr>
                            <th style="width: 8rem;">
                                <button id="sort-id" class="sort-button">
                                    ID <i class="fa-solid fa-arrow-up-wide-short"></i>
                                </button>
                            </th>
                            <th>Nombre</th>
                            <th style="width: 8rem;">Zona</th>
                            <th style="width: 8rem;">Tipo de obra</th>
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

    <!-- Segunda columna -->
    <div class="columna">
        <div class="contTabla-proyecto">
            <div class="tabla-container-proyecto">
                <table id="tabla-conceptos">
                    <thead>
                        <tr>
                            <th style="width: 8rem;">
                                <button id="sort-id" class="sort-button">
                                    ID <i class="fa-solid fa-arrow-up-wide-short"></i>
                                </button>
                            </th>
                            <th>Nombre</th>
                            <th style="width: 8rem;">Zona</th>
                            <th style="width: 8rem;">Tipo de obra</th>
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
</div>






<div style="display: none;">
<div>
    <label for="" style="color:#303030; font-family: 'LatoBold', sans-serif; margin-left: 2rem; margin-top: 9.5rem; align-content: center;">Para la obra:</label>
    <div style="display: flex; flex-wrap: wrap; margin-top: 9rem; float: right;">
        <label for="" style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Fecha:</label>
        <input type="text" class="form-control inputLleno" style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem;"
            onblur="javascript:CompruebaTieneAlgoInput(this);checkConcepto('upd');" id="UpdidInput">
    </div>
</div>
    
        <textarea type="text" class="form-control inputLleno" style="margin: 1rem 2rem 0px 2rem; width: calc(100% - 4rem);"
                    onblur="javascript:CompruebaTieneAlgoInput(this)" id="UpdnombreInput" rows="4"></textarea>
    

<div style="margin: 1rem 2rem 0px 2rem; display: flex; justify-content: space-between;">
    <button type="button" class="btn fa-solid-Siguiente-catalogo" onclick="">Materiales suministrados CFE</button>
    <button type="button" class="btn fa-solid-Siguiente-catalogo" onclick="">Materiales fuera de CFE</button>
    <button type="button" class="btn fa-solid-Siguiente-catalogo" onclick="">Mano de obra</button>
    <button type="button" class="btn fa-solid-Siguiente-catalogo" onclick="">Herramienta de mano</button>
    <button type="button" class="btn fa-solid-Siguiente-catalogo" onclick="">Equipo de seguridad</button>
    <button type="button" class="btn fa-solid-Siguiente-catalogo" onclick="">Maquinaria</button>
    <button type="button" class="btn fa-solid-Siguiente-catalogo" onclick="">Tarjetas</button>
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

    <div style="padding-top: 7.5rem; margin-bottom: 5rem; display: block;">
        <div class="grid-container">
            <label class="subtotales_textos">Total:</label>
            <label id="TotalSumas" class="subtotales_numeros_top">$0.00</label>
            <button type="button" class="btn fa-solid-Guardar-catalogo"
                onclick="javascript:guardarTablasEnBD()">Terminar</button>
        </div>
    </div>
</div>
</div>

<!-- Modal insertar proyecto -->
<div class="modal modal-maquinaria" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar proyecto</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-maquinaria" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-maquinaria">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <div class="mb-3">
                    <label for="unidadInput" class="form-label" style="color: #303030;">Zona*</label>
                    <input type="text" oninput="mostrarSugerencias(this, 'AddUnidad')"
                        onfocus="mostrarSugerencias(this, 'AddUnidad')"
                        onblur="ocultarSugerencias('AddUnidad');CompruebaTieneAlgoInput(this)"
                        class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;"
                        id="AddunidadInputConcepto" autocomplete="off">
                    <div id="Addsugerencias" class="sugerencias-box" style="font-family: 'latoBold', sans-serif;"></div>
                </div>
                <div class="mb-3">
                    <label for="unidadInput" class="form-label" style="color: #303030;">Tipo de obra*</label>
                    <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        id="AddUnidadInputMaquinaria">
                        <option value="" selected>Seleccciona un tipo de obra</option>
                        <option value="NUEVA">Nueva</option>
                        <option value="MEJORADERED">Mejora red</option>
                        <option value="SOLICITUD">Solicitud</option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <label for="AddfechaPrecioInput" class="form-label" style="color: #303030;">Fecha posible de inicio*</label>
                    <input type="date" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno"
                        id="AddfechaPrecioInput">
                </div>
                <div class="mb-3">
                    <label for="precioInput" class="form-label" style="color: #303030;">Promedio*</label>
                    <input type="number" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno" 
                        id="AddphmInputMaquinaria">
                </div>
                <div class="mb-3">
                    <label for="AddfechaPrecioInput" class="form-label" style="color: #303030;">Fecha de termino</label>
                    <input type="date" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno"
                        id="AddfechaPrecioInput">
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Nombre*</label>
                    <textarea type="text" onblur="javascript:CompruebaTieneAlgoInput(this)"
                        class="form-control inputLleno" id="AdddescripcionInputMaquinaria" rows="4"></textarea>
                </div>
                <div class="modal-footer modal-footer-maquinaria">
                    <button type="button" class="btn btn-primary"
                        onclick="javascript:AddMaquinariaValidar();">Siguiente</button>
                </div>
            </div>
        </div>
    </div>
</div>
