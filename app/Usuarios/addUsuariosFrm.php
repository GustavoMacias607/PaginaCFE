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
//require("../../scripts/Usuarios.php");

$c = new Conexion($conData);
//$m = new Usuarios($c->getConnection());
$datos = array(
    "estatus" => false
);
//$resM = $m->getAllUsuarios($datos);
?>

<link rel="stylesheet" href="stylesusuarios.css">

<div class="row container mt-5 text-lg-start">
    <div class="bottom-rectangle bottom-rectangle-usuarios">
    <div class="text-capitalize text-usuarios" >Usuarios</div>
        <button type="button" class="btn btn-agregar-usuario" data-bs-toggle="modal" data-bs-target="#AgregarModal" style="--bs-btn-padding-y: .3rem; --bs-btn-padding-x: 2.5rem; --bs-btn-font-size: 1rem;" onclick="javascript:AddlimpiarModal();">Agregar
            Usuario</button>
    </div>
    <div class="label-container label-container-usuarios">
        <input type="text" placeholder="Buscar" id="searchInput" oninput="GetBuscarUsuarios()">
        <i class="fas fa-search icon-usuarios" id="searchIcon"></i>
    </div>
    <div class="contTabla contTabla-usuarios" style="margin-top: 5rem;">
        <div class="tabla-container tabla-container-usuarios" style="margin-top: 95px; text-align: center;">
            <table id="tabla-usuarios">
                <thead class="">
                    <tr>
                        <th>
                            <div class="d-flex"> ID
                                <input class="d-none" id="filIdVal" type="checkbox">
                                <div style="margin-left:10px;" onclick="javascript:filtrarDes('id')">
                                    <i id="icId" class="fa-solid fa-angle-up"></i>
                                </div>
                            </div>
                        </th>
                        <th>
                            Nombre
                        </th>
                        <th>
                            Usuario
                        </th>
                        <th class=" col-1" style="width: 140px;">
                            <div class="d-flex align-items-center">
                                <span>Rol: </span>
                                <select class="form-select form-select-sm ml-2" id="selectUnidad" onchange="javacript:GetFiltrarUnidad()" style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                    <option value="todo" selected>Todo</option>
                                    <option value="PZ">Administrador</option>
                                    <option value="KG">Usuario uno</option>
                                    <option value="MT">Usuario dos</option>
                                </select>
                            </div>
                        </th>
                        <th class="col-1" style="width: 170px;">
                            <div style="display: flex; justify-content: space-between;">
                                <span>Estatus: </span>
                                <div class="px-4">
                                    <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                                    <img id="ValEstatus" src="../img/toggleon_26px.png" width="30px" onclick="javascript:valStatus(); javascript:GetUsuarios()">
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
                            <tr class="fila" onmouseover="javascript:mostrarValores(this)" onmouseout="javascript:ocultarValores(this)">

                                <td class="Code"><?= !empty($fila['codigo']) ? $fila['codigo'] : "---" ?></td>
                                <td><?= !empty($fila['norma']) ? $fila['norma'] : "---" ?></td>
                                <td><?= utf8_encode($fila['descripcion']) ?></td>
                                <td><?= '$ ' . number_format($fila['precio'], 2, '.', ',') ?></td>
                                <td><?= !empty($fila['fechaprecio']) ? date('d/m/Y', strtotime($fila['fechaprecio'])) : "---" ?>
                                </td>
                                <td><?= $fila['unidad'] ?></td>
                                <td class="estatus">
                                    <div style="display: flex; justify-content: space-around; align-items: center;">
                                        <div class="miDiv imaCuadro">
                                            <img class="imagenPreview" src="../Usuarios/118" style="border: #303030 solid .5rem; background-color: gray; " height="100%" width="100%">
                                        </div>
                                    </div>
                                    <div class="valores valores-usuarios" style="display: none; justify-content: space-around; align-items: center;">
                                        <img class=" miImagen" style="cursor: pointer;" src="../img/imageviewgreen_24px.png" alt="Mostrar Imagen" onmouseover="mostrarDiv(this)" onmouseout="ocultarDiv(this)">
                                        <img style="cursor: pointer;" src="../img/edit_rowgreen_24px.png" alt="Modificar" data-bs-toggle="modal" data-bs-target="#EditarModal" onclick="llenarModalModificar(<?= $fila['codigo'] ?>,'<?= $fila['norma'] ?>','<?= $fila['descripcion'] ?>',<?= $fila['precio'] ?>,'<?= $fila['fechaprecio'] ?>','<?= $fila['unidad'] ?>')">
                                        <?php if ($fila['estatus']) { ?>
                                            <img style="cursor: pointer;" onclick="javascript:CambioEstatus(<?= $fila['codigo'] ?>,'<?= $fila['estatus'] ?>')" src="../img/checkedgreen_24px.png" alt="Checked">
                                        <?php
                                        } else { ?>
                                            <img style="cursor: pointer;" onclick="javascript:CambioEstatus(<?= $fila['codigo'] ?>,'<?= $fila['estatus'] ?>')" src="../img/uncheckedgreen_24px.png" alt="Checked">
                                    </div>
                                <?php
                                        }

                                ?>
                                </td>
                            </tr>
                    <?php
                        }
                    }
                    ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

    <!-- Modal insertar usuario -->
    <div class="modal modal-usuarios" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content" style="border: 3px solid #008E5A;">
                <div class="modal-header" style="border-bottom: 2px solid #008E5A;">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar usuario</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="idInput" class="form-label" style="color: #303030;">ID</label>
                        <input type="text" class="form-control" id="AddidInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="nombreInput" class="form-label" style="color: #303030;">Nombre</label>
                        <input type="text" class="form-control" id="AddnombreInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="usuarioInput" class="form-label" style="color: #303030;">Usuario</label>
                        <input class="form-control" id="AddusuarioInput" rows="3" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="passInput" class="form-label" style="color: #303030;">Contraseña</label>
                        <input class="form-control" id="AddpassInput" rows="3" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="passconfirmInput" class="form-label" style="color: #303030;">Confirme su contraseña</label>
                        <input class="form-control" id="AddpassInput" rows="3" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="rolInput" class="form-label" style="color: #303030;">Rol</label>
                        <select class="form-select" id="AddrolInput" style=" border: 3px solid #008E5A;">
                            <option selected></option>
                            <option value="ADMIN">Administrador</option>
                            <option value="USUUNO">Usuario uno</option>
                            <option value="USUDOS">Usuario dos</option>
                        </select>
                    </div>
                <div class="modal-footer-usuarios" style="color: none">
                    <button type="button" class="btn btn-primary" onclick="javascript:AddUsuarioValidar();" style="background-color: #008E5A; border-color: #008E5A;">Guardar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal modificar Usuario-->
    <div class="modal fade" id="EditarModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content" style="border: 3px solid #008E5A;">
                <div class="modal-header" style="border-bottom: 2px solid #008E5A;">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Modificar usuario</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body modal-body-usuarios">
                    <input type="text" class="form-control d-none" id="idAnterior" style="border: 3px solid #008E5A;">
                    <div class="mb-3">
                        <label for="idInput" class="form-label" style="color: #303030;">ID</label>
                        <input type="text" class="form-control" id="UpdidInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="nombreInput" class="form-label" style="color: #303030;">Nombre</label>
                        <input type="text" class="form-control" id="UpdnombreInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="usuarioInput" class="form-label" style="color: #303030;">Usuario</label>
                        <input class="form-control" id="UpdusuarioInput" rows="3" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="urolInput" class="form-label" style="color: #303030;">Rol</label>
                        <select class="form-select" id="UpdrolInput" style="border: 3px solid #008E5A;" disabled>
                            <option selected></option>
                            <option value="ADMIN">Administrador</option>
                            <option value="USUUNO">Usuario uno</option>
                            <option value="USUDOS">Usuario dos</option>
                        </select>
                    </div>
                </div>
                <div class=" modal-footer" style="color: none">
                    <button type="button" class="btn btn-primary" style="background-color: #008E5A; border-color: #008E5A;" onclick="javascript:UpdUsuarioValidar()">Guardar</button>
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