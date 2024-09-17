<?php
class Catalogo
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }
    /** Metodo para agregar un Catalogo a un concepto a la base de datos
     * recibe objeto datos
     */

    function addCatalogo($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spCatalogoInsertar(:IdConcepto,:IdMaterial,:Cantidad);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdConcepto" => $datos->idConcepto,
                "IdMaterial" => $datos->idMaterial,
                "Cantidad" => $datos->cantidad
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }

    /*Método para obtener todos los materiales que le corresponden al concepto
 Recibe el id del concepto para hacer la busqueda*/
    function getCatalogoMaterialesConcepto($datos)
    {

        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spCatalogoMostrar(:Id);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id
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

    /*Metodo para eliminar los materiales que tiene asignado el concepto
    recibe el id del concepto*/
    function DelCatalogo($datos)
    {

        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spCatalogoEliminar(:Id);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id
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
