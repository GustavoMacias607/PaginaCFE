<?php
class ManoObra
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar una mano de obra a la base de datos
     * recibe objeto datos de la mano de obra
     */

    function addManoObra($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spManoObraInsertar(:Id,:Categoria,:Unidad,:Salario, :Cantidad,:Rendimiento);";

            $sql = $c->prepare($consulta);
            $sql->execute(array(
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
    /** Metodo para modificar una mano de obra
     * recibe objeto datos de la mano de obra a la cual se modificara
     */
    function UpdManoObra($datos)
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

    /** Metodo para obtener las manos de obra existentes
     * recibe un objeto con los datos a filtrar sobre las manos de obras existentes
     */
    function getAllManoObra($datos)
    {

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
    /**Metodo para verificar si una mano de obra ya existe
     * recibe un objeto que contiene el id de la mano de obra
     */
    function checkManoObra($datos)
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
    /**Metodo para cambiar el estatus de las manos de obra 
     * recibe un objeto con el id de la mano de obra y a cual estatus cambiara la mano de obra
     */
    function CambiarEstatusManoObra($datos)
    {

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
