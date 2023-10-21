<?php

require_once __DIR__ . '/../util/SQL_session.php';
require_once __DIR__ . '/../host/host.php';
require_once __DIR__ . '/getGroups.php';

class PersonMetadataResponseItem
{
    public function __construct(
        public int $totalPoints,
        public Group $group
    )
    {
    }
}


function getPersonMetadata(int $personId, DateTime $minDate): array
{
    $minDate = $minDate->format("Y-m-d H:i:s");

    global $privateAreaDatabaseName;

    $conn = SQL_new_session();
    $conn->query("USE `$privateAreaDatabaseName`");

    $sql = "
    select sum(Ps.punktisumma) as punktisumma,
           V.valdkond_kood as valdkondKood,
           V.nimetus as valdkondNimetus
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
    $queryResult = $query->get_result()->fetch_all();

    return array_map(fn(array $row) => new PersonMetadataResponseItem(intval($row[0]), new Group($row[1], $row[2])), $queryResult);
}