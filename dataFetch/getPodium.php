<?php

require_once __DIR__ . '/../host/host.php';
require_once __DIR__ . '/../util/SQL_session.php';
require_once __DIR__ . '/../util/roles.php';

class PodiumResultItem
{
    public function __construct(
        public int    $personId,
        public string $personName,
        public int    $score
    )
    {
    }
}


/**
 * @param int $podiumSize
 * @param DateTime $minDate
 * @return array<PodiumResultItem>
 */
function getPodium(int $podiumSize, DateTime $minDate): array
{
    global $privateAreaDatabaseName;

    $roleIdsToSkip = getBoardRoleIds();
    $roleIdsToSkip = join(', ', $roleIdsToSkip);

    $conn = SQL_new_session();
    $conn->query("USE `$privateAreaDatabaseName`");

    $minDate = $minDate->format("Y-m-d H:i:s");

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
        and L.liikmelisus_id not in (
          select Ro.liikmelisus_id from Rolli_omamine Ro
          where Ro.roll_kood in ($roleIdsToSkip)
            and Ro.alguse_kp < NOW() 
            and ( Ro.lopu_kp > NOW() or Ro.lopu_kp is null)
          )
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

    $queryResult = $query->get_result()->fetch_all();

    return array_map(fn (array $row) => new PodiumResultItem(intval($row[1]), $row[0], intval($row[2])), $queryResult);
}