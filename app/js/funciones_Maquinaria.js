
let msgEliminarMaqui = "Maquinaria desabilitada";
let msgActivarMaqui = "Maquinaria habilitada";
let msgAgregarMaqui = "Maquinaria agregada";
let msgModificarMaqui = "Maquinaria modificada";

//Metodo para cambiar el tamaño de los registros que se muestran
function cambiarTamanoMaquinaria() {
    const cantidad = document.getElementById("cantRegistros");
    tamanoPagina = parseInt(cantidad.value);
    paginaActual = 1;
    GetMaquinaria();
}


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


    let rhm = document.querySelector('#AddrhmInputMaquinaria');
    if (rhm.value == "") {
        rhm.classList.add("inputVacio");
        rhm.placeholder = "Requerido el rhm"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = rhm;
        }

    }

    datos.rhm = rhm.value;

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


    let rhm = document.querySelector('#UpdrhmInput');
    if (rhm.value == "") {
        rhm.classList.add("inputVacio");
        rhm.placeholder = "Requerido el rhm"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = rhm;
        }

    }

    datos.rhm = rhm.value;

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

    let url = "../ws/ManoObra/wscheckManoObra.php";
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

//Metodo para regresar una pagina en la paginacion
function paginaAnteriorMaquinaria() {
    if (paginaActual > 1) {
        paginaActual--;
        GetMaquinaria();
    }
}

//Metodo para cambiar de pagona dando clic a la paginacion
//Recobe el numero de pagina al cual se cambiara
function NoPagMaquinaria(pagi) {
    paginaActual = pagi;
    GetMaquinaria();
}

//Metodo para cambiar a la pagina siguiente en la paginacion
function paginaSiguienteMaquinaria() {
    if (paginaActual < totalPag) {
        paginaActual++;
        GetMaquinaria();
    }
}

//Metodo para hacer la consulta de los materiales tomando en cuanta los filtros
function GetMaquinaria() {
    const datos = {};
    let buscar = document.querySelector('#searchInput');
    let estatus = document.getElementById('ValCheEsta').checked;
    let unidad = document.getElementById('selectUnidad');
    datos.buscar = buscar.value;
    if (estatus) {
        datos.estatus = 1;
    } else {
        datos.estatus = 0;
    }
    datos.unidad = unidad.value;
    let json = JSON.stringify(datos);
    let url = "../ws/Maquinaria/wsGetMaquinaria.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {

                    //Llamar a la función para mostrar los datos en la tabla
                    mostrarDatosEnTablaMaquinaria(resp.datos, paginaActual, tamanoPagina);
                } else {
                    // Mostrar mensaje de error si el estado no es "OK"
                    mostrarDatosEnTablaMaquinaria(resp.mensaje, paginaActual, tamanoPagina);
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
function mostrarDatosEnTablaMaquinaria(datos, paginaActual, tamanoPagina) {
    let totalPaginas = obtenerTotalPaginas(datos.length, tamanoPagina);
    totalPag = totalPaginas;
    let tbody = document.getElementById("tabla-maquinaria").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    if (datos == "N") {
        let fila = document.createElement("tr");
        fila.innerHTML = `
        <td colspan="8">Sin resultados</td>
        `;
        tbody.appendChild(fila);

        actualizarPaginacionMaquinaria(datos, paginaActual, tamanoPagina);
        return;
    }
    let startIndex = (paginaActual - 1) * tamanoPagina;
    let endIndex = Math.min(startIndex + tamanoPagina, datos.length);
    for (let i = startIndex; i < endIndex; i++) {
        let maquinaria = datos[i];
        let fila = document.createElement("tr");
        fila.classList.add("fila")
        fila.addEventListener("mouseover", () => mostrarValores(fila));
        fila.addEventListener("mouseout", () => ocultarValores(fila));
        // Agregar las celdas a la fila
        fila.innerHTML = `
            <td class="Code">${maquinaria.idmaquinaria}</td>
            <td>${(!maquinaria.descripcion == "") ? maquinaria.descripcion : "---"}</td>
            <td>${(!maquinaria.unidad == "") ? maquinaria.unidad : "---"}</td>
            <td>${(!maquinaria.phm == "") ? maquinaria.phm : "---"}</td>
            <td>${(!maquinaria.rhm == "") ? maquinaria.rhm : "---"}</td>
            <td class="estatus">
            <div class="" style="display: flex; justify-content: space-around; align-items: center;">
                        ${maquinaria.estatus == 1 ? `<i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;"  alt="Modificar" data-bs-toggle="modal" data-bs-target="#EditarModal" onclick="llenarModalModificarMaquinaria(${maquinaria.idmaquinaria},'${maquinaria.descripcion}','${maquinaria.unidad}',${maquinaria.phm},${maquinaria.rhm})"></i>
                        `: ``}
                        ${maquinaria.estatus == 1 ?
                `<i class="coloresIcono fa-solid fa-square-check" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${maquinaria.idmaquinaria},${maquinaria.estatus})"></i>` :
                `<i class="coloresIcono fa-solid fa-square" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${maquinaria.idmaquinaria},${maquinaria.estatus})"></i>`
            }

                        </div>
                        </td>
        `;
        // Agregar la fila a la tabla
        tbody.appendChild(fila);

    }

    actualizarPaginacionMaquinaria(datos.length, paginaActual, tamanoPagina);
}
//Metodo para actualizar la paginacion, este metodo se ejecuta cuando hay nuevos datos en la tabla
//recibe la cantidad de datos, la pagina actual y el tamaño de registros a mostrar
function actualizarPaginacionMaquinaria(totalDatos, paginaActual, tamanoPagina) {
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
    liPrev.innerHTML = `<button onclick="paginaAnteriorMaquinaria()" style="background-color: #008e5a; color: #ffffff; border: 3px solid #008e5a;"><i class="fa-solid fa-angles-left"></i></button>`;
    paginationList.appendChild(liPrev);
    // Ajuste del rango para mostrar siempre 5 páginas
    let startPage = Math.max(1, paginaActual - rangoMostrar);
    let endPage = Math.min(totalPaginas, paginaActual + rangoMostrar);
    if (endPage - startPage < 4) {
        if (startPage > 1) {
            startPage = Math.max(1, endPage - 4);
        } else if (endPage < totalPaginas) {
            endPage = Math.min(totalPaginas, startPage + 4);
        }
    }
    // Generar enlaces de página
    for (let i = startPage; i <= endPage; i++) {
        let li = document.createElement("li");
        if (i === paginaActual) {
            li.classList.add("active");
            li.innerHTML = `<button class="active" style="color: #ffffff; border: 3px solid #008e5a;" onclick="NoPagMaquinaria(${i})">${i}</button>`;
        } else {
            li.innerHTML = `<button style="color: #008e5a; border: 3px solid #008e5a;" onclick="NoPag(${i})">${i}</button>`;
        }
        paginationList.appendChild(li);
    }
    let liNext = document.createElement("li");
    liNext.innerHTML = `<button onclick="paginaSiguienteMaquinaria()" style="background-color: #008e5a; color: #ffffff; border: 3px solid #008e5a;"><i class="fa-solid fa-angles-right"></i></button>`;
    paginationList.appendChild(liNext);

}

//Metodo para limpiar el modal de agregar mano de obra
function AddlimpiarModalMaquinaria() {
    let idMa = document.querySelector('#AddidInputMaquinaria');
    let descripcionMa = document.querySelector('#AdddescripcionInputMaquinaria');
    let UnidadMa = document.querySelector('#AddUnidadInputMaquinaria');
    let phm = document.querySelector('#AddphmInputMaquinaria');
    let rhm = document.querySelector('#AddrhmInputMaquinaria');



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
    } else {
        imgcheck.src = "../img/toggle_off_35px.png"
    }
}

//Metodo para que se llene el modal de modificar con los datos seleccionados de la fila
//Recibe los datos del material
function llenarModalModificarMaquinaria(id, descripcion, unidad, phM, rhM) {

    //Llenado de datos en el modal
    let idMa = document.querySelector('#UpdidInput');
    let descripcionMa = document.querySelector('#UpddescripcionInput');
    let UnidadMa = document.querySelector('#UpdUnidadInputMaquinaria');
    let phm = document.querySelector('#UpdphmInput');
    let rhm = document.querySelector('#UpdrhmInput');
    let idAnterior = document.querySelector('#UpdidAnteriorMaqui');

    idAnterior.value = id;
    idMa.value = id;
    descripcionMa.value = descripcion;
    phm.value = phM;
    rhm.value = rhM;


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
    rhm.placeholder = "";


    idMa.classList.remove("inputVacio");
    descripcionMa.classList.remove("inputVacio");
    UnidadMa.classList.remove("inputVacio");
    phm.classList.remove("inputVacio");
    rhm.classList.remove("inputVacio");
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

