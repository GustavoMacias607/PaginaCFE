<?php
class Materiales
{

    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }


    //Metodo para cambiar el estatus del material
    //Recibe un objeto con los datos
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

    // Metodo para filtrar los datos
    //Recibe un objeto con los datos
    function getFiltarEstatusAllMateriales($datos)
    {
        /*Método para obtener todos los Materiales*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            if (!$datos->estatus) {
                $consulta = "call spMaterialesBuscarIdFechaPrecioUnidadTodo('Estatus', 0,:Unidad,:Buscar);";
                $sql = $c->prepare($consulta);
                $sql->execute(array(
                    "Unidad" => $datos->unidad,
                    "Buscar" => $datos->buscar,
                ));
            } else {
                $consulta = "call spMaterialesBuscarIdFechaPrecioUnidadTodo('Estatus', 1,:Unidad,:Buscar);";
                $sql = $c->prepare($consulta);
                $sql->execute(array(
                    "Unidad" => $datos->unidad,
                    "Buscar" => $datos->buscar,
                ));
            }
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

    //Metodo para agregar materiales
    //Recibe un objeto con los datos
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

    //Metodo para actualizar materiales
    //Recibe un objeto con los datos
    function UpdateMateriales($datos)
    {
        /*Metodo para agregar Materiales*/
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spMaterialesModificar(:IdA,:Id,:Norma,:Descripcion,:Precio,:FechaPrecio,:Unidad)";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id,
                "IdA" => $datos->idA,
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
}