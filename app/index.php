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
    <link rel="stylesheet" href="Navbar.css">
    <link rel="stylesheet" href="NavbarMovile.css">
    <link rel="stylesheet" href="./Materiales/stylesmateriales.css">
    <link rel="stylesheet" href="./Usuarios/stylesusuarios.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <title></title>
</head>

<body>


    <!-- Navbar movil -->
    <div style="width: 100%;">
        <nav class="navMovil" id="navbar-mobil">
            <div class="logoMovil">
                <a href="index.php" class="linkIcono">
                    <img src="../img/Logocfelargo.png" height="100%" alt="">
                </a>
                <div class="desMenu">
                    <button onClick="esconderMenu()" class="btnMenu">
                        <svg xmlns="http://www.w3.org/2000/svg" style="color: white;" width="40" height="40"
                            viewBox="0 0 24 24">
                            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    </div>
    <!-- Opciones navbar movil -->
    <div class="menuDesplegable esconder">
        <ul class="listaMenuDesplegable">
            <li class="NavOpc">
                <a class="btnTituloApartado" onclick="javascript:incio()" href="javascript:opcion('materiales');">
                    Materiales
                </a>
                <a class=" btnTituloApartado">
                    Estructuras
                </a>
                <a class="btnTituloApartado" href="javascript:opcion('conceptos');">
                    Conceptos
                </a>
                <a class="btnTituloApartado">
                    Button 4
                </a>
                <a class="btnTituloApartado">
                    Button 5
                </a>
            </li>
            <li class="NavUsu">
                <a class="btnTituloApartado" href="javascript:opcion('usuarios');">
                    Usuarios
                </a>
                <a class="btnTituloApartado" href="../">
                    Cerrar Sesión
                </a>

            </li>
        </ul>

    </div>

    <!-- Navbar normal -->
    <nav class="nav">
        <div class='logo'>
            <a style="text-decoration: none;" href="./">
                <img src="../img/Logocfelargo.png" height="40rem">
            </a>
        </div>
        <ul class='menu'>
            <li>
                <a class="opcionesMenu" onclick="javascript:incio()"
                    href="javascript:opcion('materiales');">Materiales</a>
            </li>
            <li>
                <a class="opcionesMenu">Estructuras</a>
            </li>
            <li>
                <a class="opcionesMenu" href="javascript:opcion('conceptos');">Conceptos</a>
            </li>
            <li>
                <a class="opcionesMenu">Button 4</a>
            </li>
            <li>
                <a class="opcionesMenu">Button 5</a>
            </li>
        </ul>
        <ul class='menu'>
            <li>
                <i class="fas fa-bars"></i>
                <ul class='MenuOpciones'>
                    <a class="tex" href="javascript:opcion('usuarios');">Usuarios</a>
                    <a class="tex" href="../">Cerrar sesión</a>
                </ul>
            </li>
        </ul>

    </nav>


    <!-- Inicio del contenido principal -->
    <div id="mainContent">

    </div>
    <!-- Final del contenido principal -->
    <script src="../bootstrap-5.3.1-dist/js/bootstrap.bundle.min.js"></script>
    <script src="../js/code.jquery.com_jquery-3.7.1.min.js"></script>
    <script src="js/funciones.js"></script>
    <script src="js/funciones_usuario.js"></script>
    <script src="js/funciones_momentos.js"></script>
    <script src="js/funciones_materiales.js"></script>
    <script src="../DataTables-1.11.3/datatables.min.js"></script>
    <script>
    function esconderMenu() {
        let menu = document.querySelector(".menuDesplegable");
        if (menu.classList.contains("esconder")) {
            menu.classList.remove("esconder");
        } else {
            menu.classList.add("esconder");
        }
    }
    </script>
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