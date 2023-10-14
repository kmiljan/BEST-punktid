<?php
header('Content-Type: text/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
mb_internal_encoding("UTF-8");

$PUBLIC_PATH = dirname(__DIR__);
require_once($PUBLIC_PATH . '/host/host.php');
require_once($PUBLIC_PATH . '/util/SQL_session.php');

global $privateAreaDatabaseName;

$group = strtolower("");