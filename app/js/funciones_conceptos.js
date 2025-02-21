
let msgEliminarCon = "Concepto deshabilitado";
let msgActivarCon = "Concepto habilitado";
let msgAgregarCon = "Concepto agregado";
let msgModificarCon = "Concepto modificado";
let msgSeleccion = "Selecciona un concepto"

var estatusConcepto = 1;
let conceptoTipoSeleccionado;

let selectedRows = [];
let selectedCheckboxes = {};
let unidades;

let currentSortField = null;
let currentSortOrder = 'asc';
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
        unidad.placeholder = "Requerida la unidad"
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

    checkConcepto("Add");
    if (existe) {
        id.focus();
        return;
    }
    let json = JSON.stringify(datos);
    let url = "../ws/Conceptos/wsAddConcepto.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp)
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
        unidad.placeholder = "Requerido la unidad"
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
    let url = "";
    let msga;
    let pagin;
    datos.id = idEliminar;
    if (ActivarS == 1) {
        datos.estatus = "Inactivo";
        msga = msgEliminarCon
    } else {
        datos.estatus = "Activo";
        msga = msgActivarCon;
    }
    if (conceptoTipoSeleccionado) {
        url = "../ws/Conceptos/wsCambiarStatus.php";
        pagin = 1;
    } else {
        url = "../ws/ConceptosBasicos/wsCambiarStatusBasico.php";
        pagin = 0;
    }

    let json = JSON.stringify(datos);
    console.log(json);
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                mensajePantalla(msga, true)
                PrincipalConcepto(pagin);
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

//Metodo para hacer la consulta de los materiales tomando en cuanta los filtros
function PrincipalConcepto(tipoConcepto) {
    //vaciar el objeto
    selectedRows = [];
    selectedCheckboxes = {};

    estatusConcepto = 1;
    document.getElementById("sort-id").addEventListener("click", () => sortData('idconbasi'));
    document.getElementById("sort-name").addEventListener("click", () => sortData('nombre'));
    // Eventos de clic para los botones
    document.getElementById("sort-id").addEventListener("click", function () {
        toggleSort(this, 'idconbasi');
    });
    document.getElementById("sort-name").addEventListener("click", function () {
        toggleSort(this, 'nombre');
    });
    obtenerDatosConceptos(tipoConcepto);
}

async function obtenerDatosConceptos(btnOpcion) {

    // Selecciona el elemento del spinner
    const spinner = document.querySelector(".sk-circle");

    // Muestra el spinner
    spinner.style.display = "block";

    let btnNormal = document.getElementById("btnConceptoNormal");
    let txtNormal = document.getElementById("textoConceptoNormal");
    let btnBasico = document.getElementById("btnConceptoBasicos");
    let txtBasico = document.getElementById("textoConceptoBasicos");
    let btnExportar = document.getElementById("btnExportar");
    let json = "";
    let url = "";

    if (btnOpcion === 1) {
        url = "../ws/Conceptos/wsGetConcepto.php";
        btnNormal.classList.remove("esconderBoton");
        btnExportar.classList.remove("esconderBoton");
        txtNormal.classList.remove("esconderBoton");
        try {
        } catch (error) {
            console.error("Error en ActualizarTotalesConcepto:", error);
            spinner.style.display = "none"; // Oculta el spinner en caso de error
            return; // Sale de la función si hay un error
        }

    } else {
        url = "../ws/ConceptosBasicos/wsGetConceptoBasico.php";
        btnBasico.classList.remove("esconderBoton");
        txtBasico.classList.remove("esconderBoton");
        try {
            // Espera a que termine `ActualizarTotalesConcepto`
        } catch (error) {
            console.error("Error en ActualizarTotalesConcepto:", error);
            spinner.style.display = "none"; // Oculta el spinner en caso de error
            return; // Sale de la función si hay un error
        }

    }


    // Realiza la solicitud POST y oculta el spinner al finalizar
    $.post(url, json, (responseText, status) => {
        try {
            if (status === "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado === "OK") {
                    conceptoTipoSeleccionado = btnOpcion;
                    llenarUnidadTabla(btnOpcion);
                    data = resp.datos;
                    llenarTablaConcepto();
                    filterDataConcepto();
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


function sortData(field) {
    if (currentSortField === field) {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortField = field;
        currentSortOrder = 'asc';
    }

    filteredData.sort((a, b) => {
        const valA = a[field] !== null && a[field] !== undefined ? a[field] : '';
        const valB = b[field] !== null && b[field] !== undefined ? b[field] : '';

        if (field === 'idconbasi') {
            // Extraer la parte numérica después de 'ba' y convertirla en número
            const numA = parseInt(valA.replace('ba', ''), 10);
            const numB = parseInt(valB.replace('ba', ''), 10);
            return currentSortOrder === 'asc' ? numA - numB : numB - numA;
        } else if (typeof valA === 'number' && typeof valB === 'number') {
            return currentSortOrder === 'asc' ? valA - valB : valB - valA;
        } else {
            return currentSortOrder === 'asc'
                ? valA.toString().localeCompare(valB.toString(), undefined, { sensitivity: 'base' })
                : valB.toString().localeCompare(valA.toString(), undefined, { sensitivity: 'base' });
        }
    });

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
                            ${record.estatus == 1 ? `
                                <i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;" alt="Modificar" data-bs-toggle="modal" data-bs-target="#EditarModal" onclick="llenarModalModificarConcepto('${record.idconcepto}', '${record.nombre}', '${record.unidad}','${record.total}')"></i>
                            ` : ``}
                            ${record.estatus == 1 ? `
                                <i class="coloresIcono fa-solid fa-file-circle-plus" style="cursor: pointer;" alt="Catalogo" onclick="opcion('Tarjeta'); InfoTarjeta('${record.idconcepto}', '${record.nombre}', '${record.unidad}','${record.nombreespe}',0)"></i>
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
                    <td colspan="6" class="Code">Sin resultados</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        }
    } else {
        document.getElementById('columFamilia').style.display = 'none';
        if (paginatedData.length > 0) {
            paginatedData.forEach(record => {
                const row = document.createElement('tr');
                row.classList.add('fila');
                // Establecer el contenido HTML de la fila
                row.innerHTML = `
                    <td class="Code">${record.idconbasi}</td>
                    <td>${record.nombre !== "" ? record.nombre : "---"}</td>
                    <td>${record.unidad !== "" ? record.unidad : "---"}</td>
                    <td class="estatus">
                        <div style="display: flex; justify-content: space-around; align-items: center;">
                            ${record.estatus == 1 ? `
                                <i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;" alt="Modificar" data-bs-toggle="modal" data-bs-target="#EditarModalBasi" onclick="llenarModalModificarConceptoBasico('${record.idconbasi}', '${record.nombre}', '${record.unidad}','${record.total}')"></i>
                            ` : ``}
                            ${record.estatus == 1 ? `
                                <i class="coloresIcono fa-solid fa-file-circle-plus" style="cursor: pointer;" alt="Catalogo" onclick="opcion('Tarjeta'); InfoTarjeta('${record.idconbasi}', '${record.nombre}', '${record.unidad}','---',1)"></i>
                            ` : ``}
                            <i class="coloresIcono fa-solid fa-${record.estatus == 1 ? 'square-check' : 'square'}" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores('${record.idconbasi}', ${record.estatus})"></i>
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

//Se agrega o quita del arreglo los conceptos seleccionados para su exportacion
function toggleRowSelection(idconcepto, nombre, unidad, total, familia, isChecked) {
    if (isChecked) {
        // Agregar la fila seleccionada al array y al objeto
        selectedRows.push({
            idconcepto, nombre, unidad, familia, cantidad: 1, total: total == "null" ? 0 : total,
        });
        selectedCheckboxes[idconcepto] = true;
    } else {
        // Remover la fila del array y del objeto si se desmarca el checkbox
        selectedRows = selectedRows.filter(row => row.idconcepto !== idconcepto);
        delete selectedCheckboxes[idconcepto];
    }
    console.log(selectedRows); // Muestra las filas seleccionadas
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

//Datos para la tarjeta
function InfoTarjeta(id, nombre, unidad, familia, tipoConcp) {
    datosCatalogo = {
        id,
        nombre,
        unidad,
        familia,
        TipoConcepto: tipoConcp
    }

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
    const input = document.getElementById('AddunidadInputConcepto');
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
    console.log(id, nombre, unidad, total)
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
    const input = document.getElementById('UpdunidadInput');
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

function llenarUnidadTabla(btnOpcion) {
    const unidadFilter = document.getElementById("unidad-filterConcepto"); // El select donde agregarás las opciones
    let json = "";
    let url = "";
    console.log(btnOpcion)
    if (btnOpcion) {
        url = "../ws/Conceptos/wsGetUnidades.php";
    } else {
        url = "../ws/ConceptosBasicos/wsGetUnidadesBasico.php";
    }
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    // Limpiar las opciones existentes del select (por si hay alguna previamente)
                    unidadFilter.innerHTML = "";
                    unidades = resp.datos;

                    // Crear una opción predeterminada o vacía
                    const optionDefault = document.createElement("option");
                    optionDefault.value = "";
                    optionDefault.textContent = "Todo";
                    unidadFilter.appendChild(optionDefault);

                    // Ordenar las unidades alfabéticamente, asegurando que se eliminen los espacios innecesarios
                    unidades.sort((a, b) =>
                        a.unidad.trim().localeCompare(b.unidad.trim(), 'es', { sensitivity: 'base' })
                    );

                    // Iterar sobre las unidades obtenidas y añadirlas al select
                    unidades.forEach(unidad => {
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

function mostrarSugerencias(input, inputUnidad) {
    let sugerenciasDiv;
    if (inputUnidad == "AddUnidad") {
        sugerenciasDiv = document.getElementById('Addsugerencias');
    } else if (inputUnidad == "UpdUnidad") {
        sugerenciasDiv = document.getElementById('Updsugerencias');
    } else if (inputUnidad == "AddUnidadBasico") {
        sugerenciasDiv = document.getElementById('AddsugerenciasBasico');
    } else if (inputUnidad == "UpdUnidadBasico") {
        sugerenciasDiv = document.getElementById('UpdsugerenciasBasico');
    }

    sugerenciasDiv.innerHTML = ''; // Limpiar sugerencias previas

    const filtro = input.value.toLowerCase(); // Texto que está escribiendo el usuario
    const sugerenciasFiltradas = filtro === '' ? unidades : unidades.filter(unidad =>
        unidad.unidad.toLowerCase().includes(filtro)
    );

    // Ocultar el cuadro de sugerencias si no hay coincidencias o si la única coincidencia es exactamente igual al texto ingresado
    if (sugerenciasFiltradas.length === 0 || (sugerenciasFiltradas.length === 1 && sugerenciasFiltradas[0].unidad.toLowerCase() === filtro)) {
        sugerenciasDiv.classList.remove('activado'); // Ocultar el cuadro de sugerencias
        return; // Salir de la función si no hay sugerencias o la única sugerencia coincide exactamente
    } else {
        sugerenciasDiv.classList.add('activado'); // Mostrar el cuadro de sugerencias si hay coincidencias
    }

    // Crear los elementos de sugerencia y agregarlos al cuadro
    sugerenciasFiltradas.forEach(unidad => {
        const div = document.createElement('div');
        div.classList.add('sugerencia-item');
        div.textContent = unidad.unidad;
        div.onclick = () => seleccionarSugerencia(unidad.unidad, inputUnidad, sugerenciasDiv);
        sugerenciasDiv.appendChild(div);
    });
}

// Función para ocultar el cuadro de sugerencias al perder el foco
function ocultarSugerencias(inputUnidad) {
    setTimeout(() => {
        let sugerenciasDiv;
        if (inputUnidad == "AddUnidad") {
            sugerenciasDiv = document.getElementById('Addsugerencias');
        } else if (inputUnidad == "UpdUnidad") {
            sugerenciasDiv = document.getElementById('Updsugerencias');
        } else if (inputUnidad == "AddUnidadBasico") {
            sugerenciasDiv = document.getElementById('AddsugerenciasBasico');
        } else if (inputUnidad == "UpdUnidadBasico") {
            sugerenciasDiv = document.getElementById('UpdsugerenciasBasico');
        }
        sugerenciasDiv.classList.remove('activado'); // Ocultar el cuadro de sugerencias
    }, 200);
}

function seleccionarSugerencia(unidad, inputUnidad, sugerenciasDiv) {
    let input;
    if (inputUnidad == "AddUnidad") {
        input = document.getElementById('AddunidadInputConcepto');
    } else if (inputUnidad == "UpdUnidad") {
        input = document.getElementById('UpdunidadInput');
    } else if (inputUnidad == "AddUnidadBasico") {
        input = document.getElementById('AddunidadInputConceptoBasico');
    } else if (inputUnidad == "UpdUnidadBasico") {
        input = document.getElementById('UpdunidadInputConceptoBasico');
    }
    input.value = unidad; // Colocar la unidad seleccionada en el input
    sugerenciasDiv.innerHTML = ''; // Limpiar las sugerencias
    sugerenciasDiv.classList.remove('activado'); // Ocultar el cuadro
}

function ActualizarTotalesConcepto() {
    return new Promise((resolve, reject) => {
        const url = "../ws/Conceptos/wsUpdateTotales.php";
        const json = "";

        $.post(url, json, (responseText, status) => {
            try {
                if (status === "success") {
                    let resp = JSON.parse(responseText);
                    console.log(resp);

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


function ActualizarTotalesConceptoBasico() {
    return new Promise((resolve, reject) => {
        const url = "../ws/ConceptosBasicos/wsUpdateTotales.php";
        const json = "";

        $.post(url, json, (responseText, status) => {
            try {
                if (status === "success") {
                    let resp = JSON.parse(responseText);
                    console.log(resp);

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

/*
*
*
*
*CONCEPTO BASICO
*
*
*
*
*
*
*
*CONCEPTO BASICO
*
*
*
*
*
*
*
*CONCEPTO BASICO
*
*
*
*
*
*
*
*CONCEPTO BASICO
*
*
*
*
*
*
*
*CONCEPTO BASICO
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
        unidad.placeholder = "Requerida la unidad"
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
                console.log(resp)
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

    let id = document.querySelector('#UpdidInputBasico');
    if (id.value == "") {
        id.classList.add("inputVacio");
        id.placeholder = "Requerido el ID"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = id;
        }
    }
    datos.id = id.value;

    let idAnterior = document.querySelector('#UpdidAnteriorBasico');
    datos.idAnterior = idAnterior.value;
    let nombre = document.querySelector('#UpdnombreInputBasico');
    if (nombre.value == "") {
        nombre.classList.add("inputVacio");
        nombre.placeholder = "Requerido el nombre"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = nombre;
        }
    }
    datos.nombre = nombre.value;

    let unidad = document.querySelector('#UpdunidadInputConceptoBasico');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        unidad.placeholder = "Requerido el nombre"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }

    }
    datos.unidad = unidad.value;
    let totalC = document.querySelector('#UpdTotalBasicos');
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
    let url = "../ws/ConceptosBasicos/wsUpdConceptoBasico.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp)
                if (resp.estado == "OK") {
                    UpdateCerrarModal();
                    mensajePantalla(msgModificarCon, true);
                    PrincipalConcepto(0);
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}


//Metodo para limpiar el modal de agregar material
function AddlimpiarModalConceptoBasico() {
    let idC = document.querySelector('#idInputConceptoBasico');
    let nombreC = document.querySelector('#AddnombreInputConceptoBasico');
    let unidadC = document.querySelector('#AddunidadInputConceptoBasico');

    idC.value = idConceptoBasicoAutomatico();
    nombreC.value = "";
    unidadC.value = "";

    nombreC.placeholder = "";
    unidadC.placeholder = "";

    nombreC.classList.remove("inputVacio");
    unidadC.classList.remove("inputVacio");

}


//Metodo para que se llene el modal de modificar con los datos seleccionados de la fila
//Recibe los datos del material
function llenarModalModificarConceptoBasico(id, nombre, unidad, total) {

    //Llenado de datos en el modal
    let idC = document.querySelector('#UpdidInputBasico');
    let nombreC = document.querySelector('#UpdnombreInputBasico');
    let unidadC = document.querySelector('#UpdunidadInputConceptoBasico');
    let idAnterior = document.querySelector('#UpdidAnteriorBasico');
    let totalC = document.querySelector('#UpdTotalBasicos');
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

function idConceptoBasicoAutomatico() {
    if (data.length === 0) {
        return "ba001";
    }
    // Extrae el último número de idconbasi en el arreglo de data
    let maxIdNumber = data.reduce((max, item) => {
        // Obtiene el número después de "ba" y lo convierte en un entero
        const idNumber = parseInt(item.idconbasi.replace("ba", ""), 10);
        return Math.max(max, idNumber);
    }, 0);

    // Incrementa el número más alto encontrado y genera el nuevo id
    const newId = `ba${String(maxIdNumber + 1).padStart(3, '0')}`;

    return newId;
}



async function GeneradorTarjetasConceptoPdf(value) {
    let conceptos = selectedRows;
    const containerCon = document.getElementById('contenedor-cfe');
    if (!containerCon) {
        console.error('Contenedor "contenedor-cfe" no encontrado');
        return;
    }
    if (conceptos.length != 0) {
        costosAdicionales.CIndirecto = 15;
        costosAdicionales.Financiamiento = 1;
        costosAdicionales.utilidad = 10;
        costosAdicionales.CAdicionales = 0.5;


        containerCon.innerHTML = '';
        contador = 0;
        for (const concepto of conceptos) {
            contador++;
            console.log(concepto);
            let conceptoHTML = `
        
            <div id="concepto-${concepto.idconcepto}" class="tarjeta-concepto">
                <div class="contTabla-materialesmodal_catalogo">
                    <div>
                        <table style="width: 100rem">
                            <thead>
                                <tr class="todosBordes">
                                    <th class="textIzq" style="width: 9rem;  text-align: justify;  ">No. Concepto</th>
                                    <td class="textDer" style="width:4rem; border: 1px solid #000;">${String(contador).padStart(3, '0')}</td>
                                    <td class="textCen" style="border: 1px solid #000;">Análisis de los precios unitarios de los conceptos de trabajo</td>
                                </tr>
                            </thead>
                        </table>
                        <table style="width: 100rem">
                            <thead>
                                <tr class="todosBordes">
                                    <th class="textCen" style="width: 9rem;">ID</th>
                                    <th class="textCen">Concepto</th>
                                    <th class="textCen" style="width: 10rem;">Unidad</th>
                                    <th class="textCen" style="width: 8rem; display: table-cell;">Familia</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="todosBordes"> 
                                    <td class="textIzq">${concepto.idconcepto}</td>
                                    <td class="textJus" style="text-align: justify; height: fit-content;">${concepto.nombre}</td>
                                    <td class="textIzq">${concepto.unidad}</td>
                                    <td class="textIzq">${concepto.familia}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="titulo-conceptoPDF">
                    <div class="pSeccion-catalogo">
                        <div>Materiales</div>
                    </div>
                </div>
                <div id="materialesPDF-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>
                <div class="titulo-conceptoPDF">
                    <div class="pSeccion-catalogo">
                        <div>Mano de obra</div>
                    </div>
                </div>
                <div id="manoObraPDF-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>
                <div class="titulo-conceptoPDF">
                    <div class="pSeccion-catalogo">
                        <div>Herramienta y equipo de seguridad</div>
                    </div>
                </div>
                <div id="herramientaEquipoPDF-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>
                <div class="titulo-conceptoPDF">
                    <div class="pSeccion-catalogo">
                        <div>Maquinaria</div>
                    </div>
                </div>
                <div id="maquinariaPDF-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>
                <div class="titulo-conceptoPDF">
                    <div class="pSeccion-catalogo">
                        <div>Basico</div>
                    </div>
                </div>
                <div id="basicoPDF-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>
                      <div class="contTabla-materialesmodal_catalogo">
                    <div>
                        <table class="todosBordesCuadro">
                                 <tr> 
                                    <td></td>
                                    <td></td>
                                    <td class="terceraColumna"></td>
                                    <td></td>
                                </tr>
                                <tr> 
                                    <td class="primeraColumna negritas">(CD) COSTO DIRECTO</td>
                                    <td style="width: 18rem;"></td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td id="CostoDirectoPDF-${concepto.idconcepto}"  class="textDer ultimaColumna negritas" style="width: 10rem;">3454</td>
                                </tr>
                                <tr> 
                                    <td  class="primeraColumna">(CI) COSTO INDIRECTOS</td>
                                    <td style="width: 15rem;">${costosAdicionales.CIndirecto}.00%</td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td id="costoIndirectoPDF-${concepto.idconcepto}" class="textDer style="width: 10rem;">45454</td>
                                </tr>
                                  <tr> 
                                    <td class="primeraColumna">SUBTOTALE1</td>
                                    <td style="width: 15rem;"></td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td id="subTotal1PDF-${concepto.idconcepto}"  class="textDer ultimaColumna" style="width: 10rem;">4545</td>
                                </tr>
                                  <tr> 
                                    <td   class="primeraColumna">(CF) FINANCIAMIENTO</td>
                                    <td style="width: 15rem;">${costosAdicionales.Financiamiento}.00%</td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td id="financiamientoPDF-${concepto.idconcepto}" class="textDer" style="width: 10rem;">4545</td>
                                </tr>
                                  <tr> 
                                    <td class="primeraColumna">SUBTOTAL2</td>
                                    <td style="width: 15rem;"></td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td id="subTotal2PDF-${concepto.idconcepto}"  class="textDer ultimaColumna" style="width: 10rem;">34534</td>
                                </tr>
                                  <tr> 
                                    <td class="primeraColumna">(CU) UTILIDAD</td>
                                    <td style="width: 15rem;">${costosAdicionales.utilidad}.00%</td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td id="utilidadPDF-${concepto.idconcepto}" class="textDer" style="width: 10rem;">3453</td>
                                </tr>
                                  <tr> 
                                    <td  class="primeraColumna">SUBTOTAL3</td>
                                    <td style="width: 15rem;"></td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td id="subTotal3PDF-${concepto.idconcepto}" class="textDer ultimaColumna" style="width: 10rem;">345345</td>
                                </tr>
                                  <tr> 
                                    <td class="primeraColumna">CARGOS ADICIONALES</td>
                                    <td style="width: 15rem;">${costosAdicionales.CAdicionales}0%</td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                     <td id="cargosAdicionalesPDF-${concepto.idconcepto}"  class="textDer" style="width: 10rem;">3453</td>
                                </tr>
                                  <tr> 
                                    <td class="primeraColumna negritas">PRECIO UNITARIO (CD+CIO+CIC+CF+CU+CA)</td>
                                    <td style="width: 15rem;"></td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td id="precioUnitarioPDF-${concepto.idconcepto}" class="textDer ultimaColumna negritas" style="width: 10rem;"></td>
                                </tr>
                                  <tr> 
                                    <td id="LecturaPrecioUnitarioPDF-${concepto.idconcepto}" class="primeraColumna negritas"></td>
                                    <td style="width: 15rem;"></td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td class="textDer" style="width: 10rem;"></td>
                                </tr>
                                  <tr> 
                                    <td></td>
                                    <td></td>
                                    <td class="terceraColumna"></td>
                                    <td></td>
                                </tr>

                        </table>
                    </div>
                </div>
            </div>
        `;
            containerCon.innerHTML += conceptoHTML;
            await TraerMaterialesConceptoPDF(concepto.idconcepto);
            await TraerManoObrasConceptoPDF(concepto.idconcepto);
            await TraerMaquinariaConceptoPDF(concepto.idconcepto);
            await TraerBasicoConceptoPDF(concepto.idconcepto);
        }
        if (value) {
            exportarPDFConHtml(true);
        }

    } else {
        mensajePantalla("No hay conceptos seleccionados", false);
    }

}