<?php
require_once('util/global.php');
require_once('util/SQL_session.php');
/**
 * Get a whole group's total for scores and activites. Returns a JSON string.
 */
function groupMetadataToJSON() {
    global $databaseName;

    // Create connection
    try {
        
        $conn = SQL_new_session();
        $conn->query("USE $databaseName");
    }
    catch(Exception $err){
        logError("SQL(".__FILE__.", Connection estabilishment):\n" .$err->getMessage());
    }


    global $dataTables;
    $metadata=[];
    foreach($dataTables as $key=>$group) {
        $groupMetadata=new GroupPersonalMetadata();
        try {
            $query=$conn->prepare("SELECT * FROM $sourceTable WHERE `groupName`=?");
            $query->bind_param("s", $key);
            $query->execute();
            $result=$query->get_result();
        }
        catch(Exception $err){
            logError("SQL(".__FILE__.", Table selection):\n" .$err->getMessage());
        }

        while ($row=$result->fetch_assoc()) {
            $groupMetadata->totalScore+=$row['totalScore'];
            $groupMetadata->totalScoreThisMonth+=$row['totalScoreThisMonth'];
            $groupMetadata->totalScoreThisYear+=$row['totalScoreThisYear'];
            $groupMetadata->totalScoreThisSeason+=$row['totalScoreThisSeason'];
            $groupMetadata->totalActivities+=$row['totalActivities'];
            $groupMetadata->totalActivitiesThisMonth+=$row['totalActivitiesThisMonth'];
            $groupMetadata->totalActivitiesThisYear+=$row['totalActivitiesThisYear'];
            $groupMetadata->totalActivitiesThisSeason+=$row['totalActivitiesThisSeason'];
        }
        $metadata[$key]=$groupMetadata;
        unset($groupMetadata);
        $query->close();
    }

    
    SQL_close_session($conn);

    return(json_encode($metadata));
    
}
?>