<?php

session_start();
/*
if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}
<link rel="stylesheet" href="stylesmateriales.css">
*/
require("../../scripts/connect.php");
require("../../scripts/Conexion.php");
require("../../scripts/Materiales.php");

$c = new Conexion($conData);
$m = new Materiales($c->getConnection());
$datos = array(
    "estatus" => false
);
//$resM = $m->getAllMateriales($datos);

?>

<link rel="stylesheet" href="stylesmateriales.css">

<div class="row container mt-5 text-lg-start">

    <div class="fondBlanco">
        <div class="bottom-rectangle bottom-rectangle-materiales ">
            <div class="text-capitalize text-materiales">Materiales</div>
            <button type="button" class="btn btn-agregar-material" data-bs-toggle="modal" data-bs-target="#AgregarModal" onclick="javascript:AddlimpiarModal();">Agregar
                material</button>
        </div>
        <div class="label-container label-container-materiales">
            <input type="text" placeholder="Buscar" id="searchInput" oninput="GetBuscarMateriales()">
            <i class="fas fa-search icon-materiales" id="searchIcon"></i>
        </div>
    </div>


    <!-- navegacion -->
    <div class="contTabla contTabla-materiales">
        <div class="pagRegistros">
            <nav aria-label="Page navigation example">
                <ul class="pagination" id="pagination-list">
                    <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                </ul>
            </nav>
            <div>
                <select name="" id="cantRegistros" onchange="javascript:cambiarTamano()">
                    <option value="10" selected>10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
        </div>
        <div class="tabla-container tabla-container-materiales">
            <table id="tabla-materiales">
                <thead class="">
                    <tr>
                        <th>
                            ID
                        </th>
                        <th>
                            Norma
                        </th>
                        <th>
                            Descripción
                        </th>
                        <th>
                            Precio
                        </th>
                        <th>
                            FechaPrecio
                        </th>
                        <th class=" col-1" style="width: 150px;">
                            <div class="d-flex align-items-center">
                                <span>Unidad: </span>
                                <select class="form-select form-select-sm ml-2" id="selectUnidad" onchange="javacript:GetFiltrarUnidad()" style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
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
                            <div style="display: flex; justify-content: space-between;">
                                <span>Acciones: </span>
                                <div class="px-4">
                                    <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                                    <img id="ValEstatus" src="../img/toggleon_26px.png" width="30px" onclick="javascript:valStatus(); javascript:GetMateriales()">
                                </div>
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


    <!-- Modal insertar imagen -->
    <div class="modal modal-materiales" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content" style="border: 3px solid #008E5A;">
                <div class="modal-header" style="border-bottom: 2px solid #008E5A;">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar material</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body modal-body-materiales">

                    <div class="mb-3">
                        <label for="idInput" class="form-label" style="color: #303030;">ID</label>
                        <input type="text" class="form-control fa-bold" id="AddidInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="normaInput" class="form-label" style="color: #303030;">Norma</label>
                        <input type="text" class="form-control" id="AddnormaInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="descripcionInput" class="form-label" style="color: #303030;">Descripción</label>
                        <textarea class="form-control" id="AdddescripcionInput" rows="3" style="border: 3px solid #008E5A;"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="precioInput" class="form-label" style="color: #303030;">Precio</label>
                        <input type="text" class="form-control" id="AddprecioInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="fechaPrecioInput" class="form-label" style="color: #303030;">Fecha de precio</label>
                        <input type="date" class="form-control" id="AddfechaPrecioInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="unidadInput" class="form-label" style="color: #303030;">Unidad</label>
                        <select class="form-select" id="AddunidadInput" style=" border: 3px solid #008E5A;">
                            <option selected></option>
                            <option value="PZ">PZ</option>
                            <option value="KG">KG</option>
                            <option value="MT">MT</option>
                            <option value="JG">JG</option>
                            <option value="M">M</option>
                            <option value="LT">LT</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="imagenInput" class="form-label" style="color: #303030;">Añadir imagen</label>
                        <input type="file" class="form-control" id="AddimagenInput" onchange="AddmostrarImagen(this) " style=" border: 3px solid #008E5A;">
                    </div>
                    <img id="AddimagenPreview" src="" alt="Imagen" width="200px" style="border: 3px solid #008e5a; border-radius: 5px; transform: translateX(60%);">
                </div>
                <div class="modal-footer modal-footer-materiales">
                    <button type="button" class="btn btn-primary" onclick="javascript:AddMaterialValidar();" style="background-color: #008E5A; border-color: #008E5A;">Guardar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal modificar Material-->
    <div class="modal fade modal-materiales" id="EditarModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content" style="border: 3px solid #008E5A;">
                <div class="modal-header" style="border-bottom: 2px solid #008E5A;">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Modificar material</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="text" class="form-control d-none" id="idAnterior" style="border: 3px solid #008E5A;">
                    <div class="mb-3">
                        <label for="idInput" class="form-label" style="color: #303030;">ID</label>
                        <input type="text" class="form-control" id="UpdidInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="normaInput" class="form-label" style="color: #303030;">Norma</label>
                        <input type="text" class="form-control" id="UpdnormaInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="descripcionInput" class="form-label" style="color: #303030;">Descripción</label>
                        <textarea class="form-control" id="UpddescripcionInput" rows="3" style="border: 3px solid #008E5A;"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="precioInput" class="form-label" style="color: #303030;">Precio</label>
                        <input type="text" class="form-control" id="UpdprecioInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="fechaPrecioInput" class="form-label" style="color: #303030;">Fecha de precio</label>
                        <input type="date" class="form-control" id="UpdfechaPrecioInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="unidadInput" class="form-label" style="color: #303030;">Unidad</label>
                        <select class="form-select" id="UpdunidadInput" style="border: 3px solid #008E5A;">
                            <option selected></option>
                            <option value="PZ">PZ</option>
                            <option value="KG">KG</option>
                            <option value="MT">MT</option>
                            <option value="JG">JG</option>
                            <option value="M">M</option>
                            <option value="LT">LT</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="imagenInput" class="form-label" style="color: #303030;">Añadir imagen</label>
                        <input type="file" class="form-control" id="UpdimagenInput" onchange="UpdmostrarImagen(this)" style=" border: 3px solid #008E5A;">
                    </div>

                    <img id="UpdimagenPreview" src="" width="200px" style="border: 3px solid #008e5a; border-radius: 5px; transform: translateX(60%);">
                </div>
                <div class=" modal-footer">
                    <button type="button" class="btn btn-primary" style="background-color: #008E5A; border-color: #008E5A;" onclick="javascript:UpdMaterialValidar()">Guardar</button>
                </div>
            </div>
        </div>
    </div>


    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous">
    </script>

    <script>
        window.addEventListener('resize', function() {
            const logoImage = document.getElementById('logoImage');
            const windowWidth = window.innerWidth;
            const originalWidth = logoImage.naturalWidth;

            if (windowWidth < originalWidth) {
                logoImage.src =
                    'img/Logocfeverde.png'; // Cambia la ruta por la imagen que deseas mostrar al hacer zoom
                logoImage.alt = 'Otra imagen'; // Cambia el atributo alt de la imagen


            } else {
                logoImage.src = 'img/Logocfelargo.png'; // Vuelve a la imagen original
                logoImage.alt = 'Logo'; // Restaura el atributo alt
            }
        });
    </script>