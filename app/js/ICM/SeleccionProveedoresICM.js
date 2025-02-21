let ProveedoresICM;
let PropuestasICM;
let estatusProveedores = 1;
let estatusPropuestas = 1;
let msgEliminarProveedor = "Proveedor deshabilitado";
let msgActivarProveedor = "Proveedor habilitado";
let msgAgregarProveedor = "Proveedor agregado";
let msgModificarProveedor = "Proveedor modificado";
let IdPropuestaModificacion = 1;
let proveedorSeleccionado;


let objetoPropuestasSeleccionadas = [];



let filteredDataProveedores = [...data];
let filteredDataPropuestasModal = [...data];
function obtenerDatosProveedoresICM() {
    llenarSelectAnios();
    GetAuxPropuestas();
    displayTablePropuestasICMPagina();
    let json = "";
    let url = "../ws/Proveedor/wsGetProveedor.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    llenarZonaFiltro();
                    ProveedoresICM = resp.datos;
                    llenarTablaProveedoresICM();
                    filterDataProveedoresICM();
                }
            } else {
                throw status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}

function displayTableProveedoresICM(page) {
    const tableBody = document.getElementById("table-bodyProveedoresICM");
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredDataProveedores.slice(start, end);
    if (paginatedData.length > 0) {
        paginatedData.forEach(record => {
            const row = document.createElement('tr');
            row.classList.add('fila');
            row.style.cursor = "pointer";
            // Establecer el contenido HTML de la fila
            row.innerHTML = `
                <td class="Code">${record.idproveedor}</td>
                <td>${record.nombreprov != "" ? record.nombreprov : "---"}</td>
                <td class="estatus">
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        ${record.estatus == 1 ? `
                            <i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;" alt="Modificar" 
                               onclick="llenarFormularioProveedores(${record.idproveedor},'${record.nombreprov}')"></i>
                        ` : ``}
                        ${record.estatus == 1 ?
                    `<i class="coloresIcono fa-solid fa-square-check" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${record.idproveedor},${record.estatus})"></i>` :
                    `<i class="coloresIcono fa-solid fa-square" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${record.idproveedor},${record.estatus})"></i>`
                }
                    </div>
                </td>
            `;
            // Añadir eventos mouseover y mouseout
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));
            // Añadir evento dblclick
            row.addEventListener("dblclick", () => obtenerDatosPropuestasICM(record.idproveedor));
            // Añadir la fila al tbody
            tableBody.appendChild(row);
        });
    } else {
        const row = `
            <tr class="fila">
                <td colspan="6" class="Code">Sin resultados</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    }
}
function setupPaginationProveedorICM() {
    const paginationDiv = document.getElementById("paginationProveedores");
    paginationDiv.innerHTML = "";

    const totalPages = Math.ceil(filteredDataProveedores.length / rowsPerPage);
    const maxPagesToShow = 5; // Número máximo de páginas a mostrar
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
        // Mostrar todas las páginas si son menos o iguales a 5
        startPage = 1;
        endPage = totalPages;
    } else {
        const middle = Math.floor(maxPagesToShow / 2);

        if (currentPage <= middle) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + middle >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - middle;
            endPage = currentPage + middle;
        }
    }
    if (totalPages > 0) {
        // Botón de "Atrás"
        const prevButton = document.createElement("button");
        prevButton.innerHTML = `<i class="fa-solid fa-angles-left"></i>`;
        prevButton.style.backgroundColor = "#008e5a";
        prevButton.style.color = "#ffffff";
        prevButton.style.border = "3px solid #008e5a";
        prevButton.disabled = currentPage == 1;
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                displayTableProveedoresICM(currentPage);
                setupPaginationProveedorICM();
            }
        });
        paginationDiv.appendChild(prevButton);
        // Botones de página
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement("button");
            button.innerText = i;

            if (currentPage == i) {
                button.className = 'active';
                button.style.color = "#ffffff";
                button.style.border = "3px solid #008e5a";
                button.style.backgroundColor = "#008e5a";
            } else {
                button.style.color = "#008e5a";
                button.style.border = "3px solid #008e5a";
                button.style.backgroundColor = "#ffffff";
            }
            button.addEventListener("click", () => {
                currentPage = i;
                displayTableProveedoresICM(currentPage);
                setupPaginationProveedorICM();
            });
            paginationDiv.appendChild(button);
        }

        // Botón de "Adelante"
        const nextButton = document.createElement("button");
        nextButton.innerHTML = `<i class="fa-solid fa-angles-right"></i>`;
        nextButton.style.backgroundColor = "#008e5a";
        nextButton.style.color = "#ffffff";
        nextButton.style.border = "3px solid #008e5a";
        nextButton.disabled = currentPage == totalPages;
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayTableProveedoresICM(currentPage);
                setupPaginationProveedorICM();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

function filterDataProveedoresICM() {
    const searchText = document.getElementById("search-Proveedores").value.toLowerCase();
    const statusFilter = estatusProveedores; // Se debe cambiar según el campo de estatus en la BD
    filteredDataProveedores = ProveedoresICM.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value != null && value.toString().toLowerCase().includes(searchText)
        );
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesStatus;
    });

    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableProveedoresICM(currentPage);
    setupPaginationProveedorICM();
}

function llenarTablaProveedoresICM() {
    displayTableProveedoresICM(currentPage);
    setupPaginationProveedorICM();
    const searchInput = document.getElementById("search-Proveedores");
    searchInput.addEventListener("input", filterDataProveedoresICM);

    const rowsPerPageSelect = document.getElementById("rows-per-pageProveedores");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableProveedoresICM(currentPage);
        setupPaginationProveedorICM();
    });
}
function CambioEstatusProveedores() {
    const datos = {};
    let url = "../ws/Proveedor/wsEstatusProveedor.php";
    let msgzo = "";
    datos.idProveedor = idEliminar;
    if (ActivarS == 1) {
        datos.estatus = "Inactivo";
        msgzo = msgEliminarProveedor;
    } else {
        datos.estatus = "Activo";
        msgzo = msgActivarProveedor;
    }
    let json = JSON.stringify(datos);
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                mensajePantalla(msgzo, true)
                obtenerDatosProveedoresICM();
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
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    AddCerrarModal();
                    mensajePantalla(msg, true);
                    obtenerDatosProveedoresICM();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function valStatusProveedores() {
    var checkbox = document.getElementById('ValCheEsta');
    var imgcheck = document.getElementById('ValEstatus');
    // Deseleccionar el checkbox
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        imgcheck.src = "../img/toggle_on_35px.png";
        estatusProveedores = 1;
    } else {
        imgcheck.src = "../img/toggle_off_35px.png";
        estatusProveedores = 0;
    }
    filterDataProveedoresICM();
}

function llenarFormularioProveedores(idproveedor, nombre) {
    document.getElementById('btnGuardarForm').innerHTML = "Guardar";
    let tituloForm = document.querySelector("#tituloProveedores");
    tituloForm.innerHTML = "Modificar proveedor";
    let Nombre = document.querySelector('#txtNombreProveedor');
    let id = document.querySelector('#inputIdProv');
    id.value = idproveedor;
    Nombre.value = nombre;
    Nombre.placeholder = "";
    Nombre.classList.remove("inputVacio");
    $('#AgregarModal').modal('show');
}

function AbrirApartadoAgregar() {
    document.getElementById('btnGuardarForm').innerHTML = "Agregar";
    let tituloForm = document.querySelector("#tituloProveedores");
    tituloForm.innerHTML = "Agregar proveedor";
    let Nombre = document.querySelector('#txtNombreProveedor');
    Nombre.value = "";
    Nombre.placeholder = "";
    Nombre.classList.remove("inputVacio");
}

/***
 * 
 * 
 * 
 * 
 * propuestas
 * 
 * 
 * 
 * 
 */

function obtenerDatosPropuestasICM(idProveedor) {
    proveedorSeleccionado = idProveedor;
    $('#AgregarModalPropuestas').modal('show');
    const datos = {};
    datos.idProveedor = idProveedor;
    let json = JSON.stringify(datos);
    let url = "../ws/Propuestas/wsGetPropuesta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    PropuestasICM = resp.datos;
                    llenarTablaPropuestaICM();
                    filterDataPropuestaICM();
                }
                else {
                    PropuestasICM = [];
                    llenarTablaPropuestaICM();
                    filterDataPropuestaICM();
                }
            } else {
                throw status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}
function modificarPropuesta(idPropuesta, propuestaM, fechaM, zonaM, obraM) {
    IdPropuestaModificacion = idPropuesta;
    document.getElementById('btnGuardarFormPropuesta').innerHTML = "Guardar";
    let tituloForm = document.querySelector("#tituloPropuestas");
    tituloForm.innerHTML = "Modificar Propuesta";
    let propuesta = document.querySelector('#addNoPropuesta');
    let fecha = document.querySelector('#AddFechaProv');
    let zona = document.querySelector('#inputZona');
    let obra = document.querySelector('#AddTipoObra');
    propuesta.value = propuestaM;
    propuesta.placeholder = "";
    propuesta.classList.remove("inputVacio");
    fecha.value = fechaM;
    fecha.placeholder = "";
    fecha.classList.remove("inputVacio");
    zona.value = zonaM;
    zona.placeholder = "";
    zona.classList.remove("inputVacio");
    obra.value = obraM;
    obra.classList.remove("inputVacio");
    $('#AgregarModalPropuesta').modal('show');
    $('#AgregarModalPropuesta').css('z-index', parseInt($('#AgregarModalPropuestas').css('z-index')) + 10);
    $('.modal-backdrop').last().css('z-index', parseInt($('#AgregarModalPropuesta').css('z-index')) - 1);
}

function displayTablePropuestasICM(page) {
    const tbody = document.getElementById("table-bodyPropuestas");
    tbody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredDataPropuestasModal.slice(start, end);
    if (paginatedData.length > 0) {
        // Llenar la tabla con los proveedores
        paginatedData.forEach(propuesta => {
            const fila = document.createElement("tr");
            fila.classList.add('fila');
            fila.innerHTML = `
            <td>${propuesta.nopropuesta}</td>
            <td>${propuesta.fecha}</td>
            <td>${propuesta.zona}</td>
            <td>${propuesta.obra}</td>
            <td class="estatus" style="width: 8rem;">
                <div style="display: flex; justify-content: space-around; align-items: center;">
                    <input type="checkbox" 
                           class="custom-checkbox" 
                           id="checkbox_${propuesta.idpropuesta}" 
                           value="${propuesta.idpropuesta}"
                           ${selectedPropuestas.includes(Number(propuesta.idpropuesta)) ? 'checked' : ''}>
                    <label for="checkbox_${propuesta.idpropuesta}" class="checkbox-design"></label>
                    <i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;" alt="Modificar" 
                       onclick="modificarPropuesta(${propuesta.idpropuesta},'${propuesta.nopropuesta}','${propuesta.fecha}','${propuesta.zona}','${propuesta.obra}')"></i>
                </div>
            </td>
            `;
            tbody.appendChild(fila);
        });

    } else {
        const row = `<tr>
                <td colspan="8" class="Code">Sin resultados</td>
            </tr>`;
        tbody.innerHTML += row;
    }

    // Agregar evento para actualizar la tabla principal al cambiar la selección
    const checkboxes = document.querySelectorAll("#table-bodyPropuestas input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            const idPropuesta = Number(checkbox.value);
            const propuesta = paginatedData.find(p => Number(p.idpropuesta) === idPropuesta);
            if (checkbox.checked) {
                selectedPropuestas.push(idPropuesta);
                propuesta.inflacion = 0; // Agregar el atributo inflacion con valor 0
                objetoPropuestasSeleccionadas.push(propuesta);
                // Asegurarse de que los precios sean 0 si no existen
                AuxPropuestas = AuxPropuestas.map(aux => {
                    if (aux.idpropuesta === idPropuesta && aux.precio === undefined) {
                        return {
                            ...aux,
                            precio: 0
                        };
                    }
                    return aux;
                });
            } else {
                selectedPropuestas = selectedPropuestas.filter(id => id !== idPropuesta);
                objetoPropuestasSeleccionadas = objetoPropuestasSeleccionadas.filter(p => Number(p.idpropuesta) !== idPropuesta);
                // Restaurar los precios originales
                AuxPropuestas = AuxPropuestas.map(aux => {
                    if (aux.idpropuesta === idPropuesta) {
                        return {
                            ...aux,
                            precio: preciosOriginales[idPropuesta] && preciosOriginales[idPropuesta][aux.idconcepto] !== undefined
                                ? preciosOriginales[idPropuesta][aux.idconcepto]
                                : 0 // Restablecer a 0 si no se encuentra en preciosOriginales
                        };
                    }
                    return aux;
                });
            }
        });
    });
}
function setupPaginationPropuestaICM() {
    const paginationDiv = document.getElementById("paginationPropuestas");
    paginationDiv.innerHTML = "";

    const totalPages = Math.ceil(filteredDataPropuestasModal.length / rowsPerPage);
    const maxPagesToShow = 5; // Número máximo de páginas a mostrar
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
        // Mostrar todas las páginas si son menos o iguales a 5
        startPage = 1;
        endPage = totalPages;
    } else {
        const middle = Math.floor(maxPagesToShow / 2);

        if (currentPage <= middle) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + middle >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - middle;
            endPage = currentPage + middle;
        }
    }
    if (totalPages > 0) {
        // Botón de "Atrás"
        const prevButton = document.createElement("button");
        prevButton.innerHTML = `<i i class="fa-solid fa-angles-left" ></i > `;
        prevButton.style.backgroundColor = "#008e5a";
        prevButton.style.color = "#ffffff";
        prevButton.style.border = "3px solid #008e5a";
        prevButton.disabled = currentPage == 1;
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                displayTablePropuestasICM(currentPage);
                setupPaginationPropuestaICM();
            }
        });
        paginationDiv.appendChild(prevButton);
        // Botones de página
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement("button");
            button.innerText = i;

            if (currentPage == i) {
                button.className = 'active';
                button.style.color = "#ffffff";
                button.style.border = "3px solid #008e5a";
                button.style.backgroundColor = "#008e5a";
            } else {
                button.style.color = "#008e5a";
                button.style.border = "3px solid #008e5a";
                button.style.backgroundColor = "#ffffff";
            }
            button.addEventListener("click", () => {
                currentPage = i;
                displayTablePropuestasICM(currentPage);
                setupPaginationPropuestaICM();
            });
            paginationDiv.appendChild(button);
        }

        // Botón de "Adelante"
        const nextButton = document.createElement("button");
        nextButton.innerHTML = `<i i class="fa-solid fa-angles-right" ></i > `;
        nextButton.style.backgroundColor = "#008e5a";
        nextButton.style.color = "#ffffff";
        nextButton.style.border = "3px solid #008e5a";
        nextButton.disabled = currentPage == totalPages;
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayTablePropuestasICM(currentPage);
                setupPaginationPropuestaICM();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

function filterDataPropuestaICM() {
    const searchText = document.getElementById("search-Propuestas").value.toLowerCase();
    const filterObra = document.getElementById("unidad-filterObra").value;
    const filterZona = document.getElementById("unidad-filterZona").value;
    const filterAnio = document.getElementById("filtro-anio").value;

    const statusFilter = 1; // Se debe cambiar según el campo de estatus en la BD
    filteredDataPropuestasModal = PropuestasICM.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value != null && value.toString().toLowerCase().includes(searchText)
        );
        const matchesObra = filterObra ? record.obra == filterObra : true;
        const matchesZona = filterZona ? record.zona == filterZona : true;
        const matchesAnio = filterAnio ? new Date(record.fecha).getFullYear() == filterAnio : true;
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesStatus && matchesObra && matchesZona && matchesAnio;
    });

    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTablePropuestasICM(currentPage);
    setupPaginationPropuestaICM();
}

function llenarTablaPropuestaICM() {
    displayTablePropuestasICM(currentPage);
    setupPaginationPropuestaICM();
    const searchInput = document.getElementById("search-Propuestas");
    searchInput.addEventListener("input", filterDataPropuestaICM);

    const filterObra = document.getElementById("unidad-filterObra");
    filterObra.addEventListener("input", filterDataPropuestaICM);

    const filterZona = document.getElementById("unidad-filterZona");
    filterZona.addEventListener("input", filterDataPropuestaICM);

    const filterAnio = document.getElementById("filtro-anio");
    filterAnio.addEventListener("input", filterDataPropuestaICM);

    const rowsPerPageSelect = document.getElementById("rows-per-pagePropuestas");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTablePropuestasICM(currentPage);
        setupPaginationPropuestaICM();
    });
}

function llenarZonaFiltro() {
    const zonaFiltro = document.getElementById("unidad-filterZona"); // El select donde agregarás las opciones

    // Limpiar las opciones existentes del select (por si hay alguna previamente)
    zonaFiltro.innerHTML = "";

    // Crear una opción predeterminada o vacía
    const optionDefault = document.createElement("option");
    optionDefault.value = "";
    optionDefault.textContent = "Todo";
    zonaFiltro.appendChild(optionDefault);

    // Usar un Set para obtener zonas únicas
    const zonasUnicas = new Set(objZonas.map(zona => zona.zona.trim()));

    // Convertir el Set a un array y ordenar alfabéticamente
    const zonasOrdenadas = Array.from(zonasUnicas).sort((a, b) =>
        a.localeCompare(b, 'es', { sensitivity: 'base' })
    );

    // Iterar sobre las zonas únicas y añadirlas al select
    zonasOrdenadas.forEach(zona => {
        // Crear un nuevo elemento <option>
        const option = document.createElement("option");

        // Usar el valor de la zona para el atributo 'value' y el texto visible de la opción
        option.value = zona;
        option.textContent = zona;

        // Añadir la opción al select
        zonaFiltro.appendChild(option);
    });
}


function AgregarPropuesta() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    datos.idProveedor = proveedorSeleccionado;
    datos.idPropuesta = IdPropuestaModificacion;
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
    let nombreZona = document.querySelector('#inputZona');
    // Verificar si la zona es válida
    const zonaValida = objZonas.some(z => z.zona.toLowerCase() == nombreZona.value.toLowerCase());
    if (nombreZona.value == "" || !zonaValida) {
        nombreZona.classList.add("inputVacio");
        nombreZona.placeholder = nombreZona.value == "" ? "Requerida la zona" : "Zona no válida";
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = nombreZona;
        }
    }
    datos.zona = nombreZona.value;
    let obra = document.querySelector('#AddTipoObra');
    if (obra.value == "") {
        obra.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = obra;
        }
    }
    datos.obra = obra.value;
    datos.idZona = obtenerIdZona();
    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }

    let url = "";
    let msg = "";
    let btnGuardarForm = document.getElementById('btnGuardarFormPropuesta');

    if (btnGuardarForm.innerHTML == "Agregar") {
        url = "../ws/Propuestas/wsAddPropuesta.php";
        msg = "Propuesta agregada";
    } else {
        let idProv = document.getElementById('inputIdProv');
        datos.idProveedor = parseInt(idProv.value);
        url = "../ws/Propuestas/wsUpdPropuesta.php";
        msg = "Propuesta modificada";
    }
    let json = JSON.stringify(datos);
    console.log(json);
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp);
                if (resp.estado == "OK") {
                    $('#AgregarModalPropuesta').modal('hide');
                    mensajePantalla(msg, true);
                    obtenerDatosPropuestasICM(proveedorSeleccionado);
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });


}

function AbrirApartadoAgregarPropuesta() {
    document.getElementById('btnGuardarFormPropuesta').innerHTML = "Agregar";
    let tituloForm = document.querySelector("#tituloPropuestas");
    tituloForm.innerHTML = "Agregar propuesta";
    let propuesta = document.querySelector('#addNoPropuesta');
    let fecha = document.querySelector('#AddFechaProv');
    let zona = document.querySelector('#inputZona');
    let obra = document.querySelector('#AddTipoObra');
    propuesta.value = "";
    propuesta.placeholder = "";
    propuesta.classList.remove("inputVacio");
    fecha.value = "";
    fecha.placeholder = "";
    fecha.classList.remove("inputVacio");
    zona.value = "";
    zona.placeholder = "";
    zona.classList.remove("inputVacio");
    obra.value = "";
    obra.classList.remove("inputVacio");
}

function abrirModalAddPropuesta() {
    AbrirApartadoAgregarPropuesta();
    $('#AgregarModalPropuesta').modal('show');
    $('#AgregarModalPropuesta').css('z-index', parseInt($('#AgregarModalPropuestas').css('z-index')) + 10);
    $('.modal-backdrop').last().css('z-index', parseInt($('#AgregarModalPropuesta').css('z-index')) - 1);
}

function llenarSelectAnios() {
    const selectAnio = document.getElementById("filtro-anio");

    // Limpiar las opciones existentes del select (por si hay alguna previamente)
    selectAnio.innerHTML = "";

    // Crear una opción predeterminada o vacía
    const optionDefault = document.createElement("option");
    optionDefault.value = "";
    optionDefault.textContent = "Todo";
    selectAnio.appendChild(optionDefault);

    // Obtener el año actual
    const currentYear = new Date().getFullYear();

    // Generar las opciones para los últimos 10 años
    for (let year = currentYear; year >= currentYear - 10; year--) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        selectAnio.appendChild(option);
    }
}


/***
 * 
 * auxiliarPropuestas
 * 
 * 
 */


function GetAuxPropuestas() {
    let json = "";
    let url = "../ws/AuxPropuestas/wsGetAuxPropuestas.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    AuxPropuestas = resp.datos;
                    // Guardar los precios originales
                    AuxPropuestas.forEach(aux => {
                        if (!preciosOriginales[aux.idpropuesta]) {
                            preciosOriginales[aux.idpropuesta] = {};
                        }
                        preciosOriginales[aux.idpropuesta][aux.idconcepto] = aux.precio;
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




/***
 * 
 * 
 * 
 * Propuestas Pagina
 * 
 * 
 * 
 */



function displayTablePropuestasICMPagina() {
    const tbody = document.getElementById("table-bodyPropuestasPag");
    tbody.innerHTML = "";
    const paginatedData = objetoPropuestasSeleccionadas;
    if (paginatedData.length > 0) {
        // Llenar la tabla con los proveedores
        paginatedData.forEach(propuesta => {
            const fila = document.createElement("tr");
            fila.classList.add('fila');
            fila.innerHTML = `
            <td>${propuesta.nombreprov}</td>
            <td>${propuesta.nopropuesta}</td>
            <td>${propuesta.fecha}</td>
            <td>${propuesta.zona}</td>
            <td>${propuesta.obra}</td>
            <td class="estatus" style="width: 8rem;">
                <div style="display: flex; justify-content: space-around; align-items: center;">
                  <i class="coloresIcono fa-solid fa-x" style="cursor: pointer;" alt="Eliminar" onclick="eliminarObjetoArregloPropuesta(${propuesta.idpropuesta})"></i>
                </div>
            </td>
            `;
            tbody.appendChild(fila);
        });

    } else {
        const row = `<tr>
                <td colspan="8" class="Code">Sin resultados</td>
            </tr>`;
        tbody.innerHTML += row;
    }
}

function eliminarObjetoArregloPropuesta(idPropuesta) {
    const idPropuestaNum = Number(idPropuesta);
    // Eliminar el objeto del arreglo
    objetoPropuestasSeleccionadas = objetoPropuestasSeleccionadas.filter(p => Number(p.idpropuesta) !== idPropuestaNum);
    // Eliminar el ID del arreglo selectedPropuestas
    selectedPropuestas = selectedPropuestas.filter(id => Number(id) !== idPropuestaNum);
    // Actualizar la tabla
    displayTablePropuestasICMPagina();
}