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
            $consulta = "call spMaterialesMostrar(1000);";

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
            $consulta = "call spMaterialesInsertar(:Id,:Norma,:Descripcion,:Precio,:FechaPrecio, :Unidad)";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id,
                "Norma" => $datos->norma,
                "Descripcion" => $datos->descripcion,
                "Precio" => $datos->precio,
                "FechaPrecio" => $datos->precioFecha,
                "Unidad" => $datos->unidad

            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }

    function UpdateMateriales($datos)
    {
        /*Metodo para agregar Materiales*/
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spMaterialesInsertar(:Id,:Norma,:Descripcion,:Precio,:FechaPrecio, :Unidad)";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id,
                "Norma" => $datos->norma,
                "Descripcion" => $datos->descripcion,
                "Precio" => $datos->precio,
                "FechaPrecio" => $datos->precioFecha,
                "Unidad" => $datos->unidad

            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }

    function CheckMaterial($datos)
    {
        /**
         * Metodo para comprobar que el Material no exista
         * recibe un objeto con el Material
         */
        $R['estado'] = 'OK';

        $c = $this->conn;
        try {
            $consulta =
                "call spMaterialesBuscarID(:Id)";

            $sql = $c->prepare($consulta);
            $sql->execute(array("Id" => $datos->id));

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
