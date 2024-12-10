<?php
class TipoEsp
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    /** Metodo para agregar una tipoEsp a la base de datos
     * recibe objeto datos
     */

    function addTipoEsp($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spTipoEspInsertar(:IdEspecificacion,:Codigo,:Nombre, :Descripcion);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdEspecificacion" => $datos->idEspecificacion,
                "Codigo" => $datos->codigo,
                "Nombre" => $datos->nombre,
                "Descripcion" => $datos->descripcion
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
    /** Metodo para modificar una tipoEsp de la base de datos
     * recibe objeto datos
     */
    function UpdTipoEsp($datos)
    {
        $R['estado'] = "OK";
        $c = $this->conn;
        try {
            $consulta = "call spTipoEspModificar(:IdTipo,:IdEspecificacion,:Codigo,:Nombre, :Descripcion);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdTipo" => $datos->idTipo,
                "IdEspecificacion" => $datos->idEspecificacion,
                "Codigo" => $datos->codigo,
                "Nombre" => $datos->nombre,
                "Descripcion" => $datos->descripcion
            ));
            unset($c);
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }

    /** Metodo para mostrar las tipoEsp existentes de la base de datos
     * recibe objeto datos con los filtros necesarios para la consulta a la base de datos
     * 
     */
    function getAllTipoEsp($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spTipoEspMostrar(:IdEspecificacion);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdEspecificacion" => $datos->idEspecificacion,
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

    /** Metodo para habilitar o desabilitar la tipoEsp
     * recibe el id de la tipoEsp asi como el estado al cual se cambiara
     */
    function CambiarEstatusTipoEsp($datos)
    {

        $R['estado'] = 'OK';
        $c = $this->conn;
        try {

            $consulta = "call spTipoEspEstatus(:Id, :Estatus);";
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


    /** Metodo para mostrar el id tipoEsp el ulitmo agregdo a la base de datos
     * 
     */
    function getIdTipoEsp()
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spTipoEspUltimoId();";
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

    function getConceptosEsp($datos)
    {
        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "call spConceptosMostrarxFamilia(:IdEspecificacion);";
            $sql = $c->prepare($consulta);
            $sql->execute(array(
                "IdEspecificacion" => $datos->idEspecificacion,
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
