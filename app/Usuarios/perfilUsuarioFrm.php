<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}
?>


    <div class="bottom-rectangle-perfil">
        <div class="text-perfil">Perfil de usuario</div>
    </div>


<div class="container_perfil">
    <div class="texto_perfil">Nombre</div>
        <div class="label-container-perfil">
            <input type="text">      
        </div>
    <div class="texto_perfil">Usuario</div>
        <div class="label-container-perfil">
            <input type="text">      
        </div>
    <div class="botones_perfil"> <button type="button" class="btn btn-editar-password">Editar contraseña</button> </div>
        
    <div class="texto_perfil">Rol</div>
        <div class="label-container-perfil">
            <input type="text">      
        </div>
    </div>
    <div class="botones_perfil"> <button type="button" class="btn btn-guardar-perfil">Guardar</button> </div>
</div>


    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous">
</script>