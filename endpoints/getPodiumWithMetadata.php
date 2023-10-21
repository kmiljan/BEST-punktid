<?php

header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

require_once __DIR__ . '/../util/http.php';
require_once __DIR__ . '/../util/referenceData.php';
require_once __DIR__ . '/../dataFetch/getPodium.php';
require_once __DIR__ . '/../dataFetch/getPersonMetadata.php';

global $privateAreaDatabaseName;

$podiumSize = intval($_GET['podiumsize'] ?? 7);
$referenceData = $_GET['referenceData'] ?? null;

$minDate = getDateFromReferenceData($referenceData);

if ($minDate == null) {
    badRequest('Invalid reference data');
}

$apiResponse = array();

$podium = getPodium($podiumSize, $minDate);

foreach ($podium as $podiumItem)
{
    $metadata = getPersonMetadata($podiumItem->personId, $minDate);

    $apiResponse[] = array(
        'name' => $podiumItem->personName,
        'score' => $podiumItem->score,
        'metadata' => array_map(fn(PersonMetadataResponseItem $metadata) => array(
            'score' => $metadata->totalPoints,
            'groupName' => $metadata->group->name,
            'groupIdentifier' => $metadata->group->getNameIdentifier()), $metadata));
}

echo json_encode($apiResponse);