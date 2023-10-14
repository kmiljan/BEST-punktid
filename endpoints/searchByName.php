<?php
header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

$PUBLIC_PATH = dirname(__DIR__);
require_once($PUBLIC_PATH . '/host/host.php');
require_once($PUBLIC_PATH . '/util/SQL_session.php');

global $privateAreaDatabaseName;

$userInput = strtolower($_GET['query']);
if (strlen($userInput) <= 3) {
    echo json_encode([]);
    return;
}

$input = $userInput . "%";

$conn = SQL_new_session();
$conn->query("USE `$privateAreaDatabaseName`");

$sql = "
SELECT DISTINCT CONCAT_WS(' ', NULLIF(I.eesnimi, ''), NULLIF(I.perenimi, ''), IF(NULLIF(I.hyydnimi, '') IS NULL, NULL, CONCAT('(', I.hyydnimi, ')'))) as nimi
FROM Liikmelisus L 
    LEFT JOIN Isik I ON L.isik_id = I.isik_id 
WHERE I.isiku_seisundi_liik_kood = 1
AND (
    lower(CONCAT_WS(' ', I.eesnimi, I.perenimi, I.hyydnimi)) like ?
    OR LOWER(CONCAT_WS(' ', NULLIF(I.eesnimi, ''), NULLIF(I.perenimi, ''), IF(NULLIF(I.hyydnimi, '') IS NULL, NULL, CONCAT('(', I.hyydnimi, ')')))) like ?
    )
LIMIT 6";

$query=$conn->prepare($sql);
$query->bind_param('ss', $input, $input);
$query->execute();
$result=$query->get_result()->fetch_all();

echo json_encode(array_map(fn($item) => $item[0], $result));