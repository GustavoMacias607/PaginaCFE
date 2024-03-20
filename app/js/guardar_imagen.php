<?php
if (isset($_FILES['imagen']) && isset($_POST['id'])) {
    $id = $_POST['id'];
    $nombreCarpeta = $id;
    $directorio = '../../Materiales/' . $nombreCarpeta . '/';

    // Verificar si la carpeta existe
    if (!is_dir($directorio)) {
        mkdir($directorio, 0777, true); // Si no existe, la crea
    }

    // Verificar si hay una imagen existente en la carpeta
    $archivosCarpeta = glob($directorio . '*'); // Obtener lista de archivos en la carpeta
    foreach ($archivosCarpeta as $archivo) {
        if (is_file($archivo)) { // Verificar si es un archivo
            unlink($archivo); // Eliminar el archivo
        }
    }

    // Mover la nueva imagen al directorio
    $archivo = $directorio . basename($_FILES['imagen']['name']);
    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $archivo)) {
        echo 'Imagen guardada correctamente.';
    } else {
        echo 'Error al guardar la imagen.';
    }
} else {
    echo 'No se recibió ninguna imagen o ID.';
}
