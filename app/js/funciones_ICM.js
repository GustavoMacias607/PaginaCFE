let Proveedores;
let selectedProveedores = [];
let AuxProvedores = [];
let preciosOriginales = {};
function llenarCamposPaginaICM() {
    selectedProveedores = [];
    let id = document.getElementById("lblId").innerHTML = datosProyecto.idProyecto;
    let zona = document.getElementById("lblZona").innerHTML = datosProyecto.zona;
    let tipoObra = document.getElementById("lblTipoObra").innerHTML = datosProyecto.obra;
    let fechaInicio = document.getElementById("lblFechaInicio").innerHTML = formatearFecha(datosProyecto.fechaInicio);
    let fechaTermino = document.getElementById("lblFechaTermino").innerHTML = formatearFecha(datosProyecto.fechaTermino);
    let nombre = document.getElementById("lblNombre").value = datosProyecto.nombre;
    let periodo = document.getElementById("lblPeriodo").innerHTML = datosProyecto.periodo;
    GetProveedores();
    generarEncabezados();
    generarTabla();
}

function GetProveedores() {
    let json = "";
    let url = "../ws/Proveedor/wsGetProveedor.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    // Agregar el atributo "inflacion" con valor 0 a cada proveedor
                    Proveedores = resp.datos.map(proveedor => ({
                        ...proveedor,
                        inflacion: 0
                    }));
                    generarTablaProveedores();
                    GetAuxProveedores();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}

function GetAuxProveedores() {
    let json = "";
    let url = "../ws/AuxProveedor/wsGetAuxProveedor.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    AuxProvedores = resp.datos;
                    // Guardar los precios originales
                    AuxProvedores.forEach(aux => {
                        if (!preciosOriginales[aux.idproveedor]) {
                            preciosOriginales[aux.idproveedor] = {};
                        }
                        preciosOriginales[aux.idproveedor][aux.idconcepto] = aux.precio;
                    });
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}

// Función para generar la tabla de selección de proveedores
function generarTablaProveedores() {
    const tabla = document.getElementById("tabla-proveedores");
    const tbody = tabla.querySelector("tbody");

    // Limpiar la tabla
    tbody.innerHTML = "";

    // Llenar la tabla con los proveedores
    Proveedores.forEach(proveedor => {
        const fila = document.createElement("tr");
        fila.classList.add('fila');
        fila.innerHTML = `
            <td>${proveedor.nombreprov}</td>
            <td class="estatus" style="width: 8rem;">
                <div style="display: flex; justify-content: space-around; align-items: center;">
                    <input type="checkbox" 
                           class="custom-checkbox" 
                           id="checkbox_${proveedor.idproveedor}" 
                           value="${proveedor.idproveedor}"
                           ${selectedProveedores.includes(proveedor.idproveedor) ? 'checked' : ''}>
                    <label for="checkbox_${proveedor.idproveedor}" class="checkbox-design"></label>
                    <i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;" alt="Modificar" 
                       onclick="modificarProveedor(${proveedor.idproveedor},'${proveedor.nombreprov}','${proveedor.nopropuesta}','${proveedor.fechaprov}')"></i>
                </div>
            </td>
        `;
        tbody.appendChild(fila);
    });

    // Agregar evento para actualizar la tabla principal al cambiar la selección
    const checkboxes = document.querySelectorAll("#tabla-proveedores input");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            const idProveedor = parseInt(checkbox.value);
            console.log(idProveedor);
            if (checkbox.checked) {
                selectedProveedores.push(idProveedor);
                // Asegurarse de que los precios sean 0 si no existen
                AuxProvedores = AuxProvedores.map(aux => {
                    if (aux.idproveedor == idProveedor && aux.precio == undefined) {
                        return {
                            ...aux,
                            precio: 0
                        };
                    }
                    return aux;
                });
            } else {
                selectedProveedores = selectedProveedores.filter(id => id !== idProveedor);
                // Restaurar los precios originales
                AuxProvedores = AuxProvedores.map(aux => {
                    if (aux.idproveedor == idProveedor) {
                        return {
                            ...aux,
                            precio: preciosOriginales[idProveedor] && preciosOriginales[idProveedor][aux.idconcepto] !== undefined
                                ? preciosOriginales[idProveedor][aux.idconcepto]
                                : 0 // Restablecer a 0 si no se encuentra en preciosOriginales
                        };
                    }
                    return aux;
                });
            }
            generarEncabezados();
            generarTabla();
        });
    });
}
// Función para obtener los proveedores seleccionados
function obtenerProveedoresSeleccionados() {
    const checkboxes = document.querySelectorAll("#tabla-proveedores input:checked");
    if (checkboxes.length == 0) {
        return [];
    }
    const seleccionados = Array.from(checkboxes).map(checkbox => parseInt(checkbox.value));
    return Proveedores.filter(proveedor => seleccionados.includes(proveedor.idproveedor));
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
        <th colspan="2" style="min-width: 16rem; width: 16rem">Concursante</th>
        ${obtenerProveedoresSeleccionados().map(proveedor => `
            <th style="min-width: 16rem; width: 16rem;" colspan="2">${proveedor.nombreprov}</th>
        `).join("")}
        <th rowspan="6" style="min-width: 8rem; width: 8rem;">Promedio PU</th>
        <th rowspan="6" style="min-width: 8rem; width: 8rem;">Importe</th>
    `;
    thead.appendChild(fila1);

    // Crear la segunda fila de encabezados
    const fila2 = document.createElement("tr");
    fila2.innerHTML = `
        <th colspan="2">No. de propuesta</th>
        ${obtenerProveedoresSeleccionados().map(proveedor => `
            <th style="min-width: 16rem; width: 16rem;" colspan="2">${proveedor.nopropuesta}</th>
        `).join("")}
    `;
    thead.appendChild(fila2);

    // Crear la tercera fila de encabezados
    const fila3 = document.createElement("tr");
    fila3.innerHTML = `
        <th colspan="2">Fecha (dd/mm/aaaa)</th>
        ${obtenerProveedoresSeleccionados().map(proveedor => {
        const [year, month] = proveedor.fechaprov.split('-');
        const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
        return `<th style="min-width: 16rem; width: 16rem;" colspan="2">${monthNames[parseInt(month) - 1]}-${year.slice(-2)}</th>`;
    }).join("")}
    `;
    thead.appendChild(fila3);

    // Crear la cuarta fila de encabezados
    const fila4 = document.createElement("tr");
    fila4.innerHTML = `
        <th colspan="2" style="min-width: 12rem; width: 12rem;">Inflación INEGI</th>
        ${obtenerProveedoresSeleccionados().map(proveedor => `
            <th style="min-width: 16rem; width: 16rem;" colspan="2" class="editable-inflacion" data-id="${proveedor.idproveedor}" contenteditable="true">
                ${parseFloat(proveedor.inflacion).toFixed(2)}%
            </th>
        `).join("")}
    `;
    thead.appendChild(fila4);

    // Crear la quinta fila de encabezados
    const fila5 = document.createElement("tr");
    fila5.innerHTML = `
        <th colspan="2" style="min-width: 12rem; width: 12rem;">CFE</th>
        ${obtenerProveedoresSeleccionados().map(() => `
            <th style="min-width: 16rem; width: 16rem;" colspan="2">Concursante</th>
        `).join("")}
    `;
    thead.appendChild(fila5);

    // Crear la sexta fila de encabezados
    const fila6 = document.createElement("tr");
    fila6.innerHTML = `
        <th style="min-width: 8rem; width: 8rem;">PU</th>
        <th style="min-width: 8rem; width: 8rem;">Importe</th>
        ${obtenerProveedoresSeleccionados().map(() => `
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

            // Actualizar la inflación en el array Proveedores
            const idProveedor = celda.getAttribute("data-id");
            const proveedor = Proveedores.find(p => p.idproveedor == idProveedor);
            if (proveedor) {
                proveedor.inflacion = valor;
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
    Object.values(editedRows).forEach(concepto => {
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
        obtenerProveedoresSeleccionados().forEach(proveedor => {
            let aux = AuxProvedores.find(aux => aux.idconcepto == concepto.idconcepto && aux.idproveedor == proveedor.idproveedor);
            if (!aux) {
                aux = { idconcepto: concepto.idconcepto, idproveedor: proveedor.idproveedor, precio: 0 };
                AuxProvedores.push(aux);
            }
            const precio = parseFloat(aux.precio);
            const totalConInflacion = precio * parseFloat((1 + proveedor.inflacion / 100));

            fila.innerHTML += `
                <td class="editable-pu textDer" data-id="${aux.idconcepto}" data-proveedor="${proveedor.idproveedor}" contenteditable="true">${formatoMXN(precio)}</td>
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

    // Agregar fila de botones para cada proveedor
    const filaBotones = document.createElement("tr");
    filaBotones.innerHTML = `
        <td colspan="6" style="text-align: right;"></td>
        ${obtenerProveedoresSeleccionados().map(proveedor => `
            <td class="textCen" colspan="2">
                <div id="btnAgregarProvee" class="modal-footer-zonas">
                    <button type="button" class="btn btn-primary btn-generar-datos" data-proveedor="${proveedor.idproveedor}"
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
        ${obtenerProveedoresSeleccionados().map(() => `
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

            // Actualizar el PU en el array AuxProvedores
            const idconcepto = celda.getAttribute("data-id");
            const idProveedor = celda.getAttribute("data-proveedor");
            const aux = AuxProvedores.find(a => a.idconcepto == idconcepto && a.idproveedor == idProveedor);
            if (aux) {
                aux.precio = valor;
            } else {
                AuxProvedores.push({ idconcepto, idproveedor: idProveedor, precio: valor });
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

    // Agregar evento a los botones para generar el objeto del proveedor
    const botones = document.querySelectorAll(".btn-generar-datos");
    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            const idProveedor = parseInt(boton.getAttribute("data-proveedor"));
            generarObjetoProveedor(idProveedor);
        });
    });
    recalcularTotales();
}

// Función para recalcular una fila
function recalcularFila(idconcepto) {
    const fila = document.querySelector(`tr td[data-id="${idconcepto}"]`).closest("tr");
    const concepto = Object.values(editedRows).find(c => c.idconcepto == idconcepto);

    if (concepto) {
        // Asegurarse de que los valores sean números válidos
        const cantidad = parseFloat(concepto.cantidad) || 0;
        const total = parseFloat(concepto.total) || 0;

        // Actualizar el campo "Cantidad * Total"
        const totalCalculado = fila.querySelector(".total-calculado");
        totalCalculado.textContent = formatoMXN(cantidad * total);

        // Recalcular las columnas de proveedores y el promedio
        let totalesConInflacion = [];
        obtenerProveedoresSeleccionados().forEach((proveedor, index) => {
            const aux = AuxProvedores.find(aux => aux.idconcepto == concepto.idconcepto && aux.idproveedor == proveedor.idproveedor);
            const precio = parseFloat(aux ? aux.precio : 0) || 0;
            const inflacion = parseFloat(proveedor.inflacion) || 0;
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

// Función para generar el objeto del proveedor
function generarObjetoProveedor(idProveedor) {
    const proveedor = Proveedores.find(p => p.idproveedor == idProveedor);
    const objetoProveedor = [];

    Object.values(editedRows).forEach(concepto => {
        const aux = AuxProvedores.find(aux => aux.idconcepto == concepto.idconcepto && aux.idproveedor == idProveedor);
        if (aux) {
            objetoProveedor.push({
                idproveedor: proveedor.idproveedor,
                nombreprov: proveedor.nombreprov,
                nopropuesta: proveedor.nopropuesta,
                fechaprov: proveedor.fechaprov,
                inflacion: proveedor.inflacion,
                idconcepto: concepto.idconcepto,
                precio: aux.precio,
            });
        }
    });
    EliminarDatosAuxProveedor(objetoProveedor);
}

function GuardarDatosAuxProveedor(objProveedor) {
    console.log(objProveedor);
    objProveedor.forEach(auxProveedor => {
        let json = JSON.stringify(auxProveedor);
        console.log(json);
        let url = "../ws/AuxProveedor/wsAddAuxProveedor.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == "success") {
                    let resp = JSON.parse(responseText);
                    if (resp.estado == "OK") {
                        // Actualizar los precios originales con los nuevos precios guardados
                        if (!preciosOriginales[auxProveedor.idproveedor]) {
                            preciosOriginales[auxProveedor.idproveedor] = {};
                        }
                        preciosOriginales[auxProveedor.idproveedor][auxProveedor.idconcepto] = auxProveedor.precio;
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

function EliminarDatosAuxProveedor(objProveedor) {
    let datos = {};
    datos.idproveedor = objProveedor[0].idproveedor;
    let json = JSON.stringify(datos);
    let url = "../ws/AuxProveedor/wsDelAuxProveedor.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                GuardarDatosAuxProveedor(objProveedor);
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function AddUpdProveedorValidar() {

    let vacio = false;
    let PrimerValorVacio;
    const datos = {};

    let nombre = document.querySelector('#txtNombreProveedor');
    if (nombre.value == "") {
        nombre.classList.add("inputVacio");
        nombre.placeholder = "Requerida el nombre del proveedor"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = nombre;
        }
    }
    datos.nombreProveedor = nombre.value;
    let propuesta = document.querySelector('#addNoPropuesta');
    if (propuesta.value == "") {
        propuesta.classList.add("inputVacio");
        propuesta.placeholder = "Requerido el No. propuesta"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = propuesta;
        }

    }
    datos.propuesta = propuesta.value;

    let fecha = document.querySelector('#AddFechaProv');
    if (fecha.value == "") {
        fecha.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = fecha;
        }
    }
    datos.fecha = fecha.value;

    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }

    let url = "";
    let msg = "";
    let btnGuardarForm = document.getElementById('btnGuardarForm');

    if (btnGuardarForm.innerHTML == "Agregar") {
        url = "../ws/Proveedor/wsAddProveedor.php";
        msg = "Proveedor agregado";

    } else {
        let idProv = document.getElementById('inputIdProv');
        datos.idProveedor = parseInt(idProv.value);
        url = "../ws/Proveedor/wsUpdProveedor.php";
        msg = "Proveedor modificado";
    }
    let json = JSON.stringify(datos);
    console.log(json)
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp)
                if (resp.estado == "OK") {
                    AddCerrarModal();
                    mensajePantalla(msg, true);
                    GetProveedores();
                }
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

function modificarProveedor(idproveedor, nombreprov, nopropuesta, fechaprov) {
    const seleccionados = obtenerProveedoresSeleccionados();
    if (seleccionados.some(proveedor => proveedor.idproveedor == idproveedor)) {
        mensajePantalla("Proveedor seleccionado", false)
    } else {
        llenarFormularioProveedores(idproveedor, nombreprov, nopropuesta, fechaprov);
        $('#AgregarModal').modal('show');
    }
}


function AbrirApartadoAgregar() {
    let tituloForm = document.querySelector("#tituloProveedores");
    tituloForm.innerHTML = "Agregar proveedor";

    let Nombre = document.querySelector('#txtNombreProveedor');
    let Propuesta = document.querySelector('#addNoPropuesta');
    let Fecha = document.querySelector('#AddFechaProv');
    Nombre.value = "";
    Propuesta.value = "";
    Fecha.value = "";

    Nombre.placeholder = "";
    Propuesta.placeholder = "";

    Nombre.classList.remove("inputVacio");
    Propuesta.classList.remove("inputVacio");
    Fecha.classList.remove("inputVacio");
}

function CerrarFormProv() {
    let apartadoForm = document.querySelector("#apartadoFormProve");
    apartadoForm.style.display = "none";
    let btnAgregar = document.querySelector("#btnAgregarProvee");
    btnAgregar.style.display = "block";

}

function llenarFormularioProveedores(idproveedor, nombre, propuesta, fecha) {
    document.getElementById('btnGuardarForm').innerHTML = "Guardar";
    let tituloForm = document.querySelector("#tituloProveedores");
    tituloForm.innerHTML = "Modificar proveedor";
    console.log(idproveedor, nombre, propuesta, fecha);

    let Nombre = document.querySelector('#txtNombreProveedor');
    let Propuesta = document.querySelector('#addNoPropuesta');
    let Fecha = document.querySelector('#AddFechaProv');
    let id = document.querySelector('#inputIdProv');
    id.value = idproveedor;
    Nombre.value = nombre;
    Propuesta.value = propuesta;
    Fecha.value = fecha;

    Nombre.placeholder = "";
    Propuesta.placeholder = "";

    Nombre.classList.remove("inputVacio");
    Propuesta.classList.remove("inputVacio");
    Fecha.classList.remove("inputVacio");

}
function MostrarProvedores() {

    let apartadoProv = document.querySelector("#apartadoTablaProve");
    if (apartadoProv.classList.contains("ApartadoProvedor")) {
        apartadoProv.classList.add("ocultarProvedor");
        apartadoProv.classList.remove("ApartadoProvedor");
        let btnMostrarProve = document.querySelector("#nomBtnMosProv");
        btnMostrarProve.innerHTML = "Mostrar proveedores";
    } else {
        apartadoProv.classList.remove("ocultarProvedor");
        apartadoProv.classList.add("ApartadoProvedor");
        let btnMostrarProve = document.querySelector("#nomBtnMosProv");
        btnMostrarProve.innerHTML = "Ocultar proveedores";

    }
}