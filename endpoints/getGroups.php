<?php
header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

require_once('../host/host.php');
require_once('../util/SQL_session.php');
require_once '../dataFetch/getGroups.php';

$groupProperties = array(
    1 => array(
        'colors' => array('#e0002c', '#fd1060'),
        'gradientFile' => '/resource/dynamic/svg-gradient-2way_hr_local.svg'
    ), //Kohalik tase
    2 => array(
        'colors' => array('#5c3a3a', '#653d4a'),
        'gradientFile' => '/resource/dynamic/svg-gradient-2way_hr_projects.svg'
    ), //Projektitiimid
    3 => array(
        'colors' => array('#0056e0', '#10adfd'),
        'gradientFile' => '/resource/dynamic/svg-gradient-2way_hr_teamwork.svg'
    ), //Meeskonnatöö
    4 => array(
        'colors' => array('#75ae40', '#c3d8a1'),
        'gradientFile' => '/resource/dynamic/svg-gradient-2way_frtg.svg'
    ), //FRTG
    5 => array(
        'colors' => array('#00dae0', '#6ffe7e'),
        'gradientFile' => '/resource/dynamic/svg-gradient-2way_mtg.svg'
    ), //MTG
    6 => array(
        'colors' => array('#4f6a91', '#6f889e'),
        'gradientFile' => "/resource/dynamic/svg-gradient-2way_ttg.svg"
    ), //TTG
    7 => array(
        'colors' => array('#e0bc00', '#ecd018'),
        'gradientFile' => '/resource/dynamic/svg-gradient-2way_prtg.svg'
    ), //DMTG
    8 => array(
        'colors' => array('#e05e00', '#ef8a12'),
        'gradientFile' => '/resource/dynamic/svg-gradient-2way_rv.svg'
    ), //RV
);

$groups = getGroups();

$mapper = function (Group $row) use ($groupProperties): array {
    return [
        'identifier' => $row->getNameIdentifier(),
        'properties' => [
            'name' => $row->name,
            'colors' => $groupProperties[$row->id]['colors'],
            'gradientFile' => $groupProperties[$row->id]['gradientFile']
        ]
    ];
};

echo json_encode(array_map($mapper, $groups));