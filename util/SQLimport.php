<?php
function strToRegex($input) {
    $return=sprintf("/([%s]){3}/i", $input);
    //echo('<br>'.$return);
    return $return;
}
function GAPI_dateTo_SQL($str) {    //Convert ambiguous date formats to YYYY-MM-DD
    
    if (empty($str)) {
        return 0;
    }
    
    if(preg_match('/([0-9]{4})-([0-9]{2})-([0-9]{2})/i', $str)) { //format is YYYY-MM-DD
        //echo("already well-formed");
        return $str;
    }
    else if(preg_match('/([0-9]{2})-([0-9]{2})-([0-9]{4})/i', $str, $matches)) { //format is DD-MM-YYYY
        //echo("wrong order");
        return ($matches[3]."-".$matches[2]."-".$matches[1]);
    }
    else if(preg_match('/([0-9]{4})-([A-Z]+)-([0-9]{1,2})/i', $str, $matches)) { //format is YYYY-Month name-DD
        //echo("Month has a name");
        if (strlen($matches[3])==1) {   //If day is a single digit
            $str=$matches[1].'-'.$matches[2].'-0'.$matches[3];
        }
        global $CONST_MONTHS;
        foreach($CONST_MONTHS as $month) {
            if (preg_match(strToRegex($month[0]), $str) == true) { 
                return preg_replace(strToRegex($month[0]), $month[1], $str, 1);
            }
            
        }
        logError("Date format function could not format input date string \"$str\"  of pattern YYYY-Month name-DD to a string suitable for SQL date format: YYYY-MM-DD.");
        return false;
    }
    else if(preg_match('/([0-9]{2})\/([0-9]{2})\/([0-9]{4})/i', $str, $matches)) { //format is DD/MM/YYYY
        //echo("Wrong separators, wrong order");
        return ($matches[3]."-".$matches[2]."-".$matches[1]);
    }
    else if(preg_match('/([0-9]{4})[-\/]*([A-Z]+)[-\/]*([0-9]{1,2})/i', $str, $matches)) { //missing separator(s)
        return GAPI_dateTo_SQL( $matches[1].'-'.$matches[2].'-'.$matches[3]);
    }
    logError("Date format function could not format input date string \"$str\" to a string suitable for SQL date format: YYYY-MM-DD.");
    
}

function findNumberFromString($str) {
    if (!empty($str)) {
        if (preg_match('/([0-9])+/i', $str, $match) == true) { 
            return $match[0];
        }
        logError("String first number finder function could not find any numbers from \"$str\"");
    }
    return 0;
}
function typeEnforceNumerical(&$input) {
    if(empty($input)) {
        return 0;
    }
    if(is_numeric($input)) {
        return (float)$input;
    }
    else {
        return 0;
    }
}
?>