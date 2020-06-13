<?php
function stringRemap(String $str, Array $strArr, Array $replaceArr) {
        $key=array_search(
            strtoupper(trim($str)),
            $strArr
        );
        if($key===false) {
            return $str;
        }
        else {
            return $replaceArr[$key];
        }
    }
    $NAMES_TO_BE_REPLACED=['LARS ASJ'];
    $NAMES_TO_REPLACE_WITH=['Lars Asi'];
?>