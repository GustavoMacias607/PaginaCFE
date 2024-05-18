<?php
session_start();
$resultado['estado'] = "Error";

$datos = json_decode(file_get_contents('php://input'));

if (isset($datos->usuario) && isset($datos->password)) {
    require("../scripts/connect.php");
    require("../scripts/Conexion.php");
    require("../scripts/Usuarios.php");

    $c =  new Conexion($conData);
    $u = new Usuario($c->getConnection());
    $res = $u->getUserLogin($datos, $clave_enc);

    if ($res['filas'] == 1 && $res['estado'] == "OK") {
        foreach ($res['datos'] as $fila) {
            $_SESSION["idusuario"] = $fila['idusuario'];
            $_SESSION["nombre"] = $fila['nombre'];
            $_SESSION["usuario"] = $fila['usuario'];
            $_SESSION["rol"] = $fila['rol'];
            $_SESSION["estatus"] = $fila['estatus'];
        }
        $resultado['estado'] = "OK";
    } else {
        $resultado['estado'] = "Usuario y/o contaseña incorrectos";
    }
}


echo json_encode($resultado);