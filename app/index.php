<?php
session_start();
// funcionalidad de cierre de sesion
if (isset($_GET['x']) && $_GET['x'] == 1) {
    unset($_SESSION);
    session_destroy();
    header("Location: ../index.php");
    die();
}
// funcionalidad para validar sesion iniciada
if (!isset($_SESSION['idusuario'])) {

    header("Location: ../");
    die();
}
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
    <link rel="stylesheet" href="./Usuarios/stylesperfilusuarios.css">
    <link rel="stylesheet" href="./Conceptos/stylesconceptos.css">
    <link rel="stylesheet" href="./Catalogo/stylesCatalogo.css">
    <link rel="stylesheet" href="./ManoObra/stylesManoObra.css">
    <link rel="stylesheet" href="./Maquinaria/stylesMaquinaria.css">
    <link rel="stylesheet" href="./Especificaciones/stylesEspecificaciones.css">
    <link rel="stylesheet" href="./Basicos/stylesBasicos.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <title></title>
</head>

<body>


    <!-- Navbar movil -->
    <div style="width: 100%;">
        <nav class="navMovil" id="navbar-mobil">
            <div class="logoMovil">
                <a href="index.php" class="linkIcono">
                    <img src="../img/cfedistribucionblanco.png" height="100%" alt="">
                </a>
                <div class="desMenu">
                    <div>
                        <button onClick="esconderMenu()" class="btnMenu">
                            <svg xmlns="http://www.w3.org/2000/svg" style="color: white;" width="40" height="40"
                                viewBox="0 0 24 24">
                                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    </div>
    <!-- Opciones navbar movil -->
    <div class="menuDesplegable esconder">
        <ul class="listaMenuDesplegable">
            <div class="colorUser"><a href="javascript:opcion('perfilUsu');"><?= $_SESSION['nombre'] ?><i
                        class="fa-solid fa-user"></a></i></div>
            <li class="NavOpc">
                <a class="btnTituloApartado" onclick="javascript:incio(); EstablecerPag();"
                    href="javascript:opcion('materiales');">
                    Materiales
                </a>
                <a class=" btnTituloApartado">
                    Estructuras
                </a>
                <a class="btnTituloApartado" onclick="incioConcepto();" href="javascript:opcion('conceptos');">
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
                <a class="btnTituloApartado" onclick="javascript:incioUsuario(); EstablecerPag()"
                    href="javascript:opcion('usuarios');">
                    Usuarios
                </a>
                <a class="btnTituloApartado" onclick="javascript:zonas(); EstablecerPag()"
                    href="javascript:opcion('zonas');">
                    Zonas
                </a>
                <a class="btnTituloApartado" href="index.php?x=1">
                    Cerrar Sesión
                </a>
            </li>
        </ul>
    </div>

    <!-- Navbar normal -->
    <nav class="nav">
        <div class='logo'>
            <div style="text-decoration: none; height: 100%;">
                <img src="../img/cfedistribucionblanco.png" height="60rem">
            </div>
        </div>
        <ul class='menu'>
            <li>
                <a class="opcionesMenu" onclick="preciona(this);"
                    href="javascript:opcion('conceptos');">Conceptos<br>Tarjetas PU</a>
            </li>
            <li>
                <a class="opcionesMenu" onclick="preciona(this);" href="javascript:opcion('ManoObra');">Mano de obra</a>
            </li>
            <li>
                <a class="opcionesMenu" onclick="preciona(this);" href="javascript:opcion('Maquinaria');">Maquinaria</a>
            </li>
            <li>
                <a class="opcionesMenu" onclick=" preciona(this);"
                    href="javascript:opcion('materiales');">Materiales</a>
            </li>
            <li>
                <a class="opcionesMenu" onclick=" preciona(this);" href="javascript:opcion('Basicos');">Básicos</a>
            </li>
            <li>
                <a class="opcionesMenu" onclick=" preciona(this);"
                    href="javascript:opcion('Especificaciones');">Especificaciones</a>
            </li>


        </ul>
        <ul class='usuApartado'>
            <div style="display: block;">
                <a class="opcionesMenu" href="javascript:opcion('perfilUsu');"
                    onclick="preciona(this)"><?= $_SESSION['nombre'] ?> <i class=" fa-solid fa-user"></i></a>
            </div>
            <li class="btnOpciones">
                <div style="display: flex; justify-content: end;">
                    <i id="toggleButton" style="cursor: pointer; font-size: 1.5rem; margin-top: 5px;"
                        onclick="mostrarOp()" class="fas fa-bars"></i>
                </div>
                <ul id="opc" class='MenuOpciones'>
                    <a class="tex opcionesMenu" onclick="javascript:incioUsuario(); EstablecerPag(); preciona(this)"
                        href="javascript:opcion('usuarios');">Usuarios</a>
                    <a class="tex opcionesMenu" onclick="javascript:zonas(); EstablecerPag(); preciona(this)"
                        href="javascript:opcion('zonas');">Zonas</a>
                    <a class="tex" href="index.php?x=1">Cerrar sesión</a>
                </ul>
            </li>
        </ul>

    </nav>


    <!-- Inicio del contenido principal -->
    <div id="mainContent">
    </div>
    <!-- Final del contenido principal -->

    <script src="https://unpkg.com/xlsx@0.16.9/dist/xlsx.full.min.js"></script>
    <script src="https://unpkg.com/file-saverjs@latest/FileSaver.min.js"></script>
    <script src="https://unpkg.com/tableexport@latest/dist/js/tableexport.min.js"></script>
    <script lang="javascript" src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>
    <script src="../bootstrap-5.3.1-dist/js/bootstrap.bundle.min.js"></script>
    <script src="../js/code.jquery.com_jquery-3.7.1.min.js"></script>
    <script src="js/funciones.js"></script>
    <script src="js/funciones_usuarios.js"></script>
    <script src="js/funciones_materiales.js"></script>
    <script src="js/funciones_conceptos.js"></script>
    <script src="js/funciones_ManoObra.js"></script>
    <script src="js/funciones_Maquinaria.js"></script>
    <script src="js/funciones_Tarjeta.js"></script>
    <script src="js/funciones_Basicos.js"></script>
    <script src="js/funciones_Especificaciones.js"></script>
    <script src="../DataTables-1.11.3/datatables.min.js"></script>

    <script src="js/SubCarpetaTarjeta/TarjetaMateriales.js"></script>
    <script src="js/SubCarpetaTarjeta/TarjetaManoObra.js"></script>
    <script src="js/SubCarpetaTarjeta/TarjetaMaquinaria.js"></script>
    <script src="js/SubCarpetaTarjeta/TarjetaBasicos.js"></script>
    <script>
        window.onload = function() {
            opcion('proyecto');
        };

        function mostrarOp() {
            let opc = document.querySelector("#opc");

            if (!opc.classList.contains("MenuOpcionesMostrar")) {
                opc.classList.add("MenuOpcionesMostrar");
            } else {
                opc.classList.remove("MenuOpcionesMostrar");
            }
        }


        function preciona(valor) {
            let opciones = document.querySelectorAll(".opcionesMenu");
            opciones.forEach(opcion => {
                opcion.classList.remove("precionado");
            });
            valor.classList.add('precionado');
        }

        function esconderMenu() {
            let menu = document.querySelector(".menuDesplegable");
            if (menu.classList.contains("esconder")) {
                menu.classList.remove("esconder");
            } else {
                menu.classList.add("esconder");
            }
        }


        document.addEventListener('click', function(event) {
            const opc = document.getElementById('opc');

            // Verifica si el clic ocurrió fuera del div
            if (opc.classList.contains("MenuOpcionesMostrar")) {
                if (!opc.contains(event.target)) {
                    opc.classList.remove("MenuOpcionesMostrar");
                }
            }
        });

        const toggleButton = document.getElementById('toggleButton');
        toggleButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Detiene la propagación del evento
        });
    </script>


</body>

</html>