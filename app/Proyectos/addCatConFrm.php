<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

<div class="fondBlanco" style="height: 4rem;">
    <div class="bottom-rectangle-proyecto">
        <div class="text-materiales">Catalogo de conceptos</div>
        <button type="button" class="btn btn-agregar-Proyecto" data-bs-toggle="modal" data-bs-target="#AgregarModal" 
                onclick="javascript:AddlimpiarModal();">Editar datos de proyecto</button>
            <button type="button" class="btn btn-agregar-Proyecto"
                onclick="">Cargar cuadro de dispositivos</button>
            <a href="index.php" class="text-inicio-conceptos">
                <div>Ir al inicio</div>
            </a>
    </div>
</div>

<div style="">
    <label for="" style="color:#303030; font-family: 'LatoBold', sans-serif; margin-left: 2rem; margin-top: 12rem; align-content: center;">Para la obra:</label>
    <div style="display: flex; flex-wrap: wrap; margin-top: 9.8rem; float: right; margin-bottom: 1rem;">
        <label for="" style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Id:</label>
            <label for="" style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
        <label for="" style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Zona:</label>
            <label for="" style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
        <label for="" style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Tipo de obra:</label>
            <label for="" style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
        <label for="" style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Fecha posible de inicio:</label>
            <label for="" style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
        <label for="" style="color:#303030; font-family: 'LatoBold', sans-serif; margin-right: .5rem; align-content: center;">Fecha de término:</label>
            <label for="" style="font-family: 'latoBold', sans-serif; margin-right:2rem; width: 9rem; border-bottom: 3px solid #008e5a;"></label>
    </div>
</div>
    
        <textarea type="text" class="form-control inputLleno" style="margin: 0px 2rem 0px 2rem; width: calc(100% - 4rem);"
                    onblur="javascript:CompruebaTieneAlgoInput(this)" id="UpdnombreInput" rows="4"></textarea>
    

<div>
    <div class="contTabla-catalogo-conceptos">
        <div class="tabla-container-catalogo-conceptos">
            <table id="tabla-conceptos">
                <thead class="">
                    <tr>
                        <th style="width: 8rem; ">
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
                                <span>Unidad:</span>
                                <select class="form-select form-select-sm ml-2" id="unidad-filterConcepto"
                                    style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                    <option value="" selected>Todo</option>
                                </select>
                            </div>
                        </th>
                        <th style="width: 8rem;">
                            Cantidad
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



    <div style="margin-bottom: 5rem; float: right; margin-right: 2rem; padding-top: 7.5rem;">
        <button type="button" class="btn fa-solid-Siguiente-catalogo"
            onclick="javascript:guardarTablasEnBD()">Siguiente</button>
    </div>

</div>


<!-- Modal insertar proyecto -->
<div class="modal modal-maquinaria" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Editar proyecto</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-maquinaria" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-maquinaria">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <div class="row mb-3">
                    <div class="col-6">
                        <label for="precioInput" class="form-label" style="color: #303030;">Id</label>
                        <input type="number" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno" 
                        id="AddphmInputMaquinaria">
                    </div>
                    <div class="col-6">
                        <label for="unidadInput" class="form-label" style="color: #303030;">Zona*</label>
                        <input type="text" oninput="mostrarSugerencias(this, 'AddUnidad')"
                            onfocus="mostrarSugerencias(this, 'AddUnidad')"
                            onblur="ocultarSugerencias('AddUnidad');CompruebaTieneAlgoInput(this)"
                            class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;"
                            id="AddunidadInputConcepto" autocomplete="off">
                        <div id="Addsugerencias" class="sugerencias-box" style="font-family: 'latoBold', sans-serif;"></div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <label for="unidadInput" class="form-label" style="color: #303030;">Tipo de obra*</label>
                        <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInput(this)"
                            id="AddUnidadInputMaquinaria">
                            <option value="" selected>Selecciona</option>
                            <option value="NUEVA">Nueva</option>
                            <option value="MEJORADERED">Mejora red</option>
                            <option value="SOLICITUD">Solicitud</option>
                        </select>
                    </div>               
                    <div class="col-6">
                        <label for="AddfechaPrecioInput" class="form-label" style="color: #303030;">Fecha posible de inicio*</label>
                        <input type="date" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno"
                            id="AddfechaPrecioInput">
                    </div>
                </div>    
                <div class="row mb-3">
                    <div class="col-6">
                        <label for="precioInput" class="form-label" style="color: #303030;">Periodo*</label>
                        <input type="number" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno" 
                        id="AddphmInputMaquinaria">
                    </div>
                    <div class="col-6">
                        <label for="AddfechaPrecioInput" class="form-label" style="color: #303030;">Fecha de término</label>
                        <input type="date" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno"
                        id="AddfechaPrecioInput">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Nombre de la obra*</label>
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
