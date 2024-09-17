<?php
if (isset($_POST['id']) && isset($_POST['idAnterior'])) {
    $id = $_POST['id']; // Nuevo ID
    $idAnterior = $_POST['idAnterior']; // ID anterior
    $nombreCarpeta = $id;
    $directorio = '../../Materiales/' . $nombreCarpeta . '/';
    $directorioAnterior = '../../Materiales/' . $idAnterior . '/';

    // Verificar si el ID ha cambiado
    if ($id !== $idAnterior && is_dir($directorioAnterior)) {
        // Cambiar el nombre de la carpeta al nuevo ID
        if (rename($directorioAnterior, $directorio)) {
            echo 'Carpeta renombrada correctamente.';
        } else {
            echo 'Error al renombrar la carpeta.';
        }
    } else {
        // Asegurar que la carpeta existe si el ID no ha cambiado
        if (!is_dir($directorio)) {
            mkdir($directorio, 0777, true);
        }
    }

    // Verificar si hay una imagen para guardar
    if (isset($_FILES['imagen']['name']) && !empty($_FILES['imagen']['name'])) {
        // Eliminar cualquier imagen existente en la carpeta
        $archivosCarpeta = glob($directorio . '*'); // Obtener lista de archivos en la carpeta
        foreach ($archivosCarpeta as $archivo) {
            if (is_file($archivo)) {
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
        echo 'No se recibió ninguna imagen nueva. Solo se actualizó la carpeta si el ID cambió.';
    }
} else {
    echo 'Faltan parámetros necesarios.';
}
?>
?>

// if (isset($_FILES['imagen']) && isset($_POST['id'])) {
// $id = $_POST['id'];
// $nombreCarpeta = $id;
// $directorio = '../../Materiales/' . $nombreCarpeta . '/';

// // Verificar si la carpeta existe
// if (!is_dir($directorio)) {
// mkdir($directorio, 0777, true); // Si no existe, la crea
// }

// // Verificar si hay una imagen existente en la carpeta
// $archivosCarpeta = glob($directorio . '*'); // Obtener lista de archivos en la carpeta
// foreach ($archivosCarpeta as $archivo) {
// if (is_file($archivo)) { // Verificar si es un archivo
// unlink($archivo); // Eliminar el archivo
// }
// }

// // Mover la nueva imagen al directorio
// $archivo = $directorio . basename($_FILES['imagen']['name']);
// if (move_uploaded_file($_FILES['imagen']['tmp_name'], $archivo)) {
// echo 'Imagen guardada correctamente.';
// } else {
// echo 'Error al guardar la imagen.';
// }
// } else {
// echo 'No se recibió ninguna imagen o ID.';
// }
?>