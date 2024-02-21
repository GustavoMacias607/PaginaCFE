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

    <title></title>
</head>

<body>
    <!-- Inicio del navbar -->
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Navbar</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-gear"></i> Configuración
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="javascript:opcion('admonUser');">Usuarios</a></li>
                            <li><a class="dropdown-item" href="javascript:opcion('momentos');">Momentos</a></li>
                            <!-- <li>
                                <hr class="dropdown-divider">
                            </li> -->
                            <!-- <li><a class="dropdown-item" href="#">Something else here</a></li> -->
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                    </li>
                </ul>
                <form class="d-flex" role="search">
                    <a class="btn btn-outline-danger" href="index.php?x=1">Salir</a>
                </form>
            </div>
        </div>
    </nav>
    <!-- fin de navbar -->

    <!-- Inicio del contenido principal -->
    <div id="mainContent" class="contaniner">
        <h1>Bienvenido <?= $_SESSION['nombre'] ?></h1>
    </div>
    <!-- Final del contenido principal -->
    <script src="../bootstrap-5.3.1-dist/js/bootstrap.bundle.min.js"></script>
    <script src="../js/code.jquery.com_jquery-3.7.1.min.js"></script>
    <script src="js/funciones.js"></script>
    <script src="js/funciones_usuario.js"></script>
    <script src="js/funciones_momentos.js"></script>
    <script src="../DataTables-1.11.3/datatables.min.js"></script>
</body>

</html>