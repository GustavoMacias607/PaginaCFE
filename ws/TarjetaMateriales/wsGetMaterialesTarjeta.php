<?php
session_start();
if (!isset($_SESSION['idusuario'])) {
    die("No tiene autorizacion para esta operacion");
}
$datos = json_decode(file_get_contents("php://input"));
$resultado['estado'] = "Error";

require_once("../../scripts/connect.php");
require_once("../../scripts/Conexion.php");
require_once("../../scripts/Tarjeta.php");

$c = new Conexion($conData);
$u = new TarjetaMateriales($c->getConnection());

$res = $u->getMateriales($datos);
if ($res['estado'] == "OK") {
    $resultado['estado'] = "OK";
    $resultado['datos'] = $res['datos'];
} else {
    $resultado['estado'] = $res['estado'];
    $resultado['mensaje'] = "N";
}

echo json_encode($resultado);
