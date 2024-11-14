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
            <button type="button" class="btn btn-editar-password" data-bs-toggle="modal" data-bs-target="#CambiarcontraseñaModal"
            onclick="javascript:AddlimpiarModal();">Editar contraseña</button>

            <button type="button" class="btn btn-guardar-perfil">Guardar</button>
        </div>      
    </div>
</div>

<!-- Modal insertar contraseña -->
<div class="modal modal-perfil fade" id="CambiarcontraseñaModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Cambiar contraseña</h1>
                <button type="button" class="fa-solid fa-xmark btnclose-perfil" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-perfil">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Ingresar nueva contraseña*</label>
                    <input type="text" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;"
                        id="AddnormaInput">
                </div>
                <div class="mb-3">
                    <label for="normaInput" class="form-label" style="color: #303030;">Repetir nueva contraseña*</label>
                    <input type="text" onblur="javascript:CompruebaTieneAlgoInput(this)" class="form-control inputLleno" style="font-family: 'latoBold', sans-serif;"
                        id="AddnormaInput">
                </div>
                <div class="modal-footer modal-footer-perfil">
                    <button type="button" class="btn btn-primary"
                        onclick="javascript:AddContraseñaValidar();">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous">
</script>

