<?php

require_once __DIR__ . '/getGroups.php';
require_once __DIR__ . '/../host/host.php';
require_once __DIR__ . '/../util/roles.php';
require_once __DIR__ . '/../util/SQL_session.php';

class BestInGroupResponseItem
{
    public function __construct(
        public string $name,
        public int $score,
        public Group $group
    )
    {
    }
}

/**
 * @param DateTime $minDate
 * @return array<BestInGroupResponseItem>
 */
function getBestInGroups(DateTime $minDate): array
{
    $minDate = $minDate->format("Y-m-d H:i:s");
    $result = array();
    $groups = getGroups();
    $roleIdsToSkip = getBoardRoleIds();
    $roleIdsToSkip = join(", ", $roleIdsToSkip);

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
    LIMIT 1
    ";


        $query = $conn->prepare($sql);
        $query->bind_param('ss', $group->name, $minDate);
        $query->execute();

        $queryResult = $query->get_result()->fetch_all();

        if (sizeof($queryResult) == 0) {
            continue;
        }

        $result[] = new BestInGroupResponseItem(
            name: $queryResult[0][0],
            score: intval($queryResult[0][1]),
            group: $group
        );
    }

    return $result;
}
