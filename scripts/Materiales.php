<?php
class Materiales
{

    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    function getMaterialesBuscar($datos)
    {
        /*Método para obtener todos los Materiales*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            // Modificar la consulta SQL para incluir el parámetro
            $consulta = "call spMaterialesBuscarGeneral(:Buscar,:Estatus)";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Buscar" => $datos->buscar,
                "Estatus" => $datos->estatus
            ));
            unset($c);



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
    function getAllMateriales($datos)
    {

        /*Método para obtener todos los Materiales*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            if (!$datos->estatus) {
                $consulta = "call spMaterialesBuscarIdFechaPrecioUnidadTodo('Todo', 1);";
                $sql = $c->prepare($consulta);
            }

            $sql->execute();

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

    function FiltarAllMateriales($datos)
    {

        /*Método para obtener todos los Materiales*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spMaterialesBuscarIdFechaPrecioUnidadTodo(:Filtar, :Estatus);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Filtar" => $datos->unidad,
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

    function CambiarEstatusMaterial($datos)
    {
        /*Método para obtener todos los Materiales*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spMaterialesEstatus(:Id, :Estatus);";
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


    function getFiltarEstatusAllMateriales($datos)
    {

        /*Método para obtener todos los Materiales*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            if (!$datos->estatus) {
                $consulta = "call spMaterialesBuscarIdFechaPrecioUnidadTodo('Todo', 0);";
                $sql = $c->prepare($consulta);
            } else {
                $consulta = "call spMaterialesBuscarIdFechaPrecioUnidadTodo('Todo', 1);";
                $sql = $c->prepare($consulta);
            }

            $sql->execute();

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
            $consulta = "call spMaterialesModificar(:Id,:Norma,:Descripcion,:Precio,:FechaPrecio,:Unidad)";
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
