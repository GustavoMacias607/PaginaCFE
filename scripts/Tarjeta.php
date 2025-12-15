<?php
class TarjetaMateriales
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar un material a un concepto a la base de datos
     * recibe objeto datos del material y al concepto que se guardara
     */

    function addMateriales($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spAuxMaterialesInsertar(:IdConcepto,:IdMaterial,:Cantidad,:Suministrado);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdConcepto" => $datos->idConcepto,
                "IdMaterial" => $datos->codigo,
                "Cantidad" => $datos->cantidad,
                "Suministrado" => $datos->suministrado,
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }

    /*Método para obtener todos los materiales que le corresponden al concepto
 Recibe el id del concepto para hacer la busqueda*/
    function getMateriales($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spAuxMaterialesMostrar(:IdConcepto);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdConcepto" => $datos->idConcepto
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

    /*Metodo para eliminar los materiales que tiene asignado el concepto
    recibe el id del concepto*/
    function DelMateriales($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spAuxMaterialesEliminar(:IdConcepto);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdConcepto" => $datos->idConcepto
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
}

/***
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 *Mano de obra 
 * 
 * 
 * 
 * 
 * 
 * 
 * 

 */



class TarjetaManoObra
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar un manoObra a un concepto a la base de datos
     * recibe objeto datos del manoObra y al concepto que se guardara
     */

    function addManoObra($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            // Llamamos al SP actualizado que ahora acepta cantidad
            $consulta = "call spAuxManoObraInsertar(:IdManoObra, :IdConcepto, :Rendimiento, :Cantidad);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdManoObra" => $datos->idmanoobra,
                "IdConcepto" => $datos->idConcepto,
                "Rendimiento" => $datos->rendimiento,
                "Cantidad" => $datos->cantidad  // <-- NUEVO
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }


    /*Método para obtener todos los ManoObra que le corresponden al concepto
 Recibe el id del concepto para hacer la busqueda*/
    function getManoObras($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spAuxManoObraMostrar(:IdConcepto);";
            $sql = $c->prepare($consulta);
            $sql->execute(array("IdConcepto" => $datos->idConcepto));

            $R['filas'] = $sql->rowCount();
            if ($R['filas'] <= 0) {
                $R['estado'] = "Sin Resultados";
            } else {
                $R['datos'] = $sql->fetchAll(PDO::FETCH_ASSOC);
            }
            $c = null;
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }


    /*Metodo para eliminar los ManoObra que tiene asignado el concepto
    recibe el id del concepto*/
    function DelManoObra($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spAuxManoObraEliminar(:IdConcepto);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdConcepto" => $datos->idConcepto
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
}


/***
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * Maquinaria
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

class TarjetaMaquinaria
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar un maquinaria a un concepto a la base de datos
     * recibe objeto datos del maquinaria y al concepto que se guardara
     */

    function addMaquinaria($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spAuxMaquinariaInsertar(:IdConcepto,:IdMaquinaria,:Rhm);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdConcepto" => $datos->idConcepto,
                "IdMaquinaria" => $datos->idmaquinaria,
                "Rhm" => $datos->rhm
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }

    /*Método para obtener todos los maquinaria que le corresponden al concepto
  Recibe el id del concepto para hacer la busqueda*/
    function getMaquinaria($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spAuxMaquinariaMostrar(:IdConcepto);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdConcepto" => $datos->idConcepto
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

    /*Metodo para eliminar los maquinaria que tiene asignado el concepto
     recibe el id del concepto*/
    function DelMaquinaria($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spAuxMaquinariaEliminar(:IdConcepto);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdConcepto" => $datos->idConcepto
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
}




/***
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * Basicos Tarjeta
 * 
 * 
 * 
 * 
 * 
 * 
 * 

 */



class TarjetaBasicos
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar un basicos a un concepto a la base de datos
     * recibe objeto datos del basicos y al concepto que se guardara
     */

    function addBasicos($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spAuxConceptosInsertar(:IdConcepto,:IdConceptoBasi,:Cantidad);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdConcepto" => $datos->idConcepto,
                "IdConceptoBasi" => $datos->idconbasi,
                "Cantidad" => $datos->cantconbasi,
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }

    /*Método para obtener todos los basicos que le corresponden al concepto
   Recibe el id del concepto para hacer la busqueda*/
    function getBasicos($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spAuxConceptosMostrar(:IdConcepto);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdConcepto" => $datos->idConcepto
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

    /*Metodo para eliminar los basicos que tiene asignado el concepto
      recibe el id del concepto*/
    function DelBasicos($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spAuxConceptosEliminar(:IdConcepto);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdConcepto" => $datos->idConcepto
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
}
