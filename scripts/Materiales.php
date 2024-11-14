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
    function getAllMateriales()
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "select * from vstmateriales;";
            $sql = $c->prepare($consulta);
            $sql->execute(); // Ejecutar la consulta
            $datos = $sql->fetchAll();

            $R['filas'] = count($datos); // Contar las filas de los resultados
            if ($R['filas'] <= 0) {
                $R['estado'] = "Sin Resultados";
            } else {
                $R['datos'] = $datos;
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
            $consulta = "call spMaterialesInsertar(:Id,:Norma,:Descripcion,:Precio,:FechaPrecio, :Unidad,:Familia)";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id,
                "Norma" => $datos->norma,
                "Descripcion" => $datos->descripcion,
                "Precio" => $datos->precio,
                "FechaPrecio" => $datos->precioFecha,
                "Unidad" => $datos->unidad,
                "Familia" => $datos->familia

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
            $consulta = "call spMaterialesModificar(:IdA,:Id,:Norma,:Descripcion,:Precio,:FechaPrecio,:Unidad,:Familia)";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id,
                "IdA" => $datos->idA,
                "Norma" => $datos->norma,
                "Descripcion" => $datos->descripcion,
                "Precio" => $datos->precio,
                "FechaPrecio" => $datos->precioFecha,
                "Unidad" => $datos->unidad,
                "Familia" => $datos->familia

            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }

    /*Método para buscar un material por Id
     Recibe un objeto con el id del material a buscar*/
    function BuscarMaterialId($datos)
    {

        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spMaterialesBuscarId(:Id);";
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

    /*Método para obtener todas las unidades de los materiales*/
    function getAllUnidadesMateriales()
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spMaterialesUnidades();";
            $sql = $c->prepare($consulta);
            $sql->execute();
            $datos = $sql->fetchAll();

            $R['filas'] = count($datos);
            if ($R['filas'] <= 0) {
                $R['estado'] = "Sin Resultados";
            } else {
                $R['datos'] = $datos;
            }
            $c = null;
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
}
