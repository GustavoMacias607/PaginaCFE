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
require("../../scripts/Departamento.php");
require("../../scripts/Usuario.php");
require("../../scripts/Materiales.php");
require("../../scripts/Momentos.php");

$c = new Conexion($conData);
$u = new Usuario($c->getConnection());
$resU = $u->getAllUsers();


$m = new Materiales($c->getConnection());
$resM = $m->getAllMateriales();
?>

<div class="row container">
    <input style="display: none;" id="vali" type="text" value="A">
    <div class="col-md-10 p-5">
        <h2>Momentos</h2>
        <h4>Agregar Momento</h4>
        <!-- Input para Momento -->
        <form class="row g-3">
            <div class="col-md-6">
                <label for="momento" class="form-label">Momento</label>
                <input onblur="javascript:validaMomento();" type="text" class="form-control" id="momento">
            </div>
            <!-- Select para responsable -->
            <div class="col-md-4">
                <label for="responsable" class="form-label">Responsable</label>
                <select id="responsable" class="form-select">
                    <option selected value="0">Selecciona uno</option>
                    <?php
                    if ($resU['filas'] > 0) {
                        foreach ($resU['datos'] as $fila) {
                    ?>
                            <option value="<?= $fila['nombre'] ?>"><?= utf8_encode($fila['nombre']) ?>
                            </option>
                    <?php
                        }
                    } else {
                        echo "<option>" . $resU['estado'] . "</option>";
                    } ?>

                </select>
            </div>
            <!-- input para Orden -->
            <div class="col-md-6">
                <label for="orden" class="form-label">Orden</label>
                <input onblur="javascript:validaOrden();" type="number" class="form-control" id="orden" min="1">
            </div>
            <div class="col-12">
                <button type="button" onclick="javascript:validaFrmMomento();" class="btn btn-primary">Guardar</button>
            </div>
            <div>
                <input type="file">
            </div>
        </form>


        <!-- Modal Modificar -->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Modificar Momento</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form class="row g-3">
                            <input style="display: none;" type="text" id="IdModal">
                            <input style="display: none;" type="text" id="MomModal">
                            <input style="display: none;" type="text" id="OrModal">
                            <div class="col-md-12">
                                <label for="momentoModal" class="form-label">Momento</label>
                                <input onblur="javascript:validaMomentoModal();" type="text" class="form-control" id="momentoModal">
                            </div>
                            <!-- Select para responsable -->
                            <div class="col-md-12">
                                <label for="responsableModal" class="form-label">Responsable</label>
                                <select id="responsableModal" class="form-select">
                                    <option selected value="0">Selecciona uno</option>
                                    <?php
                                    if ($resU['filas'] > 0) {
                                        foreach ($resU['datos'] as $fila) {
                                    ?>
                                            <option value="<?= $fila['nombre'] ?>"><?= utf8_encode($fila['nombre']) ?>
                                            </option>
                                    <?php
                                        }
                                    } else {
                                        echo "<option>" . $resU['estado'] . "</option>";
                                    } ?>

                                </select>
                            </div>
                            <!-- input para Orden -->
                            <div class="col-md-12">
                                <label for="ordenModal" class="form-label">Orden</label>
                                <input type="number" class="form-control" id="ordenModal" min="1">
                            </div>

                            <!-- input para Estado -->
                            <div class="col-md-12">
                                <label for="estadoModal" class="form-label">Estado</label>
                                <select id="estadoModal" class="form-select">
                                    <option value="0">Seleccione Uno</option>
                                    <option value="A">Activo</option>
                                    <option value="I">Inactivo</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" onclick="javascript:validaFrmMomentoModal();" class="btn btn-primary">Guardar</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <img src="../.././img/Capturas.JPG" class="card-img-top" alt="...">
    <div class="col-md-12 p-5">
        <table id="tbl_momentos" class="table">
            <thead>
                <th>Codigo</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Unidad</th>
                <th>Imagen</th>
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
                            <td><?= utf8_encode($fila['descripcion']) ?></td>
                            <td><?= $fila['precio'] ?></td>
                            <td><?= $fila['unidad'] ?></td>
                            <td></td>
                            <td>
                                <button class="btn btn-danger" onclick="javascript:EliminarMomento(<?= $fila['idmomento'] ?>,'<?= $fila['momento'] ?>');"><i class="fa-solid fa-trash" style="color: #000000;"></i></button>
                                <button class="btn btn-info" onclick="javascript:llenarModalModificar(<?= $fila['idmomento'] ?>, '<?= $fila['momento'] ?>','<?= $fila['estado'] ?>',<?= $fila['orden'] ?>,'<?= $fila['responsable'] ?>');" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fa-regular fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></i></button>
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

<script>

</script>