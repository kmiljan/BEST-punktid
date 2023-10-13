<?php
header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

$PUBLIC_PATH = dirname(__DIR__);
require_once($PUBLIC_PATH . '/host/host.php"');

global $privateAreaDatabaseName;

$input = $_GET['query'];

$conn = SQL_new_session();
$conn->query("USE $privateAreaDatabaseName");

$sql = "
SELECT DISTINCT CONCAT_WS(' ', I.eesnimi, I.perenimi, I.hyydnimi) 
FROM Liikmelisus L 
    LEFT JOIN Isik I ON L.isik_id = I.isik_id 
WHERE I.isiku_seisundi_liik_kood = 1
AND CONCAT_WS(' ', I.eesnimi, I.perenimi, I.hyydnimi) like ?";

$query=$conn->prepare($sql);
$query->bind_param('s', $input);
$query->execute();
$result=$query->get_result();

echo json_encode($result);