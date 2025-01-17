let filteredDataPresupuesto = [...data];

let conceptosDProyecto = [];
let objMaquinarias;
let objManoObra;
let objMaterialesNo;
let objMaterialesSi;

let totalProyecto;

function llenarCamposPaginaPresupuesto() {
    let id = document.getElementById("lblId").innerHTML = datosProyecto.idProyecto;
    let zona = document.getElementById("lblZona").innerHTML = datosProyecto.zona;
    let tipoObra = document.getElementById("lblTipoObra").innerHTML = datosProyecto.obra;
    let fechaInicio = document.getElementById("lblFechaInicio").innerHTML = formatearFecha(datosProyecto.fechaInicio);
    let fechaTermino = document.getElementById("lblFechaTermino").innerHTML = formatearFecha(datosProyecto.fechaTermino);
    let nombre = document.getElementById("lblNombre").value = datosProyecto.nombre;
    let periodo = document.getElementById("lblPeriodo").innerHTML = datosProyecto.periodo;
    MostrarConceptosContenidosProyectoPresupuesto();
    getMaterialesSi();
    getMaterialesNo();
    getMaquinarias();
    getManoObras();

}


// function LlenarTablaConceptoPresupuesto() {
//     conceptosDProyecto = [];
//     LlenarCamposAgregar();
//     obtenerConceptosPresupuesto();
// }
function MostrarConceptosContenidosProyectoPresupuesto() {
    const datos = {};
    datos.idProyecto = datosProyecto.idProyecto;
    let json = JSON.stringify(datos);
    let url = "../ws/ConceptosProyecto/wsGetConceptos.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                let datosBd = resp.datos;
                console.log(datosBd);
                if (datosBd) {
                    datosBd.forEach((datos) => {
                        editedRows[datos.IdConcepto] = {
                            cantidad: datos.CantidadTotal,
                            estatus: datos.EstatusConcepto,
                            idconcepto: datos.IdConcepto,
                            nombre: datos.NombreConcepto,
                            nombreespe: "",
                            total: datos.TotalConcepto,
                            unidad: datos.UnidadConcepto,
                        };
                    });
                } else {
                    editedRows = {};
                }
                llenarTablaConceptoSeleccionadosPresupuesto();
            } else {
                throw new Error(status);
            }
        } catch (error) {
            alert("Error: " + error);
        }
    });
}

function obtenerConceptosPresupuesto() {
    MostrartablaConceptoPresupuesto();
}


function llenarTablaConceptoSeleccionadosPresupuesto() {
    llenarTablaConceptoPresupuesto();
    filterDataConceptoPresupuesto();
}

// Método para llenar la tablas
function displayTableConceptoPresupuesto(page) {
    totalProyecto = 0;
    const tableBody = document.getElementById("table-bodyConceptos");
    tableBody.innerHTML = "";
    const start = (page - 1) * cantidadFilasTabla;
    const end = start + cantidadFilasTabla;
    const paginatedDataPresupuesto = filteredDataPresupuesto.slice(start, end);
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
    if (paginatedDataPresupuesto.length > 0) {
        paginatedDataPresupuesto.forEach((record, index) => {
            const precioFormateado = record.total ? formatoMXN.format(record.total) : "---";
            let importe = record.cantidad * record.total
            totalProyecto += importe;

            const importeFormateado = record.total ? formatoMXN.format(importe) : "---";
            const row = document.createElement('tr');
            row.classList.add('fila');
            row.innerHTML = `
                  <td class="Code">${record.idconcepto}</td>
                    <td>${record.nombre !== "" ? record.nombre : "---"}</td>
                    <td>${record.unidad !== "" ? record.unidad : "---"}</td>
                    <td>${record.cantidad !== "" ? record.cantidad : "---"}</td>
                    <td>${precioFormateado}</td>
                    <td>${importeFormateado}</td>
                    `;
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));
            tableBody.appendChild(row);
        });

        let totalImporteConcepto = document.getElementById("TotalSumaImporteConceptos");
        totalImporteConcepto.innerHTML = formatoMXN.format(totalProyecto);
    } else {
        tableBody.innerHTML += `<tr>
                        <td colspan="8" class="Code">Sin resultados</td>
                     </tr>`;
    }
}

// Método para los filtros de la tabla
function setupPaginationConceptoPresupuesto() {
    const paginationDiv = document.getElementById("paginationCon");
    paginationDiv.innerHTML = "";

    const totalPages = Math.ceil(filteredDataPresupuesto.length / rowsPerPage);
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
                displayTableConceptoPresupuesto(currentPage);
                setupPaginationConceptoPresupuesto();
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
                displayTableConceptoPresupuesto(currentPage);
                setupPaginationConceptoPresupuesto();
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
                displayTableConceptoPresupuesto(currentPage);
                setupPaginationConceptoPresupuesto();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

function filterDataConceptoPresupuesto() {
    const searchText = document.getElementById("search-inputConceptos").value.toLowerCase();
    const statusFilter = 1;
    console.log(editedRows)
    filteredDataPresupuesto = Object.values(editedRows).filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value != null && value.toString().toLowerCase().includes(searchText)
        );
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesStatus;
    });

    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableConceptoPresupuesto(currentPage);
    setupPaginationConceptoPresupuesto();
}

function llenarTablaConceptoPresupuesto() {
    displayTableConceptoPresupuesto(currentPage);
    setupPaginationConceptoPresupuesto();
    const searchInput = document.getElementById("search-inputConceptos");
    searchInput.addEventListener("input", filterDataConceptoPresupuesto);
    const rowsPerPageSelect = document.getElementById("rows-per-pageCon");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableConceptoPresupuesto(currentPage);
        setupPaginationConceptoPresupuesto();
    });
}


function mostrarTabla(tablaId, boton) {
    const tabla = document.getElementById(tablaId);
    const isVisible = tabla.style.display === 'block';

    // Ocultar todas las tablas
    const tablas = document.querySelectorAll('div[id^="tabla"]');
    tablas.forEach(tabla => {
        tabla.style.display = 'none';
    });

    // Remover la clase de todos los botones
    const botones = document.querySelectorAll('.btnTabla');
    botones.forEach(btn => {
        btn.classList.remove('btnPresionadoTablas');
        btn.classList.add('fa-solid-Siguiente-catalogo');
    });

    if (!isVisible) {
        // Mostrar la tabla correspondiente
        tabla.style.display = 'block';

        // Añadir la clase al botón presionado
        boton.classList.add('btnPresionadoTablas');
        boton.classList.remove('fa-solid-Siguiente-catalogo');
    } else {
        // Si la tabla ya está visible, ocultarla y restablecer el estilo del botón
        tabla.style.display = 'none';
        boton.classList.remove('btnPresionadoTablas');
        boton.classList.add('fa-solid-Siguiente-catalogo');
    }
}


function TerminacionProyecto() {
    const datos = {};
    datos.idProyecto = datosProyecto.idProyecto;
    datos.nombre = datosProyecto.nombre;
    datos.fecha = datosProyecto.fecha;
    datos.periodo = datosProyecto.periodo;
    datos.fechaInicio = datosProyecto.fechaInicio;
    datos.fechaTermino = datosProyecto.fechaTermino;
    datos.idZona = datosProyecto.idZona;
    datos.total = totalProyecto;
    datos.estatus = 'Terminado';
    let json = JSON.stringify(datos);

    let url = "../ws/Proyecto/wsUpdProyecto.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    opcion('addProyTermFrm')
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });


}



/****
 * 
 * 
 * 
 * Llenar tablas de cosas del proyecto
 * 
 * 
 * 
 */



function getMaquinarias() {
    let datos = {};
    datos.idProyecto = datosProyecto.idProyecto
    let json = JSON.stringify(datos);
    let url = "../ws/CosasProyecto/wsGetMaquinarias.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    objMaquinarias = resp.datos;
                    llenarTablaMaquinariasProyecto();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}


function getManoObras() {
    let datos = {};
    datos.idProyecto = datosProyecto.idProyecto
    let json = JSON.stringify(datos);
    let url = "../ws/CosasProyecto/wsGetManoObras.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    objManoObra = resp.datos;
                    llenarTablaManoObraProyecto();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}


function getMaterialesSi() {
    let datos = {};
    datos.idProyecto = datosProyecto.idProyecto
    let json = JSON.stringify(datos);
    let url = "../ws/CosasProyecto/wsGetMaterialesSuministrados.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    objMaterialesSi = resp.datos;
                    llenarTablaMaterialesSi();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}


function getMaterialesNo() {
    let datos = {};
    datos.idProyecto = datosProyecto.idProyecto
    let json = JSON.stringify(datos);
    let url = "../ws/CosasProyecto/wsGetMaterialesNoSuministrados.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    objMaterialesNo = resp.datos;
                    llenarTablaMaterialesNo();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}



//***
//
//
// Llenado de tablas
//
//  */




function llenarTablaMaterialesSi() {
    let total = 0;
    const tableBody = document.getElementById("table-bodyMaterialesSuministrados");
    tableBody.innerHTML = "";
    const editedRowsArray = Object.values(objMaterialesSi);
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
    if (editedRowsArray.length > 0) {
        editedRowsArray.forEach(record => {
            const precioFormateado = record.Precio ? formatoMXN.format(record.Precio) : "---";
            let importe = record.Cantidad * record.Precio
            total += importe;
            const importeFormateado = record.Precio ? formatoMXN.format(0) : "---";
            const row = document.createElement('tr');
            row.classList.add('fila');
            // Establecer el contenido HTML de la fila
            row.innerHTML = `
                    <td class="Code">${record.Codigo}</td>
                    <td>${record.Descripcion !== "" ? record.Descripcion : "---"}</td>
                    <td>${record.Unidad !== "" ? record.Unidad : "---"}</td>
                   <td>${precioFormateado}</td>
                   <td>${record.Cantidad !== "" ? record.Cantidad : "---"}</td>
                    <td>${importeFormateado}</td>
                `;
            // Añadir eventos mouseover y mouseout
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));

            // Añadir la fila al tbody
            tableBody.appendChild(row);
        });
        let totalImporteConcepto = document.getElementById("TotalSumaMaterialesSi");
        totalImporteConcepto.innerHTML = formatoMXN.format(0);
    } else {
        const row = `
        <tr class="fila">
            <td colspan="6" class="Code">Sin resultados</td>
        </tr>
    `;
        tableBody.innerHTML += row;
    }
}


function llenarTablaMaterialesNo() {
    let total = 0;
    const tableBody = document.getElementById("table-bodyMaterialesNosuministrados");
    tableBody.innerHTML = "";
    const editedRowsArray = Object.values(objMaterialesNo);
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
    if (editedRowsArray.length > 0) {
        editedRowsArray.forEach(record => {
            const precioFormateado = record.Precio ? formatoMXN.format(record.Precio) : "---";
            let importe = record.Cantidad * record.Precio
            total += importe;
            const importeFormateado = record.Precio ? formatoMXN.format(importe) : "---";
            const row = document.createElement('tr');
            row.classList.add('fila');
            // Establecer el contenido HTML de la fila
            row.innerHTML = `
                    <td class="Code">${record.Codigo}</td>
                    <td>${record.Descripcion !== "" ? record.Descripcion : "---"}</td>
                    <td>${record.Unidad !== "" ? record.Unidad : "---"}</td>
                   <td>${precioFormateado}</td>
                   <td>${record.Cantidad !== "" ? record.Cantidad : "---"}</td>
                    <td>${importeFormateado}</td>
                `;
            // Añadir eventos mouseover y mouseout
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));

            // Añadir la fila al tbody
            tableBody.appendChild(row);
        });
        let totalImporteConcepto = document.getElementById("TotalSumaMaterialesNo");
        totalImporteConcepto.innerHTML = formatoMXN.format(total);
    } else {
        const row = `
        <tr class="fila">
            <td colspan="6" class="Code">Sin resultados</td>
        </tr>
    `;
        tableBody.innerHTML += row;
    }
}


function llenarTablaMaquinariasProyecto() {
    let total = 0;
    const tableBody = document.getElementById("table-bodyMaquinaria");
    tableBody.innerHTML = "";
    const editedRowsArray = Object.values(objMaquinarias);
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
    if (editedRowsArray.length > 0) {
        editedRowsArray.forEach(record => {
            const precioFormateado = record.PHM ? formatoMXN.format(record.PHM) : "---";
            let importe = record.RHM * record.PHM
            total += importe;
            const importeFormateado = record.PHM ? formatoMXN.format(importe) : "---";
            const row = document.createElement('tr');
            row.classList.add('fila');
            // Establecer el contenido HTML de la fila
            row.innerHTML = `
                    <td class="Code">${record.ID}</td>
                    <td>${record.Descripcion !== "" ? record.Descripcion : "---"}</td>
                    <td>${record.Unidad !== "" ? record.Unidad : "---"}</td>
                   <td>${precioFormateado}</td>
                   <td>${record.RHM !== "" ? record.RHM : "---"}</td>
                    <td>${importeFormateado}</td>
                `;
            // Añadir eventos mouseover y mouseout
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));

            // Añadir la fila al tbody
            tableBody.appendChild(row);
        });
        let totalImporteConcepto = document.getElementById("TotalSumaMaquinaria");
        totalImporteConcepto.innerHTML = formatoMXN.format(total);
    } else {
        const row = `
        <tr class="fila">
            <td colspan="6" class="Code">Sin resultados</td>
        </tr>
    `;
        tableBody.innerHTML += row;
    }
}

function llenarTablaManoObraProyecto() {
    let total = 0;
    const tableBody = document.getElementById("table-bodyManoObra");
    tableBody.innerHTML = "";
    const editedRowsArray = Object.values(objManoObra);
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
    if (editedRowsArray.length > 0) {
        editedRowsArray.forEach(record => {
            const SalarioFormateado = record.Salario ? formatoMXN.format(record.Salario) : "---";
            const SalarioRealFormateado = record.Salario_Real ? formatoMXN.format(record.Salario_Real) : "---";
            const importeFormateado = record.Importe_Total ? formatoMXN.format(record.Importe_Total) : "---";
            total += parseInt(record.Importe_Total);
            const row = document.createElement('tr');
            row.classList.add('fila');
            // Establecer el contenido HTML de la fila
            row.innerHTML = `
                    <td class="Code">${record.ID}</td>
                    <td>${record.Nombre !== "" ? record.Nombre : "---"}</td>
                    <td>${record.Unidad !== "" ? record.Unidad : "---"}</td>
                   <td>${SalarioFormateado}</td>
                   <td>${record.Cantidad_Total !== "" ? record.Cantidad_Total : "---"}</td>
                    <td>${SalarioRealFormateado}</td>
                    <td>${importeFormateado}</td>
                                
                `;
            // Añadir eventos mouseover y mouseout
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));

            // Añadir la fila al tbody
            tableBody.appendChild(row);
        });
        let totalImporteConcepto = document.getElementById("TotalSumaManoObra");
        totalImporteConcepto.innerHTML = formatoMXN.format(total);
        llenarTablaHerramientas(total);
        llenarTablaEquipo(total);
    } else {
        const row = `
        <tr class="fila">
            <td colspan="6" class="Code">Sin resultados</td>
        </tr>
    `;
        tableBody.innerHTML += row;
    }
}


function llenarTablaHerramientas(totalMano) {
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
    let precioMano = document.getElementById("ActualizarPrecioMoHerramientas");
    let importe = document.getElementById("importeHerramientas")
    let sumaImporte = document.getElementById("TotalSumaHerramientas")
    precioMano.innerHTML = formatoMXN.format(totalMano)
    let imp = totalMano * 0.03;
    importe.innerHTML = formatoMXN.format(imp)
    sumaImporte.innerHTML = formatoMXN.format(imp)
}


function llenarTablaEquipo(totalMano) {
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
    let precioMano = document.getElementById("ActualizarPrecioMoEquipo");
    let importe = document.getElementById("importeEquipo")
    let sumaImporte = document.getElementById("TotalSumaEquipo")
    precioMano.innerHTML = formatoMXN.format(totalMano)
    let imp = totalMano * 0.02;
    importe.innerHTML = formatoMXN.format(imp)
    sumaImporte.innerHTML = formatoMXN.format(imp)
}