let totalManoObraTarjeta;
function llenarCamposPaginaTerminado() {
    let btnICMNav = document.querySelector('#btnICMNav');
    btnICMNav.style.display = 'block';
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
    ObtenerZonas();
}
function PorsentajesZona(zonis) {
    zonis.forEach((zona) => {
        console.log(zona.idzona, datosProyecto.idZona)
        if (zona.idzona == datosProyecto.idZona) {
            costosAdicionales.CIndirecto = zona.indirecto;
            costosAdicionales.Financiamiento = zona.financiamiento;
            costosAdicionales.utilidad = zona.utilidad;
            costosAdicionales.CAdicionales = zona.adicionales;
            GeneradorTablaConceptoPDF();
            return
        }
    })

}

function mostrarTablaTerminado(tablaId, boton) {
    const tabla = document.getElementById(tablaId);
    const isVisible = tabla.style.display === 'block';
    if (tablaId == "tablaTarjetasProyecto" && !isVisible) {
        let btns = document.getElementById("mostrarBtnPdf");
        btns.style.display = 'flex';
    } else {
        let btns = document.getElementById("mostrarBtnPdf");
        btns.style.display = 'none';
    }
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

function precionadoBtnExportarPdf() {
    let btn = document.getElementById("btnExportarPDF");;
    btn.setAttribute("disabled", "disabled");
    btn.classList.add("btnClickeadoExportar");
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

    // Encabezado
    const addHeader = (doc) => {
        const pageWidth = doc.internal.pageSize.width;
        const marginRight = 15;
        const headerX = pageWidth - marginRight;
        const headerYStart = 25;

        doc.setTextColor(0, 142, 90);
        doc.setFont("helvetica", "boldoblique");
        doc.setFontSize(12);
        const line1 = "División de Distribución Jalisco";
        doc.text(line1, headerX, headerYStart, { align: "right" });

        doc.setFont("helvetica", "oblique");
        doc.setFontSize(10);
        const line2 = "Zona " + datosProyecto.zona;
        doc.text(line2, headerX, headerYStart + 3.6, { align: "right" });

        doc.setFontSize(9);
        const line3 = "Departamento de Planeación, Proyectos y Construcción";
        doc.text(line3, headerX, headerYStart + 7, { align: "right" });
    };


    // Agregar título de la tabla
    const addTitle = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const titleX = pageWidth / 2; // Posición centrada en el ancho
        const titleY = 45; // Posición Y del título

        doc.setFont("helvetica", "normal"); // Fuente Helvetica Roman
        doc.setFontSize(10); // Tamaño de la fuente
        const title = "Materiales suministrados por CFE";
        doc.text(title, titleX, titleY, { align: "center" }); // Alinear al centro
    };

    // Agregar imagen
    const addImage = (doc) => {
        const imageUrl = '/paginacfe/app/img/LogoPdf.PNG';
        const marginLeft = 15;
        const marginTop = 15;
        const imageWidth = 45;
        const imageHeight = 15;

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    };

    // Generar la tabla con pie de página dinámico
    let pageNumber = 0;
    // Pie de página dinámico
    const addFooter = (doc, pageNumber) => {
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const footerY = pageHeight - 15;

        doc.setFont("helvetica", "oblique");
        doc.setTextColor(0, 0, 0, 0.8);
        doc.setFontSize(10);

        const footerText = `Página ${pageNumber}`;
        const textWidth = doc.getTextWidth(footerText);

        doc.text(footerText, (pageWidth - textWidth) / 2, footerY);
    };

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        margin: { top: 50, right: 23, bottom: 40, left: 23 },
        headStyles: {
            fillColor: "#008e5a",
            textColor: "#FFFFFF",
            fontStyle: "bold",
        },
        bodyStyles: {
            font: "helvetica",
            fontStyle: "normal",
            fontSize: 8,
        },
        columnStyles: {
            0: { halign: 'right' },
            1: { halign: 'justify' },
            2: { halign: 'left' },
            3: { halign: 'right' },
            4: { halign: 'left' },
            5: { halign: 'right' }
        },

        didDrawPage: (data) => {
            pageNumber += 1; // Incrementar el número de página
            addImage(doc);
            addHeader(doc);
            addTitle(doc);
            addFooter(doc, pageNumber); // Pasar el número de página al pie
        },
        didDrawCell: (data) => {
            if (data.section === 'body' && data.row.index === tableRows.length - 1) {
                const pageWidth = doc.internal.pageSize.width;
                const marginRight = 23;
                const totalX = pageWidth - marginRight - 1;
                const totalY = data.cell.y + data.cell.height + 10;

                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                const totalText = "Total: " + total;
                const textWidth = doc.getTextWidth(totalText);

                doc.setDrawColor(0, 142, 90);
                doc.setLineWidth(0.5);
                doc.line(totalX - textWidth, totalY - 4, totalX, totalY - 4);

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

    // Encabezado
    const addHeader = (doc) => {
        const pageWidth = doc.internal.pageSize.width;
        const marginRight = 15;
        const headerX = pageWidth - marginRight;
        const headerYStart = 25;

        doc.setTextColor(0, 142, 90);
        doc.setFont("helvetica", "boldoblique");
        doc.setFontSize(12);
        const line1 = "División de Distribución Jalisco";
        doc.text(line1, headerX, headerYStart, { align: "right" });

        doc.setFont("helvetica", "oblique");
        doc.setFontSize(10);
        const line2 = "Zona " + datosProyecto.zona;
        doc.text(line2, headerX, headerYStart + 3.6, { align: "right" });

        doc.setFontSize(9);
        const line3 = "Departamento de Planeación, Proyectos y Construcción";
        doc.text(line3, headerX, headerYStart + 7, { align: "right" });
    };

    // Agregar título
    const addTitle = (doc) => {
        const pageWidth = doc.internal.pageSize.width;
        const titleX = pageWidth / 2;
        const titleY = 45;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const title = "Materiales no suministrados por CFE";
        doc.text(title, titleX, titleY, { align: "center" });
    };

    // Agregar imagen
    const addImage = (doc) => {
        const imageUrl = '/paginacfe/app/img/LogoPdf.PNG';
        const marginLeft = 15;
        const marginTop = 15;
        const imageWidth = 45;
        const imageHeight = 15;

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    };

    // Pie de página dinámico
    let pageNumber = 0;
    const addFooter = (doc, pageNumber) => {
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const footerY = pageHeight - 15;

        doc.setFont("helvetica", "oblique");
        doc.setTextColor(0, 0, 0, 0.8);
        doc.setFontSize(10);

        const footerText = `Página ${pageNumber}`;
        const textWidth = doc.getTextWidth(footerText);

        doc.text(footerText, (pageWidth - textWidth) / 2, footerY);
    };

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        margin: { top: 50, right: 23, bottom: 40, left: 23 },
        headStyles: {
            fillColor: "#008e5a",
            textColor: "#FFFFFF",
            fontStyle: "bold",
        },
        bodyStyles: {
            font: "helvetica",
            fontStyle: "normal",
            fontSize: 8,
        },
        columnStyles: {
            0: { halign: 'right' },
            1: { halign: 'justify' },
            2: { halign: 'left' },
            3: { halign: 'right' },
            4: { halign: 'left' },
            5: { halign: 'right' }
        },

        didDrawPage: (data) => {
            pageNumber += 1;
            addImage(doc);
            addHeader(doc);
            addTitle(doc);
            addFooter(doc, pageNumber);
        },
        didDrawCell: (data) => {
            if (data.section === 'body' && data.row.index === tableRows.length - 1) {
                const pageWidth = doc.internal.pageSize.width;
                const marginRight = 23;
                const totalX = pageWidth - marginRight - 1;
                const totalY = data.cell.y + data.cell.height + 10;

                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                const totalText = "Total: " + total;
                const textWidth = doc.getTextWidth(totalText);

                doc.setDrawColor(0, 142, 90);
                doc.setLineWidth(0.5);
                doc.line(totalX - textWidth, totalY - 4, totalX, totalY - 4);

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
        const marginRight = 15; // Margen derecho (2.3 cm)
        const headerX = pageWidth - marginRight; // Posición X del encabezado
        const headerYStart = 25; // Posición Y del primer renglón (3 cm del margen superior)

        doc.setTextColor(0, 142, 90); // Verde CFE (#008e5a)

        // Línea 1
        doc.setFont("helvetica", "boldoblique"); // Helvetica Bold Condensed Oblique
        doc.setFontSize(12);
        const line1 = "División de Distribución Jalisco";
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

    const addFooter = (doc, pageNumber) => {
        const pageHeight = doc.internal.pageSize.height; // Altura de la página
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const footerY = pageHeight - 10; // Posición Y del pie de página (1 cm desde la parte inferior)

        doc.setFont("helvetica", "normal"); // Fuente Helvetica Roman
        doc.setFontSize(10); // Tamaño de fuente
        doc.setTextColor(0, 0, 0); // Color negro

        const pageText = `Página ${pageNumber}`; // Texto del número de página
        const textWidth = doc.getTextWidth(pageText); // Ancho del texto

        // Centrar el texto en el pie de página
        doc.text(pageText, (pageWidth - textWidth) / 2, footerY);
    };

    const addTitle = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const titleX = pageWidth / 2; // Posición centrada en el ancho
        const titleY = 45; // Posición Y del título

        doc.setFont("helvetica", "normal"); // Fuente Helvetica Roman
        doc.setFontSize(10); // Tamaño de la fuente
        const title = "Mano de obra";
        doc.text(title, titleX, titleY, { align: "center" }); // Alinear al centro
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
        didDrawPage: (data) => {
            addImage(doc); // Agregar imagen
            addHeader(doc); // Agregar encabezado
            addTitle(doc); // Agregar título
            const pageNumber = doc.internal.getNumberOfPages(); // Número de página actual
            addFooter(doc, pageNumber); // Agregar el pie de página numerado
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
        const marginRight = 15; // Margen derecho (2.3 cm)
        const headerX = pageWidth - marginRight; // Posición X del encabezado
        const headerYStart = 25; // Posición Y del primer renglón (3 cm del margen superior)

        doc.setTextColor(0, 142, 90); // Verde CFE (#008e5a)

        // Línea 1
        doc.setFont("helvetica", "boldoblique"); // Helvetica Bold Condensed Oblique
        doc.setFontSize(12);
        const line1 = "División de Distribución Jalisco";
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

    const addFooter = (doc, pageNumber) => {
        const pageHeight = doc.internal.pageSize.height; // Altura de la página
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const footerY = pageHeight - 10; // Posición Y del pie de página (1 cm desde la parte inferior)

        doc.setFont("helvetica", "normal"); // Fuente Helvetica Roman
        doc.setFontSize(10); // Tamaño de fuente
        doc.setTextColor(0, 0, 0); // Color negro

        const pageText = `Página ${pageNumber}`; // Texto del número de página
        const textWidth = doc.getTextWidth(pageText); // Ancho del texto

        // Centrar el texto en el pie de página
        doc.text(pageText, (pageWidth - textWidth) / 2, footerY);
    };

    // Agregar título de la tabla

    const addTitle = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const titleX = pageWidth / 2; // Posición centrada en el ancho
        const titleY = 45; // Posición Y del título

        doc.setFont("helvetica", "normal"); // Fuente Helvetica Roman
        doc.setFontSize(10); // Tamaño de la fuente
        const title = "Herramientas de mano de obra";
        doc.text(title, titleX, titleY, { align: "center" }); // Alinear al centro
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
        didDrawPage: (data) => {
            addImage(doc); // Agregar imagen
            addHeader(doc); // Agregar encabezado
            addTitle(doc); // Agregar título
            const pageNumber = doc.internal.getNumberOfPages(); // Número de página actual
            addFooter(doc, pageNumber); // Agregar el pie de página numerado
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
        const marginRight = 15; // Margen derecho (2.3 cm)
        const headerX = pageWidth - marginRight; // Posición X del encabezado
        const headerYStart = 25; // Posición Y del primer renglón (3 cm del margen superior)

        doc.setTextColor(0, 142, 90); // Verde CFE (#008e5a)

        // Línea 1
        doc.setFont("helvetica", "boldoblique"); // Helvetica Bold Condensed Oblique
        doc.setFontSize(12);
        const line1 = "División de Distribución Jalisco";
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

    const addFooter = (doc, pageNumber) => {
        const pageHeight = doc.internal.pageSize.height; // Altura de la página
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const footerY = pageHeight - 10; // Posición Y del pie de página (1 cm desde la parte inferior)

        doc.setFont("helvetica", "normal"); // Fuente Helvetica Roman
        doc.setFontSize(10); // Tamaño de fuente
        doc.setTextColor(0, 0, 0); // Color negro

        const pageText = `Página ${pageNumber}`; // Texto del número de página
        const textWidth = doc.getTextWidth(pageText); // Ancho del texto

        // Centrar el texto en el pie de página
        doc.text(pageText, (pageWidth - textWidth) / 2, footerY);
    };

    // Agregar título de la tabla
    const addTitle = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const titleX = pageWidth / 2; // Posición centrada en el ancho
        const titleY = 45; // Posición Y del título

        doc.setFont("helvetica", "normal"); // Fuente Helvetica Roman
        doc.setFontSize(10); // Tamaño de la fuente
        const title = "Equipo y seguridad";
        doc.text(title, titleX, titleY, { align: "center" }); // Alinear al centro
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
        didDrawPage: (data) => {
            addImage(doc); // Agregar imagen
            addHeader(doc); // Agregar encabezado
            addTitle(doc); // Agregar título
            const pageNumber = doc.internal.getNumberOfPages(); // Número de página actual
            addFooter(doc, pageNumber); // Agregar el pie de página numerado
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
        const line1 = "División de Distribución Jalisco";
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

    const addFooter = (doc, pageNumber) => {
        const pageHeight = doc.internal.pageSize.height; // Altura de la página
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const footerY = pageHeight - 10; // Posición Y del pie de página (1 cm desde la parte inferior)

        doc.setFont("helvetica", "normal"); // Fuente Helvetica Roman
        doc.setFontSize(10); // Tamaño de fuente
        doc.setTextColor(0, 0, 0); // Color negro

        const pageText = `Página ${pageNumber}`; // Texto del número de página
        const textWidth = doc.getTextWidth(pageText); // Ancho del texto

        // Centrar el texto en el pie de página
        doc.text(pageText, (pageWidth - textWidth) / 2, footerY);
    };

    // Agregar título de la tabla

    const addTitle = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const titleX = pageWidth / 2; // Posición centrada en el ancho
        const titleY = 45; // Posición Y del título

        doc.setFont("helvetica", "normal"); // Fuente Helvetica Roman
        doc.setFontSize(10); // Tamaño de la fuente
        const title = "Maquinarias";
        doc.text(title, titleX, titleY, { align: "center" }); // Alinear al centro
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
        didDrawPage: (data) => {
            addImage(doc); // Agregar imagen
            addHeader(doc); // Agregar encabezado
            addTitle(doc); // Agregar título
            const pageNumber = doc.internal.getNumberOfPages(); // Número de página actual
            addFooter(doc, pageNumber); // Agregar el pie de página numerado
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
        const marginRight = 15; // Margen derecho (2.3 cm)
        const headerX = pageWidth - marginRight; // Posición X del encabezado
        const headerYStart = 25; // Posición Y del primer renglón (3 cm del margen superior)

        doc.setTextColor(0, 142, 90); // Verde CFE (#008e5a)

        // Línea 1
        doc.setFont("helvetica", "boldoblique"); // Helvetica Bold Condensed Oblique
        doc.setFontSize(12);
        const line1 = "División de Distribución Jalisco";
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

    const addFooter = (doc, pageNumber) => {
        const pageHeight = doc.internal.pageSize.height; // Altura de la página
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const footerY = pageHeight - 10; // Posición Y del pie de página (1 cm desde la parte inferior)

        doc.setFont("helvetica", "normal"); // Fuente Helvetica Roman
        doc.setFontSize(10); // Tamaño de fuente
        doc.setTextColor(0, 0, 0); // Color negro

        const pageText = `Página ${pageNumber}`; // Texto del número de página
        const textWidth = doc.getTextWidth(pageText); // Ancho del texto

        // Centrar el texto en el pie de página
        doc.text(pageText, (pageWidth - textWidth) / 2, footerY);
    };

    // Agregar título de la tabla

    const addTitle = (doc) => {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const titleX = pageWidth / 2; // Posición centrada en el ancho
        const titleY = 45; // Posición Y del título

        doc.setFont("helvetica", "normal"); // Fuente Helvetica Roman
        doc.setFontSize(10); // Tamaño de la fuente
        const title = "Conceptos";
        doc.text(title, titleX, titleY, { align: "center" }); // Alinear al centro
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
        didDrawPage: (data) => {
            addImage(doc); // Agregar imagen
            addHeader(doc); // Agregar encabezado
            addTitle(doc); // Agregar título
            const pageNumber = doc.internal.getNumberOfPages(); // Número de página actual
            addFooter(doc, pageNumber); // Agregar el pie de página numerado
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

async function exportarPDFConHtml(conc) {
    precionadoBtnExportarPdf();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'letter');
    const container = document.getElementById('contenedor-cfe');

    if (!container) {
        console.error('Contenedor "contenedor-cfe" no encontrado');
        return;
    }

    // Configurar el contenedor temporalmente visible
    container.style.display = 'block';
    container.style.position = 'absolute';
    container.style.left = '-9999px';

    const tarjetas = container.getElementsByClassName('tarjeta-concepto');
    const marginX = 2 * 28.35; // 2.3 cm en puntos
    const marginY = 4.5 * 28.35; // 4.5 cm en puntos
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - 2 * marginX;
    const contentHeight = pageHeight - 2 * marginY;

    for (let i = 0; i < tarjetas.length; i++) {
        const tarjeta = tarjetas[i];

        // Usar html2canvas para convertir el contenido HTML de cada tarjeta a una imagen
        await html2canvas(tarjeta).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = contentWidth;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let position = marginY;

            if (i > 0) {
                doc.addPage();
            }
            const pageNumber = doc.internal.getNumberOfPages();
            // Agregar encabezado, imagen, título y pie de página
            addHeader(doc, conc);
            addImage(doc);

            doc.addImage(imgData, 'PNG', marginX, position, imgWidth, imgHeight);
        });
    }

    // Restaurar los estilos originales del contenedor
    container.style.display = 'none';
    container.style.position = '';
    container.style.left = '';

    let btn = document.getElementById("btnExportarPDF");;
    btn.removeAttribute("disabled");
    btn.classList.remove("btnClickeadoExportar");
    // Obtener el número total de páginas
    const totalPages = doc.internal.getNumberOfPages();

    // Iterar por cada página y agregar el pie de página con "Página X de Y"
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i); // Cambiar a la página actual
        addFooter(doc, i, totalPages); // Pasar el total de páginas al pie de página
    }

    doc.save('proyecto.pdf');
}
// Encabezado sin espacio entre renglones
const addHeader = (doc, conc) => {
    const pageWidth = doc.internal.pageSize.width; // Ancho de la página
    const marginRight = 1.5 * 28.35; // Margen derecho (2.3 cm)
    const headerX = pageWidth - marginRight; // Posición X del encabezado
    const headerYStart = 50; // Posición Y del primer renglón (3 cm del margen superior)

    doc.setTextColor(0, 142, 90); // Verde CFE (#008e5a)

    // Línea 1
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const line1 = "División de Distribución Jalisco";
    doc.text(line1, headerX, headerYStart, { align: "right" });

    // Línea 2
    if (conc) {
        // Línea 3
        doc.setFontSize(9);
        const line3 = "Departamento de Planeación, Proyectos y Construcción";
        doc.text(line3, headerX, headerYStart + 10, { align: "right" }); // Solo 3.4 mm debajo del anterior
    } else {
        doc.setFontSize(10);
        const line2 = "Zona " + datosProyecto.zona;
        doc.text(line2, headerX, headerYStart + 10, { align: "right" }); // Solo 3.6 mm debajo del anterior

        // Línea 3
        doc.setFontSize(9);
        const line3 = "Departamento de Planeación, Proyectos y Construcción";
        doc.text(line3, headerX, headerYStart + 20, { align: "right" }); // Solo 3.4 mm debajo del anterior
    }

};

// Pie de página centrado
const addFooter = (doc, pageNumber, totalPages) => {
    const pageHeight = doc.internal.pageSize.height; // Altura de la página
    const pageWidth = doc.internal.pageSize.width; // Ancho de la página
    const footerY = pageHeight - 20; // Posición Y del pie de página (1 cm desde la parte inferior)

    doc.setFontSize(10); // Tamaño de fuente
    doc.setTextColor(0, 0, 0); // Color negro

    const pageText = `Página ${pageNumber} de ${totalPages}`; // Texto del número de página
    const textWidth = doc.getTextWidth(pageText); // Ancho del texto

    // Centrar el texto en el pie de página
    doc.text(pageText, (pageWidth - textWidth) / 2, footerY);
};

// Agregar título de la tabla


// Agregar imagen
const addImage = (doc) => {
    const imageUrl = '/paginacfe/app/img/LogoPdf.PNG'; // Reemplaza con la URL o base64 de tu imagen
    const marginLeft = 1.5 * 28.35; // Margen izquierdo (1.5 cm)
    const marginTop = 1.5 * 28.35; // Margen superior (1.5 cm)
    const imageWidth = 135; // Ancho de la imagen (ajusta según sea necesario)
    const imageHeight = 45; // Altura de la imagen (ajusta según sea necesario)

    doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
};



//***
// 
// 
// 
// Exportaciones a excel
// 
// 
//  */


async function ExportarExcelMaterialesSi() {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Materiales Suministrados");

    // Cargar la imagen como base64
    const imageUrl = "/paginacfe/app/img/LogoPdf.PNG"; // Asegúrate de que la ruta sea válida
    const imageBase64 = await fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        });

    const imageId = workbook.addImage({
        base64: imageBase64.split(",")[1], // Remover el encabezado `data:image/png;base64,`
        extension: "png",
    });

    worksheet.addImage(imageId, {
        tl: { col: 0.2, row: 0.2 }, // Posición superior izquierda
        ext: { width: 150, height: 50 }, // Tamaño de la imagen
    });

    // Agregar encabezado
    worksheet.mergeCells("B1:F1");
    const line1 = worksheet.getCell("B1");
    line1.value = "División de Distribución Jalisco";
    line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
    line1.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("B2:F2");
    const line2 = worksheet.getCell("B2");
    line2.value = "Zona " + datosProyecto.zona; // Asegúrate de que `datosProyecto.zona` esté definido
    line2.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
    line2.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("B3:F3");
    const line3 = worksheet.getCell("B3");
    line3.value = "Departamento de Planeación, Proyectos y Construcción";
    line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
    line3.alignment = { horizontal: "right", vertical: "middle" };

    // Agregar título
    worksheet.mergeCells("A5:F5");
    const titleCell = worksheet.getCell("A5");
    titleCell.value = "Materiales suministrados por CFE";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Agregar encabezados
    const headers = ["ID", "Descripción", "Unidad", "Precio U", "Cantidad", "Importe"];
    worksheet.addRow(headers).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008e5a" }, bgColor: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Obtener datos de la tabla
    const tableBody = document.getElementById("table-bodyMaterialesSuministrados");
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.innerText);

        // Agregar una fila al Excel
        const excelRow = worksheet.addRow(rowData);

        // Aplicar color alterno a las filas
        excelRow.eachCell((cell, colNumber) => {
            // Configuración de alineación según la columna
            switch (colNumber) {
                case 1: // ID
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 2: // Descripción
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 3: // Unidad
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                    break;
                case 4: // Precio U
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 5: // Cantidad
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 6: // Importe
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                default:
                    cell.alignment = { horizontal: "center", vertical: "middle" }; // Por defecto
            }

            // Aplicar colores alternos en las filas
            if (rowIndex % 2 === 0) {  // Filas pares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } }; // Gris claro
            } else {  // Filas impares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }; // Blanco
            }

            // Configurar bordes solo en los lados (izquierda y derecha)
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "none" },
                bottom: { style: "none" }
            };
        });
    });

    // Agregar total como última fila
    const total = document.getElementById("TotalSumaMaterialesSi").innerHTML;
    worksheet.addRow(["", "", "", "", "Total", total]).eachCell((cell, colNumber) => {
        if (colNumber == 6) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "right", vertical: "middle" };
        }
        if (colNumber == 5) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        }
    });

    // Ajustar el ancho de las columnas automáticamente
    worksheet.columns.forEach((column) => {
        const maxLength = column.values.reduce((max, curr) => (curr && curr.toString().length > max ? curr.toString().length : max), 10);
        column.width = maxLength - 20; // Ancho basado en el contenido
    });

    // Descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tablaMaterialesSuministrados.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function ExportarExcelMaterialesNo() {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Materiales No Suministrados");

    // Cargar la imagen como base64
    const imageUrl = "/paginacfe/app/img/LogoPdf.PNG"; // Asegúrate de que la ruta sea válida
    const imageBase64 = await fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        });

    const imageId = workbook.addImage({
        base64: imageBase64.split(",")[1], // Remover el encabezado `data:image/png;base64,`
        extension: "png",
    });

    worksheet.addImage(imageId, {
        tl: { col: 0.2, row: 0.2 }, // Posición superior izquierda
        ext: { width: 150, height: 50 }, // Tamaño de la imagen
    });

    // Agregar encabezado
    worksheet.mergeCells("B1:F1");
    const line1 = worksheet.getCell("B1");
    line1.value = "División de Distribución Jalisco";
    line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
    line1.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("B2:F2");
    const line2 = worksheet.getCell("B2");
    line2.value = "Zona " + datosProyecto.zona; // Asegúrate de que `datosProyecto.zona` esté definido
    line2.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
    line2.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("B3:F3");
    const line3 = worksheet.getCell("B3");
    line3.value = "Departamento de Planeación, Proyectos y Construcción";
    line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
    line3.alignment = { horizontal: "right", vertical: "middle" };

    // Agregar título
    worksheet.mergeCells("A5:F5");
    const titleCell = worksheet.getCell("A5");
    titleCell.value = "Materiales no suministrados por CFE";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Agregar encabezados
    const headers = ["ID", "Descripción", "Unidad", "Precio U", "Cantidad", "Importe"];
    worksheet.addRow(headers).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008e5a" }, bgColor: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Obtener datos de la tabla
    const tableBody = document.getElementById("table-bodyMaterialesNosuministrados");
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.innerText);

        // Agregar una fila al Excel
        const excelRow = worksheet.addRow(rowData);

        // Aplicar color alterno a las filas
        excelRow.eachCell((cell, colNumber) => {
            // Configuración de alineación según la columna
            switch (colNumber) {
                case 1: // ID
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 2: // Descripción
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 3: // Unidad
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                    break;
                case 4: // Precio U
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 5: // Cantidad
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 6: // Importe
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                default:
                    cell.alignment = { horizontal: "center", vertical: "middle" }; // Por defecto
            }

            // Aplicar colores alternos en las filas
            if (rowIndex % 2 === 0) {  // Filas pares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } }; // Gris claro
            } else {  // Filas impares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }; // Blanco
            }

            // Configurar bordes solo en los lados (izquierda y derecha)
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "none" },
                bottom: { style: "none" }
            };
        });
    });
    // Agregar total como última fila
    const total = document.getElementById("TotalSumaMaterialesNo").innerHTML;
    worksheet.addRow(["", "", "", "", "Total", total]).eachCell((cell, colNumber) => {
        if (colNumber == 6) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "right", vertical: "middle" };
        }
        if (colNumber == 5) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        }
    });

    // Ajustar el ancho de las columnas automáticamente
    worksheet.columns.forEach((column) => {
        const maxLength = column.values.reduce((max, curr) => (curr && curr.toString().length > max ? curr.toString().length : max), 10);
        column.width = maxLength - 20; // Ancho basado en el contenido
    });

    // Descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tablaMaterialesNoSuministrados.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


async function ExportarExcelManoObra() {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Mano de Obra");

    // Cargar la imagen como base64
    const imageUrl = "/paginacfe/app/img/LogoPdf.PNG"; // Asegúrate de que la ruta sea válida
    const imageBase64 = await fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        });

    const imageId = workbook.addImage({
        base64: imageBase64.split(",")[1], // Remover el encabezado `data:image/png;base64,`
        extension: "png",
    });

    worksheet.addImage(imageId, {
        tl: { col: 0.2, row: 0.2 }, // Posición superior izquierda
        ext: { width: 150, height: 50 }, // Tamaño de la imagen
    });

    // Agregar encabezado
    worksheet.mergeCells("B1:G1");
    const line1 = worksheet.getCell("B1");
    line1.value = "División de Distribución Jalisco";
    line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
    line1.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("B2:G2");
    const line2 = worksheet.getCell("B2");
    line2.value = "Zona " + datosProyecto.zona; // Asegúrate de que `datosProyecto.zona` esté definido
    line2.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
    line2.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("B3:G3");
    const line3 = worksheet.getCell("B3");
    line3.value = "Departamento de Planeación, Proyectos y Construcción";
    line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
    line3.alignment = { horizontal: "right", vertical: "middle" };

    // Agregar título
    worksheet.mergeCells("A5:G5");
    const titleCell = worksheet.getCell("A5");
    titleCell.value = "Mano de obra";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Agregar encabezados
    const headers = ["ID", "Categoría", "Unidad", "Salario", "Cantidad", "Sr", "Importe"];
    worksheet.addRow(headers).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008e5a" }, bgColor: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Obtener datos de la tabla
    const tableBody = document.getElementById("table-bodyManoObra");
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.innerText);

        // Agregar una fila al Excel
        const excelRow = worksheet.addRow(rowData);

        // Aplicar color alterno a las filas
        excelRow.eachCell((cell, colNumber) => {
            // Configuración de alineación según la columna
            switch (colNumber) {
                case 1: // ID
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 2: // Categoría
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 3: // Unidad
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                    break;
                case 4: // Salario
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 5: // Cantidad
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 6: // Sr
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 7: // Importe
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                default:
                    cell.alignment = { horizontal: "center", vertical: "middle" }; // Por defecto
            }

            // Aplicar colores alternos en las filas
            if (rowIndex % 2 === 0) {  // Filas pares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } }; // Gris claro
            } else {  // Filas impares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }; // Blanco
            }

            // Configurar bordes solo en los lados (izquierda y derecha)
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "none" },
                bottom: { style: "none" }
            };
        });
    });

    // Agregar total como última fila
    const total = document.getElementById("TotalSumaManoObra").innerHTML;
    worksheet.addRow(["", "", "", "", "", "Total", total]).eachCell((cell, colNumber) => {
        if (colNumber == 7) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "right", vertical: "middle" };
        }
        if (colNumber == 6) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        }
    });

    // Ajustar el ancho de las columnas manualmente
    worksheet.columns = [
        { key: 'ID', width: 13 },
        { key: 'Categoría', width: 40 },
        { key: 'Unidad', width: 13 },
        { key: 'Salario', width: 20 },
        { key: 'Cantidad', width: 13 },
        { key: 'Sr', width: 20 },
        { key: 'Importe', width: 25 }
    ];

    // Descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tablaManoObra.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


async function ExportarExcelHerramientasMano() {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Herramientas de Mano");

    // Cargar la imagen como base64
    const imageUrl = "/paginacfe/app/img/LogoPdf.PNG"; // Asegúrate de que la ruta sea válida
    const imageBase64 = await fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        });

    const imageId = workbook.addImage({
        base64: imageBase64.split(",")[1], // Remover el encabezado `data:image/png;base64,`
        extension: "png",
    });

    worksheet.addImage(imageId, {
        tl: { col: 0.2, row: 0.2 }, // Posición superior izquierda
        ext: { width: 150, height: 50 }, // Tamaño de la imagen
    });

    // Agregar encabezado
    worksheet.mergeCells("B1:D1");
    const line1 = worksheet.getCell("B1");
    line1.value = "División de Distribución Jalisco";
    line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
    line1.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("B2:D2");
    const line2 = worksheet.getCell("B2");
    line2.value = "Zona " + datosProyecto.zona; // Asegúrate de que `datosProyecto.zona` esté definido
    line2.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
    line2.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("B3:D3");
    const line3 = worksheet.getCell("B3");
    line3.value = "Departamento de Planeación, Proyectos y Construcción";
    line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
    line3.alignment = { horizontal: "right", vertical: "middle" };

    // Agregar título
    worksheet.mergeCells("A5:D5");
    const titleCell = worksheet.getCell("A5");
    titleCell.value = "Herramientas de mano de obra";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Agregar encabezados
    const headers = ["Descripción", "Kh", "Mano de obra", "Importe"];
    worksheet.addRow(headers).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008e5a" }, bgColor: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Obtener datos de la tabla
    const tableBody = document.getElementById("table-bodyHerramientas");
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.innerText);

        // Agregar una fila al Excel
        const excelRow = worksheet.addRow(rowData);

        // Aplicar color alterno a las filas
        excelRow.eachCell((cell, colNumber) => {
            // Configuración de alineación según la columna
            switch (colNumber) {
                case 1: // Descripción
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 2: // Kh
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 3: // Mano de obra
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 4: // Importe
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                default:
                    cell.alignment = { horizontal: "center", vertical: "middle" }; // Por defecto
            }

            // Aplicar colores alternos en las filas
            if (rowIndex % 2 === 0) {  // Filas pares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } }; // Gris claro
            } else {  // Filas impares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }; // Blanco
            }

            // Configurar bordes solo en los lados (izquierda y derecha)
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "none" },
                bottom: { style: "none" }
            };
        });
    });

    // Agregar total como última fila
    const total = document.getElementById("TotalSumaHerramientas").innerHTML;
    worksheet.addRow(["", "", "Total", total]).eachCell((cell, colNumber) => {
        if (colNumber == 4) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "right", vertical: "middle" };
        }
        if (colNumber == 3) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        }
    });

    // Ajustar el ancho de las columnas manualmente
    worksheet.columns = [
        { key: 'Descripción', width: 30 },
        { key: 'Kh', width: 13 },
        { key: 'Mano de obra', width: 20 },
        { key: 'Importe', width: 25 }
    ];

    // Descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tablaHerramientasMano.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


async function ExportarExcelEquipoSeguridad() {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Equipo y Seguridad");

    // Cargar la imagen como base64
    const imageUrl = "/paginacfe/app/img/LogoPdf.PNG"; // Asegúrate de que la ruta sea válida
    const imageBase64 = await fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        });

    const imageId = workbook.addImage({
        base64: imageBase64.split(",")[1], // Remover el encabezado `data:image/png;base64,`
        extension: "png",
    });

    worksheet.addImage(imageId, {
        tl: { col: 0.2, row: 0.2 }, // Posición superior izquierda
        ext: { width: 150, height: 50 }, // Tamaño de la imagen
    });

    // Agregar encabezado
    worksheet.mergeCells("B1:D1");
    const line1 = worksheet.getCell("B1");
    line1.value = "División de Distribución Jalisco";
    line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
    line1.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("B2:D2");
    const line2 = worksheet.getCell("B2");
    line2.value = "Zona " + datosProyecto.zona; // Asegúrate de que `datosProyecto.zona` esté definido
    line2.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
    line2.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("B3:D3");
    const line3 = worksheet.getCell("B3");
    line3.value = "Departamento de Planeación, Proyectos y Construcción";
    line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
    line3.alignment = { horizontal: "right", vertical: "middle" };

    // Agregar título
    worksheet.mergeCells("A5:D5");
    const titleCell = worksheet.getCell("A5");
    titleCell.value = "Equipo y seguridad";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Agregar encabezados
    const headers = ["Descripción", "Ks", "Mano de obra", "Importe"];
    worksheet.addRow(headers).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008e5a" }, bgColor: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Obtener datos de la tabla
    const tableBody = document.getElementById("table-bodyEquipoSeguridad");
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.innerText);

        // Agregar una fila al Excel
        const excelRow = worksheet.addRow(rowData);

        // Aplicar color alterno a las filas
        excelRow.eachCell((cell, colNumber) => {
            // Configuración de alineación según la columna
            switch (colNumber) {
                case 1: // Descripción
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 2: // Ks
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 3: // Mano de obra
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 4: // Importe
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                default:
                    cell.alignment = { horizontal: "center", vertical: "middle" }; // Por defecto
            }

            // Aplicar colores alternos en las filas
            if (rowIndex % 2 === 0) {  // Filas pares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } }; // Gris claro
            } else {  // Filas impares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }; // Blanco
            }

            // Configurar bordes solo en los lados (izquierda y derecha)
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "none" },
                bottom: { style: "none" }
            };
        });
    });

    // Agregar total como última fila
    const total = document.getElementById("TotalSumaEquipo").innerHTML;
    worksheet.addRow(["", "", "Total", total]).eachCell((cell, colNumber) => {
        if (colNumber == 4) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "right", vertical: "middle" };
        }
        if (colNumber == 3) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        }
    });

    // Ajustar el ancho de las columnas manualmente
    worksheet.columns = [
        { key: 'Descripción', width: 30 },
        { key: 'Ks', width: 13 },
        { key: 'Mano de obra', width: 20 },
        { key: 'Importe', width: 25 }
    ];

    // Descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tablaEquipoSeguridad.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function ExportarExcelMaquinarias() {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Maquinarias");

    // Cargar la imagen como base64
    const imageUrl = "/paginacfe/app/img/LogoPdf.PNG"; // Asegúrate de que la ruta sea válida
    const imageBase64 = await fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        });

    const imageId = workbook.addImage({
        base64: imageBase64.split(",")[1], // Remover el encabezado `data:image/png;base64,`
        extension: "png",
    });

    worksheet.addImage(imageId, {
        tl: { col: 0.2, row: 0.2 }, // Posición superior izquierda
        ext: { width: 150, height: 50 }, // Tamaño de la imagen
    });

    // Agregar encabezado
    worksheet.mergeCells("B1:F1");
    const line1 = worksheet.getCell("B1");
    line1.value = "División de Distribución Jalisco";
    line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
    line1.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("B2:F2");
    const line2 = worksheet.getCell("B2");
    line2.value = "Zona " + datosProyecto.zona; // Asegúrate de que `datosProyecto.zona` esté definido
    line2.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
    line2.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("B3:F3");
    const line3 = worksheet.getCell("B3");
    line3.value = "Departamento de Planeación, Proyectos y Construcción";
    line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
    line3.alignment = { horizontal: "right", vertical: "middle" };

    // Agregar título
    worksheet.mergeCells("A5:F5");
    const titleCell = worksheet.getCell("A5");
    titleCell.value = "Maquinarias";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Agregar encabezados
    const headers = ["ID", "Descripción", "Unidad", "PhM", "RhM", "Importe"];
    worksheet.addRow(headers).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008e5a" }, bgColor: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Obtener datos de la tabla
    const tableBody = document.getElementById("table-bodyMaquinaria");
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.innerText);

        // Agregar una fila al Excel
        const excelRow = worksheet.addRow(rowData);

        // Aplicar color alterno a las filas
        excelRow.eachCell((cell, colNumber) => {
            // Configuración de alineación según la columna
            switch (colNumber) {
                case 1: // ID
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 2: // Descripción
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 3: // Unidad
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                    break;
                case 4: // PhM
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 5: // RhM
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 6: // Importe
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                default:
                    cell.alignment = { horizontal: "center", vertical: "middle" }; // Por defecto
            }

            // Aplicar colores alternos en las filas
            if (rowIndex % 2 === 0) {  // Filas pares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } }; // Gris claro
            } else {  // Filas impares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }; // Blanco
            }

            // Configurar bordes solo en los lados (izquierda y derecha)
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "none" },
                bottom: { style: "none" }
            };
        });
    });

    // Agregar total como última fila
    const total = document.getElementById("TotalSumaMaquinaria").innerHTML;
    worksheet.addRow(["", "", "", "", "Total", total]).eachCell((cell, colNumber) => {
        if (colNumber == 6) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "right", vertical: "middle" };
        }
        if (colNumber == 5) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        }
    });

    // Ajustar el ancho de las columnas manualmente
    worksheet.columns = [
        { key: 'ID', width: 13 },
        { key: 'Descripción', width: 40 },
        { key: 'Unidad', width: 13 },
        { key: 'PhM', width: 20 },
        { key: 'RhM', width: 20 },
        { key: 'Importe', width: 25 }
    ];

    // Descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tablaMaquinarias.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function ExportarExcelConceptosProyecto() {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Conceptos");

    // Cargar la imagen como base64
    const imageUrl = "/paginacfe/app/img/LogoPdf.PNG"; // Asegúrate de que la ruta sea válida
    const imageBase64 = await fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        });

    const imageId = workbook.addImage({
        base64: imageBase64.split(",")[1], // Remover el encabezado `data:image/png;base64,`
        extension: "png",
    });

    worksheet.addImage(imageId, {
        tl: { col: 0.2, row: 0.2 }, // Posición superior izquierda
        ext: { width: 150, height: 50 }, // Tamaño de la imagen
    });

    // Agregar encabezado
    worksheet.mergeCells("B1:F1");
    const line1 = worksheet.getCell("B1");
    line1.value = "División de Distribución Jalisco";
    line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
    line1.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("B2:F2");
    const line2 = worksheet.getCell("B2");
    line2.value = "Zona " + datosProyecto.zona; // Asegúrate de que `datosProyecto.zona` esté definido
    line2.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
    line2.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("B3:F3");
    const line3 = worksheet.getCell("B3");
    line3.value = "Departamento de Planeación, Proyectos y Construcción";
    line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
    line3.alignment = { horizontal: "right", vertical: "middle" };

    // Agregar título
    worksheet.mergeCells("A5:F5");
    const titleCell = worksheet.getCell("A5");
    titleCell.value = "Conceptos";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Agregar encabezados
    const headers = ["ID", "Nombre", "Unidad", "Cantidad", "Precio U", "Importe"];
    worksheet.addRow(headers).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008e5a" }, bgColor: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Obtener datos de la tabla
    const tableBody = document.getElementById("table-bodyConceptos");
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.innerText);

        // Agregar una fila al Excel
        const excelRow = worksheet.addRow(rowData);

        // Aplicar color alterno a las filas
        excelRow.eachCell((cell, colNumber) => {
            // Configuración de alineación según la columna
            switch (colNumber) {
                case 1: // ID
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 2: // Nombre
                    cell.alignment = { horizontal: "justify", vertical: "middle" };
                    break;
                case 3: // Unidad
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                    break;
                case 4: // Cantidad
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 5: // Precio U
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 6: // Importe
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                default:
                    cell.alignment = { horizontal: "center", vertical: "middle" }; // Por defecto
            }

            // Aplicar colores alternos en las filas
            if (rowIndex % 2 === 0) {  // Filas pares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } }; // Gris claro
            } else {  // Filas impares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }; // Blanco
            }

            // Configurar bordes solo en los lados (izquierda y derecha)
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "none" },
                bottom: { style: "none" }
            };
        });
    });

    // Agregar total como última fila
    const total = document.getElementById("TotalSumaImporteConceptos").innerHTML;
    worksheet.addRow(["", "", "", "", "Total", total]).eachCell((cell, colNumber) => {
        if (colNumber == 6) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "right", vertical: "middle" };
        }
        if (colNumber == 5) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        }
    });

    // Ajustar el ancho de las columnas manualmente
    worksheet.columns = [
        { key: 'ID', width: 13 },
        { key: 'Nombre', width: 90 },
        { key: 'Unidad', width: 13 },
        { key: 'Cantidad', width: 15 },
        { key: 'Precio U', width: 20 },
        { key: 'Importe', width: 25 }
    ];

    // Descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tablaConceptos.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}



async function ExportarExcelTarjetas(pantalla) {
    // Crear un nuevo libro de trabajo
    const container = document.getElementById('contenedor-cfe');
    const workbook = new ExcelJS.Workbook();
    let conceptos
    if (pantalla == true) {
        conceptos = Object.values(editedRows);
    } else {
        GeneradorTarjetasConceptoPdf(false);
        conceptos = selectedRows;
        if (conceptos.length == 0) {
            mensajePantalla("No hay conceptos seleccionados", false);
            return;
        }
    }
    // Obtener los conceptos
    let contador = 0;
    for (const concepto of conceptos) {
        contador++;
        // Crear una nueva hoja para cada concepto
        const worksheet = workbook.addWorksheet(String(contador).padStart(3, '0'));
        const imageUrl = "/paginacfe/app/img/LogoPdf.PNG"; // Asegúrate de que la ruta sea válida
        const imageBase64 = await fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            });

        const imageId = workbook.addImage({
            base64: imageBase64.split(",")[1], // Remover el encabezado `data:image/png;base64,`
            extension: "png",
        });

        worksheet.addImage(imageId, {
            tl: { col: 0.2, row: 0.2 }, // Posición superior izquierda
            ext: { width: 150, height: 50 }, // Tamaño de la imagen
        });

        // Agregar encabezado
        worksheet.mergeCells("B1:H1");
        const line1 = worksheet.getCell("B1");
        line1.value = "División de Distribución Jalisco";
        line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
        line1.alignment = { horizontal: "right", vertical: "middle" };

        if (pantalla) {
            worksheet.mergeCells("B2:H2");
            const line2 = worksheet.getCell("B2");
            line2.value = "Zona " + datosProyecto.zona;
            line2.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
            line2.alignment = { horizontal: "right", vertical: "middle" };
        }

        worksheet.mergeCells("B3:H3");
        const line3 = worksheet.getCell("B3");
        line3.value = "Departamento de Planeación, Proyectos y Construcción";
        line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
        line3.alignment = { horizontal: "right", vertical: "middle" };
        if (pantalla) {
            worksheet.addRow();
            // Agregar título
            let tituloProy = worksheet.addRow(["Para: " + datosProyecto.nombre, "", "", "", "", "", "", ""]);
            worksheet.mergeCells("A5:H5");
            tituloProy.eachCell((cell, colNumber) => {
                cell.alignment = { horizontal: "justify", vertical: "middle" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                }
            });
            tituloProy.height = 70;
        } else {
            worksheet.addRow();
            worksheet.addRow();
        }

        let TituloTabla = worksheet.addRow(["No. Concepto", String(contador).padStart(3, '0'), "Análisis de los precios unitarios de los conceptos de trabajo", "", "", "", "", ""]);
        worksheet.mergeCells("C6:H6");

        TituloTabla.eachCell((cell, colNumber) => {
            if (colNumber == 1) {
                cell.font = { bold: true };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008e5a" } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                }
            }
            else if (colNumber == 2) {
                cell.alignment = { horizontal: "right", vertical: "middle" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                }
            }
            else {
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                }
            }
        });
        let headers;
        let headerRow;
        // Agregar encabezados de la tabla de concepto
        if (pantalla == true) {
            headers = ["No.", "Concepto", "", "", "", "", "Unidad", "Cantidad"];
            headerRow = worksheet.addRow(["", "", "", "", "", "", "Unidad", "Cantidad"]);
        } else {
            headers = ["No.", "Concepto", "", "", "", "", "Unidad", "Familia"];
            headerRow = worksheet.addRow(["", "", "", "", "", "", "Unidad", "Familia"]);
        }


        // Combinación de celdas para el encabezado
        worksheet.mergeCells(`A${headerRow.number}:A${headerRow.number}`); // Columna 1 abarca solo A
        worksheet.mergeCells(`B${headerRow.number}:F${headerRow.number}`); // Columna 2 abarca B a F
        worksheet.mergeCells(`G${headerRow.number}:G${headerRow.number}`); // Columna 3 abarca solo G
        worksheet.mergeCells(`H${headerRow.number}:H${headerRow.number}`); // Columna 4 abarca solo H

        // Asignar valores y estilos a las celdas del encabezado
        headerRow.getCell(1).value = headers[0]; // "No."
        headerRow.getCell(2).value = headers[1]; // "Concepto"
        headerRow.getCell(3).value = headers[2]; // "Unidad"
        headerRow.getCell(4).value = headers[3]; // "Cantidad"

        headerRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008e5a" } };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });

        // Agregar datos del concepto
        let dataRow;
        if (pantalla == true) {
            dataRow = worksheet.addRow([concepto.idconcepto, concepto.nombre, "", "", "", "", concepto.unidad, concepto.cantidad]);
        } else {
            dataRow = worksheet.addRow([concepto.idconcepto, concepto.nombre, "", "", "", "", concepto.unidad, concepto.familia]);
        }


        // Combinación de celdas para los datos
        worksheet.mergeCells(`A${dataRow.number}:A${dataRow.number}`); // Columna 1 abarca solo A
        worksheet.mergeCells(`B${dataRow.number}:F${dataRow.number}`); // Columna 2 abarca B a F
        worksheet.mergeCells(`G${dataRow.number}:G${dataRow.number}`); // Columna 3 abarca solo G
        worksheet.mergeCells(`H${dataRow.number}:H${dataRow.number}`); // Columna 4 abarca solo H

        // Asignar alineación y bordes a las celdas de datos
        dataRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
        dataRow.getCell(2).alignment = { horizontal: "justify", vertical: "middle" }; // Ajustar si necesitas alineación izquierda
        dataRow.getCell(7).alignment = { horizontal: "center", vertical: "middle" };
        dataRow.getCell(8).alignment = { horizontal: "center", vertical: "middle" };

        dataRow.eachCell((cell, colNumber) => {
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });
        dataRow.height = 50;
        // Agregar secciones de materiales, mano de obra, etc.
        await agregarSeccionMateriales(worksheet, concepto.idconcepto);
        await agregarSeccionManoObra(worksheet, concepto.idconcepto);
        await agregarSeccionHerramientaEquipo(worksheet, concepto.idconcepto);
        await agregarSeccionMaquinaria(worksheet, concepto.idconcepto);
        await agregarSeccionBasico(worksheet, concepto.idconcepto);

        // Agregar totales
        agregarTotales(worksheet, concepto.idconcepto);
    }
    // Restaurar los estilos originales del contenedor
    container.style.display = 'none';
    container.style.position = '';
    container.style.left = '';
    // Descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Conceptos.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
async function agregarSeccionMateriales(worksheet, idConceptoProyecto) {
    // Agregar título de la sección
    const lastRow = worksheet.lastRow.number;

    // Agregar título de la sección
    const titleRowNumber = lastRow + 2; // Dejar una fila vacía entre tablas
    worksheet.mergeCells(`A${titleRowNumber}:H${titleRowNumber}`);
    const titleCell = worksheet.getCell(`A${titleRowNumber}`);
    titleCell.value = "Materiales";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Obtener datos de materiales
    const materiales = await TraerMaterialesConceptoPDF(idConceptoProyecto, true);

    // Agregar encabezados de la tabla de materiales
    const headers = ["ID", "Descripción", "Descripción", "Unidad", "Precio U", "Cantidad", "Suministrado por CFE", "M = Precio * Cantidad"];
    const headerRow = worksheet.addRow(headers);
    worksheet.mergeCells(`A${headerRow.number}:A${headerRow.number}`);
    worksheet.mergeCells(`B${headerRow.number}:C${headerRow.number}`);
    worksheet.mergeCells(`D${headerRow.number}:D${headerRow.number}`);
    worksheet.mergeCells(`E${headerRow.number}:E${headerRow.number}`);
    worksheet.mergeCells(`F${headerRow.number}:F${headerRow.number}`);
    worksheet.mergeCells(`G${headerRow.number}:G${headerRow.number}`);
    worksheet.mergeCells(`H${headerRow.number}:H${headerRow.number}`);
    headerRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(2).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(3).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(4).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(5).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(6).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(7).alignment = { horizontal: "center", vertical: "middle" };

    headerRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008e5a" }, bgColor: { argb: "FFFFFFFF" } };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Agregar datos de materiales
    materiales.forEach((material, rowIndex) => {
        const rowData = [material.codigo, material.descripcion, , material.unidad, material.precio, material.cantidad, material.suministrado ? 'Sí' : 'No', material.suministrado ? 0 : material.precio * material.cantidad];
        const excelRow = worksheet.addRow(rowData);
        worksheet.mergeCells(`B${excelRow.number}:C${excelRow.number}`);
        // Aplicar color alterno a las filas
        excelRow.eachCell((cell, colNumber) => {
            // Configuración de alineación según la columna
            switch (colNumber) {
                case 1: // ID
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 2: // Descripción
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 3: // Unidad
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 4: // Precio U
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                    break;
                case 5: // Cantidad
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 6: // Suministrado por CFE
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 7: // M = Precio * Cantidad
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                    break;
                case 8: // M = Precio * Cantidad
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                default:
                    cell.alignment = { horizontal: "center", vertical: "middle" }; // Por defecto
            }

            // Aplicar colores alternos en las filas
            if (rowIndex % 2 === 0) {  // Filas pares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } }; // Gris claro
            } else {  // Filas impares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }; // Blanco
            }

            // Configurar bordes solo en los lados (izquierda y derecha)
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "none" },
                bottom: { style: "thin" }
            };
        });
    });

    // Calcular la suma de la última columna
    const total = materiales.reduce((sum, item) => sum + (item.suministrado ? 0 : item.precio * item.cantidad), 0);

    // Agregar fila de suma
    const totalRow = worksheet.addRow(["", "", "", "", "", "", "SUMA 1", total]);
    totalRow.eachCell((cell, colNumber) => {
        if (colNumber == 8) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "right", vertical: "middle" };
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "thin" },
                bottom: { style: "thin" }
            };
        }
        if (colNumber == 7) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "thin" },
                bottom: { style: "thin" }
            };
        }
        // Configurar bordes solo en los lados (izquierda y derecha)

    });

    // Establecer el ancho de las columnas manualmente
    worksheet.getColumn(1).width = 15; // ID
    worksheet.getColumn(2).width = 30; // Descripción
    worksheet.getColumn(3).width = 10; // Unidad
    worksheet.getColumn(4).width = 15; // Precio U
    worksheet.getColumn(5).width = 10; // Cantidad
    worksheet.getColumn(6).width = 20; // Suministrado por CFE
    worksheet.getColumn(7).width = 20; // M = Precio * Cantidad
}
async function agregarSeccionManoObra(worksheet, idConceptoProyecto) {
    // Obtener la última fila utilizada
    const lastRow = worksheet.lastRow.number;

    // Agregar título de la sección
    const titleRowNumber = lastRow + 2; // Dejar una fila vacía entre tablas
    worksheet.mergeCells(`A${titleRowNumber}:H${titleRowNumber}`);
    const titleCell = worksheet.getCell(`A${titleRowNumber}`);
    titleCell.value = "Mano de Obra";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Obtener datos de mano de obra
    const manoObra = await TraerManoObrasConceptoPDF(idConceptoProyecto, true);

    // Agregar encabezados de la tabla de mano de obra
    const headers = ["ID", "Categoría", "Unidad", "Salario", "R", "Cantidad", "Sr", "Mo = Sr/R"];
    const headerRow = worksheet.addRow(headers);
    worksheet.mergeCells(`A${headerRow.number}:A${headerRow.number}`);
    worksheet.mergeCells(`B${headerRow.number}:B${headerRow.number}`);
    worksheet.mergeCells(`C${headerRow.number}:C${headerRow.number}`);
    worksheet.mergeCells(`D${headerRow.number}:D${headerRow.number}`);
    worksheet.mergeCells(`E${headerRow.number}:E${headerRow.number}`);
    worksheet.mergeCells(`F${headerRow.number}:F${headerRow.number}`);
    worksheet.mergeCells(`G${headerRow.number}:G${headerRow.number}`);
    worksheet.mergeCells(`H${headerRow.number}:H${headerRow.number}`);
    headerRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(2).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(3).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(4).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(5).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(6).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(7).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(8).alignment = { horizontal: "center", vertical: "middle" };

    headerRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008e5a" }, bgColor: { argb: "FFFFFFFF" } };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Agregar datos de mano de obra
    manoObra.forEach((manoObra, rowIndex) => {
        const rowData = [manoObra.idmanoobra, manoObra.categoria, manoObra.unidad, manoObra.salario, manoObra.rendimiento, manoObra.cantidad, manoObra.sr, manoObra.importe];
        const excelRow = worksheet.addRow(rowData);

        // Aplicar color alterno a las filas
        excelRow.eachCell((cell, colNumber) => {
            // Configuración de alineación según la columna
            switch (colNumber) {
                case 1: // ID
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 2: // Categoría
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 3: // Unidad
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                    break;
                case 4: // Salario
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 5: // R
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 6: // Cantidad
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 7: // Sr
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 8: // Mo = Sr/R
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                default:
                    cell.alignment = { horizontal: "center", vertical: "middle" }; // Por defecto
            }

            // Aplicar colores alternos en las filas
            if (rowIndex % 2 === 0) {  // Filas pares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } }; // Gris claro
            } else {  // Filas impares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }; // Blanco
            }

            // Configurar bordes solo en los lados (izquierda y derecha)
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "none" },
                bottom: { style: "thin" }
            };
        });
    });

    // Calcular la suma de la última columna
    const total = manoObra.reduce((sum, item) => sum + item.importe, 0);
    totalManoObraTarjeta = total
    // Agregar fila de suma
    const totalRow = worksheet.addRow(["", "", "", "", "", "", "SUMA 2", total]);
    totalRow.eachCell((cell, colNumber) => {
        if (colNumber === 8) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "right", vertical: "middle" };
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "thin" },
                bottom: { style: "thin" }
            };
        }
        if (colNumber === 7) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "thin" },
                bottom: { style: "thin" }
            };
        }
    });

    // Establecer el ancho de las columnas manualmente
    worksheet.getColumn(1).width = 15; // ID
    worksheet.getColumn(2).width = 30; // Categoría
    worksheet.getColumn(3).width = 10; // Unidad
    worksheet.getColumn(4).width = 15; // Salario
    worksheet.getColumn(5).width = 10; // R
    worksheet.getColumn(6).width = 10; // Cantidad
    worksheet.getColumn(7).width = 15; // Sr
    worksheet.getColumn(8).width = 20; // Mo = Sr/R
}
async function agregarSeccionHerramientaEquipo(worksheet, idConceptoProyecto) {
    // Obtener la última fila utilizada
    const lastRow = worksheet.lastRow.number;

    // Agregar título de la sección
    const titleRowNumber = lastRow + 2; // Dejar una fila vacía entre tablas
    worksheet.mergeCells(`A${titleRowNumber}:H${titleRowNumber}`);
    const titleCell = worksheet.getCell(`A${titleRowNumber}`);
    titleCell.value = "Herramienta y Equipo";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Obtener datos de herramienta y equipo
    const totalImporteManoObra = parseFloat(document.getElementById(`SumaImporteManoObraPDF-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const herramientaEquipo = GeneradorTablaHerramientaEquipoExcel(idConceptoProyecto, totalImporteManoObra);

    // Agregar encabezados de la tabla de herramienta y equipo
    const headers = ["Descripción", , , , , "Kh o Ks", "Mo", "HE = Kh * Mo"];
    const headerRow = worksheet.addRow(headers);
    worksheet.mergeCells(`A${headerRow.number}:E${headerRow.number}`);
    headerRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(2).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(3).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(4).alignment = { horizontal: "center", vertical: "middle" };

    headerRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008e5a" }, bgColor: { argb: "FFFFFFFF" } };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Agregar datos de herramienta y equipo
    herramientaEquipo.forEach((item, rowIndex) => {
        const rowData = [item.descripcion, , , , , item.kh, item.mo, item.he];
        const excelRow = worksheet.addRow(rowData);
        worksheet.mergeCells(`A${excelRow.number}:E${excelRow.number}`);

        // Aplicar color alterno a las filas
        excelRow.eachCell((cell, colNumber) => {
            // Configuración de alineación según la columna
            switch (colNumber) {
                case 1: // Descripción
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 2: // Kh o Ks
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 3: // Mo
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 4: // HE = Kh * Mo
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 5: // HE = Kh * Mo
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 6: // HE = Kh * Mo
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 7: // HE = Kh * Mo
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 8: // HE = Kh * Mo
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                default:

                    cell.alignment = { horizontal: "center", vertical: "middle" }; // Por defecto
            }

            // Aplicar colores alternos en las filas
            if (rowIndex % 2 === 0) {  // Filas pares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } }; // Gris claro
            } else {  // Filas impares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }; // Blanco
            }

            // Configurar bordes solo en los lados (izquierda y derecha)
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "none" },
                bottom: { style: "thin" }
            };
        });
    });

    // Calcular la suma de la última columna
    const total = herramientaEquipo.reduce((sum, item) => sum + item.he, 0);

    // Agregar fila de suma
    const totalRow = worksheet.addRow(["", "", "", , , , "SUMA 3", total]);
    totalRow.eachCell((cell, colNumber) => {
        if (colNumber === 8) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "right", vertical: "middle" };
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "thin" },
                bottom: { style: "thin" }
            };
        }
        if (colNumber === 7) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "thin" },
                bottom: { style: "thin" }
            };
        }
    });

    // Establecer el ancho de las columnas manualmente
    worksheet.getColumn(1).width = 30; // Descripción
    worksheet.getColumn(2).width = 10; // Kh o Ks
    worksheet.getColumn(3).width = 10; // Mo
    worksheet.getColumn(4).width = 20; // HE = Kh * Mo
}
async function agregarSeccionMaquinaria(worksheet, idConceptoProyecto) {
    // Obtener la última fila utilizada
    const lastRow = worksheet.lastRow.number;

    // Agregar título de la sección
    const titleRowNumber = lastRow + 2; // Dejar una fila vacía entre tablas
    worksheet.mergeCells(`A${titleRowNumber}:H${titleRowNumber}`);
    const titleCell = worksheet.getCell(`A${titleRowNumber}`);
    titleCell.value = "Maquinaria";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Obtener datos de maquinaria
    const maquinaria = await TraerMaquinariaConceptoPDF(idConceptoProyecto, true);

    // Agregar encabezados de la tabla de maquinaria
    const headers = ["ID", "Descripción", , , "Unidad", "PhM", "RhM", "Ma = PhM / RhM"];
    const headerRow = worksheet.addRow(headers);
    worksheet.mergeCells(`B${headerRow.number}:D${headerRow.number}`);

    headerRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(2).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(3).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(4).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(5).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(6).alignment = { horizontal: "center", vertical: "middle" };

    headerRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008e5a" }, bgColor: { argb: "FFFFFFFF" } };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Agregar datos de maquinaria
    maquinaria.forEach((maquinaria, rowIndex) => {
        const rowData = [maquinaria.idmaquinaria, maquinaria.descripcion, , , maquinaria.unidad, maquinaria.phm, maquinaria.rhm, maquinaria.phm / maquinaria.rhm];
        const excelRow = worksheet.addRow(rowData);
        worksheet.mergeCells(`B${excelRow.number}:D${excelRow.number}`);
        // Aplicar color alterno a las filas
        excelRow.eachCell((cell, colNumber) => {
            // Configuración de alineación según la columna
            switch (colNumber) {
                case 1: // ID
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 2: // Descripción
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 3: // Unidad
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 4: // PhM
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 5: // RhM
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                    break;
                case 6: // Ma = PhM / RhM
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 7: // Ma = PhM / RhM
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 8: // Ma = PhM / RhM
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                default:
                    cell.alignment = { horizontal: "center", vertical: "middle" }; // Por defecto
            }

            // Aplicar colores alternos en las filas
            if (rowIndex % 2 === 0) {  // Filas pares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } }; // Gris claro
            } else {  // Filas impares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }; // Blanco
            }

            // Configurar bordes solo en los lados (izquierda y derecha)
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "none" },
                bottom: { style: "thin" }
            };
        });
    });

    // Calcular la suma de la última columna
    const total = maquinaria.reduce((sum, item) => sum + (item.phm / item.rhm), 0);

    // Agregar fila de suma
    const totalRow = worksheet.addRow(["", "", , "", "", "", "SUMA 4", total]);
    totalRow.eachCell((cell, colNumber) => {
        if (colNumber == 8) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "right", vertical: "middle" };
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "thin" },
                bottom: { style: "thin" }
            };
        }
        if (colNumber == 7) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "thin" },
                bottom: { style: "thin" }
            };
        }
    });

    // Establecer el ancho de las columnas manualmente
    worksheet.getColumn(1).width = 15; // ID
    worksheet.getColumn(2).width = 30; // Descripción
    worksheet.getColumn(3).width = 10; // Unidad
    worksheet.getColumn(4).width = 15; // PhM
    worksheet.getColumn(5).width = 15; // RhM
    worksheet.getColumn(6).width = 20; // Ma = PhM / RhM
}
async function agregarSeccionBasico(worksheet, idConceptoProyecto) {
    // Obtener la última fila utilizada
    const lastRow = worksheet.lastRow.number;

    // Agregar título de la sección
    const titleRowNumber = lastRow + 2; // Dejar una fila vacía entre tablas
    worksheet.mergeCells(`A${titleRowNumber}:H${titleRowNumber}`);
    const titleCell = worksheet.getCell(`A${titleRowNumber}`);
    titleCell.value = "Básicos";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Obtener datos de básicos
    const basico = await TraerBasicoConceptoPDF(idConceptoProyecto, true);

    // Agregar encabezados de la tabla de básicos
    const headers = ["ID", "Descripción", , , "Unidad", "Precio U", "Cantidad", "B = Precio * Cantidad"];
    const headerRow = worksheet.addRow(headers);
    worksheet.mergeCells(`B${headerRow.number}:D${headerRow.number}`);

    headerRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(2).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(3).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(4).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(5).alignment = { horizontal: "center", vertical: "middle" };
    headerRow.getCell(6).alignment = { horizontal: "center", vertical: "middle" };

    headerRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008e5a" }, bgColor: { argb: "FFFFFFFF" } };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Agregar datos de básicos
    basico.forEach((basico, rowIndex) => {
        const rowData = [basico.idconbasi, basico.nombre, , , basico.unidad, basico.total, basico.cantconbasi, basico.total * basico.cantconbasi];
        const excelRow = worksheet.addRow(rowData);
        worksheet.mergeCells(`B${excelRow.number}:D${excelRow.number}`);
        // Aplicar formato a las celdas
        excelRow.eachCell((cell, colNumber) => {
            switch (colNumber) {
                case 1: // ID
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 2: // Descripción
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 3: // Unidad
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 4: // Precio U
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 5: // Cantidad
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                    break;
                case 6: // B = Precio * Cantidad
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 7: // B = Precio * Cantidad
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 8: // B = Precio * Cantidad
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                default:
                    cell.alignment = { horizontal: "center", vertical: "middle" }; // Por defecto
            }

            // Aplicar colores alternos en las filas
            if (rowIndex % 2 === 0) {  // Filas pares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } }; // Gris claro
            } else {  // Filas impares
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }; // Blanco
            }

            // Configurar bordes solo en los lados (izquierda y derecha)
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "none" },
                bottom: { style: "thin" }
            };
        });
    });

    // Calcular la suma de la última columna
    const total = basico.reduce((sum, item) => sum + (item.total * item.cantconbasi), 0);

    // Agregar fila de suma
    const totalRow = worksheet.addRow(["", "", , , "", "", "SUMA 5", total]);
    totalRow.eachCell((cell, colNumber) => {
        if (colNumber == 8) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "right", vertical: "middle" };
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "thin" },
                bottom: { style: "thin" }
            };
        }
        if (colNumber == 7) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
                left: { style: "thin" },
                right: { style: "thin" },
                top: { style: "thin" },
                bottom: { style: "thin" }
            };
        }
    });

    // Establecer el ancho de las columnas manualmente
    worksheet.getColumn(1).width = 15; // ID
    worksheet.getColumn(2).width = 30; // Descripción
    worksheet.getColumn(3).width = 10; // Unidad
    worksheet.getColumn(4).width = 15; // Precio U
    worksheet.getColumn(5).width = 10; // Cantidad
    worksheet.getColumn(6).width = 20; // B = Precio * Cantidad
}

function agregarTotales(worksheet, idConceptoProyecto) {
    // Obtener totales
    worksheet.addRow();
    const totalMateriales = parseFloat(document.getElementById(`SumaImporteMaterialesPDF-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const totalManoObra = parseFloat(document.getElementById(`SumaImporteManoObraPDF-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const totalHerramientaEquipo = parseFloat(document.getElementById(`SumaImporteHerramientaEquipoPDF-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const totalMaquinaria = parseFloat(document.getElementById(`SumaImporteMaquinariaPDF-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const totalBasico = parseFloat(document.getElementById(`SumaImporteBasicoPDF-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;

    const costoDirecto = totalMateriales + totalManoObra + totalHerramientaEquipo + totalMaquinaria + totalBasico;
    const costoIndirecto = costoDirecto * (costosAdicionales.CIndirecto / 100);
    const subTotal1 = costoDirecto + costoIndirecto;
    const financiamiento = subTotal1 * (costosAdicionales.Financiamiento / 100);
    const subTotal2 = financiamiento + subTotal1;
    const utilidad = subTotal2 * (costosAdicionales.utilidad / 100);
    const subTotal3 = utilidad + subTotal2;
    const cargosAdicionales = subTotal3 * (costosAdicionales.CAdicionales / 100);
    const precioUnitario = subTotal3 + cargosAdicionales;

    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    // Agregar totales a la hoja
    const filas = [
        ["", "(CD) COSTO DIRECTO", "", "", "", "", "", formatoMXN.format(costoDirecto)],
        ["", "(CI) COSTO INDIRECTOS", , , `${costosAdicionales.CIndirecto}.00%`, , "", formatoMXN.format(costoIndirecto)],
        ["", "SUBTOTAL 1", , , , , "", formatoMXN.format(subTotal1)],
        ["", "(CF) FINANCIAMIENTO", , , `${costosAdicionales.Financiamiento}.00%`, , "", formatoMXN.format(financiamiento)],
        ["", "SUBTOTAL 2", , , , , "", formatoMXN.format(subTotal2)],
        ["", "(CU) UTILIDAD", , , `${costosAdicionales.utilidad}.00%`, , "", formatoMXN.format(utilidad)],
        ["", "SUBTOTAL 3", , , , , "", formatoMXN.format(subTotal3)],
        ["", "CARGOS ADICIONALES", , , `${costosAdicionales.CAdicionales}0%`, , "", formatoMXN.format(cargosAdicionales)],
        ["", "PRECIO UNITARIO (CD+CIO+CIC+CF+CU+CA)", "", "", "", "", "", formatoMXN.format(precioUnitario)]
    ];

    filas.forEach((fila, index) => {
        const row = worksheet.addRow(fila);
        worksheet.mergeCells(`B${row.number}:D${row.number}`);
        row.eachCell((cell, colNumber) => {
            // Asignar bordes manualmente
            cell.border = {
                top: { style: index == 0 || (index == 2 && colNumber == 8) || (index == 4 && colNumber == 8) || (index == 6 && colNumber == 8) || (index == 8 && colNumber == 8) ? "thin" : "none" },
                left: { style: colNumber == 1 || colNumber == 7 ? "thin" : "none" },
                bottom: { style: index == filas.length - 1 ? "thin" : "none" },
                right: { style: colNumber == 8 ? "thin" : "none" }
            };

            // Asignar alineación manualmente
            switch (colNumber) {
                case 1:
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 2:
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 3:
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 4:
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 5:
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 6:
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                    break;
                case 7:
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 8:
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                default:
                    cell.alignment = { horizontal: "center", vertical: "middle" };
            }

            // Aplicar negritas a la primera y última fila
            if (index === 0 || index === filas.length - 1) {
                cell.font = { bold: true };
            }
        });
    });

    // Aplicar borde exterior a toda la tabla
    const startRow = worksheet.lastRow.number - filas.length + 1;
    const endRow = worksheet.lastRow.number;
    for (let i = startRow; i <= endRow; i++) {
        const row = worksheet.getRow(i);
        row.eachCell((cell, colNumber) => {
            cell.border = {
                top: { style: i == startRow ? "thin" : cell.border.top.style },
                left: { style: colNumber == 1 ? "thin" : cell.border.left.style },
                bottom: { style: i == endRow ? "thin" : cell.border.bottom.style },
                right: { style: colNumber == 8 ? "thin" : cell.border.right.style }
            };
        });
    }
}

function GeneradorTablaHerramientaEquipoExcel(idConceptoProyecto, totalImporteManoObra) {
    const khHerramientas = 0.03;
    const khEquipo = 0.02;

    const importeHerramientas = khHerramientas * totalImporteManoObra;
    const importeEquipo = khEquipo * totalImporteManoObra;

    const totalImporteHerramientaEquipo = importeHerramientas + importeEquipo;

    return [
        {
            descripcion: "Herramientas de mano",
            kh: khHerramientas,
            mo: totalImporteManoObra,
            he: importeHerramientas
        },
        {
            descripcion: "Equipo y seguridad",
            kh: khEquipo,
            mo: totalImporteManoObra,
            he: importeEquipo
        },
    ];
}