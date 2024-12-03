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
            <button type="button" class="btn btn-agregar-Proyecto" data-bs-toggle="modal" data-bs-target="#AgregarModal" 
                onclick="javascript:AddlimpiarModal();">Cargar cuadro de dispositivos</button>
            <a href="index.php" class="text-inicio-conceptos">
                <div>Ir al inicio</div>
            </a>
    </div>
</div>

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