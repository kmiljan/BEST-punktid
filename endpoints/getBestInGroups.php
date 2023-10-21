<?php

header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

require_once __DIR__ . '/../util/http.php';
require_once __DIR__ . '/../util/referenceData.php';
require_once __DIR__ . '/../dataFetch/getBestInGroups.php';

$referenceData = $_GET['referenceData'] ?? null;

$minDate = getDateFromReferenceData($referenceData);

if ($minDate == null) {
    badRequest('Invalid reference data');
}

$bestInGroups = getBestInGroups($minDate);

$apiResponse = array_map(fn(BestInGroupResponseItem $item) => array(
    'name' => $item->name,
    'score' => $item->score,
    'groupName' => $item->group->name,
    'groupIdentifier' => $item->group->getNameIdentifier()
), $bestInGroups);


echo json_encode($apiResponse);