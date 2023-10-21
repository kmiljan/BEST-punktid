<?php
header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

require_once('../host/host.php');
require_once('../util/SQL_session.php');
require_once '../dataFetch/getGroups.php';
require_once '../config/groups.php';

$groups = getGroups();

$mapper = function (Group $row): array {
    global $groupProperties;
    return [
        'identifier' => $row->getNameIdentifier(),
        'properties' => [
            'name' => $row->name,
            'colors' => $groupProperties[$row->getNameIdentifier()]['colors'],
            'gradientFile' => $groupProperties[$row->getNameIdentifier()]['gradientFile']
        ]
    ];
};

echo json_encode(array_map($mapper, $groups));