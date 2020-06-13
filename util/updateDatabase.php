<?php
/*
Check to see if the specified source document has been updated since the time specified in the state.json file. If so, read the source document using Spreadsheet API and load it to the respective SQL table.
Notice: When loading the recieved data to the table, the table is emptied in the process. After this the table is repopulated with new data.
Notice: if the $FORCE_UPDATE flag variable is set, the data is reloaded regardless of whether it had been modified after the time specified or not.
*/ 
function reloadDatabase(
    $conn, /**<Connection object returned by MySQLi when the session was estabilished.*/
    $spreadsheetId, /**<A Google Drive file identifier for the source document. A long string of letters, ie 1Nlss50-mAX2u8Fk4ax_J7NnK6-p59DpHA8526KmzjA4.*/
    $range, /**<The spreadsheet range that will be read. A1 notation.*/
    $databaseName, /**<The SQL database in which $tableName resides.*/
    $tableName, /**<The SQL table to which the read and formatted data will be output to.*/
    callable $rowToSQLHandler /**<The function that formats and then sends the data to the database table. These might differ since the source document might not always have the same layout in terms of how the columns are organized.*/
    ) {

    global $FORCE_UPDATE;

    //state.json as an object.
    global $state;
    
    //Get the API client and construct the service object.
    $client = getClient("use");
    

    
    //Get the time when the spreadsheet file under question was modified
    $service_Drive = new Google_Service_Drive($client);
    $optParams = array(
        'fields' => 'modifiedTime'
    );
    $driveFile = $service_Drive->files->get($spreadsheetId,  $optParams);


    //Is there a reason to reload data?
    if($driveFile->modifiedTime == null or $FORCE_UPDATE==true or compareDateTimeInclusive($state->lastDatabaseUpdateTime, $driveFile->modifiedTime)) {

        logLog("Database request started: URL:$spreadsheetId, Range:$range, DB:$databaseName, Table:$tableName");


        $service = new Google_Service_Sheets($client);
        $response = $service->spreadsheets_values->get($spreadsheetId, $range);
        $values = $response->getValues();
        logLog("Database data recieved");

        // Check connection
        try {
        
            $conn = SQL_new_session();
            $conn->query("USE $databaseName");
        }
        catch(Exception $err){
            logError("SQL(".__FILE__.", Connection estabilishment):\n" .$err->getMessage());
        }



        try {
            $conn->query("DELETE FROM `$tableName`");
        }
        catch(Exception $err){
            logError("SQL(".__FILE__.", Table emptying):\n" .$err->getMessage());
        }

        if (empty($values)) {
            logLog("Request of file $spreadsheetId (range $range) returned nothing.");
        } else {
            $entriesCount=0;
            foreach ($values as $row) {
                $entriesCount+=call_user_func($rowToSQLHandler, $conn, $tableName, $row);
            }
            
            logLog("Database data updated, total $entriesCount entries");
        }

        return true;

    }
    else {
        logLog("Database request not required: URL:$spreadsheetId, Range:$range, DB:$databaseName, Table:$tableName");
    }
    return false;
}
function _rowToSQL_genericGroup($specialPointsRowExists, $conn, $tableName, $row) {
    if(
        (!empty($row[0]) and !empty($row[1]) and !empty($row[2])) 
        and 
        (
            (!$specialPointsRowExists and !empty($row[5]))
                or
            ($specialPointsRowExists and !empty($row[6]))
        )   
    ) {
        //var_dump($row);
        // Print columns A and E, which correspond to indices 0 and 4.
        //printf("%s, %s, %s, %s, %s, %s, %s<br>\n", $row[0], $row[1], $row[2], $row[3], $row[4], $row[5], $row[6]);
        
        //Input formatting

        //sanitize all inputs
        foreach($row as $k=>$field) {
            $row[$k]=$conn->real_escape_string($field); 
        }
        global $NAMES_TO_BE_REPLACED;
        global $NAMES_TO_REPLACE_WITH;
        $row[0]=stringRemap($row[0], $NAMES_TO_BE_REPLACED, $NAMES_TO_REPLACE_WITH);
        

        $row[3]=GAPI_dateTo_SQL($row[3]);
        
        

        //Add to SQL table
        if ($specialPointsRowExists==true) {

            //Set numerical values to 0 if empty
            typeEnforceNumerical($row[3]);
            
            $row[6]=findNumberFromString($row[6]);
            typeEnforceNumerical($row[6]);
            if(empty($row[4])) {
                $row[4]="";
            }


            try{
    
                $query=$conn->prepare("INSERT INTO 
                `$tableName`(`name`, `activity`, `activity_count`, `activity_timestamp`, `activity_comment`, `activity_score`) 
                VALUES (?, ?, ?,  ?,  ?, ?)"
                );
                $query->bind_param("ssdssi", $row[0], $row[1], $row[2], $row[3], $row[4], $row[6]);
                $query->execute();
            }
            catch(Exception $err){
                logError("SQL(".__FILE__.", Data upload):\n" .$err->getMessage());
            }
            $query->close();
        }
        else {

            //Set numerical values to 0 if empty
            typeEnforceNumerical($row[3]);
            $row[5]=findNumberFromString($row[5]);
            typeEnforceNumerical($row[5]);
            try{
                
                $query=$conn->prepare("INSERT INTO 
                `$tableName`(`name`, `activity`, `activity_count`, `activity_timestamp`, `activity_comment`, `activity_score`)
                VALUES (?, ?, ?,  ?,  ?, ?)"
                );
                $query->bind_param("ssdssi", $row[0], $row[1], $row[2], $row[3], $row[4], $row[5]);
                $query->execute();
            }
            catch(Exception $err){
                logError("SQL(".__FILE__.", Data upload):\n" .$err->getMessage());
            }
            $query->close();
        }
        
        return 1;
    }
    else if(!empty($row[0])) {  //If there's atleast a name, but otherwise there are missing parts, log it.
        logLog("Ignored malformed entry to $tableName. Contents: ".implode(" ", $row));
        return 0;
    }
}
function rowToSQL_GenericGroupWSpecialPoints($conn, $tableName, $row) {
    _rowToSQL_genericGroup(true, $conn, $tableName, $row);
}
function rowToSQL_GenericGroup($conn, $tableName, $row) {
    _rowToSQL_genericGroup(false, $conn, $tableName, $row);
}

function rowToSQL_projectsGroup($conn, $tableName, $row) {
    if(!empty($row[0]) and !empty($row[1]) and !empty($row[3]) and !empty($row[5])) {
        //var_dump($row);
        // Print columns A and E, which correspond to indices 0 and 4.
        //printf("%s, %s, %s, %s, %s, %s, %s<br>\n", $row[0], $row[1], $row[2], $row[3], $row[4], $row[5], $row[6]);
        
        //Input formatting

        //sanitize all inputs
        foreach($row as $k=>$field) {
            $row[$k]=$conn->real_escape_string($field); 
        }
        $row[3]=GAPI_dateTo_SQL($row[3]);
        $row[4]=GAPI_dateTo_SQL($row[4]);

        //Set numerical values to 0 if empty
        $row[5]=findNumberFromString($row[5]);
        typeEnforceNumerical($row[5]);
        try{
                
            $query=$conn->prepare("INSERT INTO 
            `$tableName`(`name`, `activity`, `activity_count`, `activity_timestamp_start`, `activity_timestamp`, `activity_comment`, `activity_score`)
            VALUES (?, ?, 1,  ?,  ?, ?, ?)"
            );
            $query->bind_param("sssssi", $row[0], $row[1], $row[3], $row[4], $row[2], $row[5]);
            $query->execute();
            $query->close();

        }
        catch(Exception $err){
            logError("SQL(".__FILE__.", Data upload):\n" .$err->getMessage());
        }
        
        return 1;
    }
    else if(!empty($row[0])) {  //If there's atleast a name, but otherwise there are missing parts, log it.
        logLog("Ignored malformed entry to $tableName. Contents: ".implode(" ", $row));
        return 0;
    }
}