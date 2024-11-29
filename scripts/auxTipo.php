<?php
class AuxTipo
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar un concepto a una especificacion a la base de datos
     * recibe objeto datos del concepto y al tipo que se guardara
     */

    function addConcepto($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spAuxTipoInsertar(:IdTipo,:IdConcepto);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdTipo" => $datos->idTipo,
                "IdConcepto" => $datos->idconcepto,
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }

    /*Método para obtener todos los conceptos que le corresponden al concepto
   Recibe el id del tipo para hacer la busqueda*/
    function getConceptos($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spAuxTipoMostrar(:IdTipo);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdTipo" => $datos->idTipo
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

    /*Metodo para eliminar los conceptos que tiene asignado el tipo de especificacion
      recibe el id del del tipo de concepto*/
    function DelConceptos($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spAuxTipoEliminar(:IdTipo);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdTipo" => $datos->idTipo
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
