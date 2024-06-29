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
    <div> Concepto
        <button type="button" class="fa-solid fa-solid-agregar-concepto">Agregar</button>
        <button type="button" class="fa-solid fa-solid-cancelar">Cancelar</button>

        <div class="contTabla-conceptos">
            <div class="tabla-container tabla-container-conceptos">
                <table id="tabla-conceptos">
                    <thead class="">
                        <tr>
                            <th style="width: 8rem;">
                                ID
                            </th>
                            <th style="width: 60rem;">
                                Nombre
                            </th>
                            <th style="width: 20rem;">
                                Tipo
                            </th>
                            <th style="width: 8rem;">
                                Plazo
                            </th>
                            <th style="width: 12px;">
                                Unidad
                            </th>
                            <th class="col-1" style="width: 70px;">
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
   
    <div> Materiales
        <button type="button" class="fa-solid fa-solid-agregar-materiales">Agregar</button>

        <div class="contTabla-materiales">
            <div class="tabla-container tabla-container-materiales">
                <table id="tabla-materiales">
                    <thead class="">
                        <tr>
                            <th style="width: 8rem;">
                                ID
                            </th>
                            <th style="width: 12rem;">
                                Norma
                            </th>
                            <th style="width: 20rem;">
                                Descripción
                            </th>
                            <th style="width: 10rem;">
                                Precio
                            </th>
                            <th style="width: 100px;">
                                Fecha del precio
                            </th>
                            <th style="width: 10rem;">
                                Unidad
                            </th>
                            <th class="col-1" style="width: 80px;">
                                <div style="display: flex; min-width: 144px; justify-content: space-between;">
                                    <span>Acciones</span>
                                </div>
                            </th>
                            <th style="width: 90px;">
                                Cantidad
                            </th>
                        </tr>
                    </thead>
                        <tbody>
                            <td colspan="8">Sin resultados</td>
                        </tbody>
                </table>
            </div>
        </div>
        <button type="button" class="fa-solid fa-solid-Guardar">Guardar</button>
    </div>
</div>




<!-- Modal insertar materiales -->
<div class="modal modal-maquinaria" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar materiales</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-maquinaria" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-maquinaria">
                <div class="label-container-materiales">
                    <input type="text" placeholder="Buscar" id="searchInput" oninput="GetMateriales();EstablecerPag()">
                    <i class="fas fa-search icon-materiales" id="searchIcon"></i>
                </div>
                <div class="contTabla-materiales">
                    <div class="tabla-container tabla-container-materiales">
                        <table id="tabla-materiales">
                            <thead class="">
                                <tr>
                                    <th style="width: 8rem;">
                                        ID
                                    </th>
                                    <th style="width: 12rem;">
                                        Norma
                                    </th>
                                    <th style="width: 20rem;">
                                        Descripción
                                    </th>
                                    <th style="width: 8rem;">
                                        Precio
                                    </th>
                                    <th style="width: 60px;">
                                        FechaPrecio
                                    </th>
                                    <th class=" col-1" style="width: 150px;">
                                        <div class="d-flex align-items-center">
                                            <span>Unidad: </span>
                                            <select class="form-select form-select-sm ml-2" id="selectUnidad" onchange="javacript:GetMateriales();EstablecerPag()" style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                                <option value="todo" selected>Todo</option>
                                                <option value="PZ">PZ</option>
                                                <option value="KG">KG</option>
                                                <option value="MT">MT</option>
                                                <option value="JG">JG</option>
                                                <option value="M">M</option>
                                                <option value="LT">LT</option>
                                            </select>
                                        </div>
                                    </th>
                                    <th class="col-1" style="width: 170px;">
                                        <div style="display: flex; min-width: 144px; justify-content: space-between;">
                                            <span>Ver imagen</span>
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
    </div>
</div>

<!-- Modal insertar conceptos -->
<div class="modal modal-maquinaria" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar materiales</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-maquinaria" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-maquinaria">
                <div class=" label-container-conceptos">
                    <input type="text" placeholder="Buscar" id="searchInput" oninput="GetConcepto();EstablecerPag()">
                    <i class="fas fa-search icon-conceptos" id="searchIcon"></i>
                </div>
                <div class="contTabla-conceptos">
                    <div class="tabla-container tabla-container-conceptos">
                        <table id="tabla-conceptos">
                            <thead class="">
                                <tr>
                                    <th>
                                        ID
                                    </th>
                                    <th>
                                        Nombre
                                    </th>
                                    <th class=" col-1" style="width: 200px;">
                                        <div class="d-flex align-items-center">
                                            <span>Tipo: </span>
                                            <select class="form-select form-select-sm ml-2" id="selectTipo"
                                                onchange="javacript:GetConcepto();EstablecerPag()"
                                                style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                                <option value="todo" selected>Todo</option>
                                                <option value="Retenidas">Retenidas</option>
                                                <option value="Sist. Tierra">Sist. Tierra</option>
                                                <option value="Cables">Cables</option>
                                                <option value="Postes">Postes</option>
                                                <option value="Tros´s">Tros´s</option>
                                                <option value="Acometidas">Acometidas</option>
                                                <option value="Capacitores">Capacitores</option>
                                                <option value="Seccionamiento">Seccionamiento</option>
                                                <option value="Apartarrayos">Apartarrayos</option>
                                                <option value="Alumbrado">Alumbrado</option>
                                            </select>
                                        </div>
                                    </th>
                                    <th>
                                        Plazo
                                    </th>
                                    <th class=" col-1" style="width: 190px;">
                                        <div class="d-flex align-items-center">
                                            <span>Unidad: </span>
                                            <select class="form-select form-select-sm ml-2" id="selectUnidad"
                                                onchange="javacript:GetConcepto();EstablecerPag()"
                                                style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                                <option value="todo" selected>Todo</option>
                                                <option value="Estructuras">Estructura</option>
                                                <option value="PZA">PZA</option>
                                            </select>
                                        </div>
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
</div>