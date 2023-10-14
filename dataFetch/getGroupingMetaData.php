<?php

require_once('../host/host.php');
require_once('../util/SQL_session.php');
require_once '../common/utils.php';

class GroupingMetaData {
    public function __construct(
        public int $totalScore,
        public int $totalScoreThisMonth,
    )
    {
    }
}


function getGroupingMetadata(string $personName, string $groupName): GroupingMetaData {
    return new GroupingMetaData(
        totalScore: getTotalPoints(getMinDate(), $personName, $groupName),
        totalScoreThisMonth: getTotalPoints(getMonthStart(), $personName, $groupName)
    );
}

function getTotalPoints(DateTime $start, string $name, string $groupName): int {
    global $privateAreaDatabaseName;

    $conn = SQL_new_session();
    $conn->query("USE `$privateAreaDatabaseName`");

    $sql = "
    select SUM(punktisumma) as punktisumma
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
    and V.nimetus = ?
    and CONCAT_WS(' ', IFNULL(I.eesnimi, ''), IFNULL(I.perenimi, '')) = ?;";

    $query = $conn->prepare($sql);

    $startString = $start->format("Y-m-d H:i:s");

    $query->bind_param("sss", $startString, $groupName, $name);
    $query->execute();
    $result = $query->get_result()->fetch_all();

    return intval($result[0][0]);
}
