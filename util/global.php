<?php

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");
$PUBLIC_PATH = dirname(__DIR__);

require_once($PUBLIC_PATH . "/host/host.php");
require_once($PUBLIC_PATH . "/util/class.php");

require_once($PUBLIC_PATH . "/config/config.php");
require_once($PUBLIC_PATH . "/util/time.php");
require_once($PUBLIC_PATH . "/util/remap.php");
require_once($PUBLIC_PATH . "/util/utilFunctions.php");
?>