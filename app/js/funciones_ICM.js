
let selectedPropuestas = [];
let AuxPropuestas = [];
let preciosOriginales = {};
function llenarCamposPaginaICM() {
    generarEncabezados();
    generarTabla();

}


// Función para obtener los proveedores seleccionados
function obtenerPropuestasSeleccionados() {
    return objetoPropuestasSeleccionadas;
}

function generarEncabezados() {
    const tabla = document.getElementById("tabla-ICM");
    const thead = tabla.querySelector("thead");

    // Limpiar encabezados
    thead.innerHTML = "";

    // Crear la primera fila de encabezados
    const fila1 = document.createElement("tr");
    fila1.innerHTML = `
        <th rowspan="6" style="min-width: 6rem; width: 6rem">Id</th>
        <th rowspan="6" style="min-width: 36rem; width: 36rem">Descripción</th>
        <th rowspan="6" style="min-width: 6rem; width: 6rem">Cantidad</th>
        <th rowspan="6" style="min-width: 6rem; width: 6rem">Unidad</th>
        <th colspan="2" style="min-width: 16rem; width: 16rem">Proveedor</th>
        ${obtenerPropuestasSeleccionados().map(propuesta => `
            <th style="min-width: 16rem; width: 16rem;" colspan="2">${propuesta.nombreprov}</th>
        `).join("")}
        <th rowspan="6" style="min-width: 8rem; width: 8rem;">Promedio PU</th>
        <th rowspan="6" style="min-width: 8rem; width: 8rem;">Importe</th>
    `;
    thead.appendChild(fila1);

    // Crear la segunda fila de encabezados
    const fila2 = document.createElement("tr");
    fila2.innerHTML = `
        <th colspan="2">No. de propuesta</th>
        ${obtenerPropuestasSeleccionados().map(propuesta => `
            <th style="min-width: 16rem; width: 16rem;" colspan="2">${propuesta.nopropuesta}</th>
        `).join("")}
    `;
    thead.appendChild(fila2);

    // Crear la tercera fila de encabezados
    const fila3 = document.createElement("tr");
    fila3.innerHTML = `
        <th colspan="2">Fecha (mm/aaaa)</th>
        ${obtenerPropuestasSeleccionados().map(propuesta => {
        const [year, month] = propuesta.fecha.split('-');
        const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
        return `<th style="min-width: 16rem; width: 16rem;" colspan="2">${monthNames[parseInt(month) - 1]}-${year.slice(-2)}</th>`;
    }).join("")}
    `;
    thead.appendChild(fila3);

    // Crear la cuarta fila de encabezados
    const fila4 = document.createElement("tr");
    fila4.innerHTML = `
        <th colspan="2" style="min-width: 12rem; width: 12rem;">Inflación INEGI</th>
        ${obtenerPropuestasSeleccionados().map(propuesta => `
            <th style="background-color:rgba(0, 142, 90, 0.75); min-width: 16rem; width: 16rem; " colspan="2" class="editable-inflacion" data-id="${propuesta.idpropuesta}" contenteditable="true">
                ${parseFloat(propuesta.inflacion).toFixed(2)}%
            </th>
        `).join("")}
    `;
    thead.appendChild(fila4);

    // Crear la quinta fila de encabezados
    const fila5 = document.createElement("tr");
    fila5.innerHTML = `
        <th colspan="2" style="min-width: 12rem; width: 12rem;">CFE</th>
        ${obtenerPropuestasSeleccionados().map(() => `
            <th style="min-width: 16rem; width: 16rem;" colspan="2">Proveedor</th>
        `).join("")}
    `;
    thead.appendChild(fila5);

    // Crear la sexta fila de encabezados
    const fila6 = document.createElement("tr");
    fila6.innerHTML = `
        <th style="min-width: 8rem; width: 8rem;">PU</th>
        <th style="min-width: 8rem; width: 8rem;">Importe</th>
        ${obtenerPropuestasSeleccionados().map(() => `
            <th style="min-width: 8rem; width: 8rem;">PU Propuesta</th>
            <th style="min-width: 8rem; width: 8rem;">PU Actualizado</th>
        `).join("")}
    `;
    thead.appendChild(fila6);

    // Aplicar eventos a la inflación
    agregarEventosInflacion();
}


function generarTabla() {
    const tabla = document.getElementById("tabla-ICM");
    const tbody = tabla.querySelector("tbody");

    // Limpiar la tabla
    tbody.innerHTML = "";

    // Llenar la tabla con los conceptos
    Object.values(selectedRows).forEach(concepto => {
        const fila = document.createElement("tr");
        fila.classList.add('fila');
        // Columnas fijas
        fila.innerHTML = `
            <td class="textIzq">${concepto.idconcepto}</td>
            <td class="textJus"  width: 12rem">${concepto.nombre}</td>
            <td class="textDer" data-id="${concepto.idconcepto}">${concepto.cantidad}</td>
            <td class="textIzq">${concepto.unidad}</td>
            <td class="textDer">${formatoMXN(concepto.total)}</td>
            <td class="total-calculado textDer">${formatoMXN(concepto.cantidad * concepto.total)}</td>
        `;

        // Columnas dinámicas para proveedores seleccionados
        let totalesConInflacion = []; // Para calcular el promedio
        obtenerPropuestasSeleccionados().forEach(propuesta => {
            let aux = AuxPropuestas.find(aux => aux.idconcepto == concepto.idconcepto && aux.idpropuesta == propuesta.idpropuesta);
            if (!aux) {
                aux = { idconcepto: concepto.idconcepto, idpropuesta: propuesta.idpropuesta, precio: 0 };
                AuxPropuestas.push(aux);
            }
            const precio = parseFloat(aux.precio);
            const totalConInflacion = precio * parseFloat((1 + propuesta.inflacion / 100));

            fila.innerHTML += `
                <td class="editable-pu textDer" data-id="${aux.idconcepto}" style="background-color: #82f75780;" data-propuesta="${propuesta.idpropuesta}" contenteditable="true">${formatoMXN(precio)}</td>
                <td class="textDer">${formatoMXN(totalConInflacion)}</td>
            `;

            // Guardar el total con inflación para el promedio
            if (totalConInflacion > 0) {
                totalesConInflacion.push(totalConInflacion);
            }
        });

        // Calcular el promedio PU
        const promedioPU = (parseFloat(concepto.total) + parseFloat(totalesConInflacion.reduce((a, b) => a + b, 0))) / (totalesConInflacion.length + 1);
        const promedioPUCantidad = promedioPU * parseFloat(concepto.cantidad);
        // Agregar las nuevas columnas
        fila.innerHTML += `
            <td class="textDer">${formatoMXN(promedioPU)}</td>
            <td class="promedio-pu-cantidad textDer">${formatoMXN(promedioPUCantidad)}</td>
        `;

        tbody.appendChild(fila);
    });

    // Agregar fila de botones para cada propuesta
    const filaBotones = document.createElement("tr");
    filaBotones.innerHTML = `
        <td colspan="6" style="text-align: right;"></td>
        ${obtenerPropuestasSeleccionados().map(propuesta => `
            <td class="textCen" colspan="2">
                <div id="btnAgregarProvee" class="modal-footer-zonas">
                ${(rolUsuarioSe == "Administrador" || rolUsuarioSe == "Analista de Precios") ?
            ` <button type="button" class="btn btn-primary btn-generar-datos" data-propuesta="${propuesta.idpropuesta}"
                        style="background-color: #008E5A; border: 3px solid #008E5A;">Guardar</button>`:
            ``
        }
                </div>
            </td>
        `).join("")}
        <td colspan="2"></td>
    `;
    tbody.appendChild(filaBotones);

    // Agregar fila de totales
    const filaTotales = document.createElement("tr");
    filaTotales.id = "totalesICME";
    filaTotales.innerHTML = `
    
        <td colspan="5" style="text-align: right;">Importe CFE:</td>
        <td style="text-align: right;" class="total-cantidad-total"></td>
        ${obtenerPropuestasSeleccionados().map(() => `
            <td colspan="2"></td>
        `).join("")}
        <td colspan="1" style="text-align: right;">Importe ICM:</td>
        <td colspan="1" style="text-align: right;" class="total-promedio-pu-cantidad"></td>
        
    `;
    tbody.appendChild(filaTotales);

    // Hacer editable el campo de PU Propuesta
    const celdasEditablePU = document.querySelectorAll("td.editable-pu");
    celdasEditablePU.forEach(celda => {
        celda.addEventListener("input", () => {
            // Permitir solo números y un máximo de dos decimales
            let valor = celda.innerText.replace(/[^0-9.]/g, '');
            const partes = valor.split('.');
            if (partes.length > 1 && partes[1].length > 2) {
                valor = partes[0] + '.' + partes[1].substring(0, 2);
            }
            const pos = Math.min(window.getSelection().getRangeAt(0).startOffset, valor.length);
            celda.innerText = valor;
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(celda.childNodes[0], pos);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        });

        celda.addEventListener("blur", () => {
            // Asegurarse de que el valor tenga dos decimales y formatear como MXN
            let valor = parseFloat(celda.innerText.replace(/[^0-9.-]+/g, "")) || 0;
            celda.innerText = formatoMXN(valor);

            // Actualizar el PU en el array AuxPropuestas
            const idconcepto = celda.getAttribute("data-id");
            const idPropuesta = celda.getAttribute("data-propuesta");
            const aux = AuxPropuestas.find(a => a.idconcepto == idconcepto && a.idpropuesta == idPropuesta);
            if (aux) {
                aux.precio = valor;
            } else {
                AuxPropuestas.push({ idconcepto, idpropuesta: idPropuesta, precio: valor });
            }

            // Recalcular la fila
            recalcularFila(idconcepto);
            recalcularTotales();
        });

        celda.addEventListener("keydown", (e) => {
            if (e.key == "Enter") {
                e.preventDefault();
                celda.blur(); // Aplicar formato al presionar Enter
            }
        });
    });

    // Agregar evento a los botones para generar el objeto del propuesta
    const botones = document.querySelectorAll(".btn-generar-datos");
    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            const idPropuesta = parseInt(boton.getAttribute("data-propuesta"));
            generarObjetoPropuesta(idPropuesta);
        });
    });
    recalcularTotales();
}

// Función para agregar eventos a la celda editable de inflación
function agregarEventosInflacion() {
    document.querySelectorAll(".editable-inflacion").forEach(celda => {
        celda.addEventListener("input", () => {
            // Permitir solo números y un máximo de dos decimales
            let valor = celda.innerText.replace(/[^0-9.]/g, '');
            const partes = valor.split('.');
            if (partes.length > 1 && partes[1].length > 2) {
                valor = partes[0] + '.' + partes[1].substring(0, 2);
            }
            const pos = window.getSelection().getRangeAt(0).startOffset;
            celda.innerText = valor;
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(celda.childNodes[0], pos);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        });

        celda.addEventListener("blur", () => {
            // Asegurarse de que el valor tenga dos decimales y agregar el signo de %
            let valor = parseFloat(celda.innerText) || 0;
            celda.innerText = valor.toFixed(2) + '%';

            // Actualizar la inflación en el array objetoPropuestasSeleccionadas
            const idPropuesta = celda.getAttribute("data-id");
            const propuesta = objetoPropuestasSeleccionadas.find(p => p.idpropuesta == idPropuesta);
            if (propuesta) {
                propuesta.inflacion = valor;
            }

            // Recalcular la tabla
            generarTabla();
        });

        celda.addEventListener("keydown", (e) => {
            if (e.key == "Enter") {
                e.preventDefault();
                celda.blur(); // Aplicar formato al presionar Enter
            }
        });
    });
}

// Función para recalcular una fila
function recalcularFila(idconcepto) {
    const fila = document.querySelector(`tr td[data-id="${idconcepto}"]`).closest("tr");
    const concepto = Object.values(selectedRows).find(c => c.idconcepto == idconcepto);

    if (concepto) {
        // Asegurarse de que los valores sean números válidos
        const cantidad = parseFloat(concepto.cantidad) || 0;
        const total = parseFloat(concepto.total) || 0;

        // Actualizar el campo "Cantidad * Total"
        const totalCalculado = fila.querySelector(".total-calculado");
        totalCalculado.textContent = formatoMXN(cantidad * total);

        // Recalcular las columnas de proveedores y el promedio
        let totalesConInflacion = [];
        obtenerPropuestasSeleccionados().forEach((propuesta, index) => {
            const aux = AuxPropuestas.find(aux => aux.idconcepto == concepto.idconcepto && aux.idpropuesta == propuesta.idpropuesta);
            const precio = parseFloat(aux ? aux.precio : 0) || 0;
            const inflacion = parseFloat(propuesta.inflacion) || 0;
            const totalConInflacion = precio * (1 + inflacion / 100);

            // Actualizar las celdas de proveedores
            const celdas = fila.querySelectorAll("td");
            const columnaTotal = 6 + (index * 2); // Columna de "Total"
            const columnaTotalInflacion = columnaTotal + 1; // Columna de "Total con Inflación"

            celdas[columnaTotal].textContent = formatoMXN(precio);
            celdas[columnaTotalInflacion].textContent = formatoMXN(totalConInflacion);

            // Guardar el total con inflación para el promedio
            if (totalConInflacion > 0) {
                totalesConInflacion.push(totalConInflacion);
            }
        });

        // Calcular el promedio PU
        const sumaTotalesConInflacion = totalesConInflacion.reduce((a, b) => a + b, 0);
        console.log(total)
        const promedioPU = (total + sumaTotalesConInflacion) / (total != 0 ? totalesConInflacion.length + 1 : totalesConInflacion.length);
        const promedioPUCantidad = promedioPU * cantidad;

        // Actualizar las nuevas columnas
        const celdas = fila.querySelectorAll("td");
        celdas[celdas.length - 2].textContent = formatoMXN(promedioPU); // Promedio PU
        celdas[celdas.length - 1].textContent = formatoMXN(promedioPUCantidad); // Promedio PU * Cantidad
    }
}

// Función para recalcular los totales
function recalcularTotales() {
    const totalCantidadTotal = Array.from(document.querySelectorAll(".total-calculado"))
        .reduce((sum, cell) => sum + parseFloat(cell.textContent.replace(/[^0-9.-]+/g, "")), 0);

    const totalPromedioPUCantidad = Array.from(document.querySelectorAll(".promedio-pu-cantidad"))
        .reduce((sum, cell) => sum + parseFloat(cell.textContent.replace(/[^0-9.-]+/g, "")), 0);

    document.querySelector(".total-cantidad-total").textContent = formatoMXN(totalCantidadTotal);
    document.querySelector(".total-promedio-pu-cantidad").textContent = formatoMXN(totalPromedioPUCantidad);
}

// Función para generar el objeto del propuesta
function generarObjetoPropuesta(idPropuesta) {
    const propuesta = objetoPropuestasSeleccionadas.find(p => p.idpropuesta == idPropuesta);
    const objetoPropuesta = [];

    Object.values(selectedRows).forEach(concepto => {
        const aux = AuxPropuestas.find(aux => aux.idconcepto == concepto.idconcepto && aux.idpropuesta == idPropuesta);
        if (aux) {
            objetoPropuesta.push({
                idpropuesta: propuesta.idpropuesta,
                nombreprov: propuesta.nombreprov,
                nopropuesta: propuesta.nopropuesta,
                fecha: propuesta.fecha,
                inflacion: propuesta.inflacion,
                idconcepto: concepto.idconcepto,
                precio: aux.precio,
            });
        }
    });
    console.log(objetoPropuesta)
    EliminarDatosAuxPropuesta(objetoPropuesta);
}

function GuardarDatosAuxPropuesta(objPropuesta) {
    objPropuesta.forEach(auxPropuesta => {
        let json = JSON.stringify(auxPropuesta);
        let url = "../ws/AuxPropuestas/wsAddAuxPropuesta.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == "success") {
                    let resp = JSON.parse(responseText);
                    if (resp.estado == "OK") {
                        // Actualizar los precios originales con los nuevos precios guardados
                        if (!preciosOriginales[auxPropuesta.idpropuesta]) {
                            preciosOriginales[auxPropuesta.idpropuesta] = {};
                        }
                        preciosOriginales[auxPropuesta.idpropuesta][auxPropuesta.idconcepto] = auxPropuesta.precio;
                        mensajePantalla("Precios actualizados", true);
                    }
                } else {
                    throw e = status;
                }
            } catch (error) {
                alert("Error: " + error)
            }
        });
    });
}

function EliminarDatosAuxPropuesta(objPropuesta) {
    let datos = {};
    datos.idpropuesta = objPropuesta[0].idpropuesta;
    let json = JSON.stringify(datos);
    let url = "../ws/AuxPropuestas/wsDelAuxPropuesta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                GuardarDatosAuxPropuesta(objPropuesta);
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

// Función para formatear números como MXN
function formatoMXN(valor) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);
}


async function ExportarTablaICMExcel() {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ICM");

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

    // Obtener la tabla ICM
    const tabla = document.getElementById("tabla-ICM");
    const thead = tabla.querySelector("thead");
    const tbody = tabla.querySelector("tbody");

    // Calcular el número de columnas dinámicamente
    const numColumnas = thead.querySelector("tr").children.length;
    const numProveedores = obtenerPropuestasSeleccionados().length;
    const totalColumnas = numColumnas + numProveedores + 1; // Ajustar para considerar que cada proveedor abarca dos columnas

    // Agregar encabezado dinámico
    worksheet.mergeCells(`A1:${String.fromCharCode(65 + totalColumnas - 1)}1`);
    const line1 = worksheet.getCell("A1");
    line1.value = "División de Distribución Jalisco";
    line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
    line1.alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells(`A2:${String.fromCharCode(65 + totalColumnas - 1)}2`);
    const line3 = worksheet.getCell("A2");
    line3.value = "Departamento de Planeación, Proyectos y Construcción";
    line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
    line3.alignment = { horizontal: "right", vertical: "middle" };

    // Agregar título dinámico
    worksheet.mergeCells(`A5:${String.fromCharCode(65 + totalColumnas - 1)}5`);
    const titleCell = worksheet.getCell("A5");
    titleCell.value = "Investigación de Condiciones de Mercado";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Agregar encabezados fijos
    const headerRows = [
        ["", "", "", "", "Proveedor", "Proveedor"],
        ["", "", "", "", "No. de propuesta", ""],
        ["Id", "Descripción", "Cantidad", "Unidad", "Fecha (mm/aaaa)", ""],
        ["", "", "", "", "Inflación INEGI", ""],
        ["", "", "", "", "CFE", ""],
        ["", "", "", "", "PU", "Importe"]
    ];

    // Agregar encabezados dinámicos
    obtenerPropuestasSeleccionados().forEach(propuesta => {
        headerRows[0].push(propuesta.nombreprov, propuesta.nombreprov);
        headerRows[1].push(propuesta.nopropuesta, propuesta.nopropuesta);
        headerRows[2].push(propuesta.fecha.split('-').reverse().join('-'), propuesta.fecha.split('-').reverse().join('-'));
        headerRows[3].push(`${parseFloat(propuesta.inflacion).toFixed(2)}%`, `${parseFloat(propuesta.inflacion).toFixed(2)}%`);
        headerRows[4].push("Proveedor", "Proveedor");
        headerRows[5].push("PU Propuesta", "PU Actualizado");
    });

    headerRows[0].push("", "");
    headerRows[1].push("", "");
    headerRows[2].push("Promedio PU", "Importe");
    headerRows[3].push("", "");
    headerRows[4].push("", "");
    headerRows[5].push("", "");

    // Agregar encabezados a la hoja de trabajo
    headerRows.forEach((row, rowIndex) => {
        const excelRow = worksheet.addRow(row);

        // Aplicar estilo a los encabezados
        excelRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008e5a" }, bgColor: { argb: "FFFFFFFF" } };
            cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });

        // Ajustar las columnas de los proveedores para que abarquen 2 columnas
        if (rowIndex >= 0 && rowIndex <= 4) {
            let colIndex = 5; // Comenzar desde la columna 5 (Proveedor)
            const rowNumber = rowIndex + 6; // Calcula dinámicamente la fila a fusionar
            obtenerPropuestasSeleccionados().forEach(() => {
                worksheet.mergeCells(`${String.fromCharCode(64 + colIndex)}${rowNumber}:${String.fromCharCode(64 + colIndex + 1)}${rowNumber}`);
                colIndex += 2; // Saltar a la siguiente pareja de columnas
            });

            // Combinar las dos últimas columnas que quedaron fuera
            worksheet.mergeCells(`${String.fromCharCode(64 + colIndex)}${rowNumber}:${String.fromCharCode(64 + colIndex + 1)}${rowNumber}`);
        }
    });

    // Ajustar bordes de las celdas en las columnas Descripción, Cantidad, Unidad, Promedio PU e Importe
    const columnsToAdjust = [1, 2, 3, 4, totalColumnas - 1, totalColumnas];
    columnsToAdjust.forEach(col => {
        for (let row = 6; row <= worksheet.rowCount; row++) {
            const cell = worksheet.getCell(`${String.fromCharCode(64 + col)}${row}`);
            cell.border = {
                top: row === 6 ? { style: "thin" } : { style: "none" },
                left: { style: "thin" },
                bottom: row === worksheet.rowCount ? { style: "thin" } : { style: "none" },
                right: { style: "thin" },
            };
        }
    });

    // Agregar datos de la tabla ICM (excluyendo las últimas dos filas)
    const rows = tbody.querySelectorAll("tr");
    rows.forEach((row, rowIndex) => {
        // Excluir las últimas dos filas
        if (rowIndex < rows.length - 2) {
            const cells = row.querySelectorAll("td");
            const rowData = Array.from(cells).map(cell => cell.innerText);
            const excelRow = worksheet.addRow(rowData);

            // Aplicar color alterno a las filas
            excelRow.eachCell((cell, colNumber) => {
                if (rowIndex % 2 === 0) {  // Filas pares
                    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } }; // Gris claro
                } else {  // Filas impares
                    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }; // Blanco
                }

                // Configurar bordes en todos los lados
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };

                // Ajustar alineación de las celdas
                if (colNumber == 1 || colNumber == 2 || colNumber == 4) {
                    cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
                } else {
                    cell.alignment = { horizontal: "right", vertical: "middle", wrapText: true };
                }
            });

            // Ajustar el alto de la fila al contenido
            const cellHeights = rowData.map(cell => cell.split('\n').length * 15); // Ajustar el multiplicador según sea necesario
            const maxHeight = Math.max(...cellHeights);
            excelRow.height = maxHeight;
        }
    });

    // Agregar fila de totales
    const filaTotales = worksheet.addRow([]);
    filaTotales.getCell(5).value = "Importe CFE:";
    filaTotales.getCell(5).alignment = { horizontal: "right", vertical: "middle" };
    filaTotales.getCell(5).font = { bold: true };
    filaTotales.getCell(5).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };

    const totalCFE = document.querySelector(".total-cantidad-total").innerText;
    filaTotales.getCell(6).value = totalCFE;
    filaTotales.getCell(6).alignment = { horizontal: "right", vertical: "middle" };
    filaTotales.getCell(6).font = { bold: true };
    filaTotales.getCell(6).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };

    const totalICM = document.querySelector(".total-promedio-pu-cantidad").innerText;
    filaTotales.getCell(totalColumnas - 1).value = "Importe ICM:";
    filaTotales.getCell(totalColumnas - 1).alignment = { horizontal: "right", vertical: "middle" };
    filaTotales.getCell(totalColumnas - 1).font = { bold: true };
    filaTotales.getCell(totalColumnas - 1).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };

    filaTotales.getCell(totalColumnas).value = totalICM;
    filaTotales.getCell(totalColumnas).alignment = { horizontal: "right", vertical: "middle" };
    filaTotales.getCell(totalColumnas).font = { bold: true };
    filaTotales.getCell(totalColumnas).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };

    // Ajustar el ancho de las columnas dinámicamente
    worksheet.columns = Array.from({ length: totalColumnas }, (_, i) => ({
        width: i === 1 ? 90 : 20, // Ajusta el ancho de la columna "Descripción" a 90, las demás a 20
    }));

    // Descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ReporteICMExcel.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
async function exportarPDFTablaICM() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape', 'pt', 'letter'); // Configurar el PDF en formato horizontal
    const container = document.getElementById('tabla-ICM');

    if (!container) {
        console.error('Tabla "tabla-ICM" no encontrada');
        return;
    }

    // Obtener encabezados y filas de la tabla
    const headers = [];
    const rows = [];

    const thead = container.querySelector("thead");
    const tbody = container.querySelector("tbody");

    // Obtener encabezados
    thead.querySelectorAll("tr").forEach(row => {
        const rowData = Array.from(row.querySelectorAll("th")).map(cell => ({
            content: cell.innerText,
            colSpan: cell.colSpan,
            rowSpan: cell.rowSpan,
            styles: {
                halign: 'center',
                valign: 'middle',
                fillColor: [0, 142, 90],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 7, // Tamaño de fuente para los encabezados
                lineWidth: 0.5,
                lineColor: [0, 0, 0]
            }
        }));
        headers.push(rowData);
    });

    // Obtener filas
    const allRows = tbody.querySelectorAll("tr");
    allRows.forEach((row, rowIndex) => {
        // Excluir la penúltima fila
        if (rowIndex !== allRows.length - 2 && rowIndex !== allRows.length - 1) {
            const rowData = Array.from(row.querySelectorAll("td")).map((cell, cellIndex) => {
                let halign = 'right'; // Alineación por defecto

                // Configurar alineación específica para cada columna
                if (cellIndex === 0) halign = 'left'; // Primera columna
                else if (cellIndex === 1) halign = 'justify'; // Segunda columna
                else if (cellIndex === 2) halign = 'right'; // Tercera columna
                else if (cellIndex === 3) halign = 'left'; // Cuarta columna

                return {
                    content: cell.innerText,
                    styles: {
                        halign: halign,
                        fontSize: 6, // Tamaño de fuente para el contenido
                        lineWidth: 0.5,
                        lineColor: [0, 0, 0],
                        overflow: 'linebreak', // Ajustar el alto de la fila al contenido
                        cellPadding: 2,
                        minCellHeight: 10 // Ajustar el alto mínimo de las celdas
                    }
                };
            });
            rows.push(rowData);
        }
    });

    // Agregar la tabla al PDF usando autoTable
    doc.autoTable({
        head: headers,
        body: rows,
        startY: 120, // Ajustar la posición de inicio de la tabla
        styles: {
            fontSize: 6,
            cellPadding: 2,
            overflow: 'linebreak', // Ajuste automático de texto
            halign: 'center',
            valign: 'middle',
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
            margin: { top: 5, right: 5, bottom: 5, left: 5 },
            minCellHeight: 10 // Ajustar el alto mínimo de las celdas
        },
        headStyles: {
            fillColor: [0, 142, 90],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 7, // Tamaño de fuente para los encabezados
            lineWidth: 0.5,
            lineColor: [0, 0, 0]
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240],
        },
        margin: { top: 120, right: 23, bottom: 40, left: 23 },
        columnStyles: {
            0: { cellWidth: 35, halign: 'left' }, // Ajustar el ancho y alineación de la primera columna
            1: { cellWidth: 200, halign: 'justify' }, // Ajustar el ancho y alineación de la segunda columna
            2: { cellWidth: 35, halign: 'right' }, // Ajustar el ancho y alineación de la tercera columna
            3: { cellWidth: 32, halign: 'left' }, // Ajustar el ancho y alineación de la cuarta columna
        },
        didDrawPage: (data) => {
            addHeader(doc);
            addImage(doc);
            doc.setFontSize(13);
            doc.setTextColor(0, 142, 90); // Verde CFE (#008e5a)
            doc.text("Investigación de Condiciones de Mercado", doc.internal.pageSize.width / 2, 80, { align: "center" });
        },
        didParseCell: (data) => {
            // Si el contenido de la celda es demasiado grande, ajustar el alto de la celda
            if (data.cell.raw.content.length > 100) { // Ajusta este valor según tus necesidades
                data.cell.styles.minCellHeight = 20; // Aumentar el alto de la celda
            }
        },
        willDrawCell: (data) => {
            // Si no hay suficiente espacio en la página, forzar un salto de página
            if (data.cell.raw.content.length > 100 && data.cursor.y + data.cell.height > doc.internal.pageSize.height - 40) {
                doc.addPage();
                data.cursor.y = 120; // Reiniciar la posición Y en la nueva página
            }
        },
        pageBreak: 'auto' // Dividir celdas largas en múltiples páginas
    });

    // Agregar fila de totales
    const totalCFE = document.querySelector(".total-cantidad-total").innerText;
    const totalICM = document.querySelector(".total-promedio-pu-cantidad").innerText;

    const totalRow = [
        { content: 'Importe CFE:', colSpan: headers[0].length - 2, styles: { halign: 'right', fontSize: 8 } },
        { content: totalCFE, styles: { halign: 'right', fontSize: 8 } },
        { content: 'Importe ICM:', styles: { halign: 'right', fontSize: 8 } },
        { content: totalICM, styles: { halign: 'right', fontSize: 8 } }
    ];

    doc.autoTable({
        body: [totalRow],
        startY: doc.lastAutoTable.finalY + 10,
        styles: {
            fontSize: 6,
            cellPadding: 2,
            overflow: 'linebreak',
            halign: 'center',
            valign: 'middle',
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
            minCellHeight: 10 // Ajustar el alto mínimo de las celdas
        },
        margin: { top: 120, right: 23, bottom: 40, left: 23 },
        columnStyles: {
            0: { cellWidth: 35, halign: 'left' },
            1: { cellWidth: 150, halign: 'justify' },
            2: { cellWidth: 35, halign: 'right' },
            3: { cellWidth: 35, halign: 'left' },
        },
    });

    // Obtener el número total de páginas
    const totalPages = doc.internal.getNumberOfPages();

    // Agregar pie de página a cada página
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addFooter(doc, i, totalPages);
    }

    doc.save('ReporteICMPDF.pdf');

    // Encabezado sin espacio entre renglones
    function addHeader(doc) {
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const marginRight = 1.5 * 28.35; // Margen derecho (1.5 cm)
        const headerX = pageWidth - marginRight; // Posición X del encabezado
        const headerYStart = 50; // Posición Y del primer renglón (3 cm del margen superior)

        doc.setTextColor(0, 142, 90); // Verde CFE (#008e5a)

        // Línea 1
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        const line1 = "División de Distribución Jalisco";
        doc.text(line1, headerX, headerYStart, { align: "right" });
        // Línea 3
        doc.setFontSize(9);
        const line3 = "Departamento de Planeación, Proyectos y Construcción";
        doc.text(line3, headerX, headerYStart + 10, { align: "right" }); // Solo 3.4 mm debajo del anterior
    }

    // Pie de página centrado
    function addFooter(doc, pageNumber, totalPages) {
        const pageHeight = doc.internal.pageSize.height; // Altura de la página
        const pageWidth = doc.internal.pageSize.width; // Ancho de la página
        const footerY = pageHeight - 20; // Posición Y del pie de página (1 cm desde la parte inferior)

        doc.setFontSize(10); // Tamaño de fuente
        doc.setTextColor(0, 0, 0); // Color negro

        const pageText = `Página ${pageNumber} de ${totalPages}`; // Texto del número de página
        const textWidth = doc.getTextWidth(pageText); // Ancho del texto

        // Centrar el texto en el pie de página
        doc.text(pageText, (pageWidth - textWidth) / 2, footerY);
    }

    // Agregar imagen
    function addImage(doc) {
        const imageUrl = '/paginacfe/app/img/LogoPdf.PNG'; // Reemplaza con la URL o base64 de tu imagen
        const marginLeft = 1.5 * 28.35; // Margen izquierdo (1.5 cm)
        const marginTop = 1.5 * 28.35; // Margen superior (1.5 cm)
        const imageWidth = 135; // Ancho de la imagen (ajusta según sea necesario)
        const imageHeight = 45; // Altura de la imagen (ajusta según sea necesario)

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    }
}