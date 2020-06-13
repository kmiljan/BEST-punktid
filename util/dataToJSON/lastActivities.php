<?php
require_once('util/global.php');
require_once('util/SQL_session.php');

/**
 * Get the last activites a person recieved points for. Returns a JSON string.
 */
function lastActivities(
    String $person_name, /**<Name of the person the data of whom will be returned. If set to null, the function will not filter based on name and thus adds together everyone's points. Use this for getting an overview of the last activites.*/
    $group, /**<A group's table object (RawDataTable), from where data will be queried. Alternatively, 'all' (String), if requesting a grand total.*/
    $amount /**<The amount of entries to return */
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
        global $dataTables;
        if ($group!='all') {

            //Find the group's object by its name
            $dataTableKeyExists=false;
            foreach($dataTables as $i=>$dataTable) {
                if($dataTable->name==$group) {
                    $dataTableKeyExists=true;
                }
            }
            if(!$dataTableKeyExists) {
                throw new Exception("No group of such name exists");
            }


            $table=$dataTables[$i]->tableName;       
            
            if(isset($person_name)) {
                $query=$conn->prepare("SELECT `activity`, `activity_count`, `activity_timestamp`, `activity_score` FROM $table WHERE name = ? ORDER BY `activity_timestamp` DESC LIMIT ?");
                $query->bind_param("si", $person_name, $amount);
            }
            else{
                $query=$conn->prepare("SELECT `activity`, `activity_count`, `activity_timestamp`, `activity_score` FROM $table ORDER BY `activity_timestamp` DESC LIMIT ?");
                $query->bind_param("i", $amount);
            }
        }
        else {
            $sql="";
            $count=0;
            $first=true;
            foreach($dataTables as $dataTable) {
                if(!$first) {
                    $sql.=" UNION ";
                }
                $first=false;
                $sql.=" SELECT `activity`, `activity_count`, `activity_timestamp`, `activity_score` FROM $dataTable->tableName ";
                if(isset($person_name)) {
                    $sql.=" WHERE name=?";
                }
                $count++;
            }
            $sql.=" ORDER BY `activity_timestamp` DESC LIMIT ?";
            $query=$conn->prepare($sql);

            if(isset($person_name)) {
                //Calling bind_param on the dynamic SQL that was just made requires creating a string_format type string and an array of references to the parameters.
                $format="";
                for($i=0; $i<$count; $i++) {
                    $format.="s";
                }
                $format.="i";
                $param=[$format];
                for($i=0; $i<$count; $i++) {
                    $param[]= &$person_name;
                }
                $param[]= &$amount;
                call_user_func_array([$query, 'bind_param'], $param);
            }

        }
        $query->execute();
        $result=$query->get_result();
    }
    catch(Exception $err){
        logError("SQL(".__FILE__.", Query):\n" .$err->getMessage());
    }


    $activityData=[];
    while ($row=$result->fetch_assoc()) {

        array_push($activityData, new ActivityElement(
            $row['activity'], 
            val_round($row['activity_count']), 
            $row['activity_timestamp'], 
            val_round($row['activity_score'])
        ));
        unset($row);
    }
    $query->close();
    SQL_close_session($conn);
    return(json_encode($activityData)); 
}
?>