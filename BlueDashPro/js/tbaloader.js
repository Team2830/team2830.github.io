function doOnLoad() {
    if (getSetting("configured") != 1) {
        setSetting("configured", 1);
        loadDefaults(false);
        var delayedReload = function () { window.location.reload(); clearInterval(delayedReload); };
        setInterval(delayedReload, 3000);
    }
    var streamUrl = getSetting("streamurl");
    if (streamUrl != null && streamUrl != "[none]") {
        if( document.getElementById("streamFrame")){
            document.getElementById("streamFrame").src = streamUrl;
        }
    }
    if (getSetting("streambroken")) {
        document.getElementById("streamFrame").src = "streamerror/broken.html";
    }
    showHideSponsers();
    fixStream();
    doInterval();
    loadRankTotal();
    loadSponserPics();
}

function doInterval() {
    loadEventData();
}

function loadSponserPics() {
    var newpics = JSON.parse(getSetting("sponserpics"));
    for (var i = 0; i < newpics.length; i++) {
        document.getElementById("sponmarq").innerHTML += "<img src=\"" + newpics[i] + "\" height=\"90px\" class=\"pl-5\">";
    }
}

function loadRankTotal() {
    $.ajax({
        type: "GET",
        url: tbaUrl("/event/" + getSetting("eventkey") + "/teams/keys"),
        dataType: "json",
        success: function (data) {
            document.getElementById("rankTotal").innerHTML = data.length;
        }
    });
}

function formatTimeShow(h_24, m) {
    var h = h_24 % 12;
    if (h === 0) h = 12;
    return (h < 10 ? '0' : '') + h + ":" + m + (h_24 < 12 ? ' AM' : ' PM');
}

function loadEventData() {
    var nextMatchKey = "all";
    $.ajax({
        type: "GET",
        url: tbaUrl("/team/" + getSetting("teamkey") + "/event/" + getSetting("eventkey") + "/status"),
        dataType: "json",
        success: function (data) {
            loadLastMatch(data);
            loadNextMatch(data);
            loadTeamRank(data);
            if (data.next_match_key){
                nextMatchKey = data.next_match_key;
            }
            loadUpcomingMatchData(nextMatchKey);
            loadTopRanks();
        }
    });
}



function loadTeamRank(data) {
    var element = document.getElementById("teamRanking");
    if (data != null) {
        var qualData = data.qual;
        if (qualData != null) {
            element.innerHTML = qualData.ranking.rank.toString();
        } else {
            element.innerHTML = "?";
        }
    }
}


function loadTopRanks() {
    $.ajax({
        type: "GET",
        url: tbaUrl("/event/" + getSetting("eventkey") + "/rankings"),
        dataType: "json",
        success: function (data) {
            var rankData = data.rankings;
            if (data != null) {
                for (var i = 0; i < 8; i++) {
                    document.getElementById("rankTeam" + (i + 1).toString()).innerHTML = rankData[i].team_key.toString().replace("frc", "");
                    if (rankData[i].team_key.toString().replace("frc", "") == getSetting("teamkey").toString().replace("frc", "")) {
                        document.getElementById("rowTeam" + (i + 1).toString()).style = "background-color: lightgreen;";
                    } else {
                        document.getElementById("rowTeam" + (i + 1).toString()).style = "";
                    }
                }
            }
        }
    });
}

function loadLastMatch(data) {
    var lastMatchKey = data.last_match_key;
    if (lastMatchKey != null) {
        $.ajax({
            type: "GET",
            url: tbaUrl("/match/" + lastMatchKey + "/simple"),
            dataType: "json",
            success: function (data) {
                document.getElementById("lastRedScore").innerHTML = data.alliances.red.score.toString();
                document.getElementById("lastBlueScore").innerHTML = data.alliances.blue.score.toString();

                var tempTeamNumber = 0; var tempStart = ""; var tempEnd = "";
                for (var i = 0; i < 3; i++) {
                    tempTeamNumber = data.alliances.red.team_keys[i].toString().replace("frc", "");
                    if (tempTeamNumber == getSetting("teamkey").toString().replace("frc", "")) {
                        tempStart = "<u><strong>"; tempEnd = "</strong></u>";
                    } else {
                        tempStart = ""; tempEnd = "";
                    }
                    document.getElementById("lastRed" + (i + 1).toString()).innerHTML = tempStart + tempTeamNumber + tempEnd;
                }
                for (var i = 0; i < 3; i++) {
                    tempTeamNumber = data.alliances.blue.team_keys[i].toString().replace("frc", "");
                    if (tempTeamNumber == getSetting("teamkey").toString().replace("frc", "")) {
                        tempStart = "<u><strong>"; tempEnd = "</strong></u>";
                    } else {
                        tempStart = ""; tempEnd = "";
                    }
                    document.getElementById("lastBlue" + (i + 1).toString()).innerHTML = tempStart + tempTeamNumber + tempEnd;
                }

                document.getElementById("lastMatchNumber").innerHTML = data.match_number.toString();

                if (data.winning_alliance == "red") {
                    $("#lastWinBlue").addClass("d-none");
                    $("#lastWinRed").removeClass("d-none");
                } else if (data.winning_alliance == "blue") {
                    $("#lastWinBlue").removeClass("d-none");
                    $("#lastWinRed").addClass("d-none");
                }
            }
        });
    }
}

function loadNextMatch(data) {
    var nextMatchKey = data.next_match_key;
    if (nextMatchKey != null) {
        $.ajax({
            type: "GET",
            url: tbaUrl("/match/" + nextMatchKey + "/simple"),
            dataType: "json",
            success: function (data) {
                var tempTeamNumber = 0; var tempStart = ""; var tempEnd = "";
                for (var i = 0; i < 3; i++) {
                    tempTeamNumber = data.alliances.red.team_keys[i].toString().replace("frc", "");
                    if (tempTeamNumber == getSetting("teamkey").toString().replace("frc", "")) {
                        tempStart = "<u><strong>"; tempEnd = "</strong></u>";
                    } else {
                        tempStart = ""; tempEnd = "";
                    }
                    document.getElementById("nextRed" + (i + 1).toString()).innerHTML = tempStart + tempTeamNumber + tempEnd;
                }
                for (var i = 0; i < 3; i++) {
                    tempTeamNumber = data.alliances.blue.team_keys[i].toString().replace("frc", "");
                    if (tempTeamNumber == getSetting("teamkey").toString().replace("frc", "")) {
                        tempStart = "<u><strong>"; tempEnd = "</strong></u>";
                    } else {
                        tempStart = ""; tempEnd = "";
                    }
                    document.getElementById("nextBlue" + (i + 1).toString()).innerHTML = tempStart + tempTeamNumber + tempEnd;
                }

                document.getElementById("nextMatchNumber").innerHTML = data.match_number.toString();
            }
        })
    }
}
function loadUpcomingMatchData(nextMatchKey){
    $.ajax({
        type: "GET",
        url: tbaUrl("/team/" + getSetting("teamkey") + "/event/" + getSetting("eventkey") + "/matches/simple"),
        dataType: "json",
        success: function (data) {
            loadUpcomingOpponents(data, nextMatchKey);
        }
    });
}

function loadUpcomingOpponents(data, nextMatchKey) {
    var output = "";
    var opponentArray;
    var teamArray = [];
    atNextMatch = false;
    for (key in data) {
        opposingAlliance = "blue";
        homeAlliance = "red";
        for (team in data[key].alliances['blue'].team_keys) {
            if (data[key].alliances['blue'].team_keys[team] == getSetting('teamkey')) {
                opposingAlliance = "red";
                homeAlliance = "blue";
              //  alert(key+":"+data[key].alliances['blue'].team_keys[team] +":"+"blue")
            }
        }
        for (team in data[key].alliances['red'].team_keys) {
            if (data[key].alliances['red'].team_keys[team] != getSetting('teamkey')) {
                if (homeAlliance == "red") {
                    var homeTeam = {
                        teamNumber: data[key].alliances['red'].team_keys[team].toString().replace("frc", ""),
                        comp_level: data[key].comp_level,
                        match: data[key].match_number,
                        side: "partner",
                        predicted_time: data[key].predicted_time
                      };
                 } else{
                var homeTeam = {
                    teamNumber: data[key].alliances['red'].team_keys[team].toString().replace("frc", ""),
                    comp_level: data[key].comp_level,
                    match: data[key].match_number,
                    side: "opponent",
                    predicted_time: data[key].predicted_time
                  };
                }
                teamArray.push(homeTeam);

            }
        }
        for (team in data[key].alliances['blue'].team_keys) {
            if (data[key].alliances['blue'].team_keys[team] != getSetting('teamkey')) {
                if (homeAlliance == "blue") {
                    var homeTeam = {
                        teamNumber: data[key].alliances['blue'].team_keys[team].toString().replace("frc", ""),
                        comp_level: data[key].comp_level,
                        match: data[key].match_number,
                        side: "partner",
                        predicted_time: data[key].predicted_time
                      };
                 } else{
                var homeTeam = {
                    teamNumber: data[key].alliances['blue'].team_keys[team].toString().replace("frc", ""),
                    comp_level: data[key].comp_level,
                    match: data[key].match_number,
                    side: "opponent",
                    predicted_time: data[key].predicted_time
                  };
                }
                teamArray.push(homeTeam);            }
        }
    }
    function compare(a, b) {
        // Use toUpperCase() to ignore character casing
        const matchA = a.predicted_time;
        const matchB = b.predicted_time;
      
        let comparison = 0;
        if (matchA > matchB) {
          comparison = 1;
        } else if (matchA < matchB) {
          comparison = -1;
        }
        return comparison;
      }
      
      teamArray.sort(compare);

    for (var t = 0; t < teamArray.length; t++) {
        if(atNextMatch || nextMatchKey=='all'){
            output += "<tr><td><a href='team-detail.html?team=" + teamArray[t].teamNumber +"' target='_blank'>" + teamArray[t].teamNumber + "</a></td>";
            output += "<td>" + teamArray[t].comp_level+teamArray[t].match + "</td>";
            output += "<td>" + teamArray[t].side + "</td></tr>";
        }else if( teamArray[t].comp_level+teamArray[t].match == nextMatchKey){
            atNextMatch = true;
            output += "<tr><td>" + teamArray[t].teamNumber + "</td>";
            output += "<td>" + teamArray[t].comp_level+teamArray[t].match + "</td>";
            output += "<td>" + teamArray[t].side + "</td></tr>";
        }
       
        
    }


    //   output+= data[key].alliances['blue'].team_keys[0];

document.getElementById("opponentsTab").innerHTML = output;
        
}

window.onload = doOnLoad;
window.setInterval(doInterval, 5000);
