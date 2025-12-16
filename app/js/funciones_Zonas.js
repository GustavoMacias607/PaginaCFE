
let msgEliminarZona = "Zona deshabilitada";
let msgActivarZona = "Zona habilitada";
let msgAgregarZona = "Zona agregada";
let msgModificarZona = "Zona modificada";
var estatusZona = 1;

//Metodo que valida el formulario para agregar usuarios y al mismo tiempo agrega el usuario
function AddZonaValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let id = document.querySelector('#AddidInput');
    datos.id = id.value;
    let zona = document.querySelector('#AddZonaInput');
    if (zona.value == "") {
        zona.classList.add("inputVacio");
        zona.placeholder = "Requerida la zona"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = zona;
        }
    }
    datos.zona = zona.value;
    let obra = document.querySelector('#AddObraInput');
    if (obra.value == "") {
        obra.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = obra;
        }

    }
    datos.obra = obra.value;

    let indirecto = document.querySelector('#AddIndirecto');
    if (indirecto.value == "") {
        indirecto.classList.add("inputVacio");
        indirecto.placeholder = "Requerido el C. indirecto"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = indirecto;
        }
    }
    datos.indirecto = indirecto.value;

    let financiamiento = document.querySelector('#AddFinanciamiento');
    if (financiamiento.value == "") {
        financiamiento.classList.add("inputVacio");
        financiamiento.placeholder = "Requerido el financiamiento"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = financiamiento;
        }
    }
    datos.financiamiento = financiamiento.value;
    let utilidad = document.querySelector('#AddUtilidad');
    if (utilidad.value == "") {
        utilidad.classList.add("inputVacio");
        utilidad.placeholder = "Requerida la utilidad"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = utilidad;
        }

    }
    datos.utilidad = utilidad.value;

    let adicionales = document.querySelector('#AddAdicionales');
    if (adicionales.value == "") {
        adicionales.classList.add("inputVacio");
        adicionales.placeholder = "Requeridos los C. adicionales"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = adicionales;
        }

    }
    datos.adicionales = adicionales.value;
    datos.fecha = SacarFecha();
    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }

    guardo = true;
    let inputFile = document.getElementById('AddpdfInput');
    if (inputFile.value) {
        AddAgregarPDFZona()
        if (!guardo) {
            return;
        }
    }

    let json = JSON.stringify(datos);
    console.log(json)
    let url = "../ws/Zonas/wsAddZona.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp)
                if (resp.estado == "OK") {
                    AddCerrarModal();
                    mensajePantalla(msgAgregarZona, true);
                    GetZona();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });

}

//Metodo para validar el modal para modificar un usuario y al mismo tiempo valida los datos
function UpdZonaValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let id = document.querySelector('#UpdidInput');
    datos.id = id.value;
    let zona = document.querySelector('#UpdZonaInput');
    if (zona.value == "") {
        zona.classList.add("inputVacio");
        zona.placeholder = "Requerida la zona"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = zona;
        }
    }
    datos.zona = zona.value;
    let obra = document.querySelector('#UpdObraInput');
    if (obra.value == "") {
        obra.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = obra;
        }

    }
    datos.obra = obra.value;

    let indirecto = document.querySelector('#UpdIndirecto');
    if (indirecto.value == "") {
        indirecto.classList.add("inputVacio");
        indirecto.placeholder = "Requerido el C. indirecto"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = indirecto;
        }
    }
    datos.indirecto = indirecto.value;

    let financiamiento = document.querySelector('#UpdFinanciamiento');
    if (financiamiento.value == "") {
        financiamiento.classList.add("inputVacio");
        financiamiento.placeholder = "Requerido el financiamiento"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = financiamiento;
        }
    }
    datos.financiamiento = financiamiento.value;
    let utilidad = document.querySelector('#UpdUtilidad');
    if (utilidad.value == "") {
        utilidad.classList.add("inputVacio");
        utilidad.placeholder = "Requerida la utilidad"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = utilidad;
        }

    }
    datos.utilidad = utilidad.value;

    let adicionales = document.querySelector('#UpdAdicionales');
    if (adicionales.value == "") {
        adicionales.classList.add("inputVacio");
        adicionales.placeholder = "Requeridos los C. adicionales"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = adicionales;
        }

    }
    datos.adicionales = adicionales.value;
    datos.fecha = SacarFecha();
    guardo = true;
    let inputFile = document.getElementById('UpdpdfInput');
    if (inputFile.value) {
        UpdAgregarPDFZona()
        if (!guardo) {
            return;
        }
    }
    let json = JSON.stringify(datos);
    console.log(json)
    let url = "../ws/Zonas/wsUpdZona.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp)
                if (resp.estado == "OK") {
                    UpdateCerrarModal();
                    mensajePantalla(msgModificarZona, true);
                    GetZona();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

//Metodo para cambiar el estatus de los usuarios
function CambioEstatusZona() {
    const datos = {};
    let url = "../ws/Zonas/wsCambiarStatus.php";
    let msgzo = "";
    datos.id = idEliminar;
    if (ActivarS == 1) {
        datos.estatus = "Inactivo";
        msgzo = msgEliminarZona;
    } else {
        datos.estatus = "Activo";
        msgzo = msgActivarZona;
    }
    let json = JSON.stringify(datos);
    console.log(json);
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                mensajePantalla(msgzo, true)
                paginaActual = 1;
                GetZona();
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });

}


//Metodo para hacer la consulta de los usuarios tomando en cuanta los filtros
function GetZona() {
    let json = "";
    let url = "../ws/Zonas/wsGetZona.php";
    $.post(url, json, (responseText, status) => {
        try {

            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp);
                if (resp.estado == "OK") {
                    data = resp.datos;
                    llenarTablaZona();
                    filterDataZona();
                }
                else {
                    data = [];
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}

function displayTableZona(page) {
    const tableBody = document.getElementById("table-bodyZona");
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
                <td class="Code" style="text-align: right;">${record.idzona}</td>
                <td>${(!record.zona == "") ? record.zona : "---"}</td>
                <td>${(!record.obra == "") ? record.obra : "---"}</td>
                <td style="text-align: right;">${(!record.indirecto == "") ? record.indirecto : "---"}%</td>
                <td style="text-align: right;">${(!record.financiamiento == "") ? record.financiamiento : "---"}%</td>
                <td style="text-align: right;">${(!record.utilidad == "") ? record.utilidad : "---"}%</td>
                <td style="text-align: right;">${(!record.adicionales == "") ? record.adicionales : "---"}%</td>
                <td class="estatus">
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        ${record.estatus == 1 ? `
                            <i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;" alt="Modificar" data-bs-toggle="modal" data-bs-target="#EditarModal" 
                        onclick="llenarModalModificarZona(${record.idzona},'${record.zona}','${record.obra}','${record.fecha}',${record.indirecto},${record.financiamiento},${record.utilidad},${record.adicionales})"></i>
                        ` : ``}
                        <i class="coloresIcono fa-regular fa-file-pdf" style="cursor: pointer;" alt="Ver PDF" onclick="verPDFZona('${record.idzona}')"></i>
                        ${record.estatus == 1 ?
                    `<i class="coloresIcono fa-solid fa-square-check" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${record.idzona},${record.estatus})"></i>` :
                    `<i class="coloresIcono fa-solid fa-square" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${record.idzona},${record.estatus})"></i>`
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
                        <td colspan="8" class="Code">Sin resultados</td>
                     </tr>`;
        tableBody.innerHTML += row;
    }

}

function setupPaginationZona() {
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
                displayTableZona(currentPage);
                setupPaginationZona();
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
                displayTableZona(currentPage);
                setupPaginationZona();
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
                displayTableZona(currentPage);
                setupPaginationZona();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

function filterDataZona() {
    const searchText = document.getElementById("search-inputZona").value.toLowerCase();
    const obraFilter = document.getElementById("FilterObra").value;
    const statusFilter = estatusZona;
    filteredData = data.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value.toString().toLowerCase().includes(searchText)
        );
        const matchesObra = obraFilter ? record.obra == obraFilter : true;
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesStatus && matchesObra;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableZona(currentPage);
    setupPaginationZona();
}

function llenarTablaZona() {
    displayTableZona(currentPage);
    setupPaginationZona();
    const searchInput = document.getElementById("search-inputZona");
    searchInput.addEventListener("input", filterDataZona);

    const obraFilter = document.getElementById("FilterObra");
    obraFilter.addEventListener("change", filterDataZona);

    const rowsPerPageSelect = document.getElementById("rows-per-page");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableZona(currentPage);
        setupPaginationZona();
    });
}
//Metodo para limpiar el modal de agregar usuario
function AddlimpiarModalZona() {
    let id = document.querySelector('#AddidInput');
    let zona = document.querySelector('#AddZonaInput');
    let obra = document.querySelector('#AddObraInput');
    let indirecto = document.querySelector('#AddIndirecto');
    let financiamiento = document.querySelector('#AddFinanciamiento');
    let utilidad = document.querySelector('#AddUtilidad');
    let adicionales = document.querySelector('#AddAdicionales');


    zona.value = "";
    obra.value = "";
    indirecto.value = "";
    financiamiento.value = "";
    utilidad.value = "";
    adicionales.value = "";
    id.value = idZonasutomatico();

    zona.placeholder = "";
    zona.placeholder = "";
    indirecto.placeholder = "";
    financiamiento.placeholder = "";
    utilidad.placeholder = "";
    adicionales.placeholder = "";

    zona.classList.remove("inputVacio");
    zona.classList.remove("inputVacio");
    obra.classList.remove("inputVacio");
    indirecto.classList.remove("inputVacio");
    financiamiento.classList.remove("inputVacio");
    utilidad.classList.remove("inputVacio");
    adicionales.classList.remove("inputVacio");

}

//Metodo para cambiar la imagen del toggle a la hora de darle clic para cambiar entre usuarios activos e inactivos
function valStatusZona() {
    var checkbox = document.getElementById('ValCheEsta');
    var imgcheck = document.getElementById('ValEstatus');
    // Deseleccionar el checkbox
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        imgcheck.src = "../img/toggle_on_35px.png"
        estatusZona = 1;
    } else {
        imgcheck.src = "../img/toggle_off_35px.png"
        estatusZona = 0;
    }
    filterDataZona();
}

//Metodo para que se llene el modal de modificar con los datos seleccionados de la fila
//Recibe los datos del usuario seleccionado
function llenarModalModificarZona(idp, zonap, obrap, fechap, indirectop, financiamientop, utilidadp, adicionalesp) { //Llenado de datos en el modal
    let id = document.querySelector('#UpdidInput');
    let zona = document.querySelector('#UpdZonaInput');
    let obra = document.querySelector('#UpdObraInput');
    let indirecto = document.querySelector('#UpdIndirecto');
    let financiamiento = document.querySelector('#UpdFinanciamiento');
    let utilidad = document.querySelector('#UpdUtilidad');
    let adicionales = document.querySelector('#UpdAdicionales');
    let fecha = document.querySelector('#UpdFecha');

    zona.value = zonap;
    indirecto.value = indirectop;
    financiamiento.value = financiamientop;
    utilidad.value = utilidadp;
    adicionales.value = adicionalesp;
    id.value = idp;
    fecha.value = fechap;


    zona.placeholder = "";
    indirecto.placeholder = "";
    financiamiento.placeholder = "";
    utilidad.placeholder = "";
    adicionales.placeholder = "";

    for (var i = 0; i < obra.options.length; i++) {
        if (obra.options[i].value === obrap) {
            obra.options[i].selected = true;
            break;
        }
    }

    zona.classList.remove("inputVacio");
    obra.classList.remove("inputVacio");
    indirecto.classList.remove("inputVacio");
    financiamiento.classList.remove("inputVacio");
    utilidad.classList.remove("inputVacio");
    adicionales.classList.remove("inputVacio");
}


function SacarFecha() {
    let fechaActual = new Date();
    let año = fechaActual.getFullYear();
    let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Mes con dos dígitos
    let dia = fechaActual.getDate().toString().padStart(2, '0'); // Día con dos dígitos

    let fechaFormateada = `${año}-${mes}-${dia}`;
    return fechaFormateada;
}

function idZonasutomatico() {
    // Verifica si data está vacío, y en ese caso inicia en 1
    if (data.length === 0) {
        return "1";
    }

    // Extrae el último número de ID en el arreglo de data
    let maxIdNumber = data.reduce((max, item) => {
        if (item.idzona && !isNaN(item.idzona)) {
            // Convierte idzona a número entero
            const idNumber = parseInt(item.idzona, 10);
            return Math.max(max, idNumber);
        }
        return max;
    }, 0);

    // Incrementa el número más alto encontrado y genera el nuevo id
    const newId = (maxIdNumber + 1).toString();
    return newId;
}



function UpdAgregarPDFZona() {
    let id = document.querySelector('#UpdidInput').value;
    let idAnterior = document.querySelector('#UpdidInput').value; // Obtener el ID anterior
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
                url: './js/guardar_pdfZona.php', // Asegúrate de que la ruta es correcta
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
function AddAgregarPDFZona() {
    let id = document.querySelector('#AddidInput').value;
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
                url: './js/guardar_pdfZona.php',
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

function verPDFZona(idZona) {
    // Construir la ruta del directorio donde se encuentra el archivo PDF
    const pdfDirectory = `../PDFZona/${idZona}/`;

    // Llamar al servidor para obtener la lista de archivos en la carpeta
    fetch(pdfDirectory)
        .then(response => {
            if (response.ok) {
                // Si la carpeta existe, buscar el primer archivo PDF
                return response.text();
            } else {
                mensajePantalla("Zona sin PDF");
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