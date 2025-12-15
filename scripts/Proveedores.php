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
            $consulta = "call spProveedoresInsertar(:NombreProveedor);";

            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "NombreProveedor" => $datos->nombreProveedor
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
            $consulta = "call spProveedoresModificar(:IdProveedor,:NombreProveedor);";

            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdProveedor" => $datos->idProveedor,
                "NombreProveedor" => $datos->nombreProveedor,
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


    function CambiarEstatusProveedor($datos)
    {
        // Metodo para modificar el estatus un Proveedor
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spProveedoresEstatus(:IdProveedor,:parametro);";

            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdProveedor" => $datos->idProveedor,
                "parametro" => $datos->estatus,
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
}


class Propuestas
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar un proveedor a la base de datos
     * recibe objeto datos
     */

    function addPropuesta($datos)
    {
        //Metodo para agregar una propuesta a la base de datos
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spPropuestaInsertar(:IdProveedor,:NoPropuesta,:Fecha,:IdZona);";

            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdProveedor" => $datos->idProveedor,
                "NoPropuesta" => $datos->propuesta,
                "Fecha" => $datos->fecha,
                "IdZona" => $datos->idZona
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
    function UpdPropuesta($datos)
    {
        // Metodo para modificar una propuesta
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spPropuestaModificar(:IdPropuesta,:NoPropuesta,:Fecha,:IdZona);";

            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdPropuesta" => $datos->idPropuesta,
                "NoPropuesta" => $datos->propuesta,
                "Fecha" => $datos->fecha,
                "IdZona" => $datos->idZona
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }


    function getAllPropuestas($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spPropuestaMostrar(:IdProveedor);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdProveedor" => $datos->idProveedor,
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

    function CambiarEstatusPropuesta($datos)
    {
        // Metodo para modificar el estatus un Proveedor
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spPropuestaEstatus(:IdPropuesta,:parametro);";

            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdPropuesta" => $datos->idPropuesta,
                "parametro" => $datos->estatus,
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
}


class AuxPropuestas
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar precios a las propuestas a la base de datos
     * recibe objeto datos
     */

    function addAuxPropuesta($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;

        try {
            $c->beginTransaction();

            $sql = $c->prepare("CALL spAuxPropuestaInsertar(:IdConcepto,:IdPropuesta,:Precio)");

            foreach ($datos as $item) {
                $sql->execute([
                    "IdConcepto" => $item->idconcepto,
                    "IdPropuesta" => $item->idpropuesta,
                    "Precio" => $item->precio
                ]);
            }

            $c->commit();
        } catch (PDOException $e) {
            $c->rollBack();
            $R['estado'] = "Error: " . $e->getMessage();
        }

        return $R;
    }
    function DelAuxPropuesta($datos)
    {
        // Metodo para eliminar los precios enlazados al proveedor
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spAuxPropuestaEliminar(:IdPropuesta);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdPropuesta" => $datos->idpropuesta
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }


    function getAllAuxPropuestas()
    {
        /*Método para obtener todas los precios de los conceptos de los Proveedores*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spAuxPropuestaMostrar();";
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