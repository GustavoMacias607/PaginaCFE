let objTabla2Modal = [];
let msgYaAgregado = "Material ya agregado";
let cantidadFilasTabla = 999;

//Metodo para hacer la consulta de los materiales tomando en cuanta los filtros
function GetMaterialesTarjeta() {
    let json = "";
    let url = "../ws/Materiales/wsGetMateriales.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    // Llamar a la función para mostrar los datos en la tabla

                    datosObjetoMateriales = resp.datos;
                    llenarTablaMaterialesTarjeta();
                    filterDataMaterialesTarjeta();
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
function displayTableMaterialesTarjeta(page) {
    const tableBody = document.getElementById("table-bodyMaterialesTarjetaModal");
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

            const precioFormateado = (record.precio !== undefined && record.precio !== "")
                ? formatoMXN.format(record.precio)
                : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            row.style.cursor = 'pointer';
            row.innerHTML = `
                <td class="Code">${record.codigo}</td>
                <td>${(!record.norma == "") ? record.norma : "Sin norma"}</td>
                <td>${(!record.descripcion == "") ? record.descripcion : "---"}</td>
                <td>${precioFormateado}</td>
                <td>${(!record.fechaprecio == "") ? record.fechaprecio : "---"}</td>
                <td>${(!record.familia == "") ? record.familia : "---"}</td>
                <td>${(!record.unidad == "") ? record.unidad : "---"}</td>
                <td class="estatus">
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        <div class="miDiv imaCuadro">
                            <img class="imagenPreview" style="text-align: left !important;" src="../Materiales/118">
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        <i class="miImagen coloresIcono fa-regular fa-images" style="cursor: pointer;" alt="Mostrar Imagen" onmouseover="mostrarDiv(this)" onmouseout="ocultarDiv(this)"></i>
                    </div>
                </td>
            `;

            // Evento para doble clic
            row.addEventListener("dblclick", () => {
                // Verificar si el material ya fue agregado
                const existe = objTabla2Modal.some(material => material.codigo === record.codigo);

                // Si no existe, lo añadimos al arreglo
                if (!existe) {
                    objTabla2Modal.push({
                        codigo: record.codigo,
                        norma: record.norma,
                        descripcion: record.descripcion,
                        precio: record.precio,
                        fechaprecio: record.fechaprecio,
                        unidad: record.unidad,
                        familia: record.familia,
                        cantidad: 0,
                        suministrado: false,
                        estatus: true,
                    });

                    llenarTablaMaterialesSeleccionados();
                } else {
                    mensajePantalla(msgYaAgregado, false);
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
function setupPaginationMaterialesTarjeta() {
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
                displayTableMaterialesTarjeta(currentPage);
                setupPaginationMaterialesTarjeta();
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
                displayTableMaterialesTarjeta(currentPage);
                setupPaginationMaterialesTarjeta();
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
                displayTableMaterialesTarjeta(currentPage);
                setupPaginationMaterialesTarjeta();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

//Metodo para los filtros de la tabla
function filterDataMaterialesTarjeta() {
    const searchText = document.getElementById("search-inputMateriales").value.toLowerCase();
    const unidadFilter = document.getElementById("selectUnidadMateriales").value;
    const familiaFilter = document.getElementById("selectFamiliaMateriales").value;
    const statusFilter = 1;
    filteredData = datosObjetoMateriales.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value != null && value.toString().toLowerCase().includes(searchText)
        );
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        const matchesFamilia = familiaFilter ? record.familia == familiaFilter : true;
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesUnidad && matchesStatus && matchesFamilia;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableMaterialesTarjeta(currentPage);
    setupPaginationMaterialesTarjeta();
}

function llenarTablaMaterialesTarjeta() {
    displayTableMaterialesTarjeta(currentPage);
    setupPaginationMaterialesTarjeta();
    const searchInput = document.getElementById("search-inputMateriales");
    searchInput.addEventListener("input", filterDataMaterialesTarjeta);

    const unidadFilter = document.getElementById("selectUnidadMateriales");
    unidadFilter.addEventListener("change", filterDataMaterialesTarjeta);

    const familiaFilter = document.getElementById("selectFamiliaMateriales");
    familiaFilter.addEventListener("change", filterDataMaterialesTarjeta);

    const rowsPerPageSelect = document.getElementById("rows-per-page");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableMaterialesTarjeta(currentPage);
        setupPaginationMaterialesTarjeta();
    });
}

// Muestra el panel donde se muestra la imagen del material
//Recibe la ubicacion de la fila del cual se mostrara la imagen
function mostrarDiv(imagen) {
    var div = imagen.parentElement.parentElement.querySelector(".miDiv");
    var id = imagen.parentElement.parentElement.parentElement.querySelector(".Code").innerHTML;
    rutaCarpeta = "../Materiales/" + id;
    cargarImagenCuadro(div)
    // Mostrar el div
    div.style.display = "block";
}

// Muestra el panel donde se muestra la imagen del material
//Recibe la ubicacion de la fila del cual se ocultara la imagen
function ocultarDiv(imagen) {
    var div = imagen.parentElement.parentElement.querySelector(".miDiv");
    // Ocultar el div
    div.style.display = "none";
}


function AbrirModalMaterialesTarjeta() {
    $('#AgregarModalMaterialesConcepto').modal('show');
    const unidadFilter = document.getElementById("selectUnidadMaterialesModal");
    unidadFilter.value = "";
    rowsPerPage = 10;
    llenarTablaMaterialesSeleccionadosP();
    objTabla2Modal = filteredData2;
    llenarTablaMaterialesSeleccionados();
    GetMaterialesTarjeta();
}
function guardarMaterialesSeleccionados() {
    objTabla2ModalMaterialesPrincipal = objTabla2Modal;
}

//Metodo para llenar tabla
function llenarTablaMaterialesSeleccionados() {
    llenarTablaMaterialesTarjetaModal();
    filterDataMaterialesTarjetaModal();
}


//Método para el llenado de la tabla
function displayTableMaterialesTarjetaModal(page) {
    const tableBody = document.getElementById("table-bodyMaterialesTarjetaModal2");
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

            const precioFormateado = (record.precio !== undefined && record.precio !== "")
                ? formatoMXN.format(record.precio)
                : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            if (!record.estatus) {
                row.classList.add('DatoInactivo')
            }
            row.innerHTML = `
                <td class="Code">${record.codigo}</td>
                <td>${(!record.norma == "") ? record.norma : "Sin norma"}</td>
                <td>${(!record.descripcion == "") ? record.descripcion : "---"}</td>
                <td>${precioFormateado}</td>
                <td>${(!record.fechaprecio == "") ? record.fechaprecio : "---"}</td>
                <td>${(!record.unidad == "") ? record.unidad : "---"}</td>
                <td class="estatus">
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        <div class="miDiv imaCuadro">
                            <img class="imagenPreview" src="../Materiales/118">
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        <i class="miImagen coloresIcono fa-regular fa-images" style="cursor: pointer;" alt="Mostrar Imagen" onmouseover="mostrarDiv(this)" onmouseout="ocultarDiv(this)"></i>
                        <i class="coloresIcono fa-solid fa-x" style="cursor: pointer;" alt="Eliminar" onclick="eliminarFilaDelObjeto('${record.codigo}')"></i>
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
function eliminarFilaDelObjeto(codigo) {
    // Eliminar el material de objMaterialesSeleccionados usando su código
    objTabla2Modal.forEach((valor, index) => {
        if (codigo == valor.codigo) {
            objTabla2Modal.splice(index, 1);
        }
    });
    llenarTablaMaterialesSeleccionados();


}

//Metodo para los filtros de la tabla
function filterDataMaterialesTarjetaModal() {
    const unidadFilter = document.getElementById("selectUnidadMaterialesModal").value;
    console.log(objTabla2Modal)
    filteredData2 = objTabla2Modal.filter(record => {
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        return matchesUnidad;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableMaterialesTarjetaModal(currentPage);
}

function llenarTablaMaterialesTarjetaModal() {
    displayTableMaterialesTarjetaModal(currentPage);
    const unidadFilter = document.getElementById("selectUnidadMaterialesModal");
    unidadFilter.addEventListener("change", filterDataMaterialesTarjetaModal);
}


