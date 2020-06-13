<?php
require_once('../util/global.php');
require_once('../util/SQLimport.php');
require_once('../util/GAPI_client.php');
require_once('../util/SQL_session.php');
require_once('../util/updateDatabase.php');

//load state file, which holds the time of the last database update try
$FORCE_UPDATE=false;
$state=json_decode(file_get_contents($PUBLIC_PATH."/state/state.json"));

if(isset($_GET['force'])) {
    if($_GET['force']=='true') {
        $updatedAnyDatabases=true;
        $FORCE_UPDATE=true;
    }
}

$SQL_session=SQL_new_session();
$transactionId="UPDATE_".date('Y_m_d_TH_i_s_v');
if(SQL_start_transaction($SQL_session, $transactionId)==true){
    $updatedAnyDatabases=false;
    foreach($dataTables as $dataTable) {

        //Try to update the databases
        if(reloadDatabase($SQL_session, $dataTable->URL, $dataTable->range, $databaseName, $dataTable->tableName, $dataTable->rowToSQLHandler)==true) {
            $updatedAnyDatabases=true;
        };
    }
    
    
    /*$dataTable=$dataTables['TTG'];
    reloadDatabase($SQL_session, $dataTable->URL, $dataTable->range, $databaseName, $dataTable->tableName, $dataTable->rowToSQLHandler);*/
    
    $state->lastDatabaseUpdateTime=date(DateTimeInterface::RFC3339);
    file_put_contents($PUBLIC_PATH."/state/state.json", json_encode($state));


    
    //Only run the metadata collection if there were databases that were updated
    
    if ($updatedAnyDatabases==true) {
        $transactionId="UPDATE_".date('Y_m_d_TH_i_s_v');
        if(SQL_start_transaction($SQL_session, $transactionId)==true){
            //$SQL_session=SQL_new_session();
            $metadataTransactionId="UPDATE_".date('Y_m_d_TH_i_s_v');
            require_once('../util/collectMetadata.php');
            collectAllPersonalMetadata($SQL_session);
            collectGroupMetadata($SQL_session);
            collectNames($SQL_session, $dataTables);
            collectPersonalGlobalMetadata($SQL_session);
            SQL_commit_transaction($SQL_session, $transactionId);
        }
    
    }
    SQL_commit_transaction($SQL_session, $transactionId);
    SQL_close_session($SQL_session);
}
else {
    echo("couldn't begin transaction");
    SQL_close_session($SQL_session);
}

//Save the current time as the last time the system tried to update the databases



?>