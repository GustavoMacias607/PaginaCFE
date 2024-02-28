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

<style>
    #imagen {
        /* Agrega estilos adicionales aquí, por ejemplo: */
        display: block;
        border: 2px solid #333;
    }
</style>
<div class="row container">
    <h3>Materiales</h3>
    <div class="col-md-8 p-5" style="display: flex;">
        <table id="tbl_materiales" class="table">
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
                            <td>
                                <a href="../prubasluis.html">Imagen</a>
                            </td>

                        </tr>
                <?php
                    }
                }
                ?>
            </tbody>

        </table>
        <div>
            <div class="container">
                <img id="imagen" class="ima" style="display: none;" src="https://www.casamyers.com.mx/blog/wp-content/uploads/2019/07/cables-electricos.jpg" width="100px">
            </div>
        </div>
    </div>
</div>

<script>

</script>