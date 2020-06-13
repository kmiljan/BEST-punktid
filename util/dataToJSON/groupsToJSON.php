<?php
require_once('util/global.php');
/**
 * Get a list of all the groups and return a JSON string of it.
 */
function groupsToJSON() {
    global $dataTables;
    return json_encode($dataTables);
}
?>