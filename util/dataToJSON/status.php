<?php
require_once('util/global.php');
require_once('util/SQL_session.php');
/** 
 * Check if a person is exempt from being visible in running graphs. Returns true if exempt, false if not, and "not found" if the name couldn't be found from the status table.
 * Statuses that result in an exemption are stored in $exemptStatuses.
*/
function status(
    $person_name /**<Name of the person the data of whom will be returned.*/
    ) {
    global $databaseName;
    global $exemptStatuses;
    $statusSourceTable="members_with_points";
    // Create connection
    try {
        $conn = SQL_new_session();
        $conn->query("USE $databaseName");
    }
    catch(Exception $err){
        logError("SQL(".__FILE__.", Connection estabilishment):\n" .$err->getMessage());
    }

    try {
        $query=$conn->prepare("SELECT * FROM $statusSourceTable WHERE name = ?");
        $query->bind_param("s", $person_name);
        $query->execute();
        $entries=$query->get_result();
    }
    catch(Exception $err){
        logError("SQL(".__FILE__.", Table selection):\n" .$err->getMessage());
    }

    if(!$entries) {
        logError("Error selecting from table $statusSourceTable: " . $conn->error);
    }
    
    $entry=$entries->fetch_assoc();
    if(!empty($entry)) {
        global $statusStrings;
        $status=$statusStrings[$entry['status']];
        if(!empty($status)) {
            $query->close();
            SQL_close_session($conn);
            return($status);
        }
        else{
            $query->close();
            SQL_close_session($conn);
            return(false);
        }
    }
    $query->close();
    SQL_close_session($conn);
    return(false);
}
?>