<?php
$servername = "localhost";
$username = "serverApplication";
$password = "Hannapunanediivan";

// Create connection
$conn = new mysqli($servername, $username, $password);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//
$sql = "USE best_points";
if ($conn->query($sql) === TRUE) {
    echo "Database selected successfully";
} else {
    echo "Error selecteding database: " . $conn->error;
}
$sql = "INSERT INTO `points_ttg`(`name`, `activity`, `activity_count`, `activity_timestamp`, `activity_comment`, `activity_special_points`, `activity_score`)
VALUES ('a','b',5,32,'jah',9,12)";
if ($conn->query($sql) === TRUE) {
    echo "Data created successfully";
} else {
    echo "Error creating data: " . $conn->error;
}

$conn->close();

?>