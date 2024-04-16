<?php
session_start();
// funcionalidad de cierre de sesion
if ($_GET['x'] == 1) {
    unset($_SESSION);
    session_destroy();
    header("Location: ../index.php");
    die();
}
// funcionalidad para validar sesion iniciada
/*if (!isset($_SESSION['idusuario'])) {

    header("Location: ../");
    die();
}
*/
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="../bootstrap-5.3.1-dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="../fontawesome-free-6.4.2-web/css/all.min.css" rel="stylesheet">
    <link href="../DataTables-1.11.3/datatables.min.css" rel="stylesheet">
    <link rel="stylesheet" href="indexStyles.css">
    <link rel="stylesheet" href="./Materiales/stylesmateriales.css">
    <link rel="stylesheet" href="./Usuarios/stylesusuarios.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <title></title>
</head>

<body>
    <div class="top-bar">
        <div id="logoImage" style="height: 70%;"></div>

        <div class="input-group-text custom-icon" style="display: flex; justify-content: end; top: 5px; position: fixed; right: 5px; background-color: #008E5A; border: none;">
            <span style="color: white; font-family: 'LatoBold', sans-serif; z-index: 1500; background-color: #008E5A;">Aqui
                va el usuario</span>

            <i class="fas fa-user white-icon" style="color: white; z-index: 1500; background-color: #008E5A;"></i>
        </div>

        <div class="btn-group dropstart" style="display: flex; justify-content: end; top: 40px; position: fixed; right: 5px;">
            <button type="button" class="fas fa-bars" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #008E5A; color: #ffffff; z-index: 1500; border: none; font-size: 30px; top: -10px;">
            </button>
            <ul class="dropdown-menu" style="background-color: #008E5A; border: 3px; border-color: #ffffff;">
                <li><a class="dropdown-item" style="color: #ffffff;" href="javascript:opcion('usuarios');">Usuarios</a>
                </li>
                <li><a class="dropdown-item" style="color: #ffffff;" href="index.html">Cerrar sesión</a></li>
            </ul>
        </div>

        <nav class="navbar navbar-expand-lg navbar-dark" style="position: fixed;">
            <div class=" container-fluid">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <!-- Por este icono de Font Awesome -->
                    <i class="fas fa-bars"></i>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="lis navbar-nav ms-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="javascript:opcion('materiales');">Materiales</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Estructuras</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Conceptos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Button 4</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Button 5</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
    <div class="bottom-rectangle bottom-rectangle-index">
    </div>

    <!-- Inicio del contenido principal -->
    <div id="mainContent" class="contaniner" style="margin-top: 5rem;">

    </div>
    <!-- Final del contenido principal -->
    <script src="../bootstrap-5.3.1-dist/js/bootstrap.bundle.min.js"></script>
    <script src="../js/code.jquery.com_jquery-3.7.1.min.js"></script>
    <script src="js/funciones.js"></script>
    <script src="js/funciones_usuario.js"></script>
    <script src="js/funciones_momentos.js"></script>
    <script src="js/funciones_materiales.js"></script>
    <script src="../DataTables-1.11.3/datatables.min.js"></script>
    <!-- 
    <script>
        window.addEventListener('resize', function() {
            const logoImage = document.getElementById('logoImage');
            const windowWidth = window.innerWidth;
            const originalWidth = logoImage.naturalWidth;

            if (windowWidth < originalWidth) {
                logoImage.src =
                    '../img/Logocfeverde.png'; // Cambia la ruta por la imagen que deseas mostrar al hacer zoom
                logoImage.alt = 'Otra imagen'; // Cambia el atributo alt de la imagen
            } else {
                logoImage.src = '../img/Logocfelargo.png'; // Vuelve a la imagen original
                logoImage.alt = 'Logo'; // Restaura el atributo alt
            }
        });
    </script> -->
</body>

</html>