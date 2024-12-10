<!doctype html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SIFCAO</title>
    <link href="bootstrap-5.3.1-dist/css/bootstrap.min.css" rel="stylesheet">

    <link rel="stylesheet" href="loginStyles.css">
    <link href="fontawesome-free-6.4.2-web/css/all.min.css" rel="stylesheet">
</head>

<body>

    <div class="center-box">
        <form id="form" class="px-4 py-3">
            <img src="img/Logocfeblanco.png" alt="Logo" class="logo"
                style="width: 150px; height: auto; margin-bottom: 30px;">
            <div class="mb-3 input-group">
                <span class="input-group-text custom-icon"><i class="fas fa-user green-icon"></i></span>
                <input type="text" name="usuario" placeholder="Usuario"
                    onblur="javascript:CompruebaTieneAlgoInput(this)"
                    class="form-control  inputLleno form-control-login" id="Usuario">
            </div>
            <div class="mb-3 input-group">
                <span class="input-group-text custom-icon"><i class="fas fa-lock green-icon"></i></span>
                <input type="password" placeholder="Contraseña" onblur="javascript:CompruebaTieneAlgoInput(this)"
                    class="form-control inputLleno form-control-login" id="Password">
            </div>
            <button type="button" onclick="logueo()" id="btn_submit" class="btn btn-outline-light">Ingresar</button>
        </form>
        <li class="open_submenu">


            <a href="#">
                <i class="fa-solid"></i>
                S I F C A O
            </a>
            <div class="submenu">
                <ul>
                    <li>Sistema</li>
                    <li>Integral de</li>
                    <li>Formulación de</li>
                    <li>Costo</li>
                    <li>Actualizado de</li>
                    <li>Obra</li>
                </ul>
            </div>
        </li>
    </div>

    <div class="centrarMsg modMsgEsconder" id="modalMsgLogIn">
        <div class="modMsgLogIn" id="modLogIn">
            <div class="modImg">
                <img id="imgPic" src="../img/imgPalomita.png" alt="Mensaje" height="100%">
            </div>
            <div class="modCon">
                <p id="modParrafo"></p>
            </div>
        </div>
    </div>
    <script src="bootstrap-5.3.1-dist/js/bootstrap.bundle.min.js"></script>
    <script src="node_modules/sweetalert2/dist/sweetalert2.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="js/code.jquery.com_jquery-3.7.1.min.js"></script>
    <Script type="text/javascript">
        function CompruebaTieneAlgoInput(input) {
            if (input.value) {
                input.classList.add("inputLleno");
                input.classList.remove("inputVacio");
                input.placeholder = ""
            }
        }

        function logueo() {


            try {
                let vacio = false;
                let PrimerValorVacio;
                const datos = {};
                let usuario = document.querySelector('#Usuario');
                if (usuario.value == "") {
                    usuario.classList.add("inputVacio");
                    usuario.placeholder = "Campo usuario vacío"
                    vacio = true;
                    PrimerValorVacio = usuario;
                }
                datos.usuario = usuario.value;

                let password = document.querySelector('#Password');
                if (password.value == "") {
                    password.classList.add("inputVacio");
                    password.placeholder = "Campo constraseña vacío"
                    vacio = true;
                    if (!PrimerValorVacio) {
                        PrimerValorVacio = password;
                    }

                }
                datos.password = password.value;

                if (vacio) {
                    PrimerValorVacio.focus();
                    return;
                }
                const json = JSON.stringify(datos);
                console.log(json)
                $.post("ws/wsLogin.php", json, (responseText, status) => {
                    try {
                        console.log(responseText);
                        if (status == "success") {
                            res = JSON.parse(responseText);
                            if (res.estado == "OK") {

                                window.location.href = "app/index.php";
                            } else {
                                mensajePantallaLogIn(res.estado, false);
                            }
                        } else {
                            console.log(status);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }

        var subMenu = document.querySelector('.submenu');
        var openSubMenu = document.querySelector('.open_submenu');

        openSubMenu.addEventListener('click', function() {
            subMenu.classList.toggle('show');
        })

        document.addEventListener('click', function(e) {
            if (subMenu.classList.contains('show') &&
                !subMenu.contains(e.target) &&
                !openSubMenu.contains(e.target)) {

                subMenu.classList.remove('show');
            }
        });

        function mensajePantallaLogIn(msg, valor) {
            let msgModal = document.getElementById('modalMsgLogIn');
            let parrafoModal = document.getElementById('modParrafo');
            let modLogIn = document.getElementById('modLogIn');
            let img = document.getElementById('imgPic');
            if (valor) {
                img.src = "img/imgPalomita.png"
                parrafoModal.innerHTML = msg;
                msgModal.classList.remove("modMsgEsconder");
                modLogIn.classList.add("modMsgBien");
                setTimeout(() => {
                    msgModal.classList.add("modMsgEsconder");
                    modLogIn.classList.remove("modMsgBien");
                }, 2500);
            } else {
                img.src = "img/imgEquis.png"
                parrafoModal.innerHTML = msg;
                msgModal.classList.remove("modMsgEsconder");
                modLogIn.classList.add("modMsgMal");
                setTimeout(() => {
                    msgModal.classList.add("modMsgEsconder");
                    msgModal.classList.remove("modMsgMal");
                }, 2500);
            }
        }
    </Script>
</body>

</html>