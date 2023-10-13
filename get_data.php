<?php
require_once('util/global.php');
$type=strtolower($_GET["type"]);
//TODO
// Refactor this. Create one file per request. For example like endpoints/searchByName.php
switch($type) {
    case 'personaldata':
        $person_name=$_GET["person_name"];
        
        if(!empty($_GET["group"])) {
            $group=$_GET["group"];
            $dataTableKeyExists=false;
            foreach($dataTables as $i=>$dataTable) {
                if($dataTable->name==$group) {
                    $dataTableKeyExists=true;
                }
            }
            unset($dataTable);
            if($dataTableKeyExists) {
                require_once('util/dataToJSON/personalDataToJSON.php');
                echo(personalDataToJSON($person_name, $dataTables[$group]));
            }
        }
        else {
            require_once('util/dataToJSON/personalDataToJSON.php');
            $jsonstr='{';
            $first=true;
            foreach($dataTables as $i=>$dataTable) {
                if (!$first) {
                    $jsonstr.=",";
                }
                $first=false;
                $jsonstr.="\"$i\":". personalDataToJSON($person_name, $dataTable);
            }
            unset($first);
            echo($jsonstr.'}');
        }
        
        break;
    case 'personalmetadata':
        if(!empty($_GET["person_name"])) {
            $person_name=$_GET["person_name"];
            require_once('util/dataToJSON/personalMetadataToJSON.php');
            echo(personalMetadataToJSON($person_name));
        }
        break;
    case 'groupmetadata':
        require_once('util/dataToJSON/groupMetadataToJSON.php');
        echo(groupMetadataToJSON());
        break;
    case 'groups':
        require_once('util/dataToJSON/groupsToJSON.php');
        echo(groupsToJSON());
        break;
    case 'podium':
        //if(!empty($_GET["person_name"])) {
            if(empty($_GET["person_name"])) {
                $person_name=null;
            }
            else {
                $person_name=$_GET["person_name"];
            }
            
            if(empty($_GET["group"])) {
                $group=null;
            }
            else {
                $group=$_GET["group"];
            }
            if(empty($_GET["referencedata"])) {
                $referenceData=null;
            }
            else {
                $referenceData=$_GET["referencedata"];
            }
            if(empty($_GET["podiumsize"])) {
                $podiumSize=null;
            }
            else {
                $podiumSize=$_GET["podiumsize"];
            }
            if(empty($_GET["exemptBasedOnStatus"])) {
                $exemptBasedOnStatus=false;
            }
            else {
                $exemptBasedOnStatus=filter_var($_GET["exemptBasedOnStatus"], FILTER_VALIDATE_BOOLEAN);;
            }
            require_once('util/dataToJSON/placementToJSON.php');
            //($person_name, $referenceData='totalScore', $podiumSize, $group='all') {
            echo(placementToJSON($person_name, $referenceData, $podiumSize, $group, $exemptBasedOnStatus));
        //}
        break;
    case 'lastactivities':
        if(empty($_GET["person_name"])) {
            $person_name=null;
        }
        else {
            $person_name=$_GET["person_name"];
        }
        
        if(empty($_GET["group"])) {
            $group='all';
        }
        else {
            $group=$_GET["group"];
        }
        if(empty($_GET["amount"])) {
            $amount=5;
        }
        else {
            $amount=$_GET["amount"];
        }
        require_once('util/dataToJSON/lastActivities.php');
        //($person_name, $referenceData='totalScore', $podiumSize, $group='all') {
        echo(lastActivities($person_name, $group, $amount));
        break;
    case 'exempt':
        if(empty($_GET["person_name"])) {
            $person_name=null;
        }
        else {
            $person_name=$_GET["person_name"];
        }
        require_once('util/dataToJSON/isExempt.php');
        //($person_name, $referenceData='totalScore', $podiumSize, $group='all') {
            
        $val=isExempt($person_name);
        if($val==true) {
            echo('{"value":"true"}');
        }
        else {
            echo('{"value":"false"}');
        }
        
        break;
    case 'personalstatus':
        if(empty($_GET["person_name"])) {
            $person_name=null;
        }
        else {
            $person_name=$_GET["person_name"];
        }
        require_once('util/dataToJSON/status.php');
        //($person_name, $referenceData='totalScore', $podiumSize, $group='all') {
            
        $val=status($person_name);
        if($val!==false) {
            echo('{"status":"'.$val.'"}');
        }
        else {
            echo('{}');
        }
        
        break;
    case 'activityreport':
        if(empty($_GET["person_name"])) {
            $person_name=null;
        }
        else {
            $person_name=$_GET["person_name"];
        }
        
        if(empty($_GET["group"])) {
            $group='all';
        }
        else {
            $group=$_GET["group"];
        }
        require_once('util/dataToJSON/activityReport.php');
        //($person_name, $referenceData='totalScore', $podiumSize, $group='all') {
        echo(activityReport($person_name, $group));
        break;
}
?>