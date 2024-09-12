<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}
?>
<div class="bottom-rectangle-perfil">
    <div class="text-perfil">Perfil de usuario</div>
        <a href="index.php" class="text-inicio-perfil">
    <div>Ir al inicio</div>
    </a>
</div>


<div class="container_perfil">
    <div>
        
        <div>
            <label class="texto_perfil" for="nombre">Nombre</label>
            <div><input class="input-text-nombre" type="text"></div>
        </div>
        <div class="seccion-usu-rol">
            <div>
                <label class="texto_perfil" for="usuario">Usuario</label>
                <div>
                <input class="input-text-usuario" type="text"> 
                </div>
            </div>
            <div>     
                <label class="texto_perfil" for="rol">Rol</label>
                <div>
                <input class="input-text-rol" type="text">
                </div>
            </div>
        </div>
        <div class="pSeccion_perfil">
          <button type="button" class="btn btn-editar-password">Editar contraseña</button>
            <button type="button" class="btn btn-guardar-perfil">Guardar</button>
        </div>
        
    </div>
</div>


<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous">
</script>

