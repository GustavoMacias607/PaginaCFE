
let objZonas;
let idNuevoProyecto;
let datosProyecto = {};
let filterDataProyTerm = [...data];


let costosAdicionales = {};


let estatusProyecto = "Terminado";

const datosProyectoCambio = {};

function AddProyectoFase1() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let idProyecto = document.querySelector('#inputIdProyecto');
    datos.idProyecto = idProyecto.value;
    let idUsuario = document.querySelector('#idUsuario');
    datos.idUsuario = idUsuario.value;


    let nombre = document.querySelector('#inputNombreObra');
    if (nombre.value == "") {
        nombre.classList.add("inputVacio");
        nombre.placeholder = "Requerido el nombre de la obra";
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = nombre;
        }
    }
    datos.nombre = nombre.value;
    datos.fecha = ObtenerFechaActual();
    let periodo = document.querySelector('#inputPeriodo');
    if (periodo.value == "") {
        periodo.classList.add("inputVacio");
        periodo.placeholder = "Requerido el periodo";
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = periodo;
        }
    }
    datos.periodo = periodo.value;

    let fechaInicio = document.querySelector('#AddfechaInicioInput');
    if (fechaInicio.value == "") {
        fechaInicio.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = fechaInicio;
        }
    }
    datos.fechaInicio = FormateoFecha(fechaInicio.value);


    let fechaTermino = document.querySelector('#AddfechaTerminoInput');
    datos.fechaTermino = FormateoFecha(fechaTermino.value);

    let nombreZona = document.querySelector('#inputZona');
    // Verificar si la zona es válida
    const zonaValida = objZonas.some(z => z.zona.toLowerCase() == nombreZona.value.toLowerCase());
    if (nombreZona.value == "" || !zonaValida) {
        nombreZona.classList.add("inputVacio");
        nombreZona.placeholder = nombreZona.value == "" ? "Requerida la zona" : "Zona no válida";
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = nombreZona;
        }
    }
    datos.zona = nombreZona.value;
    let obra = document.querySelector('#AddTipoObra');
    if (obra.value == "") {
        obra.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = obra;
        }
    }
    datos.obra = obra.value;
    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }

    if (existe) {
        id.focus();
        return;
    }
    datos.idZona = obtenerIdZona();
    datos.total = 0;
    datosProyecto = datos;
    let json = JSON.stringify(datos);
    let url = "../ws/Proyecto/wsAddProyecto.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    AddCerrarModal();
                    opcion("addCatConFrm")
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function addProyectoLimpiarModal() {
    GetIdProyecto();
    let idZona = document.querySelector('#inputZona');
    let tipoObra = document.querySelector('#AddTipoObra');
    let fechaInicio = document.querySelector('#AddfechaInicioInput');
    let periodo = document.querySelector('#inputPeriodo');
    let fechaTermino = document.querySelector('#AddfechaTerminoInput');
    let nombre = document.querySelector('#inputNombreObra');


    idZona.value = "";
    tipoObra.value = "";
    fechaInicio.value = "";
    periodo.value = "";
    fechaTermino.value = "";
    nombre.value = "";

    idZona.placeholder = "";
    tipoObra.placeholder = "";
    fechaInicio.placeholder = "";
    periodo.placeholder = "";
    fechaTermino.placeholder = "";
    nombre.placeholder = "";

    idZona.classList.remove("inputVacio");
    tipoObra.classList.remove("inputVacio");
    fechaInicio.classList.remove("inputVacio");
    periodo.classList.remove("inputVacio");
    fechaTermino.classList.remove("inputVacio");
    nombre.classList.remove("inputVacio");
}

function calcularFechaTermino() {
    const fechaInicioInput = document.getElementById('AddfechaInicioInput').value;
    const periodoInput = document.getElementById('inputPeriodo').value;

    if (fechaInicioInput && periodoInput) {
        const fechaInicio = new Date(fechaInicioInput);
        const periodo = parseInt(periodoInput, 10);

        // Sumar el periodo completo a la fecha de inicio
        fechaInicio.setDate(fechaInicio.getDate() + periodo);

        // Formatear la fecha de término en formato YYYY-MM-DD
        const year = fechaInicio.getFullYear();
        const month = String(fechaInicio.getMonth() + 1).padStart(2, '0');
        const day = String(fechaInicio.getDate()).padStart(2, '0');
        const fechaTermino = `${year}-${month}-${day}`;

        // Establecer la fecha de término en el input correspondiente
        document.getElementById('AddfechaTerminoInput').value = fechaTermino;
    }
}

function GetProyectoProceso() {
    verRolUsuario();
    datosProyecto = {};
    editedRows = {};
    conceptosDProyecto = [];
    document.getElementById('AddfechaInicioInput').addEventListener('blur', calcularFechaTermino);
    document.getElementById('inputPeriodo').addEventListener('blur', calcularFechaTermino);
    ObtenerZonas(false);
    let datos = {};
    let idUsuario = document.querySelector('#idUsuario');
    datos.idUsuario = idUsuario.value;
    let json = JSON.stringify(datos);
    let url = "../ws/Proyecto/wsGetProyectos.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    data = resp.datos;
                    llenarTablaProyectoProceso();
                    filterDataProyectoProceso();
                    llenarTablaProyectoTerminado();
                    filterDataProyectoTerminado();
                } else {
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

function displayTableProyectoProceso(page) {
    const tableBody = document.getElementById("table-bodyProyectosProceso");
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredData.slice(start, end);

    if (paginatedData.length > 0) {
        paginatedData.forEach(record => {
            // Función para formatear fecha
            const formatDate = (fecha) => {
                if (!fecha || fecha.trim() === "" || fecha === "0000-00-00") return "---";
                const partes = fecha.split("-");
                if (partes.length !== 3) return fecha; // por si viene en otro formato
                const [anio, mes, dia] = partes;
                return `${dia}/${mes}/${anio}`;
            };

            const fechaFormateada = formatDate(record.fecha);

            // Crear un elemento de fila (tr)
            const row = document.createElement('tr');
            row.classList.add('fila');
            row.style.cursor = "pointer";

            // Establecer el contenido HTML de la fila
            row.innerHTML = `
                <td class="Code" style="text-align: right;">${record.idproyecto}</td>
                <td>${record.nombre?.trim() || "---"}</td>
                <td>${fechaFormateada}</td>
                <td>${record.NombreZona?.trim() || "---"}</td>
                <td>${record.TipoObra?.trim() || "---"}</td>
                <td>${record.estatus || "---"}</td>
            `;

            // Eventos mouseover / mouseout
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));

            // Evento doble clic
            row.addEventListener("dblclick", () => {
                datosProyecto = {
                    idProyecto: record.idproyecto,
                    nombre: record.nombre,
                    zona: record.NombreZona,
                    idZona: record.idzona,
                    obra: record.TipoObra,
                    fecha: record.fecha,
                    fechaInicio: record.fechainicio,
                    fechaTermino: record.fechatermino,
                    periodo: record.periodo,
                    total: record.total,
                    estatus: record.estatus
                };
                if (record.estatus == "Catalogo Conceptos") {
                    opcion("addCatConFrm");
                } else {
                    opcion("addPresupuestoFrm");
                }
            });

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


function setupPaginationProyectoProceso() {
    const paginationDiv = document.getElementById("paginationProceso");
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
        prevButton.disabled = currentPage == 1;
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                displayTableProyectoProceso(currentPage);
                setupPaginationProyectoProceso();
            }
        });
        paginationDiv.appendChild(prevButton);
        // Botones de página
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement("button");
            button.innerText = i;

            if (currentPage == i) {
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
                displayTableProyectoProceso(currentPage);
                setupPaginationProyectoProceso();
            });
            paginationDiv.appendChild(button);
        }

        // Botón de "Adelante"
        const nextButton = document.createElement("button");
        nextButton.innerHTML = `<i class="fa-solid fa-angles-right"></i>`;
        nextButton.style.backgroundColor = "#008e5a";
        nextButton.style.color = "#ffffff";
        nextButton.style.border = "3px solid #008e5a";
        nextButton.disabled = currentPage == totalPages;
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayTableProyectoProceso(currentPage);
                setupPaginationProyectoProceso();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

function filterDataProyectoProceso() {
    const searchText = document.getElementById("search-inputProyecto").value.toLowerCase();
    const statusFilterCuadro = "Catalogo Conceptos";
    const statusFilterPresupuesto = "Presupuesto";
    filteredData = data.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value.toString().toLowerCase().includes(searchText)
        );
        let matchesStatus;
        if (rolUsuarioSe == "Invitado") {
            if (record.estatus == statusFilterPresupuesto) {
                matchesStatus = true;
            } else {
                matchesStatus = false;
            }
        } else {
            if (record.estatus == statusFilterCuadro || record.estatus == statusFilterPresupuesto) {
                matchesStatus = true;
            } else {
                matchesStatus = false;
            }
        }


        return matchesSearch && matchesStatus;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableProyectoProceso(currentPage);
    setupPaginationProyectoProceso();
}

function llenarTablaProyectoProceso() {
    displayTableProyectoProceso(currentPage);
    setupPaginationProyectoProceso();
    const searchInput = document.getElementById("search-inputProyecto");
    searchInput.addEventListener("input", filterDataProyectoProceso);
    const rowsPerPageSelect = document.getElementById("rows-per-pageProceso");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableProyectoProceso(currentPage);
        setupPaginationProyectoProceso();
    });
}

function ObtenerZonas(tarjetas) {
    let tarjetaConcepto = tarjetas;
    let json = "";
    let url = "";
    url = "../ws/Zonas/wsGetZona.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    objZonas = resp.datos;

                    if (tarjetaConcepto)
                        console.log("tarjetas");
                    porcentajeZona(objZonas, false);
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}

function mostrarSugerenciasZonas(input) {
    let sugerenciasDiv;
    sugerenciasDiv = document.getElementById('Addsugerencias');
    sugerenciasDiv.innerHTML = ''; // Limpiar sugerencias previas
    const filtro = input.value.toLowerCase(); // Texto que está escribiendo el usuario
    const sugerenciasFiltradas = filtro == '' ? objZonas : objZonas.filter(zona =>
        zona.zona.toLowerCase().includes(filtro)
    );

    // Crear un objeto para filtrar zonas duplicadas
    const zonasUnicas = {};
    sugerenciasFiltradas.forEach(zona => {
        zonasUnicas[zona.zona.toLowerCase()] = zona;
    });

    // Convertir el objeto de zonas únicas de nuevo a un array
    const zonasUnicasArray = Object.values(zonasUnicas);


    // Ocultar el cuadro de sugerencias si no hay coincidencias o si la única coincidencia es exactamente igual al texto ingresado
    if (zonasUnicasArray.length == 0 || (zonasUnicasArray.length == 1 && zonasUnicasArray[0].zona.toLowerCase() == filtro)) {
        sugerenciasDiv.classList.remove('activado'); // Ocultar el cuadro de sugerencias
        return; // Salir de la función si no hay sugerencias o la única sugerencia coincide exactamente
    } else {
        sugerenciasDiv.classList.add('activado'); // Mostrar el cuadro de sugerencias si hay coincidencias
    }

    // Crear los elementos de sugerencia y agregarlos al cuadro

    zonasUnicasArray.forEach(zona => {
        const div = document.createElement('div');
        div.classList.add('sugerencia-itemZona');
        div.textContent = zona.zona;
        div.onclick = () => seleccionarSugerenciaZonas(zona.zona, sugerenciasDiv);
        sugerenciasDiv.appendChild(div);
    });
}

// Función para ocultar el cuadro de sugerencias al perder el foco
function ocultarSugerenciasZonas() {
    setTimeout(() => {
        let sugerenciasDiv = document.getElementById('Addsugerencias');
        sugerenciasDiv.classList.remove('activado'); // Ocultar el cuadro de sugerencias
    }, 500);
}

function seleccionarSugerenciaZonas(unidad, sugerenciasDiv) {
    let input = document.getElementById('inputZona');
    input.value = unidad; // Colocar la unidad seleccionada en el input
    sugerenciasDiv.innerHTML = ''; // Limpiar las sugerencias
    sugerenciasDiv.classList.remove('activado'); // Ocultar el cuadro
}

function obtenerIdZona() {
    let zona = document.getElementById('inputZona').value.toLowerCase();
    let obra = document.getElementById('AddTipoObra').value.toLowerCase();

    // Encontrar el objeto que coincida con la zona y la obra
    const resultado = objZonas.find(z => z.zona.toLowerCase() == zona && z.obra.toLowerCase() == obra);
    // Si se encuentra el objeto, devolver el idzona, de lo contrario, devolver null o un valor por defecto
    if (resultado) {
        return resultado.idzona;
    } else {
        return null; // o cualquier valor por defecto que prefieras
    }
}

function GetIdProyecto() {
    let json = "";
    let url = "../ws/Proyecto/wsGetIdProyecto.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    // Llamar a la función para mostrar los datos en la tabla
                    document.querySelector('#inputIdProyecto').value = parseInt(resp.datos[0].idproyecto) + 1;
                } else {
                    document.querySelector('#inputIdProyecto').value = 1;
                }

            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}







/***
 * 
 * Proyectos terminados
 * 
 */


function displayTableProyectoTerminado(page) {
    const tableBody = document.getElementById("table-bodyProyectosTerminados");
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filterDataProyTerm.slice(start, end);

    // Función para formatear fechas (YYYY-MM-DD → DD/MM/YYYY)
    const formatDate = (fecha) => {
        if (!fecha || fecha.trim() === "" || fecha === "0000-00-00") return "---";
        const partes = fecha.split("-");
        if (partes.length !== 3) return fecha; // por si viene en otro formato
        const [anio, mes, dia] = partes;
        return `${dia}/${mes}/${anio}`;
    };

    if (paginatedData.length > 0) {
        paginatedData.forEach(record => {
            const fechaFormateada = formatDate(record.fecha);

            // Crear un elemento de fila (tr)
            const row = document.createElement('tr');
            row.classList.add('fila');
            row.style.cursor = "pointer";

            // Establecer el contenido HTML de la fila
            row.innerHTML = `
                <td class="Code" style="text-align: right;">${record.idproyecto}</td>
                <td>${record.nombre?.trim() || "---"}</td>
                <td>${fechaFormateada}</td>
                <td>${record.NombreZona?.trim() || "---"}</td>
                <td>${record.TipoObra?.trim() || "---"}</td>
                <td class="estatus">
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        ${rolUsuarioSe == "Administrador" ? (
                    record.estatus == "Terminado" ?
                        `<i class="coloresIcono fa-solid fa-square-check" style="cursor: pointer;"
                                onclick="abrirModalBaja('${record.estatus}');
                                creacionObjCambioEstatus(${record.idproyecto}, ${record.idusuario}, '${encodeURIComponent(record.nombre)}', '${record.fecha}', '${record.periodo}', '${record.fechainicio}', '${record.fechatermino}', ${record.idzona}, ${record.total}, '${record.estatus}')"></i>`
                        :
                        `<i class="coloresIcono fa-solid fa-square" style="cursor: pointer;"
                                onclick="abrirModalBaja('${record.estatus}');
                                creacionObjCambioEstatus(${record.idproyecto}, ${record.idusuario}, '${encodeURIComponent(record.nombre)}', '${record.fecha}', '${record.periodo}', '${record.fechainicio}', '${record.fechatermino}', ${record.idzona}, ${record.total}, '${record.estatus}')"></i>`
                ) : ``}
                    </div>
                </td>
            `;

            // Eventos mouseover / mouseout
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));

            // Evento doble clic
            row.addEventListener("dblclick", () => {
                datosProyecto = {
                    idProyecto: record.idproyecto,
                    nombre: record.nombre,
                    zona: record.NombreZona,
                    idZona: record.idzona,
                    obra: record.TipoObra,
                    fecha: record.fecha,
                    fechaInicio: record.fechainicio,
                    fechaTermino: record.fechatermino,
                    periodo: record.periodo,
                    total: record.total,
                    estatus: record.estatus
                };
                opcion('addProyTermFrm');
            });

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


function setupPaginationProyectoTerminado() {
    const paginationDiv = document.getElementById("paginationTerminados");
    paginationDiv.innerHTML = "";

    const totalPages = Math.ceil(filterDataProyTerm.length / rowsPerPage);
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
        prevButton.disabled = currentPage == 1;
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                displayTableProyectoTerminado(currentPage);
                setupPaginationProyectoTerminado();
            }
        });
        paginationDiv.appendChild(prevButton);
        // Botones de página
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement("button");
            button.innerText = i;

            if (currentPage == i) {
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
                displayTableProyectoTerminado(currentPage);
                setupPaginationProyectoTerminado();
            });
            paginationDiv.appendChild(button);
        }

        // Botón de "Adelante"
        const nextButton = document.createElement("button");
        nextButton.innerHTML = `<i class="fa-solid fa-angles-right"></i>`;
        nextButton.style.backgroundColor = "#008e5a";
        nextButton.style.color = "#ffffff";
        nextButton.style.border = "3px solid #008e5a";
        nextButton.disabled = currentPage == totalPages;
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayTableProyectoTerminado(currentPage);
                setupPaginationProyectoTerminado();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

function filterDataProyectoTerminado() {
    const searchText = document.getElementById("search-inputProyecto").value.toLowerCase();
    const statusFilter = estatusProyecto;
    filterDataProyTerm = data.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value.toString().toLowerCase().includes(searchText)
        );
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesStatus;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableProyectoTerminado(currentPage);
    setupPaginationProyectoTerminado();
}

function llenarTablaProyectoTerminado() {
    displayTableProyectoTerminado(currentPage);
    setupPaginationProyectoTerminado();
    const searchInput = document.getElementById("search-inputProyecto");
    searchInput.addEventListener("input", filterDataProyectoTerminado);
    const rowsPerPageSelect = document.getElementById("rows-per-pageTerminados");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableProyectoTerminado(currentPage);
        setupPaginationProyectoTerminado();
    });
}

function creacionObjCambioEstatus(IdProyecto, idUsuario, Nombre, Fecha, Periodo, FechaInicio, FechaTermino, IdZona, Total, estatus) {

    datosProyectoCambio.idProyecto = IdProyecto;
    datosProyectoCambio.idUsuario = idUsuario;
    datosProyectoCambio.nombre = decodeURIComponent(Nombre);
    datosProyectoCambio.fecha = Fecha;
    datosProyectoCambio.periodo = Periodo;
    datosProyectoCambio.fechaInicio = FechaInicio;
    datosProyectoCambio.fechaTermino = FechaTermino;
    datosProyectoCambio.idZona = IdZona;
    datosProyectoCambio.total = Total;
    if (estatus == 'Terminado') {
        datosProyectoCambio.estatus = "Inactivo";
    } else {
        datosProyectoCambio.estatus = "Terminado";
    }

}

function abrirModalBaja(estatus) {
    if (estatus == "Terminado") {
        $('#confirmDeleteModal').modal('show');
    } else {
        $('#confirmActivationModal').modal('show');
    }
}

function valStatusProyecto() {
    var checkbox = document.getElementById('ValCheEsta');
    var imgcheck = document.getElementById('ValEstatus');
    // Deseleccionar el checkbox
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        imgcheck.src = "../img/toggle_on_35px.png";
        estatusProyecto = "Terminado";
    } else {
        imgcheck.src = "../img/toggle_off_35px.png";
        estatusProyecto = "Inactivo";
    }
    GetProyectoProceso();
}


function cambioEstatusProyecto() {
    let json = JSON.stringify(datosProyectoCambio);
    let url = "../ws/Proyecto/wsUpdProyecto.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    GetProyectoProceso();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}