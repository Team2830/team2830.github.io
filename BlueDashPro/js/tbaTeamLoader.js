function loadEventData(team) {
    var nextMatchKey = "all";
    $.ajax({
        type: "GET",
        url: tbaUrl("/team/" + team + "/event/" + getSetting("eventkey") + "/status"),
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
function loadTeamData(team){
    $.ajax({
        type: "GET",
        url: tbaUrl("/team/" + team + "/event/" + getSetting("eventkey") + "/status"),
        dataType: "json",
        success: function (data) {
            loadEventData(team)
            loadTeam(data,team);
        }
    });


}
function loadTeam(data,teamName){
        $.ajax({
            type: "GET",
            url: tbaUrl("/team/" + teamName),
            dataType: "json",
            success: function (teamData) {
                document.getElementById("teamNumber").innerHTML = teamName.replace("frc","");
                document.getElementById("teamName").innerHTML = teamData.nickname +" "+ teamData.city+", "+teamData.state_prov;
                document.getElementById("website").href = teamData.website;
            }
        });
        document.getElementById("ranking").innerHTML =  data.qual.ranking.rank.toString();
        document.getElementById("status").innerHTML =  data.overall_status_str.toString();
        document.getElementById("record").innerHTML =  data.qual.ranking.record.wins+"-"+data.qual.ranking.record.losses;
        
}

