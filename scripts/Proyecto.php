<?php
class Proyecto
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar un proyecto a la base de datos
     * recibe objeto datos
     */

    function addProyecto($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call SpProyectoInsertarPasoUNO(:IdProyecto,:IdUsuario,:Nombre,:Fecha,:Periodo,:FechaInicio,:FechaTermino,:IdZona,:Total);";

            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdProyecto" => $datos->idProyecto,
                "IdUsuario" => $datos->idUsuario,
                "Nombre" => $datos->nombre,
                "Fecha" => $datos->fecha,
                "Periodo" => $datos->periodo,
                "FechaInicio" => $datos->fechaInicio,
                "FechaTermino" => $datos->fechaTermino,
                "IdZona" => $datos->idZona,
                "Total" => $datos->total,
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }


    /** Metodo para modificar los datos de un proyecto
     * recibe un objeto con los nuevos datos del proyecto
     */
    function UpdProyecto($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spProyectoModificarPasos(:IdProyecto,:Nombre,:Fecha,:Periodo,:FechaInicio,:FechaTermino,:IdZona,:Total,:Estatus);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdProyecto" => $datos->idProyecto,
                "Nombre" => $datos->nombre,
                "Fecha" => $datos->fecha,
                "Periodo" => $datos->periodo,
                "FechaInicio" => $datos->fechaInicio,
                "FechaTermino" => $datos->fechaTermino,
                "IdZona" => $datos->idZona,
                "Total" => $datos->total,
                "Estatus" => $datos->estatus,
            ));
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }



    function GetProyecto($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spProyectoBuscarIf(:Id);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->idUsuario
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
    function CambiarEstatusProyecto($datos)
    {
        /*Método para obtener todos los Materiales*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spProyectoEstatus(:Id, :Estatus);";
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


    function getIdProyecto()
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spProyectoUltimoId();";
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
 * CatalogoConceptos
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

class CatalogoConceptos
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }


    /** Metodo para agregar un concepto a un proyecto a la base de datos
     * recibe objeto datos del concpeto y al proyecto que se guardara
     */

    function addConcepto($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spAuxProyectoInsertar(:IdConcepto,:IdProyecto,:Cantidad,:Total);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdConcepto" => $datos->idconcepto,
                "IdProyecto" => $datos->idProyecto,
                "Cantidad" => $datos->cantidad,
                "Total" => $datos->total
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }

    /*Método para obtener todos los conceptos que le corresponden al proyecto
   Recibe el id del proyecto para hacer la busqueda*/
    function getConceptos($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spProyectoConcentradoConceptos(:IdProyecto);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdProyecto" => $datos->idProyecto
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

    /*Metodo para eliminar los conceptos que tiene asignado el proyecto
      recibe el id del proyecto*/
    function DelConcepto($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spAuxProyectoEliminar(:IdProyecto);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdProyecto" => $datos->idProyecto
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
 * CatalogoConceptos
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

class Presupuesto
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }



    /*Método para obtener todas las maquinarias que le corresponden al proyecto
    Recibe el id del proyecto para hacer la busqueda*/
    function getMaquinarias($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spProyectoConcentradoMaquinaria(:IdProyecto);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdProyecto" => $datos->idProyecto
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


    /*Método para obtener todas las mano de obra que le corresponden al proyecto
    Recibe el id del proyecto para hacer la busqueda*/
    function getManoObras($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spProyectoConcentradoManoObraOPERACIONES(:IdProyecto);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdProyecto" => $datos->idProyecto
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

    /*Método para obtener todas los materiales suministrados que le corresponden al proyecto
    Recibe el id del proyecto para hacer la busqueda*/
    function getMaterialesSuministrados($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spProyectoConcentradoMaterialesSiSumi(:IdProyecto);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdProyecto" => $datos->idProyecto
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


    /*Método para obtener todos los materiales no suministrados que le corresponden al proyecto
    Recibe el id del proyecto para hacer la busqueda*/
    function getMaterialesNoSuministrados($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spProyectoConcentradoMaterialesNoSumi(:IdProyecto);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdProyecto" => $datos->idProyecto
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