<?php
require_once('global.php');
//function collectGlobalMetadata()
//function collectGroupMetadata($group)

/**
 * Read all names from both the points tables and the members table and save them to a file and a table along with their status numbers.
 */
function collectNames(
    $conn, /**<SQL session object */
    $dataTables /**<Array of RawDataTable objects */
    ) {
    global $databaseName;
    global $BESTdatabaseName;
    $sourceDatabaseName=$databaseName;
    $sourceDatabase2Name=$BESTdatabaseName;
    $targetDatabaseName=$databaseName;
    $sourceTable="liikmed";
    $targetTable="members_with_points";
    logLog("Database name metadata collection started");


    try{
        $conn->query("USE $sourceDatabaseName");
    }
    catch(Exception $err){
        logError("SQL(".__FILE__.", Database selection):\n" .$err->getMessage());
    }

    try {
        $first=true;
        $sql="";
        foreach($dataTables as $dataTable) {
            if(!$first) {
                $sql.="UNION
    ";    
            }
            $first=false;
            $sql.="SELECT DISTINCT `name` FROM $dataTable->tableName
    ";
        }
        unset($first);
        $names=$conn->query($sql);
        $nameList=[];
        $entries=$names->num_rows;
        for($j=0; $j<$entries; $j++) {
            $nameList[$j]=($names->fetch_assoc())["name"];
        }
    }
    catch(Exception $err){
        logError("SQL(".__FILE__.", Name aggregation from $sourceDatabaseName):\n" .$err->getMessage());
    }

    try {
        $conn->query("USE $sourceDatabase2Name");
        $members=$conn->query("SELECT `eesnimi`, `perenimi`, `staatus` FROM $sourceTable");
        $entries=$members->num_rows;
    }
    catch(Exception $err){
        logError("SQL(".__FILE__.", Name aggregation from $sourceDatabase2Name):\n" .$err->getMessage());
    }
    
    logLog("Number of entries in member database $entries");
    $memberList=[];
    global $NAMES_TO_BE_REPLACED;
    global $NAMES_TO_REPLACE_WITH;
    
    for($j=0; $j<$entries; $j++) {
        $entry=$members->fetch_assoc();
        $foundFlag=false;
        $namestr=trim($entry["eesnimi"])." ".trim($entry["perenimi"]);
        //$namestr=utf8_encode($namestr);
        $namestrUpperCase=strtoupper($namestr);
        foreach($nameList as $name) {
            if($namestrUpperCase==trim(strtoupper($name))) {
                $namestr=stringRemap($namestr, $NAMES_TO_BE_REPLACED, $NAMES_TO_REPLACE_WITH);
                array_push($memberList, new Person(
                    $namestr, 
                    $entry["staatus"])
                );
                $foundFlag=true;
                break;
            }
        }
    }

    logLog("There are a total of ".count($memberList)." of members with points, for ".count($memberList)." of whom a status was found. A mismatch indicates differences between the member list and the points tables.");
    
    try{
        $conn->query("USE $targetDatabaseName");
        $conn->query("DELETE FROM `$targetTable`");
    }
    catch(Exception $err){
        logError("SQL(".__FILE__.", Clearing $targetTable):\n" .$err->getMessage());
    }
    foreach($memberList as $member) {
        try{
            $query=$conn->prepare("INSERT INTO `$targetTable`(`name`, `status`)
            VALUES (?, ?)");
            $query->bind_param("si", $member->name, $member->status);
            $query->execute();
            $query->close();
        }
        catch(Exception $err){
            logError("SQL(".__FILE__.", Saving members entries to $targetTable):\n" .$err->getMessage());
        }

    }
    
    ; 
    global $PUBLIC_PATH;
    $file = fopen("$PUBLIC_PATH/cache/namelist.json",'w');
          fwrite($file, json_encode($nameList));
          fclose($file);
}


/**
 * Calculate every person's (who is named in the names database) specified group's totals and save them to a database.
 */
function collectPersonalMetadata(
    $conn, /**<SQL session object */
    $group /**<A group's table object (RawDataTable), from where data will be queried and sent to.*/
    ) {
    /*
    Sources: $group points
    Targets: $group meta
    */
    global $databaseName;
    $sourceDatabaseName=$databaseName;
    $targetDatabaseName=$databaseName;

    try {
        $conn->query("USE $targetDatabaseName");
        $conn->query("DELETE FROM `$group->personalMetaTableName`");
        $conn->query("USE $sourceDatabaseName");
        $names=$conn->query("SELECT DISTINCT `name` FROM $group->tableName");
    }
    catch(Exception $err){
        logError("SQL(".__FILE__.", Getting names from $group->tableName):\n" .$err->getMessage());
    }

    $firstDateMonth=getMonthStartDate();
    $firstDateYear=getYearStartDate();


    $entries=$names->num_rows;
    for($j=0; $j<$entries; $j++) {

        $person_name=($names->fetch_assoc())["name"];

        try {
            $conn->query("USE $sourceDatabaseName");

            $query=$conn->prepare("SELECT * FROM $group->tableName WHERE name=?");
            $query->bind_param("s", $person_name);
            $query->execute();
            $result=$query->get_result();
            
        }
        catch(Exception $err){
            logError("SQL(".__FILE__.", Getting a person's data:\n" .$err->getMessage());
        }

        $groupPersonalMetadata=new GroupPersonalMetadata();

        while ($row=$result->fetch_assoc()) {
            //Entry based calculations:

            //var_dump($row);
            $groupPersonalMetadata->totalActivities++;
            $groupPersonalMetadata->totalScore+=$row['activity_score'];
            //var_dump($row['activity_timestamp']);
            if(equivalentMonthAndYear($firstDateMonth, $row['activity_timestamp'])) { //if date is this month    
                
                $groupPersonalMetadata->totalActivitiesThisMonth++;
                $groupPersonalMetadata->totalScoreThisMonth+=$row['activity_score'];
            }
            if(equivalentYear($firstDateYear, $row['activity_timestamp'])) { //if date is this year   
                $groupPersonalMetadata->totalActivitiesThisYear++;
                $groupPersonalMetadata->totalScoreThisYear+=$row['activity_score'];
            }
            if (isInCurrentSeason($row['activity_timestamp'])) {
                $groupPersonalMetadata->totalActivitiesThisSeason++;
                $groupPersonalMetadata->totalScoreThisSeason+=$row['activity_score'];
            }
        }
        $query->close();


        //Add the data to meta table
        try {
            $conn->query("USE $targetDatabaseName");

            $query=$conn->prepare("INSERT INTO `$group->personalMetaTableName`(
                `name`, `totalScore`, `totalScoreThisMonth`, `totalScoreThisYear`, `totalScoreThisSeason`, `totalActivities`, `totalActivitiesThisMonth`, `totalActivitiesThisYear`, `totalActivitiesThisSeason`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $query->bind_param("siiiidddd", 
                $person_name,
                $groupPersonalMetadata->totalScore,
                $groupPersonalMetadata->totalScoreThisMonth,
                $groupPersonalMetadata->totalScoreThisYear,
                $groupPersonalMetadata->totalScoreThisSeason,
                $groupPersonalMetadata->totalActivities,
                $groupPersonalMetadata->totalActivitiesThisMonth,
                $groupPersonalMetadata->totalActivitiesThisYear,
                $groupPersonalMetadata->totalActivitiesThisSeason
            );
            $query->execute();
            $query->close();
            
        }
        catch(Exception $err){
            logError("SQL(".__FILE__.", Saving a person's metadata:\n" .$err->getMessage());
        }

        unset($groupPersonalMetadata);
    }
    logLog("Metadata updated for $group->name");
}

















/**
 * Collect totals for every group
 */
function collectGroupMetadata(
    $conn/**<SQL session object */
    ) {
    /*
    Sources: $dataTables
    Targets: meta_groups
    */
    global $databaseName;
    $sourceDatabaseName=$databaseName;
    $targetDatabaseName=$databaseName;
    $targetTable='meta_groups';
    try {
        $conn->query("USE $targetDatabaseName");
        $conn->query("DELETE FROM `$targetTable`");
        $conn->query("USE $sourceDatabaseName");

    }
    catch(Exception $err){
        logError("SQL(".__FILE__.", Setting up and clearing $targetTable:\n" .$err->getMessage());
    }
    global $dataTables;
    foreach($dataTables as $key=>$group) {
        $groupAggregate= new GroupPersonalMetadata();
        try {
            $result=$conn->query("SELECT * FROM $group->personalMetaTableName");
        }
        catch(Exception $err){
            logError("SQL(".__FILE__.", Reading $group->personalMetaTableName:\n" .$err->getMessage());
        }
        while ($row=$result->fetch_assoc()) {
            $groupAggregate->totalScore+=$row['totalScore'];
            $groupAggregate->totalScoreThisMonth+=$row['totalScoreThisMonth'];
            $groupAggregate->totalScoreThisYear+=$row['totalScoreThisYear'];
            $groupAggregate->totalScoreThisSeason+=$row['totalScoreThisSeason'];
            $groupAggregate->totalActivities+=$row['totalActivities'];
            $groupAggregate->totalActivitiesThisMonth+=$row['totalActivitiesThisMonth'];
            $groupAggregate->totalActivitiesThisYear+=$row['totalActivitiesThisYear'];
            $groupAggregate->totalActivitiesThisSeason+=$row['totalActivitiesThisSeason'];
        }


        //Add the data to meta table
        try {
            $conn->query("USE $targetDatabaseName");

            $query=$conn->prepare("INSERT INTO `$targetTable`(`groupName`, `totalScore`, `totalScoreThisMonth`, `totalScoreThisYear`, `totalScoreThisSeason`, `totalActivities`, `totalActivitiesThisMonth`, `totalActivitiesThisYear`, `totalActivitiesThisSeason`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $query->bind_param("siiiidddd", 
                $key,
                $groupAggregate->totalScore,
                $groupAggregate->totalScoreThisMonth,
                $groupAggregate->totalScoreThisYear,
                $groupAggregate->totalScoreThisSeason,
                $groupAggregate->totalActivities,
                $groupAggregate->totalActivitiesThisMonth,
                $groupAggregate->totalActivitiesThisYear,
                $groupAggregate->totalActivitiesThisSeason
            );
            $query->execute();
            $query->close();
            
        }
        catch(Exception $err){
            logError("SQL(".__FILE__.", Saving a group's metadata:\n" .$err->getMessage());
        }
        unset($groupAggregate);


    }
    logLog("Group metadata updated");
}

/**
 * Collect personalMetadata for all groups
 */
function collectAllPersonalMetadata(
    $conn /**<SQL session object */
    ) {
    global $dataTables;
    foreach($dataTables as $group) {
        collectPersonalMetadata($conn, $group);
    }
}




/**
 * Collect personal metadata over all groups (this means the absolute total scores and activites)
 */
function collectPersonalGlobalMetadata(
    $conn/**<SQL session object */
    ) {

    /*
    Sources: $dataTables
    Targets: meta_personal_global
    */


    global $databaseName;
    $sourceDatabaseName=$databaseName;
    $targetDatabaseName=$databaseName;
    $targetTable='meta_personal_global';
    logLog("Database metadata collection started");

    try{
        $conn->query("USE $targetDatabaseName");
        $conn->query("DELETE FROM `$targetTable`");
    }
    catch(Exception $err){
        logError("SQL(".__FILE__.", Clearing $targetTable:\n" .$err->getMessage());
    }

    global $PUBLIC_PATH;
    $names=json_decode(file_get_contents($PUBLIC_PATH.'/cache/namelist.json'));

    $firstDateMonth=getMonthStartDate();
    $firstDateYear=getYearStartDate();

    foreach($names as $person_name) {


        try {
            $conn->query("USE $sourceDatabaseName");
            $groupPersonalMetadata=new GroupPersonalMetadata();
            global $dataTables;
            foreach($dataTables as $group) {

                $query=$conn->prepare("SELECT * FROM $group->tableName WHERE name=?");
                $query->bind_param("s", $person_name);
                $query->execute();
                $result=$query->get_result();
                
                while ($row=$result->fetch_assoc()) {
                    //Entry based calculations:

                    //var_dump($row);
                    $groupPersonalMetadata->totalActivities++;
                    $groupPersonalMetadata->totalScore+=$row['activity_score'];
                    //var_dump($row['activity_timestamp']);
                    if(equivalentMonthAndYear($firstDateMonth, $row['activity_timestamp'])) { //if date is this month    
                        
                        $groupPersonalMetadata->totalActivitiesThisMonth++;
                        $groupPersonalMetadata->totalScoreThisMonth+=$row['activity_score'];
                    }
                    if(equivalentYear($firstDateYear, $row['activity_timestamp'])) { //if date is this year   
                        $groupPersonalMetadata->totalActivitiesThisYear++;
                        $groupPersonalMetadata->totalScoreThisYear+=$row['activity_score'];
                    }
                    if (isInCurrentSeason($row['activity_timestamp'])) {
                        $groupPersonalMetadata->totalActivitiesThisSeason++;
                        $groupPersonalMetadata->totalScoreThisSeason+=$row['activity_score'];
                    }
                }
                $query->close();
            }
        }
        catch(Exception $err){
            logError("SQL(".__FILE__.", Reading a person's metadata:\n" .$err->getMessage());
        }


        //Add the data to meta table
        try {
            $conn->query("USE $targetDatabaseName");

            $query=$conn->prepare("INSERT INTO `$targetTable`(`name`, `totalScore`, `totalScoreThisMonth`, `totalScoreThisYear`, `totalScoreThisSeason`, `totalActivities`, `totalActivitiesThisMonth`, `totalActivitiesThisYear`, `totalActivitiesThisSeason`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $query->bind_param("siiiidddd", 
                $person_name,
                $groupPersonalMetadata->totalScore,
                $groupPersonalMetadata->totalScoreThisMonth,
                $groupPersonalMetadata->totalScoreThisYear,
                $groupPersonalMetadata->totalScoreThisSeason,
                $groupPersonalMetadata->totalActivities,
                $groupPersonalMetadata->totalActivitiesThisMonth,
                $groupPersonalMetadata->totalActivitiesThisYear,
                $groupPersonalMetadata->totalActivitiesThisSeason
            );
            $query->execute();
            $query->close();
            
        }
        catch(Exception $err){
            logError("SQL(".__FILE__.", Saving a person's global metadata:\n" .$err->getMessage());
        }
        
        unset($groupPersonalMetadata);
    //var_dump($groupData);
    }
}






//collectAllPersonalMetadata();
//collectGroupMetadata();
//collectNames($dataTables);
//collectPersonalGlobalMetadata();
?>


