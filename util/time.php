<?php
//date ( string $format='Y-m-d' ) ->YYYY-MM-DD
function compareDate(string $earlier, string $later=null) {
        if(!isset($later)) {
            $later = date('Y-m-d');
        }
        
        if(strtotime($earlier)<strtotime($later)) {
            return true;
        }
        return false;
    }
    function compareDateInclusive(string $earlier, string $later=null) {
        if(!isset($later)) {
            $later = date('Y-m-d');
        }
        
        if(strtotime($earlier)<=strtotime($later)) {
            return true;
        }
        return false;
    }
    function compareDateTimeInclusive($earlier, $later=null) {
        if(!isset($later)) {
            $later = date(DateTimeInterface::RFC3339);
        }
        
        if(strtotime($earlier)<=strtotime($later)) {
            return true;
        }
        return false;
    }
    function getMonth( $a) {
        preg_match('/([0-9]{4})-([0-9]{2})-([0-9]{2})/i', $a, $matches_a);
        return $matches_a[2];
    }
    function getYear($a) {
        preg_match('/([0-9]{4})-([0-9]{2})-([0-9]{2})/i', $a, $matches_a);
        return $matches_a[1];
    }
    function equivalentMonthAndYear(string $a, string $b) {
        if(
            preg_match('/([0-9]{4})-([0-9]{2})-([0-9]{2})/i', $a, $matches_a)
            and
            preg_match('/([0-9]{4})-([0-9]{2})-([0-9]{2})/i', $b, $matches_b)
        ) { //format is YYYY-MM-DD
            if($matches_a[1]==$matches_b[1] and $matches_a[2]==$matches_b[2]) {
                return true;
            }
            
        }
        return false;
    }
    function equivalentYear(string $a, string $b) {
        if(
            preg_match('/([0-9]{4})-([0-9]{2})-([0-9]{2})/i', $a, $matches_a)
            and
            preg_match('/([0-9]{4})-([0-9]{2})-([0-9]{2})/i', $b, $matches_b)
        ) { //format is YYYY-MM-DD
            if($matches_a[1]==$matches_b[1]) {
                return true;
            }
            
        }
        return false;
    }
    function getMonthStartDate() {
        return date('Y-m')."-01";
    }
    function getYearStartDate() {
        return date('Y')."-01-01";
    }
    $__seasonStartDate='-08-01';
    function getSeasonStartDate() {
        //Season starts at 1 August
        global  $__seasonStartDate;
        if (compareDate(date('Y').$__seasonStartDate)) {  //Today is later than this year's season change date. The season started this year.
            return date('Y').$__seasonStartDate;
        }
        else {  //Today is earlier than this year's season change date (the current month is February, for example). The active season thus started last year.
            return date("Y",strtotime("-1 year")).$__seasonStartDate;
        }
        return date('Y')."-01-01";
    }
    function getSeasonEndDate() {
        //Season starts at 1 August
        global  $__seasonStartDate;
        if (compareDate(date('Y').$__seasonStartDate)) {  //Today is later than this year's season change date. The season started this year. It ends next year, though.
            return date('Y',strtotime("+1 year ")).$__seasonStartDate;
        }
        else {  //Today is earlier than this year's season change date (the current month is February, for example). The active season thus started last year. It ends this year, though.
            return date("Y").$__seasonStartDate;
        }
        return date('Y')."-01-01";
    }
    function dateIsBetween_Inclusive_Exclusive($input, $start, $end) {
        //echo("Inputs: $input, $start, $end");
        if (compareDateInclusive($start, $input) and compareDate($input, $end)) {
            return true;
        }
        return false;
    }
    function isInCurrentSeason($input) {
        return dateIsBetween_Inclusive_Exclusive($input, getSeasonStartDate(), getSeasonEndDate());
    }
    $CONST_MONTHS=[
        ['Jan', '01'],
        ['Feb', '02'],
        ['Mar', '03'],
        ['Apr', '04'],
        ['May', '05'],
        ['Jun', '06'],
        ['Jul', '07'],
        ['Aug', '08'],
        ['Sep', '09'],
        ['Oct', '10'],
        ['Nov', '11'],
        ['Dec', '12'],
        /*['01', '01'],
        ['02', '02'],
        ['03', '03'],
        ['04', '04'],
        ['05', '05'],
        ['06', '06'],
        ['07', '07'],
        ['08', '08'],
        ['09', '09'],
        ['10', '10'],
        ['11', '11'],
        ['12', '12'],*/
        ['Jan', '01'],
        ['Veb', '02'],
        ['Mär', '03'],
        ['Apr', '04'],
        ['Mai', '05'],
        ['Juun', '06'],
        ['Juul', '07'],
        ['Aug', '08'],
        ['Sept', '09'],
        ['Okt', '10'],
        ['Nov', '11'],
        ['Dets', '12']
    ];
?>