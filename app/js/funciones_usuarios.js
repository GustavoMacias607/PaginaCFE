
let msgEliminarUsu = "Usuario deshabilitado";
let msgActivarUsu = "Usuario habilitado";
let msgAgregarUsu = "Usuario agregado";
let msgModificarUsu = "Usuario modificado";
var estatusUsuario = 1;

//Metodo que valida el formulario para agregar usuarios y al mismo tiempo agrega el usuario
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
    datos.idZona = obtenerIdZonaXNombre(nombreZona.value);
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
    console.log(json);
    let url = "../ws/Usuarios/wsAddUsuario.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    AddCerrarModal();
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

//Metodo para validar si las contraseñas coinciden
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
//Metodo para validar el modal para modificar un usuario y al mismo tiempo valida los datos
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


    let nombreZona = document.querySelector('#inputUpdZona');
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
    datos.idZona = obtenerIdZonaXNombre(nombreZona.value);
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
    console.log(json);
    let url = "../ws/Usuarios/wsUpdUsuario.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp);
                if (resp.estado == "OK") {
                    UpdateCerrarModal();
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
//Metodo que valida si un usuario ya existe o no en la base de datos
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

//Metodo que valida si el campo del formulario ya tiene algo ingresado
function CompruebaTieneAlgoInputUsuario(input) {

    if (input.value && input.id != "AddConfirpassInput") {
        input.classList.add("inputLleno");
        input.classList.remove("inputVacio");
    }
    input.placeholder = ""
}
//Metodo para cambiar el estatus de los usuarios
function CambioEstatusUsuario() {
    const datos = {};
    datos.id = idEliminar;
    if (ActivarS == 1) {
        datos.estatus = "Inactivo";
    } else {
        datos.estatus = "Activo";
    }
    let json = JSON.stringify(datos);
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


//Metodo para hacer la consulta de los usuarios tomando en cuanta los filtros
function GetUsuario() {
    let json = "";
    let url = "../ws/Usuarios/wsGetUsuarios.php";
    $.post(url, json, (responseText, status) => {
        try {

            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    data = resp.datos;
                    ObtenerZonas();
                    llenarTablaUsuario();
                    filterDataUsuario();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}

function displayTableUsuario(page) {
    const tableBody = document.getElementById("table-bodyUsuario");
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredData.slice(start, end);

    if (paginatedData.length > 0) {
        paginatedData.forEach(record => {
            // Crear un elemento de fila (tr)
            const row = document.createElement('tr');
            row.classList.add('fila');

            // Establecer el contenido HTML de la fila
            row.innerHTML = `
                <td class="Code" style="text-align: right;">${record.idusuario}</td>
                <td>${(!record.nombre == "") ? record.nombre : "---"}</td>
                <td>${(!record.usuario == "") ? record.usuario : "---"}</td>
                <td>${(!record.rol == "") ? record.rol : "---"}</td>
                <td>${(!record.zona == "") ? record.zona : "---"}</td>
                <td class="estatus">
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        ${record.estatus == 1 ? `
                            <i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;" alt="Modificar" data-bs-toggle="modal" data-bs-target="#EditarModal" onclick="llenarModalModificarUsuario(${record.idusuario},'${record.nombre}','${record.usuario}','${record.rol}','${record.zona}')"></i>
                        ` : ``}
                        ${record.estatus == 1 ?
                    `<i class="coloresIcono fa-solid fa-square-check" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${record.idusuario},${record.estatus})"></i>` :
                    `<i class="coloresIcono fa-solid fa-square" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${record.idusuario},${record.estatus})"></i>`
                }
                    </div>
                </td>   
            `;

            // Añadir eventos mouseover y mouseout
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));

            // Añadir la fila al tbody
            tableBody.appendChild(row);
        });
    } else {
        const row = `<tr>
                        <td colspan="6" class="Code">Sin resultados</td>
                     </tr>`;
        tableBody.innerHTML += row;
    }

}



function setupPaginationUsuario() {
    const paginationDiv = document.getElementById("pagination");
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
                displayTableUsuario(currentPage);
                setupPaginationUsuario();
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
                displayTableUsuario(currentPage);
                setupPaginationUsuario();
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
                displayTableUsuario(currentPage);
                setupPaginationUsuario();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

function filterDataUsuario() {
    const searchText = document.getElementById("search-inputUsuario").value.toLowerCase();
    const rolFilter = document.getElementById("selectUsuarios").value;
    const statusFilter = estatusUsuario;
    filteredData = data.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value.toString().toLowerCase().includes(searchText)
        );
        const matchesrol = rolFilter ? record.rol == rolFilter : true;
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesrol && matchesStatus;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableUsuario(currentPage);
    setupPaginationUsuario();
}

function llenarTablaUsuario() {
    displayTableUsuario(currentPage);
    setupPaginationUsuario();
    const searchInput = document.getElementById("search-inputUsuario");
    searchInput.addEventListener("input", filterDataUsuario);

    const rolFilter = document.getElementById("selectUsuarios");
    rolFilter.addEventListener("change", filterDataUsuario);

    const rowsPerPageSelect = document.getElementById("rows-per-page");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableUsuario(currentPage);
        setupPaginationUsuario();
    });
}
//Metodo para limpiar el modal de agregar usuario
function AddlimpiarModalUsuario() {
    let nombreU = document.querySelector('#AddnombreInput');
    let usuarioU = document.querySelector('#AddusuarioInput');
    let rolU = document.querySelector('#AddrolInput');
    let pass = document.querySelector('#AddpassInput');
    let passConfir = document.querySelector('#AddConfirpassInput');
    let zona = document.querySelector('#inputZona');

    nombreU.value = "";
    usuarioU.value = "";
    rolU.value = "";
    pass.value = "";
    passConfir.value = "";
    zona.value = "";

    nombreU.placeholder = "";
    usuarioU.placeholder = "";
    pass.placeholder = "";
    passConfir.placeholder = "";
    zona.placeholder = "";

    nombreU.classList.remove("inputVacio");
    usuarioU.classList.remove("inputVacio");
    rolU.classList.remove("inputVacio");
    pass.classList.remove("inputVacio");
    passConfir.classList.remove("inputVacio");
    zona.classList.remove("inputVacio");
}

//Metodo para cambiar la imagen del toggle a la hora de darle clic para cambiar entre usuarios activos e inactivos
function valStatusUsuario() {
    var checkbox = document.getElementById('ValCheEsta');
    var imgcheck = document.getElementById('ValEstatus');
    // Deseleccionar el checkbox
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        imgcheck.src = "../img/toggle_on_35px.png"
        estatusUsuario = 1;
    } else {
        imgcheck.src = "../img/toggle_off_35px.png"
        estatusUsuario = 0;
    }
    filterDataUsuario();
}

//Metodo para que se llene el modal de modificar con los datos seleccionados de la fila
//Recibe los datos del usuario seleccionado
function llenarModalModificarUsuario(id, nombre, usuario, rol, zona) { //Llenado de datos en el modal
    let idU = document.querySelector('#UpdidInput');
    let nombreU = document.querySelector('#UpdnombreInput');
    let usuarioU = document.querySelector('#UpdusuarioInput');
    let rolU = document.querySelector('#UpdrolInput');
    let pass = document.querySelector('#UpdpassInput');
    let zonaU = document.querySelector('#inputUpdZona');
    let UsuAnterior = document.querySelector('#UpUsuAnterior');

    UsuAnterior.value = usuario;
    idU.value = id;
    nombreU.value = nombre;
    usuarioU.value = usuario;
    pass.value = "";
    rolU.value = rol;
    zonaU.value = zona;
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
    zonaU.classList.remove("inputVacio");
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




function mostrarSugerenciasZonasUsuarios(input, inputUnidad) {
    let sugerenciasDiv;
    if (inputUnidad == "AddZona") {
        sugerenciasDiv = document.getElementById('Addsugerencias');
    } else if (inputUnidad == "UpdZona") {
        sugerenciasDiv = document.getElementById('Updsugerencias');
    }
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

        div.onclick = () => {
            seleccionarSugerenciaZonasUsuarios(zona.zona, inputUnidad, sugerenciasDiv);
        }
        sugerenciasDiv.appendChild(div);
    });
}

// Función para ocultar el cuadro de sugerencias al perder el foco
function ocultarSugerenciasZonasUsuarios(inputUnidad) {
    setTimeout(() => {
        let sugerenciasDiv;
        if (inputUnidad == "AddZona") {
            sugerenciasDiv = document.getElementById('Addsugerencias');
        } else if (inputUnidad == "UpdZona") {
            sugerenciasDiv = document.getElementById('Updsugerencias');
        }
        sugerenciasDiv.classList.remove('activado'); // Ocultar el cuadro de sugerencias
    }, 200);
}

function seleccionarSugerenciaZonasUsuarios(zona, inputUnidad, sugerenciasDiv) {
    let input;
    if (inputUnidad == "AddZona") {
        input = document.getElementById('inputZona');
    } else if (inputUnidad == "UpdZona") {
        input = document.getElementById('inputUpdZona');
    }
    input.value = zona; // Colocar la zona seleccionada en el input
    sugerenciasDiv.innerHTML = ''; // Limpiar las sugerencias
    sugerenciasDiv.classList.remove('activado'); // Ocultar el cuadro
}




function obtenerIdZonaXNombre(zona) {
    const zonaEncontrada = objZonas.find(z => z.zona === zona);
    return zonaEncontrada ? zonaEncontrada.idzona : null;
}