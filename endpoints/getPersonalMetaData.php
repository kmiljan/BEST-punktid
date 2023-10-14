<?php
header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

require_once('../host/host.php');
require_once('../util/SQL_session.php');
require_once '../dataFetch/getGroups.php';
require_once '../dataFetch/getGroupingMetaData.php';
global $privateAreaDatabaseName;


$personName = $_GET['personName'];


$groups = getGroups();

$apiResponse = array();

foreach ($groups as $group) {
    $apiResponse[$group->name] = getGroupingMetadata($personName, $group->name);
}

echo json_encode($apiResponse);