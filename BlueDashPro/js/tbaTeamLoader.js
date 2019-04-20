
function loadTeamData(team){
    alert("team" );
    $.ajax({
        type: "GET",
        url: tbaUrl("/team/" + team + "/event/" + getSetting("eventkey") + "/status"),
        dataType: "json",
        success: function (data) {
            loadTeam(data);
        }
    });


}
function loadTeam(data){
    alert(data.qual);
    if (data != null) {
        $.ajax({
            type: "GET",
            url: tbaUrl("/team/" + data.qual.ranking.team_key.toString()),
            dataType: "json",
            success: function (teamData) {
                document.getElementById("TeamNumber").innerHTML = data.team_key.toString().replace("frc","");
                document.getElementById("teamName").innerHTML = teamData.nickname;
                document.getElementById("teamLocation").innerHTML = teamData.city+", "+teamData.state_prov;
                document.getElementById("website").innerHTML = teamData.website;
            }
        });
      //  document.getElementById("ranking").innerHTML =  data.qual.ranking.rank.toString();
       // document.getElementById("status").innerHTML =  data.overall_status_str.toString();
       // document.getElementById("record").innerHTML =  data.qual.ranking.record.wins+"-"+data.qual.ranking.record.losses;
        
    }
}
window.onload = loadTeam("frc2830");

