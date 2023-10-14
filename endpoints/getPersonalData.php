<?php
/**
 * Get a breakdown of each activity a person has recieved points for, and how many points total for each activity type. Returns a JSON string.
 */

header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

require_once('../host/host.php');
require_once('../util/SQL_session.php');
require_once '../util/http.php';
require_once '../dataFetch/getGroups.php';


$name = $_GET['personName'] ?? null;
if ($name == null) {
    badRequest("personName is required");
}

$apiResponse = array();
$groups = getGroups();

foreach ($groups as $group) {

    global $privateAreaDatabaseName;

    $sql = "
    SELECT T.nimetus, SUM(Ps.kogus) as kogus, SUM(Ps.punktisumma) as punktisumma
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
        AND V.nimetus = ?
    GROUP BY Ps.tegevus_id
    ORDER BY Pss.punkti_saamise_aeg desc";

    $conn = SQL_new_session();
    $conn->query("USE `$privateAreaDatabaseName`");
    $query = $conn->prepare($sql);
    $query->bind_param('ss', $name, $group->name);

    $query->execute();
    $queryResult = $query->get_result()->fetch_all();

    $breakDown = array_map(fn (array $row) => array(
        'name' => $row[0],
        'count' => $row[1],
        'score' => $row[2]
    ), $queryResult);

    $totalScore = array_sum(array_map(fn (array $item) => $item['score'], $breakDown));

    $apiResponse[$group->name] = array(
        'totalScore' => $totalScore,
        'breakdown' => $breakDown
    );
}

echo json_encode($apiResponse);