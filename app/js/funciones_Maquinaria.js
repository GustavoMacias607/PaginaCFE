let msgEliminarMaqui = "Maquinaria deshabilitada";
let msgActivarMaqui = "Maquinaria habilitada";
let msgAgregarMaqui = "Maquinaria agregada";
let msgModificarMaqui = "Maquinaria modificada";

var estatusMaquinaria = 1;
data = []

//Metodo que valida el formulario para agregar materiales y al mismo tiempo agrega el material
function AddMaquinariaValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};

    let id = document.querySelector('#AddidInputMaquinaria');
    if (id.value == "") {
        id.classList.add("inputVacio");
        id.placeholder = "Requerido el ID"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = id;
        }
    }
    datos.id = id.value;
    let descripcion = document.querySelector('#AdddescripcionInputMaquinaria');
    if (descripcion.value == "") {
        descripcion.classList.add("inputVacio");
        descripcion.placeholder = "Requerida la descripcion"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = descripcion;
        }
    }
    datos.descripcion = descripcion.value;

    let unidad = document.querySelector('#AddUnidadInputMaquinaria');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }
    }
    datos.unidad = unidad.value;

    let phm = document.querySelector('#AddphmInputMaquinaria');
    if (phm.value == "") {
        phm.classList.add("inputVacio");
        phm.placeholder = "Requerido el phm"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = phm;
        }
    }
    datos.phm = phm.value;

    let fecha = document.querySelector('#AddfechaPrecioInput');
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

    //checkMaquinaria("Add");
    if (existe) {
        id.focus();
        return;
    }
    let json = JSON.stringify(datos);
    console.log(json);
    let url = "../ws/Maquinaria/wsAddMaquinaria.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    AddCerrarModal();
                    GetMaquinaria();
                    mensajePantalla(msgAgregarMaqui, true);

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
function UpdMaquinariaValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let idAnterior = document.querySelector('#UpdidAnteriorMaqui');
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
    let descripcion = document.querySelector('#UpddescripcionInput');
    if (descripcion.value == "") {
        descripcion.classList.add("inputVacio");
        descripcion.placeholder = "Requerida la descripcion"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = descripcion;
        }
    }
    datos.descripcion = descripcion.value;

    let unidad = document.querySelector('#UpdUnidadInputMaquinaria');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }
    }
    datos.unidad = unidad.value;

    let phm = document.querySelector('#UpdphmInput');
    if (phm.value == "") {
        phm.classList.add("inputVacio");
        phm.placeholder = "Requerido el phm"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = phm;
        }
    }
    datos.phm = phm.value;

    let fecha = document.querySelector('#UpdfechaPrecioInput');
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
    //checkMaquinaria("Upd");
    if (existe) {
        id.focus();
        return;
    }
    let json = JSON.stringify(datos);
    console.log(json);
    let url = "../ws/Maquinaria/wsUpdMaquinaria.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp);
                if (resp.estado == "OK") {
                    UpdateCerrarModal();
                    mensajePantalla(msgModificarMaqui, true);
                    GetMaquinaria();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function checkMaquinaria(modal) {
    const datos = {}
    if (modal == "Add") {
        var idVali = document.querySelector('#AddidInputMaquinaria');
    } else {
        var idVali = document.querySelector('#UpdidInput');
        let idAnterior = document.querySelector('#UpdidAnteriorMaqui');
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

    let url = "../ws/Maquinaria/wscheckMaquinaria.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {

                let resp = JSON.parse(responseText);
                console.log(resp)
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
function CambioEstatusMaquinaria() {
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
            let url = "../ws/Maquinaria/wsCambiarStatus.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        mensajePantalla(msgActivarMaqui, true)
                        paginaActual = 1;
                        GetMaquinaria();
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
            let url = "../ws/Maquinaria/wsCambiarStatus.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        GetMaquinaria();
                        paginaActual = 1;
                        mensajePantalla(msgEliminarMaqui, true)
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
function GetMaquinaria() {
    let json = "";
    let url = "../ws/Maquinaria/wsGetMaquinaria.php";
    $.post(url, json, (responseText, status) => {
        try {

            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    data = resp.datos;
                    llenarTablaMaquinaria();
                    filterDataMaquinaria();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}

function displayTableMaquinaria(page) {
    const tableBody = document.getElementById("table-bodyMaquinaria");
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
                <td class="Code">${record.idmaquinaria}</td>
                <td>${(!record.descripcion == "") ? record.descripcion : "---"}</td>
                <td>${(!record.unidad == "") ? record.unidad : "---"}</td>
                <td>${(!record.phm == "") ? record.phm : "---"}</td>
                <td>${(!record.fechaprecio == "") ? record.fechaprecio : "---"}</td>
                <td class="estatus">
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        ${record.estatus == 1 ? `
                            <i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;" alt="Modificar" data-bs-toggle="modal" data-bs-target="#EditarModal" onclick="llenarModalModificarMaquinaria('${record.idmaquinaria}','${record.descripcion}','${record.unidad}',${record.phm},'${record.fechaprecio}')"></i>
                        ` : ``}
                        ${record.estatus == 1 ?
                    `<i class="coloresIcono fa-solid fa-square-check" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores('${record.idmaquinaria}',${record.estatus})"></i>` :
                    `<i class="coloresIcono fa-solid fa-square" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores('${record.idmaquinaria}',${record.estatus})"></i>`
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

function setupPaginationMaquinaria() {
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
                displayTableMaquinaria(currentPage);
                setupPaginationMaquinaria();
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
                displayTableMaquinaria(currentPage);
                setupPaginationMaquinaria();
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
                displayTableMaquinaria(currentPage);
                setupPaginationMaquinaria();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

function filterDataMaquinaria() {
    const searchText = document.getElementById("search-inputMaqui").value.toLowerCase();
    const unidadFilter = document.getElementById("unidad-filterMaqui").value;
    const statusFilter = estatusMaquinaria;

    filteredData = data.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value != null && value.toString().toLowerCase().includes(searchText)
        );
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesUnidad && matchesStatus;
    });

    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableMaquinaria(currentPage);
    setupPaginationMaquinaria();
}

function llenarTablaMaquinaria() {
    displayTableMaquinaria(currentPage);
    setupPaginationMaquinaria();
    const searchInput = document.getElementById("search-inputMaqui");
    searchInput.addEventListener("input", filterDataMaquinaria);

    const unidadFilter = document.getElementById("unidad-filterMaqui");
    unidadFilter.addEventListener("change", filterDataMaquinaria);

    const rowsPerPageSelect = document.getElementById("rows-per-page");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableMaquinaria(currentPage);
        setupPaginationMaquinaria();
    });
}


//Metodo para limpiar el modal de agregar mano de obra
function AddlimpiarModalMaquinaria() {
    let idMa = document.querySelector('#AddidInputMaquinaria');
    let descripcionMa = document.querySelector('#AdddescripcionInputMaquinaria');
    let UnidadMa = document.querySelector('#AddUnidadInputMaquinaria');
    let phm = document.querySelector('#AddphmInputMaquinaria');
    let rhm = document.querySelector('#AddrhmInputMaquinaria');
    let fechaActual = new Date();
    let año = fechaActual.getFullYear();
    let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    let dia = fechaActual.getDate().toString().padStart(2, '0');
    let fechaFormateada = `${año}-${mes}-${dia}`;
    document.querySelector('#AddfechaPrecioInput').value = fechaFormateada;


    idMa.value = "";
    descripcionMa.value = "";
    UnidadMa.value = "";
    phm.value = "";
    rhm.value = "";

    idMa.placeholder = "";
    descripcionMa.placeholder = "";
    rhm.placeholder = "";
    phm.placeholder = "";

    idMa.classList.remove("inputVacio");
    descripcionMa.classList.remove("inputVacio");
    UnidadMa.classList.remove("inputVacio");
    phm.classList.remove("inputVacio");
    rhm.classList.remove("inputVacio");
}

//Metodo para cambiar la imagen del toggle a la hora de darle clic para cambiar entre materiales activos e inactivos
function valStatusMaquinaria() {
    var checkbox = document.getElementById('ValCheEsta');
    var imgcheck = document.getElementById('ValEstatus');
    // Deseleccionar el checkbox
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        imgcheck.src = "../img/toggle_on_35px.png"
        estatusMaquinaria = 1;
    } else {
        imgcheck.src = "../img/toggle_off_35px.png"
        estatusMaquinaria = 0
    }
    filterDataMaquinaria();
}

//Metodo para que se llene el modal de modificar con los datos seleccionados de la fila
//Recibe los datos del material
function llenarModalModificarMaquinaria(id, descripcion, unidad, phM, fechaPrecio) {

    //Llenado de datos en el modal
    let idMa = document.querySelector('#UpdidInput');
    let descripcionMa = document.querySelector('#UpddescripcionInput');
    let UnidadMa = document.querySelector('#UpdUnidadInputMaquinaria');
    let phm = document.querySelector('#UpdphmInput');
    let idAnterior = document.querySelector('#UpdidAnteriorMaqui');

    idAnterior.value = id;
    idMa.value = id;
    descripcionMa.value = descripcion;
    phm.value = phM;

    if (fechaPrecio != "0000-00-00" && fechaPrecio != null) {
        document.querySelector('#UpdfechaPrecioInput').value = FormateoFecha(fechaPrecio);
    } else {
        let fechaActual = new Date();
        let año = fechaActual.getFullYear();
        let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses en JavaScript van de 0 a 11
        let dia = fechaActual.getDate().toString().padStart(2, '0');
        let fechaFormateada = `${año}-${mes}-${dia}`;
        document.querySelector('#UpdfechaPrecioInput').value = fechaFormateada;
    }
    //llenar el select de unidad
    for (var i = 0; i < UnidadMa.options.length; i++) {
        if (UnidadMa.options[i].value === unidad) {
            UnidadMa.options[i].selected = true;
            break;
        }
    }


    idMa.placeholder = "";
    descripcionMa.placeholder = "";
    phm.placeholder = "";


    idMa.classList.remove("inputVacio");
    descripcionMa.classList.remove("inputVacio");
    UnidadMa.classList.remove("inputVacio");
    phm.classList.remove("inputVacio");
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

