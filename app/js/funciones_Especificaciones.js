let seleccion = {}
let estatusTipoEsp = 1;

let filterDataTipoEspPrincipal = [...data];

let msgActivarTipoEsp = "Especificación habilitada";
let msgEliminarTipoEsp = "Especificación deshabilitada";
function seleccionEspecificacion(valor) {
    seleccion.idEspecificacion = valor;
    rowsPerPage = 10;
    let paginas = document.getElementById("rows-per-pagePrincipal");
    paginas.value = 10;
    let contenido = document.getElementById("contenidoTipoEsp");
    contenido.classList.remove("d-none")
    let tabla = document.getElementById("TablaTipoEsp");
    tabla.classList.remove("d-none")
    let buscador = document.getElementById("BuscadorTipoEsp");
    buscador.classList.remove("d-none")
    let esta = document.getElementById("btnEsta");
    esta.classList.remove("d-none")
    GetTipoEsp(valor);
}

function precionaBtnEsp(valor) {
    let opciones = document.querySelectorAll(".btn-tiposde-especificaciones");
    opciones.forEach(opcion => {
        opcion.classList.remove("precionadoBtnEsp");
    });
    valor.classList.add('precionadoBtnEsp');
}

function GetTipoEsp(idEsp) {
    rowsPerPage = 10;
    let datos = {};
    datos.idEspecificacion = idEsp;
    let json = JSON.stringify(datos);

    let url = "../ws/TipoEsp/wsGetTipoEsp.php";
    $.post(url, json, (responseText, status) => {
        try {

            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    data = resp.datos;
                } else {
                    data = [];
                }

                llenarTablaTipoEsp();
                filterDataTipoEsp();
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}

function displayTableTipoEsp(page) {
    const tableBody = document.getElementById("table-bodyTipoEsp");
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filterDataTipoEspPrincipal.slice(start, end);
    if (paginatedData.length > 0) {
        paginatedData.forEach(record => {
            // Crear un elemento de fila (tr)
            const row = document.createElement('tr');
            row.classList.add('fila');

            // Establecer el contenido HTML de la fila
            row.innerHTML = `
                <td class="Code">${record.codigo}</td>
                <td>${(!record.nombretipo == "") ? record.nombretipo : "---"}</td>
                     <td class="estatus">
                <div style="display: flex; justify-content: space-around; align-items: center;">
                 ${record.estatus == 1 ? `
                        <i class="coloresIcono fa-regular fa-eye" style="cursor: pointer;" alt="Ver" data-bs-toggle="modal" data-bs-target="#AgregarModalEspecificaciones" onclick="llenarModalVerTipoEsp('${record.idtipo}','${record.idespecificacion}','${record.codigo}','${record.nombretipo}','${record.descripcion}')"></i>
                    ` : ``}
                    ${record.estatus == 1 ? `
                        <i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;" alt="Modificar" data-bs-toggle="modal" data-bs-target="#AgregarModalEspecificaciones" onclick="llenarModalModificarTipoEsp('${record.idtipo}','${record.idespecificacion}','${record.codigo}','${record.nombretipo}','${record.descripcion}')"></i>
                    ` : ``}
                   
                    ${record.estatus == 1 ?
                    `<i class="coloresIcono fa-solid fa-square-check" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores('${record.idtipo}',${record.estatus})"></i>` :
                    `<i class="coloresIcono fa-solid fa-square" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores('${record.idtipo}',${record.estatus})"></i>`
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

function setupPaginationTipoEsp() {
    const paginationDiv = document.getElementById("paginationPrincipal");
    paginationDiv.innerHTML = "";

    const totalPages = Math.ceil(filterDataTipoEspPrincipal.length / rowsPerPage);
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
                displayTableTipoEsp(currentPage);
                setupPaginationTipoEsp();
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
                displayTableTipoEsp(currentPage);
                setupPaginationTipoEsp();
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
                displayTableTipoEsp(currentPage);
                setupPaginationTipoEsp();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

function filterDataTipoEsp() {
    const searchText = document.getElementById("search-inputEspecificaciones").value.toLowerCase();
    const statusFilter = estatusTipoEsp;

    filterDataTipoEspPrincipal = data.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value != null && value.toString().toLowerCase().includes(searchText)
        );
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesStatus;
    });

    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableTipoEsp(currentPage);
    setupPaginationTipoEsp();
}

function llenarTablaTipoEsp() {

    displayTableTipoEsp(currentPage);
    setupPaginationTipoEsp();

    const searchInput = document.getElementById("search-inputEspecificaciones");
    searchInput.addEventListener("input", filterDataTipoEsp);

    const rowsPerPageSelect = document.getElementById("rows-per-pagePrincipal");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableTipoEsp(currentPage);
        setupPaginationTipoEsp();
    });
}


function valStatusTipoEsp() {
    var checkbox = document.getElementById('ValCheEsta');
    var imgcheck = document.getElementById('ValEstatus');
    // Deseleccionar el checkbox
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        imgcheck.src = "../img/toggle_on_35px.png"
        estatusTipoEsp = 1;
    } else {
        imgcheck.src = "../img/toggle_off_35px.png"
        estatusTipoEsp = 0;
    }
    filterDataTipoEsp();
}

function CambioEstatusTipoEsp() {
    const datos = {};
    let url = "../ws/TipoEsp/wsCambiarStatus.php";
    let msgzo = "";
    datos.id = idEliminar;
    if (ActivarS == 1) {
        datos.estatus = "Inactivo";
        msgzo = msgEliminarTipoEsp;
    } else {
        datos.estatus = "Activo";
        msgzo = msgActivarTipoEsp;
    }
    let json = JSON.stringify(datos);
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                mensajePantalla(msgzo, true)
                paginaActual = 1;
                GetTipoEsp(seleccion.idEspecificacion);
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });

}

function llenarModalVerTipoEsp(idTipo, idEspecificacion, codigo, nombre, descripcion) {
    let familia = document.querySelector('#addFamilia');
    familia.value = idEspecificacion;
    familia.disabled = true;
    seleccion.idEspecificacion = idEspecificacion;
    let especificacion = document.querySelector('#addNombreEspecificacion');
    especificacion.disabled = true;
    especificacion.value = nombre;
    let descripcionTxt = document.querySelector('#AddDescripcionInput');
    descripcionTxt.disabled = true;
    descripcionTxt.value = descripcion;
    let id = document.querySelector('#AddidCodigoInput');
    id.value = codigo;
    let nombrebtn = document.getElementById('exampleModalLabel');
    nombrebtn.innerHTML = 'Ver especificación';
    tipoModal = 5;

    let btnAgregar = document.getElementById('btnAgregarCon');
    btnAgregar.style.display = 'none';

    let btnGuardar = document.getElementById('btnGuardarModalTipoEsp');
    btnGuardar.innerHTML = "Cerrar"

    document.getElementById('lblFam').innerHTML = "Familia";
    document.getElementById('lblEsp').innerHTML = "Especificación";
    document.getElementById('lblDes').innerHTML = "Descripción";
    document.getElementById('lblRequerido').innerHTML = "";

    const lecturaConcepto = document.querySelector('#LecturaConcepto');
    lecturaConcepto.style.display = 'none';
    MostrartablaConceptoEspecificacion(idTipo, 1);

}

function llenarModalModificarTipoEsp(idTipo, idEspecificacion, codigo, nombre, descripcion) {
    let familia = document.querySelector('#addFamilia');
    familia.value = idEspecificacion;
    familia.disabled = true;
    seleccion.idEspecificacion = idEspecificacion;
    let especificacion = document.querySelector('#addNombreEspecificacion');
    especificacion.disabled = false;
    especificacion.value = nombre;
    let descripcionTxt = document.querySelector('#AddDescripcionInput');
    descripcionTxt.disabled = false;
    descripcionTxt.value = descripcion;
    let id = document.querySelector('#AddidCodigoInput');
    id.value = codigo;
    tipoModal = 1;
    let nombrebtn = document.getElementById('exampleModalLabel');
    nombrebtn.innerHTML = 'Modificar especificación';
    let btnAgregar = document.getElementById('btnAgregarCon');
    btnAgregar.style.display = 'block';
    const lecturaConcepto = document.querySelector('#LecturaConcepto');
    lecturaConcepto.style.display = 'none';
    document.getElementById('lblRequerido').innerHTML = "Es requerido: *";
    let btnGuardar = document.getElementById('btnGuardarModalTipoEsp');
    btnGuardar.innerHTML = "Guardar"
    document.getElementById('lblFam').innerHTML = "Familia";
    document.getElementById('lblEsp').innerHTML = "Especificación*";
    document.getElementById('lblDes').innerHTML = "Descripción*";
    MostrartablaConceptoEspecificacion(idTipo, 1);

}