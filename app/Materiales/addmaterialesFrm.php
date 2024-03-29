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
$datos = array(
    "estatus" => false
);
$resM = $m->getAllMateriales($datos);





// // Ruta de la carpeta
// $valor = "140";
// $carpeta = '../../Materiales/' . $valor;

// // Buscar todos los archivos de imagen en la carpeta
// $imagenes = glob($carpeta . '/*', GLOB_BRACE);

// // Si se encontró al menos una imagen
// if (!empty($imagenes)) {
//     // Tomar la primera imagen encontrada
//     $rutaImagen = $imagenes[0];
// } else {
//     // Si no se encontraron imágenes, puedes manejar esta situación según tu lógica de aplicación
//     $rutaImagen = "hola"; // Otra opción sería asignar una imagen predeterminada
// }

// echo $rutaImagen
?>

<div class="row container mt-5">
    <div class="bottom-rectangle">
        <button type="button" class="btn btn-agregar-material" data-bs-toggle="modal" data-bs-target="#AgregarModal"
            style="--bs-btn-padding-y: .3rem; --bs-btn-padding-x: 2.5rem; --bs-btn-font-size: 1rem;"
            onclick="javascript:AddlimpiarModal();">Agregar
            material</button>
    </div>
    <div class="label-container">
        <input type="text" placeholder="Buscar" id="searchInput" oninput="GetBuscarMateriales()">
        <i class="fas fa-search green-icon" id="searchIcon"></i>
    </div>
    <div style="margin-top: 120px">
        <table class="table table-striped" id="tabla-materiales">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Norma</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>FechaPrecio</th>
                    <th class="col-1" style="width: 140px;">
                        <div class="d-flex align-items-center">
                            <span>Unidad: </span>
                            <select class="form-select form-select-sm ml-2" id="selectUnidad"
                                onchange="javacript:GetFiltrarUnidad()"
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
                        <div style="display: flex; justify-content: space-between;">
                            <span>Estatus: </span>
                            <div class="px-4">
                                <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                                <img id="ValEstatus" src="../img/toggleon_26px.png" width="30px"
                                    onclick="javascript:valStatus(); javascript:GetMateriales()">

                                <!-- <img id="toggleImage" src="../img/toggleoff_26px.png" width="30px"> -->

                            </div>
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
                    <td><?= '$ ' . number_format($fila['precio'], 2, '.', ',') ?></td>
                    <td><?= date('d/m/Y', strtotime($fila['fechaprecio'])) ?></td>
                    <td><?= $fila['unidad'] ?></td>
                    <td class="estatus">
                        <div style="display: flex; justify-content: space-around;">
                            <img style="cursor: pointer;" src="../img/imageviewgreen_24px.png" alt="Mostrar Imagen">

                            <img style="cursor: pointer;" src="../img/edit_rowgreen_24px.png" alt="Modificar"
                                data-bs-toggle="modal" data-bs-target="#EditarModal"
                                onclick="llenarModalModificar(<?= $fila['codigo'] ?>,'<?= $fila['norma'] ?>','<?= $fila['descripcion'] ?>',<?= $fila['precio'] ?>,'<?= $fila['fechaprecio'] ?>','<?= $fila['unidad'] ?>')">

                            <?php if ($fila['estatus']) { ?>
                            <img style="cursor: pointer;"
                                onclick="javascript:CambioEstatus(<?= $fila['codigo'] ?>,'<?= $fila['estatus'] ?>')"
                                src="../img/checkedgreen_24px.png" alt="Checked">
                            <?php
                                    } else { ?>
                            <img style="cursor: pointer;"
                                onclick="javascript:CambioEstatus(<?= $fila['codigo'] ?>,'<?= $fila['estatus'] ?>')"
                                src="../img/uncheckedgreen_24px.png" alt="Checked">
                            <?php
                                    }
                                    ?>
                        </div>
                    </td>
                </tr>
                <?php
                    }
                }
                ?>
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
                        <input type="text" class="form-control" id="AddidInput" style="border: 3px solid #008E5A;"
                            require>
                    </div>
                    <div class="mb-3">
                        <label for="normaInput" class="form-label" style="color: #303030;">Norma</label>
                        <input type="text" class="form-control" id="AddnormaInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="descripcionInput" class="form-label" style="color: #303030;">Descripción</label>
                        <textarea class="form-control" id="AdddescripcionInput" rows="3"
                            style="border: 3px solid #008E5A;"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="precioInput" class="form-label" style="color: #303030;">Precio</label>
                        <input type="text" class="form-control" id="AddprecioInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="fechaPrecioInput" class="form-label" style="color: #303030;">Fecha de precio</label>
                        <input type="date" class="form-control" id="AddfechaPrecioInput"
                            style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="unidadInput" class="form-label" style="color: #303030;">Unidad</label>
                        <select class="form-select" id="AddunidadInput" style="border: 3px solid #008E5A;">
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
                        <input type="file" class="form-control" id="AddimagenInput" onchange="AddmostrarImagen(this)">
                    </div>
                    <img id="AddimagenPreview" src="" alt="Imagen" width="100px">
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
                        <input type="text" class="form-control" id="UpdidInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="normaInput" class="form-label" style="color: #303030;">Norma</label>
                        <input type="text" class="form-control" id="UpdnormaInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="descripcionInput" class="form-label" style="color: #303030;">Descripción</label>
                        <textarea class="form-control" id="UpddescripcionInput" rows="3"
                            style="border: 3px solid #008E5A;"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="precioInput" class="form-label" style="color: #303030;">Precio</label>
                        <input type="text" class="form-control" id="UpdprecioInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="fechaPrecioInput" class="form-label" style="color: #303030;">Fecha de precio</label>
                        <input type="date" class="form-control" id="UpdfechaPrecioInput"
                            style="border: 3px solid #008E5A;">
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
                        <input type="file" class="form-control" id="UpdimagenInput" onchange="UpdmostrarImagen(this)">
                    </div>

                    <img id="UpdimagenPreview" src="" width="100px">
                </div>
                <div class=" modal-footer" style="border-top: 2px solid #008E5A;">
                    <button type="button" class="btn btn-primary"
                        style="background-color: #008E5A; border-color: #008E5A;"
                        onclick="javascript:UpdMaterialValidar()">Guardar</button>
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