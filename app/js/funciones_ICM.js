
let selectedPropuestas = [];
let AuxPropuestas = [];
let preciosOriginales = {};

function totalesConceptosPuProyecto() {
    if (isExpProy) {
        selectedRows.forEach(concepto => {
            if (concepto.total != "0.00" && concepto.total != 0 && concepto.total !== undefined) {
                let totalNumerico = parseFloat(concepto.total);
                if (!isNaN(totalNumerico)) {
                    let nuevoTotal = calculoConceptoPorcentaje(totalNumerico);
                    // Guardar nuevamente como cadena con 2 decimales
                    concepto.total = nuevoTotal.toFixed(2);
                }
            }
        });
    }
    else {
        selectedRows.forEach(concepto => {
            if (concepto.total != "0.00" && concepto.total != 0 && concepto.total !== undefined) {
                let totalNumerico = parseFloat(concepto.total);
                if (!isNaN(totalNumerico)) {
                    let nuevoTotal = calculoConceptoPorcentajeSinProyecto(totalNumerico);
                    // Guardar nuevamente como cadena con 2 decimales
                    concepto.total = nuevoTotal.toFixed(2);
                }
            }
        });
    }

    generarEncabezados();
    generarTabla();
}
function llenarCamposPaginaICM() {
    totalesConceptosPuProyecto();
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
      <th rowspan="6" style="min-width: 6rem; width: 6rem">No.</th>
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
    let contador = 1;
    // Limpiar la tabla
    tbody.innerHTML = "";

    // Llenar la tabla con los conceptos
    Object.values(selectedRows).forEach(concepto => {
        const fila = document.createElement("tr");
        fila.classList.add('fila');
        // Columnas fijas
        fila.innerHTML = `
        <td class="textDer">${contador}</td>
            <td class="textIzq">${concepto.idconcepto}</td>
            <td class="textJus"  width: 12rem">${concepto.nombre}</td>
            <td class="textDer" data-id="${concepto.idconcepto}">${concepto.cantidad}</td>
            <td class="textIzq">${concepto.unidad}</td>
            <td class="textDer">${formatoMXN(concepto.total)}</td>
            <td class="total-calculado textDer">${formatoMXN(concepto.cantidad * concepto.total)}</td>
        `;
        contador++;
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
        <td colspan="7" style="text-align: right;"></td>
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
    
        <td colspan="6" style="text-align: right;">Importe CFE:</td>
        <td style="text-align: right;" class="total-cantidad-total"></td>
        ${obtenerPropuestasSeleccionados().map(() => `
            <td colspan="2"></td>
        `).join("")}
        <td colspan="1" style="text-align: right;">Importe ICM:</td>
        <td colspan="1" style="text-align: right;" class="total-promedio-pu-cantidad"></td>
        
    `;
    tbody.appendChild(filaTotales);

    // Configurar eventos para celdas editables
    setupEditableCells();

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

// Función para configurar eventos de celdas editables
function setupEditableCells() {
    const celdasEditablePU = document.querySelectorAll("td.editable-pu");
    celdasEditablePU.forEach(celda => {
        // Clonar celda para evitar eventos duplicados
        const newCelda = celda.cloneNode(true);
        celda.replaceWith(newCelda);

        newCelda.addEventListener("input", (e) => {
            const originalText = newCelda.innerText;

            // Limpiar y formatear el texto (mantener solo números y punto)
            let cleanedText = originalText.replace(/[^0-9.]/g, '');

            // Manejar múltiples puntos - mantener solo el primero
            const parts = cleanedText.split('.');
            if (parts.length > 2) {
                cleanedText = parts[0] + '.' + parts.slice(1).join('');
            }

            // Aplicar límites: 10 enteros y 2 decimales
            const finalParts = cleanedText.split('.');
            if (finalParts[0].length > 10) {
                finalParts[0] = finalParts[0].substring(0, 10);
            }
            if (finalParts.length > 1 && finalParts[1].length > 2) {
                finalParts[1] = finalParts[1].substring(0, 2);
            }

            cleanedText = finalParts.join('.');

            // Solo actualizar si hubo cambios
            if (originalText !== cleanedText) {
                newCelda.innerText = cleanedText;

                // Mover cursor al final
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(newCelda);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });

        newCelda.addEventListener("blur", () => {
            // Asegurarse de que el valor tenga dos decimales y formatear como MXN
            let valor = parseFloat(newCelda.innerText.replace(/[^0-9.-]+/g, "")) || 0;
            newCelda.innerText = formatoMXN(valor);

            // Actualizar el PU en el array AuxPropuestas
            const idconcepto = newCelda.getAttribute("data-id");
            const idPropuesta = newCelda.getAttribute("data-propuesta");
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

        // Prevenir pegado de texto no numérico
        newCelda.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numbersOnly = pastedText.replace(/[^0-9.]/g, '');

            // Insertar el texto limpio
            document.execCommand('insertText', false, numbersOnly);
        });

        // Validación en keydown
        newCelda.addEventListener('keydown', (e) => {
            // Permitir todas las teclas de control y navegación
            const allowedControls = [
                'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
                'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End',
                'Enter', 'Escape'
            ];

            if (allowedControls.includes(e.key)) {
                return true;
            }

            // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            if (e.ctrlKey || e.metaKey) {
                return true;
            }

            // Solo permitir números y un solo punto
            if (!/[\d.]/.test(e.key)) {
                e.preventDefault();
                return false;
            }

            // Si es punto, verificar que no exista ya uno
            if (e.key === '.' && newCelda.innerText.includes('.')) {
                e.preventDefault();
                return false;
            }

            return true;
        });

        newCelda.addEventListener("keydown", (e) => {
            if (e.key == "Enter") {
                e.preventDefault();
                newCelda.blur(); // Aplicar formato al presionar Enter
            }
        });
    });
}

// Función para agregar eventos a la celda editable de inflación
function agregarEventosInflacion() {
    document.querySelectorAll(".editable-inflacion").forEach(celda => {
        // Clonar celda para evitar eventos duplicados
        const newCelda = celda.cloneNode(true);
        celda.replaceWith(newCelda);

        newCelda.addEventListener("input", (e) => {
            const originalText = newCelda.innerText.replace('%', '');

            // Limpiar y formatear el texto
            let cleanedText = originalText.replace(/[^0-9.]/g, '');

            // Manejar múltiples puntos - mantener solo el primero
            const parts = cleanedText.split('.');
            if (parts.length > 2) {
                cleanedText = parts[0] + '.' + parts.slice(1).join('');
            }

            // Aplicar límites: 3 enteros y 2 decimales (para porcentaje)
            const finalParts = cleanedText.split('.');
            if (finalParts[0].length > 3) {
                finalParts[0] = finalParts[0].substring(0, 3);
            }
            if (finalParts.length > 1 && finalParts[1].length > 2) {
                finalParts[1] = finalParts[1].substring(0, 2);
            }

            cleanedText = finalParts.join('.');

            // Solo actualizar si hubo cambios
            if (originalText !== cleanedText) {
                newCelda.innerText = cleanedText;

                // Mover cursor al final
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(newCelda);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });

        newCelda.addEventListener("blur", () => {
            // Asegurarse de que el valor tenga dos decimales y agregar el signo de %
            let valor = parseFloat(newCelda.innerText) || 0;
            newCelda.innerText = valor.toFixed(2) + '%';

            // Actualizar la inflación en el array objetoPropuestasSeleccionadas
            const idPropuesta = newCelda.getAttribute("data-id");
            const propuesta = objetoPropuestasSeleccionadas.find(p => p.idpropuesta == idPropuesta);
            if (propuesta) {
                propuesta.inflacion = valor;
            }

            // Recalcular la tabla
            generarTabla();
        });

        // Prevenir pegado de texto no numérico
        newCelda.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numbersOnly = pastedText.replace(/[^0-9.]/g, '');

            // Insertar el texto limpio
            document.execCommand('insertText', false, numbersOnly);
        });

        // Validación en keydown
        newCelda.addEventListener('keydown', (e) => {
            // Permitir todas las teclas de control y navegación
            const allowedControls = [
                'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
                'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End',
                'Enter', 'Escape'
            ];

            if (allowedControls.includes(e.key)) {
                return true;
            }

            // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            if (e.ctrlKey || e.metaKey) {
                return true;
            }

            // Solo permitir números y un solo punto
            if (!/[\d.]/.test(e.key)) {
                e.preventDefault();
                return false;
            }

            // Si es punto, verificar que no exista ya uno
            if (e.key === '.' && newCelda.innerText.includes('.')) {
                e.preventDefault();
                return false;
            }

            return true;
        });

        newCelda.addEventListener("keydown", (e) => {
            if (e.key == "Enter") {
                e.preventDefault();
                newCelda.blur(); // Aplicar formato al presionar Enter
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
            const columnaTotal = 7 + (index * 2); // Columna de "Total"
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
    const propuesta = objetoPropuestasSeleccionadas.find(
        p => p.idpropuesta == idPropuesta
    );

    const objetoPropuesta = [];

    Object.values(selectedRows).forEach(concepto => {
        const aux = AuxPropuestas.find(
            a => a.idconcepto == concepto.idconcepto &&
                a.idpropuesta == idPropuesta
        );

        if (!aux) return;

        const precioOriginal =
            preciosOriginales?.[idPropuesta]?.[concepto.idconcepto];

        // 👉 Solo si es nuevo o cambió
        if (precioOriginal === undefined || precioOriginal != aux.precio) {
            objetoPropuesta.push({
                idpropuesta: propuesta.idpropuesta,
                idconcepto: concepto.idconcepto,
                precio: aux.precio
            });
        }
    });

    if (objetoPropuesta.length === 0) {
        mensajePantalla("No hay cambios para guardar", false);
        return;
    }

    console.log(objetoPropuesta);
    GuardarDatosAuxPropuesta(objetoPropuesta);
}

function GuardarDatosAuxPropuesta(objPropuesta) {

    let url = "../ws/AuxPropuestas/wsAddAuxPropuesta.php";
    $.post(url, JSON.stringify(objPropuesta), (responseText) => {
        let resp = JSON.parse(responseText);
        if (resp.estado === "OK") {
            mensajePantalla("Precios actualizados", true);
        }
    });
    // console.log(objPropuesta)
    // let url = "../ws/AuxPropuestas/wsAddAuxPropuesta.php";
    // objPropuesta.forEach(auxPropuesta => {
    //     let json = JSON.stringify(auxPropuesta);

    //     $.post(url, json, (responseText, status) => {
    //         try {
    //             if (status == "success") {
    //                 let resp = JSON.parse(responseText);
    //                 if (resp.estado == "OK") {
    //                     // Actualizar los precios originales con los nuevos precios guardados
    //                     if (!preciosOriginales[auxPropuesta.idpropuesta]) {
    //                         preciosOriginales[auxPropuesta.idpropuesta] = {};
    //                     }
    //                     preciosOriginales[auxPropuesta.idpropuesta][auxPropuesta.idconcepto] = auxPropuesta.precio;
    //                     mensajePantalla("Precios actualizados", true);
    //                 }
    //             } else {
    //                 throw e = status;
    //             }
    //         } catch (error) {
    //             alert("Error: " + error)
    //         }
    //     });
    // });
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
    let columTable;
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ICM");

    // Cargar la imagen como base64
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

    // Obtener la tabla ICM
    const tabla = document.getElementById("tabla-ICM");
    const thead = tabla.querySelector("thead");
    const tbody = tabla.querySelector("tbody");

    // Calcular el número de columnas dinámicamente
    const numColumnas = thead.querySelector("tr").children.length;
    const numProveedores = obtenerPropuestasSeleccionados().length;
    const totalColumnas = numColumnas + numProveedores + 1;

    // Función para obtener letra de columna
    function getExcelColumnLetter(colNumber) {
        let letter = "";
        while (colNumber > 0) {
            let remainder = (colNumber - 1) % 26;
            letter = String.fromCharCode(65 + remainder) + letter;
            colNumber = Math.floor((colNumber - 1) / 26);
        }
        return letter;
    }

    // Calcular las columnas específicas
    const lastColLetter = getExcelColumnLetter(totalColumnas);           // Última (M)
    const secondLastColLetter = getExcelColumnLetter(totalColumnas - 1); // Penúltima (L)
    const thirdLastColLetter = getExcelColumnLetter(totalColumnas - 2);  // Antepenúltima (K)
    const thirdLastMinusOneLetter = getExcelColumnLetter(totalColumnas - 3); // Antepenúltima-1 (J)

    // --- ENCABEZADO INFORMATIVO SEGÚN ESPECIFICACIÓN ---

    // Fila 1: División de Distribución Jalisco A1:(Antepenultima)1
    if (isExpProy) {
        columTable = 7;
        worksheet.mergeCells(`A1:${thirdLastColLetter}1`);
        const main1 = worksheet.getCell("A1");
        main1.value = "División de Distribución Jalisco";
        main1.font = { bold: true, size: 15, color: { argb: "#000" } };
        main1.alignment = { horizontal: "center", vertical: "middle" };

        // Fila 2: Subgerencia de Distribución A2:(Antepenultima)2
        worksheet.mergeCells(`A2:${thirdLastColLetter}2`);
        const main2 = worksheet.getCell("A2");
        main2.value = "Subgerencia de Distribución";
        main2.font = { bold: true, size: 15, color: { argb: "#000" } };
        main2.alignment = { horizontal: "center", vertical: "middle" };

        // Fila 3: Departamento Divisional de Planeación A3:(Antepenultima)3
        worksheet.mergeCells(`A3:${thirdLastColLetter}3`);
        const main3 = worksheet.getCell("A3");
        main3.value = "Departamento Divisional de Planeación";
        main3.font = { bold: true, size: 13, color: { argb: "#000" } };
        main3.alignment = { horizontal: "center", vertical: "middle" };

        // Fila 4-5: Obra: B4:B5 y Nombreobra C4:(Antepenultima-1)5
        worksheet.mergeCells(`B4:B5`);
        const obraLabel = worksheet.getCell("B4");
        obraLabel.value = "Obra:";
        obraLabel.font = { size: 12, color: { argb: "#000" } };
        obraLabel.alignment = { horizontal: "center", vertical: "middle" };

        worksheet.mergeCells(`C4:${thirdLastMinusOneLetter}5`);
        const nombreObraCell = worksheet.getCell("C4");
        nombreObraCell.value = datosProyecto.nombre;
        nombreObraCell.font = { bold: true, size: 10, color: { argb: "#000" } };
        nombreObraCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };

        // INFORMACIÓN ADICIONAL EN ÚLTIMAS COLUMNAS
        // Fila 1: División de Distribución Jalisco (Penultima:Ultima)1
        worksheet.mergeCells(`${secondLastColLetter}1:${lastColLetter}1`);
        const divAdicional = worksheet.getCell(`${secondLastColLetter}1`);
        divAdicional.value = "División de Distribución Jalisco";
        divAdicional.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
        divAdicional.alignment = { horizontal: "right", vertical: "middle" };

        // Fila 2: Zona (Penultima:Ultima)2
        worksheet.mergeCells(`${secondLastColLetter}2:${lastColLetter}2`);
        const zonaCell = worksheet.getCell(`${secondLastColLetter}2`);
        zonaCell.value = "Zona " + datosProyecto.zona;
        zonaCell.font = { bold: true, size: 9, color: { argb: "FF008e5a" } };
        zonaCell.alignment = { horizontal: "right", vertical: "middle" };

        // Fila 3-4: Departamento (Penultima:Ultima)3:4
        worksheet.mergeCells(`${secondLastColLetter}3:${lastColLetter}4`);
        const deptoCell = worksheet.getCell(`${secondLastColLetter}3`);
        deptoCell.value = "Departamento de Planeación, Proyectos y Construcción";
        deptoCell.font = { bold: true, size: 8, color: { argb: "FF008e5a" } };
        deptoCell.alignment = { horizontal: "right", vertical: "middle", wrapText: true };

        // Fila 5-6: Fecha (Antepenultima:Antepenultima)5:6 y TextoFecha (Penultima:Ultima)5:6
        worksheet.mergeCells(`${thirdLastColLetter}5:${thirdLastColLetter}6`);
        const fechaLabel = worksheet.getCell(`${thirdLastColLetter}5`);
        fechaLabel.value = "Fecha:";
        fechaLabel.font = { size: 10, color: { argb: "#000" } };
        fechaLabel.alignment = { horizontal: "right", vertical: "middle" };
        fechaLabel.border = { bottom: { style: "thin" } };

        worksheet.mergeCells(`${secondLastColLetter}5:${lastColLetter}6`);
        const fechaValue = worksheet.getCell(`${secondLastColLetter}5`);
        fechaValue.value = ObtenerFechaActualDMY();
        fechaValue.font = { size: 10, color: { argb: "#000" } };
        fechaValue.alignment = { horizontal: "center", vertical: "middle" };
        fechaValue.border = { bottom: { style: "thin" } };

        // Fila 6: Investigación de Condiciones de Mercado A6:(Antepenultima-1)6
        worksheet.mergeCells(`A6:${thirdLastMinusOneLetter}6`);
        const titleCell = worksheet.getCell("A6");
        titleCell.value = "Investigación de Condiciones de Mercado";
        titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        titleCell.border = { bottom: { style: "thin" } };


    } else {//**************************************** */

        columTable = 5;
        worksheet.mergeCells(`A1:${thirdLastColLetter}1`);
        const main1 = worksheet.getCell("A1");
        main1.value = "División de Distribución Jalisco";
        main1.font = { bold: true, size: 15, color: { argb: "#000" } };
        main1.alignment = { horizontal: "center", vertical: "middle" };

        // Fila 2: Subgerencia de Distribución A2:(Antepenultima)2
        worksheet.mergeCells(`A2:${thirdLastColLetter}2`);
        const main2 = worksheet.getCell("A2");
        main2.value = "Subgerencia de Distribución";
        main2.font = { bold: true, size: 15, color: { argb: "#000" } };
        main2.alignment = { horizontal: "center", vertical: "middle" };

        // Fila 3: Departamento Divisional de Planeación A3:(Antepenultima)3
        worksheet.mergeCells(`A3:${thirdLastColLetter}3`);
        const main3 = worksheet.getCell("A3");
        main3.value = "Departamento Divisional de Planeación";
        main3.font = { bold: true, size: 13, color: { argb: "#000" } };
        main3.alignment = { horizontal: "center", vertical: "middle" };

        // INFORMACIÓN ADICIONAL EN ÚLTIMAS COLUMNAS
        // Fila 1: División de Distribución Jalisco (Penultima:Ultima)1
        worksheet.mergeCells(`${secondLastColLetter}1:${lastColLetter}1`);
        const divAdicional = worksheet.getCell(`${secondLastColLetter}1`);
        divAdicional.value = "División de Distribución Jalisco";
        divAdicional.font = { bold: true, size: 10, color: { argb: "FF008e5a" } };
        divAdicional.alignment = { horizontal: "right", vertical: "middle" };


        // Fila 3-4: Departamento (Penultima:Ultima)3:4
        worksheet.mergeCells(`${secondLastColLetter}2:${lastColLetter}3`);
        const deptoCell = worksheet.getCell(`${secondLastColLetter}3`);
        deptoCell.value = "Departamento de Planeación, Proyectos y Construcción";
        deptoCell.font = { bold: true, size: 8, color: { argb: "FF008e5a" } };
        deptoCell.alignment = { horizontal: "right", vertical: "middle", wrapText: true };

        // Fila 5-6: Fecha (Antepenultima:Antepenultima)5:6 y TextoFecha (Penultima:Ultima)5:6
        worksheet.mergeCells(`${secondLastColLetter}4:${secondLastColLetter}4`);
        const fechaLabel = worksheet.getCell(`${secondLastColLetter}4`);
        fechaLabel.value = "Fecha:";
        fechaLabel.font = { size: 10, color: { argb: "#000" } };
        fechaLabel.alignment = { horizontal: "right", vertical: "middle" };
        fechaLabel.border = { bottom: { style: "thin" } };

        worksheet.mergeCells(`${lastColLetter}4:${lastColLetter}4`);
        const fechaValue = worksheet.getCell(`${lastColLetter}4`);
        fechaValue.value = ObtenerFechaActualDMY();
        fechaValue.font = { size: 10, color: { argb: "#000" } };
        fechaValue.alignment = { horizontal: "center", vertical: "middle" };
        fechaValue.border = { bottom: { style: "thin" } };

        // Fila 6: Investigación de Condiciones de Mercado A6:(Antepenultima-1)6
        worksheet.mergeCells(`A4:${thirdLastColLetter}4`);
        const titleCell = worksheet.getCell("A4");
        titleCell.value = "Investigación de Condiciones de Mercado";
        titleCell.font = { bold: true, size: 14, color: { argb: "FF008e5a" } };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        titleCell.border = { bottom: { style: "thin" } };
    }
    // --- FIN ENCABEZADO INFORMATIVO ---

    // --- ENCABEZADOS DE TABLA (comenzando en fila 7) ---
    const headerRows = [
        ["", "", "", "", "", "Proveedor", "Proveedor"],
        ["", "", "", "", "", "No. de propuesta", ""],
        ["No.", "Id", "Descripción", "Cantidad", "Unidad", "Fecha (mm/aaaa)", ""],
        ["", "", "", "", "", "Inflación INEGI", ""],
        ["", "", "", "", "", "CFE", ""],
        ["", "", "", "", "", "PU", "Importe"]  // ← AQUÍ ESTÁ EL CAMBIO
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

    headerRows.forEach((row, rowIndex) => {
        const excelRow = worksheet.addRow(row);

        excelRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008e5a" } };
            cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };

            const isFirstFiveColumns = colNumber <= 5;
            const isLastTwoColumns = colNumber > totalColumnas - 2;
            const isMiddleColumns = !isFirstFiveColumns && !isLastTwoColumns;

            const isTopRow = rowIndex === 0;
            const isBottomRow = rowIndex === headerRows.length - 1;

            if (isMiddleColumns) {
                // 🔸 Columnas intermedias (proveedores): borde completo en cada celda
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };
            } else {
                // 🔸 Columnas fijas (1–5 y últimas 2): bordes externos completos
                const isLeftOuterColumn =
                    (isFirstFiveColumns && colNumber === 1) || (isLastTwoColumns && colNumber === totalColumnas - 1);
                const isRightOuterColumn =
                    (isFirstFiveColumns && colNumber === 5) || (isLastTwoColumns && colNumber === totalColumnas);

                cell.border = {
                    top: isTopRow ? { style: "thin" } : { style: "none" },
                    bottom: isBottomRow ? { style: "thin" } : { style: "none" },
                    left: isLeftOuterColumn ? { style: "thin" } : { style: "thin" },
                    right: isRightOuterColumn ? { style: "thin" } : { style: "thin" }
                };
            }
        });

        // --- Combinar celdas de proveedores ---
        if (rowIndex >= 0 && rowIndex <= 4) {
            let colIndex = 6;
            const rowNumber = rowIndex + columTable; // Ajusta según tu posición real
            obtenerPropuestasSeleccionados().forEach(() => {
                worksheet.mergeCells(
                    `${getExcelColumnLetter(colIndex)}${rowNumber}:${getExcelColumnLetter(colIndex + 1)}${rowNumber}`
                );
                colIndex += 2;
            });

            // Combinar las dos últimas columnas
            worksheet.mergeCells(
                `${getExcelColumnLetter(colIndex)}${rowNumber}:${getExcelColumnLetter(colIndex + 1)}${rowNumber}`
            );
        }
    });



    // Resto del código para datos y totales (ajustar números de fila +1)
    const rows = tbody.querySelectorAll("tr");
    rows.forEach((row, rowIndex) => {
        if (rowIndex < rows.length - 2) {
            const cells = row.querySelectorAll("td");
            const rowData = Array.from(cells).map(cell => {
                // Limpiar el contenido removiendo el signo $ y cualquier formato de moneda
                let content = cell.innerText;

                // Remover signo $ y espacios extra
                content = content.replace(/\$/g, '').trim();

                // Si es un número con formato mexicano (1,000.00), mantenerlo como string
                // para que Excel no lo interprete automáticamente como moneda
                if (/^[\d,]+\.?\d*$/.test(content)) {
                    // Si tiene comas (formato de miles), mantenerlo como texto
                    if (content.includes(',')) {
                        return content;
                    }
                    // Si es un número simple, convertirlo a número
                    return parseFloat(content.replace(/,/g, ''));
                }

                return content;
            });

            const excelRow = worksheet.addRow(rowData);

            // Aplicar color alterno a las filas
            excelRow.eachCell((cell, colNumber) => {
                if (rowIndex % 2 === 0) {
                    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } };
                } else {
                    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } };
                }

                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };

                // Aplicar formato numérico a las columnas que contienen dinero
                // Asumiendo que las columnas de dinero son desde la 6 en adelante (proveedores, promedios, etc.)
                if (colNumber >= 6) {
                    // Si el contenido es numérico, aplicar formato numérico sin símbolo de moneda
                    if (typeof cell.value === 'number') {
                        cell.numFmt = '#,##0.00';
                    } else if (typeof cell.value === 'string' && /^[\d,]+\.?\d*$/.test(cell.value)) {
                        // Si es string pero parece número, convertirlo y formatearlo
                        const numericValue = parseFloat(cell.value.replace(/,/g, ''));
                        if (!isNaN(numericValue)) {
                            cell.value = numericValue;
                            cell.numFmt = '#,##0.00';
                        }
                    }
                }

                if (colNumber == 2 || colNumber == 3 || colNumber == 5) {
                    cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
                } else {
                    cell.alignment = { horizontal: "right", vertical: "middle", wrapText: true };
                }
            });

            const cellHeights = rowData.map(cell => {
                const content = typeof cell === 'string' ? cell : String(cell);
                return content.split('\n').length * 15;
            });
            const maxHeight = Math.max(...cellHeights);
            excelRow.height = maxHeight;
        }
    });

    // Agregar fila de totales (ajustar números de fila)
    const filaTotales = worksheet.addRow([]);

    // Limpiar los valores de los totales también
    const cleanTotalCFE = document.querySelector(".total-cantidad-total").innerText.replace(/\$/g, '').trim();
    const cleanTotalICM = document.querySelector(".total-promedio-pu-cantidad").innerText.replace(/\$/g, '').trim();

    filaTotales.getCell(6).value = "Importe CFE:";
    filaTotales.getCell(6).alignment = { horizontal: "right", vertical: "middle" };
    filaTotales.getCell(6).font = { bold: true };
    filaTotales.getCell(6).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };

    filaTotales.getCell(7).value = parseFloat(cleanTotalCFE.replace(/,/g, ''));
    filaTotales.getCell(7).numFmt = '#,##0.00';
    filaTotales.getCell(7).alignment = { horizontal: "right", vertical: "middle" };
    filaTotales.getCell(7).font = { bold: true };
    filaTotales.getCell(7).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };

    filaTotales.getCell(totalColumnas - 1).value = "Importe ICM:";
    filaTotales.getCell(totalColumnas - 1).alignment = { horizontal: "right", vertical: "middle" };
    filaTotales.getCell(totalColumnas - 1).font = { bold: true };
    filaTotales.getCell(totalColumnas - 1).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };

    filaTotales.getCell(totalColumnas).value = parseFloat(cleanTotalICM.replace(/,/g, ''));
    filaTotales.getCell(totalColumnas).numFmt = '#,##0.00';
    filaTotales.getCell(totalColumnas).alignment = { horizontal: "right", vertical: "middle" };
    filaTotales.getCell(totalColumnas).font = { bold: true };
    filaTotales.getCell(totalColumnas).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };

    // Ajustar el ancho de las columnas
    worksheet.columns = Array.from({ length: totalColumnas }, (_, i) => ({
        width: i === 2 ? 90 : 20,
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
    const doc = new jsPDF('landscape', 'pt', 'letter');
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
                fontSize: 7,
                lineWidth: 0.5,
                lineColor: [0, 0, 0]
            }
        }));
        headers.push(rowData);
    });

    // Obtener filas
    const allRows = tbody.querySelectorAll("tr");
    allRows.forEach((row, rowIndex) => {
        if (rowIndex !== allRows.length - 2 && rowIndex !== allRows.length - 1) {
            const rowData = Array.from(row.querySelectorAll("td")).map((cell, cellIndex) => {
                let halign = 'right';
                if (cellIndex === 0) halign = 'right';
                else if (cellIndex === 1) halign = 'left';
                else if (cellIndex === 2) halign = 'justify';
                else if (cellIndex === 3) halign = 'right';
                else if (cellIndex === 4) halign = 'left';

                return {
                    content: cell.innerText,
                    styles: {
                        halign: halign,
                        fontSize: 6,
                        lineWidth: 0.5,
                        lineColor: [0, 0, 0],
                        overflow: 'linebreak',
                        cellPadding: 2,
                        minCellHeight: 10
                    }
                };
            });
            rows.push(rowData);
        }
    });

    // Calcular la altura del título de la obra ANTES de crear la tabla
    let obraTitleHeight = 0;
    if (isExpProy) {
        const tempDoc = new jsPDF('landscape', 'pt', 'letter');
        const pageWidth = tempDoc.internal.pageSize.width;
        const maxWidth = pageWidth - 46; // Margen de 23pt a cada lado
        const splitObraText = tempDoc.splitTextToSize("Obra: " + datosProyecto.nombre, maxWidth);
        obraTitleHeight = splitObraText.length * 15; // Aproximadamente 15pt por línea
    }

    // Calcular startY dinámico basado en si hay título de obra
    const baseStartY = 120;
    const firstPageStartY = isExpProy ? baseStartY + obraTitleHeight : baseStartY;
    const otherPagesStartY = baseStartY;

    let pageNumber = 0;
    let currentStartY = firstPageStartY;

    // Agregar la tabla al PDF usando autoTable
    doc.autoTable({
        head: headers,
        body: rows,
        startY: firstPageStartY,
        styles: {
            fontSize: 6,
            cellPadding: 2,
            overflow: 'linebreak',
            halign: 'center',
            valign: 'middle',
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
            margin: { top: 5, right: 5, bottom: 5, left: 5 },
            minCellHeight: 10
        },
        headStyles: {
            fillColor: [0, 142, 90],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 7,
            lineWidth: 0.5,
            lineColor: [0, 0, 0]
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240],
        },
        margin: { top: firstPageStartY, right: 23, bottom: 40, left: 23 },
        columnStyles: {
            0: { cellWidth: 35, halign: 'right' },
            1: { cellWidth: 35, halign: 'left' },
            2: { cellWidth: 150, halign: 'justify' },
            3: { cellWidth: 35, halign: 'right' },
            4: { cellWidth: 35, halign: 'left' },
        },
        didDrawPage: (data) => {
            pageNumber += 1;

            // Determinar el startY correcto para esta página
            if (pageNumber === 0) {
                currentStartY = firstPageStartY;
            } else {
                currentStartY = otherPagesStartY;
            }

            addHeader(doc, pageNumber, obraTitleHeight);
            addImage(doc);

            // Agregar título de la tabla con posición ajustada
            const titleY = addTitle(doc, pageNumber, obraTitleHeight);

            // Actualizar el startY para esta página
            data.settings.startY = currentStartY;
            data.settings.margin.top = currentStartY;
        },
        willDrawPage: (data) => {
            // Asegurar que las páginas siguientes usen el startY correcto
            if (pageNumber > 1) {
                data.settings.startY = otherPagesStartY;
                data.settings.margin.top = otherPagesStartY;
            }
        },
        didParseCell: (data) => {
            if (data.cell.raw.content.length > 100) {
                data.cell.styles.minCellHeight = 20;
            }
        },
        willDrawCell: (data) => {
            if (data.cell.raw.content.length > 100 && data.cursor.y + data.cell.height > doc.internal.pageSize.height - 40) {
                doc.addPage();
                data.cursor.y = otherPagesStartY;
            }
        },
        pageBreak: 'auto'
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
        startY: doc.lastAutoTable.finalY + 20,
        styles: {
            fontSize: 6,
            cellPadding: 2,
            overflow: 'linebreak',
            halign: 'center',
            valign: 'middle',
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
            minCellHeight: 10
        },
        margin: { top: doc.lastAutoTable.finalY + 10, right: 23, bottom: 40, left: 23 },
        columnStyles: {
            0: { cellWidth: 35, halign: 'right' },
            1: { cellWidth: 35, halign: 'left' },
            2: { cellWidth: 150, halign: 'justify' },
            3: { cellWidth: 35, halign: 'right' },
            4: { cellWidth: 35, halign: 'left' },
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

    // Encabezado condicional basado en isExpProy
    function addHeader(doc, pageNumber, obraTitleHeight) {
        const pageWidth = doc.internal.pageSize.width;
        const marginRight = 1.5 * 28.35;
        const headerX = pageWidth - marginRight;
        const headerYStart = 50;

        doc.setTextColor(0, 142, 90);

        // Línea 1 - Siempre presente
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        const line1 = "División de Distribución Jalisco";
        doc.text(line1, headerX, headerYStart, { align: "right" });

        let currentY = headerYStart + 10;

        // Si es proyecto, agregar zona y obra
        if (isExpProy) {
            // Línea 2 - Zona (solo para proyectos)
            doc.setFont("helvetica", "normal"); // Cambiado a normal en lugar de oblique
            doc.setFontSize(10);
            const line2 = "Zona " + datosProyecto.zona;
            doc.text(line2, headerX, currentY, { align: "right" });
            currentY += 11;

            // Línea 3 - Departamento
            doc.setFontSize(9);
            const line3 = "Departamento de Planeación, Proyectos y Construcción";
            doc.text(line3, headerX, currentY, { align: "right" });
            currentY += 12;

            // Línea 4 - Fecha (para proyectos)
            doc.setFontSize(9);
            const line4 = "Fecha: " + ObtenerFechaActualDMY();
            doc.text(line4, headerX, currentY, { align: "right" });
        } else {
            // Si no es proyecto, solo departamento y fecha
            // Línea 2 - Departamento
            doc.setFontSize(9);
            const line2 = "Departamento de Planeación, Proyectos y Construcción";
            doc.text(line2, headerX, currentY, { align: "right" });
            currentY += 10;

            // Línea 3 - Fecha (para no proyectos)
            doc.setFontSize(9);
            const line3 = "Fecha: " + ObtenerFechaActualDMY();
            doc.text(line3, headerX, currentY + 1, { align: "right" });
        }
    }

    // Agregar título de la tabla con posición ajustada
    function addTitle(doc, pageNumber, obraTitleHeight) {
        const pageWidth = doc.internal.pageSize.width;
        const titleX = pageWidth / 2;

        // Ajustar posición Y según si es primera página y si hay título de obra
        let titleY;
        if (pageNumber === 1 && isExpProy) {
            // Primera página con obra: después del título de la obra
            titleY = 100 + obraTitleHeight;
        } else {
            // Páginas siguientes o sin proyecto: posición fija
            titleY = 100;
        }

        doc.setFontSize(13);
        doc.setTextColor(0, 142, 90);
        doc.text("Investigación de Condiciones de Mercado", titleX, titleY, { align: "center" });

        // Agregar título de la obra solo en primera página si es proyecto
        if (pageNumber === 1 && isExpProy) {
            const obraText = "Obra: " + datosProyecto.nombre;
            const maxWidth = pageWidth - 46; // Margen de 23pt a cada lado
            const splitObraText = doc.splitTextToSize(obraText, maxWidth);

            doc.setFont("helvetica", "normal"); // Sin negritas
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);

            // Posicionar el título de la obra antes del título de la tabla
            const obraY = 105; // Bajado un poco más
            doc.text(splitObraText, titleX, obraY, { align: "center" });
        }

        return titleY;
    }

    // Pie de página centrado
    function addFooter(doc, pageNumber, totalPages) {
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const footerY = pageHeight - 20;

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        const pageText = `Página ${pageNumber} de ${totalPages}`;
        const textWidth = doc.getTextWidth(pageText);

        doc.text(pageText, (pageWidth - textWidth) / 2, footerY);
    }

    // Agregar imagen
    function addImage(doc) {
        const imageUrl = urlImagenLogo;
        const marginLeft = 1.5 * 28.35;
        const marginTop = 1.5 * 28.35;
        const imageWidth = 135;
        const imageHeight = 45;

        doc.addImage(imageUrl, 'PNG', marginLeft, marginTop, imageWidth, imageHeight);
    }
}