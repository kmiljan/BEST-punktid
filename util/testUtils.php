<?php
    //echo($_SERVER['DOCUMENT_ROOT']);
    require('global.php');
    require('SQLimport.php');
    $input="";
    $input=typeEnforceNumerical($input);
    echo($input."
");
    $input=" ";
    $input=typeEnforceNumerical($input);
    echo($input."
");
    $input="4";
    $input=typeEnforceNumerical($input);
    echo($input."
");
    $input="4r";
    $input=typeEnforceNumerical($input);
    echo($input."
");
    echo(GAPI_dateTo_SQL("2019-Dec04"));
    echo("
".compareDate("2019-03-02", "2019-03-01")."
");

    echo("
".equivalentYear("2022-03-02", "2019-03-01")."
");

    echo("
".dateIsBetween_Inclusive_Exclusive("2019-03-02", getSeasonStartDate(), getSeasonEndDate())."
");
    $gd=new GroupData();
    array_push($gd->breakdown, new GroupDataBreakdownElement("boi", 2, 2));
    array_push($gd->breakdown, new GroupDataBreakdownElement("fam", 2, 2));
    array_push($gd->breakdown, new GroupDataBreakdownElement("bruh", 2, 2));
    var_dump($gd);
    echo($gd->isInBreakdownList("boi"));

?>