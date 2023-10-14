<?php

require_once('../host/host.php');
require_once('../util/SQL_session.php');


/**
 * @param string|null $personName
 * @return array<ActivityReportItem>
 */
function getActivityReport(string|null $personName): array
{
    $queryResult = queryActivityReport($personName);
    $values = array_values($queryResult);
    if (sizeof($queryResult) < 2) {
        return $values;
    }

    $firstItem = $values[0];
    $lastItem = end($values);

    $completeRange = generateYearMonthRange($firstItem->year, $firstItem->month, $lastItem->year, $lastItem->month);
    $result = array();

    foreach ($completeRange as $completeRangeItem) {
        $year = $completeRangeItem['y'];
        $month = $completeRangeItem['m'];
        $key = "$year-$month";

        $result[] = $queryResult[$key] ?? new ActivityReportItem($year, $month, 0, 0);
    }

    return $result;
}


function generateYearMonthRange($startYear, $startMonth, $endYear, $endMonth): array
{
    $yearMonthRange = [];

    for ($year = $startYear; $year <= $endYear; $year++) {
        $beginMonth = ($year == $startYear) ? $startMonth : 1;
        $finishMonth = ($year == $endYear) ? $endMonth : 12;

        for ($month = $beginMonth; $month <= $finishMonth; $month++) {
            $yearMonthRange[] = ['y' => $year, 'm' => $month];
        }
    }
    return $yearMonthRange;
}

class ActivityReportItem {
    public function __construct(
        public int $year,
        public int $month,
        public int $countOfActivities,
        public int $pointsTotal
    )
    {
    }
}

/**
 * @param string|null $personName
 * @return array<string, ActivityReportItem>
 */
function queryActivityReport(string|null $personName): array
{
    global $privateAreaDatabaseName;
    $minDate = (new DateTime('2017-01-01'))->format("Y-m-d");

    $filterQuery = "";

    $filterByPerson = $personName != null && $personName != '';

    if ($filterByPerson) {
        $filterQuery = "
        LEFT JOIN Liikmelisus L on Ps.liikmelisus_id = L.liikmelisus_id
        LEFT JOIN Isik I on L.isik_id = I.isik_id
        WHERE CONCAT_WS(' ', NULLIF(I.eesnimi, ''), NULLIF(I.perenimi, ''), IF(NULLIF(I.hyydnimi, '') IS NULL, NULL, CONCAT('(', I.hyydnimi, ')'))) = ?
        AND Pss.min_toimumise_aeg >= ?";
    }
    else {
        $filterQuery = "WHERE Pss.min_toimumise_aeg >= ?";
    }

    $sql = "
    SELECT YEAR(min_toimumise_aeg) as toimumise_aasta,
           MONTH(min_toimumise_aeg) as toimumise_kuu,
           COUNT(*) as kogus,
           SUM(Ps.punktisumma) as summa
    FROM (
        select PssInner.punkti_saamine_id, MIN(PssInner.toimumise_aeg) as min_toimumise_aeg
        from Punkti_saamise_syndmus PssInner
        group by PssInner.punkti_saamine_id
    ) Pss
    LEFT JOIN Punkti_saamine Ps on Ps.punkti_saamine_id = Pss.punkti_saamine_id
    $filterQuery
    GROUP BY 
        toimumise_aasta,
        toimumise_kuu
    ORDER BY
        toimumise_aasta,
        toimumise_kuu;
    ";

    $conn = SQL_new_session();
    $conn->query("USE `$privateAreaDatabaseName`");

    $query=$conn->prepare($sql);
    if ($filterByPerson) {
        $query->bind_param('ss',  $personName, $minDate);
    } else {
        $query->bind_param('s', $minDate);
    }

    $query->execute();

    $queryResult = $query->get_result()->fetch_all();

    $result = array();
    foreach ($queryResult as $row) {
        $result["$row[0]-$row[1]"] = new ActivityReportItem(intval($row[0]), intval($row[1]), intval($row[2]), intval($row[3]));
    }

    return $result;
}