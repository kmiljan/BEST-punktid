<?php
header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

require_once '../util/http.php';
require_once '../dataFetch/getGroups.php';
require_once '../dataFetch/getGroupingMetaData.php';

$personName = $_GET['personName'] ?? null;

if ($personName == null) {
    badRequest('personName');
}

$groups = getGroups();

$apiResponse = array();

foreach ($groups as $group) {
    $apiResponse[$group->getNameIdentifier()] = getGroupingMetadata($personName, $group->name);
}

echo json_encode($apiResponse);