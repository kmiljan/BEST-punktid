<?php

require_once __DIR__ . '/../host/host.php';
require_once __DIR__ . '/../util/SQL_session.php';
require_once __DIR__ . '/../util/roles.php';

function isPersonInBoard(string $name): bool
{
    $boardRoleIds = getBoardRoleIds();
    $boardRoleIds = join(', ', $boardRoleIds);

    global $privateAreaDatabaseName;

    $conn = SQL_new_session();
    $conn->query("USE `$privateAreaDatabaseName`");

    $sql = "
    SELECT COUNT(*) 
    FROM Rolli_omamine Ro
    LEFT JOIN Liikmelisus L on Ro.liikmelisus_id = L.liikmelisus_id
    LEFT JOIN Isik I on L.isik_id = I.isik_id
    WHERE Ro.roll_kood in ($boardRoleIds)
      AND Ro.alguse_kp < NOW()
      AND (Ro.lopu_kp is null or Ro.lopu_kp > NOW())
      AND CONCAT_WS(' ', NULLIF(I.eesnimi, ''), NULLIF(I.perenimi, ''), IF(NULLIF(I.hyydnimi, '') IS NULL, NULL, CONCAT('(', I.hyydnimi, ')'))) = ?
    ";

    $query = $conn->prepare($sql);
    $query->bind_param('s', $name);
    $query->execute();
    $result = $query->get_result()->fetch_all();

    return $result[0][0] > 0;
}