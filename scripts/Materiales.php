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
            $consulta = "call spMaterialesInsertar(:Codigo,:Descripcion,:Precio, :Unidad,1)";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Codigo" => $datos->codigo,
                "Descripcion" => $datos->descripcion,
                "Precio" => $datos->precio,
                "Unidad" => $datos->unidad

            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
}
