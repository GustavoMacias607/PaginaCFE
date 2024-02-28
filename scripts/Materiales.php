<?php
class Materiales
{

    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }



    function getAllMateriales()
    {
        /*Metodo para obtener todos los Materiales*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spMaterialesMostrar();";

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

    function addMateriales($datos)
    {
        /*Metodo para agregar Materiales*/
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spMaterialesInsertar();";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Momento" => $datos->momento,
                "Orden" => $datos->orden,
                "Responsable" => $datos->responsable,

            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
}
