let conceptosICM;

async function obtenerDatosConceptosICM(valor) {
    const spinner = document.querySelector(".sk-circle");
    spinner.style.display = "block";
    if (!valor) {
        selectedRows = [];
        selectedCheckboxes = {};
        objetoPropuestasSeleccionadas = [];
        PropuestasICM = [];
        selectedPropuestas = [];
    }
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
    $.post(url, json, (responseText, status) => {
        try {
            if (status === "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado === "OK") {
                    llenarUnidadTabla(2);
                    conceptosICM = resp.datos;
                    console.log(conceptosICM);
                    llenarTablaConceptoICM();
                    filterDataConceptoICM();
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

function displayTableConceptoICM(page) {
    const tableBody = document.getElementById("table-bodyConceptosICM");
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredData.slice(start, end);

    document.getElementById('columFamilia').style.display = 'table-cell';
    if (paginatedData.length > 0) {
        paginatedData.forEach(record => {
            const row = document.createElement('tr');
            row.classList.add('fila');
            // Establecer el contenido HTML de la fila
            row.innerHTML = `
                    <td class="Code">${record.idconcepto}</td>
                    <td>${record.nombre !== "" ? record.nombre : "---"}</td>
                    <td>${record.unidad !== "" ? record.unidad : "---"}</td>
                    <td>${record.nombreespe !== "" ? record.nombreespe : "---"}</td>
                    <td class="estatus">
                        <div style="display: flex; justify-content: space-around; align-items: center;">
                            ${record.estatus == 1 ? `
                                <input type="checkbox" 
                                       class="custom-checkbox" 
                                       id="checkbox_${record.idconcepto}" 
                                       onchange="toggleRowSelection('${record.idconcepto}', '${record.nombre}', '${record.unidad}', '${record.total}', '${record.nombreespe}', this.checked)"
                                       ${selectedCheckboxes[record.idconcepto] ? 'checked' : ''}>
                                <label for="checkbox_${record.idconcepto}" class="checkbox-design"></label>
                            ` : ``}
                        </div>
                    </td>
                `;
            // Añadir eventos mouseover y mouseout
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));
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

function setupPaginationConceptoICM() {
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
                displayTableConceptoICM(currentPage);
                setupPaginationConceptoICM();
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
                displayTableConceptoICM(currentPage);
                setupPaginationConceptoICM();
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
                displayTableConceptoICM(currentPage);
                setupPaginationConceptoICM();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

function filterDataConceptoICM() {
    const searchText = document.getElementById("search-inputConcepto").value.toLowerCase();
    const unidadFilter = document.getElementById("unidad-filterConcepto").value;

    const statusFilter = true;
    filteredData = conceptosICM.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value != null && value.toString().toLowerCase().includes(searchText)
        );
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesUnidad && matchesStatus;
    });

    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableConceptoICM(currentPage);
    setupPaginationConceptoICM();
}

function llenarTablaConceptoICM() {
    displayTableConceptoICM(currentPage);
    setupPaginationConceptoICM();
    const searchInput = document.getElementById("search-inputConcepto");
    searchInput.addEventListener("input", filterDataConceptoICM);

    const unidadFilter = document.getElementById("unidad-filterConcepto");
    unidadFilter.addEventListener("change", filterDataConceptoICM);

    const rowsPerPageSelect = document.getElementById("rows-per-page");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableConceptoICM(currentPage);
        setupPaginationConceptoICM();
    });
}