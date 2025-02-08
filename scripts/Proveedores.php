<?php
class Proveedores
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar un proveedor a la base de datos
     * recibe objeto datos
     */

    function addProveedor($datos)
    {
        //Metodo para agregar un Proveedor a la base de datos
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spProveedoresInsertar(:NombreProveedor,:NoPropuesta,:Fecha);";

            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "NombreProveedor" => $datos->nombreProveedor,
                "NoPropuesta" => $datos->propuesta,
                "Fecha" => $datos->fecha,
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
    function UpdProveedor($datos)
    {
        // Metodo para modificar un Proveedor
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spProveedoresModificar(:IdProveedor,:NombreProveedor,:NoPropuesta,:Fecha);";

            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdProveedor" => $datos->idProveedor,
                "NombreProveedor" => $datos->nombreProveedor,
                "NoPropuesta" => $datos->propuesta,
                "Fecha" => $datos->fecha,
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }


    function getAllProveedores()
    {
        /*Método para obtener todas los Proveedores*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spProveedoresMostrar();";
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
}



class AuxProveedores
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar un proveedor a la base de datos
     * recibe objeto datos
     */

    function addAuxProveedor($datos)
    {
        //Metodo para agregarle un precio a un concepto por parte del proveedor
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spAuxProveedoresInsertar(:IdConcepto,:IdProveedor,:Precio);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdConcepto" => $datos->idconcepto,
                "IdProveedor" => $datos->idproveedor,
                "Precio" => $datos->precio,
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
    function DelAuxProveedor($datos)
    {
        // Metodo para eliminar los precios enlazados al proveedor
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spAuxProveedoresEliminar(:IdProveedor);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdProveedor" => $datos->idproveedor
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }


    function getAllAuxProveedores()
    {
        /*Método para obtener todas los precios de los conceptos de los Proveedores*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spAuxProveedoresMostrar();";
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
}