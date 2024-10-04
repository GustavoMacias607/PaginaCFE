<?php
class Maquinaria
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

    function addMaquinaria($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spMaquinariaInsertar(:Id,:Descripcion,:Unidad);";

            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id,
                "Descripcion" => $datos->descripcion,
                "Unidad" => $datos->unidad
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
    function UpdMaquinaria($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spMaquinariaModificar(:IdAnterior,:Id,:Descripcion,:Unidad);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdAnterior" => $datos->idAnterior,
                "Id" => $datos->id,
                "Descripcion" => $datos->descripcion,
                "Unidad" => $datos->unidad
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }


    function getAllMaquinaria()
    {
        /*Método para obtener todos los Materiales*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spMaquinariaMostrar();";
            $sql = $c->prepare($consulta);
            $sql->execute(); // Ejecutar la consulta
            $datos = $sql->fetchAll();

            $R['filas'] = count($datos); // Contar las filas de los resultados
            if ($R['filas'] <= 0) {
                $R['estado'] = "Sin Resultados";
            } else {
                $R['datos'] = $datos;
            }
            $c = null;
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }

    function checkMaquinaria($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spMaquinariaBuscarId(:Id);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id
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
    function CambiarEstatusMaquinaria($datos)
    {
        /*Método para obtener todos los Materiales*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spMaquinariaEstatus(:Id, :Estatus);";
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
}
