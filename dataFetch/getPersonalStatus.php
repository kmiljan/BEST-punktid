<?php

require_once __DIR__ . '/../host/host.php';
require_once __DIR__ . '/../util/SQL_session.php';

class PersonalStatus
{
    public function __construct(
        public int $id,
        public string $name
    )
    {
    }
}


function getPersonalStatus(string $personName): PersonalStatus|null
{
    global $privateAreaDatabaseName;

    $conn = SQL_new_session();
    $conn->query("USE `$privateAreaDatabaseName`");

    $sql = "
    SELECT Lsl.liikmelisuse_seisundi_liik_kood, Lsl.nimetus
    FROM Liikmelisus L
      LEFT JOIN Isik I ON L.isik_id = I.isik_id
      LEFT JOIN Liikmelisuse_syndmus Ls ON L.liikmelisus_id = Ls.liikmelisus_id
      LEFT JOIN Liikmelisuse_seisundi_liik Lsl ON Ls.seisund_syndmuse_jarel = Lsl.liikmelisuse_seisundi_liik_kood
    WHERE CONCAT_WS(' ', NULLIF(I.eesnimi, ''), NULLIF(I.perenimi, ''), IF(NULLIF(I.hyydnimi, '') IS NULL, NULL, CONCAT('(', I.hyydnimi, ')'))) = ?
    ORDER BY Ls.toimumise_aeg DESC
    LIMIT 1";

    $query = $conn->prepare($sql);
    $query->bind_param('s', $personName);
    $query->execute();
    $result = $query->get_result()->fetch_all();

    if (sizeof($result) == 0) {
        return null;
    }

    return new PersonalStatus($result[0][0], $result[0][1]);
}
