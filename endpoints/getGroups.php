<?php
header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

$PUBLIC_PATH = dirname(__DIR__);
require_once($PUBLIC_PATH . '/host/host.php');
require_once($PUBLIC_PATH . '/util/SQL_session.php');

global $privateAreaDatabaseName;

$conn = SQL_new_session();
$conn->query("USE `$privateAreaDatabaseName`");

$groupColors = [
    1 => ['#e0002c', '#fd1060'], //Kohalik tase
    2 => ['#5c3a3a', '#653d4a'], //Projektitiimid
    3 => ['#0056e0', '#10adfd'], //Meeskonnatöö
    4 => ['#75ae40', '#c3d8a1'], //FRTG
    5 => ['#00dae0', '#6ffe7e'], //MTG
    6 => ['#4f6a91', '#6f889e'], //TTG
    7 => ['#e0bc00', '#ecd018'], //DMTG
    8 => ['#e05e00', '#ef8a12'], //RV
];

$sql = "SELECT V.valdkond_kood, V.nimetus FROM Valdkond V ORDER BY V.valdkond_kood";

$query = $conn->prepare($sql);
$query->execute();
$result = $query->get_result()->fetch_all();

$mapper = function (array $row) use ($groupColors): array {
    $valdkondKood = $row[0];
    $valdkondNimetus = $row[1];

    return [
        'identifier' => $valdkondNimetus,
        'properties' => [
            'name' => $valdkondNimetus,
            'colors' => $groupColors[$valdkondKood]
        ]
    ];
};

$apiResponse = array_map($mapper, $result);

echo json_encode($apiResponse);