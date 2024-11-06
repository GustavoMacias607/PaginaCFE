let msgEliminarBasico = "Material Basico desabilitado";
let msgActivarBasico = "Material Basico habilitado";
let msgAgregarBasico = "Material Basico agregado";
let msgModificarBasico = "Material Basico modificado";

var estatusBasico = 1;
//Metodo que valida el formulario para agregar materiales y al mismo tiempo agrega el material
function AddBasicoValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};

    let id = document.querySelector('#AddidInputBasicos');
    if (id.value == "") {
        id.classList.add("inputVacio");
        id.placeholder = "Requerido el ID"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = id;
        }
    }
    datos.id = id.value;
    let descripcion = document.querySelector('#AdddescripcionInputBasicos');
    if (descripcion.value == "") {
        descripcion.classList.add("inputVacio");
        descripcion.placeholder = "Requerida la descripcion"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = descripcion;
        }
    }
    datos.descripcion = descripcion.value;

    let unidad = document.querySelector('#AddUnidadInputBasicos');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }
    }
    datos.unidad = unidad.value;

    let pm = document.querySelector('#AddphmInputBasicos');
    if (pm.value == "") {
        pm.classList.add("inputVacio");
        pm.placeholder = "Requerido el precio"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = pm;
        }
    }
    datos.pm = pm.value;
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
    if (existe) {
        id.focus();
        return;
    }
    let json = JSON.stringify(datos);
    console.log(json);

    let url = "../ws/Basicos/wsAddBasico.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    AddCerrarModal();
                    GetBasico();
                    mensajePantalla(msgAgregarBasico, true);
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
function UpdBasicoValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let idAnterior = document.querySelector('#UpdidAnteriorBasicos');
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

    let unidad = document.querySelector('#UpdUnidadInputBasicos');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }
    }
    datos.unidad = unidad.value;

    let pm = document.querySelector('#UpdphmInput');
    if (pm.value == "") {
        pm.classList.add("inputVacio");
        pm.placeholder = "Requerido el precio"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = pm;
        }
    }
    datos.pm = pm.value;
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

    if (existe) {
        id.focus();
        return;
    }
    let json = JSON.stringify(datos);
    console.log(json);
    let url = "../ws/Basicos/wsUpdBasico.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp);
                if (resp.estado == "OK") {
                    UpdateCerrarModal();
                    mensajePantalla(msgModificarBasico, true);
                    GetBasico();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function checkBasico(modal) {
    const datos = {}
    if (modal == "Add") {
        var idVali = document.querySelector('#AddidInputBasicos');
    } else {
        var idVali = document.querySelector('#UpdidInput');
        let idAnterior = document.querySelector('#UpdidAnteriorBasicos');
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

    let url = "../ws/Basicos/wscheckBasico.php";
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
function CambioEstatusBasicos() {
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
            let url = "../ws/Basicos/wsCambiarStatus.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        mensajePantalla(msgActivarBasico, true)
                        paginaActual = 1;
                        GetBasico();
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
            let url = "../ws/Basicos/wsCambiarStatus.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        GetBasico();
                        paginaActual = 1;
                        mensajePantalla(msgEliminarBasico, true)
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
function GetBasico() {

    let json = "";
    let url = "../ws/Basicos/wsGetBasico.php";
    $.post(url, json, (responseText, status) => {
        try {

            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    data = resp.datos;
                    console.log(data)
                    llenarTablaBasico();
                    filterDataBasico();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}

function displayTableBasico(page) {
    const tableBody = document.getElementById("table-bodyBasico");
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredData.slice(start, end);

    if (paginatedData.length > 0) {
        paginatedData.forEach(record => {
            const row = `<tr class="fila">
                        <td class="Code">${record.idbasicos}</td>
            <td>${(!record.descripcion == "") ? record.descripcion : "---"}</td>
            <td>${(!record.unidad == "") ? record.unidad : "---"}</td>
            <td>${(!record.pm == "") ? record.pm : "---"}</td>
            <td>${(!record.fechaprecio == "") ? record.fechaprecio : "---"}</td>
            <td class="estatus">
            <div class="" style="display: flex; justify-content: space-around; align-items: center;">
                        ${record.estatus == 1 ? `<i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;"  alt="Modificar" data-bs-toggle="modal" data-bs-target="#EditarModal" onclick="llenarModalModificarBasico(${record.idbasicos},'${record.descripcion}','${record.unidad}',${record.pm},'${record.fechaprecio}')"></i>
                        `: ``}
                        ${record.estatus == 1 ?
                    `<i class="coloresIcono fa-solid fa-square-check" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${record.idbasicos},${record.estatus})"></i>` :
                    `<i class="coloresIcono fa-solid fa-square" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${record.idbasicos},${record.estatus})"></i>`
                }
                        </div>
                        </td>    
                     </tr>`;
            tableBody.innerHTML += row;
        });
    } else {
        const row = `<tr>
                        <td colspan="6" class="Code">Sin resultados</td>
                     </tr>`;
        tableBody.innerHTML += row;
    }
}

function setupPaginationBasico() {
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
                displayTableBasico(currentPage);
                setupPaginationBasico();
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
                displayTableBasico(currentPage);
                setupPaginationBasico();
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
                displayTableBasico(currentPage);
                setupPaginationBasico();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

function filterDataBasico() {
    const searchText = document.getElementById("search-inputBasico").value.toLowerCase();
    const unidadFilter = document.getElementById("unidad-filterBasico").value;
    const statusFilter = estatusBasico;

    filteredData = data.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value != null && value.toString().toLowerCase().includes(searchText)
        );
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesUnidad && matchesStatus;
    });

    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableBasico(currentPage);
    setupPaginationBasico();
}

function llenarTablaBasico() {
    displayTableBasico(currentPage);
    setupPaginationBasico();
    const searchInput = document.getElementById("search-inputBasico");
    searchInput.addEventListener("input", filterDataBasico);

    const unidadFilter = document.getElementById("unidad-filterBasico");
    unidadFilter.addEventListener("change", filterDataBasico);

    const rowsPerPageSelect = document.getElementById("rows-per-page");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableBasico(currentPage);
        setupPaginationBasico();
    });
}


//Metodo para limpiar el modal de agregar mano de obra
function AddlimpiarModalBasico() {
    let idBa = document.querySelector('#AddidInputBasicos');
    let descripcionBa = document.querySelector('#AdddescripcionInputBasicos');
    let UnidadBa = document.querySelector('#AddUnidadInputBasicos');
    let phm = document.querySelector('#AddphmInputBasicos');
    let fechaActual = new Date();
    let año = fechaActual.getFullYear();
    let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    let dia = fechaActual.getDate().toString().padStart(2, '0');
    let fechaFormateada = `${año}-${mes}-${dia}`;
    document.querySelector('#AddfechaPrecioInput').value = fechaFormateada;

    idBa.value = "";
    descripcionBa.value = "";
    UnidadBa.value = "";
    phm.value = "";


    idBa.placeholder = "";
    descripcionBa.placeholder = "";
    phm.placeholder = "";

    idBa.classList.remove("inputVacio");
    descripcionBa.classList.remove("inputVacio");
    UnidadBa.classList.remove("inputVacio");
    phm.classList.remove("inputVacio");

}

//Metodo para cambiar la imagen del toggle a la hora de darle clic para cambiar entre materiales activos e inactivos
function valStatusBasico() {
    var checkbox = document.getElementById('ValCheEsta');
    var imgcheck = document.getElementById('ValEstatus');
    // Deseleccionar el checkbox
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        imgcheck.src = "../img/toggle_on_35px.png"
        estatusBasico = 1;
    } else {
        imgcheck.src = "../img/toggle_off_35px.png"
        estatusBasico = 0
    }
    filterDataBasico();
}

//Metodo para que se llene el modal de modificar con los datos seleccionados de la fila
//Recibe los datos del material
function llenarModalModificarBasico(id, descripcion, unidad, phM, fechaPrecio) {

    //Llenado de datos en el modal
    let idBa = document.querySelector('#UpdidInput');
    let descripcionBa = document.querySelector('#UpddescripcionInput');
    let UnidadBa = document.querySelector('#UpdUnidadInputBasicos');
    let phm = document.querySelector('#UpdphmInput');
    let idAnterior = document.querySelector('#UpdidAnteriorBasicos');
    let precioM = document.querySelector('#UpdprecioInput');

    idAnterior.value = id;
    idBa.value = id;
    descripcionBa.value = descripcion;
    phm.value = phM;

    //llenar el select de unidad
    for (var i = 0; i < UnidadBa.options.length; i++) {
        if (UnidadBa.options[i].value === unidad) {
            UnidadBa.options[i].selected = true;
            break;
        }
    }
    if (fechaPrecio != "null") {
        document.querySelector('#UpdfechaPrecioInput').value = FormateoFecha(fechaPrecio);
    } else {
        let fechaActual = new Date();
        let año = fechaActual.getFullYear();
        let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses en JavaScript van de 0 a 11
        let dia = fechaActual.getDate().toString().padStart(2, '0');
        let fechaFormateada = `${año}-${mes}-${dia}`;
        document.querySelector('#UpdfechaPrecioInput').value = fechaFormateada;
    }
    idBa.placeholder = "";
    descripcionBa.placeholder = "";
    phm.placeholder = "";

    idBa.classList.remove("inputVacio");
    descripcionBa.classList.remove("inputVacio");
    UnidadBa.classList.remove("inputVacio");
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

