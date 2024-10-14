<?php

session_start();

if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}
?>

<div class="fondBlanco">
    <div class="bottom-rectangle-usuarios">
        <div class="text-usuarios">Usuarios</div>
        <button type="button" class="btn btn-agregar-material" data-bs-toggle="modal" data-bs-target="#AgregarModal"
            onclick="javascript:AddlimpiarModalUsuario();">Agregar usuario</button>
        <a href="index.php" class="text-inicio-usuarios">
            <div>Ir al inicio</div>
        </a>
    </div>
    <div class="label-container-usuarios">
        <form autocomplete="off">
            <input type="text" placeholder="Buscar" id="search-inputUsuario" placeholder="Buscar" name="no-autocomplete"
                autocomplete="off">
            <i class="fas fa-search icon-usuarios" id="searchIcon"></i>
        </form>
    </div>


    <!-- Paginacion  -->
    <div class="pagRegistrosusuarios">
        <nav class="pSeccion">
            <div class="cantregusuarios">
                <div class="text">Mostrar</div>
                <select class="cantregistrosmanodeobra" id="rows-per-page">
                    <option value="10" selected>10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <div class="text">Registros </div>
            </div>

            <ul class="pagination" id="pagination">
                <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                <li class="page-item active"></li>
            </ul>

        </nav>
        <div class="toggle-estatus-usuarios">
            <div class="text">Estatus</div>
            <div class="">
                <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                <img id="ValEstatus" src="../img/toggle_on_35px.png" onclick="javascript:valStatusUsuario();">
            </div>
        </div>
    </div>

</div>



<div class="contTabla-usuarios">
    <div class="tabla-container tabla-container-usuarios">
        <table id="tabla-usuarios">
            <thead class="">
                <tr>
                    <th>
                        ID
                    </th>
                    <th>
                        Nombre
                    </th>
                    <th>
                        Usuario
                    </th>
                    <th class=" col-1" style="width: 140px;">
                        <div class="d-flex align-items-center">
                            <span>Rol: </span>
                            <select class="form-select form-select-sm ml-2" id="selectUsuarios"
                                style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                <option value="" selected>Todo</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Invitado">Invitado</option>
                                <option value="Constructor">Constructor</option>
                            </select>
                        </div>
                    </th>
                    <th class="col-1" style="width: 170px;">
                        <div style="display: flex; min-width: 144px; justify-content: space-between;">
                            <span>Acciones</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody id="table-bodyUsuario">
                <!-- Aquí se llenará con los registros -->
            </tbody>
        </table>
    </div>
</div>

</div>

<!-- Modal insertar usuario -->
<div class="modal modal-usuarios fade" id="AgregarModal" tabindex="9999" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar usuario</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form name="no-autocomplete" autocomplete="off">
                <div class="modal-body modal-body-usuarios">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                    <div class="mb-3">
                        <label for="nombreInput" class="form-label" style="color: #303030;">Nombre*</label>
                        <input type="text" class="form-control inputLleno"
                            onblur="javascript:CompruebaTieneAlgoInputUsuario(this)" id="AddnombreInput">
                    </div>
                    <div class="mb-3">
                        <label for="AddusuarioInput" class="form-label" style="color: #303030;">Usuario*</label>
                        <input class="form-control inputLleno"
                            onblur="javascript:CompruebaTieneAlgoInputUsuario(this); checkUsuario('Add');"
                            id="AddusuarioInput" rows="3">
                    </div>
                    <div class="mb-3">
                        <label for="AddpassInput" class="form-label" style="color: #303030;">Contraseña*</label>
                        <input type="password" class="form-control inputLleno"
                            onblur="javascript:CompruebaTieneAlgoInputUsuario(this)" id="AddpassInput" rows="3">
                    </div>
                    <div class="mb-3">
                        <label for="passconfirmInput" class="form-label" style="color: #303030;">Confirme su
                            contraseña*</label>
                        <input type="password" class="form-control inputLleno" id="AddConfirpassInput"
                            onblur="javascript:ComprobarContrasenas();javascript:CompruebaTieneAlgoInputUsuario(this)"
                            rows="3">
                    </div>
                    <div class="mb-3">
                        <label for="rolInput" class="form-label" style="color: #303030;">Rol*</label>
                        <select class="form-select inputLleno" onblur="javascript:CompruebaTieneAlgoInputUsuario(this)"
                            id="AddrolInput">
                            <option selected value="">Selecciona una opción</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Invitado">Invitado</option>
                            <option value="Constructor">Constructor</option>
                        </select>
                    </div>
                    <div class="modal-footer modal-footer-usuarios">
                        <button type="button" class="btn btn-primary"
                            style="background-color: #008E5A; border: 3px solid #008E5A;"
                            onclick="javascript:AddUsuarioValidar();">Guardar</button>
                    </div>

                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal modificar Usuario-->
<div class="modal modal-usuarios fade" id="EditarModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: none;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Modificar usuario</h1>

                <button type="button" class="fa-solid fa-xmark btnclose-usuarios" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <form autocomplete="off">
                <div class="modal-body modal-body-usuarios">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Es requerido: *</h1>
                    <input type="text" class="form-control d-none" id="UpUsuAnterior"
                        style="border: 3px solid #008E5A;">
                    <div class="mb-3 d-none">
                        <label for="idInput" class="form-label" style="color: #303030;">ID</label>
                        <input type="text" class="form-control" id="UpdidInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="nombreInput" class="form-label" style="color: #303030;">Nombre*</label>
                        <input type="text" class="form-control inputLleno" id="UpdnombreInput"
                            onblur="javascript:CompruebaTieneAlgoInputUsuario(this)">
                    </div>
                    <div class="mb-3">
                        <label for="usuarioInput" class="form-label" style="color: #303030;">Usuario*</label>
                        <input class="form-control inputLleno" id="UpdusuarioInput" rows="3"
                            onblur="javascript:CompruebaTieneAlgoInputUsuario(this); checkUsuario('upd');">
                    </div>
                    <div class="mb-3">
                        <label for="urolInput" class="form-label" style="color: #303030;">Rol*</label>
                        <select class="form-select inputLleno" id="UpdrolInput"
                            onblur="javascript:CompruebaTieneAlgoInputUsuario(this)">
                            <option selected value="">Selecciona una opción</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Invitado">Invitado</option>
                            <option value="Constructor">Constructor</option>
                        </select>
                    </div>
                    <hr>
                    <div class="mb-3">
                        <label for="passInput" class="form-label" style="color: #303030;">Nueva contraseña para el
                            usuario</label>
                        <input type="password" class="form-control inputLleno"
                            onblur="javascript:CompruebaTieneAlgoInputUsuario(this)" id="UpdpassInput" rows="3">
                    </div>
                
                    <div class=" modal-footer modal-footer-usuarios">
                        <button type="button" class="btn btn-primary"
                            style="background-color: #008E5A; border: 3px solid #008E5A;"
                            onclick="javascript:UpdUsuarioValidar()">Guardar</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>


<!-- modal para activar el registro de usuarios -->
<div class="modal" id="confirmActivationModal" tabindex="-1" aria-labelledby="activationModalLabel" aria-hidden="true"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header" style="border: 3px solid #008e5a; border-radius: 5px;">
                <h5 class="modal-title" id="activationModalLabel" style="font-family: 'LatoBold', sans-serif;">
                    ¿Habilitar este usuario?</h5>
                <button type="button" class="btn" id="confirmActivationButton"
                    onclick="javascript:ActivarCerrarModal(); CambioEstatusUsuario();"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif;">Habilitar</button>
                <button type="button" class="btn" data-bs-dismiss="modal"
                    style="background-color: #858585; color: #ffffff; font-family: 'LatoBold', sans-serif;">Cancelar</button>
            </div>
        </div>
    </div>
</div>


<!-- Modal de Confirmación de Eliminación -->
<div class="modal" id="confirmDeleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header" style=" border: 3px solid #008e5a; border-radius: 5px;">
                <h5 class="modal-title" id="exampleModalLabel" style="font-family: 'LatoBold', sans-serif;">
                    ¿Deshabilitar este usuario?</h5>
                <button type="button" class="btn" data-bs-dismiss="modal" onclick="javascript:AbrirModalConfirm();"
                    id="confirmDeleteButton"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif;">Deshabilitar</button>
                <button type="button" class="btn" data-bs-dismiss="modal"
                    style="background-color: #858585; color: #ffffff; font-family: 'LatoBold', sans-serif;">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal de Confirmación Adicional -->
<div class="modal" id="confirmAdditionalModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
    style="z-index: 4000; color: #303030; top: 194px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header"
                style=" border: 3px solid #008e5a; border-radius: 5px; width: 700px; background-color: #ffffff; align-self: center;">
                <h5 class="modal-title" id="exampleModalLabel" style="font-family: 'LatoBold', sans-serif;">¿Está
                    seguro de que desea deshabilitar este usuario?</h5>
                <button type="button" onclick="javascript:EliminarCerrarModal(); CambioEstatusUsuario();" class="btn"
                    id="confirmAdditionalButton"
                    style="background-color: #008e5a; color: #ffffff; font-family: 'LatoBold', sans-serif; ">Confirmar</button>
                <button type="button" class="btn" data-bs-dismiss="modal"
                    style="background-color: #858585; color: #ffffff; font-family: 'LatoBold', sans-serif;">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal Mensaje -->
<div class="centrarMsg modMsgEsconder" id="modalMsgUsuarios">
    <div class="modMsg" id="modUsu">
        <div class="modImg">
            <img id="imgPic" src="../img/imgPalomita.png" alt="Mensaje" height="100%">
        </div>
        <div class="modCon">
            <p id="modParrafo"></p>
        </div>
    </div>
</div>



<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous">
</script>
<script>
    window.addEventListener('resize', function() {
        const logoImage = document.getElementById('logoImage');
        const windowWidth = window.innerWidth;
        const originalWidth = logoImage.naturalWidth;

        if (windowWidth < originalWidth) {
            logoImage.src =
                'img/Logocfeverde.png'; // Cambia la ruta por la imagen que deseas mostrar al hacer zoom
            logoImage.alt = 'Otra imagen'; // Cambia el atributo alt de la imagen


        } else {
            logoImage.src = 'img/Logocfelargo.png'; // Vuelve a la imagen original
            logoImage.alt = 'Logo'; // Restaura el atributo alt
        }
    });
</script>