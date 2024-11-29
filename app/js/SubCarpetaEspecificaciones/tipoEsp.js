let objTabla2ModalConceptoPrincipal = [];
let conceptoInactivo = false;
let filteredDataConcepto = [...data];

let idNuevoTipoEsp;

let idTipoModificar;
function LlenarTablaConceptoEspecificacion() {

    objTabla2ModalConceptoPrincipal = [];
    LlenarCamposAgregar();
    obtenerConceptosEspecificacion();
}


function obtenerConceptosEspecificacion() {
    MostrartablaConceptoEspecificacion();
}


function guardarTipoEspEnBD() {
    EliminartablaConceptoEspecificacion();
    GetTipoEsp(seleccion.idEspecificacion);
}


function llenarTablaConceptoSeleccionadosP() {
    llenarTablaConceptoEspecificacionP();
    filterDataConceptoEspecificacionP();
}

// Método para llenar la tabla
function displayTableConceptoEspecificacionP(page) {
    conceptoInactivo = false; // Inicializar la variable
    const tableBody = document.getElementById("table-bodyConceptoEspecificacionPrincipal");
    tableBody.innerHTML = "";
    const start = (page - 1) * cantidadFilasTabla;
    const end = start + cantidadFilasTabla;
    const paginatedData2 = filteredDataConcepto.slice(start, end);
    if (paginatedData2.length > 0) {
        paginatedData2.forEach((record, index) => {
            if (!record.estatus) {
                conceptoInactivo = true; // Si hay un concepto inactivo, cambiar a true
            }

            const formatoMXN = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            });

            const precioFormateado = record.total ? formatoMXN.format(record.total) : "---";

            const row = document.createElement('tr');
            row.classList.add('fila');
            if (!record.estatus) {
                row.classList.add('DatoInactivo');
            }

            row.innerHTML = `
                  <td class="Code">${record.idconcepto}</td>
                    <td>${record.nombre !== "" ? record.nombre : "---"}</td>
                    <td>${record.unidad !== "" ? record.unidad : "---"}</td>
                    <td>${precioFormateado}</td>
            `;
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));
            tableBody.appendChild(row);
        });

        const lecturaConcepto = document.querySelector('#LecturaConcepto');
        lecturaConcepto.style.display = conceptoInactivo ? 'flex' : 'none';

    } else {
        tableBody.innerHTML += `<tr><td colspan="8" class="Code">Sin resultados</td></tr>`;
    }
}

// Método para los filtros de la tabla
function filterDataConceptoEspecificacionP() {
    const unidadFilter = document.getElementById("selectUnidadConceptoPrincipal").value;
    filteredDataConcepto = objTabla2ModalConceptoPrincipal.filter(record => {
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        return matchesUnidad;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableConceptoEspecificacionP(currentPage);
}

function llenarTablaConceptoEspecificacionP() {
    displayTableConceptoEspecificacionP(currentPage);
}

function AgregartablaConceptoEspecificacion() {
    objTabla2ModalConceptoPrincipal.forEach(concepto => {

        let nombrebtn = document.getElementById('exampleModalLabel');
        if (nombrebtn.innerHTML == "Modificar especificación") {
            concepto.idTipo = idTipoModificar;
        } else {
            concepto.idTipo = parseInt(idNuevoTipoEsp) + 1;;
        }


        let json = JSON.stringify(concepto);
        let url = "../ws/auxTipo/wsAddAuxTipo.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == "success") {
                    let resp = JSON.parse(responseText);
                    if (resp.estado == "OK") {
                        //mensajePantalla(mgsCatalogoAgregado, true);
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

function EliminartablaConceptoEspecificacion() {
    const datos = {}
    let nombrebtn = document.getElementById('exampleModalLabel');
    if (nombrebtn.innerHTML == "Modificar especificación") {
        datos.idTipo = idTipoModificar;
    } else {
        datos.idTipo = parseInt(idNuevoTipoEsp) + 1;;
    }
    let json = JSON.stringify(datos);
    let url = "../ws/auxTipo/wsDelAuxTipo.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                AgregartablaConceptoEspecificacion();
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

async function MostrartablaConceptoEspecificacion(idTipoEsp, opc) {
    const spinner = document.querySelector(".sk-circle");
    // Muestra el spinner
    spinner.style.display = "block";


    const tbody = document.getElementById('table-bodyConceptoEspecificacionPrincipal');
    tbody.innerHTML = '';
    const filaSinResultados = document.createElement('tr');
    filaSinResultados.innerHTML = '<td colspan="8" style="text-align: left;">Cargando resultados...</td>';
    tbody.appendChild(filaSinResultados);
    objTabla2ModalConceptoPrincipal = [];
    filteredDataConceptos = [];

    const datos = {}
    if (opc == 0) {
        datos.idTipo = idTipoEsp + 1;
    } else {
        datos.idTipo = idTipoEsp;
        idTipoModificar = idTipoEsp;
        try {
            // Espera a que termine `ActualizarTotalesConcepto`
            await ActualizarTotalesConcepto();
        } catch (error) {
            console.error("Error en ActualizarTotalesConcepto:", error);
            spinner.style.display = "none"; // Oculta el spinner en caso de error
            return; // Sale de la función si hay un error
        }
    }

    let json = JSON.stringify(datos);
    let url = "../ws/auxTipo/wsGetAuxTipo.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                let datosBd = resp.datos;
                if (datosBd) {
                    datosBd.forEach((datos) => {
                        objTabla2ModalConceptoPrincipal.push({
                            idtipo: datos.idtipo,
                            idespecificacion: datos.idespecificacion,
                            codigo: datos.codigo,
                            nombretipo: datos.nombretipo,
                            descripcion: datos.descripcion,
                            idconcepto: datos.idconcepto,
                            unidad: datos.unidad,
                            nombre: datos.nombre,
                            total: datos.total,
                            estatus: datos.estatus,
                        });
                    })
                } else {
                    objTabla2ModalConceptoPrincipal = [];
                    filteredDataConcepto = [];
                }
                llenarTablaConceptoSeleccionadosP();
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        } finally {
            // Oculta el spinner al finalizar
            spinner.style.display = "none";
        }
    });
}

/***
 * 
 * 
 * 
 * 
 * Metodos sobre tipo
 * 
 * 
 * 
 * 
 */


function AddTipoValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let codigo = document.querySelector('#AddidCodigoInput');
    if (codigo.value == "") {
        codigo.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = codigo;
        }
    }
    datos.codigo = codigo.value;
    let nombre = document.querySelector('#addNombreEspecificacion');
    if (nombre.value == "") {
        nombre.classList.add("inputVacio");
        nombre.placeholder = "Requerido el nombre de la especificación"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = nombre;
        }

    }
    datos.nombre = nombre.value;
    let descripcion = document.querySelector('#AddDescripcionInput');
    if (descripcion.value == "") {
        descripcion.classList.add("inputVacio");
        descripcion.placeholder = "Requerida el descripcion de la especificación"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = descripcion;
        }

    }
    datos.descripcion = descripcion.value;

    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }

    if (existe) {
        id.focus();
        return;
    }
    datos.idEspecificacion = seleccion.idEspecificacion;
    datos.idTipo = idTipoModificar;
    let nombrebtn = document.getElementById('exampleModalLabel');
    let url;
    let msg;
    if (nombrebtn.innerHTML != "Modificar especificación") {
        url = "../ws/TipoEsp/wsAddTipoEsp.php";
        msg = "Especificación agregada";
    } else {
        url = "../ws/TipoEsp/wsUpdTipoEsp.php";
        msg = "Especificación modificada";

    }
    let json = JSON.stringify(datos);
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    CerrarModalConceptoEspecificaciones();
                    guardarTipoEspEnBD();
                    mensajePantalla(msg, true);

                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function LlenarCamposAgregar() {
    let familia = document.querySelector('#addFamilia');
    familia.value = seleccion.nombreEspecificacion;
    let especificacion = document.querySelector('#addNombreEspecificacion');
    especificacion.disabled = false;
    especificacion.value = "";
    let descripcion = document.querySelector('#AddDescripcionInput');
    descripcion.disabled = false;
    descripcion.value = "";
    let nombrebtn = document.getElementById('exampleModalLabel');
    nombrebtn.innerHTML = 'Agregar especificación';


    let btnAgregar = document.getElementById('btnAgregarCon');
    btnAgregar.style.display = 'block';


    let btnGuardar = document.getElementById('btnGuardarModalTipoEsp');
    btnGuardar.innerHTML = "Guardar"
    filteredDataConcepto = [];
    objTabla2ModalConceptoPrincipal = [];
    GetTipoEspAutoincremental();
    GetIdTipoEsp();
}

function idTipoEspAutomatico(datosTipoEsp) {
    let newId;
    // Verifica si datosTipoEsp está vacío o es "0", y en ese caso inicia en "001"
    if (datosTipoEsp === "0" || datosTipoEsp.length === 0) {
        newId = "001";
    } else {
        // Extrae el último número de ID en el arreglo de datosTipoEsp
        let maxIdNumber = datosTipoEsp.reduce((max, item) => {
            if (item.codigo && !isNaN(item.codigo)) {
                // Convierte el valor de codigo a número entero
                const idNumber = parseInt(item.codigo, 10);
                return Math.max(max, idNumber);
            }
            return max;
        }, 0);

        // Incrementa el número más alto encontrado y formatea con ceros a la izquierda
        newId = String(maxIdNumber + 1).padStart(3, '0');
    }

    // Asigna el nuevo ID al input correspondiente
    let id = document.querySelector('#AddidCodigoInput');
    id.value = newId;
}


function GetTipoEspAutoincremental() {
    let datos = {};
    datos.idEspecificacion = seleccion.idEspecificacion;
    let json = JSON.stringify(datos);
    let url = "../ws/TipoEsp/wsGetTipoEsp.php";
    $.post(url, json, (responseText, status) => {
        try {

            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    datosTipoEsp = resp.datos;
                } else {
                    datosTipoEsp = "0";
                }
                idTipoEspAutomatico(datosTipoEsp);
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}

function GetIdTipoEsp() {
    let json = "";
    let url = "../ws/TipoEsp/wsGetIdTipoEsp.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    // Llamar a la función para mostrar los datos en la tabla
                    idNuevoTipoEsp = resp.datos[0].idtipo;

                } else {
                    idNuevoTipoEsp = 0;
                }
                MostrartablaConceptoEspecificacion(idNuevoTipoEsp, 0);
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}


function AbrirModalConceptoEspecificaciones() {
    let modal2 = new bootstrap.Modal(document.getElementById('AgregarModalConceptoEspecificaciones'));
    modal2.show();
}

function CerrarModalConceptoEspecificaciones() {
    $('#AgregarModalEspecificaciones').modal('hide');
}