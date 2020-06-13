<?php
function val_round($number) {
    return round($number, 2, PHP_ROUND_HALF_UP);
}
function val_round_ref(&$number) {
    $number=round($number, 2, PHP_ROUND_HALF_UP);
}
function logError($str) {
    global $error_log_path;
    $t=new DateTime();
    error_log($t->format("Y-m-d\TH:i:s:v")." ".$str.'
', 3, $error_log_path);
}
function logLog($str) {
    global $log_log_path;
    $t=new DateTime();
    error_log($t->format("Y-m-d\TH:i:s:v")." ".$str.'
', 3, $log_log_path);
}
?>