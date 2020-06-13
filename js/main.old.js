var cachedFlags={};
function requestData(dataType, parameters) {
    //If data already exists, use that instead
    switch(dataType) {
        case 'personalData':
            URL_params='get_data.php?type=personaldata&person_name='+encodeURI(parameters.name);
            break;
        case 'personalMetadata':
            URL_params='get_data.php?type=personalmetadata&person_name='+encodeURI(parameters.name);
            break;
        case 'groupMetaData':
            URL_params='get_data.php?type=groupmetadata';
            break;
        case 'placement':
            URL_params='get_data.php?type=podium&person_name='+encodeURI(parameters.name)+'&group='+encodeURI(parameters.group)+'&referencedata='+encodeURI(parameters.referencedata)+'&podiumsize='+encodeURI(parameters.podiumsize);
            break;
        case 'activityreport':
            URL_params='get_data.php?type=activityreport&person_name='+encodeURI(parameters.name)+'&group='+encodeURI(parameters.group);
            break;
        default:
            return new Promise((resolve, reject) => {
                notify('Incorrectly specified datatype: '+dataType, 'request');
                reject("INCORRECT_DATATYPE");
            });
            break;
    }

    return new Promise((resolve, reject) => {
      $.getJSON(URL_params, function(response){
          //console.log(response);
      })
      .done( function(response){
        notify("SUCCESS: JSON request for "+URL_params, "request");
        resolve(response);
      })
      .fail( function(response){
        notify("FAILURE: JSON request for "+URL_params, "request");
        reject(response);
      });
    }); 
}
/*function getAllGroupData(name) {
    let hostname='localhost';
    let URL='get_data.php?type=personaldata&person_name='+encodeURI(name);
    //console.log(URL);
    $.getJSON(URL, function(response) {
        console.log(response);
        data.set("personalData", response);
    });
}
function getGroupData(name, groupName) {
    let hostname='localhost';
    let URL='get_data.php?type=personaldata&person_name='+encodeURI(name)+'&group='+encodeURI(groupName);
    $.getJSON(URL, function(response) {
        console.log(response);
        let obj={};
        obj[groupName]=response;
        data.set("personalData", obj);
    });
}
function getPersonalMetadata(name) {
    let hostname='localhost';
    let URL='get_data.php?type=personalmetadata&person_name='+encodeURI(name);
    $.getJSON(URL, function(response) {
        console.log(response);     
        data.set("personalMetadata", response);
    });
}
function getGroupMetadata() {
    let hostname='localhost';
    let URL='get_data.php?type=groupmetadata';
    $.getJSON(URL, function(response) {
        console.log(response);
        data.set("groupMetadata", response);
    });
}*/
function showUserData() {
    data.name=document.getElementById("input-name").value;
    /*getAllGroupData(data.name);
    getPersonalMetadata(data.name);
    getGroupMetadata();
    getPersonalPlacement(data.name, 'totalScore', 'all');
    getPersonalPlacement(data.name, 'totalScoreThisMonth', 'all');
    getPersonalPlacement(data.name, 'totalScoreThisSeason', 'all');
    setTimeout(function() {data.render();}, 300);*/
}
function getPersonalPlacement(name, referencedata, group) {
    let hostname='localhost';
    let URL='get_data.php?type=podium&person_name='+encodeURI(name)+'&group='+encodeURI(group)+'&referencedata='+encodeURI(referencedata)+'&podiumsize=0';
    $.getJSON(URL, function(response) {
        console.log(response);     
        data.setKey("personalPlacement", referencedata, response);
    });
}

function renderData() {
    //Render main statistics

    //Name
    document.getElementById("screen").appendChild(render.text.create(data.name, "output_name", ["r_text_reducedwidth"]));
    render.text.enableFitty("output_name");

    //Total score
    

    

    //Other displays

    


    //This season
    
    

    //Render Group tables
    for(let j=0; j<groups.length; j++) {
        let tableParams={
            title: groups[j].properties.name,
            headers: ["Tegevus", "Kordi", "Punktid"],
            data: []
        }
        let sourceData=data.personalData.contents[groups[j].identifier].breakdown;
        if(sourceData.length>0) {
            for(let i=0; i<sourceData.length; i++) {
                tableParams.data.push([sourceData[i].name, sourceData[i].count, sourceData[i].score]);
            }
            document.getElementById("screen").appendChild(render.table.create(tableParams.title, tableParams.headers, tableParams.data, "output_"+groups[j].identifier, ["output-tables"]));
        }
    }
    
    //Render 
}
//data.render=renderData;
var groups;

function getGroups() {
    /*let hostname='localhost';
    let URL='get_data.php?type=groups';
    $.getJSON(URL, function(response) {
        function Group(name, value) {
            this.identifier=name;
            this.properties=value;
        }
        //console.log(response);
        let entries=Object.entries(response);
        let output=[];
        for(let i=0; i<entries.length; i++) {
            output.push(new Group(entries[i][0], entries[i][1]));
        }
        
        console.log(output);
        groups=output;
    });*/

    return new Promise((resolve, reject) => {
        let URL='get_data.php?type=groups';
        $.getJSON(URL, function(response){
            //console.log(response);
        })
        .done( function(response){
            notify("SUCCESS: JSON request for group data", "request");
            function Group(name, value) {
                this.identifier=name;
                this.properties=value;
            }
            //console.log(response);
            let entries=Object.entries(response);
            let output=[];
            for(let i=0; i<entries.length; i++) {
                output.push(new Group(entries[i][0], entries[i][1]));
            }
            
            console.log(output);
            groups=output;
            resolve(response)
        })
        .fail( function(response){
          notify("FAILURE: JSON request for group data", "request");
          reject(response);
        });
      });
}
//var groups=['PRTG', 'TTG', 'RV', 'FRTG', 'MTG', 'HR_local', 'HR_teamwork', 'HR_projects'];

Promise.all([getGroups(), 
    loadGChartsAPI()])
    .then(
    function() {
        displayTypes.personalPointGroupDivision.fill(document.getElementById("screen"), {name: 'Kalev Miljan'});
        displayTypes.totalPointsDisplay.fill(document.getElementById("screen"), {name: 'Kalev Miljan'});
        displayTypes.totalPointsThisMonthDisplay.fill(document.getElementById("screen"), {name: 'Kalev Miljan'});
        displayTypes.totalPointsThisSeasonDisplay.fill(document.getElementById("screen"), {name: 'Kalev Miljan'});
        displayTypes.personalGroupTable.fill(document.getElementById("screen"), {name: 'Kalev Miljan', group: 'TTG'});
        displayTypes.topGraph.fill(document.getElementById("screen"), {referencedata: "totalScoreThisMonth", group: 'all'}, "Selle kuu edetabel");
        displayTypes.topGraph.fill(document.getElementById("screen"), {referencedata: "totalScore", group: 'all'}, 'Läbi aegade tipud');
        displayTypes.activityGraph.fill(document.getElementById("screen"), {name: "Mari Leesmaa"});
    }
);