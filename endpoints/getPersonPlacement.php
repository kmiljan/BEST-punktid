<?php

header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

require_once('../host/host.php');
require_once('../util/SQL_session.php');
require_once '../util/http.php';
require_once '../util/time.php';

global $privateAreaDatabaseName;

$personName = $_GET['personName'] ?? null;
$referenceData = $_GET['referenceData'] ?? null;

if ($personName == null) {
    badRequest("Invalid person name");
}

if ($referenceData == null || ReferenceData::fromName($referenceData) == null) {
    badRequest('Invalid reference data');
}

$referenceData = ReferenceData::fromName($referenceData);
$minDate = null;

switch ($referenceData) {
    case ReferenceData::totalScore:
        $minDate = getMinStartDate();
        break;
    case ReferenceData::totalScoreThisMonth:
        $minDate = getMonthStartDate();
        break;
    case ReferenceData::totalScoreThisSeason:
        $minDate = getSeasonStartDate();
        break;
    default:
        badRequest("Invalid reference data");
        break;
}

$minDate = $minDate->format("Y-m-d H:i:s");

$conn = SQL_new_session();
$conn->query("USE `$privateAreaDatabaseName`");

$conn->query("set @rank = 0;");


$sql = "
select punktisumma, row, nimi
from (
    select punktisumma,
           @rank := @rank + 1 as row,
           CONCAT_WS(' ', NULLIF(I.eesnimi, ''), NULLIF(I.perenimi, ''), IF(NULLIF(I.hyydnimi, '') IS NULL, NULL, CONCAT('(', I.hyydnimi, ')'))) as nimi
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
                              group by PssInner.punkti_saamine_id) Pss
                             on Ps.punkti_saamine_id = Pss.punkti_saamine_id
          where Ps.punkti_saamise_seisundi_liik_kood = 1
            and Pss.min_toimumise_aeg >= ?
          GROUP BY I.isik_id
          order by punktisumma desc
          ) as isik_punktiga
    left join Isik I
           on isik_punktiga.isik_id = I.isik_id
) as vahetabel
where nimi = ?
";

$query = $conn->prepare($sql);
$query->bind_param('ss', $minDate, $personName);
$query->execute();


$result = $query->get_result()->fetch_all();

$apiResponse = array_map(fn (array $row) => [
    'score' => intval($row[0]),
    'place' => $row[1]
], $result);


if (sizeof($apiResponse) == 0) {
    $apiResponse[] = [
        'score' => 0,
        'place' => 0
    ];
}

echo json_encode($apiResponse[0]);