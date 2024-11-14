<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}

?>

<div class="fondBlanco">
    <div class="bottom-rectangle-proyecto">
    <div class="text-materiales">Proyectos</div>

    </div>
    <div class="label-container-proyecto">
        <input type="text" placeholder="Buscar" id="search-inputProyecto">
        <i class="fas fa-search icon-proyecto" id="searchIcon"></i>
    </div>
    <div class="pagRegistrosconceptos">
        <label for="" class="titulos-tiposde-proyecto">En proceso</label>
        <label for="" class="titulos-tiposde-proyecto">Terminados</label>
    </div>
    

</div>

