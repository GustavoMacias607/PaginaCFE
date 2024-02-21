<!doctype html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Aplicacion de administracion de reunines</title>
    <link href="bootstrap-5.3.1-dist/css/bootstrap.min.css" rel="stylesheet">

    <link href="fontawesome-free-6.4.2-web/css/all.min.css" rel="stylesheet">
</head>

<body>


    <div class="container">
        <div class="row">
            <div class="col-md"></div>
            <div class="col-md">
                <form id="form">
                    <div class="mb-3">
                        <label for="Usuario" class="form-label">Usuario</label>
                        <input type="text" name="usuario" class="form-control" id="Usuario"
                            placeholder="Introduce tu nombre de usuario">
                        <div id="textolabel" class="form-text">El nombre de usuario esta compuesto solo por letras.
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="Password" class="form-label">Password</label>
                        <input type="password" name="password" class="form-control" id="Password"
                            placeholder="Introduce tu contraseña">
                    </div>
                    <div class="d-grid gap-2"></div>
                    <button id="btn_submit" type="button" class="btn btn-outline-primary">Ingresar <i
                            class="fa-solid fa-key"></i></button>
                </form>
            </div>
            <div class="col-md">

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