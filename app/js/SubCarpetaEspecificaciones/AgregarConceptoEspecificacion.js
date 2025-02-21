let objTabla2ModalConcepto = [];
let msgYaAgregadoConcepto = "Concepto ya agregado";
var datosObjetoConcepto = [];


let unidadesCon;
//Metodo para hacer la consulta de los Concepto tomando en cuanta los filtros
async function GetConceptoEspecificacion() {
    const spinner = document.querySelector("#cargaModal");

    // Muestra el spinner
    spinner.style.display = "block";
    const tbody = document.getElementById('table-bodyEspecificacionesModal');
    tbody.innerHTML = '';
    const filaSinResultados = document.createElement('tr');
    filaSinResultados.innerHTML = '<td colspan="8" style="text-align: left;">Cargando resultados...</td>';

    // Agrega la fila al tbody
    tbody.appendChild(filaSinResultados);
    let nombrebtn = document.getElementById('exampleModalLabel');
    if (nombrebtn.innerHTML != "Modificar especificación") {
        try {
        } catch (error) {
            console.error("Error en ActualizarTotalesConcepto:", error);
            spinner.style.display = "none"; // Oculta el spinner en caso de error
            return; // Sale de la función si hay un error
        }
    }

    let datos = {};
    datos.idEspecificacion = seleccion.idEspecificacion;
    let json = JSON.stringify(datos);
    let url = "../ws/TipoEsp/wsGetConceptosEsp.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    // Llamar a la función para mostrar los datos en la tabla
                    datosObjetoConcepto = resp.datos;
                    llenarTablaConceptoEspecificacion();
                    filterDataConceptoEspecificacion();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        } finally {
            // Oculta el spinner al finalizar
            spinner.style.display = "none";
        }
    });
}

//Método para el llenado de la tabla
function displayTableConceptoEspecificacion(page) {
    const tableBody = document.getElementById("table-bodyEspecificacionesModal");
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredData.slice(start, end);
    if (paginatedData.length > 0) {
        paginatedData.forEach(record => {
            const row = document.createElement('tr');
            row.classList.add('fila');
            row.style.cursor = 'pointer';
            row.innerHTML = `
                 <td class="Code">${record.idconcepto}</td>
                    <td>${record.nombre !== "" ? record.nombre : "---"}</td>
                    <td>${record.unidad !== "" ? record.unidad : "---"}</td>
            `;

            // Evento para doble clic
            row.addEventListener("dblclick", () => {
                // Verificar si el material ya fue agregado
                const existe = objTabla2ModalConcepto.some(Concepto => Concepto.idconcepto === record.idconcepto);

                // Si no existe, lo añadimos al arreglo
                if (!existe) {
                    objTabla2ModalConcepto.push({
                        idconcepto: record.idconcepto,
                        nombre: record.nombre,
                        unidad: record.unidad,
                        total: record.total,
                        estatus: true,
                    });
                    llenarTablaConceptoSeleccionados();
                } else {
                    mensajePantalla(msgYaAgregadoConcepto, false);
                }
            });

            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));
            tableBody.appendChild(row);
        });
    } else {
        const row = `<tr>
                        <td colspan="4" class="Code">Sin resultados</td>
                     </tr>`;
        tableBody.innerHTML += row;
    }
}

//Metodo para la paginacion de la tabla
function setupPaginationConceptoEspecificacion() {
    const paginationDiv = document.getElementById("paginationModalSeg");
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
                displayTableConceptoEspecificacion(currentPage);
                setupPaginationConceptoEspecificacion();
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
                displayTableConceptoEspecificacion(currentPage);
                setupPaginationConceptoEspecificacion();
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
                displayTableConceptoEspecificacion(currentPage);
                setupPaginationConceptoEspecificacion();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

//Metodo para los filtros de la tabla
function filterDataConceptoEspecificacion() {
    const searchText = document.getElementById("search-inputConceptoEps").value.toLowerCase();
    const unidadFilter = document.getElementById("unidad-filterConcepto").value;
    const statusFilter = 1;
    filteredData = datosObjetoConcepto.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value != null && value.toString().toLowerCase().includes(searchText)
        );
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesUnidad && matchesStatus;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableConceptoEspecificacion(currentPage);
    setupPaginationConceptoEspecificacion();
}

function llenarTablaConceptoEspecificacion() {
    displayTableConceptoEspecificacion(currentPage);
    setupPaginationConceptoEspecificacion();
    const searchInput = document.getElementById("search-inputConceptoEps");
    searchInput.addEventListener("input", filterDataConceptoEspecificacion);

    const unidadFilter = document.getElementById("unidad-filterConcepto");
    unidadFilter.addEventListener("change", filterDataConceptoEspecificacion);

    const rowsPerPageSelect = document.getElementById("rows-per-pageModalSeg");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableConceptoEspecificacion(currentPage);
        setupPaginationConceptoEspecificacion();
    });
}


function AbrirModalConceptoEspecificacion() {
    AbrirModalConceptoEspecificaciones();
    const unidadFilter = document.getElementById("unidad-filterConcepto");
    unidadFilter.value = "";
    const rowsPerPageSelect = document.getElementById("rows-per-pageModalSeg");
    rowsPerPageSelect.value = 10;
    rowsPerPage = 10;
    llenarUnidadTablaCon();
    llenarTablaConceptoSeleccionadosP();
    objTabla2ModalConcepto = filteredDataConcepto;
    llenarTablaConceptoSeleccionados();
    GetConceptoEspecificacion();

}

function guardarConceptoSeleccionados() {
    objTabla2ModalConceptoPrincipal = objTabla2ModalConcepto;
}

//Metodo para llenar tabla
function llenarTablaConceptoSeleccionados() {
    llenarTablaConceptoEspecificacionModal();
    filterDataConceptoEspecificacionModal();
}



//Método para el llenado de la tabla
function displayTableConceptoEspecificacionModal(page) {
    const tableBody = document.getElementById("table-bodyEspecificacionesModal2");
    tableBody.innerHTML = "";
    const start = (page - 1) * cantidadFilasTabla;
    const end = start + cantidadFilasTabla;
    const paginatedData2 = filteredData2.slice(start, end);

    if (paginatedData2.length > 0) {
        paginatedData2.forEach(record => {
            const row = document.createElement('tr');
            row.classList.add('fila');
            if (!record.estatus) {
                row.classList.add('DatoInactivo')
            }
            row.innerHTML = `
                   <td class="Code">${record.idconcepto}</td>
                    <td>${record.nombre !== "" ? record.nombre : "---"}</td>
                    <td>${record.unidad !== "" ? record.unidad : "---"}</td>
                 <td class="estatus">
                  <div style="display: flex; justify-content: space-around; align-items: center;">
                        <i class="coloresIcono fa-solid fa-x" style="cursor: pointer;" alt="Eliminar" onclick="eliminarFilaDelObjetoConcepto('${record.idconcepto}')"></i>
                    </div>
                     </td>
            `;
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));
            tableBody.appendChild(row);
        });
    } else {
        const row = `<tr>
                        <td colspan="8" class="Code">Sin resultados</td>
                     </tr>`;
        tableBody.innerHTML += row;
    }
}

// Función para eliminar el material solo del objeto
function eliminarFilaDelObjetoConcepto(codigo) {
    // Eliminar el material de objMaterialesSeleccionados usando su código
    objTabla2ModalConcepto.forEach((valor, index) => {
        if (codigo == valor.idconcepto) {
            objTabla2ModalConcepto.splice(index, 1);
        }
    });
    llenarTablaConceptoSeleccionados();
}

//Metodo para los filtros de la tabla
function filterDataConceptoEspecificacionModal() {
    const unidadFilter = document.getElementById("selectUnidadConceptoModal").value;
    filteredData2 = objTabla2ModalConcepto.filter(record => {
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        return matchesUnidad;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableConceptoEspecificacionModal(currentPage);
}

function llenarTablaConceptoEspecificacionModal() {

    displayTableConceptoEspecificacionModal(currentPage);
    const unidadFilter = document.getElementById("selectUnidadConceptoModal");
    unidadFilter.addEventListener("change", filterDataConceptoEspecificacionModal);
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


