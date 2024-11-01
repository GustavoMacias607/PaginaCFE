let objTabla2ModalManoObra = [];
let msgYaAgregadoManoObra = "Mano de obra ya agregada";

let datosObjetoManoObra = [];

//Metodo para hacer la consulta de los materiales tomando en cuanta los filtros
function GetManoObraTarjeta() {
    let json = "";
    let url = "../ws/ManoObra/wsGetManoObra.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    // Llamar a la función para mostrar los datos en la tabla

                    datosObjetoManoObra = resp.datos;
                    llenarTablaManoObraTarjeta();
                    filterDataManoObraTarjeta();
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
function displayTableManoObraTarjeta(page) {
    const tableBody = document.getElementById("table-bodyManoObra");
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

            const precioFormateado = (record.salario !== undefined && record.salario !== "")
                ? formatoMXN.format(record.salario)
                : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            row.style.cursor = 'pointer';
            row.innerHTML = `
                <td class="Code">${record.idmanoobra}</td>
                <td>${(!record.categoria == "") ? record.categoria : "---"}</td>
                <td>${(!record.unidad == "") ? record.unidad : "---"}</td>
                <td>${precioFormateado}</td>
               
            `;

            // Evento para doble clic
            row.addEventListener("dblclick", () => {
                // Verificar si el material ya fue agregado
                const existe = objTabla2ModalManoObra.some(manoobra => manoobra.idmanoobra === record.idmanoobra);

                // Si no existe, lo añadimos al arreglo
                if (!existe) {
                    objTabla2ModalManoObra.push({
                        idmanoobra: record.idmanoobra,
                        salario: record.salario,
                        fechasalario: record.fechasalario,
                        unidad: record.unidad,
                        categoria: record.categoria,
                        cantidad: 0,
                        rendimiento: 0,
                        estatus: true,
                    });

                    llenarTablaManoObraSeleccionados();
                } else {
                    mensajePantalla(msgYaAgregadoManoObra, false);
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
function setupPaginationManoObraTarjeta() {
    const paginationDiv = document.getElementById("paginationManoObra");
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
                displayTableManoObraTarjeta(currentPage);
                setupPaginationManoObraTarjeta();
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
                displayTableManoObraTarjeta(currentPage);
                setupPaginationManoObraTarjeta();
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
                displayTableManoObraTarjeta(currentPage);
                setupPaginationManoObraTarjeta();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

//Metodo para los filtros de la tabla
function filterDataManoObraTarjeta() {
    const searchText = document.getElementById("search-inputManoObra").value.toLowerCase();
    const unidadFilter = document.getElementById("unidad-filterManoObra").value;
    const categoriaFilter = document.getElementById("categoria-filterManoObra").value;
    const statusFilter = 1;
    filteredData = datosObjetoManoObra.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value != null && value.toString().toLowerCase().includes(searchText)
        );
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        const matchesCategoria = categoriaFilter ? record.categoria == categoriaFilter : true;
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesUnidad && matchesStatus && matchesCategoria;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableManoObraTarjeta(currentPage);
    setupPaginationManoObraTarjeta();
}

function llenarTablaManoObraTarjeta() {
    displayTableManoObraTarjeta(currentPage);
    setupPaginationManoObraTarjeta();
    const searchInput = document.getElementById("search-inputManoObra");
    searchInput.addEventListener("input", filterDataManoObraTarjeta);

    const unidadFilter = document.getElementById("unidad-filterManoObra");
    unidadFilter.addEventListener("change", filterDataManoObraTarjeta);

    const categoriaFilter = document.getElementById("categoria-filterManoObra");
    categoriaFilter.addEventListener("change", filterDataManoObraTarjeta);

    const rowsPerPageSelect = document.getElementById("rows-per-pageManoObra");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableManoObraTarjeta(currentPage);
        setupPaginationManoObraTarjeta();
    });
}


function AbrirModalManoObraTarjeta() {
    $('#AgregarModalManodeobraesConcepto').modal('show');
    const unidadFilter = document.getElementById("unidad-filterManoObra");
    unidadFilter.value = "";
    const CategoriaFilter = document.getElementById("categoria-filterManoObra");
    CategoriaFilter.value = "";
    objTabla2ModalManoObra = objTabla2ModalManoObraiaPrincipal;
    llenarTablaManoObraSeleccionados();
    GetManoObraTarjeta();
}



//Metodo para llenar tabla
function llenarTablaManoObraSeleccionados() {
    llenarTablaManoObraTarjetaModal();
    filterDataManoObraTarjetaModal();
}

function guardarDatosManoObra() {
    objTabla2ModalManoObraiaPrincipal = objTabla2ModalManoObra;
    llenarTablaManoObraSeleccionados();
}


//Método para el llenado de la tabla
function displayTableManoObraTarjetaModal(page) {
    const tableBody = document.getElementById("table-bodyManoObraTarjetaModal2");
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

            const precioFormateado = (record.salario !== undefined && record.salario !== "")
                ? formatoMXN.format(record.salario)
                : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            row.innerHTML = `
                 <td class="Code">${record.idmanoobra}</td>
                <td>${(!record.categoria == "") ? record.categoria : "---"}</td>
                <td>${(!record.unidad == "") ? record.unidad : "---"}</td>
                <td>${precioFormateado}</td>
                 <td class="estatus">
                  <div style="display: flex; justify-content: space-around; align-items: center;">
                        <i class="coloresIcono fa-solid fa-x" style="cursor: pointer;" alt="Eliminar" onclick="eliminarFilaDelObjetoManoObra('${record.idmanoobra}')"></i>
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
function eliminarFilaDelObjetoManoObra(codigo) {
    // Eliminar el material de objMaterialesSeleccionados usando su código
    objTabla2ModalManoObra.forEach((valor, index) => {
        if (codigo == valor.idmanoobra) {
            objTabla2ModalManoObra.splice(index, 1);
        }
    });
    llenarTablaManoObraSeleccionados();


}

//Metodo para los filtros de la tabla
function filterDataManoObraTarjetaModal() {
    const unidadFilter = document.getElementById("selectUnidadManoObraModal").value;
    const cateogiriaFilter = document.getElementById("selectCategoriaManoObraModal").value;
    filteredData2 = objTabla2ModalManoObra.filter(record => {
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        const matchesCategoria = cateogiriaFilter ? record.categoria == cateogiriaFilter : true;
        return matchesUnidad && matchesCategoria;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableManoObraTarjetaModal(currentPage);
}

function llenarTablaManoObraTarjetaModal() {
    displayTableManoObraTarjetaModal(currentPage);
    const unidadFilter = document.getElementById("selectUnidadManoObraModal");
    unidadFilter.addEventListener("change", filterDataManoObraTarjetaModal);
    const cateogiriaFilter = document.getElementById("selectCategoriaManoObraModal");
    cateogiriaFilter.addEventListener("change", filterDataManoObraTarjetaModal);
}


