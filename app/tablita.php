<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tabla a Excel</title>
    <!-- Incluye la biblioteca SheetJS -->
    <!-- Cargar SheetJS desde un CDN -->
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.17.5/dist/xlsx.full.min.js"></script>
    <link href="../bootstrap-5.3.1-dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <style>
        /* Estilo para resaltar la sugerencia seleccionada */
        #sugerenciasList li:hover {
            background-color: #f0f0f0;
            cursor: pointer;
        }
    </style>
</head>

<body>
    <table id="miTabla" class="table table-bordered">
        <!-- Contenido de la tabla aquí -->
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col" colspan="2" class="text-center">Nombre</th>
                <th scope="col">Handle</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row">1</th>
                <td style="max-width: 1rem;" contenteditable="true">Mark</td>
                <td contenteditable="true" id="autocompleteInput">

                </td>
                <td contenteditable="true">@mdo</td>
            </tr>
            <tr>
                <th scope="row">2</th>
                <td style="max-width: 1rem;" contenteditable="true">Jacob</td>
                <td contenteditable="true">Thornton</td>
                <td contenteditable="true">@fat</td>
            </tr>
            <tr>
                <th scope="row">3</th>
                <td contenteditable="true" style="color:brown">Larry the Bird</td>
                <td contenteditable="true">Larry the Bird</td>
                <td contenteditable="true">@twitter</td>
            </tr>
        </tbody>
    </table>

    <!-- Agrega un botón para activar la conversión -->
    <button onclick="exportarExcel()">Exportar a Excel</button>

    <script>
        var datosAutocompletar = ["Manzana", "Banana", "Cereza", "Damasco", "Durazno", "Fresa", "Granada", "Kiwi", "Mango",
            "Uva"
        ];

        // Configuración del autocompletado con jQuery UI
        $(function() {
            $("#autocompleteInput").autocomplete({
                source: datosAutocompletar,
                minLength: 1, // Número mínimo de caracteres para activar el autocompletado
                select: function(event, ui) {
                    // Acción al seleccionar una sugerencia
                    console.log("Seleccionado: " + ui.item.value);
                }
            });
        });

        function exportarExcel() {
            // Obtener la tabla
            var tabla = document.getElementById('miTabla');

            // Crear un objeto de libro de trabajo
            var libro = XLSX.utils.table_to_book(tabla);

            // Agregar formato condicional en Excel
            libro.Sheets['Sheet1']['C3'].s = {
                color: {
                    rgb: "8B4513"
                } // Código de color marrón
            };

            // Convertir el libro de trabajo a un archivo Excel binario
            var binario = XLSX.write(libro, {
                bookType: 'xlsx',
                bookSST: true,
                type: 'binary'
            });

            // Crear un Blob para descargar el archivo Excel
            var blob = new Blob([s2ab(binario)], {
                type: 'application/octet-stream'
            });

            // Crear un enlace de descarga y hacer clic en él
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'tabla_excel.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        // Función auxiliar para convertir una cadena binaria en un ArrayBuffer
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xFF;
            }
            return buf;
        }
    </script>
</body>

</html>