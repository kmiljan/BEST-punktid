<?php
    class RawDataTable {
        public $name;
        public $URL;
        public $range;
        public $tableName;
        public $personalMetaTableName;
        public $groupMetaTableName;
        public $rowToSQLHandler;
        public $colors;
        public $gradientFile;
        function __construct($_name, $_URL, $_range, $_tableName, $_personalMetaTableName, $_groupMetaTableName, $_rowToSQLHandler, $_colors, $_gradientFile) {
            $this->name=$_name;
            $this->URL=$_URL;
            $this->range=$_range;
            $this->tableName=$_tableName;
            $this->personalMetaTableName=$_personalMetaTableName;
            $this->groupMetaTableName=$_groupMetaTableName;
            $this->rowToSQLHandler=$_rowToSQLHandler;
            $this->colors=$_colors;
            $this->gradientFile=$_gradientFile;
        }
    }
    class RawEntry {
        public $name;
        public $activity;
        public $activity_count;
        public $activity_timestamp;
        public $activity_comment;
        public $activity_special_points;
        public $activity_score;
        function __construct($_name, $_activity, $_activity_count, $_activity_timestamp, $_activity_comment, $_activity_special_points, $_activity_score) {
            $this->name=$_name;
            $this->activity=$_activity;
            $this->activity_count=$_activity_count;
            $this->activity_timestamp=$_activity_timestamp;
            $this->activity_comment=$_activity_comment;
            $this->activity_special_points=$_activity_special_points;
            $this->activity_score=$_activity_score;
        }
    }
    class GroupData {
        public $totalScore=0;
        public $breakdown=[];
        public $place;
        function isInBreakdownList($name) {
            if (empty($this->breakdown)) {  //$breakdown is empty, don't look through it
                return null;
            }
            foreach($this->breakdown as $i=>$element) {
                if (strcasecmp(trim($element->name),trim($name))==0) {
                    return $i;    //There already is a breakdownListElement of this name, so we can add to it's score
                }
            }
            return null;   //Didn't find it (So it's likely we must create it)
        }
    }
    class GroupPersonalMetadata {
        //public $groupName;
        public $totalScore;
        public $totalScoreThisMonth;
        public $totalScoreThisYear;
        public $totalScoreThisSeason;
        public $totalActivities;
        public $totalActivitiesThisMonth;
        public $totalActivitiesThisYear;
        public $totalActivitiesThisSeason;
        function __construct() {
            //$this->groupName=null;
            $this->totalScore=0;
            $this->totalScoreThisMonth=0;
            $this->totalScoreThisYear=0;
            $this->totalScoreThisSeason=0;
            $this->totalActivities=0;
            $this->totalActivitiesThisMonth=0;
            $this->totalActivitiesThisYear=0;
            $this->totalActivitiesThisSeason=0;
        }
        /*public $totalScorePerActivities=0;
        public $totalScorePerActivitiesThisMonth=0;
        public $totalScorePerActivitiesThisYear=0;*/
    }
    class ActivityElement {
        public $name;
        public $count;
        public $score;
        public $timestamp;
        function __construct($_name, $_count, $_timestamp, $_score) {
            $this->name=$_name;
            $this->count=$_count;
            $this->timestamp=$_timestamp;
            $this->score=$_score;
        }
    }
    class GroupDataBreakdownElement {
        public $name;
        public $count=0;
        public $score=0;
        function __construct($_name, $_count, $_score) {
            $this->name=$_name;
            $this->count=$_count;
            $this->score=$_score;
        }
    }
    class PodiumPosition {
        public $name;
        public $score;
        public $place;
        function __construct($_name, $_score, $_place) {
            $this->name=$_name;
            $this->score=$_score;
            $this->place=$_place;
        }
    }
    class Person {
        public $name;
        public $status;
        function __construct($_name, $_status) {
            $this->name=$_name;
            $this->status=$_status;
        }
    }
    class timeScorePoint {
        public $y;
        public $m;
        public $score;
        public $activities;
        function __construct($_y, $_m, $_activities, $_score) {
            $this->y=$_y;
            $this->m=$_m;
            $this->activities=$_activities;
            $this->score=$_score;
        }
    }
?>