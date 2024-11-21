<?php
class Zonas
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar una zona a la base de datos
     * recibe objeto datos
     */

    function addZonas($datos)
    {
        //Metodo para agregar una zona a la base de datos
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spZonaInsertar(:Id,:Zona,:Obra,:Indirecto,:Financiamiento, :Utilidad,:Adicionales,:Fecha);";

            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id,
                "Zona" => $datos->zona,
                "Obra" => $datos->obra,
                "Indirecto" => $datos->indirecto,
                "Financiamiento" => $datos->financiamiento,
                "Utilidad" => $datos->utilidad,
                "Adicionales" => $datos->adicionales,
                "Fecha" => $datos->fecha,
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
    function UpdZonas($datos)
    {
        // Metodo para modificar una zona
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spZonaModificar(:Id,:IdNuevo,:Zona,:Obra,:Indirecto,:Financiamiento, :Utilidad,:Adicionales,:Fecha);";

            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "Id" => $datos->id,
                "IdNuevo" => $datos->id,
                "Zona" => $datos->zona,
                "Obra" => $datos->obra,
                "Indirecto" => $datos->indirecto,
                "Financiamiento" => $datos->financiamiento,
                "Utilidad" => $datos->utilidad,
                "Adicionales" => $datos->adicionales,
                "Fecha" => $datos->fecha,
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }


    function getAllZonas()
    {
        /*Método para obtener todas las zonas*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spZonaMostrar();";
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

    function CambiarEstatusZonas($datos)
    {
        /*Método para cambiar es estatus de una zona*/
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spZonaEstatus(:Id, :Estatus);";
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
}
