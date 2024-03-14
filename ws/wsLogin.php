<?php
session_start();
$resultado['estado'] = "Error";

$datos = json_decode(file_get_contents('php://input'));

$debug_on = 0;
if ($debug_on == 1) {
    $_SESSION['idusuario'] = "1";
    $resultado['estado'] = "OK";
} else {
    if (isset($datos->usuario) && isset($datos->password)) {
        require("../scripts/connect.php");
        require("../scripts/Conexion.php");
        require("../scripts/Usuario.php");

        $c =  new Conexion($conData);
        //$u = new Usuario($c->getConnection());
        $res = $u->getUserLogin($datos, $clave_enc);



        if ($res['filas'] == 1 && $res['estado'] == "OK") {
            foreach ($res['datos'] as $fila) {
                $_SESSION["idusuario"] = $fila['idusuario'];
                $_SESSION["nombre"] = $fila['nombre'];
            }
            $resultado['estado'] = "OK";
        } else {
            $resultado['estado'] = "Usuario y/o Contaseña Incorrecta";
        }
    }
}

echo json_encode($resultado);
