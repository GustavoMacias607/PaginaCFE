<?php
if (isset($_POST['id']) && isset($_POST['idAnterior'])) {
    $id = $_POST['id']; // Nuevo ID
    $idAnterior = $_POST['idAnterior']; // ID anterior
    $nombreCarpeta = $id;
    $directorio = '../../PDFZona/' . $nombreCarpeta . '/';
    $directorioAnterior = '../../PDFZona/' . $idAnterior . '/';

    // Verificar si el ID ha cambiado y renombrar la carpeta si es necesario
    if ($id !== $idAnterior && is_dir($directorioAnterior)) {
        if (rename($directorioAnterior, $directorio)) {
            echo 'Carpeta renombrada correctamente.';
        } else {
            echo 'Error al renombrar la carpeta.';
        }
    } else {
        // Crear la carpeta si no existe
        if (!is_dir($directorio)) {
            mkdir($directorio, 0777, true);
        }
    }

    // Verificar si se envió un archivo PDF
    if (isset($_FILES['pdfFile']['name']) && !empty($_FILES['pdfFile']['name'])) {
        // Eliminar cualquier archivo PDF existente en la carpeta
        $archivosCarpeta = glob($directorio . '*.pdf');
        foreach ($archivosCarpeta as $archivo) {
            if (is_file($archivo)) {
                unlink($archivo); // Eliminar el archivo
            }
        }

        // Renombrar el archivo PDF (opcional)
        $nombreArchivo = $id . '_documento.pdf';  // Renombramos el archivo a algo más predecible
        $archivo = $directorio . $nombreArchivo;

        // Mover el nuevo PDF al directorio
        if (move_uploaded_file($_FILES['pdfFile']['tmp_name'], $archivo)) {
            echo 'Archivo PDF guardado exitosamente en ' . $directorio;
        } else {
            echo 'Error al guardar el archivo PDF.';
        }
    } else {
        echo 'No se recibió ningún archivo PDF. Solo se actualizó la carpeta si el ID cambió.';
    }
} else {
    echo 'Faltan parámetros necesarios.';
}
