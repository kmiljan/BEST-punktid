<?php
header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

require_once('../../host/host.php');
require_once('../../util/SQL_session.php');
require_once '../../common/utils.php';

global $privateAreaDatabaseName;

$podiumSize = intval($_GET['podiumsize']);
$from = isset($_GET['from']) ? new DateTime($_GET['from']) : getMinDate();
$from = $from->format("Y-m-d H:i:s");

$podiumSize = $podiumSize <= 0 ? 1 : $podiumSize;

$conn = SQL_new_session();
$conn->query("USE `$privateAreaDatabaseName`");

$sql = "
select CONCAT_WS(' ', IFNULL(I.eesnimi, ''), IFNULL(I.perenimi, '')) as nimi, punktisumma, ROW_NUMBER() over () as koht
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
        and min_toimumise_aeg >= ?
      GROUP BY I.isik_id
      ) as isik_punktiga
left join Isik I
       on isik_punktiga.isik_id = I.isik_id
order by punktisumma desc
LIMIT ?
";

$query=$conn->prepare($sql);
$query->bind_param('si', $from, $podiumSize);
$query->execute();

$result=$query->get_result()->fetch_all();

$apiResponse = array_map(fn($item) => [
    'name' => $item[0],
    'score' => intval($item[1]),
    'place' => intval($item[2])
], $result);

if (sizeof($apiResponse) == 0) {
    $apiResponse[] = [
        'name' => '-',
        'score' => 0,
        'place' => 1
    ];
}

echo json_encode($apiResponse);