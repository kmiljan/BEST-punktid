<?php
require_once('util/global.php');
require_once('util/utilFunctions.php');
require_once('util/SQL_session.php');
/**
 * Get a list of persons with top scores, activites or etc (defined by $referenceData). Returns a JSON string.
 * Notice: $referenceData is checked against $valid_comparable_columns in config/config.php. If you need a new reference column to compare based on, you must first add it to the array. This is a security feature.
 */
function placementToJSON(
    $person_name=null, /**<Name of the person the data of whom will be returned. If set to null, the function will not filter based on name and thus adds together everyone's points. Use this for getting an overview.*/
    $referenceData='totalScore', /**<The table column which to compare. Must be a column containing numbers */
    $podiumSize=5, /**<The amount of entries to get. If $person_name is specified, an additional line may be added */
    $group='all', /**<A group's table object (RawDataTable), from where data will be queried. Alternatively, 'all' (String), if requesting a grand total.*/
    $exemptBasedOnStatus=false /**<Whether persons with exempt statuses are taken into account */
    
    ) {
    global $databaseName;
    $statusSourceTable="members_with_points";

    // Create connection
    try {
        
        $conn = SQL_new_session();
        $conn->query("USE $databaseName");
    }
    catch(Exception $err){
        logError("SQL(".__FILE__.", Connection estabilishment):\n" .$err->getMessage());
    }


    if($exemptBasedOnStatus===true) {
        try{
            global $exemptStatuses;

            $query=$conn->prepare("SELECT * FROM $statusSourceTable");
            $query->execute();
            $entries=$query->get_result();

            $statuses;

            $entryCount=$entries->num_rows;
            for($j=0; $j<$entryCount; $j++) {
                $entry=$entries->fetch_assoc();
                $statuses[$entry["name"]]=$entry["status"];
            }
        }
        catch(Exception $err){
            logError("SQL(".__FILE__.", Exemption list creation):\n" .$err->getMessage());
        }
    }



    try {
        global $dataTables;
        if($group!='all') {
            $sourceTable=$dataTables[$group]->personalMetaTableName;
        }
        else {
            $sourceTable='meta_personal_global';
        }/*
        $sql="SELECT * FROM $sourceTable ORDER BY `$referenceData` DESC";
            $result=$conn->query($sql);
            if(!$result) {
                logError("Error selecting from table $sourceTable: " . $conn->error);
            }*/
        global $valid_comparable_columns;
        if(in_array($referenceData, $valid_comparable_columns)==false) {
            throw new Exception("Not a valid column to compare based on");
        }
        $query=$conn->prepare("SELECT * FROM $sourceTable ORDER BY ".$referenceData." DESC");
        $query->execute();
        $result=$query->get_result();
        
        
        $podium=[];
        $podiumCounter=0;  
        $placeCounter=1;
        while ($row=$result->fetch_assoc()) {
            

            $exemptFlag=false;
            if ($exemptBasedOnStatus===true) {
                if(!empty($statuses[$row['name']])) {
                    if(in_array($statuses[$row['name']], $exemptStatuses)) {
                        $exemptFlag=true;
                        //This entry shall not be taken into account, as the person is exempt.
                    }
                }
                
            }



            if($exemptFlag===false) {
                //If this result is the same as last, don't increment placeCounter
                if(isset($lastValue)) { 
                    if($lastValue!=$row[$referenceData]) {
                        $placeCounter++;
                    }
                }
                //To get the first $podiumSize entires, $podiumCounter must be tracked to not take further rows into account.
                if($podiumCounter<$podiumSize) {
                    array_push($podium, new PodiumPosition($row['name'], $row[$referenceData], $placeCounter));
                    
                    $podiumCounter++;
                }
                //And add an extra entry afterwards only if the selected person is its subject, so that the requesting person could compare themselves and their place number even if not in the podium
                else if(isset($person_name)) {
                    if($row['name']==$person_name) {
                        array_push($podium, new PodiumPosition($row['name'], $row[$referenceData], $placeCounter));
                        //There's no reason to go further, since all there already is $amount entries in the podium array and the person requested has also been taken into account.
                        break;
                    }
                }
                $lastValue=$row[$referenceData];
            }
        }
        
        $query->close();
    }
    catch(Exception $err){
        logError("SQL(".__FILE__.", Podium creation):\n" .$err->getMessage());
    }
    
    SQL_close_session($conn);

    return(json_encode($podium));
}
?>