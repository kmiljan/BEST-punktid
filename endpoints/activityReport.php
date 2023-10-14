<?php

header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

require_once '../dataFetch/getActivityReport.php';

$personName = $_GET['personName'] ?? null;

$result = getActivityReport($personName);

$mapper = function (ActivityReportItem $row) {
    return [
        'y' => $row->year,
        'm' => $row->month,
        'score' => $row->pointsTotal,
        'activities' => $row->countOfActivities
    ];
};

echo json_encode(array_map($mapper, $result));
