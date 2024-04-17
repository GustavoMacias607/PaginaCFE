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
            $consulta = "call spUsuarioInsertar(0,:Nombre,:Usuario,AES_ENCRYPT(:Pass,:Clave),:Rol)";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Nombre" => $datos->nombre,
                "Usuario" => $datos->usuario,
                "Pass" => $datos->contrasena,
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
            $consulta = "SELECT u.*, d.departamento FROM tbl_usuario u, tbl_departamento d 
            WHERE usuario = :Usuario 
            AND pass = AES_ENCRYPT(:Pass, :Clave)
            AND  estado = 'A'
            AND llave_depto = iddepartamento";

            $sql = $c->prepare($consulta);
            $sql->execute(
                array("Usuario" => $datos->usuario, "Pass" => $datos->password, "Clave" => $clave)
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
    function getAllUsers()
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "SELECT u.*, d.departamento FROM tbl_usuario u, tbl_departamento d 
            WHERE llave_depto = iddepartamento";

            $sql = $c->query($consulta);

            $R['filas'] = $sql->rowCount();
            if ($R['filas'] <= 0) {
                $R['estado'] = "Sin Resultados";
            } else {
                $R['datos'] = $sql->fetchAll();
            }
            $c == null;
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
    function CheckUser($datos)
    {
        /**
         * Metodo para buscar un usuario en base a su nombre de usuario,
         * recibe un objeto con la propiedad 'usuario'
         */
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta =
                "SELECT u.*, d.departamento 
            FROM tbl_usuario u, tbl_departamento d 
            WHERE usuario = :Usuario 
            and llave_depto = iddepartamento";

            $sql = $c->prepare($consulta);
            $sql->execute(array("Usuario" => $datos->usuario));

            $R['filas'] = $sql->rowCount();
            if ($R['filas'] <= 0) {
                $R['estado'] = "Sin Resultados";
            } else {
                $R['datos'] = $sql->fetchAll();
            }
            $c == null;
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
}
