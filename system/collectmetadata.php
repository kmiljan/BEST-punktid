<?php
require_once('../util/global.php');
require_once('../util/SQLimport.php');
require_once('../util/GAPI_client.php');
require_once('../util/collectMetadata.php');
collectAllPersonalMetadata();
collectGroupMetadata();
collectNames($dataTables);
collectPersonalGlobalMetadata();
?>