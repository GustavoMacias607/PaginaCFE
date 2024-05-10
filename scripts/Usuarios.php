<?php
class Usuario
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar un usuario a la base de datos
     * recibe objeto datos
     * recibe clave para encriptar contraseña
     * devuelve arreglo con clave de estado
     */

    function addUser($datos, $clave)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spUsuarioInsertar(:Nombre, :Usuario, :Pass,:Clave,:Rol);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Nombre" => $datos->nombre,
                "Usuario" => $datos->usuario,
                "Pass" => $datos->pass,
                "Clave" => $clave,
                "Rol" => $datos->rol
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
    function UpdUser($datos, $clave)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spUsuarioModificar(:Id,:Nombre, :Usuario, :Pass,:Clave,:Rol);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id,
                "Nombre" => $datos->nombre,
                "Usuario" => $datos->usuario,
                "Pass" => $datos->pass,
                "Clave" => $clave,
                "Rol" => $datos->rol
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
    function getUserLogin($datos, $clave)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spUsuarioLogIn(:Usuario, :Pass, :Clave)";

            $sql = $c->prepare($consulta);
            $sql->execute(
                array(
                    "Usuario" => $datos->usuario,
                    "Pass" => $datos->password,
                    "Clave" => $clave
                )
            );
            $R['filas'] = $sql->rowCount();
            if ($R['filas'] != 1) {
                $R['estado'] = "Usuario y/o Contraseña incorrectos";
            } else {
                $R['datos'] = $sql->fetchAll();
            }
            $c == null;
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }

    function getAllUsers($datos)
    {
        /*Método para obtener todos los Materiales*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spUsuarioBuscarIdNombreUsuario(:Estatus,:Rol,:Buscar);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Estatus" => $datos->estatus,
                "Rol" => $datos->rol,
                "Buscar" => $datos->buscar,
            ));

            $R['filas'] = $sql->rowCount();
            if ($R['filas'] <= 0) {
                $R['estado'] = "Sin Resultados";
            } else {
                $R['datos'] = $sql->fetchAll();
            }
            $c = null;
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
    function CambiarEstatusUsuario($datos)
    {
        /*Método para obtener todos los Materiales*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spUsuarioEstatus(:Id, :Estatus);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id,
                "Estatus" => $datos->estatus
            ));
            $R['filas'] = $sql->rowCount();
            if ($R['filas'] <= 0) {
                $R['estado'] = "Sin Resultados";
            } else {
                $R['datos'] = $sql->fetchAll();
            }
            $c = null;
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }

    function checkUsuario($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spUsuarioBuscarNombre(:Usuario);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Usuario" => $datos->usuario

            ));
            $R['filas'] = $sql->rowCount();
            if ($R['filas'] > 0) {
                $R['estado'] = "A";
            } else {
                $R['estado'] = "N";
            }
            $c = null;
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
}