
let filteredData = [...data];
let rowsPerPage = 10;
let currentPage = 1;
//Datos del concepto
let datosCatalogo = {};
let TipoConcepto;

// Variables donde se almacena si hay valores con 0 en las tablas
let cantidad0 = false;
let cantidadManoObra = true;
let rendimientoManoObra = true;
let RhmMquinaria = true;
let cantidadBasicos = true;

// Variables que detectan si hay un dato inactivo
let materialInactivo = false;
let maquinariaInactivo = false;
let manoObraInactivo = false;
let basicosInactivo = false;

//Objetos que guardan la info de las tablas en la bd
let objTabla2ModalMaterialesPrincipal = [];
let objTabla2ModalMaquinariaPrincipal = [];
let objTabla2ModalManoObraiaPrincipal = [];
let objTabla2ModalBasicosPrincipal = [];

//Mensajes de alertas
let msgGuardarMaterialInactivo = "Material inactivo";
let msgGuardarSinCantidad = "Material sin cantidad";
let msgMaterialYaHaSidoAgregado = "Material ya ha sido agregado";
let mgsCatalogoAgregado = "Tarjeta guardada";

//Objetos con los datos que aparecen en la bd
let filteredData2 = [...data];
let filteredDataManoObra = [...data];
let filteredDataMaquinaria = [...data];
let filteredDataBasicos = [...data];
//Metodo para llenar la tabla con el catalogo
function LlenarTablaConceptoTarjeta() {
    //Llena tabla concepto de la pagina catalogo
    let tbody = document.getElementById("tabla-conceptosCatalogo").getElementsByTagName("tbody")[0];
    let fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${datosCatalogo.id}</td> 
        <td>${datosCatalogo.nombre}</td>
         <td>${datosCatalogo.unidad}</td>
        <td>${datosCatalogo.familia}</td>`;
    tbody.appendChild(fila);

    objTabla2ModalMaterialesPrincipal = [];
    objTabla2ModalMaquinariaPrincipal = [];
    objTabla2ModalManoObraiaPrincipal = [];
    objTabla2ModalBasicosPrincipal = [];
    filteredDataManoObra = [];
    filteredDataMaquinaria = [];
    filteredDataBasicos = [];
    filteredData2 = [];
    obtenerDatosTablas();
    mostrarCosasBasicos();
}

function obtenerDatosTablas() {
    MostrartablaMaterialesTarjeta();
    MostrartablaManoObraTarjeta();
    MostrartablaMaquinariaTarjeta();
    MostrartablaBasicosTarjeta();
}

function guardarTablasEnBD() {

    //Comprueba si hay un dato inactivo en las tablas
    if (comprobarDatoInactivo()) {
        return;
    }
    hayCantidad0();
    if (cantidad0) {
        mensajePantalla("Material sin cantidad", false);
        return;
    }
    hayCantidadRendimientoManoObra();
    if (cantidadManoObra) {
        mensajePantalla("Mano de obra sin cantidad", false);
        return;
    }
    if (rendimientoManoObra) {
        mensajePantalla("Mano de obra sin rendimiento", false);
        return;
    }
    hayCantidadRendimientoMaquinaria();
    if (RhmMquinaria) {
        mensajePantalla("Maquinaria sin RhM", false);
        return;
    }
    hayCantidadBasicos();
    if (cantidadBasicos) {
        mensajePantalla("Basico sin cantidad", false);
        return;
    }

    EliminartablaMaterialesTarjeta();
    EliminartablaMaquinariaTarjeta();
    EliminartablaManoObraTarjeta();
    EliminartablaBasicosTarjeta();
    AgregarTotalConcepto();
}

function comprobarDatoInactivo() {
    if (materialInactivo) {
        mensajePantalla("Material Inactivo", false);
        return true;
    }
    if (maquinariaInactivo) {
        mensajePantalla("Maquinaria Inactiva", false);
        return true;
    }
    if (manoObraInactivo) {
        mensajePantalla("ManoObra Inactiva", false);
        return true;
    }
    if (basicosInactivo) {
        mensajePantalla("Concepto basico Inactivo", false);
        return true;
    }

}
// ----------------------------------------------------------------

/***
 * 
 * 
 *  Metodos sobre la tabla de materiales
 * 
 * 
 */
function llenarTablaMaterialesSeleccionadosP() {
    llenarTablaMaterialesTarjetaP();
    filterDataMaterialesTarjetaP();
    actualizarSumaMateriales();
}

// Método para llenar la tabla
function displayTableMaterialesTarjetaP(page) {
    materialInactivo = false; // Inicializar la variable

    const tableBody = document.getElementById("table-bodyMaterialesTarjetaPrincipal");
    tableBody.innerHTML = "";
    const start = (page - 1) * cantidadFilasTabla;
    const end = start + cantidadFilasTabla;
    const paginatedData2 = filteredData2.slice(start, end);

    if (paginatedData2.length > 0) {
        paginatedData2.forEach((record, index) => {
            if (!record.estatus) {
                materialInactivo = true; // Si hay un material inactivo, cambiar a true
            }

            const formatoMXN = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            });

            const precioFormateado = record.precio ? formatoMXN.format(record.precio) : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            if (!record.estatus) {
                row.classList.add('DatoInactivo');
            }

            row.innerHTML = `
                <td class="Code">${record.codigo}</td>
                <td>${record.descripcion || "---"}</td>
                <td>${record.unidad || "---"}</td>
                <td>${precioFormateado}</td>
                <td contenteditable="true" class="editable" style="background-color: ${record.cantidad > 0 ? 'transparent' : 'red'};">
                    ${record.cantidad || 0}
                </td>
                <td>
                    <div style="display: flex; justify-content: center;">
                        <input type="checkbox" class="custom-checkbox" id="checkbox_${record.codigo}" ${record.suministrado ? 'checked' : ''}>
                        <label for="checkbox_${record.codigo}" class="checkbox-design"></label>
                    </div>
                </td>
                <td class="resultadoMaterial">---</td>
            `;

            const cantidadCell = row.querySelector('.editable');
            const checkbox = row.querySelector('input[type="checkbox"]');
            const resultadoCell = row.querySelector('.resultadoMaterial');

            function actualizarCalculos() {
                const cantidad = parseFloat(cantidadCell.innerText) || 0;

                // Actualizar objeto correspondiente
                const item = objTabla2ModalMaterialesPrincipal.find(obj => obj.codigo == record.codigo);
                if (item) {
                    item.cantidad = cantidad;
                    item.suministrado = checkbox.checked;
                }

                // Actualizar colores y resultado
                cantidadCell.style.backgroundColor = cantidad > 0 ? 'transparent' : 'red';
                const resultado = checkbox.checked ? 0 : cantidad * record.precio;
                resultadoCell.textContent = formatoMXN.format(resultado);

                actualizarSumaMateriales();
            }

            // Eventos para cantidad
            cantidadCell.addEventListener('input', () => {
                const valor = cantidadCell.innerText;
                if (!/^\d*\.?\d*$/.test(valor)) {
                    cantidadCell.innerText = valor.slice(0, -1);
                }
                actualizarCalculos();
            });

            cantidadCell.addEventListener('blur', () => {
                const valor = parseFloat(cantidadCell.innerText);
                if (isNaN(valor) || valor < 0) {
                    cantidadCell.innerText = "0";
                }
                actualizarCalculos();
            });

            // Evento para el checkbox
            checkbox.addEventListener('change', actualizarCalculos);

            tableBody.appendChild(row);
            actualizarCalculos();
        });
        const lecturaMaterial = document.querySelector('#LecturaMaterial');
        if (materialInactivo) {
            lecturaMaterial.style.display = 'flex';
        } else {
            lecturaMaterial.style.display = 'none';
        }
    } else {
        tableBody.innerHTML += `<tr><td colspan="8" class="Code">Sin resultados</td></tr>`;
    }
}


function actualizarSumaMateriales() {
    const rows = document.querySelectorAll("#table-bodyMaterialesTarjetaPrincipal .fila");
    let sumaTotal = 0;

    rows.forEach(row => {
        const resultadoText = row.querySelector('.resultadoMaterial').innerText;
        const resultadoValue = parseFloat(resultadoText.replace(/[$,]/g, '')) || 0;
        sumaTotal += resultadoValue;
    });

    sumaTotal = Math.round(sumaTotal * 100) / 100;
    const formattedSuma = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(sumaTotal);

    document.getElementById("Suma1").innerText = formattedSuma;
    calcularTotal();
}

// Método para los filtros de la tabla
function filterDataMaterialesTarjetaP() {
    const unidadFilter = document.getElementById("selectUnidadMaterialesPrincipal").value;
    filteredData2 = objTabla2ModalMaterialesPrincipal.filter(record => {
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        return matchesUnidad;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableMaterialesTarjetaP(currentPage);
}

function llenarTablaMaterialesTarjetaP() {
    displayTableMaterialesTarjetaP(currentPage);
    const unidadFilter = document.getElementById("selectUnidadMaterialesPrincipal");
    unidadFilter.addEventListener("change", filterDataMaterialesTarjetaP);
}

function hayCantidad0() {
    const cantidadCells = document.querySelectorAll('.editable');
    cantidad0 = false; // Restablece el valor a false antes de verificar
    cantidadCells.forEach(cell => {
        const value = parseFloat(cell.textContent) || 0;
        if (value == 0) {
            cantidad0 = true;
        }
    });
}


/***
 * 
 * 
 *  Metodos sobre la tabla de mano de Obra
 * 
 * 
 */
function llenarTablaManoObraSeleccionadosP() {
    llenarTablaManoObraTarjetaP();
    filterDataManoObraTarjetaP();
    actualizarSumaManoObra();
}

// Método para llenar la tabla
function displayTableManoObraTarjetaP(page) {
    manoObraInactivo = false;
    const tableBody = document.getElementById("table-bodyManoObraTarjetaPrincipal");
    tableBody.innerHTML = "";
    const start = (page - 1) * cantidadFilasTabla;
    const end = start + cantidadFilasTabla;
    const paginatedData2 = filteredDataManoObra.slice(start, end);

    if (paginatedData2.length > 0) {
        paginatedData2.forEach((record, index) => {
            const formatoMXN = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            });

            if (!record.estatus) {
                manoObraInactivo = true; // Si hay un material inactivo, cambiar a true
            }
            const salario = record.salario || 0;
            const precioFormateado = salario ? formatoMXN.format(salario) : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            if (!record.estatus) {
                row.classList.add('DatoInactivo');
            }

            row.innerHTML = `
                <td class="Code">${record.idmanoobra}</td>
                <td>${record.categoria || "---"}</td>
                <td>${record.unidad || "---"}</td>
                <td>${precioFormateado}</td>
                <td contenteditable="true" class="editable-cantidad" style="background-color: ${record.cantidad > 0 ? 'transparent' : 'red'};">
                    ${record.cantidad || 0}
                </td>
                <td class="multiplicacion">---</td>
                <td contenteditable="true" class="editable-rendimiento" style="background-color: ${record.rendimiento > 0 ? 'transparent' : 'red'};">
                    ${record.rendimiento || 0}
                </td>
                <td class="resultadoMano">---</td>
            `;

            const cantidadCell = row.querySelector('.editable-cantidad');
            const rendimientoCell = row.querySelector('.editable-rendimiento');
            const multiplicacionCell = row.querySelector('.multiplicacion');
            const resultadoCell = row.querySelector('.resultadoMano');

            function actualizarCalculos() {
                const cantidad = parseFloat(cantidadCell.innerText) || 0;
                const rendimiento = parseFloat(rendimientoCell.innerText) || 0;

                // Actualizar arreglo de objetos
                const item = objTabla2ModalManoObraiaPrincipal.find(obj => obj.idmanoobra == record.idmanoobra);
                if (item) {
                    item.cantidad = cantidad;
                    item.rendimiento = rendimiento;
                }

                // Actualizar color de fondo basado en valor
                cantidadCell.style.backgroundColor = cantidad > 0 ? 'transparent' : 'red';
                rendimientoCell.style.backgroundColor = rendimiento > 0 ? 'transparent' : 'red';

                // Cálculo de multiplicación y resultado
                const multiplicacion = salario * cantidad;
                multiplicacionCell.textContent = formatoMXN.format(multiplicacion);
                const resultado = rendimiento > 0 ? multiplicacion / rendimiento : 0;
                resultadoCell.textContent = formatoMXN.format(resultado);
                actualizarSumaManoObra();
            }

            // Eventos para cantidad
            cantidadCell.addEventListener('input', () => {
                const valor = cantidadCell.innerText;
                if (!/^\d*\.?\d*$/.test(valor)) {
                    cantidadCell.innerText = valor.slice(0, -1);
                }
                actualizarCalculos();
            });

            cantidadCell.addEventListener('blur', () => {
                const valor = parseFloat(cantidadCell.innerText);
                if (isNaN(valor) || valor < 0) {
                    cantidadCell.innerText = "0";
                }
                actualizarCalculos();
            });

            // Eventos para rendimiento
            rendimientoCell.addEventListener('input', () => {
                const valor = rendimientoCell.innerText;
                if (!/^\d*\.?\d*$/.test(valor)) {
                    rendimientoCell.innerText = valor.slice(0, -1);
                }
                actualizarCalculos();
            });

            rendimientoCell.addEventListener('blur', () => {
                const valor = parseFloat(rendimientoCell.innerText);
                if (isNaN(valor) || valor < 0) {
                    rendimientoCell.innerText = "0";
                }
                actualizarCalculos();
            });

            tableBody.appendChild(row);
            actualizarCalculos();
        });
        const LecturaManoObra = document.querySelector('#LecturaManoObra');
        if (manoObraInactivo) {
            LecturaManoObra.style.display = 'flex';
        } else {
            LecturaManoObra.style.display = 'none';
        }
    } else {
        const row = `<tr><td colspan="8" class="Code">Sin resultados</td></tr>`;
        tableBody.innerHTML += row;
    }
}

function actualizarSumaManoObra() {
    const rows = document.querySelectorAll("#table-bodyManoObraTarjetaPrincipal .fila");
    let sumaTotal = 0;

    rows.forEach(row => {
        const resultadoText = row.querySelector('.resultadoMano').innerText;
        const resultadoValue = parseFloat(resultadoText.replace(/[$,]/g, '')) || 0; // Convertir el texto a número
        sumaTotal += resultadoValue;
    });

    // Redondear a dos decimales
    sumaTotal = Math.round(sumaTotal * 100) / 100;

    // Formatear sumaTotal como moneda
    const formattedSuma = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(sumaTotal);

    // Actualizar el label de suma con el valor formateado
    const sumaLabel = document.getElementById("Suma2");
    sumaLabel.innerText = formattedSuma;
    calcularTotal();
}

// Método para los filtros de la tabla
function filterDataManoObraTarjetaP() {
    const unidadFilter = document.getElementById("selectUnidadManoObraPrincipal").value;
    const categoriaFilter = document.getElementById("selectCategoriaManoObraPrincipal").value;
    filteredDataManoObra = objTabla2ModalManoObraiaPrincipal.filter(record => {
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        const matchesCategoria = categoriaFilter ? record.categoria == categoriaFilter : true;
        return matchesUnidad && matchesCategoria;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableManoObraTarjetaP(currentPage);
}

function llenarTablaManoObraTarjetaP() {
    displayTableManoObraTarjetaP(currentPage);
    const unidadFilter = document.getElementById("selectUnidadManoObraPrincipal");
    unidadFilter.addEventListener("change", filterDataManoObraTarjetaP);
    const categoriaFilter = document.getElementById("selectCategoriaManoObraPrincipal");
    categoriaFilter.addEventListener("change", filterDataManoObraTarjetaP);
}

function hayCantidadRendimientoManoObra() {
    const cantidadCells = document.querySelectorAll('.editable-cantidad');
    cantidadManoObra = false; // Restablece el valor a false antes de verificar
    cantidadCells.forEach(cell => {
        const value = parseFloat(cell.textContent) || 0;
        if (value == 0) {
            cantidadManoObra = true;
        }
    });
    const rendimientoCells = document.querySelectorAll('.editable-rendimiento');
    rendimientoManoObra = false; // Restablece el valor a false antes de verificar
    rendimientoCells.forEach(cell => {
        const value = parseFloat(cell.textContent) || 0;
        if (value == 0) {
            rendimientoManoObra = true;
        }
    });
}




/***
 * 
 * 
 *  Metodos sobre la tabla de Maquinaria
 * 
 * 
 */
function llenarTablaMaquinariaSeleccionadosP() {
    llenarTablaMaquinariaTarjetaP();
    filterDataMaquinariaTarjetaP();
    actualizarSumaMaquinaria();
}

// Método para llenar la tabla
function displayTableMaquinariaTarjetaP(page) {
    maquinariaInactivo = false;
    const tableBody = document.getElementById("table-bodyMaquinariaTarjetaPrincipal");
    tableBody.innerHTML = "";
    const start = (page - 1) * cantidadFilasTabla;
    const end = start + cantidadFilasTabla;
    const paginatedData2 = filteredDataMaquinaria.slice(start, end);
    if (paginatedData2.length > 0) {
        paginatedData2.forEach((record, index) => {
            const formatoMXN = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            });
            if (!record.estatus) {
                maquinariaInactivo = true;
            }
            const phm = record.phm || 0;
            const precioFormateado = phm ? formatoMXN.format(phm) : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            if (!record.estatus) {
                row.classList.add('DatoInactivo');
            }

            row.innerHTML = `
               <td class="Code">${record.idmaquinaria}</td>
                <td>${(!record.descripcion == "") ? record.descripcion : "---"}</td>
                <td>${(!record.unidad == "") ? record.unidad : "---"}</td>
                <td>${precioFormateado}</td>
                <td contenteditable="true" class="editable-Rhm" style="background-color: ${record.rhm > 0 ? 'transparent' : 'red'};">
                    ${record.rhm || 0}
                </td>
                <td class="resultadoMaqui">---</td>
            `;

            const rhmCell = row.querySelector('.editable-Rhm');
            const resultadoCellMano = row.querySelector('.resultadoMaqui');

            function actualizarCalculosMaquinaria() {
                const rhm = parseFloat(rhmCell.innerText) || 0;

                // Actualizar arreglo de objetos

                const item = objTabla2ModalMaquinariaPrincipal.find(obj => obj.idmaquinaria == record.idmaquinaria);

                if (item) {
                    item.rhm = rhm;
                }

                // Actualizar color de fondo basado en valor
                rhmCell.style.backgroundColor = rhm > 0 ? 'transparent' : 'red';


                let resultado = phm * rhm;
                resultadoCellMano.textContent = formatoMXN.format(resultado);
                actualizarSumaMaquinaria();
            }

            // Eventos para cantidad
            rhmCell.addEventListener('input', () => {
                const valor = rhmCell.innerText;
                if (!/^\d*\.?\d*$/.test(valor)) {
                    rhmCell.innerText = valor.slice(0, -1);
                }
                actualizarCalculosMaquinaria();
            });

            rhmCell.addEventListener('blur', () => {
                const valor = parseFloat(rhmCell.innerText);
                if (isNaN(valor) || valor < 0) {
                    rhmCell.innerText = "0";
                }
                actualizarCalculosMaquinaria();
            });
            tableBody.appendChild(row);
            actualizarCalculosMaquinaria();
        });
        const LecturaMaquinaria = document.querySelector('#LecturaMaquinaria');
        if (maquinariaInactivo) {
            LecturaMaquinaria.style.display = 'flex';
        } else {
            LecturaMaquinaria.style.display = 'none';
        }
    } else {
        const row = `<tr><td colspan="8" class="Code">Sin resultados</td></tr>`;
        tableBody.innerHTML += row;
    }
}

function actualizarSumaMaquinaria() {
    const rows = document.querySelectorAll("#table-bodyMaquinariaTarjetaPrincipal .fila");
    let sumaTotal = 0;

    rows.forEach(row => {
        const resultadoText = row.querySelector('.resultadoMaqui').innerText;
        const resultadoValue = parseFloat(resultadoText.replace(/[$,]/g, '')) || 0; // Convertir el texto a número
        sumaTotal += resultadoValue;
    });

    // Redondear a dos decimales
    sumaTotal = Math.round(sumaTotal * 100) / 100;

    // Formatear sumaTotal como moneda
    const formattedSuma = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(sumaTotal);

    // Actualizar el label de suma con el valor formateado
    const sumaLabel = document.getElementById("Suma4");
    sumaLabel.innerText = formattedSuma;
    calcularTotal();
}

// Método para los filtros de la tabla
function filterDataMaquinariaTarjetaP() {
    const unidadFilter = document.getElementById("selectUnidadMaquinariaPrincipal").value;

    filteredDataMaquinaria = objTabla2ModalMaquinariaPrincipal.filter(record => {
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        return matchesUnidad;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableMaquinariaTarjetaP(currentPage);
}

function llenarTablaMaquinariaTarjetaP() {
    displayTableMaquinariaTarjetaP(currentPage);
    const unidadFilter = document.getElementById("selectUnidadMaquinariaPrincipal");
    unidadFilter.addEventListener("change", filterDataMaquinariaTarjetaP);
}

function hayCantidadRendimientoMaquinaria() {
    const cantidadCells = document.querySelectorAll('.editable-Rhm');
    RhmMquinaria = false; // Restablece el valor a false antes de verificar
    cantidadCells.forEach(cell => {
        const value = parseFloat(cell.textContent) || 0;
        if (value == 0) {
            RhmMquinaria = true;
        }
    });
}


/***
 * 
 * 
 *  Metodos sobre la tabla de Basicos
 * 
 * 
 */
function llenarTablaBasicosSeleccionadosP() {
    llenarTablaBasicosTarjetaP();
    filterDataBasicosTarjetaP();
    actualizarSumaBasicos();
    llenarUnidadTablaTarjeta();
}

// Método para llenar la tabla
function displayTableBasicosTarjetaP(page) {
    basicosInactivo = false;
    const tableBody = document.getElementById("table-bodyBasicosTarjetaPrincipal");
    tableBody.innerHTML = "";
    const start = (page - 1) * cantidadFilasTabla;
    const end = start + cantidadFilasTabla;
    const paginatedData2 = filteredDataBasicos.slice(start, end);
    if (paginatedData2.length > 0) {
        paginatedData2.forEach((record, index) => {
            const formatoMXN = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            });
            if (!record.estatus) {
                basicosInactivo = true;
            }
            const total = record.total || 0;
            const precioFormateado = total ? formatoMXN.format(total) : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            if (!record.estatus) {
                row.classList.add('DatoInactivo');
            }

            row.innerHTML = `
                <td class="Code">${record.idconbasi}</td>
                <td>${record.nombre != "" ? record.nombre : "---"}</td>
                <td>${record.unidad != "" ? record.unidad : "---"}</td>
                <td>${precioFormateado}</td>
                <td contenteditable="true" class="editable-cantidadBasi" style="background-color: ${record.cantconbasi > 0 ? 'transparent' : 'red'};">
                    ${record.cantconbasi || 0}
                </td>
                <td class="resultadoBasi">---</td>
            `;

            const cantidadCell = row.querySelector('.editable-cantidadBasi');
            const resultadoCell = row.querySelector('.resultadoBasi');

            function actualizarCalculosBasicos() {
                const cantidad = parseFloat(cantidadCell.innerText) || 0;

                // Actualizar arreglo de objetos

                const item = objTabla2ModalBasicosPrincipal.find(obj => obj.idconbasi == record.idconbasi);

                if (item) {
                    item.cantconbasi = cantidad;
                }

                // Actualizar color de fondo basado en valor
                cantidadCell.style.backgroundColor = cantidad > 0 ? 'transparent' : 'red';


                let resultado = total * cantidad;
                resultadoCell.textContent = formatoMXN.format(resultado);
                actualizarSumaBasicos();
            }

            // Eventos para cantidad
            cantidadCell.addEventListener('input', () => {
                const valor = cantidadCell.innerText;
                if (!/^\d*\.?\d*$/.test(valor)) {
                    cantidadCell.innerText = valor.slice(0, -1);
                }
                actualizarCalculosBasicos();
            });

            cantidadCell.addEventListener('blur', () => {
                const valor = parseFloat(cantidadCell.innerText);
                if (isNaN(valor) || valor < 0) {
                    cantidadCell.innerText = "0";
                }
                actualizarCalculosBasicos();
            });
            tableBody.appendChild(row);
            actualizarCalculosBasicos();
        });
        const LecturaBasicos = document.querySelector('#LecturaBasicos');
        if (basicosInactivo) {
            LecturaBasicos.style.display = 'flex';
        } else {
            LecturaBasicos.style.display = 'none';
        }
    } else {
        const row = `<tr><td colspan="8" class="Code">Sin resultados</td></tr>`;
        tableBody.innerHTML += row;
    }
}

function actualizarSumaBasicos() {
    const rows = document.querySelectorAll("#table-bodyBasicosTarjetaPrincipal .fila");
    let sumaTotal = 0;

    rows.forEach(row => {
        const resultadoText = row.querySelector('.resultadoBasi').innerText;
        const resultadoValue = parseFloat(resultadoText.replace(/[$,]/g, '')) || 0; // Convertir el texto a número
        sumaTotal += resultadoValue;
    });

    // Redondear a dos decimales
    sumaTotal = Math.round(sumaTotal * 100) / 100;

    // Formatear sumaTotal como moneda
    const formattedSuma = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(sumaTotal);

    // Actualizar el label de suma con el valor formateado
    const sumaLabel = document.getElementById("Suma5");
    sumaLabel.innerText = formattedSuma;
    calcularTotal();
}

// Método para los filtros de la tabla
function filterDataBasicosTarjetaP() {
    const unidadFilter = document.getElementById("selectUnidadBasicosPrincipal").value;
    filteredDataBasicos = objTabla2ModalBasicosPrincipal.filter(record => {
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        return matchesUnidad;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableBasicosTarjetaP(currentPage);
}

function llenarTablaBasicosTarjetaP() {
    displayTableBasicosTarjetaP(currentPage);
    const unidadFilter = document.getElementById("selectUnidadBasicosPrincipal");
    unidadFilter.addEventListener("change", filterDataBasicosTarjetaP);
}

function hayCantidadBasicos() {
    const cantidadCells = document.querySelectorAll('.editable-cantidadBasi');
    cantidadBasicos = false; // Restablece el valor a false antes de verificar
    cantidadCells.forEach(cell => {
        const value = parseFloat(cell.textContent) || 0;
        if (value == 0) {
            cantidadBasicos = true;
        }
    });
}
/***
 * 
 * 
 * Agregando nuevos datos a las tablas
 * 
 * 
 * 
 * 
*/
function AgregartablaMaterialesTarjeta() {
    objTabla2ModalMaterialesPrincipal.forEach(material => {
        material.idConcepto = datosCatalogo.id
        if (material.fechaprecio == null) {
            material.fechaprecio = "2024-10-30"
        }
        if (material.suministrado == true) {
            material.suministrado = 1;
        } else {
            material.suministrado = 0;
        }
        let json = JSON.stringify(material);
        let url = "../ws/TarjetaMateriales/wsAddMaterialesTarjeta.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == "success") {
                    let resp = JSON.parse(responseText);
                    if (resp.estado == "OK") {
                        mensajePantalla(mgsCatalogoAgregado, true);
                    }
                } else {
                    throw e = status;
                }
            } catch (error) {
                alert("Error: " + error)
            }
        });
    })
}

function AgregartablaManoObraTarjeta() {
    objTabla2ModalManoObraiaPrincipal.forEach(manoObra => {
        manoObra.idConcepto = datosCatalogo.id
        if (manoObra.fechasalario == null) {
            manoObra.fechasalario = "2024-10-30"
        } else if (manoObra.fechasalario == "0000-00-00") {
            manoObra.fechasalario = "2024-10-30"
        }
        let json = JSON.stringify(manoObra);
        let url = "../ws/TarjetaManoObra/wsAddManoObraTarjeta.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == "success") {
                    let resp = JSON.parse(responseText);
                    if (resp.estado == "OK") {
                        mensajePantalla(mgsCatalogoAgregado, true);
                    }
                } else {
                    throw e = status;
                }
            } catch (error) {
                alert("Error: " + error)
            }
        });
    })
}

function AgregartablaMaquinariaTarjeta() {
    objTabla2ModalMaquinariaPrincipal.forEach(maquinaria => {
        maquinaria.idConcepto = datosCatalogo.id
        if (maquinaria.fechaprecio == null) {
            maquinaria.fechaprecio = "2024-10-30"
        } else if (maquinaria.fechaprecio == "0000-00-00") {
            maquinaria.fechaprecio = "2024-10-30"
        }
        let json = JSON.stringify(maquinaria);
        let url = "../ws/TarjetaMaquinaria/wsAddMaquinariaTarjeta.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == "success") {
                    let resp = JSON.parse(responseText);

                } else {
                    throw e = status;
                }
            } catch (error) {
                alert("Error: " + error)
            }
        });
    })
}

function AgregartablaBasicosTarjeta() {
    objTabla2ModalBasicosPrincipal.forEach(basicos => {
        basicos.idConcepto = datosCatalogo.id
        let json = JSON.stringify(basicos);
        let url = "../ws/TarjetaBasicos/wsAddBasicosTarjeta.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == "success") {
                    let resp = JSON.parse(responseText);
                    console.log(resp)
                } else {
                    throw e = status;
                }
            } catch (error) {
                alert("Error: " + error)
            }
        });
    })
}


/***
 * 
 * 
 * Borrando datos de tablas anteriores
 * 
 * 
 * 
 * 
*/
function EliminartablaMaterialesTarjeta() {
    const datos = {}
    datos.idConcepto = datosCatalogo.id;
    let json = JSON.stringify(datos);
    let url = "../ws/TarjetaMateriales/wsDelMaterialesTarjeta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                AgregartablaMaterialesTarjeta();
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function EliminartablaManoObraTarjeta() {
    const datos = {}
    datos.idConcepto = datosCatalogo.id;
    let json = JSON.stringify(datos);
    let url = "../ws/TarjetaManoObra/wsDelManoObraTarjeta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                AgregartablaManoObraTarjeta();
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function EliminartablaMaquinariaTarjeta() {
    const datos = {}
    datos.idConcepto = datosCatalogo.id;
    let json = JSON.stringify(datos);
    let url = "../ws/TarjetaMaquinaria/wsDelMaquinariaTarjeta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                AgregartablaMaquinariaTarjeta();
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function EliminartablaBasicosTarjeta() {
    const datos = {}
    datos.idConcepto = datosCatalogo.id;
    let json = JSON.stringify(datos);
    let url = "../ws/TarjetaBasicos/wsDelBasicosTarjeta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                AgregartablaBasicosTarjeta();
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

/***
 * 
 * 
 * Mostrar tablas del concepto
 * 
 * 
 * 
 * 
*/

function MostrartablaMaterialesTarjeta() {
    objTabla2ModalMaterialesPrincipal = []
    const datos = {}
    datos.idConcepto = datosCatalogo.id;
    let json = JSON.stringify(datos);
    let url = "../ws/TarjetaMateriales/wsGetMaterialesTarjeta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                let datosBd = resp.datos;
                if (datosBd) {
                    datosBd.forEach((datos) => {
                        objTabla2ModalMaterialesPrincipal.push({
                            codigo: datos.codigo,
                            norma: datos.norma,
                            descripcion: datos.descripcion,
                            precio: datos.precio,
                            fechaprecio: datos.fechaprecio,
                            unidad: datos.unidad,
                            cantidad: datos.cantmaterial,
                            suministrado: datos.suministrado,
                            estatus: datos.estatus
                        });
                    })
                    llenarTablaMaterialesSeleccionadosP();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function MostrartablaManoObraTarjeta() {
    objTabla2ModalManoObraiaPrincipal = []
    const datos = {}
    datos.idConcepto = datosCatalogo.id;
    let json = JSON.stringify(datos);
    let url = "../ws/TarjetaManoObra/wsGetManoObraTarjeta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                let datosBd = resp.datos;
                if (datosBd) {
                    datosBd.forEach((datos) => {
                        objTabla2ModalManoObraiaPrincipal.push({
                            idmanoobra: datos.idmanoobra,
                            salario: datos.salario,
                            fechasalario: datos.fechasalario,
                            unidad: datos.unidad,
                            categoria: datos.categoria,
                            cantidad: datos.cantmanoobra,
                            rendimiento: datos.rendimiento,
                            estatus: datos.estatus,
                        });
                    })
                    llenarTablaManoObraSeleccionadosP();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function MostrartablaMaquinariaTarjeta() {
    objTabla2ModalMaquinariaPrincipal = []
    const datos = {};
    datos.idConcepto = datosCatalogo.id;
    let json = JSON.stringify(datos);
    let url = "../ws/TarjetaMaquinaria/wsGetMaquinariaTarjeta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                let datosBd = resp.datos;
                if (datosBd) {
                    datosBd.forEach((datos) => {
                        objTabla2ModalMaquinariaPrincipal.push({
                            idmaquinaria: datos.idmaquinaria,
                            descripcion: datos.descripcion,
                            phm: datos.phm,
                            rhm: datos.rhm,
                            fechaprecio: datos.fechaprecio,
                            unidad: datos.unidad,
                            estatus: datos.estatus,
                        });
                    })
                    llenarTablaMaquinariaSeleccionadosP();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function MostrartablaBasicosTarjeta() {
    objTabla2ModalBasicosPrincipal = []
    const datos = {};
    datos.idConcepto = datosCatalogo.id;
    let json = JSON.stringify(datos);
    let url = "../ws/TarjetaBasicos/wsGetBasicosTarjeta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                let datosBd = resp.datos;
                console.log(datosBd)
                if (datosBd) {
                    datosBd.forEach((datos) => {
                        objTabla2ModalBasicosPrincipal.push({
                            idconbasi: datos.idconbasi,
                            nombre: datos.nombre,
                            cantconbasi: datos.cantconbasi,
                            total: datos.total,
                            unidad: datos.unidad,
                            estatus: datos.estatus
                        });
                    })
                    llenarTablaBasicosSeleccionadosP();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}


/***
 * 
 * 
 * Agregar el total al concepto
 * 
 * 
 * 
 * 
*/
function AgregarTotalConcepto() {
    let datos = {}
    datos = datosCatalogo;
    datos.idAnterior = datosCatalogo.id;
    const total = document.getElementById('TotalSumas').innerHTML;
    const convertirAMoneda = (valor) => {
        return parseFloat(valor.replace(/[$,]/g, '')); // Eliminar el símbolo de dólar y las comas
    }
    let totalConcepto = convertirAMoneda(total)
    datos.total = totalConcepto;
    let json = JSON.stringify(datos);
    let url = "";
    if (datosCatalogo.TipoConcepto) {
        url = "../ws/ConceptosBasicos/wsUpdConceptoBasico.php";
    } else {
        url = "../ws/Conceptos/wsUpdConcepto.php";
    }


    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    mensajePantalla(mgsCatalogoAgregado, true);
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });

}

function calcularTotal() {

    // Obtener los elementos de los labels
    const suma1 = document.getElementById('Suma1').innerHTML;
    const suma2 = document.getElementById('Suma2').innerHTML;
    const suma3 = document.getElementById('Suma3').innerHTML;
    const suma4 = document.getElementById('Suma4').innerHTML;
    const suma5 = document.getElementById('Suma5').innerHTML;
    // Función para convertir el formato de moneda a número
    const convertirAMoneda = (valor) => {
        return parseFloat(valor.replace(/[$,]/g, '')); // Eliminar el símbolo de dólar y las comas
    }

    // Sumar las cantidades
    const total = convertirAMoneda(suma1) + convertirAMoneda(suma2) + convertirAMoneda(suma3) + convertirAMoneda(suma4) + convertirAMoneda(suma5);

    // Formatear el total como moneda
    document.getElementById('TotalSumas').innerHTML = `$${total.toFixed(2)}`;
}

function pantallaIr() {
    if (datosCatalogo.TipoConcepto) {
        opcion('Basicos')
    } else {
        opcion('conceptos')
    }
}

function mostrarCosasBasicos() {

    if (!datosCatalogo.TipoConcepto) {
        const total = document.getElementById('TotalAgregarBasicos');
        const tabla = document.getElementById('tablaAgregarBasicos');
        const btn = document.getElementById('btnAgregarBasicos');

        total.style.display = 'block';
        tabla.style.display = 'block';
        btn.style.display = 'block';
    } else {
        basicosInactivo = false;
    }
}


function llenarUnidadTablaTarjeta() {
    const unidadFilter = document.getElementById("selectUnidadBasicosPrincipal"); // El select donde agregarás las opciones
    let json = "";
    let url = "../ws/ConceptosBasicos/wsGetUnidadesBasico.php";

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