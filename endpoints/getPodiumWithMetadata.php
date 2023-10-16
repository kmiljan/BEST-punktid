<?php

header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

require_once('../host/host.php');
require_once('../util/SQL_session.php');
require_once '../util/time.php';
require_once '../util/http.php';
require_once '../util/referenceData.php';

global $privateAreaDatabaseName;

$podiumSize = intval($_GET['podiumsize'] ?? 7);
$referenceData = $_GET['referenceData'] ?? null;

$minDate = getDateFromReferenceData($referenceData);

if ($minDate == null) {
    badRequest('Invalid reference data');
}

$minDate = $minDate->format("Y-m-d H:i:s");

$conn = SQL_new_session();
$conn->query("USE `$privateAreaDatabaseName`");

$sql = "
select CONCAT_WS(' ', NULLIF(I.eesnimi, ''), NULLIF(I.perenimi, ''), IF(NULLIF(I.hyydnimi, '') IS NULL, NULL, CONCAT('(', I.hyydnimi, ')'))) as nimi,
       I.isik_id,
       punktisumma
from (select I.isik_id,
             I.eesnimi,
             I.perenimi,
             SUM(punktisumma) as punktisumma
      from Isik I
               left join Liikmelisus L on I.isik_id = L.isik_id
               left join Punkti_saamine Ps on L.liikmelisus_id = Ps.liikmelisus_id
               left join Valdkond V on Ps.valdkond_kood = V.valdkond_kood
               left join (select PssInner.punkti_saamine_id, MIN(PssInner.toimumise_aeg) as min_toimumise_aeg
                          from Punkti_saamise_syndmus PssInner
                          group by PssInner.punkti_saamine_id
                          ) Pss on Ps.punkti_saamine_id = Pss.punkti_saamine_id
      where Ps.punkti_saamise_seisundi_liik_kood = 1
        and min_toimumise_aeg >= ?
      GROUP BY I.isik_id
      ) as isik_punktiga
left join Isik I
       on isik_punktiga.isik_id = I.isik_id
order by punktisumma desc
LIMIT ?
";

$query = $conn->prepare($sql);
$query->bind_param('si', $minDate, $podiumSize);
$query->execute();

$podiumResult = $query->get_result()->fetch_all();

$apiResponse = array();

foreach ($podiumResult as $row) {
    $personName = $row[0];
    $personId = intval($row[1]);
    $score = intval($row[2]);


    $sql = "
    select sum(Ps.punktisumma) as punktisumma, V.nimetus as valdkondNimetus
    from Valdkond V
    left join Punkti_saamine Ps on V.valdkond_kood = Ps.valdkond_kood
    left join (select PssInner.punkti_saamine_id, MIN(PssInner.toimumise_aeg) as min_toimumise_aeg
                      from Punkti_saamise_syndmus PssInner
                      group by PssInner.punkti_saamine_id
                      ) Pss on Ps.punkti_saamine_id = Pss.punkti_saamine_id
    left join Liikmelisus L on Ps.liikmelisus_id = L.liikmelisus_id
    where Ps.punkti_saamise_seisundi_liik_kood = 1
        and L.isik_id = ?
        and min_toimumise_aeg >= ?
    group by V.valdkond_kood;";

    $query = $conn->prepare($sql);

    $query->bind_param("is", $personId, $minDate);
    $query->execute();
    $result = $query->get_result()->fetch_all();

    $apiResponse[] = array(
        'name' => $personName,
        'score' => $score,
        'metadata' => array_map(fn(array $row) => array(
            'score' => intval($row[0]),
            'groupName' => $row[1],
            'groupIdentifier' => str_replace(' ', '-', $row[1])
        ), $result)
    );
}

echo json_encode($apiResponse);