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
                    <input type="text" name="usuario" class="form-control form-control-login" id="Usuario">
                </div>
                <div class="mb-3 input-group">
                    <span class="input-group-text custom-icon"><i class="fas fa-lock green-icon"></i></span>
                    <input type="password" class="form-control form-control-login" id="Password">
                </div>
                <button type="button" id="btn_submit" class="btn btn-outline-light">Ingresar</button>
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

    <script src="bootstrap-5.3.1-dist/js/bootstrap.bundle.min.js"></script>
    <script src="node_modules/sweetalert2/dist/sweetalert2.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="js/code.jquery.com_jquery-3.7.1.min.js"></script>
    <Script type="text/javascript">
        $(document).ready(function() {
            $('#btn_submit').click(function() {
                try {
                    const datos = {};
                    const form = document.querySelector('#form');
                    for (let i = 0; i < form.elements.length; i++) {
                        if (form.elements[i].type == "text" || form.elements[i].type == "password") {
                            if (form.elements[i].value == "") {
                                alert("El Campo " + form.elements[i].id + " esta Vacio")
                                form.elements[i].focus()
                                return;
                            } else {
                                if (form.elements[i].name == "usuario") {
                                    datos.usuario = form.elements[i].value
                                } else {
                                    datos.password = form.elements[i].value
                                }
                            }
                        }
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
                                    console.log(res.estado);
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
            });

        });


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
    </Script>
</body>


</html>