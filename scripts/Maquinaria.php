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
            $consulta = "call spMaquinariaInsertar(:Id,:Descripcion,:Unidad,:PhM, :RhM);";

            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id,
                "Descripcion" => $datos->descripcion,
                "Unidad" => $datos->unidad,
                "PhM" => $datos->phm,
                "RhM" => $datos->rhm,
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
            $consulta = "call spManoObraModificar(:IdAnterior,:Id,:Categoria,:Unidad,:Salario, :Cantidad,:Rendimiento);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdAnterior" => $datos->idAnterior,
                "Id" => $datos->id,
                "Categoria" => $datos->categoria,
                "Unidad" => $datos->unidad,
                "Salario" => $datos->salario,
                "Cantidad" => $datos->cantidad,
                "Rendimiento" => $datos->rendimiento
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }


    function getAllMaquinaria($datos)
    {
        /*Método para obtener todos los Materiales*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spManoObraMostrar(:Estatus,:Buscar,:Categoria,:Unidad);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Estatus" => $datos->estatus,
                "Buscar" => $datos->buscar,
                "Categoria" => $datos->categoria,
                "Unidad" => $datos->unidad,

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

    function checkMaquinaria($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spManoObraBuscarId(:Id);";
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

            $consulta = "call spManoObraEstatus(:Id, :Estatus);";
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
