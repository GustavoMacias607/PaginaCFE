<?php
class Conceptos
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar un concepto a la base de datos
     * recibe objeto datos del concepto
     */

    function addConcepto($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spConceptoInsertar(:Id,:Tipo,:Unidad,:Nombre,:Promedio,:CostoSi,:Financiamiento,:Utilidad,:CargosA,:Total);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id,
                "Tipo" => $datos->tipo,
                "Unidad" => $datos->unidad,
                "Nombre" => $datos->nombre,
                "Promedio" => $datos->promedio,
                "CostoSi" => $datos->costoSi,
                "Financiamiento" => $datos->financiamiento,
                "Utilidad" => $datos->utilidad,
                "CargosA" => $datos->cargosA,
                "Total" => $datos->total
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
    /*Método para modificar un concepto
     recibe un objeto con los datos del concepto*/
    function UpdConcepto($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spConceptoModificar(:IdAnterior,:Id,:Tipo,:Unidad,:Nombre, :Promedio,:CostoSi,:Financiamiento,:Utilidad,:CargosA,:Total);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdAnterior" => $datos->idAnterior,
                "Id" => $datos->id,
                "Tipo" => $datos->tipo,
                "Unidad" => $datos->unidad,
                "Nombre" => $datos->nombre,
                "Promedio" => $datos->promedio,
                "CostoSi" => $datos->costoSi,
                "Financiamiento" => $datos->financiamiento,
                "Utilidad" => $datos->utilidad,
                "CargosA" => $datos->cargosA,
                "Total" => $datos->total

            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }

    /*Método para obtener todos los conceptos
 recibe objeto con los datos para filtrar*/
    function getAllConceptos()
    {

        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spConceptoMostrar();";
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
    /*Método para hacer una busqueda a la base de datos y verificar si existe el concepto
 recibe objeto con el id del concepto*/
    function checkConcepto($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spConceptoBuscarId(:Id);";
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
    /*Método para cambiar el estatus del concepto
     recibe el id del concepto y el estatus al cual se cambiara*/
    function CambiarEstatusConcepto($datos)
    {

        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spConceptoEstatus(:Id, :Estatus);";
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

    /*Método para obtener todas las unidades de los conceptos*/
    function getAllUnidades()
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spConceptoUnidades();";
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

    function getAllTipos()
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spConceptoTipos();";
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
