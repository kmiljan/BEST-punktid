var displayTypes={
    nameText: {
        fill: function(context, parameters) {
            context.appendChild(render.text.create(parameters.name, "output_name", ["r_text_reducedwidth"]));
            render.text.enableFitty("output_name");
            render.elementWrapper.loadIn(context);
        }
    },
    exemptionWarning: {
        fill: function(context, parameters) {
            
            return requestData('exempt', parameters).then(
                function(response) {
                    if(response.value==true || response.value=='true') {
                        context.appendChild(render.warning.create("Sinu jooksvaid punkte ei<br>arvestata jooksvates<br>edetabelites", "output_exemptionWarning", []));
                        render.warning.enableFitty("output_exemptionWarning");
                    }
                    else {
                        render.elementWrapper.destroyE(context);
                    }
                }
            ).then(function(){
                render.elementWrapper.loadIn(context);
            });
        }
    },
    personalPointGroupDivision: {   //Pie chart of the breakdown of which groups have contributed to the total points
        fill: function(context, parameters) {
            return requestData('personalData', parameters).then(
                function(response) {
                    //Group breakdown chart
                    let chartOptions={
                        backgroundColor: 'transparent',
                        pieSliceBorderColor: '#eaeaea',
                        enableInteractivity: false,
                        pieHole: 0.7,
                        pieSliceText: 'none',
                        fontName: 'Roboto',
                        fontSize: '18',
                        colors: render.chart.colors,
                        legend: {
                            position: 'top',
                            maxLines: 15,
                            alignment: 'center',
                            textStyle: { color: '#222'
                                /*fontName: <string>,
                                fontSize: <number>,
                                bold: <boolean>,
                                italic: <boolean> }*/
                            }
                        },
                        
                        pieStartAngle: 50,
                        widthSrc: 'setByContainer',
                        height: 'setByContainer'
                    }
                    let chartData=[];
                    for(let j=0; j<groups.length; j++) {
                        chartData.push([groups[j].properties.name, response[groups[j].identifier].totalScore]);
                    }
                    let chartObject=render.chart.pieChart.create([{'type':"string", 'name':"TG"},{'type':"number", 'name':"Punktid"}], chartData, chartOptions);
                    return render.chart.pieChart.draw(undefined, chartObject, context, "sample_chart");
                    //console.log(response);
                }
            ).then(function(){
                render.elementWrapper.loadIn(context);
            });
        }
    },
    topGraph: {   //Bar graph of this x's leaders
        fill: function(context, parameters, title) {   //referencedata, group
            parameters.podiumsize=10;
            parameters.name=null;
            return requestData('placement', parameters).then(
                function(response) {
                    let scoresExistFlag=false;
                    for(let j=0; j<response.length; j++) {
                        if (response[j].score>0) {
                            scoresExistFlag=true;
                        }
                    }
                    if (scoresExistFlag) {
                        let chartOptions={
                            backgroundColor: 'transparent',
                            enableInteractivity: false,
                            fontName: 'Roboto',
                            //fontSize: '18',
                            colors: render.chart.colors,
                            legend: {
                                position: 'none',
                                maxLines: 15,
                                alignment: 'center',
                                textStyle: { color: '#222'
                                    /*fontName: <string>,
                                    fontSize: <number>,
                                    bold: <boolean>,
                                    italic: <boolean> }*/
                                }
                            },
                            hAxis: {
                                //viewWindowMode: 'pretty'
                                viewWindow: {
                                    max: parseInt(response[0].score)
                                },
                                baseline: 0, 
                                minValue: 0
                            },
                            vAxis: {
                                textPosition: 'none'
                            },
                            chartArea:{left:'2%',top:0,width:'95%',height:'90%'},
                            widthSrc: 'setByContainer',
                            height: 800
                        }
                        
                        let chartData=[];
                        for(let j=0; j<parameters.podiumsize; j++) {
                            if (response[j].score>0) {
                                chartData.push([response[j].name, parseInt(response[j].score), response[j].name+"  "+String(response[j].score)]);
                            }
                           
                        }
                        let chartObject=render.chart.barGraph.create(["Nimi","Punktid",{ 'role': "annotation" }], chartData, chartOptions);
                        return render.chart.barGraph.draw(title, chartObject, context, "monthTop");
                    }
                    else {
                        render.chart.chartTitle.create(title, context, "monthTop");
                        context.appendChild(render.text.create("See tabel on praegu tühi", "rd_"+title, []));
                        return new Promise((resolve)=>{
                            resolve();
                        });
                    }
                    
                    //console.log(response);
                }
            /*).then(
                function() {
                    render.chart.barGraph.enableFitty('monthTop');
                }*/
            ).then(function(){
                render.elementWrapper.loadIn(context);
            });
        },
    },
    topList: {
        fill: function(context, parameters, title) {   //referencedata, group
            parameters.podiumsize=1;
            parameters.name=null;
            //parameters.group='TTG';
            //parameters.referencedata="totalScore";
            let requests=[];
            let data=[];
            for(let i=0; i<parameters.groupIdentifiers.length; i++) {
                parameters.group=parameters.groupIdentifiers[i];
                requests.push(
                    requestData('podium', parameters).then(
                        function(response) {
                            if (response.length>0) {
                                if(response[0].score>0) {
                                    let values={};
                                    values.name=response[0].name;
                                    values.score=response[0].score+"℗";
                                    values.group=parameters.groups[i];
                                    data.push(values);
                                }
                                
                            }
                        }
                    )
                )
            }
            
            return Promise.all(requests).then(
                function(){
                    context.appendChild(render.list.create(title, data, "fp_topList", parameters.classes));
                    if (data.length<1) {
                        context.appendChild(render.text.create("See tabel on praegu tühi", "rd_"+title, []));
                    }
                    //render.list.enableFitty("fp_topList");
                }
            ).then(function(){
                render.elementWrapper.loadIn(context);
            });
        }
    },
    activityGraph: {   
        fill: function(context, parameters) {   //referencedata, group
            parameters.group='all';
            return requestData('activityreport', parameters).then(
                function(response) {
                    let scoresExistFlag=false;
                    for(let j=0; j<response.length; j++) {
                        if (response[j].score>0) {
                            scoresExistFlag=true;
                        }
                    }
                    if (scoresExistFlag) {
                        let chartOptions={
                            backgroundColor: 'transparent',
                            enableInteractivity: false,
                            fontName: 'Roboto',
                            //fontSize: '18',
                            colors: render.chart.colors,
                            legend: {
                                position: 'bottom',
                                maxLines: 15,
                                alignment: 'center',
                                textStyle: { color: '#222'
                                    /*fontName: <string>,
                                    fontSize: <number>,
                                    bold: <boolean>,
                                    italic: <boolean> }*/
                                }
                            },
                            series: {
                                0: {targetAxisIndex: 0},
                                1: {targetAxisIndex: 1}
                            },
                            vAxes: {
                                // Adds titles to each axis.
                                0: {title: 'Punktid kuus'},
                                1: {title: 'Tegevusi kuus'}
                            },
                            vAxis: {
                                //textPosition: 'none',
                                baseline: 0, 
                                minValue: 0
                            },
                            chartArea:{top:10},
                            //'curveType': 'function',
                            widthSrc: 'setByContainer',
                            height: 500
                        }
                        
                        let chartData=[];
                        for(let j=0; j<response.length; j++) {
                            chartData.push([new Date(response[j].y, response[j].m), parseInt(response[j].score), parseInt(response[j].activities)]);
                        }
                        let chartObject=render.chart.lineGraph.create([{'type':"date", 'name':"Aeg"},{'type':"number", 'name':"Punktid"},{'type':"number", 'name':"Tegevusi"}], chartData, chartOptions);
                        
                        return render.chart.lineGraph.draw('Aktiivsus läbi aegade', chartObject, context, "activityThroughTime");
                    }
                    //console.log(response);
                }
            /*).then(
                function() {
                    render.chart.lineGraph.enableFitty('activityThroughTime');
                    return new Promise((resolve)=>{resolve();});
                }*/
            ).then(function(){
                render.elementWrapper.loadIn(context);
            });
        }
    },
    HTMLtextArea: {
        fill: function(context, parameters) {   //name, referencedata, group
            /*parameters.referencedata='totalScore';
            parameters.group='all';
            parameters.podiumsize=0;
            return requestData('placement', parameters).then(
                function(response) {
                    if(!(response.length>0)) {
                        response.push({score: "-", place: "Andmed puuduvad"});
                    }
                    if(parameters.name=="Chuck Norris") {
                        response[0].score="∞";
                        response[0].place="legendsNeverDie";
                    }
                    context.appendChild(render.display.create("Punktid", response[0].score+"℗", "#"+response[0].place, "output_totalScore", ["output_mainTotal"]));
                    render.display.enableFitty("output_totalScore");

                }
            ).then(function(){
                render.elementWrapper.loadIn(context);
            });*/
        }
    },
    totalPointsDisplay: {
        fill: function(context, parameters) {   //name, referencedata, group
            parameters.referencedata='totalScore';
            parameters.group='all';
            parameters.podiumsize=0;
            return requestData('placement', parameters).then(
                function(response) {
                    if(!(response.length>0)) {
                        response.push({score: "-", place: "Andmed puuduvad"});
                    }
                    if(parameters.name=="Chuck Norris") {
                        response[0].score="∞";
                        response[0].place="legendsNeverDie";
                    }
                    context.appendChild(render.display.create("Punktid", response[0].score+"℗", "#"+response[0].place, "output_totalScore", ["output_mainTotal"]));
                    render.display.enableFitty("output_totalScore");

                }
            ).then(function(){
                render.elementWrapper.loadIn(context);
            });
        }
    },
    totalPointsThisMonthDisplay: {
        fill: function(context, parameters) {
            parameters.referencedata='totalScoreThisMonth';
            parameters.group='all';
            parameters.podiumsize=0;
            let placementData;
            let scoreData;
            return requestData('personalMetadata', parameters).then(
                function(response) {
                    scoreData=response;
                    return requestData('placement', parameters);
                }
            ).then( 
                function(response) {
                    if(!(response.length>0)) {
                        response.push({score: "-", place: "Andmed puuduvad"});
                    }
                    placementData=response;
                    //This month
                    let totalScoreThisMonth=0;
                    groups.forEach(function(value){
                        totalScoreThisMonth+=scoreData[value.identifier].totalScoreThisMonth;
                    })
                    if(parameters.name=="Chuck Norris") {
                        totalScoreThisMonth="∞";
                        placementData[0].place=0;
                    }
                    context.appendChild(render.display.create("See kuu", totalScoreThisMonth+"℗", "#"+placementData[0].place, "output_totalScore_month", ["output_otherTotal"]));
                    render.display.enableFitty("output_totalScore_month");
                }
            ).then(function(){
                render.elementWrapper.loadIn(context);
            });
        } 
    },
    totalPointsThisSeasonDisplay: {
        fill: function(context, parameters) {
            parameters.referencedata='totalScoreThisSeason';
            parameters.group='all';
            parameters.podiumsize=0;
            let placementData;
            let scoreData;
            return requestData('personalMetadata', parameters).then(
                function(response) {
                    scoreData=response;
                    return requestData('placement', parameters);
                }
            ).then( 
                function(response) {
                    if(!(response.length>0)) {
                        response.push({score: "-", place: "Andmed puuduvad"});
                    }
                    placementData=response;
                    //This month
                    let totalScoreThisSeason=0;
                    groups.forEach(function(value){
                        totalScoreThisSeason+=scoreData[value.identifier].totalScoreThisSeason;
                    })
                    if(parameters.name=="Chuck Norris") {
                        totalScoreThisSeason="∞";
                        placementData[0].place=0;
                    }
                    context.appendChild(render.display.create("See õppeaasta", totalScoreThisSeason+"℗","#"+placementData[0].place, "output_totalScore_season", ["output_otherTotal"]));
                    render.display.enableFitty("output_totalScore_season");
                }
            ).then(function(){
                render.elementWrapper.loadIn(context);
            });
        } 
    },
    personalGroupTable: {
        fill: function(context, parameters) {   //Parameters: name, group
            let j=0;
            let foundFlag=false;
            for(j; j<groups.length; j++) {
                if(parameters.group===groups[j].identifier) {
                    foundFlag=true;
                    break;
                }
            }
            if(foundFlag) {
                let isDrawn=false;
                return requestData('personalData', parameters).then(
                    function(response) {
                        let tableParams={
                            title: groups[j].properties.name,
                            headers: ["Tegevus", "Kordi", "Punktid"],
                            data: []
                        }
                        let sourceData=response[groups[j].identifier].breakdown;
                        if(sourceData.length>0) {
                            isDrawn=true;
                            for(let i=0; i<sourceData.length; i++) {
                                tableParams.data.push([sourceData[i].name, sourceData[i].count, sourceData[i].score]);
                            }
                            context.appendChild(render.table.create(tableParams.title, tableParams.headers, tableParams.data, "output_"+groups[j].identifier, ["output-tables"]));
                        }
                        else {
                            render.elementWrapper.destroyE(context);
                        }
                    }
                ).then(function(){
                    if (isDrawn) {
                        render.elementWrapper.loadIn(context);
                    }
                    
                });
            }
            else {
                notify("No proper group set for personalGroupTable", "function");
                return new Promise((resolve, reject)=>{
                    reject();
                }) 
            }
        }
    },
    lastActivityTable: {
        fill: function(context, parameters) {   //Parameters: name, group
            let j=0;
            let foundFlag=false;
            parameters.amount=5;
            parameters.group='all';
            /*for(j; j<groups.length; j++) {
                if(parameters.group===groups[j].identifier) {
                    foundFlag=true;
                    break;
                }
            }
            if(foundFlag) {*/
                return requestData('lastactivities', parameters).then(
                    function(response) {
                        let tableParams={
                            title: groups[j].properties.name,
                            headers: ["Tegevus", "Kordi", "Punktid"],
                            data: []
                        }
                        let sourceData=response;
                        if(sourceData.length>0) {
                            for(let i=0; i<sourceData.length; i++) {
                                tableParams.data.push([sourceData[i].name, sourceData[i].count, sourceData[i].score]);
                            }
                            context.appendChild(render.tableList.create("Viimased tegevused", tableParams.headers, tableParams.data, "output_lastActivities", ["output-tables"]));
                            render.tableList.enableFitty("output_lastActivities");
                        }
                    }
                ).then(function(){
                    render.elementWrapper.loadIn(context);
                });
            //}
            /*else {
                notify("No proper group set for personalGroupTable", "function");
                return new Promise((resolve, reject)=>{
                    reject();
                }) 
            }*/
        }
    }

}