<?php
session_start();
if (!isset($_SESSION['idusuario'])) {
    die("No tiene autorizacion para esta operacion");
}
$datos = json_decode(file_get_contents("php://input"));
$resultado['estado'] = "Error";

require_once("../../scripts/connect.php");
require_once("../../scripts/Conexion.php");
require_once("../../scripts/Usuarios.php");

$c = new Conexion($conData);
$u = new Usuario($c->getConnection());

$res = $u->addUser($datos, $clave_enc);
if ($res['estado'] == "OK") {
    $resultado['estado'] = "OK";
} else {
    $resultado['estado'] = $res['estado'];
}

echo json_encode($resultado);