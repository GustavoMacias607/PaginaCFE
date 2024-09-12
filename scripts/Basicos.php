<?php
class Basicos
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar un Material Basico a la base de datos
     * recibe objeto datos
     */

    function addBasico($datos)
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
    /** Metodo para modificar un material basico de la base de datos
     * recibe objeto datos
     */
    function UpdBasico($datos)
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

    /** Metodo para mostrar los materiales basicos existentes en la base de datos
     * recibe objeto datos con los filtros necesarios para la consulta a la base de datos
     * 
     */
    function getAllBasicos($datos)
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
    /** Metodo para buscar el material basico en la base de datos y ver si existe
     * recibe el id del material basico
     */
    function checkBasico($datos)
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

    /** Metodo para habilitar o desabilitar el material basico
     * recibe el id del material asi como el estado al cual se cambiara
     */
    function CambiarEstatusBasico($datos)
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
