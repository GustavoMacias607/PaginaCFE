<?php
session_start();
if (!isset($_SESSION['idusuario'])) {
    die("No tiene autorizacion para esta operacion");
}
$datos = json_decode(file_get_contents("php://input"));
$resultado['estado'] = "Error";

if (isset($datos->orden)) {
    require_once("../../scripts/connect.php");
    require_once("../../scripts/Conexion.php");
    require_once("../../scripts/Momentos.php");

    $c = new Conexion($conData);
    $u = new Momentos($c->getConnection());
    $res = $u->CheckOrden($datos);

    if ($res['filas'] > 0) {
        $resultado['existe'] = 1;
    } else {
        $resultado['estado'] = $res['estado'];
    }
} else {
    $resultado['estado'] = "Datos vaci";
}

echo json_encode($resultado);