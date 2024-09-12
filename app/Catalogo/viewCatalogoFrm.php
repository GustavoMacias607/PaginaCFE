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
                onclick="javascript:opcion('conceptos')">Cancelar</button></div>
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
                        <th style="width: 9rem;">
                            Tipo
                        </th>
                        <th style="width: 8rem;">
                            Plazo
                        </th>
                        <th style="width: 8rem;">
                            Unidad
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
            <div><button type="button" onclick="javascript:AbrirModalMateriales();"
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
                        <th style="width: 100px;">
                            Unidad
                        </th>
                        <th class="col-1" style="width: 100px;">
                            <div style="display: flex; min-width: 144px; justify-content: space-between;">
                                <span>Acciones</span>
                            </div>
                        </th>
                        <th class="cantidad-materialesencatalogo">
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
    <div class="buttonguardarcatalogo"><button type="button" class="btn fa-solid-Guardar-catalogo"
            onclick="javascript:AgregarCatalogoConcepto()">Guardar</button>
    </div>
</div>

<!-- Modal insertar materiales -->
<div class="modal fade modal-materiales_catalogo" id="AgregarModalMaterialesConcepto" data-bs-backdrop="static"
    data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog_catalogo">
        <div class="modal-content" style="border: 3px solid #008E5A; top: 8.8rem; ">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar materiales</h1>
                <div class="label-container-materiales_catalogo">
                    <input type="text" placeholder="Buscar" id="searchInput"
                        oninput="GetMaterialesCatalogo();EstablecerPag()">
                    <i class="fas fa-search icon-materiales_catalogo" id="searchIcon"></i>
                </div>
                <button type="button" class="fa-solid fa-xmark btnclose-materiales_catalogo" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-materiales_catalogo">
                <div class="pagRegistrosmateriales">
                    <nav class="pSeccion">


                        <div class="cantregmateriales">
                            <div class="text">Mostrar</div>
                            <select class="cantregistrosmateriales" name="" id="cantRegistros"
                                onchange="javascript:LlenarCatalogoTabla()">
                                <option value="10" selected>10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <div class="text">Registros </div>
                        </div>

                        <ul class="pagination" id="pagination-list">
                            <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                            <li class="page-item active"></li>
                        </ul>

                    </nav>


                </div>

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
                                        <select class="form-select form-select-sm ml-2" id="selectUnidad"
                                            onchange="javacript:GetMaterialesCatalogo();EstablecerPag()"
                                            style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
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