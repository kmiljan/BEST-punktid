<?php
header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

require_once('../host/host.php');
require_once('../util/SQL_session.php');
require_once '../dataFetch/getGroups.php';

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


$groups = getGroups();

$mapper = function (Group $row) use ($groupColors): array {
    return [
        'identifier' => $row->name,
        'properties' => [
            'name' => $row->name,
            'colors' => $groupColors[$row->id]
        ]
    ];
};

echo json_encode(array_map($mapper, $groups));