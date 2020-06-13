<?php
require_once('util/global.php');
require_once('util/SQL_session.php');
/**
 * Get a per-month breakdown of total activites and points a person has recieved. Returns a JSON string.
 */
function activityReport(
    $person_name, /**<Name of the person the data of whom will be returned. If set to null, the function will not filter based on name and thus adds together everyone's points. Use this for getting an overall acitivity graph.*/
    $group /**<A group's table object (RawDataTable), from where data will be queried. Alternatively, 'all' (String), if requesting a grand total.*/
    ) {
    global $databaseName;

    //create array of {date, score} objects
    //Read through union of tables where name== and date DESC

    //if month!=lastmonth, create new object
    //array_push(new object)
    //add to [$i]->score


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
                $query=$conn->prepare("SELECT `activity_timestamp`, `activity_score`, `activity_count` FROM $table WHERE name = ? ORDER BY `activity_timestamp` DESC ");
                $query->bind_param("s", $person_name);
            }
            else{
                $query=$conn->prepare("SELECT `activity_timestamp`, `activity_score`, `activity_count` FROM $table ORDER BY `activity_timestamp` DESC ");
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
                $sql.=" SELECT `activity_timestamp`, `activity_score`, `activity_count` FROM $dataTable->tableName ";
                if(isset($person_name)) {
                    $sql.=" WHERE name=?";
                }
                $count++;
            }
            $sql.=" ORDER BY `activity_timestamp` DESC";
            $query=$conn->prepare($sql);

            if(isset($person_name)) {
                //Calling bind_param on the dynamic SQL that was just made requires creating a string_format type string and an array of references to the parameters.
                $format="";
                for($i=0; $i<$count; $i++) {
                    $format.="s";
                }
                $param=[$format];
                for($i=0; $i<$count; $i++) {
                    $param[]= &$person_name;
                }
                call_user_func_array([$query, 'bind_param'], $param);
            }

        }
        $query->execute();
        $result=$query->get_result();
    }
    catch(Exception $err){
        logError("SQL(".__FILE__.", Query):\n" .$err->getMessage());
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
        }
        $activityDatapoints[$currentIndex]->score+=$row['activity_score'];
        $activityDatapoints[$currentIndex]->activities+=$row['activity_count'];
        unset($row);
    }

    $query->close();
    SQL_close_session($conn);

    return(json_encode($activityDatapoints));
    
}
?>