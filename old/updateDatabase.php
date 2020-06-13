<?php
$PUBLIC_PATH='C:/xampp/htdocs';
require_once($PUBLIC_PATH.'/vendor/autoload.php');
require_once($PUBLIC_PATH.'/util/global.php');
require_once($PUBLIC_PATH.'/util/SQLimport.php');
/*if (php_sapi_name() != 'cli') {
    throw new Exception('This application must be run on the command line.');
}*/

/**
 * Returns an authorized API client.
 * @return Google_Client the authorized client object
 */
function getClient($type)
{
    /*
    type="use"->for using the return value to make API calls. Should redirect to a page implementing type="get" if authorization isn't correct
    type="get"->for redirecting the user to Google's authorization page
    type="set"->for capturing the code string from Google's authorization page
    */
    $client = new Google_Client();
    $client->setApplicationName('Google Sheets API PHP Quickstart');
    $client->setScopes(Google_Service_Sheets::SPREADSHEETS_READONLY);
    $client->setAuthConfig('credentials.json');
    $client->setAccessType('offline');
    $client->setPrompt('select_account consent');

    // Load previously authorized token from a file, if it exists.
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    $tokenPath = 'token.json';
    if (file_exists($tokenPath)) {
        $accessToken = json_decode(file_get_contents($tokenPath), true);
        $client->setAccessToken($accessToken);
    }

    // If there is no previous token or it's expired.
    if ($client->isAccessTokenExpired()) {
        // Refresh the token if possible, else fetch a new one.
        if ($client->getRefreshToken()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
        } else {
            // Request authorization from the user.
            $authUrl = $client->createAuthUrl();
            printf("Open the following link in your browser:\n%s\n", $authUrl);
            print 'Enter verification code: ';
            $authCode = trim(fgets(STDIN));

            // Exchange authorization code for an access token.
            $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);
            $client->setAccessToken($accessToken);

            // Check to see if there was an error.
            if (array_key_exists('error', $accessToken)) {
                throw new Exception(join(', ', $accessToken));
            }
        }
        // Save the token to a file.
        if (!file_exists(dirname($tokenPath))) {
            mkdir(dirname($tokenPath), 0700, true);
        }
        file_put_contents($tokenPath, json_encode($client->getAccessToken()));
    }
    return $client;
}
function reloadDatabase($spreadsheetId, $range, $databaseName, $tableName) {
    logLog("Database request started: URL:$spreadsheetId, Range:$range, DB:$databaseName, Table:$tableName");
    // Get the API client and construct the service object.
    $client = getClient();
    $service = new Google_Service_Sheets($client);


    /*$spreadsheetId = '1axHg0B2W-_a2cYOArmU8yimKrMA4tpDGRmIGgGkwaX8';
    $range = '[D] Logid imporditud!A5:G';*/
    $response = $service->spreadsheets_values->get($spreadsheetId, $range);
    $values = $response->getValues();
    logLog("Database data recieved");

    global $servername;
    global $username;
    global $password;

    // Create connection
    $conn = new mysqli($servername, $username, $password);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    //
    $sql = "USE $databaseName";
    if ($conn->query($sql) === TRUE) {
        logLog("Database selected successfully");
    } else {
        logLog("Error selecteding database: " . $conn->error."\n");
    }
    $sql = "DELETE FROM `$tableName`";
    if ($conn->query($sql) === TRUE) {
        logLog("Database emptied successfully");
    } else {
        logLog("Error emptying database: " . $conn->error."\n");
    }

    if (empty($values)) {
        print "No data found.\n";
    } else {
        $entriesCount=0;
        foreach ($values as $row) {
            if(!empty($row[0]) and !empty($row[1]) and !empty($row[2])) {
                // Print columns A and E, which correspond to indices 0 and 4.
                //printf("%s, %s, %s, %s, %s, %s, %s<br>\n", $row[0], $row[1], $row[2], $row[3], $row[4], $row[5], $row[6]);
                
                //Input formatting

                //sanitize all inputs
                foreach($row as $k=>$field) {
                    $row[$k]=$conn->real_escape_string($field); 
                }
                $row[3]=GAPI_dateTo_SQL($row[3]);
                $row[5]=findNumberFromString($row[5]);

                //Set numerical values to 0 if empty
                typeEnforceNumerical($row[3]);
                typeEnforceNumerical($row[5]);
                typeEnforceNumerical($row[6]);
                

                //Add to SQL table
                $sql = "INSERT INTO `$tableName`(`name`, `activity`, `activity_count`, `activity_timestamp`, `activity_comment`, `activity_special_points`, `activity_score`)
VALUES ('$row[0]','$row[1]',$row[2], '$row[3]','$row[4]', $row[5], $row[6])";
                //echo("<br>$sql<br>");
                if ($conn->query($sql) === TRUE) {
                    //echo "Data created successfully";
                } else {
                    logError("Error creating data: " . $conn->error ." "."SQL: ".$sql);
                }
                $entriesCount++;
            }
            else if(!empty($row[0])) {  //If there's atleast a name, but otherwise there are missing parts, log it.
                logLog("Ignored malformed entry to $tableName. Contents: ".implode(" ", $row));
            }
        }
        
        logLog("Database data updated, total $entriesCount entries");
    }
    $conn->close();
}
