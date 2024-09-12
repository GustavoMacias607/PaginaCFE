<?php
class Especificaciones
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar una especificacion a la base de datos
     * recibe objeto datos
     */

    function addEspecificacion($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spConceptosInsertar(:Id,:Tipo,:Unidad,:Nombre, :Plazo);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id,
                "Tipo" => $datos->tipo,
                "Unidad" => $datos->unidad,
                "Nombre" => $datos->nombre,
                "Plazo" => $datos->plazo
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
    /** Metodo para modificar una especificacion de la base de datos
     * recibe objeto datos
     */
    function UpdEspecificacion($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spConceptosModificar(:IdAnterior,:Id,:Tipo,:Unidad,:Nombre, :Plazo);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdAnterior" => $datos->idAnterior,
                "Id" => $datos->id,
                "Tipo" => $datos->tipo,
                "Unidad" => $datos->unidad,
                "Nombre" => $datos->nombre,
                "Plazo" => $datos->plazo
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }

    /** Metodo para mostrar las especificaciones existentes de la base de datos
     * recibe objeto datos con los filtros necesarios para la consulta a la base de datos
     * 
     */
    function getAllEspecificacion($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spConceptoBuscarTipoUnidadNombrePlazo(:Estatus,:Tipo,:Unidad, :Buscar,:OrderId, :OrderNombre);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Estatus" => $datos->estatus,
                "Tipo" => $datos->tipo,
                "Unidad" => $datos->unidad,
                "Buscar" => $datos->buscar,
                "OrderId" => $datos->orderId,
                "OrderNombre" => $datos->orderNombre,
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
    /** Metodo para buscar la especificacion en la base de datos y ver si existe
     * recibe el id de la especificacion
     */
    function checkEspecificacion($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spConceptoBuscarId(:Id);";
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

    /** Metodo para habilitar o desabilitar la especificacion
     * recibe el id de la especificacion asi como el estado al cual se cambiara
     */
    function CambiarEstatusEspecificacion($datos)
    {

        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spConceptoEstatus(:Id, :Estatus);";
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
