<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

<div class="fondBlanco">
    <div class="bottom-rectangle-materiales">

    </div>


</div>