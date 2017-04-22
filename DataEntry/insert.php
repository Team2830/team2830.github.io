<?php
$team=$_POST["team"];
$match=$_POST["match"];
$autoAttemptGear=(empty($_POST["auto-attempt-gear"])) ? 'no':$_POST["auto-attempt-gear"];
$autoPlacedGear=(empty($_POST["auto-placed-gear"])) ? 'no':$_POST["auto-placed-gear"];
$ballPickup=(empty($_POST["ball-pickup"])) ? 'no':$_POST["ball-pickup"];
$gearPickup=(empty($_POST["gear-pickup"])) ? 'no':$_POST["gear-pickup"];
$autoPosition = $_POST["pos"];
$mobility=(empty($_POST["mobility"])) ? 'no':$_POST["mobility"];
$autokPa=(empty($_POST["auto-kPa"])) ? 0:$_POST["auto-kPa"];
$autoAccuracy=(empty($_POST["auto-accuracy"])) ? 0:$_POST["auto-accuracy"];
$teleGearsMade=(empty($_POST["gears-made"])) ? 0:$_POST["gears-made"];
$teleGearsAttempted=(empty($_POST["gears-attempted"])) ? 0:$_POST["gears-attempted"];
$telekPa=(empty($_POST["balls-scored"])) ? 0:$_POST["balls-scored"];
$teleAccuracy=(empty($_POST["teleop-accuracy"])) ? 0:$_POST["teleop-accuracy"];
$climbAttempt=(empty($_POST["climb-attempt"])) ? 'no attempt':$_POST["climb-attempt"];
$climbSuccess=(empty($_POST["climb-success"])) ? 'no attempt':$_POST["climb-success"];
$fouls=(empty($_POST["fouls"])) ? 'none':$_POST["fouls"];
$yellowCard=(empty($_POST["yellow-card"])) ? 'none':$_POST["yellow-card"];
$redCard=(empty($_POST["red-card"])) ? 'none':$_POST["red-card"];
$comments=(empty($_POST["comments"])) ? '':$_POST["comments"];


if(!empty($team) || !empty($match) || !empty($autoPosition))
{
    echo "<div>Team: $team- Match:: $match $autoPosition Entered</div>";
    $cvsData = $team . "," . $match . "," . $autoAttemptGear . "," . $autoPlacedGear . "," . $ballPickup . "," . $gearPickup . "," . $autoPosition . "," . $mobility . "," . $autokPa . "," . $autoAccuracy . "," . $teleGearsMade . "," . $teleGearsAttempted . "," . $telekPa . "," . $teleAccuracy . "," . $climbAttempt . "," . $climbSuccess . "," . $fouls . "," . $yellowCard . "," . $redCard . "," . $comments .  "\n";
    // = "Team,Match,Auto Gear Attempted,Auto Gear Placed,Ball Pickup,Gear Pickup,Auto Position Left,Auto Position Right,Auto Position Center,Mobility,Auto kPa, Auto Accuracy,Teleop Gears Made,Teleop Gears Attempted,Teleop kPa,Teleop Accuracy,Climb Attempt,Climb Success,Fouls,Yellow Card,Red Card,Comments\n";
    $fp = fopen("matchData.csv", "a");
   // $fileText  = file_get_contents($fp);
    if($fp)
    {
  //      $fileText = file_get_contents($fp);
 //       if(strpos($fileText, $headers) !== false)
        {
            fwrite($fp, $cvsData);
            fclose($fp);
        }
    }
}
include '2017-data.html';
?>