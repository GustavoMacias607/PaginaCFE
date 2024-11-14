<?php
session_start();

if (isset($_POST['nombre']) && isset($_POST['usuario'])) {
    $_SESSION["nombre"] = $_POST['nombre'];
    $_SESSION["usuario"] = $_POST['usuario'];
    echo json_encode(["estado" => "OK", "mensaje" => "Sesión actualizada con nombre y usuario."]);
} else {
    echo json_encode(["estado" => "ERROR", "mensaje" => "Datos incompletos."]);
}
