var defaults = [];
defaults["teamkey"] = "frc2830";
defaults["eventkey"] = "2019chpmi";
defaults["streamurl"] = "[auto]";
defaults["showsponsers"] = 1;
defaults["sponserpics"] = [
    "https://github.com/sykeben/BlueDashPro/raw/master/img/sponsers/7.png",
    "https://github.com/sykeben/BlueDashPro/raw/master/img/sponsers/8.png"
];

function loadDefaults(loadsetup) {
    initSettings();
    setSetting("teamkey", defaults["teamkey"]);
    setSetting("eventkey", defaults["eventkey"]);
    setSetting("showsponsers", defaults["showsponsers"]);
    setSetting("sponserpics", JSON.stringify(defaults["sponserpics"]));
    if (loadsetup) loadSetup();
    if (defaults["streamurl"] == "[auto]") {
        doTryGetStreamCustomEvent(defaults["eventkey"], false);
    } else {
        setSetting("streamurl", defaults["showsponsers"]);
    }
    if (loadsetup) {
        doSave();   
        loadSetup();
        doSave();
    }
}

function clearSetup() {
    document.getElementsByName("input-teamkey")[0].value = "";
    document.getElementsByName("input-eventkey")[0].value = "";
    document.getElementsByName("input-streamurl")[0].value = "";
    document.getElementsByName("input-sponserpics")[0].value = "";
    $("#input-showsponsers:checked").prop("checked", false);
    doSave();
    loadSetup();
}