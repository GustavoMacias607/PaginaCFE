<?php

session_start();
// if (!isset($_SESSION['idusuario'])) {
//     header("Location: ../../index.php");
//     die();
// }
require("../../scripts/connect.php");
require("../../scripts/Conexion.php");
require("../../scripts/Departamento.php");
require("../../scripts/Usuario.php");


$c = new Conexion($conData);
$d = new Departamento($c->getConnection());
$res = $d->getAllDeptos();

$u = new Usuario($c->getConnection());
$resU = $u->getAllUsers();

?>

<div class="row container">
    <div class="col-md-6 p-5">
        <h2>Usuarios</h2>
        <h4>Agregar Usuario</h4>
        <form class="row g-3">
            <div class="col-md-6">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="nombre">
            </div>
            <div class="col-md-6">
                <label for="usuario" class="form-label">Usuario</label>
                <input onblur="javascript:validaUsuario();" type="text" class="form-control" id="usuario">
            </div>
            <!-- input para contraseña -->
            <div class="col-md-6">
                <label for="contrasena" class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="contrasena">
            </div>
            <div class="col-md-6">
                <label for="contrasena2" class="form-label">Confirmar Contraseña</label>
                <input type="password" class="form-control" id="contrasena2">
            </div>
            <!-- fin seccion de contraseña -->
            <!-- input para correo -->

            <!-- fin de input para correo -->
            <div class="col-12">
                <label for="correo" class="form-label">Correo electrónico</label>
                <input type="text" class="form-control" id="correo">
            </div>
            <!-- fin para correo -->
            <div class="col-md-4">
                <label for="iniciales" class="form-label">Iniciales</label>
                <input type="text" class="form-control" id="iniciales">
            </div>
            <div class="col-md-4">
                <label for="depto" class="form-label">Departamento</label>
                <select id="depto" class="form-select">
                    <option selected value="0">Selecciona uno</option>
                    <?php
                    if ($res['filas'] > 0) {
                        foreach ($res['datos'] as $fila) {
                    ?>
                    <option value="<?= $fila['iddepartamento'] ?>"><?= utf8_encode($fila['departamento']) ?>
                    </option>
                    <?php
                        }
                    } else {
                        echo "<option>" . $res['estado'] . "</option>";
                    } ?>

                </select>
            </div>
            <div class="col-md-4">
                <label for="rol" class="form-label">Rol</label>
                <select id="rol" class="form-select">
                    <option selected value="0">Selecciona uno</option>
                    <option value="AD">Administrador</option>
                    <option value="US">Usuario</option>
                </select>
            </div>
            <div class="col-12">
                <button type="button" onclick="javascript:validaFrmUser();" class="btn btn-primary">Guardar</button>
            </div>
        </form>
    </div>
    <div class="col-md-6 p-5">
        <table id="tbl_user" class="table">
            <thead>
                <th>#</th>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Iniciales</th>
                <th>Rol</th>
                <th>Departamento</th>
                <th>Estado</th>
            </thead>
            <tbody>
                <?php
                if ($resU['filas'] == 0) {
                ?>
                <td colspan="8">Sin resultados</td>
                <?php
                } else {
                    $cont = 0;
                    foreach ($resU['datos'] as $fila) {
                        $cont++;
                    ?>
                <tr>
                    <td><?= $cont ?></td>
                    <td><?= $fila['nombre'] ?></td>
                    <td><?= $fila['usuario'] ?></td>
                    <td><?= $fila['correo'] ?></td>
                    <td><?= $fila['iniciales'] ?></td>
                    <td><?= $fila['rol'] ?></td>
                    <td><?= $fila['departamento'] ?></td>
                    <td><?= $fila['estado'] ?></td>
                </tr>
                <?php
                    }
                }
                ?>
            </tbody>
        </table>
    </div>
</div>