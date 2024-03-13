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

<div class="row container">
    <h3>Materiales</h3>
    <div>
        <form class="row g-3">
            <div class="col-md-4">
                <label for="validationDefault01" class="form-label">Codigo</label>
                <input type="text" class="form-control" id="validationDefault01" required>
            </div>
            <div class="col-md-4">
                <label for="validationDefault02" class="form-label">Descripcion</label>
                <input type="text" class="form-control" id="validationDefault02" required>
            </div>

            <div class="col-md-6">
                <label for="validationDefault03" class="form-label">Precio</label>
                <input type="text" class="form-control" id="validationDefault03" required>
            </div>
            <div class="col-md-3">
                <label for="validationDefault04" class="form-label">Unidad</label>
                <select class="form-select" id="validationDefault04" required>
                    <option selected disabled value="">Selecciona una Opcion</option>
                    <option value="PZ">PZ</option>
                    <option value="KG">KG</option>
                    <option value="JG">JG</option>
                </select>
            </div>

            <div class="col-12">
                <button class="btn btn-primary" type="submit">Submit form</button>
            </div>
        </form>
    </div>


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