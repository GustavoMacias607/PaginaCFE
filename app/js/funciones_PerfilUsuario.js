
let msgModificarContra = "Contraseña modificada";

function GetPerfilUsuario() {
    let btnICMNav = document.querySelector('#btnICMNav');
    btnICMNav.style.display = 'none';
}
function UpdPerfilUsuarioValidar(modificarContra) {
    let pass = document.querySelector('#AddContraInput');
    let passConfi = document.querySelector('#AddContraConfInput');
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let id = document.querySelector('#idInput');
    datos.id = id.value;
    let nombre = document.querySelector('#AddnombreInput');
    if (nombre.value == "") {
        nombre.classList.add("inputVacio");
        nombre.placeholder = "Requerido el nombre";
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = nombre;
        }
    }

    datos.nombre = nombre.value;
    let usuario = document.querySelector('#AddusuarioInput');

    if (usuario.value == "") {
        usuario.classList.add("inputVacio");
        usuario.placeholder = "Requerido el nombre de usuario";
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = usuario;
        }
    }

    datos.usuario = usuario.value;
    let rol = document.querySelector('#AddrolInput');
    datos.rol = rol.value;

    let idzona = document.querySelector('#AddidzonaInput');
    datos.idZona = idzona.value;

    if (modificarContra) {

        if (pass.value == "") {
            pass.classList.add("inputVacio");
            pass.placeholder = "Requerida la contraseña";
            vacio = true;
            if (!PrimerValorVacio) {
                PrimerValorVacio = pass;
            }
        }
        if (passConfi.value == "") {
            passConfi.classList.add("inputVacio");
            passConfi.placeholder = "Requerida la confirmación";
            vacio = true;
            if (!PrimerValorVacio) {
                PrimerValorVacio = passConfi;
            }
        }
        let coinciden = ComprobarContrasenasPerfil();
        if (!coinciden) {
            passConfi.focus();
            return;
        } else {
            datos.pass = pass.value;
        }
    } else {
        datos.pass = "";
    }


    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }
    if (existe) {
        usuario.focus();
        return;
    }
    let json = JSON.stringify(datos);
    console.log(json);
    let url = "../ws/Usuarios/wsUpdUsuario.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    // Llamada AJAX adicional para actualizar nombre y usuario en la sesión
                    $.post("../ws/Usuarios/wsUpdateSession.php", {
                        nombre: nombre.value,
                        usuario: usuario.value
                    }, (responseSession) => {
                        if (!modificarContra) {
                            mensajePantalla("Modificando usuario...", true);
                            setInterval(() => {
                                window.location.href = window.location.href;
                            }, 2000);
                        }
                    });
                    if (modificarContra) {
                        mensajePantalla(msgModificarContra, true);
                        $('#CambiarcontraseñaModal').modal('hide');
                    }
                }
            } else {
                throw status;
            }
        } catch (error) {
            alert("Error: " + error);
        }
    });
}


function checkPerfilUsuario() {
    const datos = {}
    let UsuVali = document.querySelector('#AddusuarioInput');
    let UsuAnterior = document.querySelector('#AddUsuAnterior');
    if (UsuVali.value == UsuAnterior.value) {
        comprobarExiste("N", UsuVali)
        existe = false;
        return;
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

function ComprobarContrasenasPerfil() {

    let pass = document.querySelector('#AddContraInput').value;
    let passConfir = document.querySelector('#AddContraConfInput');
    if (passConfir.value != pass) {
        passConfir.classList.add('inputVacio');
        return false;
    } else if (passConfir.value == "") {
        passConfir.classList.add('inputVacio');
        return false;
    }
    else {
        passConfir.classList.remove('inputVacio');
        return true;
    }
}


function AddlimpiarModalPerfilUsuario() {
    let pass = document.querySelector('#AddContraInput');
    let passConfir = document.querySelector('#AddContraConfInput');

    pass.value = "";
    passConfir.value = "";

    passConfir.classList.remove('inputVacio');
    pass.classList.remove('inputVacio');


    passConfir.placeholder = "";
    pass.placeholder = "";
}