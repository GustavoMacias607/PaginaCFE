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

<div class="fondBlanco">
    <div class="bottom-rectangle-materiales">

    </div>


</div>