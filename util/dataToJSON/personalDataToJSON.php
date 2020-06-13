<?php
require_once('util/global.php');
require_once('util/SQL_session.php');
/**
 * Get a breakdown of each activity a person has recieved points for, and how many points total for each activity type. Returns a JSON string.
 */
function personalDataToJSON(
    String $person_name, /**<Name of the person the data of whom will be returned.*/
    RawDataTable $group /**<A group's table object, from where data will be queried.*/
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

    try {
        $query=$conn->prepare("SELECT * FROM $group->tableName WHERE name = ?");
        $query->bind_param("s", $person_name);
        $query->execute();
        $result=$query->get_result();
    }
    catch(Exception $err){
        logError("SQL(".__FILE__.", Table selection):\n" .$err->getMessage());
    }



    $groupData= new GroupData();
    while ($row=$result->fetch_assoc()) {
        
        if (is_numeric($row['activity_score'])) {   //the score for the activity is a number
            $groupData->totalScore+=intval($row['activity_score']); //Add to the total score for this group
        }

        //If the activity is already in the list, add the score to it. If not, append the activity to the list
        $i=$groupData->isInBreakdownList($row['activity']);
        if($i===null) {   //Has this activity not been defined in the list? Also set the index of this activity to $i
            $s= $row['activity'];
            array_push($groupData->breakdown, new GroupDataBreakdownElement($row['activity'], 0, 0));   //It hasn't been added, so add it.
            $i=$groupData->isInBreakdownList($row['activity']);
        }
        
        $groupData->breakdown[$i]->count+=$row['activity_count'];
        $groupData->breakdown[$i]->score+=$row['activity_score'];
        unset($i);
        unset($row);
    }

    $query->close();
    SQL_close_session($conn);


    //Round the score values to avoid 10.99999999999 type annoyances.
    foreach($groupData->breakdown as $breakdownElement) {
        val_round_ref($breakdownElement->count);
        val_round_ref($breakdownElement->score);
    }


    return(json_encode($groupData));
}
?>