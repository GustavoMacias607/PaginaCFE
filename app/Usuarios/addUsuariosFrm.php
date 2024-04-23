<?php

session_start();
/*
if (!isset($_SESSION['idusuario'])) {
    header("Location: ../../index.php");
    die();
}
*/
require("../../scripts/connect.php");
require("../../scripts/Conexion.php");
//require("../../scripts/Usuarios.php");

$c = new Conexion($conData);
//$m = new Usuarios($c->getConnection());
$datos = array(
    "estatus" => false
);
//$resM = $m->getAllUsuarios($datos);
?>


<div class="">

    <div class="fondBlanco">
        <div class="bottom-rectangle-materiales">
            <div class="text-materiales">Usuarios</div>
            <button type="button" class="btn btn-agregar-material" data-bs-toggle="modal" data-bs-target="#AgregarModal" onclick="javascript:AddlimpiarModal();">Agregar
                usuario</button>
        </div>
        <div class="label-container-materiales">
            <input type="text" placeholder="Buscar" id="searchInput" oninput="GetMateriales();EstablecerPag()">
            <i class="fas fa-search icon-materiales" id="searchIcon"></i>
        </div>


        <!-- Paginacion  -->

        <div class="pagRegistrosmateriales">
            <nav class="pSeccion">
                <ul class="pagination" id="pagination-list">
                    <!-- Aquí se agregarán dinámicamente los enlaces de página -->
                    <li class="page-item active"></li>
                </ul>

                <div class="cantregmateriales">
                    <div class="text">Mostrar</div>
                    <select class="cantregistrosmateriales" name="" id="cantRegistros" onchange="javascript:cambiarTamano()">
                        <option value="10" selected>10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <div class="text">Registros </div>
                </div>

            </nav>

            <div class="toggle-estatus-materiales">
                <div class="text">Estatus</div>
                <div class="">
                    <input style="display: none;" type="checkbox" id="ValCheEsta" checked>
                    <img id="ValEstatus" src="../img/toggle_on_35px.png" onclick="javascript:valStatus(); javascript:GetMateriales(); javascript:EstablecerPag()">
                </div>
            </div>
        </div>

    </div>



    <div class="contTabla-materiales">
        <div class="tabla-container tabla-container-materiales">
            <table id="tabla-materiales">
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
                                <select class="form-select form-select-sm ml-2" id="selectUnidad" onchange="javacript:GetFiltrarUnidad()" style="background-color: #008E5A; color:#ffffff; border: none; font-family: 'LatoBold', sans-serif;">
                                    <option value="todo" selected>Todo</option>
                                    <option value="admin">Administrador</option>
                                    <option value="usuarioUno">Usuario uno</option>
                                    <option value="Usuariodos">Usuario dos</option>
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
                <tbody>
                    <td colspan="8">Sin resultados</td>
                </tbody>
            </table>
        </div>
    </div>

</div>

<!-- Modal insertar usuario -->
<div class="modal modal-usuarios" id="AgregarModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="border: 3px solid #008E5A;">
            <div class="modal-header" style="border-bottom: 2px solid #008E5A;">
                <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Agregar usuario</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="idInput" class="form-label" style="color: #303030;">ID</label>
                    <input type="text" class="form-control" id="AddidInput" style="border: 3px solid #008E5A;">
                </div>
                <div class="mb-3">
                    <label for="nombreInput" class="form-label" style="color: #303030;">Nombre</label>
                    <input type="text" class="form-control" id="AddnombreInput" style="border: 3px solid #008E5A;">
                </div>
                <div class="mb-3">
                    <label for="usuarioInput" class="form-label" style="color: #303030;">Usuario</label>
                    <input class="form-control" id="AddusuarioInput" rows="3" style="border: 3px solid #008E5A;">
                </div>
                <div class="mb-3">
                    <label for="passInput" class="form-label" style="color: #303030;">Contraseña</label>
                    <input class="form-control" id="AddpassInput" rows="3" style="border: 3px solid #008E5A;">
                </div>
                <div class="mb-3">
                    <label for="passconfirmInput" class="form-label" style="color: #303030;">Confirme su
                        contraseña</label>
                    <input class="form-control" id="AddpassInput" rows="3" style="border: 3px solid #008E5A;">
                </div>
                <div class="mb-3">
                    <label for="rolInput" class="form-label" style="color: #303030;">Rol</label>
                    <select class="form-select" id="AddrolInput" style=" border: 3px solid #008E5A;">
                        <option selected></option>
                        <option value="ADMIN">Administrador</option>
                        <option value="USUUNO">Usuario uno</option>
                        <option value="USUDOS">Usuario dos</option>
                    </select>
                </div>
                <div class="modal-footer-usuarios" style="color: none">
                    <button type="button" class="btn btn-primary" onclick="javascript:AddUsuarioValidar();" style="background-color: #008E5A; border-color: #008E5A;">Guardar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal modificar Usuario-->
    <div class="modal fade" id="EditarModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content" style="border: 3px solid #008E5A;">
                <div class="modal-header" style="border-bottom: 2px solid #008E5A;">
                    <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: #303030;">Modificar usuario</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body modal-body-usuarios">
                    <input type="text" class="form-control d-none" id="idAnterior" style="border: 3px solid #008E5A;">
                    <div class="mb-3">
                        <label for="idInput" class="form-label" style="color: #303030;">ID</label>
                        <input type="text" class="form-control" id="UpdidInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="nombreInput" class="form-label" style="color: #303030;">Nombre</label>
                        <input type="text" class="form-control" id="UpdnombreInput" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="usuarioInput" class="form-label" style="color: #303030;">Usuario</label>
                        <input class="form-control" id="UpdusuarioInput" rows="3" style="border: 3px solid #008E5A;">
                    </div>
                    <div class="mb-3">
                        <label for="urolInput" class="form-label" style="color: #303030;">Rol</label>
                        <select class="form-select" id="UpdrolInput" style="border: 3px solid #008E5A;" disabled>
                            <option selected></option>
                            <option value="ADMIN">Administrador</option>
                            <option value="USUUNO">Usuario uno</option>
                            <option value="USUDOS">Usuario dos</option>
                        </select>
                    </div>
                </div>
                <div class=" modal-footer" style="color: none">
                    <button type="button" class="btn btn-primary" style="background-color: #008E5A; border-color: #008E5A;" onclick="javascript:UpdUsuarioValidar()">Guardar</button>
                </div>
            </div>
        </div>
    </div>


    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous">
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