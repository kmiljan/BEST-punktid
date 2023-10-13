<?php
function SQL_new_session() {
    ini_set('mssql.charset', 'UTF-8');
    ini_set('default_charset', 'utf-8');
    global $servername;
    global $username;
    global $password;
    global $databasePort;

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    try{
        $conn= new mysqli($servername, $username, $password, null, $databasePort);
        //$conn->set_charset ("utf8mb4");
        $conn->query("SET NAMES 'utf8mb4'");
    }
    catch(Exception $err){
        logError("SQL(".__FILE__.", Session estabilishment and configuration):\n" .$err->getMessage());
        exit(1);
    }
    return $conn;
    
}
function SQL_close_session($session) {
    $session->close();
}
function SQL_start_transaction($session, $transaction_name) {
    try {
        $session->query("SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;");
        $session->begin_transaction (MYSQLI_TRANS_START_WITH_CONSISTENT_SNAPSHOT, $transaction_name);
        return true;
    }
    catch(Exception $err){
        logError("SQL:" .$err->getMessage());
    }
}
function SQL_commit_transaction($session, $transaction_name) {
    if ($session->connect_error) {
        die("Connection failed: " . $session->connect_error);
    }
    if ($session->commit(0, $transaction_name) === TRUE) {
        logLog("Transaction committed");
        return true;
    } else {
        logError("Error commiting transaction: " . $session->error);
        return false;
    }
}
?>
