
let objZonas;
let idNuevoProyecto;
let datosProyecto = {};
let filterDataProyTerm = [...data];


let costosAdicionales = {};

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
    const zonaValida = objZonas.some(z => z.zona.toLowerCase() === nombreZona.value.toLowerCase());
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
    console.log(json)

    let url = "../ws/Proyecto/wsAddProyecto.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp);
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
    document.getElementById('AddfechaInicioInput').addEventListener('blur', calcularFechaTermino);
    document.getElementById('inputPeriodo').addEventListener('blur', calcularFechaTermino);
    ObtenerZonas();
    let datos = {};
    let idUsuario = document.querySelector('#idUsuario');
    datos.idUsuario = idUsuario.value;
    let json = JSON.stringify(datos);
    let url = "../ws/Proyecto/wsGetProyectos.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp);
                if (resp.estado == "OK") {
                    data = resp.datos;
                    console.log(data)
                    llenarTablaProyectoProceso();
                    filterDataProyectoProceso();
                    llenarTablaProyectoTerminado();
                    filterDataProyectoTerminado();
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
            console.log(record);
            // Crear un elemento de fila (tr)
            const row = document.createElement('tr');
            row.classList.add('fila');
            row.style.cursor = "pointer";
            // Establecer el contenido HTML de la fila
            row.innerHTML = `
                <td class="Code">${record.idproyecto}</td>
                <td>${(!record.nombre == "") ? record.nombre : "---"}</td>
                <td>${(!record.NombreZona == "") ? record.NombreZona : "---"}</td>
                <td>${(!record.TipoObra == "") ? record.TipoObra : "---"}</td>
            `;

            // Añadir eventos mouseover y mouseout
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));

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
        prevButton.disabled = currentPage === 1;
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
        nextButton.disabled = currentPage === totalPages;
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
    console.log(data);
    filteredData = data.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value.toString().toLowerCase().includes(searchText)
        );
        let matchesStatus;
        if (record.estatus == statusFilterCuadro || record.estatus == statusFilterPresupuesto) {
            matchesStatus = true;
        } else {
            matchesStatus = false;
        }

        console.log(record.estatus == statusFilterCuadro, record.estatus == statusFilterPresupuesto)
        return matchesSearch && matchesStatus;
    });
    console.log(filteredData);
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


function ObtenerZonas() {
    let json = "";
    let url = "";
    url = "../ws/Zonas/wsGetZona.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    objZonas = resp.datos;
                    PorsentajesZona(objZonas);
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
    const sugerenciasFiltradas = filtro === '' ? objZonas : objZonas.filter(zona =>
        zona.zona.toLowerCase().includes(filtro)
    );

    // Crear un objeto para filtrar zonas duplicadas
    const zonasUnicas = {};
    sugerenciasFiltradas.forEach(zona => {
        zonasUnicas[zona.zona.toLowerCase()] = zona;
    });

    // Convertir el objeto de zonas únicas de nuevo a un array
    const zonasUnicasArray = Object.values(zonasUnicas);

    console.log(zonasUnicasArray);

    // Ocultar el cuadro de sugerencias si no hay coincidencias o si la única coincidencia es exactamente igual al texto ingresado
    if (zonasUnicasArray.length === 0 || (zonasUnicasArray.length === 1 && zonasUnicasArray[0].zona.toLowerCase() === filtro)) {
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
    }, 200);
}

function seleccionarSugerenciaZonas(unidad, sugerenciasDiv) {
    console.log(unidad, sugerenciasDiv);
    let input = document.getElementById('inputZona');
    input.value = unidad; // Colocar la unidad seleccionada en el input
    sugerenciasDiv.innerHTML = ''; // Limpiar las sugerencias
    sugerenciasDiv.classList.remove('activado'); // Ocultar el cuadro
}

function obtenerIdZona() {
    let zona = document.getElementById('inputZona').value.toLowerCase();
    let obra = document.getElementById('AddTipoObra').value.toLowerCase();
    console.log(objZonas);
    console.log(zona, obra);

    // Encontrar el objeto que coincida con la zona y la obra
    const resultado = objZonas.find(z => z.zona.toLowerCase() == zona && z.obra.toLowerCase() == obra);
    console.log(resultado);
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
                    document.querySelector('#inputIdProyecto').value = resp.datos[0].idproyecto + 1;
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

    if (paginatedData.length > 0) {
        paginatedData.forEach(record => {
            console.log(record);
            // Crear un elemento de fila (tr)
            const row = document.createElement('tr');
            row.classList.add('fila');
            row.style.cursor = "pointer";
            // Establecer el contenido HTML de la fila
            row.innerHTML = `
                <td class="Code">${record.idproyecto}</td>
                <td>${(!record.nombre == "") ? record.nombre : "---"}</td>
                <td>${(!record.NombreZona == "") ? record.NombreZona : "---"}</td>
                <td>${(!record.TipoObra == "") ? record.TipoObra : "---"}</td>
            `;

            // Añadir eventos mouseover y mouseout
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));

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
                opcion('addProyTermFrm')
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
        prevButton.disabled = currentPage === 1;
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
        nextButton.disabled = currentPage === totalPages;
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
    const statusFilter = 'Terminado';
    console.log(data)
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
