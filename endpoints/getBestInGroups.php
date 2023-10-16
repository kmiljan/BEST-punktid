<?php

header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

require_once '../dataFetch/getGroups.php';
require_once('../host/host.php');
require_once('../util/SQL_session.php');
require_once '../util/http.php';
require_once '../util/time.php';
require_once '../util/referenceData.php';

$referenceData = $_GET['referenceData'] ?? null;

$minDate = getDateFromReferenceData($referenceData);

if ($minDate == null) {
    badRequest('Invalid reference data');
}

$minDate = $minDate->format("Y-m-d H:i:s");


$groups = getGroups();

$apiResponse = array();

foreach ($groups as $group) {
    global $privateAreaDatabaseName;

    $conn = SQL_new_session();
    $conn->query("USE `$privateAreaDatabaseName`");


    $sql = "
    select CONCAT_WS(' ', NULLIF(I.eesnimi, ''), NULLIF(I.perenimi, ''), IF(NULLIF(I.hyydnimi, '') IS NULL, NULL, CONCAT('(', I.hyydnimi, ')'))) as nimi,
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
                              group by PssInner.punkti_saamine_id) Pss
                             on Ps.punkti_saamine_id = Pss.punkti_saamine_id
          where Ps.punkti_saamise_seisundi_liik_kood = 1
            and V.nimetus = ?
            and min_toimumise_aeg >= ?
          GROUP BY I.isik_id
          ) as isik_punktiga
    left join Isik I
           on isik_punktiga.isik_id = I.isik_id
    order by punktisumma desc
    LIMIT 1
    ";

    $query = $conn->prepare($sql);
    $query->bind_param('ss', $group->name, $minDate);
    $query->execute();

    $result = $query->get_result()->fetch_all();

    if (sizeof($result) == 0) {
        continue;
    }

    $apiResponse[] = array(
        'name' => $result[0][0],
        'score' => intval($result[0][1]),
        'groupName' => $group->name,
        'groupIdentifier' => str_replace(' ', '-', $group->name)
    );
}

echo json_encode($apiResponse);