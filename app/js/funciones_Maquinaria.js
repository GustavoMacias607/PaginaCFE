function incioMaquinaria() {
    setTimeout(() => {
        cambiarMaquinaria();
        existe = false
    }, 800);
}

let msgEliminarMaqui = "Maquinaria desabilitada";
let msgActivarMaqui = "Maquinaria activada";
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
                    //GetMaquinaria();
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
    let idAnterior = document.querySelector('#UpdidAnteriorMano');
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
    let categoria = document.querySelector('#UpdCategoriaInputManodeobra');
    if (categoria.value == "") {
        categoria.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = categoria;
        }

    }
    datos.categoria = categoria.value;
    let unidad = document.querySelector('#updUnidadInputManodeobra');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }
    }
    datos.unidad = unidad.value;

    let salario = document.querySelector('#UpdsalarioInput');
    if (salario.value == "") {
        salario.classList.add("inputVacio");
        salario.placeholder = "Requerido el salario"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = salario;
        }
    }
    datos.salario = salario.value;

    let cantidad = document.querySelector('#UpdcantidadInput');
    if (cantidad.value == "") {
        cantidad.classList.add("inputVacio");
        cantidad.placeholder = "Requerida la cantidad"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = cantidad;
        }

    }
    datos.cantidad = cantidad.value;
    let rendimiento = document.querySelector('#UpdrendimientoInput');
    if (rendimiento.value == "") {
        rendimiento.classList.add("inputVacio");
        rendimiento.placeholder = "Requerido el rendimiento"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = rendimiento;
        }

    }

    datos.rendimiento = rendimiento.value;
    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }
    checkMaquinaria("Upd");
    if (existe) {
        id.focus();
        return;
    }
    let json = JSON.stringify(datos);
    console.log(json);
    let url = "../ws/ManoObra/wsUpdManoObra.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp);
                if (resp.estado == "OK") {
                    UpdateCerrarModal();
                    mensajePantalla(msgModificarCon, true);
                    GetManoObra();
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
        var idVali = document.querySelector('#AddidInputManodeobra');
    } else {
        var idVali = document.querySelector('#UpdidInput');
        let idAnterior = document.querySelector('#UpdidAnteriorMano');
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
                        //GetManoObra();
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
                        //GetManoObra();
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
function NoPagManoObra(pagi) {
    paginaActual = pagi;
    GetMaquinaria();
}

//Metodo para cambiar a la pagina siguiente en la paginacion
function paginaSiguienteManoObra() {
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
    let categoria = document.getElementById('selectCategoria');
    datos.buscar = buscar.value;
    if (estatus) {
        datos.estatus = 1;
    } else {
        datos.estatus = 0;
    }
    datos.unidad = unidad.value;
    datos.categoria = categoria.value;
    let json = JSON.stringify(datos);
    let url = "../ws/ManoObra/wsGetManoObra.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {

                    //Llamar a la función para mostrar los datos en la tabla
                    mostrarDatosEnTablaManoObra(resp.datos, paginaActual, tamanoPagina);
                } else {
                    // Mostrar mensaje de error si el estado no es "OK"
                    mostrarDatosEnTablaManoObra(resp.mensaje, paginaActual, tamanoPagina);
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
    let tbody = document.getElementById("tabla-manodeobra").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    if (datos == "N") {
        let fila = document.createElement("tr");
        fila.innerHTML = `
        <td colspan="8">Sin resultados</td>
        `;
        tbody.appendChild(fila);

        actualizarPaginacionManoObra(datos, paginaActual, tamanoPagina);
        return;
    }
    let startIndex = (paginaActual - 1) * tamanoPagina;
    let endIndex = Math.min(startIndex + tamanoPagina, datos.length);
    for (let i = startIndex; i < endIndex; i++) {
        let manoObra = datos[i];
        let fila = document.createElement("tr");
        fila.classList.add("fila")
        fila.addEventListener("mouseover", () => mostrarValores(fila));
        fila.addEventListener("mouseout", () => ocultarValores(fila));
        // Agregar las celdas a la fila
        fila.innerHTML = `
            <td class="Code">${manoObra.idmanoobra}</td>
            <td>${(!manoObra.categoria == "") ? manoObra.categoria : "---"}</td>
            <td>${(!manoObra.unidad == "") ? manoObra.unidad : "---"}</td>
            <td>${(!manoObra.salario == "") ? manoObra.salario : "---"}</td>
            <td>${(!manoObra.cantidad == "") ? manoObra.cantidad : "---"}</td>
            <td>${(!manoObra.rendimiento == "") ? manoObra.rendimiento : "---"}</td>
            <td class="estatus">
            <div class="" style="display: flex; justify-content: space-around; align-items: center;">
                        ${manoObra.estatus == 1 ? `<i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;"  alt="Modificar" data-bs-toggle="modal" data-bs-target="#EditarModal" onclick="llenarModalModificarManoObra(${manoObra.idmanoobra},'${manoObra.categoria}','${manoObra.unidad}',${manoObra.salario},${manoObra.cantidad},${manoObra.rendimiento})"></i>
                        `: ``}
                        ${manoObra.estatus == 1 ?
                `<i class="coloresIcono fa-solid fa-square-check" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${manoObra.idmanoobra},${manoObra.estatus})"></i>` :
                `<i class="coloresIcono fa-solid fa-square" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${manoObra.idmanoobra},${manoObra.estatus})"></i>`
            }

                        </div>
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
    liPrev.innerHTML = `<button onclick="paginaAnteriorManoObra()" style="background-color: #008e5a; color: #ffffff; border: 3px solid #008e5a;"><i class="fa-solid fa-angles-left"></i></button>`;
    paginationList.appendChild(liPrev);
    // Generar enlaces de página
    for (let i = Math.max(1, paginaActual - rangoMostrar); i <= Math.min(totalPaginas, paginaActual + rangoMostrar); i++) {
        let li = document.createElement("li");
        if (i === paginaActual) {
            li.classList.add("active");
        }
        li.innerHTML = `<button style="color: #008e5a; border: 3px solid #008e5a;" onclick="NoPagManoObra(${i})">${i}</button>`;
        if (i === paginaActual) {
            li.innerHTML = `<button class="active" style="color: #ffffff; border: 3px solid #008e5a;" onclick="NoPagManoObra(${i})">${i}</button>`;
        }
        paginationList.appendChild(li);
    }
    let liNext = document.createElement("li");
    liNext.innerHTML = `<button onclick="paginaSiguienteManoObra()" style="background-color: #008e5a; color: #ffffff; border: 3px solid #008e5a;"><i class="fa-solid fa-angles-right"></i></button>`;
    paginationList.appendChild(liNext);

}

//Metodo para limpiar el modal de agregar mano de obra
function AddlimpiarModalMaquinaria() {
    let idMO = document.querySelector('#AddidInputManodeobra');
    let categoriaMO = document.querySelector('#AddCategoriaInputManodeobra');
    let UnidadMO = document.querySelector('#AddUnidadInputManodeobra');
    let salarioMO = document.querySelector('#AddsalarioInputManodeobra');
    let cantidadMo = document.querySelector('#AddcantidadInputManodeobra');
    let rendimientoMo = document.querySelector('#AddrendimientoInputManodeobra');


    idMO.value = "";
    categoriaMO.value = "";
    UnidadMO.value = "";
    salarioMO.value = "";
    cantidadMo.value = "";
    rendimientoMo.value = "";

    idMO.placeholder = "";
    salarioMO.placeholder = "";
    cantidadMo.placeholder = "";
    rendimientoMo.placeholder = "";

    idMO.classList.remove("inputVacio");
    categoriaMO.classList.remove("inputVacio");
    UnidadMO.classList.remove("inputVacio");
    salarioMO.classList.remove("inputVacio");
    cantidadMo.classList.remove("inputVacio");
    rendimientoMo.classList.remove("inputVacio");
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
function llenarModalModificarMaquinaria(id, categoria, unidad, salario, cantidad, rendimiento) {

    //Llenado de datos en el modal
    let idMO = document.querySelector('#UpdidInput');
    let categoriaMO = document.querySelector('#UpdCategoriaInputManodeobra');
    let UnidadMO = document.querySelector('#updUnidadInputManodeobra');
    let salarioMO = document.querySelector('#UpdsalarioInput');
    let cantidadMo = document.querySelector('#UpdcantidadInput');
    let rendimientoMo = document.querySelector('#UpdrendimientoInput');
    let idAnterior = document.querySelector('#UpdidAnteriorMano');

    idAnterior.value = id;
    idMO.value = id;
    salarioMO.value = salario;
    cantidadMo.value = cantidad;
    rendimientoMo.value = rendimiento;

    //llenar el select de tipo
    for (var i = 0; i < categoriaMO.options.length; i++) {
        if (categoriaMO.options[i].value === categoria) {
            categoriaMO.options[i].selected = true;
            break;
        }
    }
    //llenar el select de unidad
    for (var i = 0; i < UnidadMO.options.length; i++) {
        if (UnidadMO.options[i].value === unidad) {
            UnidadMO.options[i].selected = true;
            break;
        }
    }


    idMO.placeholder = "";
    salarioMO.placeholder = "";
    cantidadMo.placeholder = "";
    rendimientoMo.placeholder = "";


    idMO.classList.remove("inputVacio");
    categoriaMO.classList.remove("inputVacio");
    UnidadMO.classList.remove("inputVacio");
    salarioMO.classList.remove("inputVacio");
    rendimientoMo.classList.remove("inputVacio");
    rendimientoMo.classList.remove("inputVacio");
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

