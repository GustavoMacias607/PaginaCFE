
function llenarCamposPaginaTerminado() {
    showCostoDirecto = true;
    showPrecioUnitario = true;
    showPUCantidad = true;

    document.getElementById('AddfechaInicioInput').addEventListener('blur', calcularFechaTermino);
    document.getElementById('inputPeriodo').addEventListener('blur', calcularFechaTermino);
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
    currentPageTarjetas = 1;
    tarjetasPerPage = 5;
    allConceptos = [];
    precionadoBtnExportarPdf();
    document.getElementById('toggleCostoDirecto').addEventListener('click', () => {
        showCostoDirecto = !showCostoDirecto;
        updateColumnVisibility();
    });

    document.getElementById('togglePrecioUnitario').addEventListener('click', () => {
        showPrecioUnitario = !showPrecioUnitario;
        updateColumnVisibility();
    });

    document.getElementById('togglePUCantidad').addEventListener('click', () => {
        showPUCantidad = !showPUCantidad;
        updateColumnVisibility();
    });
}
function porcentajeZona(zonis, calculoConcepto) {
    zonis.forEach((zona) => {
        if (zona.idzona == datosProyecto.idZona) {
            console.log("entro")
            costosAdicionales.CIndirecto = zona.indirecto;
            costosAdicionales.Financiamiento = zona.financiamiento;
            costosAdicionales.utilidad = zona.utilidad;
            costosAdicionales.CAdicionales = zona.adicionales;
            console.log(calculoConcepto);
            if (!calculoConcepto) {
                console.log("imprimiendo las tarjetas");
                llenarTablaConceptosTerminado();
                GeneradorTablaConceptoPDF();
            }
            return;
        }
    })
}

function mostrarTablaTerminado(tablaId, boton) {
    const tabla = document.getElementById(tablaId);
    const isVisible = tabla.style.display === 'block';
    if (tablaId == "tablaTarjetasProyecto" && !isVisible) {
        let btns = document.getElementById("mostrarBtnPdf");
        let btns2 = document.getElementById("mostrarBtnPaginacion");
        btns.style.display = 'flex';
        btns2.style.display = 'flex';
    } else {
        let btns = document.getElementById("mostrarBtnPdf");
        let btns2 = document.getElementById("mostrarBtnPaginacion");
        btns.style.display = 'none';
        btns2.style.display = 'none';
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
    const datos = { idProyecto: datosProyecto.idProyecto };
    const json = JSON.stringify(datos);
    const url = "../ws/ConceptosProyecto/wsGetConceptos.php";

    $.post(url, json, (responseText, status) => {
        try {
            if (status === "success") {
                const resp = JSON.parse(responseText);
                const datosBd = resp.datos;

                if (datosBd && datosBd.length > 0) {
                    // 🔹 Ordenar antes de procesar
                    datosBd.sort((a, b) => {
                        // Si idconteo es numérico, ordenar como número
                        if (!isNaN(a.IdConteo) && !isNaN(b.IdConteo)) {
                            return Number(a.IdConteo) - Number(b.IdConteo);
                        }
                        // Si tiene letras (alfanumérico), usar orden alfabético
                        return a.IdConteo.localeCompare(b.IdConteo, 'es', { numeric: true });
                    });

                    // 🔹 Llenar el objeto editedRows con el orden correcto
                    datosBd.forEach((datos) => {
                        editedRows[datos.IdConcepto] = {
                            cantidad: datos.CantidadTotal,
                            estatus: datos.EstatusConcepto,
                            idconteo: datos.IdConteo,
                            idconcepto: datos.IdConcepto,
                            nombre: datos.NombreConcepto,
                            nombreespe: datos.Familia,
                            total: datos.TotalConcepto,
                            unidad: datos.UnidadConcepto,
                        };
                    });
                } else {
                    editedRows = {};
                }
                ObtenerZonas(true);
                // 🔹 Convertir a arreglo (ya ordenado)
                filteredDataPresupuesto = Object.values(editedRows);
                GeneradorTablaConcepto();

            } else {
                throw new Error(status);
            }
        } catch (error) {
            alert("Error: " + error);
        }
    });
}


function precionadoBtnExportarPdf() {
    texto = document.getElementById("textoCargaDiv");
    if (pantallaFuncion == "addProyTermFrm") {
        texto.style.color = "black";
    } else {
        texto.style.color = "white";
    }

    let btn = document.getElementById("btnExportarPDF");;
    btn.setAttribute("disabled", "disabled");
    btn.classList.add("btnClickeadoExportar");

    let btnE = document.getElementById("btnExportar");
    btnE.setAttribute("disabled", "disabled");
    btnE.classList.add("btnClickeadoExportar");
}

function RegresarEstatusProyecto() {
    const datos = {};
    datos.idProyecto = datosProyecto.idProyecto;
    datos.nombre = datosProyecto.nombre;
    datos.fecha = datosProyecto.fecha;
    datos.periodo = datosProyecto.periodo;
    datos.fechaInicio = datosProyecto.fechaInicio;
    datos.fechaTermino = datosProyecto.fechaTermino;
    datos.idZona = datosProyecto.idZona;
    datos.total = datosProyecto.total;
    datos.estatus = 'Presupuesto';
    let json = JSON.stringify(datos);

    let url = "../ws/Proyecto/wsUpdProyecto.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    opcion('addPresupuestoFrm')
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
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
    const editedRowsArray = Object.values(editedRows || []); // Protección por si editedRows es null o undefined

    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
    let contador = 1;
    if (editedRowsArray.length > 0) {
        editedRowsArray.forEach(record => {
            // Normalizar y validar tipos numéricos
            const totalNum = parseFloat(record.total) || 0;
            const cantidadNum = parseFloat(record.cantidad) || 0;
            // Evita fallos si la función de porcentaje no devuelve número
            const calculoPorcentaje = parseFloat(calculoConceptoPorcentaje(totalNum)) || 0;
            const importe = cantidadNum * calculoPorcentaje;
            total += importe;

            // Formateos seguros
            const precioFormateado = totalNum > 0 ? formatoMXN.format(totalNum) : "$0.00";
            const PrecioPorcentajeFormateado = calculoPorcentaje > 0 ? formatoMXN.format(calculoPorcentaje) : "$0.00";
            const importeFormateado = importe > 0 ? formatoMXN.format(importe) : "$0.00";



            // Sanitizar texto (evita errores si vienen null o undefined)
            const idconteo = record.idconteo ?? "---";
            const idconcepto = record.idconcepto ?? "---";
            const nombre = record.nombre?.toString().trim() || "---";
            const unidad = record.unidad?.toString().trim() || "---";
            const cantidadTexto = record.cantidad !== "" && record.cantidad != null ? cantidadNum : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            row.innerHTML = `
                <td style="text-align: right;">${contador}</td>
                <td class="Code">${idconcepto}</td>
                <td>${nombre}</td>
                <td>${unidad}</td>
                <td style="text-align: right;">${cantidadTexto}</td>
                <td style="text-align: right;" class="col-costo-directo">${precioFormateado}</td>
                <td style="text-align: right;" class="col-precio-unitario">${PrecioPorcentajeFormateado}</td>
                <td style="text-align: right;" class="col-pu-cantidad">${importeFormateado}</td>
            `;
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));
            tableBody.appendChild(row);

            contador++;
        });

        const totalImporteConcepto = document.getElementById("TotalSumaImporteConceptos");
        totalImporteConcepto.innerHTML = formatoMXN.format(total);
    } else {
        tableBody.innerHTML = `
            <tr class="fila">
                <td colspan="8" class="Code">Sin resultados</td>
            </tr>
        `;
    }

    // Actualizar visibilidad de columnas al final
    updateColumnVisibility();
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

        doc.setFontSize(9);
        const line4 = "Fecha: " + ObtenerFechaActualDMY();
        doc.text(line4, headerX, headerYStart + 10.7, { align: "right" });
    };

    // Agregar título de la obra (solo en primera página)
    const addObraTitle = (doc, pageNumber) => {
        if (pageNumber === 1) {
            const pageWidth = doc.internal.pageSize.width;
            const titleX = pageWidth / 2;
            const titleY = 45;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);

            const obraText = "Obra: " + datosProyecto.nombre;

            // Dividir el texto en líneas si es muy largo
            const maxWidth = pageWidth - 46; // 23mm de margen a cada lado
            const splitObraText = doc.splitTextToSize(obraText, maxWidth);

            doc.text(splitObraText, titleX, titleY, { align: "center" });

            // Retornar la altura ocupada por el texto de la obra
            return splitObraText.length * 5; // Aproximadamente 5mm por línea
        }
        return 0;
    };

    // Agregar título de la tabla
    const addTitle = (doc, pageNumber, obraTitleHeight) => {
        const pageWidth = doc.internal.pageSize.width;
        const titleX = pageWidth / 2;

        // Ajustar posición Y según si es primera página o no
        let titleY;
        if (pageNumber === 1) {
            titleY = 48 + obraTitleHeight;
        } else {
            titleY = 43; // Posición del título para páginas siguientes
        }
        doc.setTextColor(0, 142, 90);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const title = "Materiales Suministrados por CFE";
        doc.text(title, titleX, titleY, { align: "center" });

        return titleY;
    };

    // Agregar imagen
    const addImage = (doc) => {
        const imageUrl = urlImagenLogo;
        const marginLeft = 15;
        const marginTop = 15;
        const imageWidth = 45;
        const imageHeight = 15;

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    };

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

    let pageNumber = 0;
    let obraTitleHeight = 0;

    // Calcular la altura del título de la obra ANTES de crear la tabla
    const tempDoc = new jsPDF();
    const pageWidth = tempDoc.internal.pageSize.width;
    const maxWidth = pageWidth - 46;
    const splitObraText = tempDoc.splitTextToSize("Obra: " + datosProyecto.nombre, maxWidth);
    obraTitleHeight = splitObraText.length * 4;

    // Calcular startY para la primera página
    const firstPageStartY = 52 + obraTitleHeight;
    const otherPagesStartY = 53; // 43 (titleY) + 10 = 53

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        // Usar un margin.top base y controlar con startY
        margin: { top: 50, right: 23, bottom: 40, left: 23 },
        startY: firstPageStartY, // Posición inicial para la primera página
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
            4: { halign: 'right' },
            5: { halign: 'right' }
        },

        didDrawPage: (data) => {
            pageNumber += 1;

            addImage(doc);
            addHeader(doc);

            // Agregar título de la obra (solo primera página) y obtener su altura
            const currentObraTitleHeight = addObraTitle(doc, pageNumber);

            // Agregar título de la tabla con posición ajustada
            const titleY = addTitle(doc, pageNumber, currentObraTitleHeight);

            // Para páginas siguientes, ajustar startY
            if (pageNumber > 1) {
                // Esto forzará a que la tabla en páginas siguientes comience en 53
                data.settings.startY = otherPagesStartY;
            }

            addFooter(doc, pageNumber);
        },
        willDrawPage: (data) => {
            // Asegurar que las páginas siguientes usen el startY correcto
            if (pageNumber > 1) {
                data.settings.startY = otherPagesStartY;
            }
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

    doc.save("ListaMaterialesSuministradorCFEProy.pdf");
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

        doc.setFontSize(9);
        const line4 = "Fecha: " + ObtenerFechaActualDMY();
        doc.text(line4, headerX, headerYStart + 10.7, { align: "right" });
    };

    // Agregar título de la obra (solo en primera página)
    const addObraTitle = (doc, pageNumber) => {
        if (pageNumber === 1) {
            const pageWidth = doc.internal.pageSize.width;
            const titleX = pageWidth / 2;
            const titleY = 45;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);

            const obraText = "Obra: " + datosProyecto.nombre;

            // Dividir el texto en líneas si es muy largo
            const maxWidth = pageWidth - 46; // 23mm de margen a cada lado
            const splitObraText = doc.splitTextToSize(obraText, maxWidth);

            doc.text(splitObraText, titleX, titleY, { align: "center" });

            // Retornar la altura ocupada por el texto de la obra
            return splitObraText.length * 5; // Aproximadamente 5mm por línea
        }
        return 0;
    };

    // Agregar título de la tabla
    const addTitle = (doc, pageNumber, obraTitleHeight) => {
        const pageWidth = doc.internal.pageSize.width;
        const titleX = pageWidth / 2;

        // Ajustar posición Y según si es primera página o no
        let titleY;
        if (pageNumber === 1) {
            titleY = 48 + obraTitleHeight;
        } else {
            titleY = 43; // Posición del título para páginas siguientes
        }
        doc.setTextColor(0, 142, 90);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const title = "Materiales Suministrados por contratista";
        doc.text(title, titleX, titleY, { align: "center" });

        return titleY;
    };

    // Agregar imagen
    const addImage = (doc) => {
        const imageUrl = urlImagenLogo;
        const marginLeft = 15;
        const marginTop = 15;
        const imageWidth = 45;
        const imageHeight = 15;

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    };

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

    let pageNumber = 0;
    let obraTitleHeight = 0;

    // Calcular la altura del título de la obra ANTES de crear la tabla
    const tempDoc = new jsPDF();
    const pageWidth = tempDoc.internal.pageSize.width;
    const maxWidth = pageWidth - 46;
    const splitObraText = tempDoc.splitTextToSize("Obra: " + datosProyecto.nombre, maxWidth);
    obraTitleHeight = splitObraText.length * 4;

    // Calcular startY para la primera página
    const firstPageStartY = 52 + obraTitleHeight;
    const otherPagesStartY = 53; // 43 (titleY) + 10 = 53

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        margin: { top: 50, right: 23, bottom: 40, left: 23 },
        startY: firstPageStartY, // Posición inicial para la primera página
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
            4: { halign: 'right' },
            5: { halign: 'right' }
        },

        didDrawPage: (data) => {
            pageNumber += 1;

            addImage(doc);
            addHeader(doc);

            // Agregar título de la obra (solo primera página) y obtener su altura
            const currentObraTitleHeight = addObraTitle(doc, pageNumber);

            // Agregar título de la tabla con posición ajustada
            const titleY = addTitle(doc, pageNumber, currentObraTitleHeight);

            // Para páginas siguientes, ajustar startY
            if (pageNumber > 1) {
                data.settings.startY = otherPagesStartY;
            }

            addFooter(doc, pageNumber);
        },
        willDrawPage: (data) => {
            // Asegurar que las páginas siguientes usen el startY correcto
            if (pageNumber > 1) {
                data.settings.startY = otherPagesStartY;
            }
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

    doc.save("ListaMaterialesSuministradorContratistaProy.pdf");
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

        doc.setFontSize(9);
        const line4 = "Fecha: " + ObtenerFechaActualDMY();
        doc.text(line4, headerX, headerYStart + 10.7, { align: "right" });
    };

    // Agregar título de la obra (solo en primera página)
    const addObraTitle = (doc, pageNumber) => {
        if (pageNumber === 1) {
            const pageWidth = doc.internal.pageSize.width;
            const titleX = pageWidth / 2;
            const titleY = 45;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);

            const obraText = "Obra: " + datosProyecto.nombre;

            // Dividir el texto en líneas si es muy largo
            const maxWidth = pageWidth - 46; // 23mm de margen a cada lado
            const splitObraText = doc.splitTextToSize(obraText, maxWidth);

            doc.text(splitObraText, titleX, titleY, { align: "center" });

            // Retornar la altura ocupada por el texto de la obra
            return splitObraText.length * 5; // Aproximadamente 5mm por línea
        }
        return 0;
    };

    // Agregar título de la tabla
    const addTitle = (doc, pageNumber, obraTitleHeight) => {
        const pageWidth = doc.internal.pageSize.width;
        const titleX = pageWidth / 2;

        // Ajustar posición Y según si es primera página o no
        let titleY;
        if (pageNumber === 1) {
            titleY = 48 + obraTitleHeight;
        } else {
            titleY = 43; // Posición del título para páginas siguientes
        }
        doc.setTextColor(0, 142, 90);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const title = "Mano de obra";
        doc.text(title, titleX, titleY, { align: "center" });

        return titleY;
    };

    // Agregar imagen
    const addImage = (doc) => {
        const imageUrl = urlImagenLogo;
        const marginLeft = 15;
        const marginTop = 15;
        const imageWidth = 45;
        const imageHeight = 15;

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    };

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

    let pageNumber = 0;
    let obraTitleHeight = 0;

    // Calcular la altura del título de la obra ANTES de crear la tabla
    const tempDoc = new jsPDF();
    const pageWidth = tempDoc.internal.pageSize.width;
    const maxWidth = pageWidth - 46;
    const splitObraText = tempDoc.splitTextToSize("Obra: " + datosProyecto.nombre, maxWidth);
    obraTitleHeight = splitObraText.length * 4;

    // Calcular startY para la primera página
    const firstPageStartY = 52 + obraTitleHeight;
    const otherPagesStartY = 53; // 43 (titleY) + 10 = 53

    // Generar la tabla y configurar estilos
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        margin: { top: 50, right: 23, bottom: 40, left: 23 },
        startY: firstPageStartY, // Posición inicial para la primera página
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
            0: { halign: 'left' },
            1: { halign: 'left' },
            2: { halign: 'left' },
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'right' },
            6: { halign: 'right' }
        },
        didDrawPage: (data) => {
            pageNumber += 1;

            addImage(doc);
            addHeader(doc);

            // Agregar título de la obra (solo primera página) y obtener su altura
            const currentObraTitleHeight = addObraTitle(doc, pageNumber);

            // Agregar título de la tabla con posición ajustada
            const titleY = addTitle(doc, pageNumber, currentObraTitleHeight);

            // Para páginas siguientes, ajustar startY
            if (pageNumber > 1) {
                data.settings.startY = otherPagesStartY;
            }

            addFooter(doc, pageNumber);
        },
        willDrawPage: (data) => {
            // Asegurar que las páginas siguientes usen el startY correcto
            if (pageNumber > 1) {
                data.settings.startY = otherPagesStartY;
            }
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

    doc.save("ListaManoObraProy.pdf");
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

        doc.setFontSize(9);
        const line4 = "Fecha: " + ObtenerFechaActualDMY();
        doc.text(line4, headerX, headerYStart + 10.7, { align: "right" });
    };

    // Agregar título de la obra (solo en primera página)
    const addObraTitle = (doc, pageNumber) => {
        if (pageNumber === 1) {
            const pageWidth = doc.internal.pageSize.width;
            const titleX = pageWidth / 2;
            const titleY = 45;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);

            const obraText = "Obra: " + datosProyecto.nombre;

            // Dividir el texto en líneas si es muy largo
            const maxWidth = pageWidth - 46; // 23mm de margen a cada lado
            const splitObraText = doc.splitTextToSize(obraText, maxWidth);

            doc.text(splitObraText, titleX, titleY, { align: "center" });

            // Retornar la altura ocupada por el texto de la obra
            return splitObraText.length * 5; // Aproximadamente 5mm por línea
        }
        return 0;
    };

    // Agregar título de la tabla
    const addTitle = (doc, pageNumber, obraTitleHeight) => {
        const pageWidth = doc.internal.pageSize.width;
        const titleX = pageWidth / 2;

        // Ajustar posición Y según si es primera página o no
        let titleY;
        if (pageNumber === 1) {
            titleY = 48 + obraTitleHeight;
        } else {
            titleY = 43; // Posición del título para páginas siguientes
        }
        doc.setTextColor(0, 142, 90);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const title = "Herramientas de mano de obra";
        doc.text(title, titleX, titleY, { align: "center" });

        return titleY;
    };

    // Agregar imagen
    const addImage = (doc) => {
        const imageUrl = urlImagenLogo;
        const marginLeft = 15;
        const marginTop = 15;
        const imageWidth = 45;
        const imageHeight = 15;

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    };

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

    let pageNumber = 0;
    let obraTitleHeight = 0;

    // Calcular la altura del título de la obra ANTES de crear la tabla
    const tempDoc = new jsPDF();
    const pageWidth = tempDoc.internal.pageSize.width;
    const maxWidth = pageWidth - 46;
    const splitObraText = tempDoc.splitTextToSize("Obra: " + datosProyecto.nombre, maxWidth);
    obraTitleHeight = splitObraText.length * 4;

    // Calcular startY para la primera página
    const firstPageStartY = 52 + obraTitleHeight;
    const otherPagesStartY = 53; // 43 (titleY) + 10 = 53

    // Generar la tabla y configurar estilos
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        margin: { top: 50, right: 23, bottom: 40, left: 23 },
        startY: firstPageStartY, // Posición inicial para la primera página
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
            0: { halign: 'left' },
            1: { halign: 'right' },
            2: { halign: 'right' },
            3: { halign: 'right' }
        },
        didDrawPage: (data) => {
            pageNumber += 1;

            addImage(doc);
            addHeader(doc);

            // Agregar título de la obra (solo primera página) y obtener su altura
            const currentObraTitleHeight = addObraTitle(doc, pageNumber);

            // Agregar título de la tabla con posición ajustada
            const titleY = addTitle(doc, pageNumber, currentObraTitleHeight);

            // Para páginas siguientes, ajustar startY
            if (pageNumber > 1) {
                data.settings.startY = otherPagesStartY;
            }

            addFooter(doc, pageNumber);
        },
        willDrawPage: (data) => {
            // Asegurar que las páginas siguientes usen el startY correcto
            if (pageNumber > 1) {
                data.settings.startY = otherPagesStartY;
            }
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

    doc.save("ListaHerramientasManoProy.pdf");
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

        doc.setFontSize(9);
        const line4 = "Fecha: " + ObtenerFechaActualDMY();
        doc.text(line4, headerX, headerYStart + 10.7, { align: "right" });
    };

    // Agregar título de la obra (solo en primera página)
    const addObraTitle = (doc, pageNumber) => {
        if (pageNumber === 1) {
            const pageWidth = doc.internal.pageSize.width;
            const titleX = pageWidth / 2;
            const titleY = 45;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);

            const obraText = "Obra: " + datosProyecto.nombre;

            // Dividir el texto en líneas si es muy largo
            const maxWidth = pageWidth - 46; // 23mm de margen a cada lado
            const splitObraText = doc.splitTextToSize(obraText, maxWidth);

            doc.text(splitObraText, titleX, titleY, { align: "center" });

            // Retornar la altura ocupada por el texto de la obra
            return splitObraText.length * 5; // Aproximadamente 5mm por línea
        }
        return 0;
    };

    // Agregar título de la tabla
    const addTitle = (doc, pageNumber, obraTitleHeight) => {
        const pageWidth = doc.internal.pageSize.width;
        const titleX = pageWidth / 2;

        // Ajustar posición Y según si es primera página o no
        let titleY;
        if (pageNumber === 1) {
            titleY = 48 + obraTitleHeight;
        } else {
            titleY = 43; // Posición del título para páginas siguientes
        }
        doc.setTextColor(0, 142, 90);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const title = "Equipo y seguridad";
        doc.text(title, titleX, titleY, { align: "center" });

        return titleY;
    };

    // Agregar imagen
    const addImage = (doc) => {
        const imageUrl = urlImagenLogo;
        const marginLeft = 15;
        const marginTop = 15;
        const imageWidth = 45;
        const imageHeight = 15;

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    };

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

    let pageNumber = 0;
    let obraTitleHeight = 0;

    // Calcular la altura del título de la obra ANTES de crear la tabla
    const tempDoc = new jsPDF();
    const pageWidth = tempDoc.internal.pageSize.width;
    const maxWidth = pageWidth - 46;
    const splitObraText = tempDoc.splitTextToSize("Obra: " + datosProyecto.nombre, maxWidth);
    obraTitleHeight = splitObraText.length * 4;

    // Calcular startY para la primera página
    const firstPageStartY = 52 + obraTitleHeight;
    const otherPagesStartY = 53; // 43 (titleY) + 10 = 53

    // Generar la tabla y configurar estilos
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        margin: { top: 50, right: 23, bottom: 40, left: 23 },
        startY: firstPageStartY, // Posición inicial para la primera página
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
            0: { halign: 'left' },
            1: { halign: 'right' },
            2: { halign: 'right' },
            3: { halign: 'right' }
        },
        didDrawPage: (data) => {
            pageNumber += 1;

            addImage(doc);
            addHeader(doc);

            // Agregar título de la obra (solo primera página) y obtener su altura
            const currentObraTitleHeight = addObraTitle(doc, pageNumber);

            // Agregar título de la tabla con posición ajustada
            const titleY = addTitle(doc, pageNumber, currentObraTitleHeight);

            // Para páginas siguientes, ajustar startY
            if (pageNumber > 1) {
                data.settings.startY = otherPagesStartY;
            }

            addFooter(doc, pageNumber);
        },
        willDrawPage: (data) => {
            // Asegurar que las páginas siguientes usen el startY correcto
            if (pageNumber > 1) {
                data.settings.startY = otherPagesStartY;
            }
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

    doc.save("ListaEquipoSeguridadProy.pdf");
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

        doc.setFontSize(9);
        const line4 = "Fecha: " + ObtenerFechaActualDMY();
        doc.text(line4, headerX, headerYStart + 10.7, { align: "right" });
    };

    // Agregar título de la obra (solo en primera página)
    const addObraTitle = (doc, pageNumber) => {
        if (pageNumber === 1) {
            const pageWidth = doc.internal.pageSize.width;
            const titleX = pageWidth / 2;
            const titleY = 45;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);

            const obraText = "Obra: " + datosProyecto.nombre;

            // Dividir el texto en líneas si es muy largo
            const maxWidth = pageWidth - 46; // 23mm de margen a cada lado
            const splitObraText = doc.splitTextToSize(obraText, maxWidth);

            doc.text(splitObraText, titleX, titleY, { align: "center" });

            // Retornar la altura ocupada por el texto de la obra
            return splitObraText.length * 5; // Aproximadamente 5mm por línea
        }
        return 0;
    };

    // Agregar título de la tabla
    const addTitle = (doc, pageNumber, obraTitleHeight) => {
        const pageWidth = doc.internal.pageSize.width;
        const titleX = pageWidth / 2;

        // Ajustar posición Y según si es primera página o no
        let titleY;
        if (pageNumber === 1) {
            titleY = 48 + obraTitleHeight;
        } else {
            titleY = 43; // Posición del título para páginas siguientes
        }
        doc.setTextColor(0, 142, 90);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const title = "Maquinarias";
        doc.text(title, titleX, titleY, { align: "center" });

        return titleY;
    };

    // Agregar imagen
    const addImage = (doc) => {
        const imageUrl = urlImagenLogo;
        const marginLeft = 15;
        const marginTop = 15;
        const imageWidth = 45;
        const imageHeight = 15;

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    };

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

    let pageNumber = 0;
    let obraTitleHeight = 0;

    // Calcular la altura del título de la obra ANTES de crear la tabla
    const tempDoc = new jsPDF();
    const pageWidth = tempDoc.internal.pageSize.width;
    const maxWidth = pageWidth - 46;
    const splitObraText = tempDoc.splitTextToSize("Obra: " + datosProyecto.nombre, maxWidth);
    obraTitleHeight = splitObraText.length * 4;

    // Calcular startY para la primera página
    const firstPageStartY = 52 + obraTitleHeight;
    const otherPagesStartY = 53; // 43 (titleY) + 10 = 53

    // Generar la tabla y configurar estilos
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        margin: { top: 50, right: 23, bottom: 40, left: 23 },
        startY: firstPageStartY, // Posición inicial para la primera página
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
            0: { halign: 'left' },
            1: { halign: 'justify' },
            2: { halign: 'left' },
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'right' }
        },
        didDrawPage: (data) => {
            pageNumber += 1;

            addImage(doc);
            addHeader(doc);

            // Agregar título de la obra (solo primera página) y obtener su altura
            const currentObraTitleHeight = addObraTitle(doc, pageNumber);

            // Agregar título de la tabla con posición ajustada
            const titleY = addTitle(doc, pageNumber, currentObraTitleHeight);

            // Para páginas siguientes, ajustar startY
            if (pageNumber > 1) {
                data.settings.startY = otherPagesStartY;
            }

            addFooter(doc, pageNumber);
        },
        willDrawPage: (data) => {
            // Asegurar que las páginas siguientes usen el startY correcto
            if (pageNumber > 1) {
                data.settings.startY = otherPagesStartY;
            }
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

    doc.save("ListaMaquinariasProy.pdf");
}

function ExportarPDFConceptos() {
    let total = document.getElementById("TotalSumaImporteConceptos").innerHTML;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tableBody = document.getElementById("table-bodyConceptos");
    const rows = tableBody.querySelectorAll("tr");

    // Determinar las columnas visibles
    const visibleColumns = ["No. concepto", "ID", "Nombre", "Unidad", "Cantidad"];
    if (showCostoDirecto) visibleColumns.push("Costo directo");
    if (showPrecioUnitario) visibleColumns.push("Precio unitario");
    if (showPUCantidad) visibleColumns.push("PU * Cantidad");

    const tableRows = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowData = [
            cells[0].innerText, // ID
            cells[1].innerText, // Nombre
            cells[2].innerText, // Unidad
            cells[3].innerText, // Cantidad
            cells[4].innerText, // Cantidad
        ];

        if (showCostoDirecto) rowData.push(cells[5].innerText); // Costo directo
        if (showPrecioUnitario) rowData.push(cells[6].innerText); // Precio unitario
        if (showPUCantidad) rowData.push(cells[7].innerText); // PU * Cantidad

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

        doc.setFontSize(9);
        const line4 = "Fecha: " + ObtenerFechaActualDMY();
        doc.text(line4, headerX, headerYStart + 10.7, { align: "right" });
    };

    // Agregar título de la obra (solo en primera página)
    const addObraTitle = (doc, pageNumber) => {
        if (pageNumber === 1) {
            const pageWidth = doc.internal.pageSize.width;
            const titleX = pageWidth / 2;
            const titleY = 45;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);

            const obraText = "Obra: " + datosProyecto.nombre;

            // Dividir el texto en líneas si es muy largo
            const maxWidth = pageWidth - 46; // 23mm de margen a cada lado
            const splitObraText = doc.splitTextToSize(obraText, maxWidth);

            doc.text(splitObraText, titleX, titleY, { align: "center" });

            // Retornar la altura ocupada por el texto de la obra
            return splitObraText.length * 5; // Aproximadamente 5mm por línea
        }
        return 0;
    };

    // Agregar título de la tabla
    const addTitle = (doc, pageNumber, obraTitleHeight) => {
        const pageWidth = doc.internal.pageSize.width;
        const titleX = pageWidth / 2;

        // Ajustar posición Y según si es primera página o no
        let titleY;
        if (pageNumber === 1) {
            titleY = 48 + obraTitleHeight;
        } else {
            titleY = 43; // Posición del título para páginas siguientes
        }
        doc.setTextColor(0, 142, 90);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const title = "Catalogo de conceptos";
        doc.text(title, titleX, titleY, { align: "center" });

        return titleY;
    };

    // Agregar imagen
    const addImage = (doc) => {
        const imageUrl = urlImagenLogo;
        const marginLeft = 15;
        const marginTop = 15;
        const imageWidth = 45;
        const imageHeight = 15;

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    };

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

    let pageNumber = 0;
    let obraTitleHeight = 0;

    // Calcular la altura del título de la obra ANTES de crear la tabla
    const tempDoc = new jsPDF();
    const pageWidth = tempDoc.internal.pageSize.width;
    const maxWidth = pageWidth - 46;
    const splitObraText = tempDoc.splitTextToSize("Obra: " + datosProyecto.nombre, maxWidth);
    obraTitleHeight = splitObraText.length * 4;

    // Calcular startY para la primera página
    const firstPageStartY = 52 + obraTitleHeight;
    const otherPagesStartY = 53; // 43 (titleY) + 10 = 53

    // Generar la tabla y configurar estilos
    doc.autoTable({
        head: [visibleColumns],
        body: tableRows,
        margin: { top: 50, right: 23, bottom: 40, left: 23 },
        startY: firstPageStartY, // Posición inicial para la primera página
        headStyles: {
            fillColor: "#008e5a",
            textColor: "#FFFFFF",
            fontStyle: "bold",
            fontSize: 8,
        },
        bodyStyles: {
            font: "helvetica",
            fontStyle: "normal",
            fontSize: 7,
        },
        columnStyles: {
            0: { halign: 'right' },
            1: { halign: 'left' },
            2: { halign: 'justify' },
            3: { halign: 'left' },
            4: { halign: 'right' },
            5: { halign: 'right' },
            6: { halign: 'right' },
            7: { halign: 'right' }
        },
        didDrawPage: (data) => {
            pageNumber += 1;

            addImage(doc);
            addHeader(doc);

            // Agregar título de la obra (solo primera página) y obtener su altura
            const currentObraTitleHeight = addObraTitle(doc, pageNumber);

            // Agregar título de la tabla con posición ajustada
            const titleY = addTitle(doc, pageNumber, currentObraTitleHeight);

            // Para páginas siguientes, ajustar startY
            if (pageNumber > 1) {
                data.settings.startY = otherPagesStartY;
            }

            addFooter(doc, pageNumber);
        },
        willDrawPage: (data) => {
            // Asegurar que las páginas siguientes usen el startY correcto
            if (pageNumber > 1) {
                data.settings.startY = otherPagesStartY;
            }
        },
        didDrawCell: (data) => {
            if (data.section === 'body' && data.row.index === tableRows.length - 1 && showPUCantidad) {
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

    doc.save("ListaConceptosProy.pdf");
}

async function exportarPDFConHtml(conc) {
    // Mostrar el contenedor de progreso

    document.getElementById("divCargaExport").style.display = "flex";
    document.getElementById("porcentajeExportacion").textContent = "0% - Exportando a PDF...";

    precionadoBtnExportarPdf();

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'letter');
    const container = document.getElementById('contenedor-cfe');

    if (!container) {
        console.error('Contenedor "contenedor-cfe" no encontrado');
        document.getElementById("divCargaExport").style.display = "none";
        return;
    }

    // Configurar el contenedor temporalmente visible
    container.style.display = 'block';
    container.style.position = 'absolute';
    container.style.left = '-9999px';

    const tarjetas = container.getElementsByClassName('tarjeta-concepto');
    const marginX = 2 * 28.35; // 2.3 cm en puntos
    const marginY = 4.5 * 22; // 4.5 cm en puntos
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - 2 * marginX;
    const contentHeight = pageHeight - 2 * marginY;

    // Función para actualizar el progreso
    function actualizarProgreso(procesadas, total) {
        const porcentaje = Math.round((procesadas / total) * 100);
        document.getElementById("porcentajeExportacion").textContent = `Exportando a PDF ${porcentaje}%`;
    }
    for (let i = 0; i < tarjetas.length; i++) {
        const tarjeta = tarjetas[i];

        // Actualizar progreso antes de procesar cada tarjeta

        actualizarProgreso(i, tarjetas.length);

        // Usar html2canvas con escala reducida
        await html2canvas(tarjeta, { scale: 0.8 }).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg', 0.6); // JPEG con calidad 60%
            const imgWidth = contentWidth;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let position = marginY;

            if (i > 0) {
                doc.addPage();
            }

            addHeader(doc, conc);
            addImage(doc);

            // Agregar imagen con compresión rápida
            doc.addImage(imgData, 'PNG', marginX, position, imgWidth, imgHeight, null, 'FAST');
        });
    }

    // Actualizar al 100% antes de guardar

    actualizarProgreso(tarjetas.length, tarjetas.length);

    // Restaurar los estilos originales del contenedor
    container.style.display = 'none';
    container.style.position = '';
    container.style.left = '';



    // Obtener el número total de páginas
    const totalPages = doc.internal.getNumberOfPages();

    // Agregar pie de página a cada página
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addFooter(doc, i, totalPages);
    }

    doc.save('TarjetaPrecioUnitario.pdf');


    setTimeout(() => {
        let btn = document.getElementById("btnExportarPDF");
        btn.removeAttribute("disabled");
        btn.classList.remove("btnClickeadoExportar");

        let btnExcel = document.getElementById("btnExportar");
        btnExcel.removeAttribute("disabled");
        btnExcel.classList.remove("btnClickeadoExportar");
        document.getElementById("divCargaExport").style.display = "none";
    }, 1000);

    // Ocultar el contenedor de progreso después de completar

}


const addHeader = (doc, conc) => {
    const pageWidth = doc.internal.pageSize.width;
    const marginRight = 1.5 * 28.35;
    const headerX = pageWidth - marginRight;
    const headerYStart = 50;

    doc.setTextColor(0, 142, 90);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("División de Distribución Jalisco", headerX, headerYStart, { align: "right" });

    doc.setFontSize(9);
    const line3 = "Departamento de Planeación, Proyectos y Construcción";
    doc.text(line3, headerX, headerYStart + 10, { align: "right" });

    if (!conc) {
        doc.setFontSize(10);
        doc.text("Zona " + datosProyecto.zona, headerX, headerYStart + 20, { align: "right" });
    }
};

// Pie de página centrado
const addFooter = (doc, pageNumber, totalPages) => {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const footerY = pageHeight - 20;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const pageText = `Página ${pageNumber} de ${totalPages}`;
    const textWidth = doc.getTextWidth(pageText);

    doc.text(pageText, (pageWidth - textWidth) / 2, footerY);
};

// Agregar imagen optimizada
const addImage = (doc) => {
    const imageUrl = urlImagenLogo; // Asegúrate de que el logo esté en JPEG comprimido
    const marginLeft = 1.5 * 28.35;
    const marginTop = 1.5 * 28.35;
    const imageWidth = 135;
    const imageHeight = 45;

    doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight, null, 'FAST');
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
    const imageUrl = urlImagenLogo; // Asegúrate de que la ruta sea válida
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
    worksheet.mergeCells("B1:E1");
    const cen1 = worksheet.getCell("B1");
    cen1.value = "División de Distribución Jalisco";
    cen1.font = { bold: true, size: 15, color: { argb: "#000" } };
    cen1.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("F1:G1");
    const line1 = worksheet.getCell("F1");
    line1.value = "División de Distribución Jalisco";
    line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
    line1.alignment = { horizontal: "right", vertical: "middle" };

    //****************************************************************** */
    worksheet.mergeCells("B2:E2");
    const cen2 = worksheet.getCell("B2");
    cen2.value = "Subgerencia de Distribución";
    cen2.font = { bold: true, size: 15, color: { argb: "#000" } };
    cen2.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("F2:G2");
    const line2 = worksheet.getCell("F2");
    line2.value = "Zona " + datosProyecto.zona; // Asegúrate de que `datosProyecto.zona` esté definido
    line2.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
    line2.alignment = { horizontal: "right", vertical: "middle" };
    //****************************************************************** */
    worksheet.mergeCells("B3:E3");
    const cen3 = worksheet.getCell("B3");
    cen3.value = "Departamento Divisional de Planeación";
    cen3.font = { bold: true, size: 13, color: { argb: "#000" } };
    cen3.alignment = { horizontal: "center", vertical: "middle" };
    //---------------------------------------------------------------- */   
    worksheet.mergeCells("A4");
    const cen4 = worksheet.getCell("A4");
    cen4.value = "Obra:";
    cen4.font = { size: 12, color: { argb: "#000" } };
    cen4.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("B4:E4");
    const lincen4 = worksheet.getCell("B4");
    lincen4.value = datosProyecto.nombre;
    lincen4.font = { bold: true, size: 12, color: { argb: "#000" } };
    lincen4.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true // ← Ajustar texto
    };

    worksheet.mergeCells("F3:G4");
    const line3 = worksheet.getCell("F3");
    line3.value = "Departamento de Planeación, Proyectos y Construcción";
    line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
    line3.alignment = {
        horizontal: "right",
        vertical: "middle",
        wrapText: true // ← Ajustar texto
    };
    //****************************************************************** */
    worksheet.mergeCells("A5:E5");
    const cellFecha = worksheet.getCell("A5");
    cellFecha.value = "Fecha:";
    cellFecha.font = { size: 10, color: { argb: "#000" } };
    cellFecha.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("F5:G5");
    const cellFechaD = worksheet.getCell("F5");
    cellFechaD.value = ObtenerFechaActualDMY();
    cellFechaD.font = { size: 10, color: { argb: "#000" } };
    cellFechaD.alignment = { horizontal: "center", vertical: "middle" };
    //****************************************************************** */
    // Agregar título
    worksheet.mergeCells("A6:G6");
    const titleCell = worksheet.getCell("A6");
    titleCell.value = "Materiales suminitrados por CFE";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    //****************************************************************** */

    // Agregar encabezados
    const headers = ["No.", "ID", "Descripción", "Unidad", "Precio U", "Cantidad", "Importe"];
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

        // Insertar número autoincremental al inicio del arreglo
        rowData.unshift(rowIndex + 1); // ← aquí agregamos el número (1, 2, 3, ...)

        // Agregar una fila al Excel
        const excelRow = worksheet.addRow(rowData);

        // Aplicar color alterno a las filas
        excelRow.eachCell((cell, colNumber) => {
            // Configuración de alineación según la columna
            switch (colNumber) {
                case 2: // ID
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 3: // Descripción
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 4: // Unidad
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 5: // Precio U
                case 6: // Cantidad
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

    worksheet.columns = [
        { key: "no", width: 10 },      // Columna "No."
        { key: "id", width: 10 },     // Columna "ID"
        { key: "descripcion", width: 45 }, // Columna "Descripción"
        { key: "unidad", width: 12 },  // Columna "Unidad"
        { key: "precioU", width: 15 }, // Columna "Precio U"
        { key: "cantidad", width: 12 }, // Columna "Cantidad"
        { key: "importe", width: 18 },  // Columna "Importe"
    ];




    // Agregar total como última fila
    const total = document.getElementById("TotalSumaMaterialesSi").innerHTML;

    // Agregar la fila del total
    const totalRow = worksheet.addRow(["Total", "", "", "", "", "Total", total]);
    const lastRowNumber = totalRow.number;
    worksheet.mergeCells(`A${lastRowNumber}:F${lastRowNumber}`);

    // Aplicar formato a todas las celdas de la fila
    totalRow.eachCell((cell, colNumber) => {
        // Negritas para toda la fila
        cell.font = { bold: true };

        // Bordes alrededor de la fila completa
        //borde grueso
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin", }
        };

        // Alineación personalizada según la columna
        if (colNumber === 6) { // Columna "Total"
            cell.alignment = { horizontal: "right", vertical: "middle" };
        } else if (colNumber === 7) { // Columna "Importe total"
            cell.alignment = { horizontal: "right", vertical: "middle" };
        } else {
            cell.alignment = { horizontal: "center", vertical: "middle" };
        }
    });

    // Descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ListaMaterialesSuministradoCFEProy.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function ExportarExcelMaterialesNo() {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Materiales No Suministrados");

    // Cargar la imagen como base64
    const imageUrl = urlImagenLogo; // Asegúrate de que la ruta sea válida
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
    worksheet.mergeCells("B1:E1");
    const cen1 = worksheet.getCell("B1");
    cen1.value = "División de Distribución Jalisco";
    cen1.font = { bold: true, size: 15, color: { argb: "#000" } };
    cen1.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("F1:G1");
    const line1 = worksheet.getCell("F1");
    line1.value = "División de Distribución Jalisco";
    line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
    line1.alignment = { horizontal: "right", vertical: "middle" };

    //****************************************************************** */
    worksheet.mergeCells("B2:E2");
    const cen2 = worksheet.getCell("B2");
    cen2.value = "Subgerencia de Distribución";
    cen2.font = { bold: true, size: 15, color: { argb: "#000" } };
    cen2.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("F2:G2");
    const line2 = worksheet.getCell("F2");
    line2.value = "Zona " + datosProyecto.zona; // Asegúrate de que `datosProyecto.zona` esté definido
    line2.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
    line2.alignment = { horizontal: "right", vertical: "middle" };
    //****************************************************************** */
    worksheet.mergeCells("B3:E3");
    const cen3 = worksheet.getCell("B3");
    cen3.value = "Departamento Divisional de Planeación";
    cen3.font = { bold: true, size: 13, color: { argb: "#000" } };
    cen3.alignment = { horizontal: "center", vertical: "middle" };
    //---------------------------------------------------------------- */   
    worksheet.mergeCells("A4");
    const cen4 = worksheet.getCell("A4");
    cen4.value = "Obra:";
    cen4.font = { size: 12, color: { argb: "#000" } };
    cen4.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("B4:E4");
    const lincen4 = worksheet.getCell("B4");
    lincen4.value = datosProyecto.nombre;
    lincen4.font = { bold: true, size: 12, color: { argb: "#000" } };
    lincen4.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true // ← Ajustar texto
    };

    worksheet.mergeCells("F3:G4");
    const line3 = worksheet.getCell("F3");
    line3.value = "Departamento de Planeación, Proyectos y Construcción";
    line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
    line3.alignment = {
        horizontal: "right",
        vertical: "middle",
        wrapText: true // ← Ajustar texto
    };
    //****************************************************************** */
    worksheet.mergeCells("A5:E5");
    const cellFecha = worksheet.getCell("A5");
    cellFecha.value = "Fecha:";
    cellFecha.font = { size: 10, color: { argb: "#000" } };
    cellFecha.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("F5:G5");
    const cellFechaD = worksheet.getCell("F5");
    cellFechaD.value = ObtenerFechaActualDMY();
    cellFechaD.font = { size: 10, color: { argb: "#000" } };
    cellFechaD.alignment = { horizontal: "center", vertical: "middle" };
    //****************************************************************** */
    // Agregar título
    worksheet.mergeCells("A6:G6");
    const titleCell = worksheet.getCell("A6");
    titleCell.value = "Materiales a suministrar por el contratista";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    //****************************************************************** */





    // Agregar encabezados
    const headers = ["No.", "ID", "Descripción", "Unidad", "Precio U", "Cantidad", "Importe"];
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

        // Insertar número autoincremental al inicio del arreglo
        rowData.unshift(rowIndex + 1); // ← aquí agregamos el número (1, 2, 3, ...)

        // Agregar una fila al Excel
        const excelRow = worksheet.addRow(rowData);

        // Aplicar color alterno a las filas
        excelRow.eachCell((cell, colNumber) => {
            // Configuración de alineación según la columna
            switch (colNumber) {
                case 2: // ID
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    break;
                case 3: // Descripción
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 4: // Unidad
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                case 5: // Precio U
                case 6: // Cantidad
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

    worksheet.columns = [
        { key: "no", width: 10 },      // Columna "No."
        { key: "id", width: 10 },     // Columna "ID"
        { key: "descripcion", width: 45 }, // Columna "Descripción"
        { key: "unidad", width: 12 },  // Columna "Unidad"
        { key: "precioU", width: 15 }, // Columna "Precio U"
        { key: "cantidad", width: 12 }, // Columna "Cantidad"
        { key: "importe", width: 18 },  // Columna "Importe"
    ];





    // Agregar total como última fila
    const total = document.getElementById("TotalSumaMaterialesNo").innerHTML;

    // Agregar la fila del total
    const totalRow = worksheet.addRow(["Total", "", "", "", "", "Total", total]);
    const lastRowNumber = totalRow.number;
    worksheet.mergeCells(`A${lastRowNumber}:F${lastRowNumber}`);

    // Aplicar formato a todas las celdas de la fila
    totalRow.eachCell((cell, colNumber) => {
        // Negritas para toda la fila
        cell.font = { bold: true };

        // Bordes alrededor de la fila completa
        //borde grueso
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin", }
        };

        // Alineación personalizada según la columna
        if (colNumber === 6) { // Columna "Total"
            cell.alignment = { horizontal: "right", vertical: "middle" };
        } else if (colNumber === 7) { // Columna "Importe total"
            cell.alignment = { horizontal: "right", vertical: "middle" };
        } else {
            cell.alignment = { horizontal: "center", vertical: "middle" };
        }
    });

    // Ajustar el ancho de las columnas automáticamente

    // Descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ListaMaterialesSuministradoContratistaProy.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


async function ExportarExcelManoObra() {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Mano de Obra");

    // Cargar la imagen como base64
    const imageUrl = urlImagenLogo; // Asegúrate de que la ruta sea válida
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
    worksheet.mergeCells("B1:E1");
    const cen1 = worksheet.getCell("B1");
    cen1.value = "División de Distribución Jalisco";
    cen1.font = { bold: true, size: 15, color: { argb: "#000" } };
    cen1.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("F1:G1");
    const line1 = worksheet.getCell("F1");
    line1.value = "División de Distribución Jalisco";
    line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
    line1.alignment = { horizontal: "right", vertical: "middle" };

    //****************************************************************** */
    worksheet.mergeCells("B2:E2");
    const cen2 = worksheet.getCell("B2");
    cen2.value = "Subgerencia de Distribución";
    cen2.font = { bold: true, size: 15, color: { argb: "#000" } };
    cen2.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("F2:G2");
    const line2 = worksheet.getCell("F2");
    line2.value = "Zona " + datosProyecto.zona; // Asegúrate de que `datosProyecto.zona` esté definido
    line2.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
    line2.alignment = { horizontal: "right", vertical: "middle" };
    //****************************************************************** */
    worksheet.mergeCells("B3:E3");
    const cen3 = worksheet.getCell("B3");
    cen3.value = "Departamento Divisional de Planeación";
    cen3.font = { bold: true, size: 13, color: { argb: "#000" } };
    cen3.alignment = { horizontal: "center", vertical: "middle" };
    //---------------------------------------------------------------- */   
    worksheet.mergeCells("A4");
    const cen4 = worksheet.getCell("A4");
    cen4.value = "Obra:";
    cen4.font = { size: 12, color: { argb: "#000" } };
    cen4.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("B4:E4");
    const lincen4 = worksheet.getCell("B4");
    lincen4.value = datosProyecto.nombre;
    lincen4.font = { bold: true, size: 12, color: { argb: "#000" } };
    lincen4.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true // ← Ajustar texto
    };

    worksheet.mergeCells("F3:G4");
    const line3 = worksheet.getCell("F3");
    line3.value = "Departamento de Planeación, Proyectos y Construcción";
    line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
    line3.alignment = {
        horizontal: "right",
        vertical: "middle",
        wrapText: true // ← Ajustar texto
    };
    //****************************************************************** */
    worksheet.mergeCells("A5:E5");
    const cellFecha = worksheet.getCell("A5");
    cellFecha.value = "Fecha:";
    cellFecha.font = { size: 10, color: { argb: "#000" } };
    cellFecha.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("F5:G5");
    const cellFechaD = worksheet.getCell("F5");
    cellFechaD.value = ObtenerFechaActualDMY();
    cellFechaD.font = { size: 10, color: { argb: "#000" } };
    cellFechaD.alignment = { horizontal: "center", vertical: "middle" };
    //****************************************************************** */
    // Agregar título
    worksheet.mergeCells("A6:G6");
    const titleCell = worksheet.getCell("A6");
    titleCell.value = "Mano de obra";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    //****************************************************************** */


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
                    cell.alignment = { horizontal: "left", vertical: "middle" };
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
    // Agregar la fila del total
    const totalRow = worksheet.addRow(["Total", "", "", "", "", "Total", total]);
    const lastRowNumber = totalRow.number;
    worksheet.mergeCells(`A${lastRowNumber}:F${lastRowNumber}`);

    // Aplicar formato a todas las celdas de la fila
    totalRow.eachCell((cell, colNumber) => {
        // Negritas para toda la fila
        cell.font = { bold: true };

        // Bordes alrededor de la fila completa
        //borde grueso
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin", }
        };

        // Alineación personalizada según la columna
        if (colNumber === 6) { // Columna "Total"
            cell.alignment = { horizontal: "right", vertical: "middle" };
        } else if (colNumber === 7) { // Columna "Importe total"
            cell.alignment = { horizontal: "right", vertical: "middle" };
        } else {
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
    link.download = "ListaManoObrasProy.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


async function ExportarExcelHerramientasMano() {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Herramientas de Mano");

    // Cargar la imagen como base64
    const imageUrl = urlImagenLogo; // Asegúrate de que la ruta sea válida
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
    worksheet.mergeCells("B1:C1");
    const cen1 = worksheet.getCell("B1");
    cen1.value = "División de Distribución Jalisco";
    cen1.font = { bold: true, size: 15, color: { argb: "#000" } };
    cen1.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("D1");
    const line1 = worksheet.getCell("D1");
    line1.value = "División de Distribución Jalisco";
    line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
    line1.alignment = { horizontal: "right", vertical: "middle" };

    //****************************************************************** */
    worksheet.mergeCells("B2:C2");
    const cen2 = worksheet.getCell("B2");
    cen2.value = "Subgerencia de Distribución";
    cen2.font = { bold: true, size: 15, color: { argb: "#000" } };
    cen2.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("D2");
    const line2 = worksheet.getCell("D2");
    line2.value = "Zona " + datosProyecto.zona; // Asegúrate de que `datosProyecto.zona` esté definido
    line2.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
    line2.alignment = { horizontal: "right", vertical: "middle" };
    //****************************************************************** */
    worksheet.mergeCells("B3:C3");
    const cen3 = worksheet.getCell("B3");
    cen3.value = "Departamento Divisional de Planeación";
    cen3.font = { bold: true, size: 13, color: { argb: "#000" } };
    cen3.alignment = { horizontal: "center", vertical: "middle" };
    //---------------------------------------------------------------- */   
    worksheet.mergeCells("A4");
    const cen4 = worksheet.getCell("A4");
    cen4.value = "Obra:";
    cen4.font = { size: 12, color: { argb: "#000" } };
    cen4.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("B4:C4");
    const lincen4 = worksheet.getCell("B4");
    lincen4.value = datosProyecto.nombre;
    lincen4.font = { bold: true, size: 12, color: { argb: "#000" } };
    lincen4.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true // ← Ajustar texto
    };

    worksheet.mergeCells("D3:D4");
    const line3 = worksheet.getCell("D3");
    line3.value = "Departamento de Planeación, Proyectos y Construcción";
    line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
    line3.alignment = {
        horizontal: "right",
        vertical: "middle",
        wrapText: true // ← Ajustar texto
    };
    //****************************************************************** */
    worksheet.mergeCells("A5:C5");
    const cellFecha = worksheet.getCell("A5");
    cellFecha.value = "Fecha:";
    cellFecha.font = { size: 10, color: { argb: "#000" } };
    cellFecha.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("D5");
    const cellFechaD = worksheet.getCell("D5");
    cellFechaD.value = ObtenerFechaActualDMY();
    cellFechaD.font = { size: 10, color: { argb: "#000" } };
    cellFechaD.alignment = { horizontal: "center", vertical: "middle" };
    //****************************************************************** */
    // Agregar título
    worksheet.mergeCells("A6:D6");
    const titleCell = worksheet.getCell("A6");
    titleCell.value = "Herramientas de mano de obra";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    //****************************************************************** */

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
    const totalRow = worksheet.addRow(["Total", "", "Total", total]);
    const lastRowNumber = totalRow.number;
    worksheet.mergeCells(`A${lastRowNumber}:C${lastRowNumber}`);

    // Aplicar formato a todas las celdas de la fila
    totalRow.eachCell((cell, colNumber) => {
        // Negritas para toda la fila
        cell.font = { bold: true };

        // Bordes alrededor de la fila completa
        //borde grueso
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin", }
        };

        // Alineación personalizada según la columna
        if (colNumber === 3) { // Columna "Total"
            cell.alignment = { horizontal: "right", vertical: "middle" };
        } else if (colNumber === 4) { // Columna "Importe total"
            cell.alignment = { horizontal: "right", vertical: "middle" };
        } else {
            cell.alignment = { horizontal: "center", vertical: "middle" };
        }
    });

    // Ajustar el ancho de las columnas manualmente
    worksheet.columns = [
        { key: 'Descripción', width: 25 },
        { key: 'Kh', width: 20 },
        { key: 'Mano de obra', width: 25 },
        { key: 'Importe', width: 30 }
    ];

    // Descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ListaHerramientasMano.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


async function ExportarExcelEquipoSeguridad() {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Equipo y Seguridad");

    // Cargar la imagen como base64
    const imageUrl = urlImagenLogo; // Asegúrate de que la ruta sea válida
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
    worksheet.mergeCells("B1:C1");
    const cen1 = worksheet.getCell("B1");
    cen1.value = "División de Distribución Jalisco";
    cen1.font = { bold: true, size: 15, color: { argb: "#000" } };
    cen1.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("D1");
    const line1 = worksheet.getCell("D1");
    line1.value = "División de Distribución Jalisco";
    line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
    line1.alignment = { horizontal: "right", vertical: "middle" };

    //****************************************************************** */
    worksheet.mergeCells("B2:C2");
    const cen2 = worksheet.getCell("B2");
    cen2.value = "Subgerencia de Distribución";
    cen2.font = { bold: true, size: 15, color: { argb: "#000" } };
    cen2.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("D2");
    const line2 = worksheet.getCell("D2");
    line2.value = "Zona " + datosProyecto.zona; // Asegúrate de que `datosProyecto.zona` esté definido
    line2.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
    line2.alignment = { horizontal: "right", vertical: "middle" };
    //****************************************************************** */
    worksheet.mergeCells("B3:C3");
    const cen3 = worksheet.getCell("B3");
    cen3.value = "Departamento Divisional de Planeación";
    cen3.font = { bold: true, size: 13, color: { argb: "#000" } };
    cen3.alignment = { horizontal: "center", vertical: "middle" };
    //---------------------------------------------------------------- */   
    worksheet.mergeCells("A4");
    const cen4 = worksheet.getCell("A4");
    cen4.value = "Obra:";
    cen4.font = { size: 12, color: { argb: "#000" } };
    cen4.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("B4:C4");
    const lincen4 = worksheet.getCell("B4");
    lincen4.value = datosProyecto.nombre;
    lincen4.font = { bold: true, size: 12, color: { argb: "#000" } };
    lincen4.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true // ← Ajustar texto
    };

    worksheet.mergeCells("D3:D4");
    const line3 = worksheet.getCell("D3");
    line3.value = "Departamento de Planeación, Proyectos y Construcción";
    line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
    line3.alignment = {
        horizontal: "right",
        vertical: "middle",
        wrapText: true // ← Ajustar texto
    };
    //****************************************************************** */
    worksheet.mergeCells("A5:C5");
    const cellFecha = worksheet.getCell("A5");
    cellFecha.value = "Fecha:";
    cellFecha.font = { size: 10, color: { argb: "#000" } };
    cellFecha.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("D5");
    const cellFechaD = worksheet.getCell("D5");
    cellFechaD.value = ObtenerFechaActualDMY();
    cellFechaD.font = { size: 10, color: { argb: "#000" } };
    cellFechaD.alignment = { horizontal: "center", vertical: "middle" };
    //****************************************************************** */
    // Agregar título
    worksheet.mergeCells("A6:D6");
    const titleCell = worksheet.getCell("A6");
    titleCell.value = "Equipo y seguridad";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    //****************************************************************** */


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
    const totalRow = worksheet.addRow(["Total", "", "Total", total]);
    const lastRowNumber = totalRow.number;
    worksheet.mergeCells(`A${lastRowNumber}:C${lastRowNumber}`);

    // Aplicar formato a todas las celdas de la fila
    totalRow.eachCell((cell, colNumber) => {
        // Negritas para toda la fila
        cell.font = { bold: true };

        // Bordes alrededor de la fila completa
        //borde grueso
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin", }
        };

        // Alineación personalizada según la columna
        if (colNumber === 3) { // Columna "Total"
            cell.alignment = { horizontal: "right", vertical: "middle" };
        } else if (colNumber === 4) { // Columna "Importe total"
            cell.alignment = { horizontal: "right", vertical: "middle" };
        } else {
            cell.alignment = { horizontal: "center", vertical: "middle" };
        }
    });

    // Ajustar el ancho de las columnas manualmente
    worksheet.columns = [
        { key: 'Descripción', width: 30 },
        { key: 'Ks', width: 20 },
        { key: 'Mano de obra', width: 25 },
        { key: 'Importe', width: 30 }
    ];

    // Descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ListaEquipoSeguridad.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function ExportarExcelMaquinarias() {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Maquinarias");

    // Cargar la imagen como base64
    const imageUrl = urlImagenLogo; // Asegúrate de que la ruta sea válida
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
    // Agregar encabezado
    worksheet.mergeCells("A1:D1");
    const cen1 = worksheet.getCell("A1");
    cen1.value = "División de Distribución Jalisco";
    cen1.font = { bold: true, size: 15, color: { argb: "#000" } };
    cen1.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("E1:F1");
    const line1 = worksheet.getCell("E1");
    line1.value = "División de Distribución Jalisco";
    line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
    line1.alignment = { horizontal: "right", vertical: "middle" };

    //****************************************************************** */
    worksheet.mergeCells("A2:D2");
    const cen2 = worksheet.getCell("A2");
    cen2.value = "Subgerencia de Distribución";
    cen2.font = { bold: true, size: 15, color: { argb: "#000" } };
    cen2.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("E2:F2");
    const line2 = worksheet.getCell("E2");
    line2.value = "Zona " + datosProyecto.zona; // Asegúrate de que `datosProyecto.zona` esté definido
    line2.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
    line2.alignment = { horizontal: "right", vertical: "middle" };
    //****************************************************************** */
    worksheet.mergeCells("A3:D3");
    const cen3 = worksheet.getCell("A3");
    cen3.value = "Departamento Divisional de Planeación";
    cen3.font = { bold: true, size: 13, color: { argb: "#000" } };
    cen3.alignment = { horizontal: "center", vertical: "middle" };
    //---------------------------------------------------------------- */   
    worksheet.mergeCells("A4");
    const cen4 = worksheet.getCell("A4");
    cen4.value = "Obra:";
    cen4.font = { size: 12, color: { argb: "#000" } };
    cen4.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("B4:D4");
    const lincen4 = worksheet.getCell("B4");
    lincen4.value = datosProyecto.nombre;
    lincen4.font = { bold: true, size: 12, color: { argb: "#000" } };
    lincen4.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true // ← Ajustar texto
    };

    worksheet.mergeCells("E3:F4");
    const line3 = worksheet.getCell("E3");
    line3.value = "Departamento de Planeación, Proyectos y Construcción";
    line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
    line3.alignment = {
        horizontal: "right",
        vertical: "middle",
        wrapText: true // ← Ajustar texto
    };
    //****************************************************************** */
    worksheet.mergeCells("A5:D5");
    const cellFecha = worksheet.getCell("A5");
    cellFecha.value = "Fecha:";
    cellFecha.font = { size: 10, color: { argb: "#000" } };
    cellFecha.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("E5:F5");
    const cellFechaD = worksheet.getCell("F5");
    cellFechaD.value = ObtenerFechaActualDMY();
    cellFechaD.font = { size: 10, color: { argb: "#000" } };
    cellFechaD.alignment = { horizontal: "center", vertical: "middle" };
    //****************************************************************** */
    // Agregar título
    worksheet.mergeCells("A6:F6");
    const titleCell = worksheet.getCell("A6");
    titleCell.value = "Maquinarias";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    //****************************************************************** */

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
                    cell.alignment = { horizontal: "left", vertical: "middle" };
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
    // Agregar la fila del total
    const totalRow = worksheet.addRow(["Total", "", "", "", "Total", total]);
    const lastRowNumber = totalRow.number;
    worksheet.mergeCells(`A${lastRowNumber}:E${lastRowNumber}`);

    // Aplicar formato a todas las celdas de la fila
    totalRow.eachCell((cell, colNumber) => {
        // Negritas para toda la fila
        cell.font = { bold: true };

        // Bordes alrededor de la fila completa
        //borde grueso
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin", }
        };

        // Alineación personalizada según la columna
        if (colNumber === 5) { // Columna "Total"
            cell.alignment = { horizontal: "right", vertical: "middle" };
        } else if (colNumber === 6) { // Columna "Importe total"
            cell.alignment = { horizontal: "right", vertical: "middle" };
        } else {
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
    link.download = "ListaMaquinariasProy.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
async function ExportarExcelConceptosProyecto() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Conceptos");

    // --- Cargar logo ---
    const imageUrl = urlImagenLogo;
    const imageBase64 = await fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        }));

    const imageId = workbook.addImage({
        base64: imageBase64.split(",")[1],
        extension: "png",
    });

    worksheet.addImage(imageId, {
        tl: { col: 0.2, row: 0.2 },
        ext: { width: 150, height: 50 },
    });

    // --- Determinar columnas visibles ---
    const visibleColumns = [];
    if (showCostoDirecto) visibleColumns.push("Costo directo");
    if (showPrecioUnitario) visibleColumns.push("Precio unitario");
    if (showPUCantidad) visibleColumns.push("PU * Cantidad");

    // --- Función para convertir número de columna a letra Excel ---
    function getExcelColumnLetter(colNumber) {
        let letter = "";
        while (colNumber > 0) {
            let remainder = (colNumber - 1) % 26;
            letter = String.fromCharCode(65 + remainder) + letter;
            colNumber = Math.floor((colNumber - 1) / 26);
        }
        return letter;
    }

    // --- Calcular última columna dinámica ---
    const endColIndex = 5 + visibleColumns.length; // A=1
    const endColLetter = getExcelColumnLetter(endColIndex);

    // ******************************************************************
    // ENCABEZADO - VERSIÓN SIMPLIFICADA SIN CONFLICTOS DE MERGE
    // ******************************************************************

    // CONTENIDO PRINCIPAL - ajustar según si hay columnas visibles o no
    if (visibleColumns.length > 0) {
        // CON columnas visibles: contenido principal abarca B-E
        worksheet.mergeCells(`B1:E1`);
        const cen1 = worksheet.getCell("B1");
        cen1.value = "División de Distribución Jalisco";
        cen1.font = { bold: true, size: 15, color: { argb: "#000" } };
        cen1.alignment = { horizontal: "center", vertical: "middle" };

        worksheet.mergeCells(`B2:E2`);
        const cen2 = worksheet.getCell("B2");
        cen2.value = "Subgerencia de Distribución";
        cen2.font = { bold: true, size: 15, color: { argb: "#000" } };
        cen2.alignment = { horizontal: "center", vertical: "middle" };

        worksheet.mergeCells(`B3:E3`);
        const cen3 = worksheet.getCell("B3");
        cen3.value = "Departamento Divisional de Planeación";
        cen3.font = { bold: true, size: 13, color: { argb: "#000" } };
        cen3.alignment = { horizontal: "center", vertical: "middle" };

        worksheet.mergeCells(`B4:E4`);
        const lincen4 = worksheet.getCell("B4");
        lincen4.value = datosProyecto.nombre;
        lincen4.font = { bold: true, size: 12, color: { argb: "#000" } };
        lincen4.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    } else {
        // SIN columnas visibles: contenido principal abarca B-D (una columna menos)
        worksheet.mergeCells(`B1:D1`);
        const cen1 = worksheet.getCell("B1");
        cen1.value = "División de Distribución Jalisco";
        cen1.font = { bold: true, size: 15, color: { argb: "#000" } };
        cen1.alignment = { horizontal: "center", vertical: "middle" };

        worksheet.mergeCells(`B2:D2`);
        const cen2 = worksheet.getCell("B2");
        cen2.value = "Subgerencia de Distribución";
        cen2.font = { bold: true, size: 15, color: { argb: "#000" } };
        cen2.alignment = { horizontal: "center", vertical: "middle" };

        worksheet.mergeCells(`B3:D3`);
        const cen3 = worksheet.getCell("B3");
        cen3.value = "Departamento Divisional de Planeación";
        cen3.font = { bold: true, size: 13, color: { argb: "#000" } };
        cen3.alignment = { horizontal: "center", vertical: "middle" };

        worksheet.mergeCells(`B4:D4`);
        const lincen4 = worksheet.getCell("B4");
        lincen4.value = datosProyecto.nombre;
        lincen4.font = { bold: true, size: 12, color: { argb: "#000" } };
        lincen4.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    }

    // Celda "Obra:" siempre en A4
    worksheet.mergeCells(`A4`);
    const cen4 = worksheet.getCell("A4");
    cen4.value = "Obra:";
    cen4.font = { size: 12, color: { argb: "#000" } };
    cen4.alignment = { horizontal: "center", vertical: "middle" };

    // INFORMACIÓN ADICIONAL - ESTRATEGIA MEJORADA
    if (visibleColumns.length > 0) {
        // CON columnas visibles: usar columnas F en adelante
        worksheet.mergeCells(`F1:${endColLetter}1`);
        worksheet.getCell("F1").value = "División de Distribución Jalisco";
        worksheet.getCell("F1").font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
        worksheet.getCell("F1").alignment = { horizontal: "right", vertical: "middle" };

        worksheet.mergeCells(`F2:${endColLetter}2`);
        worksheet.getCell("F2").value = "Zona " + datosProyecto.zona;
        worksheet.getCell("F2").font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
        worksheet.getCell("F2").alignment = { horizontal: "right", vertical: "middle" };

        worksheet.mergeCells(`F3:${endColLetter}4`);
        worksheet.getCell("F3").value = "Departamento de Planeación, Proyectos y Construcción";
        worksheet.getCell("F3").font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
        worksheet.getCell("F3").alignment = { horizontal: "right", vertical: "middle", wrapText: true };

        // Fila 5 - versión con columnas visibles
        worksheet.mergeCells(`A5:E5`);
        worksheet.getCell("A5").value = "Fecha:";
        worksheet.getCell("A5").font = { size: 10, color: { argb: "#000" } };
        worksheet.getCell("A5").alignment = { horizontal: "right", vertical: "middle" };

        worksheet.mergeCells(`F5:${endColLetter}5`);
        worksheet.getCell("F5").value = ObtenerFechaActualDMY();
        worksheet.getCell("F5").font = { size: 10, color: { argb: "#000" } };
        worksheet.getCell("F5").alignment = { horizontal: "center", vertical: "middle" };

    } else {
        // SIN columnas visibles: usar columna E para información adicional
        worksheet.mergeCells(`E1`);
        worksheet.getCell("E1").value = "División de Distribución Jalisco";
        worksheet.getCell("E1").font = { bold: true, size: 8, color: { argb: "FF008e5a" } };
        worksheet.getCell("E1").alignment = { horizontal: "right", vertical: "middle" };

        worksheet.mergeCells(`E2`);
        worksheet.getCell("E2").value = "Zona " + datosProyecto.zona;
        worksheet.getCell("E2").font = { bold: true, size: 8, color: { argb: "FF008e5a" } };
        worksheet.getCell("E2").alignment = { horizontal: "right", vertical: "middle" };

        worksheet.mergeCells(`E3`);
        worksheet.getCell("E3").value = "Depto. Planeación";
        worksheet.getCell("E3").font = { bold: true, size: 7, color: { argb: "FF008e5a" } };
        worksheet.getCell("E3").alignment = { horizontal: "right", vertical: "middle" };

        // Fila 5 - versión sin columnas visibles
        worksheet.mergeCells(`A5:D5`);
        worksheet.getCell("A5").value = "Fecha:";
        worksheet.getCell("A5").font = { size: 10, color: { argb: "#000" } };
        worksheet.getCell("A5").alignment = { horizontal: "right", vertical: "middle" };

        worksheet.mergeCells(`E5`);
        worksheet.getCell("E5").value = ObtenerFechaActualDMY();
        worksheet.getCell("E5").font = { size: 10, color: { argb: "#000" } };
        worksheet.getCell("E5").alignment = { horizontal: "center", vertical: "middle" };
    }

    // TÍTULO PRINCIPAL
    if (visibleColumns.length > 0) {
        worksheet.mergeCells(`A6:${endColLetter}6`);
    } else {
        worksheet.mergeCells(`A6:E6`);
    }
    const titleCell = worksheet.getCell("A6");
    titleCell.value = "Catalogo de Conceptos";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // ******************************************************************
    // ENCABEZADOS DE TABLA
    // ******************************************************************
    const headers = ["No. Concepto", "ID", "Nombre", "Unidad", "Cantidad", ...visibleColumns];

    worksheet.addRow(headers).eachCell((cell) => {
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

    // ******************************************************************
    // DATOS DE TABLA
    // ******************************************************************
    const tableBody = document.getElementById("table-bodyConceptos");
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll("td");
        const rowData = [
            cells[0].innerText,
            cells[1].innerText,
            cells[2].innerText,
            cells[3].innerText,
            cells[4].innerText,
        ];

        if (showCostoDirecto) rowData.push(cells[5].innerText);
        if (showPrecioUnitario) rowData.push(cells[6].innerText);
        if (showPUCantidad) rowData.push(cells[7].innerText);

        const excelRow = worksheet.addRow(rowData);

        excelRow.eachCell((cell, colNumber) => {
            let horizontalAlignment;
            switch (colNumber) {
                case 1: // "No. Concepto"
                    horizontalAlignment = "right";
                    break;
                case 2: // "ID"
                    horizontalAlignment = "left";
                    break;
                case 3: // "Nombre"
                    horizontalAlignment = "left"; // Cambié a "left"
                    break;
                case 4: // "Unidad"
                    horizontalAlignment = "left";
                    break;
                default: // Resto de columnas
                    horizontalAlignment = "right";
            }

            cell.alignment = { horizontal: horizontalAlignment, vertical: "middle" };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowIndex % 2 === 0 ? "FFF0F0F0" : "FFFFFFFF" } };
            cell.border = { left: { style: "thin" }, right: { style: "thin" } };
        });
    });

    // ******************************************************************
    // FILA TOTAL - SOLO SI HAY COLUMNAS MONETARIAS VISIBLES
    // ******************************************************************

    if (showPUCantidad) {
        const total = document.getElementById("TotalSumaImporteConceptos").innerHTML;

        const totalColumnsCount = 5 + visibleColumns.length;
        const lastDataColIndex = totalColumnsCount;
        const mergeEndColIndex = totalColumnsCount - 1;

        const totalRowData = new Array(totalColumnsCount).fill("");
        const totalRow = worksheet.addRow(totalRowData);
        const lastRowNumber = totalRow.number;

        worksheet.mergeCells(`A${lastRowNumber}:${getExcelColumnLetter(mergeEndColIndex)}${lastRowNumber}`);

        const mergedCell = worksheet.getCell(`A${lastRowNumber}`);
        mergedCell.value = "Total";
        mergedCell.font = { bold: true, color: { argb: "#000000" } };
        mergedCell.alignment = { horizontal: "right", vertical: "middle" };
        mergedCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } };
        mergedCell.border = {
            top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" },
        };

        const totalValueCell = totalRow.getCell(lastDataColIndex);
        totalValueCell.value = total;
        totalValueCell.font = { bold: true, color: { argb: "#000000" } };
        totalValueCell.alignment = { horizontal: "right", vertical: "middle" };
        totalValueCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } };
        totalValueCell.border = {
            top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" },
        };

        for (let col = 2; col < lastDataColIndex; col++) {
            const cell = totalRow.getCell(col);
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } };
            cell.border = {
                top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" },
            };
        }
    }

    // ******************************************************************
    // AJUSTE DE COLUMNAS
    // ******************************************************************
    const columnWidths = [
        { width: 13 }, { width: 13 }, { width: 90 }, { width: 13 }, { width: 15 },
    ];

    if (visibleColumns.length > 0) {
        columnWidths.push(...visibleColumns.map(() => ({ width: 20 })));
    }

    worksheet.columns = columnWidths;

    // ******************************************************************
    // DESCARGA
    // ******************************************************************
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ListaConceptosProy.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

let totales = {
    totalMaterial: 0,
    totalManoObra: 0,
    totalHerramientasEquipo: 0,
    totalMaquinaria: 0,
    totalBasico: 0
};

async function ExportarExcelTarjetas(pantalla) {

    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    let conceptos;

    if (pantalla) {
        conceptos = Object.values(editedRows);
        // Mostrar el contenedor de progreso

    } else {
        conceptos = selectedRows;
        if (conceptos.length == 0) {
            mensajePantalla("No hay conceptos seleccionados", false);

            return;
        }
    }

    document.getElementById("divCargaExport").style.display = "flex";
    document.getElementById("porcentajeExportacion").textContent = "0%";
    precionadoBtnExportarPdf();

    const totalConceptos = conceptos.length;
    let conceptosProcesados = 0;

    // Función para actualizar el progreso
    function actualizarProgreso() {
        conceptosProcesados++;
        const porcentaje = Math.round((conceptosProcesados / totalConceptos) * 100);
        document.getElementById("porcentajeExportacion").textContent = `Exportando a Excel ${porcentaje}%`;
    }

    // Obtener los conceptos
    let contador = 0;
    for (const concepto of conceptos) {
        contador++;

        // Crear una nueva hoja para cada concepto
        const worksheet = workbook.addWorksheet(String(conceptosProcesados + 1).padStart(3, '0'));

        const imageUrl = urlImagenLogo;
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
            base64: imageBase64.split(",")[1],
            extension: "png",
        });

        worksheet.addImage(imageId, {
            tl: { col: 0.2, row: 0.2 },
            ext: { width: 150, height: 50 },
        });

        // ... (todo el resto de tu código para configurar la hoja)


        worksheet.mergeCells("B1:F1");
        const cen1 = worksheet.getCell("B1");
        cen1.value = "División de Distribución Jalisco";
        cen1.font = { bold: true, size: 15, color: { argb: "#000" } };
        cen1.alignment = { horizontal: "center", vertical: "middle" };

        worksheet.mergeCells("G1:H1");
        const line1 = worksheet.getCell("G1");
        line1.value = "División de Distribución Jalisco";
        line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
        line1.alignment = { horizontal: "right", vertical: "middle" };

        //****************************************************************** */

        worksheet.mergeCells("B2:F2");
        const cen2 = worksheet.getCell("B2");
        cen2.value = "Subgerencia de Distribución";
        cen2.font = { bold: true, size: 15, color: { argb: "#000" } };
        cen2.alignment = { horizontal: "center", vertical: "middle" };
        if (pantalla) {
            worksheet.mergeCells("G2:H2");
            const line2 = worksheet.getCell("G2");
            line2.value = "Zona " + datosProyecto.zona;
            line2.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
            line2.alignment = { horizontal: "right", vertical: "middle" };
        }
        //****************************************************************** */
        worksheet.mergeCells("B3:F3");
        const cen3 = worksheet.getCell("B3");
        cen3.value = "Departamento Divisional de Planeación";
        cen3.font = { bold: true, size: 13, color: { argb: "#000" } };
        cen3.alignment = { horizontal: "center", vertical: "middle" };

        worksheet.mergeCells("G3:H4");
        const line3 = worksheet.getCell("G3");
        line3.value = "Departamento de Planeación, Proyectos y Construcción";
        line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
        line3.alignment = {
            horizontal: "right",
            vertical: "middle",
            wrapText: true // ← Ajustar texto
        };

        //****************************************************************** */
        worksheet.mergeCells("A4:D4");
        const cellFecha = worksheet.getCell("A4");
        cellFecha.value = "Fecha:";
        cellFecha.font = { size: 10, color: { argb: "#000" } };
        cellFecha.alignment = { horizontal: "right", vertical: "middle" };

        worksheet.mergeCells("E4:F4");
        const cellFechaD = worksheet.getCell("E4");
        cellFechaD.value = ObtenerFechaActualDMY();
        cellFechaD.font = { size: 10, color: { argb: "#000" } };
        cellFechaD.alignment = { horizontal: "center", vertical: "middle" };

        let TituloTabla
        if (pantalla) {
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
            TituloTabla = worksheet.addRow(["No. Concepto", String(conceptosProcesados + 1).padStart(3, '0'), "Análisis de los precios unitarios de los conceptos de trabajo", "", "", "", "", ""]);

            worksheet.mergeCells("C6:H6");
        } else {
            TituloTabla = worksheet.addRow(["No. Concepto", String(conceptosProcesados + 1).padStart(3, '0'), "Análisis de los precios unitarios de los conceptos de trabajo", "", "", "", "", ""]);

            worksheet.mergeCells("C5:H5");
        }
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

        // Actualizar el progreso después de procesar cada concepto

        actualizarProgreso();
    }

    // Descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    if (pantalla) {
        link.download = "TarjetasPrecioUnitarioProyecto.xlsx";
    } else {
        link.download = "TarjetasPrecioUnitario.xlsx";
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Ocultar el contenedor de progreso después de completar



    setTimeout(() => {
        document.getElementById("divCargaExport").style.display = "none";
        let btn = document.getElementById("btnExportarPDF");
        btn.removeAttribute("disabled");
        btn.classList.remove("btnClickeadoExportar");

        let btnExcel = document.getElementById("btnExportar");
        btnExcel.removeAttribute("disabled");
        btnExcel.classList.remove("btnClickeadoExportar");
    }, 1000);


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
    totales.totalMaterial = total;
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
    totales.totalManoObra = total;
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
    const totalImporteManoObra = totales.totalManoObra;
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
    totales.totalHerramientasEquipo = total;
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
    totales.totalMaquinaria = total;
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
    totales.totalBasico = total;
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

    // Totales iniciales
    const totalMateriales = parseFloat(totales.totalMaterial) || 0;
    const totalManoObra = parseFloat(totales.totalManoObra) || 0;
    const totalHerramientaEquipo = parseFloat(totales.totalHerramientasEquipo) || 0;
    const totalMaquinaria = parseFloat(totales.totalMaquinaria) || 0;
    const totalBasico = parseFloat(totales.totalBasico) || 0;

    // Costos adicionales asegurando que sean números
    const CIndirecto = parseFloat(costosAdicionales.CIndirecto ?? 15) || 15;
    const Financiamiento = parseFloat(costosAdicionales.Financiamiento ?? 1) || 1;
    const utilidadPorc = parseFloat(costosAdicionales.utilidad ?? 10) || 10;
    const CAdicionales = parseFloat(costosAdicionales.CAdicionales ?? 0.5) || 0.5;


    // Cálculos con redondeo a 2 decimales
    const costoDirecto = parseFloat((totalMateriales + totalManoObra + totalHerramientaEquipo + totalMaquinaria + totalBasico).toFixed(2));
    const costoIndirecto = parseFloat((costoDirecto * (CIndirecto / 100)).toFixed(2));
    const subTotal1 = parseFloat((costoDirecto + costoIndirecto).toFixed(2));
    const financiamiento = parseFloat((subTotal1 * (Financiamiento / 100)).toFixed(2));
    const subTotal2 = parseFloat((subTotal1 + financiamiento).toFixed(2));
    const utilidad = parseFloat((subTotal2 * (utilidadPorc / 100)).toFixed(2));
    const subTotal3 = parseFloat((subTotal2 + utilidad).toFixed(2));
    const cargosAdicionales = parseFloat((subTotal3 * (CAdicionales / 100)).toFixed(2));
    const precioUnitario = parseFloat((subTotal3 + cargosAdicionales).toFixed(2));

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