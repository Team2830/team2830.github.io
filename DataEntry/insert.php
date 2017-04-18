<?php

$team=$_POST["team"];
$match=$_POST["match"];
$autoAttemptGear=$_POST["auto-attempt-gear"];
$autoPlacedGear=$_POST["auto-placed-gear"];



if(!empty($team) || !empty($match) ){
echo "<div>Team: $team- Match:: $match  Entered</div>";

$cvsData = $team . "," . $match . "," . $autoAttemptGear . "," . $autoPlacedGear . "\n"; // Add newline

$fp = fopen("matchData.csv","a"); // $fp is now the file pointer to file $filename

    if($fp)
    {
        fwrite($fp,$cvsData); // Write information to the file
        fclose($fp); // Close the file
    }
}
include '2017-data.html';
?>