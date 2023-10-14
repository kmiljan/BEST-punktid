<?php

header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

require_once('../host/host.php');
require_once('../util/SQL_session.php');
require_once '../util/http.php';

global $privateAreaDatabaseName;

$name = $_GET['personName'] ?? null;
if ($name == null) {
    badRequest("personName is required");
}

$conn = SQL_new_session();
$conn->query("USE `$privateAreaDatabaseName`");

$sql = "
SELECT Lsl.nimetus FROM Liikmelisus L
LEFT JOIN Isik I ON L.isik_id = I.isik_id
LEFT JOIN Liikmelisuse_syndmus Ls ON L.liikmelisus_id = Ls.liikmelisus_id
LEFT JOIN Liikmelisuse_seisundi_liik Lsl ON Ls.seisund_syndmuse_jarel = Lsl.liikmelisuse_seisundi_liik_kood
WHERE CONCAT_WS(' ', NULLIF(I.eesnimi, ''), NULLIF(I.perenimi, ''), IF(NULLIF(I.hyydnimi, '') IS NULL, NULL, CONCAT('(', I.hyydnimi, ')'))) = ?
ORDER BY Ls.toimumise_aeg DESC
LIMIT 1
";

$query=$conn->prepare($sql);
$query->bind_param('s', $name);
$query->execute();
$result=$query->get_result()->fetch_all();

if (sizeof($result) == 0) {
    notFound("person");
}

echo json_encode($result[0][0]);