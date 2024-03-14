<?php

session_start();
/*
if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}
*/
require("../../scripts/connect.php");
require("../../scripts/Conexion.php");
require("../../scripts/Materiales.php");

$c = new Conexion($conData);

$m = new Materiales($c->getConnection());
$resM = $m->getAllMateriales();
?>

<div class="row container mt-5">
    <div class="bottom-rectangle">
        <button type="button" class="btn btn-agregar-material" data-bs-toggle="modal" data-bs-target="#AgregarModal"
            style="--bs-btn-padding-y: .3rem; --bs-btn-padding-x: 2.5rem; --bs-btn-font-size: 1rem;">Agregar
            material</button>
    </div>

    <div class="label-container">
        <input type="text" placeholder="Buscar" id="searchInput">
        <i class="fas fa-search green-icon" id="searchIcon"></i>
    </div>

    <div style="margin-top: 250px;">
        <table class="table table-striped" id="tabla-materiales">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Norma</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th class="col-1" style="width: 140px;">
                        <div class="d-flex align-items-center">
                            <span>Unidad: </span>
                            <select class="form-select form-select-sm ml-2" id="selectUnidad"
                                style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                <option value="" selected></option>
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
                        <div class="d-flex align-items-center">
                            <span>Estatus: </span>
                            <select class="form-select form-select-sm ml-2" id="selectEstatus"
                                style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                <option value="Activo" selected>Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <?php
                if ($resM['filas'] == 0) {
                ?>
                <td colspan="8">Sin resultados</td>
                <?php
                } else {
                    $cont = 0;
                    foreach ($resM['datos'] as $fila) {
                        $cont++;
                    ?>
                <tr>
                    <td><?= $fila['codigo'] ?></td>
                    <td><?= $fila['norma'] ?></td>
                    <td><?= utf8_encode($fila['descripcion']) ?></td>
                    <td><?= $fila['precio'] ?></td>
                    <td><?= $fila['unidad'] ?></td>

                    <td class="estatus">
                        <?php if ($fila['estatus']) { ?>
                        <input type="checkbox" checked>
                        <?php
                                } else { ?>
                        <input type="checkbox">
                        <?php
                                }
                                ?>
                        <i class="fas fa-edit ml-2 text-primary" data-bs-toggle="modal"
                            data-bs-target="#EditarModal"></i>
                    </td>
                </tr>
                <?php
                    }
                }
                ?>
            </tbody>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>N123</td>
                    <td>Descripción del material 1</td>
                    <td>$10.00</td>
                    <td class="unidad">PZ</td>
                    <td class="estatus">
                        <input type="checkbox" checked>
                        <i class="fas fa-edit ml-2 text-primary" data-bs-toggle="modal"
                            data-bs-target="#EditarModal"></i>
                    </td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>N123</td>
                    <td>Descripción del material 1</td>
                    <td>$10.00</td>
                    <td class="unidad">PZ</td>
                    <td class="estatus">
                        <input type="checkbox" checked>
                        <i class="fas fa-edit ml-2 text-primary" data-bs-toggle="modal"
                            data-bs-target="#EditarModal"></i>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>

    <!-- Modal insertar imagen -->
    <div class="modal fade" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content" style="border: 3px solid #008E5A;">
                <div class="modal-header" style="border-bottom: 2px solid #008E5A;">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar material</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="idInput" class="form-label" style="color: #303030;">ID</label>
                        <input type="text" class="form-control" id="idInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="normaInput" class="form-label" style="color: #303030;">Norma</label>
                        <input type="text" class="form-control" id="normaInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="descripcionInput" class="form-label" style="color: #303030;">Descripción</label>
                        <textarea class="form-control" id="descripcionInput" rows="3"
                            style="border: 3px solid #008E5A;"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="precioInput" class="form-label" style="color: #303030;">Precio</label>
                        <input type="text" class="form-control" id="precioInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="fechaPrecioInput" class="form-label" style="color: #303030;">Fecha de precio</label>
                        <input type="date" class="form-control" id="fechaPrecioInput"
                            style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="unidadInput" class="form-label" style="color: #303030;">Unidad</label>
                        <select class="form-select" id="unidadInput" style="border: 3px solid #008E5A;">
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
                        <input type="file" class="form-control" id="imagenInput">
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 2px solid #008E5A;">
                    <button type="button" class="btn btn-primary" onclick="javascript:AddMaterialValidar();"
                        style="background-color: #008E5A; border-color: #008E5A;">Guardar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal modificar imagen-->
    <div class="modal fade" id="EditarModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content" style="border: 3px solid #008E5A;">
                <div class="modal-header" style="border-bottom: 2px solid #008E5A;">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Modificar material</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="idInput" class="form-label" style="color: #303030;">ID</label>
                        <input type="text" class="form-control" id="idInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="normaInput" class="form-label" style="color: #303030;">Norma</label>
                        <input type="text" class="form-control" id="normaInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="descripcionInput" class="form-label" style="color: #303030;">Descripción</label>
                        <textarea class="form-control" id="descripcionInput" rows="3"
                            style="border: 3px solid #008E5A;"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="precioInput" class="form-label" style="color: #303030;">Precio</label>
                        <input type="text" class="form-control" id="precioInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="fechaPrecioInput" class="form-label" style="color: #303030;">Fecha de precio</label>
                        <input type="date" class="form-control" id="fechaPrecioInput"
                            style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="unidadInput" class="form-label" style="color: #303030;">Unidad</label>
                        <select class="form-select" id="unidadInput" style="border: 3px solid #008E5A;">
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
                        <input type="file" class="form-control" id="imagenInput">
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 2px solid #008E5A;">
                    <button type="button" class="btn btn-primary"
                        style="background-color: #008E5A; border-color: #008E5A;">Guardar</button>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous">
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