<?php

header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

require_once('../host/host.php');
require_once('../util/SQL_session.php');
require_once '../util/http.php';

global $privateAreaDatabaseName;

$name = $_GET['personName'] ?? null;
$count = intval($_GET['count'] ?? 5);
if ($name == null) {
    badRequest("personName is required");
}

if ($count < 1) {
    badRequest("count is too small");
}

$sql = "
SELECT T.nimetus, Ps.kogus, Ps.punktisumma, date(punkti_saamise_aeg)
FROM Punkti_saamine Ps
    LEFT JOIN (
        SELECT PssInner.punkti_saamine_id, MIN(PssInner.toimumise_aeg) as punkti_saamise_aeg
        FROM Punkti_saamise_syndmus PssInner
        GROUP BY PssInner.punkti_saamine_id
    ) Pss on Ps.punkti_saamine_id = Pss.punkti_saamine_id
    LEFT JOIN Liikmelisus L on Ps.liikmelisus_id = L.liikmelisus_id
    LEFT JOIN Isik I on L.isik_id = I.isik_id
    LEFT JOIN Tegevus T on Ps.tegevus_id = T.tegevus_id
    LEFT JOIN Valdkond V on Ps.valdkond_kood = V.valdkond_kood
WHERE Ps.punkti_saamise_seisundi_liik_kood = 1
    AND CONCAT_WS(' ', NULLIF(I.eesnimi, ''), NULLIF(I.perenimi, ''), IF(NULLIF(I.hyydnimi, '') IS NULL, NULL, CONCAT('(', I.hyydnimi, ')'))) = ?
ORDER BY Pss.punkti_saamise_aeg desc
LIMIT ?
";

$conn = SQL_new_session();
$conn->query("USE `$privateAreaDatabaseName`");
$query=$conn->prepare($sql);
$query->bind_param('si', $name, $count);

$query->execute();

$queryResult = $query->get_result()->fetch_all();

$apiResponse = array_map(fn($row) => [
    'name' => $row[0],
    'count' => $row[1],
    'score' => intval($row[2]),
    'timestamp' => $row[3]
], $queryResult);

echo json_encode($apiResponse);