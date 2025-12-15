<?php
if (isset($_POST['id']) && isset($_POST['idAnterior'])) {
    // Convertimos ambos IDs a enteros para eliminar ceros a la izquierda
    $id = intval($_POST['id']);
    $idAnterior = intval($_POST['idAnterior']);

    $nombreCarpeta = $id;
    $directorio = '../../Materiales/' . $nombreCarpeta . '/';
    $directorioAnterior = '../../Materiales/' . $idAnterior . '/';

    // Verificar si el ID ha cambiado
    if ($id !== $idAnterior && is_dir($directorioAnterior)) {
        // Cambiar el nombre de la carpeta al nuevo ID
        if (rename($directorioAnterior, $directorio)) {
            echo 'Carpeta renombrada correctamente. ';
        } else {
            echo 'Error al renombrar la carpeta. ';
        }
    } else {
        // Asegurar que la carpeta existe si el ID no ha cambiado
        if (!is_dir($directorio)) {
            mkdir($directorio, 0777, true);
            echo 'Carpeta creada correctamente. ';
        }
    }

    // Verificar si hay una imagen para guardar
    if (isset($_FILES['imagen']['name']) && !empty($_FILES['imagen']['name'])) {
        // Eliminar cualquier imagen existente en la carpeta
        $archivosCarpeta = glob($directorio . '*'); // Obtener lista de archivos
        foreach ($archivosCarpeta as $archivo) {
            if (is_file($archivo)) {
                unlink($archivo); // Eliminar el archivo
            }
        }

        // Mover la nueva imagen al directorio
        $archivoDestino = $directorio . basename($_FILES['imagen']['name']);
        if (move_uploaded_file($_FILES['imagen']['tmp_name'], $archivoDestino)) {
            echo 'Imagen guardada correctamente.';
        } else {
            echo 'Error al guardar la imagen.';
        }
    } else {
        echo 'No se recibió ninguna imagen nueva. Solo se actualizó la carpeta si el ID cambió.';
    }
} else {
    echo 'Faltan parámetros necesarios.';
}