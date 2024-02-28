function validaFrmUser() {
    const datos = {};
    let nombre = document.querySelector('#nombre');
    if (nombre.value == "") {
        alert('Ingrese su nombre')
        nombre.focus();
        return;
    }
    datos.nombre = nombre.value;
    let usuario = document.querySelector('#usuario');
    if (usuario.value == "") {
        alert('Ingrese su usuario')
        usuario.focus();
        return;
    }
    datos.usuario = usuario.value;
    let contrasena = document.querySelector('#contrasena');
    if (contrasena.value == "") {
        alert('Ingrese su contrasena')
        contrasena.focus();
        return;
    }
    datos.contrasena = contrasena.value;
    let contrasena2 = document.querySelector('#contrasena2');
    if (contrasena2.value !== contrasena.value) {
        alert('La contraseña no coincide')
        contrasena2.focus();
        return;
    }
    let correo = document.querySelector('#correo');

    if (correo.value == "" || !validateEmail()) {
        alert('Correo Invalido')
        correo.focus();
        return;
    }
    datos.correo = correo.value;
    let iniciales = document.querySelector('#iniciales');
    if (iniciales.value == "") {
        alert('Ingrese su iniciales')
        iniciales.focus();
        return;
    }
    datos.iniciales = iniciales.value;

    let depto = document.querySelector('#depto');
    if (depto.value == 0) {
        alert('Ingrese su depto')
        depto.focus();
        return;
    }
    datos.depto = depto.value;
    let rol = document.querySelector('#rol');
    if (rol.value == 0) {
        alert('Ingrese su rol')
        rol.focus();
        return;
    }
    datos.rol = rol.value;
    let json = JSON.stringify(datos);
    console.log(json)
    let url = "../ws/usuario/wsAddUser.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                console.log(responseText);
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    alert("Operacion se ejecuto con exito :)");
                    opcion('admonUser');
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function validaUsuario() {
    let obj = document.querySelector("#usuario");
    if (obj.value !== "") {
        let datos = {};
        datos.usuario = obj.value;
        let json = JSON.stringify(datos);
        let url = "../ws/usuario/wsCheckUser.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == 'success') {
                    let resp = JSON.parse(responseText);
                    if (resp.existe == 1) {
                        //Aqui desabilitamos el boton 
                        throw e = "Advertencia: El usuario ya esta en uso";
                    }
                } else {
                    throw e = "Error: No se alcanzo el recurso";
                }
            } catch (error) {
                alert(error);
            }
        })
    }
}

function validateEmail() {

    // Get our input reference.
    var emailField = document.getElementById('correo');

    // Define our regular expression.
    var validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

    // Using test we can check if the text match the pattern
    if (validEmail.test(emailField.value)) {

        return true;
    } else {

        return false;
    }


    function cambiarEstiloImagen() {
        var imagen = document.getElementById("imagen");
        imagen.style.display = "block"; // Cambia el display a "block" cuando se pasa el mouse sobre h2
        // También puedes realizar otros cambios de estilo aquí según tus necesidades
    }
} 