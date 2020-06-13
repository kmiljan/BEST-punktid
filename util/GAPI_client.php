<?php
require_once('../vendor/autoload.php');
require_once('../util/global.php');
require_once('../util/SQLimport.php');

/**
 * Returns an authorized API client.
 * @return Google_Client the authorized client object
 */
function getClient($type)
{
    global $PUBLIC_PATH;

    putenv("GOOGLE_APPLICATION_CREDENTIALS=$PUBLIC_PATH/auth/cosmic-kiln-255715-4a5710028d7e.json");

    $client = new Google_Client();
    $client->setApplicationName('BEST punktisüsteem PHP backend');
    $client->setScopes([Google_Service_Sheets::SPREADSHEETS_READONLY, Google_Service_Drive::DRIVE_METADATA_READONLY]);
    $client->useApplicationDefaultCredentials();
    
    return $client;
}