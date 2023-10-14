<?php

use JetBrains\PhpStorm\NoReturn;

#[NoReturn] function badRequest(string $reason): void
{
    http_response_code(400);
    echo json_encode(array('reason' => $reason));
    exit;
}

