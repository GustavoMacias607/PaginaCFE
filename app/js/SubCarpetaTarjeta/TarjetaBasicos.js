let objTabla2ModalBasicos = [];
let msgYaAgregadoBasicos = "Básico ya agregado";
var datosObjetoBasicos = [];

//Metodo para hacer la consulta de los Basicos tomando en cuanta los filtros
function GetBasicosTarjeta() {
    let json = "";
    url = "../ws/ConceptosBasicos/wsGetConceptoBasico.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    // Llamar a la función para mostrar los datos en la tabla

                    datosObjetoBasicos = resp.datos;
                    llenarTablaBasicosTarjeta();
                    filterDataBasicosTarjeta();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}

//Método para el llenado de la tabla
function displayTableBasicosTarjeta(page) {
    const tableBody = document.getElementById("table-bodyBasicos");
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredData.slice(start, end);
    if (paginatedData.length > 0) {
        paginatedData.forEach(record => {
            const formatoMXN = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            });

            const precioFormateado = (record.total !== undefined && record.total !== "")
                ? formatoMXN.format(record.total)
                : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            row.style.cursor = 'pointer';
            row.innerHTML = `
                <td class="Code">${record.idconbasi}</td>
                <td>${record.nombre !== "" ? record.nombre : "---"}</td>
                <td>${record.unidad !== "" ? record.unidad : "---"}</td>
                <td>${precioFormateado}</td>
               
            `;

            // Evento para doble clic
            row.addEventListener("dblclick", () => {
                // Verificar si el material ya fue agregado
                const existe = objTabla2ModalBasicos.some(Basicos => Basicos.idconbasi === record.idconbasi);

                // Si no existe, lo añadimos al arreglo
                if (!existe) {
                    objTabla2ModalBasicos.push({
                        idconbasi: record.idconbasi,
                        nombre: record.nombre,
                        cantconbasi: record.cantconbasi,
                        total: record.total,
                        unidad: record.unidad,
                        estatus: true,
                    });
                    llenarTablaBasicosSeleccionados();
                } else {
                    mensajePantalla(msgYaAgregadoBasicos, false);
                }
            });

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


//Metodo para la paginacion de la tabla
function setupPaginationBasicosTarjeta() {
    const paginationDiv = document.getElementById("paginationBasicos");
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
                displayTableBasicosTarjeta(currentPage);
                setupPaginationBasicosTarjeta();
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
                displayTableBasicosTarjeta(currentPage);
                setupPaginationBasicosTarjeta();
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
                displayTableBasicosTarjeta(currentPage);
                setupPaginationBasicosTarjeta();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

//Metodo para los filtros de la tabla
function filterDataBasicosTarjeta() {
    const searchText = document.getElementById("search-inputBasicos").value.toLowerCase();
    const unidadFilter = document.getElementById("unidad-filterBasicos").value;
    const statusFilter = 1;
    filteredData = datosObjetoBasicos.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value != null && value.toString().toLowerCase().includes(searchText)
        );
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesUnidad && matchesStatus;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableBasicosTarjeta(currentPage);
    setupPaginationBasicosTarjeta();
}

function llenarTablaBasicosTarjeta() {
    displayTableBasicosTarjeta(currentPage);
    setupPaginationBasicosTarjeta();
    const searchInput = document.getElementById("search-inputBasicos");
    searchInput.addEventListener("input", filterDataBasicosTarjeta);

    const unidadFilter = document.getElementById("unidad-filterBasicos");
    unidadFilter.addEventListener("change", filterDataBasicosTarjeta);

    const rowsPerPageSelect = document.getElementById("rows-per-pageBasicos");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableBasicosTarjeta(currentPage);
        setupPaginationBasicosTarjeta();
    });
}


function AbrirModalBasicosTarjeta() {
    $('#AgregarModalBasicosesConcepto').modal('show');
    const unidadFilter = document.getElementById("unidad-filterBasicos");
    unidadFilter.value = "";
    rowsPerPage = 10;
    llenarTablaBasicosSeleccionadosP();
    objTabla2ModalBasicos = filteredDataBasicos;
    llenarTablaBasicosSeleccionados();
    GetBasicosTarjeta();
}

function guardarBasicosSeleccionados() {
    objTabla2ModalBasicosPrincipal = objTabla2ModalBasicos;
}

//Metodo para llenar tabla
function llenarTablaBasicosSeleccionados() {
    llenarTablaBasicosTarjetaModal();
    filterDataBasicosTarjetaModal();
}



//Método para el llenado de la tabla
function displayTableBasicosTarjetaModal(page) {
    const tableBody = document.getElementById("table-bodyBasicosTarjetaModal2");
    tableBody.innerHTML = "";
    const start = (page - 1) * cantidadFilasTabla;
    const end = start + cantidadFilasTabla;
    const paginatedData2 = filteredData2.slice(start, end);

    if (paginatedData2.length > 0) {
        paginatedData2.forEach(record => {
            const formatoMXN = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            });

            const precioFormateado = (record.total !== undefined && record.total !== "")
                ? formatoMXN.format(record.total)
                : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            if (!record.estatus) {
                row.classList.add('DatoInactivo')
            }
            row.innerHTML = `
               <td class="Code">${record.idconbasi}</td>
                <td>${record.nombre !== "" ? record.nombre : "---"}</td>
                <td>${record.unidad !== "" ? record.unidad : "---"}</td>
                <td>${precioFormateado}</td>
                 <td class="estatus">
                  <div style="display: flex; justify-content: space-around; align-items: center;">
                        <i class="coloresIcono fa-solid fa-x" style="cursor: pointer;" alt="Eliminar" onclick="eliminarFilaDelObjetoBasicos('${record.idconbasi}')"></i>
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
function eliminarFilaDelObjetoBasicos(codigo) {
    // Eliminar el material de objMaterialesSeleccionados usando su código
    objTabla2ModalBasicos.forEach((valor, index) => {
        if (codigo == valor.idconbasi) {
            objTabla2ModalBasicos.splice(index, 1);
        }
    });
    llenarTablaBasicosSeleccionados();
}

//Metodo para los filtros de la tabla
function filterDataBasicosTarjetaModal() {
    const unidadFilter = document.getElementById("selectUnidadBasicosModal").value;
    filteredData2 = objTabla2ModalBasicos.filter(record => {
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        return matchesUnidad;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableBasicosTarjetaModal(currentPage);
}

function llenarTablaBasicosTarjetaModal() {
    displayTableBasicosTarjetaModal(currentPage);
    const unidadFilter = document.getElementById("selectUnidadBasicosModal");
    unidadFilter.addEventListener("change", filterDataBasicosTarjetaModal);
}


