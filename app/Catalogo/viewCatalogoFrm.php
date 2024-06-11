<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>
<div class="fondBlancoCatalogo">
    <div class="bottom-rectangle-Catalogo">
        <div class="text-Catalogo">Ver catálogo</div>
            <a href="index.php" class="text-inicio-catalogo">
            <div>Ir al inicio</div>
            </a>
    </div>


    

</div>