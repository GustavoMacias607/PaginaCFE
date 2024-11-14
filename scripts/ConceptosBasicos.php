<?php
class ConceptosBasicos
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar un concepto a la base de datos
     * recibe objeto datos del concepto
     */

    function addConceptoBasico($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spConceptoBasiInsertar(:Id,:Nombre,:Unidad,:Total);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id,
                "Nombre" => $datos->nombre,
                "Unidad" => $datos->unidad,
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
    function UpdConceptoBasico($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spConceptoBasiModificar(:IdAnterior,:Id,:Nombre,:Unidad, :Total);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdAnterior" => $datos->idAnterior,
                "Id" => $datos->id,
                "Nombre" => $datos->nombre,
                "Unidad" => $datos->unidad,
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
    function getAllConceptosBasicos()
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spConceptoBasiMostrar();";
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
    function checkConceptosBasicos($datos)
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
    function CambiarEstatusConceptoBasico($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spConceptoBasiEstatus(:Id, :Estatus);";
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
    function getAllUnidadesBasicas()
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spConceptoBasiUnidades();";
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

    /*Método para actualizar los totales de los conceptos Basicos*/
    function updateTotalesBasicos()
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spConceptoBasicoTotal();";
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
