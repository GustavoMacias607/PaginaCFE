
let selectedPropuestas = [];
let AuxPropuestas = [];
let preciosOriginales = {};
function llenarCamposPaginaICM() {
    generarEncabezados();
    generarTabla();

}


// Función para obtener los proveedores seleccionados
function obtenerPropuestasSeleccionados() {
    console.log(selectedPropuestas)
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
        <th rowspan="6" style="min-width: 36rem; width: 36rem">Descripcion</th>
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
            <th style="min-width: 16rem; width: 16rem;" colspan="2" class="editable-inflacion" data-id="${propuesta.idpropuesta}" contenteditable="true">
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
            <th style="min-width: 8rem; width: 8rem;" rowspan="2">PU Propuesta</th>
            <th style="min-width: 8rem; width: 8rem;" rowspan="2">PU Actualizado</th>
        `).join("")}
    `;
    thead.appendChild(fila6);

    // Aplicar eventos a la inflación
    agregarEventosInflacion();
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
                <td class="editable-pu textDer" data-id="${aux.idconcepto}" data-propuesta="${propuesta.idpropuesta}" contenteditable="true">${formatoMXN(precio)}</td>
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
                    <button type="button" class="btn btn-primary btn-generar-datos" data-propuesta="${propuesta.idpropuesta}"
                        style="background-color: #008E5A; border: 3px solid #008E5A;">Guardar</button>
                </div>
            </td>
        `).join("")}
        <td colspan="2"></td>
    `;
    tbody.appendChild(filaBotones);

    // Agregar fila de totales
    const filaTotales = document.createElement("tr");
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
        const promedioPU = (total + sumaTotalesConInflacion) / (totalesConInflacion.length + 1);
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

    // Obtener el número de columnas dinámicamente
    const numColumns = 5 + obtenerPropuestasSeleccionados().length * 2 + 2;

    // Agregar encabezado
    worksheet.mergeCells(1, 2, 1, numColumns);
    const line1 = worksheet.getCell(1, 2);
    line1.value = "División de Distribución Jalisco";
    line1.font = { bold: true, size: 12, color: { argb: "FF008e5a" } };
    line1.alignment = { horizontal: "right", vertical: "middle" };
    line1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } };

    worksheet.mergeCells(2, 2, 2, numColumns);
    const line2 = worksheet.getCell(2, 2);
    line2.value = "Zona " + datosProyecto.zona; // Asegúrate de que `datosProyecto.zona` esté definido
    line2.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
    line2.alignment = { horizontal: "right", vertical: "middle" };
    line2.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } };

    worksheet.mergeCells(3, 2, 3, numColumns);
    const line3 = worksheet.getCell(3, 2);
    line3.value = "Departamento de Planeación, Proyectos y Construcción";
    line3.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
    line3.alignment = { horizontal: "right", vertical: "middle" };
    line3.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } };

    // Agregar título
    worksheet.mergeCells(5, 1, 5, numColumns);
    const titleCell = worksheet.getCell(5, 1);
    titleCell.value = "ICM";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } };

    // Crear las filas de encabezados
    const fila1 = ["ID", "Descripción", "Cantidad", "Unidad", "Proveedor"];
    obtenerPropuestasSeleccionados().forEach(propuesta => {
        fila1.push(propuesta.nombreprov, propuesta.nombreprov);
    });
    fila1.push("Promedio PU", "Importe");

    const fila2 = ["", "", "", "", "No. de propuesta"];
    obtenerPropuestasSeleccionados().forEach(propuesta => {
        fila2.push(propuesta.nopropuesta, propuesta.nopropuesta);
    });
    fila2.push("", "");

    const fila3 = ["", "", "", "", "Fecha (mm/aaaa)"];
    obtenerPropuestasSeleccionados().forEach(propuesta => {
        const [year, month] = propuesta.fecha.split('-');
        const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
        fila3.push(`${monthNames[parseInt(month) - 1]}-${year.slice(-2)}`, `${monthNames[parseInt(month) - 1]}-${year.slice(-2)}`);
    });
    fila3.push("", "");

    const fila4 = ["", "", "", "", "Inflación INEGI"];
    obtenerPropuestasSeleccionados().forEach(propuesta => {
        fila4.push(`${parseFloat(propuesta.inflacion).toFixed(2)}%`, `${parseFloat(propuesta.inflacion).toFixed(2)}%`);
    });
    fila4.push("", "");

    const fila5 = ["", "", "", "", "CFE"];
    obtenerPropuestasSeleccionados().forEach(() => {
        fila5.push("Proveedor", "Proveedor");
    });
    fila5.push("", "");

    const fila6 = ["PU", "Importe"];
    obtenerPropuestasSeleccionados().forEach(() => {
        fila6.push("PU Propuesta", "PU Actualizado");
    });
    fila6.push("Promedio PU", "Importe");

    // Agregar las filas de encabezados al worksheet
    worksheet.addRow(fila1);
    worksheet.addRow(fila2);
    worksheet.addRow(fila3);
    worksheet.addRow(fila4);
    worksheet.addRow(fila5);
    worksheet.addRow(fila6);

    // Aplicar estilos a las filas de encabezados
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber <= 6) {
            row.eachCell((cell) => {
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
        }
    });

    // Obtener datos de la tabla
    const tableBody = document.querySelector(".tbody-ICM");
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row, rowIndex) => {
        // Excluir la fila de botones "Guardar"
        if (row.querySelector("button.btn-generar-datos")) {
            return;
        }

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
                case 3: // Cantidad
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                    break;
                case 4: // Unidad
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                    break;
                case 5: // Proveedor
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    break;
                default:
                    if (colNumber > 5 && colNumber <= fila1.length - 2) {
                        cell.alignment = { horizontal: "right", vertical: "middle" };
                    } else {
                        cell.alignment = { horizontal: "center", vertical: "middle" }; // Por defecto
                    }
            }

            // Aplicar colores alternos en las filas
            if (rowIndex % 2 == 0) {  // Filas pares
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
    const total = document.querySelector(".total-promedio-pu-cantidad").innerText;
    const totalRow = ["", "", "", "", "Total"];
    for (let i = 0; i < obtenerPropuestasSeleccionados().length * 2; i++) {
        totalRow.push("");
    }
    totalRow.push(total);
    worksheet.addRow(totalRow).eachCell((cell, colNumber) => {
        if (colNumber == totalRow.length) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "right", vertical: "middle" };
        }
        if (colNumber == totalRow.length - 1) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        }
    });

    // Ajustar el ancho de las columnas manualmente
    worksheet.columns = fila1.map(header => {
        switch (header) {
            case "ID":
                return { key: 'ID', width: 13 };
            case "Descripción":
                return { key: 'Descripción', width: 40 };
            case "Cantidad":
                return { key: 'Cantidad', width: 13 };
            case "Unidad":
                return { key: 'Unidad', width: 13 };
            case "Proveedor":
                return { key: 'Proveedor', width: 20 };
            case "Promedio PU":
                return { key: 'Promedio PU', width: 20 };
            case "Importe":
                return { key: 'Importe', width: 25 };
            default:
                return { key: header, width: 20 };
        }
    });

    // Descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tablaICM.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}