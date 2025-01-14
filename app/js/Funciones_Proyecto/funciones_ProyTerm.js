
function llenarCamposPaginaTerminado() {
    let id = document.getElementById("lblId").innerHTML = datosProyecto.idProyecto;
    let zona = document.getElementById("lblZona").innerHTML = datosProyecto.zona;
    let tipoObra = document.getElementById("lblTipoObra").innerHTML = datosProyecto.obra;
    let fechaInicio = document.getElementById("lblFechaInicio").innerHTML = formatearFecha(datosProyecto.fechaInicio);
    let fechaTermino = document.getElementById("lblFechaTermino").innerHTML = formatearFecha(datosProyecto.fechaTermino);
    let nombre = document.getElementById("lblNombre").value = datosProyecto.nombre;
    let periodo = document.getElementById("lblPeriodo").innerHTML = datosProyecto.periodo;
    MostrarConceptosContenidosProyectoTerminado();


    getMaterialesSi();
    getMaterialesNo();
    getMaquinarias();
    getManoObras();
}

function mostrarTablaTerminado(tablaId, boton) {
    const tabla = document.getElementById(tablaId);
    const isVisible = tabla.style.display === 'block';
    // Ocultar todas las tablas
    const tablas = document.querySelectorAll('div[id^="tabla"]');
    tablas.forEach(tabla => {
        tabla.style.display = 'none';
    });

    // Remover la clase de todos los botones
    const botones = document.querySelectorAll('.btnTabla');
    botones.forEach(btn => {
        btn.classList.remove('btnPresionadoTablasTerminado');
        btn.classList.add('btnTerminadoBn');
    });

    if (!isVisible) {
        // Mostrar la tabla correspondiente
        tabla.style.display = 'block';

        // Añadir la clase al botón presionado
        boton.classList.add('btnPresionadoTablasTerminado');
        boton.classList.remove('btnTerminadoBn');
    } else {
        // Si la tabla ya está visible, ocultarla y restablecer el estilo del botón
        tabla.style.display = 'none';
        boton.classList.remove('btnPresionadoTablasTerminado');
        boton.classList.add('btnTerminadoBn');
    }
}


function MostrarConceptosContenidosProyectoTerminado() {
    const datos = {};
    datos.idProyecto = datosProyecto.idProyecto;
    let json = JSON.stringify(datos);
    let url = "../ws/ConceptosProyecto/wsGetConceptos.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                let datosBd = resp.datos;
                console.log(datosBd);
                if (datosBd) {
                    datosBd.forEach((datos) => {
                        editedRows[datos.IdConcepto] = {
                            cantidad: datos.CantidadTotal,
                            estatus: datos.EstatusConcepto,
                            idconcepto: datos.IdConcepto,
                            nombre: datos.NombreConcepto,
                            nombreespe: "",
                            total: datos.TotalConcepto,
                            unidad: datos.UnidadConcepto,
                        };
                    });
                } else {
                    editedRows = {};
                }
                GeneradorTablaConcepto();
                llenarTablaConceptosTerminado();
            } else {
                throw new Error(status);
            }
        } catch (error) {
            alert("Error: " + error);
        }
    });
}


/***
 * 
 * 
 * 
 * Llenando tablas
 * 
 * 
 * 
 */

/***
 * 
 * 
 * conceptos
 * 
 * 
 */

function llenarTablaConceptosTerminado() {
    let total = 0;
    const tableBody = document.getElementById("table-bodyConceptos");
    tableBody.innerHTML = "";
    const editedRowsArray = Object.values(editedRows);
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
    if (editedRowsArray.length > 0) {
        editedRowsArray.forEach(record => {
            const precioFormateado = record.total ? formatoMXN.format(record.total) : "---";
            let importe = record.cantidad * record.total
            total += importe;
            const importeFormateado = record.total ? formatoMXN.format(importe) : "---";
            const row = document.createElement('tr');
            row.classList.add('fila');
            // Establecer el contenido HTML de la fila
            row.innerHTML = `
                    <td class="Code">${record.idconcepto}</td>
                    <td>${record.nombre !== "" ? record.nombre : "---"}</td>
                    <td>${record.unidad !== "" ? record.unidad : "---"}</td>
                    <td>${record.cantidad !== "" ? record.cantidad : "---"}</td>
                    <td>${precioFormateado}</td>
                    <td>${importeFormateado}</td>
                `;
            // Añadir eventos mouseover y mouseout
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));

            // Añadir la fila al tbody
            tableBody.appendChild(row);
        });
        let totalImporteConcepto = document.getElementById("TotalSumaImporteConceptos");
        totalImporteConcepto.innerHTML = formatoMXN.format(total);
    } else {
        const row = `
        <tr class="fila">
            <td colspan="6" class="Code">Sin resultados</td>
        </tr>
    `;
        tableBody.innerHTML += row;
    }
}


/***
 * 
 * 
 * 
 * Exportaciones a PDF
 * 
 * 
 * 
 */


function ExportarPDFMaterialesSi() {
    let total = document.getElementById("TotalSumaMaterialesSi").innerHTML;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tableBody = document.getElementById("table-bodyMaterialesSuministrados");
    const rows = tableBody.querySelectorAll("tr");

    const tableColumn = ["ID", "Descripción", "Unidad", "Precio U", "Cantidad", "Importe"];
    const tableRows = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.innerText);
        tableRows.push(rowData);
    });

    // Encabezado sin espacio entre renglones
    const addHeader = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const marginRight = 23; // Margen derecho (2.3 cm)
        const headerX = pageWidth - marginRight; // Posición X del encabezado
        const headerYStart = 25; // Posición Y del primer renglón (3 cm del margen superior)

        doc.setTextColor(0, 142, 90); // Verde CFE (#008e5a)

        // Línea 1
        doc.setFont("helvetica", "boldoblique"); // Helvetica Bold Condensed Oblique
        doc.setFontSize(12);
        const line1 = "División de distribución Jalisco";
        doc.text(line1, headerX, headerYStart, { align: "right" });

        // Línea 2
        doc.setFont("helvetica", "oblique"); // Helvetica Condensed Oblique
        doc.setFontSize(10);
        const line2 = "Zona " + datosProyecto.zona;
        doc.text(line2, headerX, headerYStart + 3.6, { align: "right" }); // Solo 3.6 mm debajo del anterior

        // Línea 3
        doc.setFontSize(9);
        const line3 = "Departamento de Planeación, Proyectos y Construcción";
        doc.text(line3, headerX, headerYStart + 7, { align: "right" }); // Solo 3.4 mm debajo del anterior
    };

    // Pie de página centrado
    const footerTextLine1 = "Rio Lerma 334, 1er Piso, Col. Cuauhtémoc C.P. 06589, Ciudad de México";
    const footerTextLine2 = "Tel. 52 29 44 00 ext. 92104";

    const addFooter = (doc) => {
        const pageHeight = doc.internal.pageSize.height; // Altura de la página
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const footerY = pageHeight - 15; // 1.5 cm desde la parte inferior (15 mm)

        doc.setFont("helvetica", "oblique"); // Fuente Helvetica Condensed Oblique
        doc.setTextColor(0, 0, 0, 0.8); // Color negro al 80%
        doc.setFontSize(10); // Tamaño de fuente

        const textWidthLine1 = doc.getTextWidth(footerTextLine1); // Ancho del primer renglón
        const textWidthLine2 = doc.getTextWidth(footerTextLine2); // Ancho del segundo renglón

        // Centrar los dos renglones
        doc.text(footerTextLine1, (pageWidth - textWidthLine1) / 2, footerY - 5); // Primer renglón
        doc.text(footerTextLine2, (pageWidth - textWidthLine2) / 2, footerY + 0); // Segundo renglón
    };

    // Agregar título de la tabla
    const addTitle = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const marginRight = 23; // Margen derecho (2.3 cm)
        const titleX = pageWidth - marginRight; // Posición X del título
        const titleY = 45; // Posición Y del título (4.5 cm del margen superior)

        doc.setFont("helvetica", "normal"); // Helvetica Roman
        doc.setFontSize(10);
        const title = "Materiales suministrados por CFE";
        doc.text(title, titleX, titleY, { align: "right" });
    };

    // Agregar imagen
    const addImage = (doc) => {
        const imageUrl = '/paginacfe/app/img/LogoPdf.PNG'; // Reemplaza con la URL o base64 de tu imagen
        const marginLeft = 15; // Margen izquierdo (1.5 cm)
        const marginTop = 15; // Margen superior (1.5 cm)
        const imageWidth = 45; // Ancho de la imagen (ajusta según sea necesario)
        const imageHeight = 15; // Altura de la imagen (ajusta según sea necesario)

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    };

    // Generar la tabla y configurar estilos
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        margin: { top: 50, right: 23, bottom: 40, left: 23 }, // Margen en milímetros (5 cm en Y, 2.3 cm en X)
        headStyles: {
            fillColor: "#008e5a", // Color de fondo del encabezado
            textColor: "#FFFFFF", // Color del texto en el encabezado
            fontStyle: "bold",   // Texto en negrita
        },
        bodyStyles: {
            font: "helvetica", // Fuente Helvetica Roman
            fontStyle: "normal", // Estilo de fuente normal
            fontSize: 8, // Tamaño de letra 8
        },
        columnStyles: {
            0: { halign: 'right' }, // Centrar contenido de la columna "ID"
            1: { halign: 'justify' }, // Justificar contenido de la columna "Nombre"
            2: { halign: 'left' }, // Centrar contenido de la columna "Unidad"
            3: { halign: 'right' }, // Centrar contenido de la columna "Cantidad"
            4: { halign: 'left' }, // Centrar contenido de la columna "Precio U"
            5: { halign: 'right' } // Alinear a la derecha contenido de la columna "Importe"
        },
        didDrawPage: () => {
            addImage(doc); // Agregar imagen
            addHeader(doc); // Agregar encabezado
            addTitle(doc); // Agregar título
            addFooter(doc); // Agregar pie de página
        },
        didDrawCell: (data) => {
            if (data.section === 'body' && data.row.index === tableRows.length - 1) {
                const pageWidth = doc.internal.pageSize.width; // Ancho de la página
                const marginRight = 23; // Margen derecho (2.3 cm)
                const totalX = pageWidth - marginRight - 1; // Posición X del texto "Total:" con margen adicional
                const totalY = data.cell.y + data.cell.height + 10; // Posición Y del texto "Total:"

                doc.setFont("helvetica", "normal"); // Helvetica Roman
                doc.setFontSize(8);
                const totalText = "Total: " + total;
                const textWidth = doc.getTextWidth(totalText);

                // Dibujar el borde superior
                doc.setDrawColor(0, 142, 90); // Color del borde (#008e5a)
                doc.setLineWidth(0.5); // Ancho de la línea
                doc.line(totalX - textWidth, totalY - 4, totalX, totalY - 4); // Dibujar la línea

                // Dibujar el texto
                doc.text(totalText, totalX, totalY, { align: "right" });
            }
        }
    });

    doc.save("tablaMaterialesSuministrados.pdf");
}

function ExportarPDFMaterialesNo() {
    let total = document.getElementById("TotalSumaMaterialesNo").innerHTML;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tableBody = document.getElementById("table-bodyMaterialesNosuministrados");
    const rows = tableBody.querySelectorAll("tr");

    const tableColumn = ["ID", "Descripción", "Unidad", "Precio U", "Cantidad", "Importe"];
    const tableRows = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.innerText);
        tableRows.push(rowData);
    });

    // Encabezado sin espacio entre renglones
    const addHeader = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const marginRight = 23; // Margen derecho (2.3 cm)
        const headerX = pageWidth - marginRight; // Posición X del encabezado
        const headerYStart = 25; // Posición Y del primer renglón (3 cm del margen superior)

        doc.setTextColor(0, 142, 90); // Verde CFE (#008e5a)

        // Línea 1
        doc.setFont("helvetica", "boldoblique"); // Helvetica Bold Condensed Oblique
        doc.setFontSize(12);
        const line1 = "División de distribución Jalisco";
        doc.text(line1, headerX, headerYStart, { align: "right" });

        // Línea 2
        doc.setFont("helvetica", "oblique"); // Helvetica Condensed Oblique
        doc.setFontSize(10);
        const line2 = "Zona " + datosProyecto.zona;
        doc.text(line2, headerX, headerYStart + 3.6, { align: "right" }); // Solo 3.6 mm debajo del anterior

        // Línea 3
        doc.setFontSize(9);
        const line3 = "Departamento de Planeación, Proyectos y Construcción";
        doc.text(line3, headerX, headerYStart + 7, { align: "right" }); // Solo 3.4 mm debajo del anterior
    };

    // Pie de página centrado
    const footerTextLine1 = "Rio Lerma 334, 1er Piso, Col. Cuauhtémoc C.P. 06589, Ciudad de México";
    const footerTextLine2 = "Tel. 52 29 44 00 ext. 92104";

    const addFooter = (doc) => {
        const pageHeight = doc.internal.pageSize.height; // Altura de la página
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const footerY = pageHeight - 15; // 1.5 cm desde la parte inferior (15 mm)

        doc.setFont("helvetica", "oblique"); // Fuente Helvetica Condensed Oblique
        doc.setTextColor(0, 0, 0, 0.8); // Color negro al 80%
        doc.setFontSize(10); // Tamaño de fuente

        const textWidthLine1 = doc.getTextWidth(footerTextLine1); // Ancho del primer renglón
        const textWidthLine2 = doc.getTextWidth(footerTextLine2); // Ancho del segundo renglón

        // Centrar los dos renglones
        doc.text(footerTextLine1, (pageWidth - textWidthLine1) / 2, footerY - 5); // Primer renglón
        doc.text(footerTextLine2, (pageWidth - textWidthLine2) / 2, footerY + 0); // Segundo renglón
    };

    // Agregar título de la tabla
    const addTitle = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const marginRight = 23; // Margen derecho (2.3 cm)
        const titleX = pageWidth - marginRight; // Posición X del título
        const titleY = 45; // Posición Y del título (4.5 cm del margen superior)

        doc.setFont("helvetica", "normal"); // Helvetica Roman
        doc.setFontSize(10);
        const title = "Materiales no suministrados por CFE";
        doc.text(title, titleX, titleY, { align: "right" });
    };

    // Agregar imagen
    const addImage = (doc) => {
        const imageUrl = '/paginacfe/app/img/LogoPdf.PNG'; // Reemplaza con la URL o base64 de tu imagen
        const marginLeft = 15; // Margen izquierdo (1.5 cm)
        const marginTop = 15; // Margen superior (1.5 cm)
        const imageWidth = 45; // Ancho de la imagen (ajusta según sea necesario)
        const imageHeight = 15; // Altura de la imagen (ajusta según sea necesario)

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    };

    // Generar la tabla y configurar estilos
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        margin: { top: 50, right: 23, bottom: 40, left: 23 }, // Margen en milímetros (5 cm en Y, 2.3 cm en X)
        headStyles: {
            fillColor: "#008e5a", // Color de fondo del encabezado
            textColor: "#FFFFFF", // Color del texto en el encabezado
            fontStyle: "bold",   // Texto en negrita
        },
        bodyStyles: {
            font: "helvetica", // Fuente Helvetica Roman
            fontStyle: "normal", // Estilo de fuente normal
            fontSize: 8, // Tamaño de letra 8
        },
        columnStyles: {
            0: { halign: 'right' }, // Centrar contenido de la columna "ID"
            1: { halign: 'justify' }, // Justificar contenido de la columna "Nombre"
            2: { halign: 'left' }, // Centrar contenido de la columna "Unidad"
            3: { halign: 'right' }, // Centrar contenido de la columna "Cantidad"
            4: { halign: 'left' }, // Centrar contenido de la columna "Precio U"
            5: { halign: 'right' } // Alinear a la derecha contenido de la columna "Importe"
        },
        didDrawPage: () => {
            addImage(doc); // Agregar imagen
            addHeader(doc); // Agregar encabezado
            addTitle(doc); // Agregar título
            addFooter(doc); // Agregar pie de página
        },
        didDrawCell: (data) => {
            if (data.section === 'body' && data.row.index === tableRows.length - 1) {
                const pageWidth = doc.internal.pageSize.width; // Ancho de la página
                const marginRight = 23; // Margen derecho (2.3 cm)
                const totalX = pageWidth - marginRight - 1; // Posición X del texto "Total:" con margen adicional
                const totalY = data.cell.y + data.cell.height + 10; // Posición Y del texto "Total:"

                doc.setFont("helvetica", "normal"); // Helvetica Roman
                doc.setFontSize(8);
                const totalText = "Total: " + total;
                const textWidth = doc.getTextWidth(totalText);

                // Dibujar el borde superior
                doc.setDrawColor(0, 142, 90); // Color del borde (#008e5a)
                doc.setLineWidth(0.5); // Ancho de la línea
                doc.line(totalX - textWidth, totalY - 4, totalX, totalY - 4); // Dibujar la línea

                // Dibujar el texto
                doc.text(totalText, totalX, totalY, { align: "right" });
            }
        }
    });

    doc.save("tablaMaterialesNoSuministrados.pdf");
}

function ExportarPDFManoObra() {
    let total = document.getElementById("TotalSumaManoObra").innerHTML;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tableBody = document.getElementById("table-bodyManoObra");
    const rows = tableBody.querySelectorAll("tr");

    const tableColumn = ["ID", "Categoría", "Unidad", "Salario", "Cantidad", "Sr", "Importe"];
    const tableRows = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.innerText);
        tableRows.push(rowData);
    });

    // Encabezado sin espacio entre renglones
    const addHeader = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const marginRight = 23; // Margen derecho (2.3 cm)
        const headerX = pageWidth - marginRight; // Posición X del encabezado
        const headerYStart = 25; // Posición Y del primer renglón (3 cm del margen superior)

        doc.setTextColor(0, 142, 90); // Verde CFE (#008e5a)

        // Línea 1
        doc.setFont("helvetica", "boldoblique"); // Helvetica Bold Condensed Oblique
        doc.setFontSize(12);
        const line1 = "División de distribución Jalisco";
        doc.text(line1, headerX, headerYStart, { align: "right" });

        // Línea 2
        doc.setFont("helvetica", "oblique"); // Helvetica Condensed Oblique
        doc.setFontSize(10);
        const line2 = "Zona " + datosProyecto.zona;
        doc.text(line2, headerX, headerYStart + 3.6, { align: "right" }); // Solo 3.6 mm debajo del anterior

        // Línea 3
        doc.setFontSize(9);
        const line3 = "Departamento de Planeación, Proyectos y Construcción";
        doc.text(line3, headerX, headerYStart + 7, { align: "right" }); // Solo 3.4 mm debajo del anterior
    };

    // Pie de página centrado
    const footerTextLine1 = "Rio Lerma 334, 1er Piso, Col. Cuauhtémoc C.P. 06589, Ciudad de México";
    const footerTextLine2 = "Tel. 52 29 44 00 ext. 92104";

    const addFooter = (doc) => {
        const pageHeight = doc.internal.pageSize.height; // Altura de la página
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const footerY = pageHeight - 15; // 1.5 cm desde la parte inferior (15 mm)

        doc.setFont("helvetica", "oblique"); // Fuente Helvetica Condensed Oblique
        doc.setTextColor(0, 0, 0, 0.8); // Color negro al 80%
        doc.setFontSize(10); // Tamaño de fuente

        const textWidthLine1 = doc.getTextWidth(footerTextLine1); // Ancho del primer renglón
        const textWidthLine2 = doc.getTextWidth(footerTextLine2); // Ancho del segundo renglón

        // Centrar los dos renglones
        doc.text(footerTextLine1, (pageWidth - textWidthLine1) / 2, footerY - 5); // Primer renglón
        doc.text(footerTextLine2, (pageWidth - textWidthLine2) / 2, footerY + 0); // Segundo renglón
    };

    // Agregar título de la tabla
    const addTitle = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const marginRight = 23; // Margen derecho (2.3 cm)
        const titleX = pageWidth - marginRight; // Posición X del título
        const titleY = 45; // Posición Y del título (4.5 cm del margen superior)

        doc.setFont("helvetica", "normal"); // Helvetica Roman
        doc.setFontSize(10);
        const title = "Mano de obra";
        doc.text(title, titleX, titleY, { align: "right" });
    };

    // Agregar imagen
    const addImage = (doc) => {
        const imageUrl = '/paginacfe/app/img/LogoPdf.PNG'; // Reemplaza con la URL o base64 de tu imagen
        const marginLeft = 15; // Margen izquierdo (1.5 cm)
        const marginTop = 15; // Margen superior (1.5 cm)
        const imageWidth = 45; // Ancho de la imagen (ajusta según sea necesario)
        const imageHeight = 15; // Altura de la imagen (ajusta según sea necesario)

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    };

    // Generar la tabla y configurar estilos
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        margin: { top: 50, right: 23, bottom: 40, left: 23 }, // Margen en milímetros (5 cm en Y, 2.3 cm en X)
        headStyles: {
            fillColor: "#008e5a", // Color de fondo del encabezado
            textColor: "#FFFFFF", // Color del texto en el encabezado
            fontStyle: "bold",   // Texto en negrita
        },
        bodyStyles: {
            font: "helvetica", // Fuente Helvetica Roman
            fontStyle: "normal", // Estilo de fuente normal
            fontSize: 8, // Tamaño de letra 8
        },
        columnStyles: {
            0: { halign: 'left' }, // Centrar contenido de la columna "ID"
            1: { halign: 'left' }, // Justificar contenido de la columna "Nombre"
            2: { halign: 'left' }, // Centrar contenido de la columna "Unidad"
            3: { halign: 'right' }, // Centrar contenido de la columna "Cantidad"
            4: { halign: 'left' }, // Centrar contenido de la columna "Precio U"
            5: { halign: 'right' }, // Alinear a la derecha contenido de la columna "Importe"
            6: { halign: 'right' } // Alinear a la derecha contenido de la columna "Importe"
        },
        didDrawPage: () => {
            addImage(doc); // Agregar imagen
            addHeader(doc); // Agregar encabezado
            addTitle(doc); // Agregar título
            addFooter(doc); // Agregar pie de página
        },
        didDrawCell: (data) => {
            if (data.section === 'body' && data.row.index === tableRows.length - 1) {
                const pageWidth = doc.internal.pageSize.width; // Ancho de la página
                const marginRight = 23; // Margen derecho (2.3 cm)
                const totalX = pageWidth - marginRight - 1; // Posición X del texto "Total:" con margen adicional
                const totalY = data.cell.y + data.cell.height + 10; // Posición Y del texto "Total:"

                doc.setFont("helvetica", "normal"); // Helvetica Roman
                doc.setFontSize(8);
                const totalText = "Total: " + total;
                const textWidth = doc.getTextWidth(totalText);

                // Dibujar el borde superior
                doc.setDrawColor(0, 142, 90); // Color del borde (#008e5a)
                doc.setLineWidth(0.5); // Ancho de la línea
                doc.line(totalX - textWidth, totalY - 4, totalX, totalY - 4); // Dibujar la línea

                // Dibujar el texto
                doc.text(totalText, totalX, totalY, { align: "right" });
            }
        }
    });

    doc.save("tablaManoObra.pdf");
}

function ExportarPDFHerramientasMano() {
    let total = document.getElementById("TotalSumaHerramientas").innerHTML;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tableBody = document.getElementById("table-bodyHerramientas");
    const rows = tableBody.querySelectorAll("tr");

    const tableColumn = ["Descripción", "Kh", "Mano de obra", "Importe"];
    const tableRows = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.innerText);
        tableRows.push(rowData);
    });

    // Encabezado sin espacio entre renglones
    const addHeader = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const marginRight = 23; // Margen derecho (2.3 cm)
        const headerX = pageWidth - marginRight; // Posición X del encabezado
        const headerYStart = 25; // Posición Y del primer renglón (3 cm del margen superior)

        doc.setTextColor(0, 142, 90); // Verde CFE (#008e5a)

        // Línea 1
        doc.setFont("helvetica", "boldoblique"); // Helvetica Bold Condensed Oblique
        doc.setFontSize(12);
        const line1 = "División de distribución Jalisco";
        doc.text(line1, headerX, headerYStart, { align: "right" });

        // Línea 2
        doc.setFont("helvetica", "oblique"); // Helvetica Condensed Oblique
        doc.setFontSize(10);
        const line2 = "Zona " + datosProyecto.zona;
        doc.text(line2, headerX, headerYStart + 3.6, { align: "right" }); // Solo 3.6 mm debajo del anterior

        // Línea 3
        doc.setFontSize(9);
        const line3 = "Departamento de Planeación, Proyectos y Construcción";
        doc.text(line3, headerX, headerYStart + 7, { align: "right" }); // Solo 3.4 mm debajo del anterior
    };

    // Pie de página centrado
    const footerTextLine1 = "Rio Lerma 334, 1er Piso, Col. Cuauhtémoc C.P. 06589, Ciudad de México";
    const footerTextLine2 = "Tel. 52 29 44 00 ext. 92104";

    const addFooter = (doc) => {
        const pageHeight = doc.internal.pageSize.height; // Altura de la página
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const footerY = pageHeight - 15; // 1.5 cm desde la parte inferior (15 mm)

        doc.setFont("helvetica", "oblique"); // Fuente Helvetica Condensed Oblique
        doc.setTextColor(0, 0, 0, 0.8); // Color negro al 80%
        doc.setFontSize(10); // Tamaño de fuente

        const textWidthLine1 = doc.getTextWidth(footerTextLine1); // Ancho del primer renglón
        const textWidthLine2 = doc.getTextWidth(footerTextLine2); // Ancho del segundo renglón

        // Centrar los dos renglones
        doc.text(footerTextLine1, (pageWidth - textWidthLine1) / 2, footerY - 5); // Primer renglón
        doc.text(footerTextLine2, (pageWidth - textWidthLine2) / 2, footerY + 0); // Segundo renglón
    };

    // Agregar título de la tabla
    const addTitle = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const marginRight = 23; // Margen derecho (2.3 cm)
        const titleX = pageWidth - marginRight; // Posición X del título
        const titleY = 45; // Posición Y del título (4.5 cm del margen superior)

        doc.setFont("helvetica", "normal"); // Helvetica Roman
        doc.setFontSize(10);
        const title = "Herramientas de mano de obra";
        doc.text(title, titleX, titleY, { align: "right" });
    };

    // Agregar imagen
    const addImage = (doc) => {
        const imageUrl = '/paginacfe/app/img/LogoPdf.PNG'; // Reemplaza con la URL o base64 de tu imagen
        const marginLeft = 15; // Margen izquierdo (1.5 cm)
        const marginTop = 15; // Margen superior (1.5 cm)
        const imageWidth = 45; // Ancho de la imagen (ajusta según sea necesario)
        const imageHeight = 15; // Altura de la imagen (ajusta según sea necesario)

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    };

    // Generar la tabla y configurar estilos
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        margin: { top: 50, right: 23, bottom: 40, left: 23 }, // Margen en milímetros (5 cm en Y, 2.3 cm en X)
        headStyles: {
            fillColor: "#008e5a", // Color de fondo del encabezado
            textColor: "#FFFFFF", // Color del texto en el encabezado
            fontStyle: "bold",   // Texto en negrita
        },
        bodyStyles: {
            font: "helvetica", // Fuente Helvetica Roman
            fontStyle: "normal", // Estilo de fuente normal
            fontSize: 8, // Tamaño de letra 8
        },
        columnStyles: {
            0: { halign: 'left' }, // Centrar contenido de la columna "ID"
            1: { halign: 'left' }, // Justificar contenido de la columna "Nombre"
            2: { halign: 'right' }, // Centrar contenido de la columna "Unidad"
            3: { halign: 'right' } // Alinear a la derecha contenido de la columna "Importe"
        },
        didDrawPage: () => {
            addImage(doc); // Agregar imagen
            addHeader(doc); // Agregar encabezado
            addTitle(doc); // Agregar título
            addFooter(doc); // Agregar pie de página
        },
        didDrawCell: (data) => {
            if (data.section === 'body' && data.row.index === tableRows.length - 1) {
                const pageWidth = doc.internal.pageSize.width; // Ancho de la página
                const marginRight = 23; // Margen derecho (2.3 cm)
                const totalX = pageWidth - marginRight - 1; // Posición X del texto "Total:" con margen adicional
                const totalY = data.cell.y + data.cell.height + 10; // Posición Y del texto "Total:"

                doc.setFont("helvetica", "normal"); // Helvetica Roman
                doc.setFontSize(8);
                const totalText = "Total: " + total;
                const textWidth = doc.getTextWidth(totalText);

                // Dibujar el borde superior
                doc.setDrawColor(0, 142, 90); // Color del borde (#008e5a)
                doc.setLineWidth(0.5); // Ancho de la línea
                doc.line(totalX - textWidth, totalY - 4, totalX, totalY - 4); // Dibujar la línea

                // Dibujar el texto
                doc.text(totalText, totalX, totalY, { align: "right" });
            }
        }
    });

    doc.save("tablaHerramientasMano.pdf");
}

function ExportarPDFEquipoSeguirdad() {
    let total = document.getElementById("TotalSumaEquipo").innerHTML;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tableBody = document.getElementById("table-bodyEquipoSeguridad");
    const rows = tableBody.querySelectorAll("tr");

    const tableColumn = ["Descripción", "Ks", "Mano de obra", "Importe"];
    const tableRows = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.innerText);
        tableRows.push(rowData);
    });

    // Encabezado sin espacio entre renglones
    const addHeader = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const marginRight = 23; // Margen derecho (2.3 cm)
        const headerX = pageWidth - marginRight; // Posición X del encabezado
        const headerYStart = 25; // Posición Y del primer renglón (3 cm del margen superior)

        doc.setTextColor(0, 142, 90); // Verde CFE (#008e5a)

        // Línea 1
        doc.setFont("helvetica", "boldoblique"); // Helvetica Bold Condensed Oblique
        doc.setFontSize(12);
        const line1 = "División de distribución Jalisco";
        doc.text(line1, headerX, headerYStart, { align: "right" });

        // Línea 2
        doc.setFont("helvetica", "oblique"); // Helvetica Condensed Oblique
        doc.setFontSize(10);
        const line2 = "Zona " + datosProyecto.zona;
        doc.text(line2, headerX, headerYStart + 3.6, { align: "right" }); // Solo 3.6 mm debajo del anterior

        // Línea 3
        doc.setFontSize(9);
        const line3 = "Departamento de Planeación, Proyectos y Construcción";
        doc.text(line3, headerX, headerYStart + 7, { align: "right" }); // Solo 3.4 mm debajo del anterior
    };

    // Pie de página centrado
    const footerTextLine1 = "Rio Lerma 334, 1er Piso, Col. Cuauhtémoc C.P. 06589, Ciudad de México";
    const footerTextLine2 = "Tel. 52 29 44 00 ext. 92104";

    const addFooter = (doc) => {
        const pageHeight = doc.internal.pageSize.height; // Altura de la página
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const footerY = pageHeight - 15; // 1.5 cm desde la parte inferior (15 mm)

        doc.setFont("helvetica", "oblique"); // Fuente Helvetica Condensed Oblique
        doc.setTextColor(0, 0, 0, 0.8); // Color negro al 80%
        doc.setFontSize(10); // Tamaño de fuente

        const textWidthLine1 = doc.getTextWidth(footerTextLine1); // Ancho del primer renglón
        const textWidthLine2 = doc.getTextWidth(footerTextLine2); // Ancho del segundo renglón

        // Centrar los dos renglones
        doc.text(footerTextLine1, (pageWidth - textWidthLine1) / 2, footerY - 5); // Primer renglón
        doc.text(footerTextLine2, (pageWidth - textWidthLine2) / 2, footerY + 0); // Segundo renglón
    };

    // Agregar título de la tabla
    const addTitle = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const marginRight = 23; // Margen derecho (2.3 cm)
        const titleX = pageWidth - marginRight; // Posición X del título
        const titleY = 45; // Posición Y del título (4.5 cm del margen superior)

        doc.setFont("helvetica", "normal"); // Helvetica Roman
        doc.setFontSize(10);
        const title = "Equipo y seguridad";
        doc.text(title, titleX, titleY, { align: "right" });
    };

    // Agregar imagen
    const addImage = (doc) => {
        const imageUrl = '/paginacfe/app/img/LogoPdf.PNG'; // Reemplaza con la URL o base64 de tu imagen
        const marginLeft = 15; // Margen izquierdo (1.5 cm)
        const marginTop = 15; // Margen superior (1.5 cm)
        const imageWidth = 45; // Ancho de la imagen (ajusta según sea necesario)
        const imageHeight = 15; // Altura de la imagen (ajusta según sea necesario)

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    };

    // Generar la tabla y configurar estilos
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        margin: { top: 50, right: 23, bottom: 40, left: 23 }, // Margen en milímetros (5 cm en Y, 2.3 cm en X)
        headStyles: {
            fillColor: "#008e5a", // Color de fondo del encabezado
            textColor: "#FFFFFF", // Color del texto en el encabezado
            fontStyle: "bold",   // Texto en negrita
        },
        bodyStyles: {
            font: "helvetica", // Fuente Helvetica Roman
            fontStyle: "normal", // Estilo de fuente normal
            fontSize: 8, // Tamaño de letra 8
        },
        columnStyles: {
            0: { halign: 'left' }, // Centrar contenido de la columna "ID"
            1: { halign: 'left' }, // Justificar contenido de la columna "Nombre"
            2: { halign: 'right' }, // Centrar contenido de la columna "Unidad"
            3: { halign: 'right' } // Alinear a la derecha contenido de la columna "Importe"
        },
        didDrawPage: () => {
            addImage(doc); // Agregar imagen
            addHeader(doc); // Agregar encabezado
            addTitle(doc); // Agregar título
            addFooter(doc); // Agregar pie de página
        },
        didDrawCell: (data) => {
            if (data.section === 'body' && data.row.index === tableRows.length - 1) {
                const pageWidth = doc.internal.pageSize.width; // Ancho de la página
                const marginRight = 23; // Margen derecho (2.3 cm)
                const totalX = pageWidth - marginRight - 1; // Posición X del texto "Total:" con margen adicional
                const totalY = data.cell.y + data.cell.height + 10; // Posición Y del texto "Total:"

                doc.setFont("helvetica", "normal"); // Helvetica Roman
                doc.setFontSize(8);
                const totalText = "Total: " + total;
                const textWidth = doc.getTextWidth(totalText);

                // Dibujar el borde superior
                doc.setDrawColor(0, 142, 90); // Color del borde (#008e5a)
                doc.setLineWidth(0.5); // Ancho de la línea
                doc.line(totalX - textWidth, totalY - 4, totalX, totalY - 4); // Dibujar la línea

                // Dibujar el texto
                doc.text(totalText, totalX, totalY, { align: "right" });
            }
        }
    });

    doc.save("tablaEquipoSeguridad.pdf");
}
function ExportarPDFMaquinarias() {
    let total = document.getElementById("TotalSumaMaquinaria").innerHTML;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tableBody = document.getElementById("table-bodyMaquinaria");
    const rows = tableBody.querySelectorAll("tr");

    const tableColumn = ["ID", "Descripción", "Unidad", "PhM", "RhM", "Importe"];
    const tableRows = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.innerText);
        tableRows.push(rowData);
    });

    // Encabezado sin espacio entre renglones
    const addHeader = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const marginRight = 15; // Margen derecho (2.3 cm)
        const headerX = pageWidth - marginRight; // Posición X del encabezado
        const headerYStart = 25; // Posición Y del primer renglón (3 cm del margen superior)

        doc.setTextColor(0, 142, 90); // Verde CFE (#008e5a)

        // Línea 1
        doc.setFont("helvetica", "boldoblique"); // Helvetica Bold Condensed Oblique
        doc.setFontSize(12);
        const line1 = "División de distribución Jalisco";
        doc.text(line1, headerX, headerYStart, { align: "right" });

        // Línea 2
        doc.setFont("helvetica", "oblique"); // Helvetica Condensed Oblique
        doc.setFontSize(10);
        const line2 = "Zona " + datosProyecto.zona;
        doc.text(line2, headerX, headerYStart + 3.6, { align: "right" }); // Solo 3.6 mm debajo del anterior

        // Línea 3
        doc.setFontSize(9);
        const line3 = "Departamento de Planeación, Proyectos y Construcción";
        doc.text(line3, headerX, headerYStart + 7, { align: "right" }); // Solo 3.4 mm debajo del anterior
    };

    // Pie de página centrado
    const footerTextLine1 = "Rio Lerma 334, 1er Piso, Col. Cuauhtémoc C.P. 06589, Ciudad de México";
    const footerTextLine2 = "Tel. 52 29 44 00 ext. 92104";

    const addFooter = (doc) => {
        const pageHeight = doc.internal.pageSize.height; // Altura de la página
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const footerY = pageHeight - 15; // 1.5 cm desde la parte inferior (15 mm)

        doc.setFont("helvetica", "oblique"); // Fuente Helvetica Condensed Oblique
        doc.setTextColor(0, 0, 0, 0.8); // Color negro al 80%
        doc.setFontSize(10); // Tamaño de fuente

        const textWidthLine1 = doc.getTextWidth(footerTextLine1); // Ancho del primer renglón
        const textWidthLine2 = doc.getTextWidth(footerTextLine2); // Ancho del segundo renglón

        // Centrar los dos renglones
        doc.text(footerTextLine1, (pageWidth - textWidthLine1) / 2, footerY - 5); // Primer renglón
        doc.text(footerTextLine2, (pageWidth - textWidthLine2) / 2, footerY + 0); // Segundo renglón
    };

    // Agregar título de la tabla
    const addTitle = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const marginRight = 23; // Margen derecho (2.3 cm)
        const titleX = pageWidth - marginRight; // Posición X del título
        const titleY = 45; // Posición Y del título (4.5 cm del margen superior)

        doc.setFont("helvetica", "normal"); // Helvetica Roman
        doc.setFontSize(10);
        const title = "Maquinarias";
        doc.text(title, titleX, titleY, { align: "right" });
    };

    // Agregar imagen
    const addImage = (doc) => {
        const imageUrl = '/paginacfe/app/img/LogoPdf.PNG'; // Reemplaza con la URL o base64 de tu imagen
        const marginLeft = 15; // Margen izquierdo (1.5 cm)
        const marginTop = 15; // Margen superior (1.5 cm)
        const imageWidth = 45; // Ancho de la imagen (ajusta según sea necesario)
        const imageHeight = 15; // Altura de la imagen (ajusta según sea necesario)

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    };

    // Generar la tabla y configurar estilos
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        margin: { top: 50, right: 23, bottom: 40, left: 23 }, // Margen en milímetros (5 cm en Y, 2.3 cm en X)
        headStyles: {
            fillColor: "#008e5a", // Color de fondo del encabezado
            textColor: "#FFFFFF", // Color del texto en el encabezado
            fontStyle: "bold",   // Texto en negrita
        },
        bodyStyles: {
            font: "helvetica", // Fuente Helvetica Roman
            fontStyle: "normal", // Estilo de fuente normal
            fontSize: 8, // Tamaño de letra 8
        },
        columnStyles: {
            0: { halign: 'left' }, // Centrar contenido de la columna "ID"
            1: { halign: 'justify' }, // Justificar contenido de la columna "Nombre"
            2: { halign: 'left' }, // Centrar contenido de la columna "Unidad"
            3: { halign: 'right' }, // Centrar contenido de la columna "Unidad"
            4: { halign: 'left' }, // Centrar contenido de la columna "Unidad"
            5: { halign: 'right' } // Alinear a la derecha contenido de la columna "Importe"
        },
        didDrawPage: () => {
            addImage(doc); // Agregar imagen
            addHeader(doc); // Agregar encabezado
            addTitle(doc); // Agregar título
            addFooter(doc); // Agregar pie de página
        },
        didDrawCell: (data) => {
            if (data.section === 'body' && data.row.index === tableRows.length - 1) {
                const pageWidth = doc.internal.pageSize.width; // Ancho de la página
                const marginRight = 23; // Margen derecho (2.3 cm)
                const totalX = pageWidth - marginRight - 1; // Posición X del texto "Total:" con margen adicional
                const totalY = data.cell.y + data.cell.height + 10; // Posición Y del texto "Total:"

                doc.setFont("helvetica", "normal"); // Helvetica Roman
                doc.setFontSize(8);
                const totalText = "Total: " + total;
                const textWidth = doc.getTextWidth(totalText);

                // Dibujar el borde superior
                doc.setDrawColor(0, 142, 90); // Color del borde (#008e5a)
                doc.setLineWidth(0.5); // Ancho de la línea
                doc.line(totalX - textWidth, totalY - 4, totalX, totalY - 4); // Dibujar la línea

                // Dibujar el texto
                doc.text(totalText, totalX, totalY, { align: "right" });
            }
        }
    });

    doc.save("tablaMaquinarias.pdf");
}
function ExportarPDFConceptos() {
    let total = document.getElementById("TotalSumaImporteConceptos").innerHTML;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tableBody = document.getElementById("table-bodyConceptos");
    const rows = tableBody.querySelectorAll("tr");

    const tableColumn = ["ID", "Nombre", "Unidad", "Cantidad", "Precio U", "Importe"];
    const tableRows = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.innerText);
        tableRows.push(rowData);
    });

    // Encabezado sin espacio entre renglones
    const addHeader = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const marginRight = 23; // Margen derecho (2.3 cm)
        const headerX = pageWidth - marginRight; // Posición X del encabezado
        const headerYStart = 25; // Posición Y del primer renglón (3 cm del margen superior)

        doc.setTextColor(0, 142, 90); // Verde CFE (#008e5a)

        // Línea 1
        doc.setFont("helvetica", "boldoblique"); // Helvetica Bold Condensed Oblique
        doc.setFontSize(12);
        const line1 = "División de distribución Jalisco";
        doc.text(line1, headerX, headerYStart, { align: "right" });

        // Línea 2
        doc.setFont("helvetica", "oblique"); // Helvetica Condensed Oblique
        doc.setFontSize(10);
        const line2 = "Zona " + datosProyecto.zona;
        doc.text(line2, headerX, headerYStart + 3.6, { align: "right" }); // Solo 3.6 mm debajo del anterior

        // Línea 3
        doc.setFontSize(9);
        const line3 = "Departamento de Planeación, Proyectos y Construcción";
        doc.text(line3, headerX, headerYStart + 7, { align: "right" }); // Solo 3.4 mm debajo del anterior
    };

    // Pie de página centrado
    const footerTextLine1 = "Rio Lerma 334, 1er Piso, Col. Cuauhtémoc C.P. 06589, Ciudad de México";
    const footerTextLine2 = "Tel. 52 29 44 00 ext. 92104";

    const addFooter = (doc) => {
        const pageHeight = doc.internal.pageSize.height; // Altura de la página
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const footerY = pageHeight - 15; // 1.5 cm desde la parte inferior (15 mm)

        doc.setFont("helvetica", "oblique"); // Fuente Helvetica Condensed Oblique
        doc.setTextColor(0, 0, 0, 0.8); // Color negro al 80%
        doc.setFontSize(10); // Tamaño de fuente

        const textWidthLine1 = doc.getTextWidth(footerTextLine1); // Ancho del primer renglón
        const textWidthLine2 = doc.getTextWidth(footerTextLine2); // Ancho del segundo renglón

        // Centrar los dos renglones
        doc.text(footerTextLine1, (pageWidth - textWidthLine1) / 2, footerY - 5); // Primer renglón
        doc.text(footerTextLine2, (pageWidth - textWidthLine2) / 2, footerY + 0); // Segundo renglón
    };

    // Agregar título de la tabla
    const addTitle = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const marginRight = 23; // Margen derecho (2.3 cm)
        const titleX = pageWidth - marginRight; // Posición X del título
        const titleY = 45; // Posición Y del título (4.5 cm del margen superior)

        doc.setFont("helvetica", "normal"); // Helvetica Roman
        doc.setFontSize(10);
        const title = "Conceptos";
        doc.text(title, titleX, titleY, { align: "right" });
    };

    // Agregar imagen
    const addImage = (doc) => {
        const imageUrl = '/paginacfe/app/img/LogoPdf.PNG'; // Reemplaza con la URL o base64 de tu imagen
        const marginLeft = 15; // Margen izquierdo (1.5 cm)
        const marginTop = 15; // Margen superior (1.5 cm)
        const imageWidth = 45; // Ancho de la imagen (ajusta según sea necesario)
        const imageHeight = 15; // Altura de la imagen (ajusta según sea necesario)

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    };

    // Generar la tabla y configurar estilos
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        margin: { top: 50, right: 23, bottom: 40, left: 23 }, // Margen en milímetros (5 cm en Y, 2.3 cm en X)
        headStyles: {
            fillColor: "#008e5a", // Color de fondo del encabezado
            textColor: "#FFFFFF", // Color del texto en el encabezado
            fontStyle: "bold",   // Texto en negrita
        },
        bodyStyles: {
            font: "helvetica", // Fuente Helvetica Roman
            fontStyle: "normal", // Estilo de fuente normal
            fontSize: 8, // Tamaño de letra 8
        },
        columnStyles: {
            0: { halign: 'left' }, // Centrar contenido de la columna "ID"
            1: { halign: 'justify' }, // Justificar contenido de la columna "Nombre"
            2: { halign: 'left' }, // Centrar contenido de la columna "Unidad"
            3: { halign: 'left' }, // Centrar contenido de la columna "Cantidad"
            4: { halign: 'right' }, // Centrar contenido de la columna "Precio U"
            5: { halign: 'right' } // Alinear a la derecha contenido de la columna "Importe"
        },
        didDrawPage: () => {
            addImage(doc); // Agregar imagen
            addHeader(doc); // Agregar encabezado
            addTitle(doc); // Agregar título
            addFooter(doc); // Agregar pie de página
        },
        didDrawCell: (data) => {
            if (data.section === 'body' && data.row.index === tableRows.length - 1) {
                const pageWidth = doc.internal.pageSize.width; // Ancho de la página
                const marginRight = 23; // Margen derecho (2.3 cm)
                const totalX = pageWidth - marginRight - 1; // Posición X del texto "Total:" con margen adicional
                const totalY = data.cell.y + data.cell.height + 10; // Posición Y del texto "Total:"

                doc.setFont("helvetica", "normal"); // Helvetica Roman
                doc.setFontSize(8);
                const totalText = "Total: " + total;
                const textWidth = doc.getTextWidth(totalText);

                // Dibujar el borde superior
                doc.setDrawColor(0, 142, 90); // Color del borde (#008e5a)
                doc.setLineWidth(0.5); // Ancho de la línea
                doc.line(totalX - textWidth, totalY - 4, totalX, totalY - 4); // Dibujar la línea

                // Dibujar el texto
                doc.text(totalText, totalX, totalY, { align: "right" });
            }
        }
    });

    doc.save("tablaConceptos.pdf");
}