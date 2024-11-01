let TipoConcepto;


var datosCatalogo = {};
let MaterialInactivo = false;

let cantidad0 = false;

let cantidadManoObra = true;
let rendimientoManoObra = true;

let RhmMquinaria = true;


///////
let objTabla2ModalMaquinariaPrincipal = [];
let objTabla2ModalManoObraiaPrincipal = [];

//Mensajes de alertas
let msgGuardarMaterialInactivo = "Material inactivo";
let msgGuardarSinCantidad = "Material sin cantidad";
let msgMaterialYaHaSidoAgregado = "Material ya ha sido agregado";
let mgsCatalogoAgregado = "Tarjeta guardada";

let filteredData2 = [...data];
let filteredDataManoObra = [...data];
let filteredDataMaquinaria = [...data];
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
    objTabla2ModalMaquinariaPrincipal = [];
    objTabla2ModalManoObraiaPrincipal = [];
    obtenerDatosTablas();
}

function obtenerDatosTablas() {
    MostrartablaMaterialesTarjeta();
    MostrartablaManoObraTarjeta();
    MostrartablaMaquinariaTarjeta();
}

function guardarTablasEnBD() {
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

    AgregartablaMaterialesTarjeta();
    AgregartablaManoObraTarjeta();
    AgregartablaMaquinariaTarjeta();
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
    actualizarSuma();
}

// Método para llenar la tabla
function displayTableMaterialesTarjetaP(page) {
    const tableBody = document.getElementById("table-bodyMaterialesTarjetaPrincipal");
    tableBody.innerHTML = "";
    const start = (page - 1) * cantidadFilasTabla;
    const end = start + cantidadFilasTabla;
    const paginatedData2 = filteredData2.slice(start, end);

    if (paginatedData2.length > 0) {
        paginatedData2.forEach((record, index) => {
            const formatoMXN = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            });

            const precioFormateado = (record.precio !== undefined && record.precio !== "")
                ? formatoMXN.format(record.precio)
                : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            if (!record.estatus) {
                const lecturaMaterial = document.querySelector('#LecturaMaterial')
                lecturaMaterial.style.display = 'flex';
                row.classList.add('materialDesabilitado')
            }
            row.innerHTML = `
                <td class="Code">${record.codigo}</td>
                <td>${record.descripcion || "---"}</td>
                <td>${record.unidad || "---"}</td>
                <td>${precioFormateado}</td>
                <td contenteditable="true" class="editable" data-index="${index}" style="background-color: ${record.cantidad > 0 ? 'transparent' : 'red'};">
                    ${record.cantidad || 0}
                </td>
                <td>
                    <div style="display: flex; justify-content: center;">
                        <input type="checkbox" class="custom-checkbox" id="checkbox_${record.codigo}" ${record.suministrado ? 'checked' : ''}>
                        <label for="checkbox_${record.codigo}" class="checkbox-design"></label>
                    </div>
                </td>
                <td class="resultado">---</td>
            `;

            // Selecciona la celda de cantidad y agrega un evento 'input' para cambiar el color
            const cantidadCell3 = row.querySelector('.editable');
            cantidadCell3.addEventListener('input', function () {
                const value = parseFloat(this.textContent);
                // Cambia el color de fondo según el valor
                this.style.backgroundColor = value > 0 ? 'transparent' : 'red';

                actualizarSuma();
            });

            // Agregar eventos para cantidad y checkbox
            const cantidadCell = row.querySelector('.editable');
            const checkbox = row.querySelector('input[type="checkbox"]');

            cantidadCell.addEventListener('input', () => {
                //Solo permitir números
                const nuevoValor = cantidadCell.innerText.replace(/[^0-9]/g, ''); // Solo números

                //Si está vacío, mostrar 0
                if (nuevoValor === "") {
                    cantidadCell.innerText = 0;
                    objTabla2Modal[index].cantidad = 0;
                    actualizarResultado(index, 0, record.precio, checkbox.checked);
                    actualizarSuma();  // Actualizar suma
                } else {
                    //Actualizar el arreglo y la celda de resultado
                    const valorNumerico = parseFloat(nuevoValor);
                    if (valorNumerico >= 0) {
                        objTabla2Modal[index].cantidad = valorNumerico;
                        actualizarResultado(index, valorNumerico, record.precio, checkbox.checked);
                        actualizarSuma();  // Actualizar suma
                        valorAnterior = valorNumerico; // Actualizar el valor anterior
                    } else {
                        // Revertir al último valor válido
                        cantidadCell.innerText = 0;
                    }
                }
            });
            // Evento para manejar la tecla de retroceso
            cantidadCell.addEventListener('keydown', (event) => {
                // Permitir retroceso
                if (event.key === "Backspace") {
                    // Si el contenido es solo un dígito, permite eliminar
                    if (cantidadCell.innerText.length === 1) {
                        cantidadCell.innerText = ""; // Elimina el último dígito
                        objTabla2Modal[index].cantidad = 0; // Restablecer cantidad en el objeto
                        actualizarResultado(index, 0, record.precio, checkbox.checked);
                        actualizarSuma();  // Actualizar suma
                    }
                }
            });

            // Evitar caracteres no numéricos
            cantidadCell.addEventListener('keypress', (event) => {
                if (!/[0-9]/.test(event.key) && event.key !== "Backspace") {
                    event.preventDefault(); // Evitar entrada de caracteres no numéricos
                }
                actualizarSuma();
            });

            checkbox.addEventListener('change', () => {
                objTabla2Modal[index].suministrado = checkbox.checked;
                const cantidad = parseFloat(cantidadCell.innerText) || 0;
                actualizarResultado(index, cantidad, record.precio, checkbox.checked);
                actualizarSuma();  // Actualizar suma
            });

            tableBody.appendChild(row);
            // Actualizar el resultado inicial
            actualizarSuma();
            actualizarResultado(index, record.cantidad, record.precio, record.suministrado);
        });
    } else {
        const row = `<tr><td colspan="8" class="Code">Sin resultados</td></tr>`;
        tableBody.innerHTML += row;
    }
}

// Función para actualizar el resultado de la multiplicación
function actualizarResultado(index, cantidad, precio, suministrado) {
    const resultadoCell = document.querySelector(`#table-bodyMaterialesTarjetaPrincipal .fila:nth-child(${index + 1}) .resultado`);
    const resultado = suministrado ? 0 : cantidad * precio;
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
    resultadoCell.innerText = formatoMXN.format(resultado);
}

function actualizarSuma() {
    const rows = document.querySelectorAll("#table-bodyMaterialesTarjetaPrincipal .fila");
    let sumaTotal = 0;

    rows.forEach(row => {
        const resultadoText = row.querySelector('.resultado').innerText;
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
    const sumaLabel = document.getElementById("Suma1");
    sumaLabel.innerText = formattedSuma;
    calcularTotal();
}

// Método para los filtros de la tabla
function filterDataMaterialesTarjetaP() {
    const unidadFilter = document.getElementById("selectUnidadMaterialesPrincipal").value;
    filteredData2 = objTabla2Modal.filter(record => {
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
        if (value === 0) {
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

            const salario = record.salario || 0;
            const precioFormateado = salario ? formatoMXN.format(salario) : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            if (!record.estatus) {
                const lecturaMaterial = document.querySelector('#LecturaManoObra');
                lecturaMaterial.style.display = 'flex';
                row.classList.add('materialDesabilitado');
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
                const item = objTabla2ModalManoObraiaPrincipal.find(obj => obj.idmanoobra === record.idmanoobra);
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
    const unidadCategoria = document.getElementById("selectCategoriaManoObraPrincipal").value;
    filteredDataManoObra = objTabla2ModalManoObraiaPrincipal.filter(record => {
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        const matchesCategoria = unidadFilter ? record.unidad == unidadCategoria : true;
        return matchesUnidad && matchesCategoria;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableManoObraTarjetaP(currentPage);
}

function llenarTablaManoObraTarjetaP() {
    displayTableManoObraTarjetaP(currentPage);
    const unidadFilter = document.getElementById("selectUnidadManoObraPrincipal");
    unidadFilter.addEventListener("change", filterDataManoObraTarjetaP);
    const unidadCategoria = document.getElementById("selectCategoriaManoObraPrincipal");
    unidadCategoria.addEventListener("change", filterDataManoObraTarjetaP);
}

function hayCantidadRendimientoManoObra() {
    const cantidadCells = document.querySelectorAll('.editable-cantidad');
    cantidadManoObra = false; // Restablece el valor a false antes de verificar
    cantidadCells.forEach(cell => {
        const value = parseFloat(cell.textContent) || 0;
        if (value === 0) {
            cantidadManoObra = true;
        }
    });
    const rendimientoCells = document.querySelectorAll('.editable-rendimiento');
    rendimientoManoObra = false; // Restablece el valor a false antes de verificar
    rendimientoCells.forEach(cell => {
        const value = parseFloat(cell.textContent) || 0;
        if (value === 0) {
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

            const phm = record.phm || 0;
            const precioFormateado = phm ? formatoMXN.format(phm) : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            if (!record.estatus) {
                const lecturaMaterial = document.querySelector('#LecturaMaquinaria');
                lecturaMaterial.style.display = 'flex';
                row.classList.add('materialDesabilitado');
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

                const item = objTabla2ModalMaquinariaPrincipal.find(obj => obj.idmaquinaria === record.idmaquinaria);

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
    const sumaLabel = document.getElementById("Suma3");
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
        if (value === 0) {
            RhmMquinaria = true;
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
    EliminartablaMaterialesTarjeta();
    objTabla2Modal.forEach(material => {
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
    EliminartablaManoObraTarjeta();
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
    EliminartablaMaquinariaTarjeta();
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
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    AddCerrarModal();
                }
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
                let resp = JSON.parse(responseText);
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
                let resp = JSON.parse(responseText);
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
    objTabla2Modal = []
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
                        objTabla2Modal.push({
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
                    console.log(objTabla2ModalMaquinariaPrincipal)
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






function calcularTotal() {

    // Obtener los elementos de los labels
    const suma1 = document.getElementById('Suma1').innerHTML;
    const suma2 = document.getElementById('Suma2').innerHTML;
    const suma3 = document.getElementById('Suma3').innerHTML;

    // Función para convertir el formato de moneda a número
    const convertirAMoneda = (valor) => {
        return parseFloat(valor.replace(/[$,]/g, '')); // Eliminar el símbolo de dólar y las comas
    }

    // Sumar las cantidades
    const total = convertirAMoneda(suma1) + convertirAMoneda(suma2) + convertirAMoneda(suma3);

    // Formatear el total como moneda
    document.getElementById('TotalSumas').innerHTML = `$${total.toFixed(2)}`;
}

function pantallaIr() {
    console.log(datosCatalogo.TipoConcepto)
    if (datosCatalogo.TipoConcepto) {
        opcion('Basicos')
    } else {
        opcion('conceptos')
    }
}