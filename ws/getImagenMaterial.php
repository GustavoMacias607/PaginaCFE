<?php
header('Content-Type: application/json');

$materialId = $_POST['idmaterial'] ?? null;

$response = [
    "estado" => "OK",
    "imagen" => null
];

$basePath = __DIR__ . "/../Materiales/$materialId/";

if ($materialId && is_dir($basePath)) {
    foreach (scandir($basePath) as $archivo) {
        if (preg_match('/\.(jpg|jpeg|png)$/i', $archivo)) {
            // Ruta pública HTTPS correcta
            $response["imagen"] = "/sifcao/Materiales/$materialId/$archivo";
            break;
        }
    }
}

echo json_encode($response);