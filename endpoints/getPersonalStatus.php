<?php

header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

require_once __DIR__ . '/../dataFetch/isPersonInBoard.php';
require_once __DIR__ . '/../dataFetch/getPersonalStatus.php';
require_once __DIR__ . '/../util/http.php';


$name = $_GET['personName'] ?? null;
if ($name == null) {
    badRequest("personName is required");
}

$isPersonInBoard = isPersonInBoard($name);
if ($isPersonInBoard) {
    echo json_encode("Juhatuse liige");
    return;
}

$status = getPersonalStatus($name);

if ($status == null) {
    notFound("status");
}

echo json_encode($status->name);