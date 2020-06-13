<?php
require_once('global.php');
function personalDataToJSON($person_name, $group) {
    global $databaseName;
    logLog("Database data collection request started");
    // Get the API client and construct the service object.

    global $servername;
    global $username;
    global $password;

    // Create connection
    $conn = new mysqli($servername, $username, $password);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    //Set up SQL
    $sql = "USE $databaseName";
    
    if ($conn->query($sql) === TRUE) {
        logLog("Database selected successfully");
    } else {
        logError("Error selecting database: " . $conn->error);
    }

    $sql="SELECT * FROM $group->tableName WHERE name=\"$person_name\"";
    $result=$conn->query($sql);
    if(!$result) {
        logError("Error selecting from table $group->tableName: " . $conn->error);
    }
    $groupData= new GroupData();
    while ($row=$result->fetch_assoc()) {
        //var_dump($row);
        if (is_numeric($row['activity_score'])) {   //the score for the activity is a number
            $groupData->totalScore+=intval($row['activity_score']); //Add to the total score for this group
        }
        $i=$groupData->isInBreakdownList($row['activity']);
        if($i===null) {   //Has this activity not been defined in the list? Also set the index of this activity to $i
            $s= $row['activity'];
            logLog("Created new entry to BreakdownList: $s");
            array_push($groupData->breakdown, new GroupDataBreakdownElement($row['activity'], 0, 0));   //It hasn't been added, so add it.
            $i=$groupData->isInBreakdownList($row['activity']);
        }
        
        $groupData->breakdown[$i]->count+=$row['activity_count'];
        $groupData->breakdown[$i]->score+=$row['activity_score'];
        //var_dump($groupData->breakdown);
        unset($i);
        unset($row);
    }
    //var_dump($groupData);
    return(json_encode($groupData));
    
}
function isExempt($person_name) {
    global $databaseName;
    $statusSourceTable="members_with_points";
    //$databaseName='best_points_meta';
    logLog("Exemption check request started");
    // Get the API client and construct the service object.

    global $servername;
    global $username;
    global $password;

    // Create connection
    $conn = new mysqli($servername, $username, $password);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    //Set up SQL
    $sql = "USE $databaseName";
    if (!$conn->query($sql) === TRUE) {
        logError("Error selecting database: " . $conn->error);
    }
    global $exemptStatuses;
    $sql="SELECT * FROM $statusSourceTable WHERE `name`='$person_name'";
    
    $entries=$conn->query($sql);
    if(!$entries) {
        logError("Error selecting from table $statusSourceTable: " . $conn->error);
    }
    $exemptFlag=false;
    $entry=$entries->fetch_assoc();
    if(!empty($entry)) {
        if(in_array($entry['status'], $exemptStatuses)) {
            $exemptFlag=true;
        }
    }
    return($exemptFlag);
}
function lastActivities($person_name, $group, $amount) {
    global $databaseName;
    logLog("Database data collection request started");
    // Get the API client and construct the service object.

    global $servername;
    global $username;
    global $password;

    // Create connection
    $conn = new mysqli($servername, $username, $password);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    //Set up SQL
    $sql = "USE $databaseName";
    
    if ($conn->query($sql) === TRUE) {
        logLog("Database selected successfully");
    } else {
        logError("Error selecting database: " . $conn->error);
    }
    global $dataTables;
    if ($group!='all') {
        $dataTableKeyExists=false;
        foreach($dataTables as $i=>$dataTable) {
            if($dataTable->name==$group) {
                $dataTableKeyExists=true;
            }
        }
        if(!$dataTableKeyExists) {
            die();
        }
        $table=$dataTables[$i]->tableName;
        $sql="SELECT * FROM  $table";
        if(isset($person_name)) {
            $sql.=" WHERE name=\"$person_name\" ";
        }
        $sql.=" ORDER BY `activity_timestamp` DESC LIMIT $amount";
    }
    else {
        $sql="";
        $first=true;
        foreach($dataTables as $dataTable) {
            if(!$first) {
                $sql.=" UNION ";
            }
            $first=false;
            $sql.=" SELECT * FROM $dataTable->tableName ";
            if(isset($person_name)) {
                $sql.=" WHERE name=\"$person_name\" ";
            }
        }
        $sql.=" ORDER BY `activity_timestamp` DESC LIMIT $amount";
    }
    $result=$conn->query($sql);
    if(!$result) {
        logError("Error selecting from table: " . $conn->error);
    }
    $activityData=[];
    while ($row=$result->fetch_assoc()) {
        //var_dump($row);
        array_push($activityData, new ActivityElement($row['activity'], $row['activity_count'], $row['activity_timestamp'], $row['activity_score']));
        unset($row);
    }
    //var_dump($groupData);
    return(json_encode($activityData));
    
}
function activityReport($person_name, $group) {
    global $databaseName;
    logLog("Database data collection request started");
    // Get the API client and construct the service object.

    //create array of {date, score} objects
    //Read through union of tables where name== and date DESC

    //if month!=lastmonth, create new object
    //array_push(new object)
    //add to [$i]->score


    global $servername;
    global $username;
    global $password;

    // Create connection
    $conn = new mysqli($servername, $username, $password);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    //Set up SQL
    $sql = "USE $databaseName";
    
    if ($conn->query($sql) === TRUE) {
        logLog("Database selected successfully");
    } else {
        logError("Error selecting database: " . $conn->error);
    }
    global $dataTables;
    if ($group!='all') {
        $dataTableKeyExists=false;
        foreach($dataTables as $i=>$dataTable) {
            if($dataTable->name==$group) {
                $dataTableKeyExists=true;
            }
        }
        if(!$dataTableKeyExists) {
            die("bruh");
        }
        $table=$dataTables[$i]->tableName;
        $sql="SELECT * FROM  $table";
        if(isset($person_name)) {
            $sql.=" WHERE name=\"$person_name\" ";
        }
        $sql.=" ORDER BY `activity_timestamp` DESC ";
    }
    else {
        $sql="";
        $first=true;
        foreach($dataTables as $dataTable) {
            if(!$first) {
                $sql.=" UNION ";
            }
            $first=false;
            $sql.=" SELECT * FROM $dataTable->tableName ";
            if(isset($person_name)) {
                $sql.=" WHERE name=\"$person_name\" ";
            }
        }
        $sql.=" ORDER BY `activity_timestamp` DESC";
    }
    $result=$conn->query($sql);
    if(!$result) {
        logError("Error selecting from table: " . $conn->error);
    }
    $activityDatapoints=[];
    $currentMonth=null;
    $currentYear=null;
    $currentIndex=0;
    global $MIN_YEAR_ACTIVITYREPORT;
    while ($row=$result->fetch_assoc()) {
        if(getMonth($row['activity_timestamp'])!=$currentMonth or getYear($row['activity_timestamp'])!=$currentYear) {
            
            $currentMonth=getMonth($row['activity_timestamp']);
            $currentYear=getYear($row['activity_timestamp']);
            if($currentYear<$MIN_YEAR_ACTIVITYREPORT) { //Hard limit on the earliest data, to avoid 1990 date artifacts from ruining the graph
                break;
            }
            $currentIndex=array_push($activityDatapoints, new timeScorePoint($currentYear, $currentMonth, 0, 0))-1;
            //echo("new month $currentMonth and year $currentYear");
        }
        $activityDatapoints[$currentIndex]->score+=$row['activity_score'];
        $activityDatapoints[$currentIndex]->activities+=$row['activity_count'];
        unset($row);
    }
    //var_dump($groupData);
    return(json_encode($activityDatapoints));
    
}
function personalMetadataToJSON($person_name) {
    global $databaseName;
    //$databaseName='best_points_meta';
    logLog("Database metadata collection request started");
    // Get the API client and construct the service object.

    global $servername;
    global $username;
    global $password;

    // Create connection
    $conn = new mysqli($servername, $username, $password);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    //Set up SQL
    $sql = "USE $databaseName";
    
    if (!$conn->query($sql) === TRUE) {
        logError("Error selecting database: " . $conn->error);
    }


    global $dataTables;
    $metadata=[];
    foreach($dataTables as $key=>$group) {
        $personalMetadata=new GroupPersonalMetadata();
        $sql="SELECT * FROM $group->personalMetaTableName WHERE name=\"$person_name\"";
        $result=$conn->query($sql);
        if(!$result) {
            logError("Error selecting from table $group->personalMetaTableName: " . $conn->error);
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
        $metadata[$key]=$personalMetadata;
    }
    logLog("Database metadata collection request finished for $person_name");
    return(json_encode($metadata));
    
}
function groupMetadataToJSON() {
    global $databaseName;
    //$databaseName='best_points_meta';
    logLog("Database group metadata collection request started");
    // Get the API client and construct the service object.

    global $servername;
    global $username;
    global $password;

    $sourceTable='meta_groups';

    // Create connection
    $conn = new mysqli($servername, $username, $password);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    //Set up SQL
    $sql = "USE $databaseName";
    
    if (!$conn->query($sql) === TRUE) {
        logError("Error selecting database: " . $conn->error);
    }


    global $dataTables;
    $metadata=[];
    foreach($dataTables as $key=>$group) {
        $groupMetadata=new GroupPersonalMetadata();
        $sql="SELECT * FROM $sourceTable WHERE `groupName`='$key'";
        $result=$conn->query($sql);
        if(!$result) {
            logError("Error selecting from table $sourceTable: " . $conn->error);
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
    }
    logLog("Database group metadata collection request finished");
    return(json_encode($metadata));
    
}
function groupsToJSON() {
    global $dataTables;
    return json_encode($dataTables);
}
function placementToJSON($person_name=null, $referenceData='totalScore', $podiumSize=5, $group='all', $exemptBasedOnStatus=false) {
    global $databaseName;
    $statusSourceTable="members_with_points";
    //$databaseName='best_points_meta';
    logLog("Database metadata collection request started");
    // Get the API client and construct the service object.

    global $servername;
    global $username;
    global $password;

    // Create connection
    $conn = new mysqli($servername, $username, $password);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    //Set up SQL
    $sql = "USE $databaseName";
    if (!$conn->query($sql) === TRUE) {
        logError("Error selecting database: " . $conn->error);
    }

    if($exemptBasedOnStatus===true) {
        logLog("Exemptions enabled ($exemptBasedOnStatus)");
    }
    if($exemptBasedOnStatus===true) {
        global $exemptStatuses;
        $sql="SELECT * FROM $statusSourceTable";
        
        $entries=$conn->query($sql);
        $statuses;
        if(!$entries) {
            logError("Error selecting from table $statusSourceTable: " . $conn->error);
        }
        $entryCount=$entries->num_rows;
        for($j=0; $j<$entryCount; $j++) {
            $entry=$entries->fetch_assoc();
            $statuses[$entry["name"]]=$entry["status"];
        }
        logLog("Exemption list created");
    }










    global $dataTables;
    if($group!='all') {
        $sourceTable=$dataTables[$group]->personalMetaTableName;
    }
    else {
        $sourceTable='meta_personal_global';
    }
    $sql="SELECT * FROM $sourceTable ORDER BY `$referenceData` DESC";
        $result=$conn->query($sql);
        if(!$result) {
            logError("Error selecting from table $sourceTable: " . $conn->error);
        }
        $podium=[];
        $podiumCounter=0;  
        $placeCounter=1;
        while ($row=$result->fetch_assoc()) {
            //If this result is the same as last, don't increment placeCounter
            $exemptFlag=false;
            if ($exemptBasedOnStatus===true) {
                if(!empty($statuses[$row['name']])) {
                    if(in_array($statuses[$row['name']], $exemptStatuses)) {
                        $exemptFlag=true;
                    }
                }
                
            }
            if($exemptFlag===false) {
                if(isset($lastValue)) {
                    if($lastValue!=$row[$referenceData]) {
                        $placeCounter++;
                    }
                }
                //get the first $podiumSize entires
                if($podiumCounter<$podiumSize) {
                    array_push($podium, new PodiumPosition($row['name'], $row[$referenceData], $placeCounter));
                    
                    $podiumCounter++;
                }
                //And add an entry afterwards only if the selected person is its subject, so that the requesting person could compare themselves and their place number even if not in the podium
                else if(isset($person_name)) {
                    if($row['name']==$person_name) {
                        array_push($podium, new PodiumPosition($row['name'], $row[$referenceData], $placeCounter));
                        break;
                    }
                }
                $lastValue=$row[$referenceData];
            }
            else {
                //logLog("Didn't count ".$row["name"]." for placement data");
            }
        }
    logLog("Database podium collection request finished for $person_name in group $group");
    return(json_encode($podium));
}
//personalDataToJSON("Marten Jaanimets", $dataTables['PRTG']);
?>