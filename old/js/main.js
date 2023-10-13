render.chart.enableChartRedraws();
var cachedFlags={};
var groups;

function getGroups() {
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

var onScreenElementWrappers=[];




function hideUserData() {
    history.pushState(undefined, "Punktid", "#");
    pageUpdate();
}
function showUserData() {
    history.pushState(undefined, "Punktid", "#"+render.autocompleteInput.getValue());
    pageUpdate();
}


//Fetch groups and the charts API
var initialDependeciesLoad=Promise.all([getGroups(), loadGChartsAPI()]);
initialDependeciesLoad.then(
    function() {
        render.autocompleteInput.submitAction=showUserData;
        render.header.create(document.getElementById("header"), hideUserData, undefined);
        window.onpopstate=function(){
            pageUpdate();
        }
        pageUpdate();
    }
);
function pageUpdate() {

    //Remove old content


    //Clear the list of charts that will be auto-redrawn on screen resize, since they won't be around anymore.
    render.chart.clearChartUpdateList();

    //Destroy all the element sockets on a screen
    onScreenElementWrappers.forEach(function(element) {
        try{
            render.elementWrapper.destroy(element.getAttribute("id"));
        }
        catch(err){/*debugger;*/};
    });
    
    //Set socket array to be empty
    onScreenElementWrappers=[];






    //Start with new content


    //Get the new state
    var currentHState = decodeURI(window.location.hash.substring(1));
    //console.log(currentHState);
    //debugger;
    //If the URL contains a state name
    if (currentHState.length>1) {
        
        //Check if it is a name (requires fetching, so is done asynchronously)
        isName(currentHState).then(
            function(val){
                if(val) {
                    return screens.personalStatistics.show(currentHState); //showUserData(currentHState);
                }
                /*else if(currentHState==="information") {
                    return showInformationPage().then(
                        function() {
                            render.screen.fadeIn();
                        }
                    );
                }*/
                else {
                    notify("Not a proper state: "+currentHState, "system");
                }
            }
        );
    }
    //The URL doesn't contain a state name
    else {
        return screens.generalStatistics.show().then(
            function() {
                render.screen.fadeIn();
            }
        );
    }
}
function isName(str) {
    return getNameList().then(
        function(list) {
            for(let j=0; j<list.length; j++) {
                if(str===list[j]) {
                    //debugger;
                    return true;
                    
                }
            }
            debugger;
            return false;
        }
    );
}

//Screen objects. A screen must have a show() method, that returns a promise when it is complete.
var screens={
    generalStatistics: {
        show: function(){
            //Hide the back button, since we're already at the most upper level
            render.header.hideBackbutton();

            //Register screen element sockets
            onScreenElementWrappers=[
                render.elementWrapper.create('fp_nameInput',  false, false, ["displayElementFullWidth"]),
                render.elementWrapper.create('fp_totalScoreThisMonth', false, true),
                render.elementWrapper.create('fp_topListThisMonth',  false, true),
                render.elementWrapper.create('fp_totalScore',  false, true),
                render.elementWrapper.create('fp_topListAllTime',  false, true),
                render.elementWrapper.create('pp_activityGraph', true, true, ["displayElementFullWidth"])
            ];


            //Start filling screen elements

            //Set up autocomplete
            render.autocompleteInput.fill(onScreenElementWrappers[0]);
            getNameList().then(function(response) {
                new autocomplete({
                    selector: "#input-name",
                    data: {
                        src: (query) => {

                        },
                        cache: false
                    }
                })
                autocomplete(document.getElementById("input-name"), response);
            });

            //Fetch groups for upcoming elements that require them
            let groupNames=[];
            let groupIdentifiers=[];
            groups.forEach(function(group){
                groupIdentifiers.push(group.identifier);
                groupNames.push(group.properties.name);
            });

            //
            let draws=Promise.all([
                displayTypes.topGraph.fill(onScreenElementWrappers[1], {referencedata: "totalScoreThisMonth", group: 'all', exemptBasedOnStatus:true}, "Selle kuu edetabel"),
                displayTypes.topList.fill(onScreenElementWrappers[2], {referencedata: "totalScoreThisMonth", groups: groupNames, groupIdentifiers: groupIdentifiers, classes: ["list_thisMonth"]}, 'Töögruppide kuu tipud'),
                displayTypes.topGraph.fill(onScreenElementWrappers[3], {referencedata: "totalScore", group: 'all'}, 'Läbi aegade tipud'),
                displayTypes.topList.fill(onScreenElementWrappers[4], {referencedata: "totalScore", groups: groupNames, groupIdentifiers: groupIdentifiers, classes: ["list_allTime"]}, 'Töögruppide läbi aegade tipud')
            ]);
            return draws.then(
                function(){
                    let tableSize=onScreenElementWrappers.length;
                    render.elementWrapper.whenScrolledToOnce(onScreenElementWrappers[tableSize-1].getAttribute('id')).then(
                        function() {
                            render.elementWrapper.fadeIn('pp_activityGraph');
                            return displayTypes.activityGraph.fill(onScreenElementWrappers[onScreenElementWrappers.length-1], {name: null});
                        }
                    ).then(
                        function() {
                            render.elementWrapper.loadIn(document.getElementById('pp_activityGraph'));
                        }
                    )
                }
            )
        }
    },
    personalStatistics: {
        show: function(name){
            //Show the back button, since we're now on a sub-page
            render.header.showBackbutton();


            let fadeAndData=Promise.all([/*render.screen.fadeOut(),*/ initialDependeciesLoad]);

            //State management
            var selected_name;
            if(typeof name === 'string' || name instanceof String) {
                selected_name=name;
            }
            else {
                selected_name=document.getElementById("input-name").value;
                history.pushState({'name': selected_name}, selected_name+" punktid", '#'+selected_name);
            }
            


            //Draw screen contents
            return fadeAndData.then(function(){
                
                onScreenElementWrappers.forEach(function(element) {
                    if(document.getElementById(element.getAttribute("id"))!=null) {
                        render.elementWrapper.destroy(element.getAttribute("id"));
                    }
                });
                let tableSize;

                //Register screen element sockets for general statistics
                onScreenElementWrappers=[
                    render.elementWrapper.create('pp_name', false, true, ["displayElementFullWidth"]),
                    render.elementWrapper.create('pp_totalScore', false, true, ["displayElementVerticalCentered"]),
                    render.elementWrapper.create('pp_exemptionWarning', false, true, ["displayElementVerticalCentered"]),
                    render.elementWrapper.create('pp_lastActivities', false, true),
                    render.elementWrapper.create('pp_groupBreakdown', false, true),
                    render.elementWrapper.create('pp_totalScoreThisMonth', false, true, ["displayElementVerticalCentered"]),
                    render.elementWrapper.create('pp_totalScoreThisSeason', false, true, ["displayElementVerticalCentered"])
                ];
                //Fill the just created sockets
                let draws=[
                    displayTypes.nameText.fill(onScreenElementWrappers[0], {name: selected_name}),
                    displayTypes.totalPointsDisplay.fill(onScreenElementWrappers[1], {name: selected_name}),
                    displayTypes.exemptionWarning.fill(onScreenElementWrappers[2], {name: selected_name}),
                    displayTypes.lastActivityTable.fill(onScreenElementWrappers[3], {name: selected_name}),
                    displayTypes.personalPointGroupDivision.fill(onScreenElementWrappers[4], {name: selected_name}),
                    displayTypes.totalPointsThisMonthDisplay.fill(onScreenElementWrappers[5], {name: selected_name}),
                    displayTypes.totalPointsThisSeasonDisplay.fill(onScreenElementWrappers[6], {name: selected_name}),
                ];

                //Create and fill group statistics for the person
                tableSize=onScreenElementWrappers.length;
                groups.forEach(function(group) {
                    onScreenElementWrappers.push(render.elementWrapper.create('pp_groupOverview_'+group.identifier));
                    draws.push(displayTypes.personalGroupTable.fill(onScreenElementWrappers[tableSize], {name: selected_name, group: group.identifier}));
                    tableSize=onScreenElementWrappers.length;
                });

                //Create the socket for an activity graph
                onScreenElementWrappers.push(render.elementWrapper.create('pp_activityGraph', true, true, ["displayElementFullWidth"]));
                
                return Promise.all(draws);
            }).then(
                //When drawn, set up the activity graph's trigger
                function(){
                    let tableSize=onScreenElementWrappers.length;
                    render.elementWrapper.whenScrolledToOnce(onScreenElementWrappers[tableSize-1].getAttribute('id')).then(
                        function() {
                            render.elementWrapper.fadeIn('pp_activityGraph');
                            return displayTypes.activityGraph.fill(onScreenElementWrappers[onScreenElementWrappers.length-1], {name: selected_name});
                        }
                    ).then(
                        function() {
                            render.elementWrapper.loadIn(document.getElementById('pp_activityGraph'));
                        }
                    )
                }
            );
        }
    }
}
/*function showGeneralStatistics() {
    render.header.hideBackbutton();
    onScreenElementWrappers=[
        render.elementWrapper.create('fp_nameInput',  false, false, ["displayElementFullWidth"]),
        render.elementWrapper.create('fp_totalScoreThisMonth', false, true),
        render.elementWrapper.create('fp_topListThisMonth',  false, true),
        render.elementWrapper.create('fp_totalScore',  false, true),
        render.elementWrapper.create('fp_topListAllTime',  false, true),
        render.elementWrapper.create('pp_activityGraph', true, true, ["displayElementFullWidth"])
        
    ];
    render.autocompleteInput.fill(onScreenElementWrappers[0]);
    getNameList().then(function(response) {
        autocomplete(document.getElementById("input-name"), response);
    });
    let groupNames=[];
    let groupIdentifiers=[];
    groups.forEach(function(group){
        groupIdentifiers.push(group.identifier);
        groupNames.push(group.properties.name);
    });
    let draws=Promise.all([
        displayTypes.topGraph.fill(onScreenElementWrappers[1], {referencedata: "totalScoreThisMonth", group: 'all', exemptBasedOnStatus:true}, "Selle kuu edetabel"),
        displayTypes.topList.fill(onScreenElementWrappers[2], {referencedata: "totalScoreThisMonth", groups: groupNames, groupIdentifiers: groupIdentifiers, classes: ["list_thisMonth"]}, 'Punktitabelite kuu tipud'),
        displayTypes.topGraph.fill(onScreenElementWrappers[3], {referencedata: "totalScore", group: 'all'}, 'Läbi aegade tipud'),
        displayTypes.topList.fill(onScreenElementWrappers[4], {referencedata: "totalScore", groups: groupNames, groupIdentifiers: groupIdentifiers, classes: ["list_allTime"]}, 'Punktitabelite läbi aegade tipud')
    ]);
    
    return draws.then(
        function(){
            let tableSize=onScreenElementWrappers.length;
            render.elementWrapper.whenScrolledToOnce(onScreenElementWrappers[tableSize-1].getAttribute('id')).then(
                function() {
                    render.elementWrapper.fadeIn('pp_activityGraph');
                    return displayTypes.activityGraph.fill(onScreenElementWrappers[onScreenElementWrappers.length-1], {name: null});
                }
            ).then(
                function() {
                    render.elementWrapper.loadIn(document.getElementById('pp_activityGraph'));
                }
            )
        }
    )
}


function showInformationPage() {
    //render.header.hideBackbutton();
    onScreenElementWrappers=[
        render.elementWrapper.create('HTMLtextArea',  false, false, ["HTMLtextArea"]),
        
    ];
    let draws=Promise.all([
        displayTypes.HTMLtextArea.fill(onScreenElementWrappers[0]),
    ]);
    debugger;
    return draws;
}*/