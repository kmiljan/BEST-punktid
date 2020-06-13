<?php
require_once('util/global.php');
require_once('util/SQL_session.php');
/**
 * Get personal metadata(essentially total values over groups) based on a person's name. Returns a JSON string.
 */
function personalMetadataToJSON(
    $person_name /**<Name of the person the data of whom will be returned.*/
    ) {
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

    //Go over each group's metadata table
    foreach($dataTables as $key=>$group) {
        $personalMetadata=new GroupPersonalMetadata();

        try {
            $query=$conn->prepare("SELECT * FROM $group->personalMetaTableName WHERE name=?");
            $query->bind_param("s", $person_name);
            $query->execute();
            $result=$query->get_result();
        }
        catch(Exception $err){
            logError("SQL(".__FILE__.", Table selection):\n" .$err->getMessage());
        }

        while ($row=$result->fetch_assoc()) {
            $personalMetadata->totalScore+=$row['totalScore'];
            $personalMetadata->totalScoreThisMonth+=$row['totalScoreThisMonth'];
            $personalMetadata->totalScoreThisYear+=$row['totalScoreThisYear'];
            $personalMetadata->totalScoreThisSeason+=$row['totalScoreThisSeason'];
            $personalMetadata->totalActivitiesThisMonth+=$row['totalActivitiesThisMonth'];
            $personalMetadata->totalActivitiesThisYear+=$row['totalActivitiesThisYear'];
            $personalMetadata->totalActivitiesThisSeason+=$row['totalActivitiesThisSeason'];
        }
        val_round_ref($personalMetadata->totalScore);
        val_round_ref($personalMetadata->totalScoreThisMonth);
        val_round_ref($personalMetadata->totalScoreThisYear);
        val_round_ref($personalMetadata->totalScoreThisSeason);
        val_round_ref($personalMetadata->totalActivitiesThisMonth);
        val_round_ref($personalMetadata->totalActivitiesThisYear);
        val_round_ref($personalMetadata->totalActivitiesThisSeason);
        $metadata[$key]=$personalMetadata;
    }

    $query->close();
    SQL_close_session($conn);
    
    return(json_encode($metadata));
    
}
?>