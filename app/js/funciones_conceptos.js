
let msgEliminarCon = "Concepto deshabilitado";
let msgActivarCon = "Concepto habilitdo";
let msgAgregarCon = "Concepto agregado";
let msgModificarCon = "Concepto modificado";
let msgSeleccion = "Selecciona un concepto"

var estatusConcepto = 1;
let conceptoTipoSeleccionado;

let selectedRows = [];

let unidades;
//Metodo que valida el formulario para agregar materiales y al mismo tiempo agrega el material
function AddConceptoValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let id = document.querySelector('#AddidInputConcepto');
    if (id.value == "") {
        id.classList.add("inputVacio");
        id.placeholder = "Requerido el ID"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = id;
        }
    }
    datos.id = id.value;
    let nombre = document.querySelector('#AddnombreInputConcepto');
    if (nombre.value == "") {
        nombre.classList.add("inputVacio");
        nombre.placeholder = "Requerido el nombre"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = nombre;
        }

    }
    datos.nombre = nombre.value;
    let unidad = document.querySelector('#AddunidadInputConcepto');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        nombre.placeholder = "Requerida la unidad"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }

    }
    datos.unidad = unidad.value;
    datos.total = null;
    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }
    let json = JSON.stringify(datos);
    checkConcepto("Add");
    if (existe) {
        id.focus();
        return;
    }
    let url = "../ws/Conceptos/wsAddConcepto.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    AddCerrarModal();
                    PrincipalConcepto(1);
                    mensajePantalla(msgAgregarCon, true);

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
function UpdConceptoValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};

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

    let idAnterior = document.querySelector('#UpdidAnterior');
    datos.idAnterior = idAnterior.value;
    let nombre = document.querySelector('#UpdnombreInput');
    if (nombre.value == "") {
        nombre.classList.add("inputVacio");
        nombre.placeholder = "Requerido el nombre"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = nombre;
        }
    }
    datos.nombre = nombre.value;

    let unidad = document.querySelector('#UpdunidadInput');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }

    }
    datos.unidad = unidad.value;
    let totalC = document.querySelector('#UpdTotal');
    datos.total = totalC.value == 'null' ? null : totalC.value;
    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }

    if (existe) {
        id.focus();
        return;
    }
    console.log(datos)
    let json = JSON.stringify(datos);
    let url = "../ws/Conceptos/wsUpdConcepto.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp)
                if (resp.estado == "OK") {
                    UpdateCerrarModal();
                    mensajePantalla(msgModificarCon, true);
                    PrincipalConcepto(1);
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function checkConcepto(modal) {
    const datos = {}
    if (modal == "Add") {
        var idVali = document.querySelector('#AddidInputConcepto');
    } else {
        var idVali = document.querySelector('#UpdidInput');
        let idAnterior = document.querySelector('#UpdidAnterior');
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

    let url = "../ws/Conceptos/wscheckConcepto.php";
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
function CambioEstatusConcepto() {
    const datos = {};
    datos.id = idEliminar;
    if (ActivarS == 1) {
        datos.estatus = "Inactivo";
    } else {
        datos.estatus = "Activo";
    }
    let json = JSON.stringify(datos);
    console.log(json);
    switch (parseInt(ActivarS)) {
        case 0: {
            let url = "../ws/Conceptos/wsCambiarStatus.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        mensajePantalla(msgActivarCon, true)
                        paginaActual = 1;
                        PrincipalConcepto(1);
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
            let url = "../ws/Conceptos/wsCambiarStatus.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        PrincipalConcepto(1);
                        paginaActual = 1;
                        mensajePantalla(msgEliminarCon, true)
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
function PrincipalConcepto(tipoConcepto) {
    document.getElementById("sort-id").addEventListener("click", () => sortData('idconcepto'));
    document.getElementById("sort-name").addEventListener("click", () => sortData('nombre'));
    // Eventos de clic para los botones
    document.getElementById("sort-id").addEventListener("click", function () {
        toggleSort(this, 'idconcepto');
    });
    document.getElementById("sort-name").addEventListener("click", function () {
        toggleSort(this, 'nombre');
    });
    obtenerDatosConceptos(tipoConcepto);
}

function obtenerDatosConceptos(btnOpcion) {
    let btnNormal = document.getElementById("btnConceptoNormal");
    let btnBasico = document.getElementById("btnConceptoBasicos");
    let json = "";
    let url = "";
    if (btnOpcion == 1) {
        url = "../ws/Conceptos/wsGetConcepto.php";
        btnNormal.classList.remove("esconderBoton")
    } else {
        url = "../ws/ConceptosBasicos/wsGetConceptoBasico.php";
        btnBasico.classList.remove("esconderBoton")
    }
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    llenarUnidadTabla();
                    data = resp.datos;
                    llenarTablaConcepto();
                    filterDataConcepto();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
    conceptoTipoSeleccionado = btnOpcion;
}


function sortData(field) {
    if (currentSortField === field) {
        // Si el campo de ordenación actual ya está seleccionado, alterna el orden
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        // Si es un nuevo campo de ordenación, resetea la dirección a ascendente
        currentSortField = field;
        currentSortOrder = 'asc';
    }

    filteredData.sort((a, b) => {
        // Manejo de valores nulos o vacíos para que no causen problemas
        const valA = a[field] !== null && a[field] !== undefined ? a[field] : '';
        const valB = b[field] !== null && b[field] !== undefined ? b[field] : '';

        // Si el valor es numérico, lo comparamos como números, de lo contrario como strings
        if (typeof valA === 'number' && typeof valB === 'number') {
            return currentSortOrder === 'asc' ? valA - valB : valB - valA;
        } else {
            // Si son cadenas de texto, las comparamos en forma case-insensitive
            return currentSortOrder === 'asc'
                ? valA.toString().localeCompare(valB.toString(), undefined, { sensitivity: 'base' })
                : valB.toString().localeCompare(valA.toString(), undefined, { sensitivity: 'base' });
        }
    });

    // Reinicia la página a la primera después de ordenar
    currentPage = 1;
    displayTableConcepto(currentPage);
    setupPaginationConcepto();
}
function toggleSort(button, field) {
    // Desactiva los otros botones de ordenación
    document.querySelectorAll('.sort-button').forEach(btn => btn.classList.remove('active'));

    // Alterna la dirección del orden
    if (currentSortField === field) {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortField = field;
        currentSortOrder = 'asc'; // Por defecto, cuando selecciona un nuevo campo
    }

    // Actualiza el icono visual según la dirección
    if (currentSortOrder === 'asc') {
        button.querySelector('i').classList.remove('fa-arrow-down-wide-short');
        button.querySelector('i').classList.add('fa-arrow-up-wide-short');
    } else {
        button.querySelector('i').classList.remove('fa-arrow-up-wide-short');
        button.querySelector('i').classList.add('fa-arrow-down-wide-short');
    }

    // Añade la clase active al botón actual
    button.classList.add('active');

    // Llama a la función de ordenación
    sortData(field);
}

function displayTableConcepto(page) {
    const tableBody = document.getElementById("table-bodyConceptos");
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredData.slice(start, end);
    if (conceptoTipoSeleccionado) {
        if (paginatedData.length > 0) {
            paginatedData.forEach(record => {
                // Crear un elemento de fila (tr)
                const row = document.createElement('tr');
                row.classList.add('fila');
                // Establecer el contenido HTML de la fila
                row.innerHTML = `
                    <td class="Code">${record.idconcepto}</td>
                    <td>${record.nombre !== "" ? record.nombre : "---"}</td>
                    <td>${record.unidad !== "" ? record.unidad : "---"}</td>
                    <td>${record.total !== "" && record.total != null ? record.total : "---"}</td>
                    <td class="estatus">
                        <div style="display: flex; justify-content: space-around; align-items: center;">
                            ${record.estatus == 1 ? `
                                <input type="checkbox" class="custom-checkbox" id="checkbox_${record.idconcepto}" onchange="toggleRowSelection('${record.idconcepto}', '${record.nombre}', '${record.unidad}', '${record.total}', this.checked)">
                                <label for="checkbox_${record.idconcepto}" class="checkbox-design"></label>
                            ` : ``}
                            ${record.estatus == 1 ? `
                                <i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;" alt="Modificar" data-bs-toggle="modal" data-bs-target="#EditarModal" onclick="llenarModalModificarConcepto('${record.idconcepto}', '${record.nombre}', '${record.unidad}','${record.total}')"></i>
                            ` : ``}
                            ${record.estatus == 1 ? `
                                <i class="coloresIcono fa-solid fa-file-circle-plus" style="cursor: pointer;" alt="Catalogo" onclick="opcion('Catalogo'); InfoCatalogo('${record.idconcepto}', '${record.nombre}', '${record.unidad}')"></i>
                            ` : ``}
                            <i class="coloresIcono fa-solid fa-${record.estatus == 1 ? 'square-check' : 'square'}" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores('${record.idconcepto}', ${record.estatus})"></i>
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
                    <td colspan="5" class="Code">Sin resultados</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        }


    } else {
        if (paginatedData.length > 0) {
            paginatedData.forEach(record => {
                // Crear un elemento de fila (tr)
                const row = document.createElement('tr');
                row.classList.add('fila');
                // Establecer el contenido HTML de la fila
                row.innerHTML = `
                    <td class="Code">${record.idconbasi}</td>
                    <td>${record.nombre !== "" ? record.nombre : "---"}</td>
                    <td>${record.unidad !== "" ? record.unidad : "---"}</td>
                    <td>${record.total !== "" && record.total != null ? record.total : "---"}</td>
                    <td class="estatus">
                        <div style="display: flex; justify-content: space-around; align-items: center;">
                            ${record.estatus == 1 ? `
                                <i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;" alt="Modificar" data-bs-toggle="modal" data-bs-target="#EditarModal" onclick="llenarModalModificarConcepto(${record.idconcepto}, '${record.nombre}', '${record.unidad}')"></i>
                            ` : ``}
                            ${record.estatus == 1 ? `
                                <i class="coloresIcono fa-solid fa-file-circle-plus" style="cursor: pointer;" alt="Catalogo" onclick="opcion('Catalogo'); InfoCatalogo(${record.idconcepto}, '${record.nombre}', '${record.unidad}')"></i>
                            ` : ``}
                            <i class="coloresIcono fa-solid fa-${record.estatus == 1 ? 'square-check' : 'square'}" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${record.idconcepto}, ${record.estatus})"></i>
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
}

function toggleRowSelection(idconcepto, nombre, unidad, total, isChecked) {
    if (isChecked) {
        // Agregar la fila seleccionada al array
        selectedRows.push({
            idconcepto, nombre, unidad, total: total == "null" ? 0 : total
        });
    } else {
        // Remover la fila del array si se desmarca el checkbox
        selectedRows = selectedRows.filter(row => row.idconcepto !== idconcepto);
    }
    console.log(selectedRows); // Muestra las filas seleccionadas
}
//Datos para el catalogo
function InfoCatalogo(id, nombre, unidad) {
    listaMateriales = [];
    datosCatalogo = {
        id,
        nombre,
        unidad
    }

}
function setupPaginationConcepto() {
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
                displayTableConcepto(currentPage);
                setupPaginationConcepto();
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
                displayTableConcepto(currentPage);
                setupPaginationConcepto();
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
                displayTableConcepto(currentPage);
                setupPaginationConcepto();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

function filterDataConcepto() {
    const searchText = document.getElementById("search-inputConcepto").value.toLowerCase();
    const unidadFilter = document.getElementById("unidad-filterConcepto").value;

    const statusFilter = estatusConcepto;
    filteredData = data.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value != null && value.toString().toLowerCase().includes(searchText)
        );
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesUnidad && matchesStatus;
    });

    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableConcepto(currentPage);
    setupPaginationConcepto();
}

function llenarTablaConcepto() {
    displayTableConcepto(currentPage);
    setupPaginationConcepto();
    const searchInput = document.getElementById("search-inputConcepto");
    searchInput.addEventListener("input", filterDataConcepto);

    const unidadFilter = document.getElementById("unidad-filterConcepto");
    unidadFilter.addEventListener("change", filterDataConcepto);

    const rowsPerPageSelect = document.getElementById("rows-per-page");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableConcepto(currentPage);
        setupPaginationConcepto();
    });
}


//Metodo para limpiar el modal de agregar material
function AddlimpiarModalConcepto() {
    let idC = document.querySelector('#AddidInputConcepto');
    let nombreC = document.querySelector('#AddnombreInputConcepto');
    let unidadC = document.querySelector('#AddunidadInputConcepto');


    idC.value = "";
    nombreC.value = "";
    unidadC.value = "";

    nombreC.placeholder = "";
    idC.placeholder = "";
    unidadC.placeholder = "";

    idC.classList.remove("inputVacio");
    nombreC.classList.remove("inputVacio");
    unidadC.classList.remove("inputVacio");
}

//Metodo para cambiar la imagen del toggle a la hora de darle clic para cambiar entre materiales activos e inactivos
function valStatusConcepto() {
    var checkbox = document.getElementById('ValCheEsta');
    var imgcheck = document.getElementById('ValEstatus');
    // Deseleccionar el checkbox
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        imgcheck.src = "../img/toggle_on_35px.png"
        estatusConcepto = 1;
    } else {
        imgcheck.src = "../img/toggle_off_35px.png"
        estatusConcepto = 0;
    }
    filterDataConcepto();
}

//Metodo para que se llene el modal de modificar con los datos seleccionados de la fila
//Recibe los datos del material
function llenarModalModificarConcepto(id, nombre, unidad, total) {

    //Llenado de datos en el modal
    let idC = document.querySelector('#UpdidInput');
    let nombreC = document.querySelector('#UpdnombreInput');
    let unidadC = document.querySelector('#UpdunidadInput');
    let idAnterior = document.querySelector('#UpdidAnterior');
    let totalC = document.querySelector('#UpdTotal');
    idAnterior.value = id;
    idC.value = id;
    nombreC.value = nombre;
    unidadC.value = unidad;
    totalC.value = total;

    nombreC.placeholder = "";
    unidadC.placeholder = "";
    idC.placeholder = "";

    idC.classList.remove("inputVacio");
    nombreC.classList.remove("inputVacio");
    unidadC.classList.remove("inputVacio");
}

function llenarUnidadTabla() {
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
                    unidades = resp.datos
                    // Crear una opción predeterminada o vacía
                    const optionDefault = document.createElement("option");
                    optionDefault.value = "";
                    optionDefault.textContent = "Todo";
                    unidadFilter.appendChild(optionDefault);

                    // Iterar sobre las unidades obtenidas
                    resp.datos.forEach(unidad => {
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

//Metodo para abrir el modal dependiendo si se abre para activar o eliminar
function AbrirModalConfirm1() {
    let estatus = document.getElementById('ValCheEsta').checked;
    if (estatus) {
        $('#confirmDeleteModal').modal('show');
    } else {
        $('#confirmActivationModal').modal('show');
    }
}

function Exportar() {

    if (selectedRows.length == 0) {
        mensajePantalla(msgSeleccion, false)
        return;
    }
    const fechaActual = new Date();
    // Obtener el día, mes y año
    const dia = fechaActual.getDate();        // Día del mes (1-31)
    const mes = fechaActual.getMonth() + 1;
    const ano = fechaActual.getFullYear();    // Mes (0-11, por lo que le sumamos 1)
    const ws = XLSX.utils.json_to_sheet(selectedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hoja1");
    XLSX.writeFile(wb, `Conceptos Seleccionados ${dia}-${mes}-${ano}.xlsx`);
};

function mostrarSugerencias(input, inputUnidad) {
    let sugerenciasDiv;
    if (inputUnidad == "AddUnidad") {
        sugerenciasDiv = document.getElementById('Addsugerencias');
    } else if (inputUnidad == "UpdUnidad") {
        sugerenciasDiv = document.getElementById('Updsugerencias');
    }
    sugerenciasDiv.innerHTML = ''; // Limpiar sugerencias previas

    const filtro = input.value.toLowerCase(); // Texto que está escribiendo el usuario
    if (filtro === '') {
        sugerenciasDiv.classList.remove('active'); // Ocultar cuando no hay nada
        return;
    }

    const sugerenciasFiltradas = unidades.filter(unidad =>
        unidad.unidad.toLowerCase().includes(filtro)
    );

    if (sugerenciasFiltradas.length > 0) {
        sugerenciasDiv.classList.add('activado'); // Mostrar las sugerencias
    } else {
        sugerenciasDiv.classList.remove('activado'); // Ocultar si no hay sugerencias
    }

    sugerenciasFiltradas.forEach(unidad => {
        const div = document.createElement('div');
        div.classList.add('sugerencia-item');
        div.textContent = unidad.unidad;
        div.onclick = () => seleccionarSugerencia(unidad.unidad, inputUnidad, sugerenciasDiv);
        sugerenciasDiv.appendChild(div);
    });
}

function seleccionarSugerencia(unidad, inputUnidad, sugerenciasDiv) {
    let input;
    if (inputUnidad == "AddUnidad") {
        input = document.getElementById('AddunidadInputConcepto');
    } else if (inputUnidad == "UpdUnidad") {
        input = document.getElementById('UpdunidadInput');
    }

    input.value = unidad; // Colocar la unidad seleccionada en el input
    sugerenciasDiv.innerHTML = ''; // Limpiar las sugerencias
    sugerenciasDiv.classList.remove('activado'); // Ocultar el cuadro
}

/*
*
*
*
*
*
*
*
*
*/

function AddConceptoBasicoValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let id = document.querySelector('#idInputConceptoBasico');
    console.log(id)
    if (id.value == "") {
        id.classList.add("inputVacio");
        id.placeholder = "Requerido el ID"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = id;
        }
    }
    datos.id = id.value;
    let nombre = document.querySelector('#AddnombreInputConceptoBasico');
    if (nombre.value == "") {
        nombre.classList.add("inputVacio");
        nombre.placeholder = "Requerido el nombre"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = nombre;
        }

    }
    datos.nombre = nombre.value;
    let unidad = document.querySelector('#AddunidadInputConceptoBasico');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        nombre.placeholder = "Requerida la unidad"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }

    }
    datos.unidad = unidad.value;
    datos.total = null;
    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }

    if (existe) {
        id.focus();
        return;
    }
    console.log(datos)
    let json = JSON.stringify(datos);
    let url = "../ws/ConceptosBasicos/wsAddConceptoBasico.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    AddCerrarModal();
                    PrincipalConcepto(0);
                    mensajePantalla(msgAgregarCon, true);
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
function UpdConceptoBasicoValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};

    let id = document.querySelector('#idInputConceptoBasico');
    if (id.value == "") {
        id.classList.add("inputVacio");
        id.placeholder = "Requerido el ID"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = id;
        }
    }
    datos.id = id.value;

    let idAnterior = document.querySelector('#UpdidAnterior');
    datos.idAnterior = idAnterior.value;
    let nombre = document.querySelector('#UpdnombreInput');
    if (nombre.value == "") {
        nombre.classList.add("inputVacio");
        nombre.placeholder = "Requerido el nombre"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = nombre;
        }
    }
    datos.nombre = nombre.value;

    let unidad = document.querySelector('#UpdunidadInput');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }

    }
    datos.unidad = unidad.value;
    let totalC = document.querySelector('#UpdTotal');
    datos.total = totalC.value == 'null' ? null : totalC.value;
    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }

    if (existe) {
        id.focus();
        return;
    }
    console.log(datos)
    let json = JSON.stringify(datos);
    let url = "../ws/Conceptos/wsUpdConcepto.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp)
                if (resp.estado == "OK") {
                    UpdateCerrarModal();
                    mensajePantalla(msgModificarCon, true);
                    PrincipalConcepto(1);
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}