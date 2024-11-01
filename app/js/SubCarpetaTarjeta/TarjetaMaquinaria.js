let objTabla2ModalMaquinaria = [];
let msgYaAgregadoMaquinaria = "Maquinaria ya agregada";
var datosObjetoMaquinaria = [];

//Metodo para hacer la consulta de los Maquinaria tomando en cuanta los filtros
function GetMaquinariaTarjeta() {
    let json = "";
    let url = "../ws/Maquinaria/wsGetMaquinaria.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    // Llamar a la función para mostrar los datos en la tabla

                    datosObjetoMaquinaria = resp.datos;
                    llenarTablaMaquinariaTarjeta();
                    filterDataMaquinariaTarjeta();
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
function displayTableMaquinariaTarjeta(page) {
    const tableBody = document.getElementById("table-bodyMaquinaria");
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

            const precioFormateado = (record.phm !== undefined && record.phm !== "")
                ? formatoMXN.format(record.phm)
                : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            row.style.cursor = 'pointer';
            row.innerHTML = `
                <td class="Code">${record.idmaquinaria}</td>
                <td>${(!record.descripcion == "") ? record.descripcion : "---"}</td>
                <td>${(!record.unidad == "") ? record.unidad : "---"}</td>
                <td>${precioFormateado}</td>
               
            `;

            // Evento para doble clic
            row.addEventListener("dblclick", () => {
                // Verificar si el material ya fue agregado
                const existe = objTabla2ModalMaquinaria.some(Maquinaria => Maquinaria.idmaquinaria === record.idmaquinaria);

                // Si no existe, lo añadimos al arreglo
                if (!existe) {
                    objTabla2ModalMaquinaria.push({
                        idmaquinaria: record.idmaquinaria,
                        descripcion: record.descripcion,
                        phm: record.phm,
                        rhm: record.rhm,
                        fechaprecio: record.fechaprecio,
                        unidad: record.unidad,
                        estatus: true,
                    });
                    llenarTablaMaquinariaSeleccionados();
                } else {
                    mensajePantalla(msgYaAgregadoMaquinaria, false);
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
function setupPaginationMaquinariaTarjeta() {
    const paginationDiv = document.getElementById("paginationMaquinaria");
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
                displayTableMaquinariaTarjeta(currentPage);
                setupPaginationMaquinariaTarjeta();
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
                displayTableMaquinariaTarjeta(currentPage);
                setupPaginationMaquinariaTarjeta();
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
                displayTableMaquinariaTarjeta(currentPage);
                setupPaginationMaquinariaTarjeta();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

//Metodo para los filtros de la tabla
function filterDataMaquinariaTarjeta() {
    const searchText = document.getElementById("search-inputMaquinaria").value.toLowerCase();
    const unidadFilter = document.getElementById("unidad-filterMaquinaria").value;
    const statusFilter = 1;
    filteredData = datosObjetoMaquinaria.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value != null && value.toString().toLowerCase().includes(searchText)
        );
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesUnidad && matchesStatus;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableMaquinariaTarjeta(currentPage);
    setupPaginationMaquinariaTarjeta();
}

function llenarTablaMaquinariaTarjeta() {
    displayTableMaquinariaTarjeta(currentPage);
    setupPaginationMaquinariaTarjeta();
    const searchInput = document.getElementById("search-inputMaquinaria");
    searchInput.addEventListener("input", filterDataMaquinariaTarjeta);

    const unidadFilter = document.getElementById("unidad-filterMaquinaria");
    unidadFilter.addEventListener("change", filterDataMaquinariaTarjeta);

    const rowsPerPageSelect = document.getElementById("rows-per-pageMaquinaria");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableMaquinariaTarjeta(currentPage);
        setupPaginationMaquinariaTarjeta();
    });
}


function AbrirModalMaquinariaTarjeta() {
    $('#AgregarModalMaquinariaesConcepto').modal('show');
    const unidadFilter = document.getElementById("unidad-filterMaquinaria");
    unidadFilter.value = "";
    console.log(objTabla2ModalMaquinaria)
    console.log(objTabla2ModalMaquinariaPrincipal)
    objTabla2ModalMaquinaria = objTabla2ModalMaquinariaPrincipal;
    llenarTablaMaquinariaSeleccionados();
    GetMaquinariaTarjeta();
}



//Metodo para llenar tabla
function llenarTablaMaquinariaSeleccionados() {
    llenarTablaMaquinariaTarjetaModal();
    filterDataMaquinariaTarjetaModal();
}

function guardarDatosMaquinaria() {
    objTabla2ModalMaquinariaPrincipal = objTabla2ModalMaquinaria;
    llenarTablaMaquinariaSeleccionadosP();
}



//Método para el llenado de la tabla
function displayTableMaquinariaTarjetaModal(page) {
    const tableBody = document.getElementById("table-bodyMaquinariaTarjetaModal2");
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

            const precioFormateado = (record.phm !== undefined && record.phm !== "")
                ? formatoMXN.format(record.phm)
                : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            row.innerHTML = `
                 <td class="Code">${record.idmaquinaria}</td>
                <td>${(!record.descripcion == "") ? record.descripcion : "---"}</td>
                <td>${(!record.unidad == "") ? record.unidad : "---"}</td>
                <td>${precioFormateado}</td>
                 <td class="estatus">
                  <div style="display: flex; justify-content: space-around; align-items: center;">
                        <i class="coloresIcono fa-solid fa-x" style="cursor: pointer;" alt="Eliminar" onclick="eliminarFilaDelObjetoMaquinaria('${record.idmaquinaria}')"></i>
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
function eliminarFilaDelObjetoMaquinaria(codigo) {
    // Eliminar el material de objMaterialesSeleccionados usando su código
    objTabla2ModalMaquinaria.forEach((valor, index) => {
        if (codigo == valor.idmaquinaria) {
            objTabla2ModalMaquinaria.splice(index, 1);
        }
    });
    llenarTablaMaquinariaSeleccionados();
}

//Metodo para los filtros de la tabla
function filterDataMaquinariaTarjetaModal() {
    const unidadFilter = document.getElementById("selectUnidadMaquinariaModal").value;
    filteredData2 = objTabla2ModalMaquinaria.filter(record => {
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        return matchesUnidad;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableMaquinariaTarjetaModal(currentPage);
}

function llenarTablaMaquinariaTarjetaModal() {
    displayTableMaquinariaTarjetaModal(currentPage);
    const unidadFilter = document.getElementById("selectUnidadMaquinariaModal");
    unidadFilter.addEventListener("change", filterDataMaquinariaTarjetaModal);
}


