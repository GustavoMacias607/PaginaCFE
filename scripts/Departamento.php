<?php
class Departamento
{
    private $conn;
    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }
    function getAllDeptos()
    {


        $R['estado'] = 'OK';
        $c = $this->conn;
        try {
            $consulta = "SELECT *
            FROM tbl_departamento
            ORDER BY departamento";

            $sql = $c->query($consulta);

            $R['filas'] = $sql->rowCount();
            if ($R['filas'] <= 0) {
                $R['estado'] = "Sin Result<ados :(";
            } else {
                $R['datos'] = $sql->fetchAll();
            }
            $c == null;
        } catch (PDOException $e) {
            $R['estado'] = "Error: " . $e->getMessage();
        }
        return $R;
    }
}
