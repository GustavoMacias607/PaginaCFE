let editedRows = {};
function llenarCamposPagina() {
    let btnICMNav = document.querySelector('#btnICMNav');
    btnICMNav.style.display = 'none';
    let id = document.getElementById("lblId").innerHTML = datosProyecto.idProyecto;
    let zona = document.getElementById("lblZona").innerHTML = datosProyecto.zona;
    let tipoObra = document.getElementById("lblTipoObra").innerHTML = datosProyecto.obra;
    let periodo = document.getElementById("lblPeriodo").innerHTML = datosProyecto.periodo;
    let fechaInicio = document.getElementById("lblFechaInicio").innerHTML = formatearFecha(datosProyecto.fechaInicio);
    let fechaTermino = document.getElementById("lblFechaTermino").innerHTML = formatearFecha(datosProyecto.fechaTermino);
    let nombre = document.getElementById("lblNombre").value = datosProyecto.nombre;
    document.getElementById('AddfechaInicioInput').addEventListener('blur', calcularFechaTermino);
    document.getElementById('inputPeriodo').addEventListener('blur', calcularFechaTermino);
    MostrarConceptosContenidosProyecto();
    llenarUnidadTablaCon();
}
function formatearFecha(fecha) {
    const [year, month, day] = fecha.split('-');
    return `${day}-${month}-${year}`;
}
async function obtenerDatosConceptosProyecto() {
    // Selecciona el elemento del spinner
    const spinner = document.querySelector(".sk-circle");
    // Muestra el spinner
    spinner.style.display = "block";
    let json = "";
    let url = "../ws/Conceptos/wsGetConcepto.php";
    try {
        // Espera a que termine `ActualizarTotalesConcepto`
        await ActualizarTotalesConceptoProyecto();
    } catch (error) {
        console.error("Error en ActualizarTotalesConcepto:", error);
        spinner.style.display = "none"; // Oculta el spinner en caso de error
        return; // Sale de la función si hay un error
    }

    // Realiza la solicitud POST y oculta el spinner al finalizar
    $.post(url, json, (responseText, status) => {
        try {
            if (status === "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado === "OK") {
                    //llenarUnidadTabla();
                    data = resp.datos;
                    llenarTablaConceptoProyecto();
                    filterDataConceptoProyecto();
                }
            } else {
                throw status;
            }
        } catch (error) {
            console.error(error);
        } finally {
            // Oculta el spinner al finalizar
            spinner.style.display = "none";
        }
    });
}

function ActualizarTotalesConceptoProyecto() {
    return new Promise((resolve, reject) => {
        const url = "../ws/Conceptos/wsUpdateTotales.php";
        const json = "";

        $.post(url, json, (responseText, status) => {
            try {
                if (status === "success") {
                    let resp = JSON.parse(responseText);

                    resolve(); // La promesa se resuelve exitosamente

                } else {
                    reject(status); // La promesa se rechaza si el estado no es "success"
                }
            } catch (error) {
                reject(error); // La promesa se rechaza en caso de error
            }
        });
    });
}

function displayTableConceptoProyecto(page) {
    const tableBody = document.getElementById("table-bodyConceptos");
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredData.slice(start, end);
    if (paginatedData.length > 0) {
        paginatedData.forEach(record => {
            const row = document.createElement('tr');
            row.classList.add('fila');
            // Establecer el contenido HTML de la fila
            const editableValue = editedRows[record.idconcepto] ? editedRows[record.idconcepto].cantidad : "";
            row.innerHTML = `
                    <td class="Code">${record.idconcepto}</td>
                    <td>${record.nombre !== "" ? record.nombre : "---"}</td>
                    <td>${record.unidad !== "" ? record.unidad : "---"}</td>
                    <td style="text-align: center;" contenteditable="true" class="editable">${editableValue}</td>
                `;

            // Añadir eventos mouseover y mouseout
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));

            // Añadir evento input para validar el campo editable
            const editableCell = row.querySelector('.editable');
            editableCell.addEventListener('input', (event) => {
                const value = event.target.innerText.trim();
                if (!/^\d*$/.test(value) || parseInt(value) < 0) {
                    event.target.innerText = "";
                    updateEditedRows(record, 0); // Eliminar del objeto si el valor no es válido
                } else {
                    updateEditedRows(record, parseInt(value));
                }
                console.log(editedRows);
            });

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

function updateEditedRows(record, value) {
    if (value > 0) {
        editedRows[record.idconcepto] = { ...record, cantidad: value };
    } else {
        delete editedRows[record.idconcepto];
    }
}

function setupPaginationConceptoProyecto() {
    const paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = "";

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
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
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                displayTableConceptoProyecto(currentPage);
                setupPaginationConceptoProyecto();
            }
        });
        paginationDiv.appendChild(prevButton);
        // Botones de página
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement("button");
            button.innerText = i;

            if (currentPage === i) {
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
                displayTableConceptoProyecto(currentPage);
                setupPaginationConceptoProyecto();
            });
            paginationDiv.appendChild(button);
        }

        // Botón de "Adelante"
        const nextButton = document.createElement("button");
        nextButton.innerHTML = `<i class="fa-solid fa-angles-right"></i>`;
        nextButton.style.backgroundColor = "#008e5a";
        nextButton.style.color = "#ffffff";
        nextButton.style.border = "3px solid #008e5a";
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayTableConceptoProyecto(currentPage);
                setupPaginationConceptoProyecto();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

function filterDataConceptoProyecto() {
    const searchText = document.getElementById("search-inputConceptos").value.toLowerCase();
    const unidadFilter = document.getElementById("unidad-filterConcepto").value;
    const statusFilter = 1;
    filteredData = data.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value != null && value.toString().toLowerCase().includes(searchText)
        );
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesUnidad && matchesStatus;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableConceptoProyecto(currentPage);
    setupPaginationConceptoProyecto();
}

function llenarTablaConceptoProyecto() {
    displayTableConceptoProyecto(currentPage);
    setupPaginationConceptoProyecto();
    const searchInput = document.getElementById("search-inputConceptos");
    searchInput.addEventListener("input", filterDataConceptoProyecto);

    const unidadFilter = document.getElementById("unidad-filterConcepto");
    unidadFilter.addEventListener("change", filterDataConceptoProyecto);

    const rowsPerPageSelect = document.getElementById("rows-per-page");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableConceptoProyecto(currentPage);
        setupPaginationConceptoProyecto();
    });
}

function llenarUnidadTablaCon() {
    const unidadFilter = document.getElementById("unidad-filterConcepto"); // El select donde agregarás las opciones
    let json = "";
    let url = "../ws/Conceptos/wsGetUnidades.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    // Limpiar las opciones existentes del select (por si hay alguna previamente)
                    unidadFilter.innerHTML = "";
                    unidadesCon = resp.datos;
                    // Crear una opción predeterminada o vacía
                    const optionDefault = document.createElement("option");
                    optionDefault.value = "";
                    optionDefault.textContent = "Todo";
                    unidadFilter.appendChild(optionDefault);

                    // Ordenar las unidadesCon alfabéticamente, asegurando que se eliminen los espacios innecesarios
                    unidadesCon.sort((a, b) =>
                        a.unidad.trim().localeCompare(b.unidad.trim(), 'es', { sensitivity: 'base' })
                    );

                    // Iterar sobre las unidadesCon obtenidas y añadirlas al select
                    unidadesCon.forEach(unidad => {
                        // Crear un nuevo elemento <option>
                        const option = document.createElement("option");

                        // Usar el valor de la unidad para el atributo 'value' y el texto visible de la opción
                        option.value = unidad.unidad;
                        option.textContent = unidad.unidad;

                        // Añadir la opción al select
                        unidadFilter.appendChild(option);
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

function AgregartablaConceptoProyecto() {
    if (!datosProyecto || !datosProyecto.idProyecto) {
        alert("El ID del proyecto no está definido.");
        return;
    }

    const conceptosArray = Object.values(editedRows);
    if (conceptosArray.length === 0) {
        alert("No hay conceptos editados para agregar.");
        return;
    }

    conceptosArray.forEach(concepto => {
        concepto.idProyecto = datosProyecto.idProyecto;
        let json = JSON.stringify(concepto);

        let url = "../ws/ConceptosProyecto/wsAddConcepto.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status === "success") {
                    let resp = JSON.parse(responseText);
                    if (resp.estado === "OK") {
                        //mensajePantalla(mgsCatalogoAgregado, true);
                    } else {
                        alert("Error en la respuesta del servidor: " + resp.mensaje);
                    }
                } else {
                    throw new Error("Error en la solicitud AJAX: " + status);
                }
            } catch (error) {
                alert("Error: " + error.message);
            }
        }).fail((jqXHR, textStatus, errorThrown) => {
            alert("Error en la solicitud AJAX: " + textStatus + " - " + errorThrown);
        });
    });
    opcion("addPresupuestoFrm");
}

function EliminartablaConceptoProyecto() {
    const datos = {}

    datos.idProyecto = datosProyecto.idProyecto;
    let json = JSON.stringify(datos);
    let url = "../ws/ConceptosProyecto/wsDelConceptos.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                AgregartablaConceptoProyecto();
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function irPresupuesto() {
    if (Object.keys(editedRows).length > 0) {
        EliminartablaConceptoProyecto();
    } else {
        mensajePantalla("Agrega un concepto", false);
    }
}

function UpdProyectoCatalogo() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let idProyecto = document.querySelector('#inputIdProyecto');
    datos.idProyecto = idProyecto.value;
    let idUsuario = document.querySelector('#idUsuario');
    datos.idUsuario = idUsuario.value;

    let nombre = document.querySelector('#inputNombreObra');
    if (nombre.value == "") {
        nombre.classList.add("inputVacio");
        nombre.placeholder = "Requerido el nombre de la obra";
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = nombre;
        }
    }
    datos.nombre = nombre.value;
    datos.fecha = datosProyecto.fecha;

    let periodo = document.querySelector('#inputPeriodo');
    if (periodo.value == "") {
        periodo.classList.add("inputVacio");
        periodo.placeholder = "Requerido el periodo";
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = periodo;
        }
    }
    datos.periodo = periodo.value;

    let fechaInicio = document.querySelector('#AddfechaInicioInput');
    if (fechaInicio.value == "") {
        fechaInicio.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = fechaInicio;
        }
    }
    datos.fechaInicio = FormateoFecha(fechaInicio.value);
    let fechaTermino = document.querySelector('#AddfechaTerminoInput');
    datos.fechaTermino = FormateoFecha(fechaTermino.value);

    let nombreZona = document.querySelector('#inputZona');
    // Verificar si la zona es válida
    const zonaValida = objZonas.some(z => z.zona.toLowerCase() === nombreZona.value.toLowerCase());
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
    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }

    if (existe) {
        id.focus();
        return;
    }
    datos.idZona = obtenerIdZona();
    inputTotal = document.querySelector('#inputTotal');
    datos.total = inputTotal.value;
    datos.estatus = "Carga Cuadro Dispositivos";
    datosProyecto = datos;
    let json = JSON.stringify(datos);
    console.log(json)

    let url = "../ws/Proyecto/wsUpdProyecto.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp);
                if (resp.estado == "OK") {

                    datosProyecto = {
                        idProyecto: datos.idProyecto,
                        nombre: datos.nombre,
                        zona: datos.zona,
                        idZona: datos.idZona,
                        obra: datos.obra,
                        fecha: datos.fecha,
                        fechaInicio: datos.fechaInicio,
                        fechaTermino: datos.fechaTermino,
                        periodo: datos.periodo,
                        total: datos.total,
                        estatus: datos.estatus
                    };
                    lblsEditados();
                    AddCerrarModal();
                    mensajePantalla("Proyecto modificado", true);
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}


function lblsEditados() {
    let zona = document.getElementById("lblZona").innerHTML = datosProyecto.zona;
    let tipoObra = document.getElementById("lblTipoObra").innerHTML = datosProyecto.obra;
    let fechaInicio = document.getElementById("lblFechaInicio").innerHTML = formatearFecha(datosProyecto.fechaInicio);
    let fechaTermino = document.getElementById("lblFechaTermino").innerHTML = formatearFecha(datosProyecto.fechaTermino);
    let nombre = document.getElementById("lblNombre").value = datosProyecto.nombre;
    let periodo = document.getElementById("lblPeriodo").innerHTML = datosProyecto.periodo;
}

function AbrirModal() {
    let id = document.getElementById("inputIdProyecto");
    let idZona = document.querySelector('#inputZona');
    let tipoObra = document.querySelector('#AddTipoObra');
    let fechaInicio = document.querySelector('#AddfechaInicioInput');
    let periodo = document.querySelector('#inputPeriodo');
    let fechaTermino = document.querySelector('#AddfechaTerminoInput');
    let nombre = document.querySelector('#inputNombreObra');
    inputTotal = document.querySelector('#inputTotal');


    id.value = datosProyecto.idProyecto;
    idZona.value = datosProyecto.zona;
    tipoObra.value = datosProyecto.obra;
    fechaInicio.value = datosProyecto.fechaInicio;
    periodo.value = datosProyecto.periodo;
    fechaTermino.value = datosProyecto.fechaTermino;
    nombre.value = datosProyecto.nombre;
    inputTotal.value = datosProyecto.total;

    idZona.placeholder = "";
    tipoObra.placeholder = "";
    fechaInicio.placeholder = "";
    periodo.placeholder = "";
    fechaTermino.placeholder = "";
    nombre.placeholder = "";

    idZona.classList.remove("inputVacio");
    tipoObra.classList.remove("inputVacio");
    fechaInicio.classList.remove("inputVacio");
    periodo.classList.remove("inputVacio");
    fechaTermino.classList.remove("inputVacio");
    nombre.classList.remove("inputVacio");

}


function MostrarConceptosContenidosProyecto() {
    const datos = {};
    datos.idProyecto = datosProyecto.idProyecto;
    let json = JSON.stringify(datos);
    let url = "../ws/ConceptosProyecto/wsGetConceptos.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                let datosBd = resp.datos;
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
                console.log(editedRows)
                obtenerDatosConceptosProyecto();
            } else {
                throw new Error(status);
            }
        } catch (error) {
            alert("Error: " + error);
        }
    });
}