<!doctype html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SIFCAO</title>
    <link href="bootstrap-5.3.1-dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="indexStyles.css">
    <link href="fontawesome-free-6.4.2-web/css/all.min.css" rel="stylesheet">
</head>

<body>
    <div class="container">
        <div class="center-box">
            <form class="px-4 py-3">
                <img src="img/Logocfeblanco.png" alt="Logo" class="logo" style="width: 150px; height: auto; margin-bottom: 30px;">
                <div class="mb-3 input-group">
                    <span class="input-group-text custom-icon"><i class="fas fa-user green-icon"></i></span>
                    <input type="text" class="form-control" id="Usuario">
                </div>
                <div class="mb-3 input-group">
                    <span class="input-group-text custom-icon"><i class="fas fa-lock green-icon"></i></span>
                    <input type="password" class="form-control" id="Password">
                </div>
                <button type="button" id="btnIngresar" class="btn btn-outline-light" style="--bs-btn-padding-y: .3rem; --bs-btn-padding-x: 2.5rem; --bs-btn-font-size: 1rem;">Ingresar</button>
            </form>
        </div>
    </div>
    </div>

    <script src="bootstrap-5.3.1-dist/js/bootstrap.bundle.min.js"></script>
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
    </Script>
</body>


</html>