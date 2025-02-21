let msgEliminarObra = "Mano de obra deshabilitada";
let msgActivarObra = "Mano de obra habilitada";
let msgAgregarObra = "Mano de obra agregada";
let msgModificarObra = "Mano de obra modificada";

var estatusMano = 1;
let data = []

let guardo;
let unidadManoObra;
//Metodo que valida el formulario para agregar materiales y al mismo tiempo agrega el material
function AddManoObraValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};

    let id = document.querySelector('#AddidInputManodeobra');
    if (id.value == "") {
        id.classList.add("inputVacio");
        id.placeholder = "Requerido el ID"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = id;
        }
    }
    datos.id = id.value;
    let categoria = document.querySelector('#AddCategoriaInputManodeobra');
    if (categoria.value == "") {
        categoria.classList.add("inputVacio");
        categoria.placeholder = "Requerida la categoria"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = categoria;
        }

    }
    datos.categoria = categoria.value;
    let unidad = document.querySelector('#AddUnidadInputManodeobra');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        unidad.placeholder = "Requerida la unidad"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }
    }
    datos.unidad = unidad.value;

    let salario = document.querySelector('#AddsalarioInputManodeobra');
    if (salario.value == "") {
        salario.classList.add("inputVacio");
        salario.placeholder = "Requerido el salario"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = salario;
        }
    }
    datos.salario = salario.value;

    let fecha = document.querySelector('#AddfechaSalarioInput');
    if (fecha.value == "") {
        fecha.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = fecha;
        }
    }
    datos.precioFecha = FormateoFecha(fecha.value);

    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }

    checkManoObra("Add");
    if (existe) {
        id.focus();
        return;
    }
    guardo = true;
    let inputFile = document.getElementById('AddpdfInput');
    if (inputFile.value) {
        AddAgregarPDF()
        if (!guardo) {
            return;
        }
    }
    let json = JSON.stringify(datos);
    let url = "../ws/ManoObra/wsAddManoObra.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    AddCerrarModal();
                    GetManoObra();
                    mensajePantalla(msgAgregarObra, true);
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}


//Metodo para validar el modal para modificar un material y al mismo tiempo valida los datos
function UpdManoObraValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let idAnterior = document.querySelector('#UpdidAnteriorMano');
    datos.idAnterior = idAnterior.value;
    let id = document.querySelector('#UpdidInput');
    if (id.value == "") {
        id.classList.add("inputVacio");
        id.placeholder = "Requerido el ID"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = id;
        }
    }
    datos.id = id.value;
    let categoria = document.querySelector('#UpdCategoriaInputManodeobra');
    if (categoria.value == "") {
        categoria.classList.add("inputVacio");
        categoria.placeholder = "Requerida la categoria"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = categoria;
        }

    }
    datos.categoria = categoria.value;
    let unidad = document.querySelector('#updUnidadInputManodeobra');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }
    }
    datos.unidad = unidad.value;

    let salario = document.querySelector('#UpdsalarioInput');
    if (salario.value == "") {
        salario.classList.add("inputVacio");
        salario.placeholder = "Requerido el salario"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = salario;
        }
    }
    datos.salario = salario.value;

    let fecha = document.querySelector('#UpdfechaSalarioInput');
    if (fecha.value == "") {
        fecha.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = fecha;
        }
    }
    datos.precioFecha = FormateoFecha(fecha.value);
    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }

    if (existe) {
        id.focus();
        return;
    }
    guardo = true;
    let inputFile = document.getElementById('UpdpdfInput');
    if (inputFile.value) {
        UpdAgregarPDF();
        if (!guardo) {
            return;
        }
    }
    let json = JSON.stringify(datos);
    let url = "../ws/ManoObra/wsUpdManoObra.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    UpdateCerrarModal();
                    mensajePantalla(msgModificarObra, true);
                    GetManoObra();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}
function UpdAgregarPDF() {
    let id = document.querySelector('#UpdidInput').value;
    let idAnterior = document.querySelector('#UpdidAnteriorMano').value; // Obtener el ID anterior
    var inputFile = document.getElementById('UpdpdfInput');
    var file = inputFile.files[0];

    // Verificar el tamaño máximo del archivo (5 MB)
    var maxSizeBytes = 5 * 1024 * 1024;
    if (file.size <= maxSizeBytes) {
        // Verificar si el archivo es un PDF
        if (file.type === 'application/pdf') {
            var formData = new FormData();
            formData.append('pdfFile', file);
            formData.append('id', id);
            formData.append('idAnterior', idAnterior); // Añadir el ID anterior al FormData

            // Enviar el archivo al servidor
            $.ajax({
                url: './js/guardar_pdfManoObra.php', // Asegúrate de que la ruta es correcta
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log('PDF guardado:', response);
                    guardo = true;
                },
                error: function (error) {
                    console.error('Error al guardar el PDF:', error);
                    guardo = false;
                }
            });
        } else {
            mensajePantalla('El archivo seleccionado no es un PDF.', false);
            guardo = false;
        }
    } else {
        mensajePantalla('El tamaño del archivo excede el límite de 5 MB.', false);
        guardo = false;
    }
}
function AddAgregarPDF() {
    let id = document.querySelector('#AddidInputManodeobra').value;
    let inputFile = document.getElementById('AddpdfInput');
    let idAnterior = id;
    var file = inputFile.files[0];
    // Verificar el tamaño máximo del archivo (5 MB)
    var maxSizeBytes = 5 * 1024 * 1024;
    if (file.size <= maxSizeBytes) {
        // Verificar si el archivo es un PDF
        if (file.type === 'application/pdf') {
            var formData = new FormData();
            formData.append('pdfFile', file);
            formData.append('id', id);
            formData.append('idAnterior', idAnterior);
            // Enviar el archivo al servidor
            $.ajax({
                url: './js/guardar_pdfManoObra.php',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log('PDF guardado:', response);
                    guardo = true;
                },
                error: function (error) {
                    console.error('Error al guardar el PDF:', error);
                    guardo = false;
                }
            });
        } else {
            mensajePantalla('El archivo no es un PDF.', false);
            guardo = false;
        }
    } else {
        mensajePantalla('El tamaño del archivo excede el límite de 5 MB.', false);
        guardo = false;
    }
}

function checkManoObra(modal) {
    const datos = {}
    if (modal == "Add") {
        var idVali = document.querySelector('#AddidInputManodeobra');
    } else {
        var idVali = document.querySelector('#UpdidInput');
        let idAnterior = document.querySelector('#UpdidAnteriorMano');
        if (idVali.value == idAnterior.value) {
            existe = false;
            return;
        }
    }

    if (idVali.value == "") {
        return;
    }
    datos.id = idVali.value;
    let json = JSON.stringify(datos);

    let url = "../ws/ManoObra/wscheckManoObra.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {

                let resp = JSON.parse(responseText);
                comprobarExiste(resp.estado, idVali)
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

//Metodo para cambiar el estatus de los materiales
function CambioEstatusManoObra() {
    const datos = {};
    datos.id = idEliminar;
    if (ActivarS == 1) {
        datos.estatus = "Inactivo";
    } else {
        datos.estatus = "Activo";
    }
    let json = JSON.stringify(datos);
    switch (parseInt(ActivarS)) {
        case 0: {
            let url = "../ws/ManoObra/wsCambiarStatus.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        mensajePantalla(msgActivarObra, true)
                        paginaActual = 1;
                        GetManoObra();
                    } else {
                        throw e = status;
                    }
                } catch (error) {
                    alert("Error: " + error)
                }
            });
            break;
        }
        case 1: {
            let url = "../ws/ManoObra/wsCambiarStatus.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        GetManoObra();
                        paginaActual = 1;
                        mensajePantalla(msgEliminarObra, true)
                    } else {
                        throw e = status;
                    }
                } catch (error) {
                    alert("Error: " + error)
                }
            });
            break;
        }
        default: {
            console.error("Error")
        }
    }

}


//Metodo para hacer la consulta de los materiales tomando en cuanta los filtros
function GetManoObra() {
    let json = ""
    let url = "../ws/ManoObra/wsGetManoObra.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    data = resp.datos;
                    console.log(data);
                    llenarTablaManoObra();
                    filterDataManoObra();
                    llenarUnidadTablaManoObra();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}


function displayTableManoObra(page) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredData.slice(start, end);
    if (paginatedData.length > 0) {
        paginatedData.forEach(record => {
            // Crear un elemento de fila (tr)
            const row = document.createElement('tr');
            row.classList.add('fila');

            // Establecer el contenido HTML de la fila
            row.innerHTML = `
                <td class="Code">${record.idmanoobra}</td>
                <td>${(!record.categoria == "") ? record.categoria : "---"}</td>
                <td>${(!record.unidad == "") ? record.unidad : "---"}</td>
                <td>${(!record.salario == "") ? record.salario : "---"}</td>
                <td>${(!record.fechasalario == "") ? record.fechasalario : "---"}</td>
                <td class="estatus">
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        ${record.estatus == 1 ? `
                            <i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;" alt="Modificar" data-bs-toggle="modal" data-bs-target="#EditarModal" onclick="llenarModalModificarManoObra('${record.idmanoobra}','${record.categoria}','${record.unidad}',${record.salario},'${record.fechasalario}')"></i>
                        ` : ``}
                        
                        <!-- Ícono para ver PDF, llamando a la función verPDF -->
                        <i class="coloresIcono fa-regular fa-file-pdf" style="cursor: pointer;" alt="Ver PDF" onclick="verPDF('${record.idmanoobra}')"></i>

                        ${record.estatus == 1 ?
                    `<i class="coloresIcono fa-solid fa-square-check" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores('${record.idmanoobra}',${record.estatus})"></i>` :
                    `<i class="coloresIcono fa-solid fa-square" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores('${record.idmanoobra}',${record.estatus})"></i>`
                }
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
        const row = `<tr>
                        <td colspan="6" class="Code">Sin resultados</td>
                     </tr>`;
        tableBody.innerHTML += row;
    }
}

// Función para abrir el PDF en una nueva pestaña
function verPDF(idmanoobra) {
    // Construir la ruta del directorio donde se encuentra el archivo PDF
    const pdfDirectory = `../PDFManoObra/${idmanoobra}/`;

    // Llamar al servidor para obtener la lista de archivos en la carpeta
    fetch(pdfDirectory)
        .then(response => {
            if (response.ok) {
                // Si la carpeta existe, buscar el primer archivo PDF
                return response.text();
            } else {
                mensajePantalla("Mano de obra sin PDF");
            }
        })
        .then(data => {
            // Buscar el primer archivo PDF en la respuesta
            const pdfFileMatch = data.match(/href="([^"]+\.pdf)"/);
            if (pdfFileMatch) {
                // Si encontramos un archivo PDF, construir la URL completa
                const pdfPath = pdfDirectory + pdfFileMatch[1];
                // Abrir el PDF en una nueva pestaña
                window.open(pdfPath, '_blank');
            }
        })
        .catch(error => {
            console.error('Error al verificar el archivo:', error);
        });
}

function setupPaginationManoObra() {
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
                displayTableManoObra(currentPage);
                setupPaginationManoObra();
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
                displayTableManoObra(currentPage);
                setupPaginationManoObra();
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
                displayTableManoObra(currentPage);
                setupPaginationManoObra();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

function filterDataManoObra() {
    const searchText = document.getElementById("search-input").value.toLowerCase();
    const unidadFilter = document.getElementById("unidad-filter").value;
    const statusFilter = estatusMano;

    filteredData = data.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value.toString().toLowerCase().includes(searchText)
        );
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesUnidad && matchesStatus;
    });

    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableManoObra(currentPage);
    setupPaginationManoObra();
}

function llenarTablaManoObra() {
    displayTableManoObra(currentPage);
    setupPaginationManoObra();

    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", filterDataManoObra);

    const unidadFilter = document.getElementById("unidad-filter");
    unidadFilter.addEventListener("change", filterDataManoObra);

    const rowsPerPageSelect = document.getElementById("rows-per-page");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableManoObra(currentPage);
        setupPaginationManoObra();
    });
}




//Metodo para limpiar el modal de agregar mano de obra
function AddlimpiarModalManoObra() {
    console.log(idManoObraAutomatico())
    let idMO = document.querySelector('#AddidInputManodeobra');
    let categoriaMO = document.querySelector('#AddCategoriaInputManodeobra');
    let UnidadMO = document.querySelector('#AddUnidadInputManodeobra');
    let salarioMO = document.querySelector('#AddsalarioInputManodeobra');
    let InputPdf = document.querySelector('#AddpdfInput');
    InputPdf.value = "";
    let fechaActual = new Date();
    let año = fechaActual.getFullYear();
    let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    let dia = fechaActual.getDate().toString().padStart(2, '0');
    let fechaFormateada = `${año}-${mes}-${dia}`;
    document.querySelector('#AddfechaSalarioInput').value = fechaFormateada;

    idMO.value = idManoObraAutomatico();

    categoriaMO.value = "";
    UnidadMO.value = "";
    salarioMO.value = "";

    salarioMO.placeholder = "";

    categoriaMO.classList.remove("inputVacio");
    UnidadMO.classList.remove("inputVacio");
    salarioMO.classList.remove("inputVacio");
}

//Metodo para cambiar la imagen del toggle a la hora de darle clic para cambiar entre materiales activos e inactivos
function valStatusManoObra() {
    var checkbox = document.getElementById('ValCheEsta');
    var imgcheck = document.getElementById('ValEstatus');
    // Deseleccionar el checkbox
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        imgcheck.src = "../img/toggle_on_35px.png"
        estatusMano = 1;
    } else {
        imgcheck.src = "../img/toggle_off_35px.png"
        estatusMano = 0;
    }
    filterDataManoObra();
}

//Metodo para que se llene el modal de modificar con los datos seleccionados de la fila
//Recibe los datos del material
function llenarModalModificarManoObra(id, categoria, unidad, salario, fechaSalario) {
    console.log(categoria)
    //Llenado de datos en el modal
    let idMO = document.querySelector('#UpdidInput');
    let categoriaMO = document.querySelector('#UpdCategoriaInputManodeobra');
    let UnidadMO = document.querySelector('#updUnidadInputManodeobra');
    let salarioMO = document.querySelector('#UpdsalarioInput');
    let idAnterior = document.querySelector('#UpdidAnteriorMano');
    let inputFile = document.getElementById('UpdpdfInput');
    inputFile.value = "";

    idAnterior.value = id;
    idMO.value = id;
    salarioMO.value = salario;
    categoriaMO.value = categoria;
    UnidadMO.value = unidad;



    if (fechaSalario != "0000-00-00" && fechaSalario != null) {
        document.querySelector('#UpdfechaSalarioInput').value = FormateoFecha(fechaSalario);
    } else {
        let fechaActual = new Date();
        let año = fechaActual.getFullYear();
        let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses en JavaScript van de 0 a 11
        let dia = fechaActual.getDate().toString().padStart(2, '0');
        let fechaFormateada = `${año}-${mes}-${dia}`;
        document.querySelector('#UpdfechaSalarioInput').value = fechaFormateada;
    }

    idMO.placeholder = "";
    salarioMO.placeholder = "";
    UnidadMO.placeholder = "";
    idMO.classList.remove("inputVacio");
    categoriaMO.classList.remove("inputVacio");
    UnidadMO.classList.remove("inputVacio");
    salarioMO.classList.remove("inputVacio");

}

//Metodo para abrir el modal dependiendo si se abre para activar o eliminar
// function AbrirModalConfirm1() {
//     let estatus = document.getElementById('ValCheEsta').checked;
//     if (estatus) {
//         $('#confirmDeleteModal').modal('show');
//     } else {
//         $('#confirmActivationModal').modal('show');
//     }
// }


function idManoObraAutomatico() {
    if (data.length === 0) {
        return "Mano01";
    }
    // Extrae el último número de idconbasi en el arreglo de data
    let maxIdNumber = data.reduce((max, item) => {
        // Obtiene el número después de "ba" y lo convierte en un entero
        const idNumber = parseInt(item.idmanoobra.replace("Mano", ""), 10);
        return Math.max(max, idNumber);
    }, 0);

    // Incrementa el número más alto encontrado y genera el nuevo id
    const newId = `Mano${String(maxIdNumber + 1).padStart(2, '0')}`;

    return newId;
}

