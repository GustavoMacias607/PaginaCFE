function incioConcepto() {
    setTimeout(() => {
        cambiarTamanoConcepto();
        existe = false
    }, 800);
}

let msgEliminarCon = "Concepto eliminado";
let msgActivarCon = "Concepto activado";
let msgAgregarCon = "Concepto agregado";
let msgModificarCon = "Concepto modificado";

//Metodo para cambiar el tamaño de los registros que se muestran
function cambiarTamanoConcepto() {
    const cantidad = document.getElementById("cantRegistros");
    tamanoPagina = parseInt(cantidad.value);
    paginaActual = 1;
    GetConcepto();
}


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
    let tipo = document.querySelector('#AddtipoInputConcepto');
    if (tipo.value == "") {
        tipo.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = tipo;
        }
    }
    datos.tipo = tipo.value;

    let plazo = document.querySelector('#AddplazoInputConcepto');
    if (plazo.value == "") {
        plazo.classList.add("inputVacio");
        plazo.placeholder = "Requerido el plazo"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = plazo;
        }
    }
    datos.plazo = plazo.value;

    let unidad = document.querySelector('#AddunidadInputConcepto');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }

    }
    datos.unidad = unidad.value;
    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }
    let json = JSON.stringify(datos);
    checkConcepto("Add");
    if (existe) {
        id.focus();
        return;
    }
    let url = "../ws/Conceptos/wsAddConcepto.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    AddCerrarModal();
                    GetConcepto();
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
    let tipo = document.querySelector('#UpdTipoInput');
    if (tipo.value == "") {
        tipo.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = tipo;
        }
    }
    datos.tipo = tipo.value;

    let plazo = document.querySelector('#UpdPlazoInput');
    if (plazo.value == "") {
        plazo.classList.add("inputVacio");
        plazo.placeholder = "Requerido el plazo"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = plazo;
        }
    }
    datos.plazo = plazo.value;

    let unidad = document.querySelector('#UpdunidadInput');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }

    }
    datos.unidad = unidad.value;
    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }
    checkConcepto("Upd");
    if (existe) {
        id.focus();
        return;
    }
    let json = JSON.stringify(datos);
    let url = "../ws/Conceptos/wsUpdConcepto.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    UpdateCerrarModal();
                    mensajePantalla(msgModificarCon, true);
                    GetConcepto();
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
            let url = "../ws/Conceptos/wsCambiarStatus.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        mensajePantalla(msgActivarCon, true)
                        paginaActual = 1;
                        GetConcepto();
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
            let url = "../ws/Conceptos/wsCambiarStatus.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        GetConcepto();
                        paginaActual = 1;
                        mensajePantalla(msgEliminarCon, true)
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

//Metodo para regresar una pagina en la paginacion
function paginaAnteriorConcepto() {
    if (paginaActual > 1) {
        paginaActual--;
        GetConcepto();
    }
}

//Metodo para cambiar de pagona dando clic a la paginacion
//Recobe el numero de pagina al cual se cambiara
function NoPagConcepto(pagi) {
    paginaActual = pagi;
    GetConcepto();
}

//Metodo para cambiar a la pagina siguiente en la paginacion
function paginaSiguienteConcepto() {
    if (paginaActual < totalPag) {
        paginaActual++;
        GetConcepto();
    }
}

//Metodo para hacer la consulta de los materiales tomando en cuanta los filtros
function GetConcepto() {
    const datos = {};
    let buscar = document.querySelector('#searchInput');
    let estatus = document.getElementById('ValCheEsta').checked;
    let unidad = document.getElementById('selectUnidad');
    let tipo = document.getElementById('selectTipo');
    datos.buscar = buscar.value;
    if (estatus) {
        datos.estatus = 1;
    } else {
        datos.estatus = 0;
    }
    datos.unidad = unidad.value;
    datos.tipo = tipo.value;
    let json = JSON.stringify(datos);
    let url = "../ws/Conceptos/wsGetConcepto.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    //Llamar a la función para mostrar los datos en la tabla
                    mostrarDatosEnTablaConcepto(resp.datos, paginaActual, tamanoPagina);
                } else {
                    // Mostrar mensaje de error si el estado no es "OK"
                    mostrarDatosEnTablaConcepto(resp.mensaje, paginaActual, tamanoPagina);
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}
// metodo para mostrar los datos en la tabla con los datos que salieron de la consulta
//recibe los datos, la pagina actual y el tamaño de los registros que hay que mostrar a la vez
function mostrarDatosEnTablaConcepto(datos, paginaActual, tamanoPagina) {
    let totalPaginas = obtenerTotalPaginas(datos.length, tamanoPagina);
    totalPag = totalPaginas;
    let tbody = document.getElementById("tabla-conceptos").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    if (datos == "N") {
        let fila = document.createElement("tr");
        fila.innerHTML = `
        <td colspan="8">Sin resultados</td>
        `;
        tbody.appendChild(fila);

        actualizarPaginacionConcepto(datos, paginaActual, tamanoPagina);
        return;
    }
    let startIndex = (paginaActual - 1) * tamanoPagina;
    let endIndex = Math.min(startIndex + tamanoPagina, datos.length);
    for (let i = startIndex; i < endIndex; i++) {
        let concepto = datos[i];
        let fila = document.createElement("tr");
        fila.classList.add("fila")
        fila.addEventListener("mouseover", () => mostrarValores(fila));
        fila.addEventListener("mouseout", () => ocultarValores(fila));
        // Agregar las celdas a la fila
        fila.innerHTML = `
            <td class="Code">${concepto.idconcepto}</td>
            <td>${(!concepto.nombre == "") ? concepto.nombre : "---"}</td>
            <td>${(!concepto.tipo == "") ? concepto.tipo : "---"}</td>
            <td>${(!concepto.plazo == "") ? concepto.plazo : "---"}</td>
            <td>${(!concepto.unidad == "") ? concepto.unidad : "---"}</td>
            <td class="estatus">
                <div class="" style="display: flex; justify-content: space-around; align-items: center;">
                ${concepto.estatus == 1 ? `<i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;"  alt="Modificar" data-bs-toggle="modal" data-bs-target="#EditarModal" onclick="llenarModalModificarConcepto(${concepto.idconcepto},'${concepto.nombre}','${concepto.tipo}',${concepto.plazo},'${concepto.unidad}')"></i>
                `: ``}
                ${concepto.estatus == 1 ?
                `<i class="coloresIcono fa-solid fa-square-check" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${concepto.idconcepto},${concepto.estatus})"></i>` :
                `<i class="coloresIcono fa-solid fa-square" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${concepto.idconcepto},${concepto.estatus})"></i>`
            }
                   
                </div>
            </td>   
        `;
        // Agregar la fila a la tabla
        tbody.appendChild(fila);

    }

    actualizarPaginacionConcepto(datos.length, paginaActual, tamanoPagina);
}
//Metodo para actualizar la paginacion, este metodo se ejecuta cuando hay nuevos datos en la tabla
//recibe la cantidad de datos, la pagina actual y el tamaño de registros a mostrar
function actualizarPaginacionConcepto(totalDatos, paginaActual, tamanoPagina) {
    if (totalDatos == "N") {
        let paginationList = document.getElementById("pagination-list");
        paginationList.innerHTML = "";
        return;
    }
    let paginationList = document.getElementById("pagination-list");
    paginationList.innerHTML = "";
    let totalPaginas = Math.ceil(totalDatos / tamanoPagina);
    let rangoMostrar = 2; //Rango a mostrar de numeros de pagina
    let liPrev = document.createElement("li");
    liPrev.innerHTML = `<button onclick="paginaAnteriorConcepto()" style="background-color: #008e5a; color: #ffffff; border: 3px solid #008e5a;"><i class="fa-solid fa-angles-left"></i></button>`;
    paginationList.appendChild(liPrev);
    // Generar enlaces de página
    for (let i = Math.max(1, paginaActual - rangoMostrar); i <= Math.min(totalPaginas, paginaActual + rangoMostrar); i++) {
        let li = document.createElement("li");
        if (i === paginaActual) {
            li.classList.add("active");
        }
        li.innerHTML = `<button style="color: #008e5a; border: 3px solid #008e5a;" onclick="NoPagConcepto(${i})">${i}</button>`;
        if (i === paginaActual) {
            li.innerHTML = `<button class="active" style="color: #ffffff; border: 3px solid #008e5a;" onclick="NoPagConcepto(${i})">${i}</button>`;
        }
        paginationList.appendChild(li);
    }
    let liNext = document.createElement("li");
    liNext.innerHTML = `<button onclick="paginaSiguienteConcepto()" style="background-color: #008e5a; color: #ffffff; border: 3px solid #008e5a;"><i class="fa-solid fa-angles-right"></i></button>`;
    paginationList.appendChild(liNext);

}

//Metodo para limpiar el modal de agregar material
function AddlimpiarModalConcepto() {
    let idC = document.querySelector('#AddidInputConcepto');
    let nombreC = document.querySelector('#AddnombreInputConcepto');
    let tipoC = document.querySelector('#AddtipoInputConcepto');
    let plazoC = document.querySelector('#AddplazoInputConcepto');
    let unidadC = document.querySelector('#AddunidadInputConcepto');


    idC.value = "";
    nombreC.value = "";
    tipoC.value = "";
    plazoC.value = "";
    unidadC.value = "";

    nombreC.placeholder = "";
    idC.placeholder = "";
    plazoC.placeholder = "";

    idC.classList.remove("inputVacio");
    nombreC.classList.remove("inputVacio");
    tipoC.classList.remove("inputVacio");
    plazoC.classList.remove("inputVacio");
    unidadC.classList.remove("inputVacio");
}

//Metodo para cambiar la imagen del toggle a la hora de darle clic para cambiar entre materiales activos e inactivos
function valStatusConcepto() {
    var checkbox = document.getElementById('ValCheEsta');
    var imgcheck = document.getElementById('ValEstatus');
    // Deseleccionar el checkbox
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        imgcheck.src = "../img/toggle_on_35px.png"
    } else {
        imgcheck.src = "../img/toggle_off_35px.png"
    }
}

//Metodo para que se llene el modal de modificar con los datos seleccionados de la fila
//Recibe los datos del material
function llenarModalModificarConcepto(id, nombre, tipo, plazo, unidad) {

    //Llenado de datos en el modal
    let idC = document.querySelector('#UpdidInput');
    let nombreC = document.querySelector('#UpdnombreInput');
    let tipoC = document.querySelector('#UpdTipoInput');
    let plazoC = document.querySelector('#UpdPlazoInput');
    let unidadC = document.querySelector('#UpdunidadInput');
    let idAnterior = document.querySelector('#UpdidAnterior');
    idAnterior.value = id;
    idC.value = id;
    nombreC.value = nombre;
    plazoC.value = plazo;

    //llenar el select de tipo
    for (var i = 0; i < tipoC.options.length; i++) {
        if (tipoC.options[i].value === tipo) {
            tipoC.options[i].selected = true;
            break;
        }
    }
    //llenar el select de unidad
    for (var i = 0; i < unidadC.options.length; i++) {
        if (unidadC.options[i].value === unidad) {
            unidadC.options[i].selected = true;
            break;
        }
    }


    nombreC.placeholder = "";
    idC.placeholder = "";
    plazoC.placeholder = "";


    idC.classList.remove("inputVacio");
    nombreC.classList.remove("inputVacio");
    tipoC.classList.remove("inputVacio");
    plazoC.classList.remove("inputVacio");
    unidadC.classList.remove("inputVacio");
}

//Metodo para cerrar el modal de agregar material
function AddCerrarModal() {
    $('#AgregarModal').modal('hide');
}
//Metodo para cerrar el modal de modificar material
function UpdateCerrarModal() {

    $('#EditarModal').modal('hide');
}
function ActivarCerrarModal() {

    $('#confirmActivationModal').modal('hide');
}
function EliminarCerrarModal() {

    $('#confirmAdditionalModal').modal('hide');
}

function AbrirModalConfirm() {
    $('#confirmAdditionalModal').modal('show');
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

