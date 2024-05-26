function incioUsuario() {
    setTimeout(() => {
        GetUsuario();
        existe = false;
    }, 800);
}

let msgEliminarUsu = "Usuario eliminado";
let msgActivarUsu = "Usuario activado";
let msgAgregarUsu = "Usuario agregado";
let msgModificarUsu = "Usuario modificado";

//Metodo para cambiar el tamaño de los registros que se muestran
function cambiarTamanoUsuario() {
    const cantidad = document.getElementById("cantRegistros");
    tamanoPagina = parseInt(cantidad.value);
    paginaActual = 1;
    GetUsuario();
}


//Metodo que valida el formulario para agregar materiales y al mismo tiempo agrega el material
function AddUsuarioValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let nombre = document.querySelector('#AddnombreInput');
    if (nombre.value == "") {
        nombre.classList.add("inputVacio");
        nombre.placeholder = "Requerido el nombre"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = nombre;
        }
    }
    datos.nombre = nombre.value;
    let usuario = document.querySelector('#AddusuarioInput');
    if (usuario.value == "") {
        usuario.classList.add("inputVacio");
        usuario.placeholder = "Requerido el nombre de usuario"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = usuario;
        }

    }
    datos.usuario = usuario.value;
    let pass = document.querySelector('#AddpassInput');
    if (pass.value == "") {
        pass.classList.add("inputVacio");
        pass.placeholder = "Requerida la contraseña"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = pass;
        }
    }
    datos.pass = pass.value;

    let passConfir = document.querySelector('#AddConfirpassInput');
    if (passConfir.value == "") {
        passConfir.classList.add("inputVacio");
        passConfir.placeholder = "Requerida la confirmacion de contraseña"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = passConfir;
        }
    }

    let rol = document.querySelector('#AddrolInput');
    if (rol.value == "") {
        rol.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = rol;
        }

    }
    datos.rol = rol.value;
    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }
    let coinciden = ComprobarContrasenas();
    if (!coinciden) {
        passConfir.focus();
        return;
    }
    checkUsuario('Add');
    if (existe) {
        usuario.focus();
        return;
    }
    let json = JSON.stringify(datos);
    let url = "../ws/Usuarios/wsAddUsuario.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    AddCerrarModalUsuario();
                    mensajePantalla(msgAgregarUsu, true);
                    GetUsuario();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}
function ComprobarContrasenas() {
    let passConfir = document.querySelector('#AddConfirpassInput');
    let pass = document.querySelector('#AddpassInput').value;

    if (passConfir.value != pass) {
        passConfir.classList.add('inputVacio');
        return false;
    } else {
        passConfir.classList.remove('inputVacio');
        return true;
    }

}
//Metodo para validar el modal para modificar un material y al mismo tiempo valida los datos
function UpdUsuarioValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let id = document.querySelector('#UpdidInput');
    datos.id = id.value;

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
    let usuario = document.querySelector('#UpdusuarioInput');
    if (usuario.value == "") {
        usuario.classList.add("inputVacio");
        usuario.placeholder = "Requerido el nombre de usuario"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = usuario;
        }

    }
    datos.usuario = usuario.value;

    let rol = document.querySelector('#UpdrolInput');
    if (rol.value == "") {
        rol.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = rol;
        }

    }
    datos.rol = rol.value;
    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }
    checkUsuario("Upd");

    if (existe) {
        usuario.focus();
        return;
    }
    let pass = document.querySelector('#UpdpassInput');
    datos.pass = pass.value;


    let json = JSON.stringify(datos);
    let url = "../ws/Usuarios/wsUpdUsuario.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    UpdateCerrarModalUsuario();
                    mensajePantalla(msgModificarUsu, true);
                    GetUsuario();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function checkUsuario(modal) {
    const datos = {}
    let UsuVali;
    if (modal == "Add") {
        UsuVali = document.querySelector('#AddusuarioInput');
    } else {
        UsuVali = document.querySelector('#UpdusuarioInput');
        let UsuAnterior = document.querySelector('#UpUsuAnterior');
        if (UsuVali.value == UsuAnterior.value) {
            existe = false;
            return;
        }
    }

    if (UsuVali.value == "") {
        return;
    }
    datos.usuario = UsuVali.value;
    let json = JSON.stringify(datos);
    let url = "../ws/Usuarios/wscheckUsuario.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                console.log(responseText);
                let resp = JSON.parse(responseText);
                comprobarExiste(resp.estado, UsuVali)
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}


function CompruebaTieneAlgoInputUsuario(input) {

    if (input.value && input.id != "AddConfirpassInput") {
        input.classList.add("inputLleno");
        input.classList.remove("inputVacio");
    }
    input.placeholder = ""
}
//Metodo para cambiar el estatus de los materiales
function CambioEstatusUsuario() {
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
            let url = "../ws/Usuarios/wsCambiarStatusUsuario.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        mensajePantalla(msgActivarUsu, true)
                        paginaActual = 1;
                        GetUsuario();
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
            let url = "../ws/Usuarios/wsCambiarStatusUsuario.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        GetUsuario();
                        paginaActual = 1;
                        mensajePantalla(msgEliminarUsu, true)
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
function paginaAnteriorUsuario() {
    if (paginaActual > 1) {
        paginaActual--;
        GetUsuario();
    }
}

//Metodo para cambiar de pagona dando clic a la paginacion
//Recobe el numero de pagina al cual se cambiara
function NoPagUsuario(pagi) {
    paginaActual = pagi;
    GetUsuario();
}

//Metodo para cambiar a la pagina siguiente en la paginacion
function paginaSiguienteUsuario() {
    if (paginaActual < totalPag) {
        paginaActual++;
        GetUsuario();
    }
}

//Metodo para hacer la consulta de los materiales tomando en cuanta los filtros
function GetUsuario() {
    const datos = {};
    let buscar = document.querySelector('#searchInputUsuarios');
    let estatus = document.getElementById('ValCheEstaUsuarios').checked;
    let rol = document.getElementById('selectUsuarios');
    datos.buscar = buscar.value;
    if (estatus) {
        datos.estatus = 1;
    } else {
        datos.estatus = 0;
    }
    datos.rol = rol.value;
    let json = JSON.stringify(datos)
    let url = "../ws/Usuarios/wsGetUsuarios.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    //Llamar a la función para mostrar los datos en la tabla
                    console.log(responseText)
                    mostrarDatosEnTablaUsuario(resp.datos, paginaActual, tamanoPagina);
                } else {
                    // Mostrar mensaje de error si el estado no es "OK"
                    mostrarDatosEnTablaUsuario(resp.mensaje, paginaActual, tamanoPagina);
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
function mostrarDatosEnTablaUsuario(datos, paginaActual, tamanoPagina) {
    let totalPaginas = obtenerTotalPaginas(datos.length, tamanoPagina);
    totalPag = totalPaginas;
    let tbody = document.getElementById("tabla-usuarios").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    if (datos == "N") {
        let fila = document.createElement("tr");
        fila.innerHTML = `
        <td colspan="8">Sin resultados</td>
        `;
        tbody.appendChild(fila);

        actualizarPaginacionUsuario(datos, paginaActual, tamanoPagina);
        return;
    }
    let startIndex = (paginaActual - 1) * tamanoPagina;
    let endIndex = Math.min(startIndex + tamanoPagina, datos.length);
    for (let i = startIndex; i < endIndex; i++) {
        let usuario = datos[i];
        let fila = document.createElement("tr");
        fila.classList.add("fila")
        fila.addEventListener("mouseover", () => mostrarValores(fila));
        fila.addEventListener("mouseout", () => ocultarValores(fila));
        // Agregar las celdas a la fila
        fila.innerHTML = `
            <td class="Code">${usuario.idusuario}</td>
            <td>${(!usuario.nombre == "") ? usuario.nombre : "---"}</td>
            <td>${(!usuario.usuario == "") ? usuario.usuario : "---"}</td>
            <td>${(!usuario.rol == "") ? usuario.rol : "---"}</td>
            <td class="estatus">
                <div class="" style="display: flex; justify-content: space-around; align-items: center;">
                <i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;"  alt="Modificar" data-bs-toggle="modal" data-bs-target="#EditarModal" onclick="llenarModalModificarUsuario(${usuario.idusuario},'${usuario.nombre}','${usuario.usuario}','${usuario.rol}')"></i>
                ${usuario.estatus == 1 ?
                `<i class="coloresIcono fa-solid fa-square-check" style="cursor: pointer;" onclick="AbrirModalConfirm1Usuario(); AsignarValores(${usuario.idusuario},${usuario.estatus})"></i>` :
                `<i class="coloresIcono fa-solid fa-square" style="cursor: pointer;" onclick="AbrirModalConfirm1Usuario(); AsignarValores(${usuario.idusuario},${usuario.estatus})"></i>`
            }



                 
                </div>
            </td>   
        `;
        // Agregar la fila a la tabla
        tbody.appendChild(fila);

    }

    actualizarPaginacionUsuario(datos.length, paginaActual, tamanoPagina);
}
//Metodo para actualizar la paginacion, este metodo se ejecuta cuando hay nuevos datos en la tabla
//recibe la cantidad de datos, la pagina actual y el tamaño de registros a mostrar
function actualizarPaginacionUsuario(totalDatos, paginaActual, tamanoPagina) {
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
    liPrev.innerHTML = `<button onclick="paginaAnteriorUsuario()" style="background-color: #008e5a; color: #ffffff; border: 3px solid #008e5a;"><i class="fa-solid fa-angles-left"></i></button>`;
    paginationList.appendChild(liPrev);
    // Generar enlaces de página
    for (let i = Math.max(1, paginaActual - rangoMostrar); i <= Math.min(totalPaginas, paginaActual + rangoMostrar); i++) {
        let li = document.createElement("li");
        if (i === paginaActual) {
            li.classList.add("active");
        }
        li.innerHTML = `<button style="color: #008e5a; border: 3px solid #008e5a;" onclick="NoPagUsuario(${i})">${i}</button>`;
        if (i === paginaActual) {
            li.innerHTML = `<button class="active" style="color: #ffffff; border: 3px solid #008e5a;" onclick="NoPagUsuario(${i})">${i}</button>`;
        }
        paginationList.appendChild(li);
    }
    let liNext = document.createElement("li");
    liNext.innerHTML = `<button onclick="paginaSiguienteUsuario()" style="background-color: #008e5a; color: #ffffff; border: 3px solid #008e5a;"><i class="fa-solid fa-angles-right"></i></button>`;
    paginationList.appendChild(liNext);

}

//Metodo para limpiar el modal de agregar material
function AddlimpiarModalUsuario() {
    let nombreU = document.querySelector('#AddnombreInput');
    let usuarioU = document.querySelector('#AddusuarioInput');
    let rolU = document.querySelector('#AddrolInput');
    let pass = document.querySelector('#AddpassInput');
    let passConfir = document.querySelector('#AddConfirpassInput');

    nombreU.value = "";
    usuarioU.value = "";
    rolU.value = "";
    pass.value = "";
    passConfir.value = "";

    nombreU.placeholder = "";
    usuarioU.placeholder = "";
    pass.placeholder = "";
    passConfir.placeholder = "";

    nombreU.classList.remove("inputVacio");
    usuarioU.classList.remove("inputVacio");
    rolU.classList.remove("inputVacio");
    pass.classList.remove("inputVacio");
    passConfir.classList.remove("inputVacio");
}

//Metodo para cambiar la imagen del toggle a la hora de darle clic para cambiar entre materiales activos e inactivos
function valStatusUsuario() {
    var checkbox = document.getElementById('ValCheEstaUsuarios');
    var imgcheck = document.getElementById('ValEstatusUsuario');
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
function llenarModalModificarUsuario(id, nombre, usuario, rol) { //Llenado de datos en el modal
    console.log(id, nombre, usuario, rol)
    let idU = document.querySelector('#UpdidInput');
    let nombreU = document.querySelector('#UpdnombreInput');
    let usuarioU = document.querySelector('#UpdusuarioInput');
    let rolU = document.querySelector('#UpdrolInput');
    let pass = document.querySelector('#UpdpassInput');
    let UsuAnterior = document.querySelector('#UpUsuAnterior');
    UsuAnterior.value = usuario;
    idU.value = id;
    nombreU.value = nombre;
    usuarioU.value = usuario;
    rolU.value = rol;
    pass.value = "";

    //llenar el select de responsables
    for (var i = 0; i < rolU.options.length; i++) {
        if (rolU.options[i].value === rol) {
            rolU.options[i].selected = true;
            break;
        }
    }

    nombreU.placeholder = "";
    usuarioU.placeholder = "";


    nombreU.classList.remove("inputVacio");
    usuarioU.classList.remove("inputVacio");
    rolU.classList.remove("inputVacio");
}

//Metodo para cerrar el modal de agregar material
function AddCerrarModalUsuario() {
    $('#AgregarModal').modal('hide');
}
//Metodo para cerrar el modal de modificar material
function UpdateCerrarModalUsuario() {

    $('#EditarModal').modal('hide');
}
function ActivarCerrarModalUsuario() {

    $('#confirmActivationModal').modal('hide');
}
function EliminarCerrarModalUsuario() {

    $('#confirmAdditionalModal').modal('hide');
}

function AbrirModalConfirmUsuario() {
    $('#confirmAdditionalModal').modal('show');
}
//Metodo para abrir el modal dependiendo si se abre para activar o eliminar
function AbrirModalConfirm1Usuario() {
    let estatus = document.getElementById('ValCheEstaUsuarios').checked;
    if (estatus) {
        $('#confirmDeleteModal').modal('show');
    } else {
        $('#confirmActivationModal').modal('show');
    }

}

