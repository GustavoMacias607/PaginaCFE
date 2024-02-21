<?php
class Momentos
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    function getAllMomentos()
    {
        /*Metodo para obtener todos los momentos*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "SELECT * FROM proyecto7mo.tbl_momento";

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

    function CheckMomento($datos)
    {
        /**
         * Metodo para comprobar que el momento no exista
         * recibe un objeto con el momento
         */
        $R['estado'] = 'OK';

        $c = $this->conn;
        try {
            $consulta =
                "SELECT * FROM tbl_momento WHERE momento = :Momento";

            $sql = $c->prepare($consulta);
            $sql->execute(array("Momento" => $datos->momento));

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

    function CheckOrden($datos)
    {
        /**
         * Metodo para comprobar que el orden no se repita
         */
        $R['estado'] = 'OK';

        $c = $this->conn;
        try {
            $consulta =
                "SELECT * FROM tbl_momento WHERE orden = :Orden";

            $sql = $c->prepare($consulta);
            $sql->execute(array("Orden" => $datos->orden));

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

    function addMomentos($datos)
    {

        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "INSERT INTO tbl_momento VALUES(0,:Momento,'A',:Orden,:Responsable)";
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

    function UpdateMomentos($datos)
    {

        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "UPDATE tbl_momento SET momento = :Momento, estado = :Estado, orden = :Orden, responsable = :Responsable where idmomento = :Id;";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Momento" => $datos->momento,
                "Estado" => $datos->estado,
                "Orden" => $datos->orden,
                "Responsable" => $datos->responsable,
                "Id" => $datos->id

            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
    function DeleteMomento($datos)
    {

        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "DELETE from tbl_momento where idmomento = :Id;";
            $sql = $c->prepare($consulta);
            $sql->execute(array("Id" => $datos->id));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }


    function CambiarOrdenMenos($datos)
    {

        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "UPDATE tbl_momento SET orden = (orden + 1) WHERE orden >= :Orden and orden <= :OrdenFin";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Orden" => $datos->orden,
                "OrdenFin" => $datos->ordenFin
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
    function CambiarOrdenMas($datos)
    {

        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "UPDATE tbl_momento SET orden = (orden - 1) WHERE orden <= :Orden and orden > :OrdenFin";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Orden" => $datos->orden,
                "OrdenFin" => $datos->ordenFin
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
}
