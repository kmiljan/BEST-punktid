import Renderables from "./render";
import DataAPI from './dataAPI.js';
import {round, truncate} from './round.js';

interface Group {
    identifier:string,
    properties:{
        name:string,
        colors:Array<string>
    }
}
/*const groups=[
    {identifier:'TTG', properties: {name: 'TTG', colors: ["blue", "lightblue"]}},
    {identifier:'MTG', properties: {name: 'MTG', colors: ["blue", "lightblue"]}},
    {identifier:'PRTG', properties: {name: 'DMTG', colors: ["#e0bc00", "#fdde10"]}},
    {identifier:'FRTG', properties: {name: 'FRTG', colors: ["75ae40", "#c3d8a1"]}},
    {identifier:'RV', properties: {name: 'RV', colors: ["blue", "lightblue"]}},
    {identifier:'HR_local', properties: {name: 'LBG Tallinn', colors: ["blue", "lightblue"]}},
    {identifier:'HR_teamwork', properties: {name: 'Tiimitöö', colors: ["blue", "lightblue"]}},
    {identifier:'HR_projects', properties: {name: 'Projektid', colors: ["blue", "lightblue"]}},
];*/

export default class Displays {
    groups:Array<Group>;
    id:number;
    styleContainer;
    constructor(){
        //this.personalPointsTotal=personalPointsTotal;
        this.personalPointsTotal= class extends personalPoints{
            name:string;
            constructor(rendererInstance:Renderables, fetcherInstance:DataAPI, displayInstance:Displays, name:string, parentNode:HTMLElement){
                super(rendererInstance, fetcherInstance, displayInstance,  'd_p_totalpoints', parentNode);
                this.name=name;
            };
            data():Promise<void>{
                return this.fetcherInstance.placement('all', this.name, false, 'totalScore').then(data=>{
                    this.rawContent=data[0];
                });
            };
            run(){
                return this.data().then(()=>{
                    this.content={};
                    this.content.data={};
                    this.content.data.top='Punktid';
                    this.content.data.center=this.rawContent.score;
                    if(this.rawContent.score>0) {
                        this.content.data.bottom=this.rawContent.place;
                        this.content.data.bottomNotice=". koht";
                    }
                    else {
                        this.content.data.bottom="";
                        this.content.data.bottomNotice="";
                    }
                    this.create(["gradient1"]);
                });
            }
        };
        this.personalPointsSeason= class extends personalPoints{
            name:string;
            constructor(rendererInstance:Renderables, fetcherInstance:DataAPI, displayInstance:Displays, name:string, parentNode:HTMLElement){
                super(rendererInstance, fetcherInstance, displayInstance,  'd_p_totalpointsthisseason', parentNode);
                this.name=name;
            };
            data():Promise<void>{
                return this.fetcherInstance.placement('all', this.name, false, 'totalScoreThisSeason').then(data=>{
                    this.rawContent=data[0];
                });
            }
            run(){
                return this.data().then(()=>{
                    this.content={};
                    this.content.data={};
                    this.content.data.top='Sellel õppeaastal';
                    this.content.data.center=this.rawContent.score;

                    if(this.rawContent.score>0) {
                        this.content.data.bottom=this.rawContent.place;
                        this.content.data.bottomNotice=". koht";
                    }
                    else {
                        this.content.data.bottom="";
                        this.content.data.bottomNotice="";
                    }
                    
                    this.create(["gradient2"]);
                });
            }
        };
        this.NameInput= class {
    
            rendererInstance:Renderables;
            fetcherInstance:DataAPI;
            displayInstance:Displays;
    
            content:{
                list: Array<string>
            }
            id:string;
            classes:Array<string>;
            parentNode:HTMLElement;

            fetcher;
            renderables; 
            constructor(rendererInstance:Renderables, fetcherInstance:DataAPI, displayInstance:Displays, parentNode:HTMLElement){
                this.rendererInstance=rendererInstance;
                this.fetcherInstance=fetcherInstance;
                this.displayInstance=displayInstance;
                this.parentNode=parentNode;
                this.content={list:undefined};
                this.id="nameInput";
            };
            data():Promise<void>{
                return this.fetcherInstance.names().then(data=>{
                    this.content.list=data;
                });
            };
            navigateToPersonalPage(){
                const name:string=document.getElementById("nameInput_content_input").value;
                window.location.href = '/bestikas/'+encodeURIComponent(name);
            }
            create(){
                this.renderables={
                    frame: new this.rendererInstance.frames.InputFrame(this.rendererInstance, this.id+"_f",  this.parentNode, [])
                };
                this.renderables.frame.create();
    
    
                /*//Create title
                this.renderables.header=new this.rendererInstance.elements.ElementTitle(
                    this.rendererInstance, 
                    this.id+"_title",  
                    this.renderables.frame.frameNode, 
                    []
                );
                this.renderables.header.data(this.groupObject.properties.name, "Töögrupi ülevaade");
                this.renderables.header.create();
    
                //Create total
                this.renderables.total=new this.rendererInstance.elements.Value(
                    this.rendererInstance, 
                    this.id+"_total",  
                    this.renderables.frame.frameNode, 
                    ["colored-text_"+this.groupObject.identifier]
                );
                this.renderables.total.data(this.content.totalScore);
                this.renderables.total.create();
    
                //Create stripe
                this.renderables.stripe=new this.rendererInstance.elements.Stripe(
                    this.rendererInstance, 
                    this.id+"_stripe",  
                    this.renderables.frame.frameNode, 
                    ["gradient_"+this.groupObject.identifier]
                );
                this.renderables.stripe.create();*/
    
                //Create element
                this.renderables.element=new this.rendererInstance.elements.AutocompleteInput(
                    this.rendererInstance, 
                    this.id+"_content",  
                    this.renderables.frame.frameNode, 
                    []
                );
                this.renderables.element.data(this.content.list, this.navigateToPersonalPage);
                this.renderables.element.create();
    
    
            }
            run(){
                return this.data().then(()=>{
                    if ((!this.renderIfDataIsEmpty && !this.dataIsEmpty)||this.renderIfDataIsEmpty) {
                        this.create();
                    }
                    else {
                        //debugger;
                    }
                });
            }
        };
        this.personalPointsMonth= class extends personalPoints{
            name:string;
            constructor(rendererInstance:Renderables, fetcherInstance:DataAPI, displayInstance:Displays, name:string, parentNode:HTMLElement){
                super(rendererInstance, fetcherInstance, displayInstance, 'd_p_totalpointsthisseason', parentNode);
                this.name=name;
            };
            data():Promise<void>{
                return this.fetcherInstance.placement('all', this.name, false, 'totalScoreThisMonth').then(data=>{
                    this.rawContent=data[0];
                });
            }
            run(){
                return this.data().then(()=>{
                    this.content={};
                    this.content.data={};
                    this.content.data.top='Sellel kuul';
                    this.content.data.center=this.rawContent.score;
                    if(this.rawContent.score>0) {
                        this.content.data.bottom=this.rawContent.place;
                        this.content.data.bottomNotice=". koht";
                    }
                    else {
                        this.content.data.bottom="";
                        this.content.data.bottomNotice="";
                    }
                    this.create(["gradient3"]);
                });
            }
        }
        this.personalGroupBreakdown= class {
            name:string;
            group:string;
            groupObject:object;
    
            rendererInstance:Renderables;
            fetcherInstance:DataAPI;
            displayInstance:Displays;
    
            rawContent:object;
            content:object;
            id:string;
            classes:Array<string>;
            parentNode:HTMLElement;
            renderIfDataIsEmpty:boolean;
            dataIsEmpty:boolean;
            fetcher;
            renderables; 
            constructor(rendererInstance:Renderables, fetcherInstance:DataAPI, displayInstance:Displays, name:string, group:string, renderIfDataIsEmpty:boolean, parentNode:HTMLElement){
                this.rendererInstance=rendererInstance;
                this.fetcherInstance=fetcherInstance;
                this.displayInstance=displayInstance;
                this.name=name;
                this.group=group;
                this.groupObject=displayInstance.getGroupObject(group);
                this.parentNode=parentNode;
                this.id="d_p_groupbreakdown_"+this.group;
                this.content={};
                this.renderIfDataIsEmpty=renderIfDataIsEmpty;
                this.dataIsEmpty=false;
            };
            data():Promise<void>{
                return this.fetcherInstance.personalData(this.name).then(data=>{
                    this.rawContent=data;
                    
                    this.content.list=[];
                    if (this.rawContent[this.group].breakdown.length==0){
                        this.dataIsEmpty=true;
                    }
                    this.content.totalScore=this.rawContent[this.group].totalScore;
                    this.rawContent[this.group].breakdown.forEach(activity=>{
                        this.content.list.push({
                            activity: activity.name,
                            repeats: activity.count,
                            value: activity.score
                        });
                    });
                    this.content.total=this.rawContent[this.group].totalScore;
                });
            };
            create(){
                this.renderables={
                    frame: new this.rendererInstance.frames.DashboardElementFrame(this.rendererInstance, this.id+"_f",  this.parentNode, [])
                };
                this.renderables.frame.create();
    
    
                //Create title
                this.renderables.header=new this.rendererInstance.elements.ElementTitle(
                    this.rendererInstance, 
                    this.id+"_title",  
                    this.renderables.frame.frameNode, 
                    []
                );
                this.renderables.header.data(this.groupObject.properties.name, "Töögrupi ülevaade");
                this.renderables.header.create();
    
                //Create total
                this.renderables.total=new this.rendererInstance.elements.Value(
                    this.rendererInstance, 
                    this.id+"_total",  
                    this.renderables.frame.frameNode, 
                    ["colored-text_"+this.groupObject.identifier]
                );
                this.renderables.total.data(this.content.totalScore);
                this.renderables.total.create();
    
                //Create stripe
                this.renderables.stripe=new this.rendererInstance.elements.Stripe(
                    this.rendererInstance, 
                    this.id+"_stripe",  
                    this.renderables.frame.frameNode, 
                    ["gradient_"+this.groupObject.identifier]
                );
                this.renderables.stripe.create();
    
                //Create element
                this.renderables.element=new this.rendererInstance.elements.ActivityList(
                    this.rendererInstance, 
                    this.id+"_content",  
                    this.renderables.frame.frameNode, 
                    []
                );
                this.renderables.element.data(this.content.list);
                this.renderables.element.create();
    
    
            }
            run(){
                return this.data().then(()=>{
                    if ((!this.renderIfDataIsEmpty && !this.dataIsEmpty)||this.renderIfDataIsEmpty) {
                        this.create();
                    }
                    else {
                        //debugger;
                    }
                });
            }
        };
        
        this.GroupPeriodLeaders= class {
            rendererInstance:Renderables;
            fetcherInstance:DataAPI;
            displayInstance:Displays;
    
            rawContent:object;
            content:object;
            id:string;
            classes:Array<string>;
            parentNode:HTMLElement;
            renderIfDataIsEmpty:boolean;
            dataIsEmpty:boolean;
            fetcher;
            renderables; 

            title:string;
            subtitle:string;
            exemptBasedOnStatus: boolean;
            referenceData: string;
            frameClasses: Array<string>;
            constructor(rendererInstance:Renderables, fetcherInstance:DataAPI, displayInstance:Displays, renderIfDataIsEmpty:boolean, parentNode:HTMLElement){
                this.rendererInstance=rendererInstance;
                this.fetcherInstance=fetcherInstance;
                this.displayInstance=displayInstance;
                this.parentNode=parentNode;
                
                this.content={};
                this.renderIfDataIsEmpty=renderIfDataIsEmpty;
                this.dataIsEmpty=true;

                this.id="d_p_groupperiodleaders_month";
                this.referenceData="totalScoreThisMonth";
                this.title="Käesolev kuu";
                this.subtitle="Töögruppide tipud";
                this.exemptBasedOnStatus=true;
                this.frameClasses=[];
            };
            data():Promise<void>{
                this.content.list=[];
                let requests=[];
                let metadata=[];
                this.displayInstance.groups.forEach((group)=>{
                    metadata.push({name: group.properties.name, identifier: group.identifier});
                    requests.push(this.fetcherInstance.podium(group.identifier, this.referenceData, 1, this.exemptBasedOnStatus));
                });
                return Promise.all(requests).then(
                    (data)=>{

                        data.forEach(
                            (groupLeaderList, index)=>{
                                if(groupLeaderList[0].score>0) {
                                    this.dataIsEmpty=false;
                                    this.content.list.push(
                                        {
                                            group: metadata[index].name,
                                            name: groupLeaderList[0].name,
                                            value: groupLeaderList[0].score,
                                            classes: [
                                                "color-vars_"+metadata[index].identifier
                                            ]
                                        }
                                    )
                                }
                            }
                        )
                    }
                )
            };
            create(){
                this.renderables={
                    frame: new this.rendererInstance.frames.DashboardElementFrame(this.rendererInstance, this.id+"_f",  this.parentNode, this.frameClasses)
                };
                this.renderables.frame.create();
    
    
                //Create title
                this.renderables.header=new this.rendererInstance.elements.ElementTitle(
                    this.rendererInstance, 
                    this.id+"_title",  
                    this.renderables.frame.frameNode, 
                    []
                );
                this.renderables.header.data(this.title, this.subtitle);
                this.renderables.header.create();
    
                /*//Create total
                this.renderables.total=new this.rendererInstance.elements.Value(
                    this.rendererInstance, 
                    this.id+"_total",  
                    this.renderables.frame.frameNode, 
                    ["colored-text_"+this.groupObject.identifier]
                );
                this.renderables.total.data(this.content.totalScore);
                this.renderables.total.create();*/
    
                /*//Create stripe
                this.renderables.stripe=new this.rendererInstance.elements.Stripe(
                    this.rendererInstance, 
                    this.id+"_stripe",  
                    this.renderables.frame.frameNode, 
                    ["gradient_"+this.groupObject.identifier]
                );
                this.renderables.stripe.create();*/
    
                //Create element
                this.renderables.element=new this.rendererInstance.elements.GroupLeaderList(
                    this.rendererInstance, 
                    this.id+"_content",  
                    this.renderables.frame.frameNode, 
                    []
                );
                this.renderables.element.data(this.content.list);
                this.renderables.element.create();
    
    
            }
            run(){
                return this.data().then(()=>{
                    if ((!this.renderIfDataIsEmpty && !this.dataIsEmpty)||this.renderIfDataIsEmpty) {
                        this.create();
                    }
                    else {
                        //debugger;
                    }
                });
            }
        };
        this.GroupAllTimeLeaders= class extends this.GroupPeriodLeaders {
            constructor(rendererInstance:Renderables, fetcherInstance:DataAPI, displayInstance:Displays, renderIfDataIsEmpty:boolean, parentNode:HTMLElement){
                super(rendererInstance, fetcherInstance, displayInstance, renderIfDataIsEmpty, parentNode);

                this.id="d_p_groupperiodleaders_allTime";
                this.referenceData="totalScore";
                this.title="Läbi aegade";
                this.subtitle="Töögruppide tipud";
                this.exemptBasedOnStatus=false;
                this.frameClasses=["frame_leaders"];
            }
        };
        this.PeriodLeaders= class {
            rendererInstance:Renderables;
            fetcherInstance:DataAPI;
            displayInstance:Displays;
    
            rawContent:object;
            content:object;
            id:string;
            classes:Array<string>;
            parentNode:HTMLElement;
            renderIfDataIsEmpty:boolean;
            dataIsEmpty:boolean;
            fetcher;
            renderables; 

            title:string;
            subtitle:string;
            exemptBasedOnStatus: boolean;
            referenceData: string;
            frameClasses: Array<string>;
            constructor(rendererInstance:Renderables, fetcherInstance:DataAPI, displayInstance:Displays, renderIfDataIsEmpty:boolean, parentNode:HTMLElement){
                this.rendererInstance=rendererInstance;
                this.fetcherInstance=fetcherInstance;
                this.displayInstance=displayInstance;
                this.parentNode=parentNode;
                
                this.content={};
                this.renderIfDataIsEmpty=renderIfDataIsEmpty;
                this.dataIsEmpty=false;

                this.id="d_p_periodleaders_month";
                this.referenceData="totalScoreThisMonth";
                this.title="Käesolev kuu";
                this.subtitle="Koondpunktid";
                this.exemptBasedOnStatus=true;
                this.frameClasses=[];
            };
            data():Promise<void>{
                this.content.list=[];
                let podium=[];
                let personalRequests:Array<Promise<object>>=[];
                return this.fetcherInstance.podium('all', this.referenceData, 7, this.exemptBasedOnStatus).then(
                    (data)=>{
                        for(let i=0; i<data.length; i++) {
                            podium.push(data[i].name);
                            personalRequests.push(this.fetcherInstance.personalMetadata(data[i].name));
                        }
                        return Promise.all(personalRequests);
                    }
                ).then(
                    (personalGroupBreakdownList)=>{
                        let series=[];
                        let colors=[];
                        for (let j=0; j<this.displayInstance.groups.length; j++) {
                            series[j]={
                                name: this.displayInstance.groups[j].properties.name, 
                                data: []
                            };
                            colors.push(this.displayInstance.groups[j].properties.colors[1]);
                        }
                        for(let i=0; i<personalGroupBreakdownList.length; i++) {
                            if(this.displayInstance.groups.reduce((total, group)=>{
                                return total+personalGroupBreakdownList[i][group.identifier][this.referenceData];
                            },
                            0)
                            <=0) {
                                if(i==0) {
                                    this.dataIsEmpty=true;
                                }
                                break;
                            }
                            for (let j=0; j<this.displayInstance.groups.length; j++) {
                                series[j].data.push(personalGroupBreakdownList[i][this.displayInstance.groups[j].identifier][this.referenceData]);
                            }

                        }
                        this.content.series=series;
                        this.content.categories=podium;
                        this.content.colors=colors;
                        //If the first place has no points, it must be because no-one has points this <period>
                        /*if(series[0].data.reduce((total, groupPoints)=>{return total+=groupPoints}, 0)<=0) {
                            this.dataIsEmpty=true;
                        }*/
                    }
                )
            };
            create(){
                this.renderables={
                    frame: new this.rendererInstance.frames.DashboardElementFrame(this.rendererInstance, this.id+"_f",  this.parentNode, this.frameClasses)
                };
                this.renderables.frame.create();
    
    
                //Create title
                this.renderables.header=new this.rendererInstance.elements.ElementTitle(
                    this.rendererInstance, 
                    this.id+"_title",  
                    this.renderables.frame.frameNode, 
                    []
                );
                this.renderables.header.data(this.title, this.subtitle);
                this.renderables.header.create();
    
                /*//Create total
                this.renderables.total=new this.rendererInstance.elements.Value(
                    this.rendererInstance, 
                    this.id+"_total",  
                    this.renderables.frame.frameNode, 
                    ["colored-text_"+this.groupObject.identifier]
                );
                this.renderables.total.data(this.content.totalScore);
                this.renderables.total.create();*/
    
                /*//Create stripe
                this.renderables.stripe=new this.rendererInstance.elements.Stripe(
                    this.rendererInstance, 
                    this.id+"_stripe",  
                    this.renderables.frame.frameNode, 
                    ["gradient_"+this.groupObject.identifier]
                );
                this.renderables.stripe.create();*/
    
                //Create element
                this.renderables.element=new this.rendererInstance.elements.StackedBarChart(
                    this.rendererInstance, 
                    this.id+"_content",  
                    this.renderables.frame.frameNode, 
                    []
                );
                this.renderables.element.data(this.content);
                this.renderables.element.create();
    
    
            }
            run(){
                return this.data().then(()=>{
                    if ((!this.renderIfDataIsEmpty && !this.dataIsEmpty)||this.renderIfDataIsEmpty) {
                        this.create();
                    }
                    else {
                        //debugger;
                    }
                });
            }
        };
        this.AllTimeLeaders= class extends this.PeriodLeaders{
            constructor(rendererInstance:Renderables, fetcherInstance:DataAPI, displayInstance:Displays, renderIfDataIsEmpty:boolean, parentNode:HTMLElement){
                super(rendererInstance, fetcherInstance, displayInstance, renderIfDataIsEmpty, parentNode);

                this.id="d_p_periodleaders_alltime";
                this.referenceData="totalScore";
                this.title="Läbi aegade";
                this.subtitle="Koondpunktid";
                this.exemptBasedOnStatus=false;
                this.frameClasses=["frame_leaders"];
            };
        };
        this.personalLastActivities= class {
            name:string;
    
            rendererInstance:Renderables;
            fetcherInstance:DataAPI;
            displayInstance:Displays;
    
            rawContent:object;
            content:object;
            id:string;
            classes:Array<string>;
            parentNode:HTMLElement;
            renderIfDataIsEmpty:boolean;
            dataIsEmpty:boolean;
            fetcher;
            renderables; 
            constructor(rendererInstance:Renderables, fetcherInstance:DataAPI, displayInstance:Displays, name:string, renderIfDataIsEmpty:boolean, parentNode:HTMLElement){
                this.rendererInstance=rendererInstance;
                this.fetcherInstance=fetcherInstance;
                this.displayInstance=displayInstance;
                this.name=name;
                this.parentNode=parentNode;
                this.id="d_p_lastActivities";
                this.content={};
                this.renderIfDataIsEmpty=renderIfDataIsEmpty;
                this.dataIsEmpty=false;
            };
            data():Promise<void>{
                return this.fetcherInstance.lastActivities(this.name, 'all', 5).then(data=>{
                    this.rawContent=data;
                    
                    this.content.list=[];
                    if (this.rawContent.length==0){
                        this.dataIsEmpty=true;
                    }
                    this.rawContent.forEach(activity=>{
                        this.content.list.push({
                            activity: activity.name,
                            repeats: round(activity.count),
                            value: activity.score
                        });
                    });
                });
            };
            create(){
                this.renderables={
                    frame: new this.rendererInstance.frames.DashboardElementFrame(this.rendererInstance, this.id+"_f",  this.parentNode, [])
                };
                this.renderables.frame.create();
    
    
                //Create title
                this.renderables.header=new this.rendererInstance.elements.ElementTitle(
                    this.rendererInstance, 
                    this.id+"_title",  
                    this.renderables.frame.frameNode, 
                    []
                );
                this.renderables.header.data("Viimased tegevused", "mille eest oled saanud punkte");
                this.renderables.header.create();
    
                //Create stripe
                this.renderables.stripe=new this.rendererInstance.elements.Stripe(
                    this.rendererInstance, 
                    this.id+"_stripe",  
                    this.renderables.frame.frameNode, 
                    ["gradient_default"]
                );
                this.renderables.stripe.create();
    
                //Create element
                this.renderables.element=new this.rendererInstance.elements.ActivityList(
                    this.rendererInstance, 
                    this.id+"_content",  
                    this.renderables.frame.frameNode, 
                    []
                );
                this.renderables.element.data(this.content.list);
                this.renderables.element.create();
    
    
            }
            run(){
                return this.data().then(()=>{
                    if ((!this.renderIfDataIsEmpty && !this.dataIsEmpty)||this.renderIfDataIsEmpty) {
                        this.create();
                    }
                    else {
                        //debugger;
                    }
                });
            }
        };
        this.personalGroupContributions= class {
            name:string;
            groupObject:object;
    
            rendererInstance:Renderables;
            fetcherInstance:DataAPI;
            displayInstance:Displays;
    
            rawContent:object;
            content:object;
            id:string;
            legend: Array<object>;
    
            parentNode:HTMLElement;
            renderIfDataIsEmpty:boolean;
            dataIsEmpty:boolean;
    
            fetcher;
            renderables; 
    
            constructor(rendererInstance:Renderables, fetcherInstance:DataAPI, displayInstance:Displays, name:string, renderIfDataIsEmpty:boolean, parentNode:HTMLElement){
                this.rendererInstance=rendererInstance;
                this.fetcherInstance=fetcherInstance;
                this.displayInstance=displayInstance;
                this.name=name;
                this.parentNode=parentNode;
                this.id="d_p_groupcontributions";
                this.content={};
                this.renderIfDataIsEmpty=renderIfDataIsEmpty;
                this.dataIsEmpty=false;
            };
            data():Promise<void>{
                return this.fetcherInstance.personalMetadata(this.name).then(data=>{
                    this.rawContent=data;
                    this.legend=[];
    
                    //[totalScore totalScore]
                    //[Group Group]
                    let series:Array<number>=[];
                    let labels:Array<string>=[];
                    //let colors={};
                    /*colors.a=[];
                    colors.b=[];*/
                    let gradients=[];
                    for(let group in this.displayInstance.groups) {
                        const score=Number(this.rawContent[this.displayInstance.groups[group].identifier].totalScore);
                        if (score>0) {
                            this.legend.push(
                                {
                                    title: this.displayInstance.groups[group].properties.name, 
                                    colorClass: "gradient_"+this.displayInstance.groups[group].identifier
                                }
                            )
                        }
                        series.push(score);
                        labels.push(this.displayInstance.groups[group].properties.name);
                        gradients.push(this.displayInstance.groups[group].properties.gradientFile);
                        /*colors.a.push(this.displayInstance.groups[group].properties.colors[0]);
                        colors.b.push(this.displayInstance.groups[group].properties.colors[1]);*/
    
                    }
                    this.content={series: series, labels: labels, gradients:gradients};
    
                });
            };
            create(){
                this.renderables={
                    frame: new this.rendererInstance.frames.DashboardElementFrame(this.rendererInstance, this.id+"_f",  this.parentNode, [])
                };
                this.renderables.frame.create();
    
    
                //Create title
                this.renderables.header=new this.rendererInstance.elements.ElementTitle(
                    this.rendererInstance, 
                    this.id+"_title",  
                    this.renderables.frame.frameNode, 
                    []
                );
                this.renderables.header.data("Töögrupid", "Sinu punktide jaotumine");
                this.renderables.header.create();
    
                /*//Create total
                this.renderables.total=new this.rendererInstance.elements.Value(
                    this.rendererInstance, 
                    this.id+"_total",  
                    this.renderables.frame.frameNode, 
                    ["colored-text_"+this.groupObject.identifier]
                );
                this.renderables.total.data(this.content.totalScore);
                this.renderables.total.create();*/
    
                /*//Create stripe
                this.renderables.stripe=new this.rendererInstance.elements.Stripe(
                    this.rendererInstance, 
                    this.id+"_stripe",  
                    this.renderables.frame.frameNode, 
                    ["gradient_"+this.groupObject.identifier]
                );
                this.renderables.stripe.data(this.groupObject.properties.colors);
                this.renderables.stripe.create();*/
    
                //Create element
                this.renderables.element=new this.rendererInstance.elements.PieChart(
                    this.rendererInstance, 
                    this.id+"_content",  
                    this.renderables.frame.frameNode, 
                    []
                );
                this.renderables.element.data(this.content);
                this.renderables.element.create();
    
    
                this.renderables.legend = new this.rendererInstance.elements.ChartLegend(
                    this.rendererInstance,
                    this.id + "_l",
                    this.renderables.frame.frameNode,
                    []
                );
                this.renderables.legend.data(this.legend);
                this.renderables.legend.create();
            }
            run(){
                return this.data().then(()=>{
                    if ((!this.renderIfDataIsEmpty && !this.dataIsEmpty)||this.renderIfDataIsEmpty) {
                        this.create();
                    }
                    else {
                        //debugger;
                    }
                });
            }
        };
        this.ActivityChart= class {
            name:string;
            group:string;
            groupObject:object;
    
            rendererInstance:Renderables;
            fetcherInstance:DataAPI;
            displayInstance:Displays;
    
            rawContent:object;
            content:object;
            id:string;
    
            parentNode:HTMLElement;
            renderIfDataIsEmpty:boolean;
            dataIsEmpty:boolean;
    
            fetcher;
            renderables;
    
            title:string;
            subtitle:string;
    
            constructor(rendererInstance:Renderables, fetcherInstance:DataAPI, displayInstance:Displays, name:string, group:string, renderIfDataIsEmpty:boolean, parentNode:HTMLElement){
                this.rendererInstance=rendererInstance;
                this.fetcherInstance=fetcherInstance;
                this.displayInstance=displayInstance;
                this.name=name;
                this.group=group;
                this.parentNode=parentNode;
                this.id="d_p_activity";
                this.content={};
                this.renderIfDataIsEmpty=renderIfDataIsEmpty;
                this.dataIsEmpty=false;
                this.title="Aktiivsus";
                this.subtitle="Punktid ja tegevused ajas";
            };
            data():Promise<void>{
                return this.fetcherInstance.activityReport(this.name, this.group).then(data=>{
                    this.rawContent=data;
                    
                    //series1: [value, value]
                    //series2: [value, value]
                    //categories: ["month 'year", "month 'year"]
                    this.content.colors=['#c2475e', '#108cfd'];
                    
                    let series1={
                        name: 'Punkte',
                        data: []
                    };
                    let series2={
                        name: 'Tegevusi',
                        data: []
                    };
                    this.content.categories=[];
                    for(let i=this.rawContent.length-1; i>0; i--) {
                        series1.data.push(truncate(this.rawContent[i].score));
                        series2.data.push(truncate(this.rawContent[i].activities));
                        this.content.categories.push(String(this.rawContent[i].m)+" "+String(this.rawContent[i].y));
                    }
                    this.content.series=[series1, series2];
                    this.content.yaxis=[];
    
                    for(let i=0; i<this.content.series.length; i++) {
                        let opposite=false;
                        if(i%2) {
                            opposite=true;
                        }
                        this.content.yaxis.push({
                            axisTicks: {
                                show: true,
                            },
                            tooltip: {
                                enabled: false,
                            },
                            seriesName: this.content.series[i].name,
                            opposite: opposite
                        });
                    }
                });
            };
            create(){
                this.renderables={
                    frame: new this.rendererInstance.frames.DashboardElementFrame(this.rendererInstance, this.id+"_f",  this.parentNode, [])
                };
                this.renderables.frame.create();
    
    
                //Create title
                this.renderables.header=new this.rendererInstance.elements.ElementTitle(
                    this.rendererInstance, 
                    this.id+"_title",  
                    this.renderables.frame.frameNode, 
                    []
                );
                this.renderables.header.data(this.title, this.subtitle);
                this.renderables.header.create();
    
                //Create element
                this.renderables.element=new this.rendererInstance.elements.AreaChart(
                    this.rendererInstance, 
                    this.id+"_content",  
                    this.renderables.frame.frameNode, 
                    []
                );
                this.renderables.element.data(this.content);
                this.renderables.element.create();
    
                this.displayInstance.styleContainer.add({name: "cl_points", styles: "background: #c2475e"});
                this.displayInstance.styleContainer.add({name: "cl_activities", styles: "background: #108cfd"});
    
                this.renderables.legend = new this.rendererInstance.elements.ChartLegend(
                    this.rendererInstance,
                    this.id + "_l",
                    this.renderables.frame.frameNode,
                    []
                );
                this.renderables.legend.data(
                    [
                        {title:"Punktid", colorClass: "cl_points"},
                        {title:"Tegevused", colorClass: "cl_activities"}
                    ]
                );
                this.renderables.legend.create();
            }
            run(){
                return this.data().then(()=>{
                    if ((!this.renderIfDataIsEmpty && !this.dataIsEmpty)||this.renderIfDataIsEmpty) {
                        this.create();
                    }
                    else {
                        //debugger;
                    }
                });
            }
        };
        this.ExemptionWarning= class {
            name:string;
    
            rendererInstance:Renderables;
            fetcherInstance:DataAPI;
            displayInstance:Displays;
    
            rawContent:object;
            content:object;
            id:string;
    
            parentNode:HTMLElement;
    
            fetcher;
            renderables;
    
            constructor(rendererInstance:Renderables, fetcherInstance:DataAPI, displayInstance:Displays, name:string, parentNode:HTMLElement){
                this.rendererInstance=rendererInstance;
                this.fetcherInstance=fetcherInstance;
                this.displayInstance=displayInstance;
                this.name=name;
                this.parentNode=parentNode;
                this.id="d_p_exemptionwarning";
                this.content={};
            };
            data():Promise<void>{
                return this.fetcherInstance.exempt(this.name).then(data=>{
                    this.content.value=data.value;
                });
            };
            create(){
                if(this.content.value===true || this.content.value==='true') {
                    this.renderables={
                        frame: new this.rendererInstance.frames.WarningFrame(this.rendererInstance, this.id+"_f",  this.parentNode, [])
                    };
                    this.renderables.frame.create();
        
        
                    //Create element
                    this.renderables.header=new this.rendererInstance.elements.Warning(
                        this.rendererInstance, 
                        this.id+"_title",  
                        this.renderables.frame.frameNode, 
                        []
                    );
                    this.renderables.header.data("Sinu staatuse tõttu ei arvestata sinu punkte jooksvates punktitabelites");
                    this.renderables.header.create();
                }
                
            }
            run(){
                return this.data().then(()=>{
                    this.create();
                });
            }
        };
        this.ActivityChartOverall= class extends this.ActivityChart {
            constructor(rendererInstance:Renderables, fetcherInstance:DataAPI, displayInstance:Displays, renderIfDataIsEmpty:boolean, parentNode:HTMLElement){
                super(rendererInstance, fetcherInstance, displayInstance, null, 'all', renderIfDataIsEmpty, parentNode);
                this.title="Kõigi bestikate aktiivsus";
            }
        };
        this.Splash= class {
            name:string;
    
            rendererInstance:Renderables;
            fetcherInstance:DataAPI;
            displayInstance:Displays;
    
            rawContent:object;
            content:object;
            id:string;
            classes:Array<string>;
            parentNode:HTMLElement;
    
            fetcher;
            renderables; 
            constructor(rendererInstance:Renderables, fetcherInstance:DataAPI, displayInstance:Displays, name:string, parentNode:HTMLElement){
                this.rendererInstance=rendererInstance;
                this.fetcherInstance=fetcherInstance;
                this.displayInstance=displayInstance;
                this.name=name;
                this.parentNode=parentNode;
                this.id="d_p_splash";
                this.content={};
            };
            data():Promise<void>{
                this.content={
                    status: "",
                    placement: 0.7,
                    top_score: 20000,
                    person_score: 14000,
                    icon: undefined
                }
                return this.fetcherInstance.podium('all', 'totalScore', 1, false).then(
                    data=>{
                        this.content.top_score=data[0].score;
                    }
                ).then(
                    ()=>{
                        return this.fetcherInstance.placement('all', this.name, false, 'totalScore');
                    }
                ).then(
                    data=>{
                        this.content.person_score=data[0].score;
    
                        //Calculate result
    
                        /*this is the first "actual" arithmetic I've done on this front-end, where 
                        I've already written about a thousand lines. 
                        Goes to show that university programming courses really don't match reality.*/
                        this.content.placement=this.content.person_score/this.content.top_score;
                    }
                ).then(
                    ()=>{
                        return this.fetcherInstance.personalStatus(this.name);
                    }
                ).then(
                    data=>{
                        if(data.status!=undefined) {
                            this.content.status=data.status;
                        }
                    }
                ).then(
                    ()=>{
                        return this.fetcherInstance.svg('best_icon_filtered.svg');
                    }
                ).then(
                    data=>{
                        this.content.icon=data;
                    }
                )
                
            };
            create(){
                this.renderables={
                    element: new this.rendererInstance.elements.DynamicBackground(this.rendererInstance, this.id+"_f",  this.parentNode, [])
                };
                this.renderables.element.data(this.name, this.content.status, this.content.placement, this.content.icon);
                this.renderables.element.create();
    /*
                //Create title
                this.renderables.header=new this.rendererInstance.elements.ElementTitle(
                    this.rendererInstance, 
                    this.id+"_title",  
                    this.renderables.frame.frameNode, 
                    []
                );
                this.renderables.header.data(this.groupObject.properties.name, "Töögrupi ülevaade");
                this.renderables.header.create();
    
                //Create total
                this.renderables.total=new this.rendererInstance.elements.Value(
                    this.rendererInstance, 
                    this.id+"_total",  
                    this.renderables.frame.frameNode, 
                    ["colored-text_"+this.groupObject.identifier]
                );
                this.renderables.total.data(this.content.totalScore);
                this.renderables.total.create();
    
                //Create stripe
                this.renderables.stripe=new this.rendererInstance.elements.Stripe(
                    this.rendererInstance, 
                    this.id+"_stripe",  
                    this.renderables.frame.frameNode, 
                    ["gradient_"+this.groupObject.identifier]
                );
                this.renderables.stripe.data(this.groupObject.properties.colors);
                this.renderables.stripe.create();
    
                //Create element
                this.renderables.element=new this.rendererInstance.elements.ActivityList(
                    this.rendererInstance, 
                    this.id+"_content",  
                    this.renderables.frame.frameNode, 
                    []
                );
                this.renderables.element.data(this.content.list);
                this.renderables.element.create();
    
            */
            }
            
            run(){
                return this.data().then(()=>{
                    this.create();
                });
            }
        }
    };
    setup(dataAPI:DataAPI, renderable:Renderables, id:number ):Promise<void> {
        this.id=id;
        this.styleContainer=new renderable.elements.StyleContainer(renderable, this.id+"_style", document.getElementsByTagName("head")[0]);
        this.styleContainer.create();

        this.groups=[];
        return dataAPI.groups().then(
            (data:Array<Group>)=>{
                for(const group in data) {
                    this.groups.push(
                        {
                            identifier: group, 
                            properties: data[group]
                        }
                    );
                };
                this.groups.forEach(
                    (groupElement)=>{
                        //Add all style classes you wish to use, here

                        //gradient_<x>: Simple gradient for the stripe element or any other gradient element
                        const colorString=groupElement.properties.colors.reduce(
                            (colorString, color)=>{
                                return colorString+=(color+" ,");
                            },
                            ""
                        ).slice(0, -1); 

                        this.styleContainer.add(
                            {
                                name: "gradient_"+groupElement.identifier, 
                                styles:
                                `
                                background: linear-gradient(to right, ${colorString});
                                `
                            }
                        );

                        //colored-text_<x>:Colored text
                        this.styleContainer.add(
                            {
                                name: "colored-text_"+groupElement.identifier, 
                                styles:
                                `
                                color:${groupElement.properties.colors[0]};
                                --color: ${groupElement.properties.colors[0]};
                                `
                            }
                        );

                        this.styleContainer.add(
                            {
                                name: "color-vars_"+groupElement.identifier, 
                                styles:
                                `
                                --gradientRight:linear-gradient(to right, ${colorString});
                                --gradientTop:linear-gradient(90deg, ${colorString});
                                --colorA: ${groupElement.properties.colors[0]};
                                --colorB: ${groupElement.properties.colors[1]};
                                `
                            }
                        );
                    }
                );
            }
        );
        
    };
    getGroupObject(identifier:string) {
        let selectedGroup;
        if(this.groups==undefined){
            throw "Group array accessed before Displays.setup() (or the groups array is empty for some other reason)"
        }
        this.groups.forEach(group=>{
            if(group.identifier==identifier){selectedGroup=group}
        });
        //selectedGroup=this.groups[identifier];
        if (selectedGroup==undefined) {
            throw ("Invalid group identifier: "+identifier)
        };
        return selectedGroup;
    };
    
}
class personalPoints {
    rendererInstance:Renderables;
    displayInstance:Displays;
    fetcherInstance:DataAPI;
    rawContent:object;
    content:object;
    id:string;
    classes:Array<string>;
    parentNode:HTMLElement;
    fetcher;
    renderables; 
    constructor(rendererInstance:Renderables, fetcherInstance:DataAPI, displayInstance:Displays, id:string, parentNode:HTMLElement){
        this.rendererInstance=rendererInstance;
        this.fetcherInstance=fetcherInstance;
        this.displayInstance=displayInstance;
        this.id=id;
        this.parentNode=parentNode;
        this.rawContent;
        this.content;
        this.fetcher;
        this.renderables;
    };
    create(classes:Array<string>){
        //Create frame
        this.renderables={
            frame: new this.rendererInstance.frames.DashboardElementFrame(this.rendererInstance, this.id+"_f",  this.parentNode, [])
        };
        this.renderables.frame.create();
        //Create element
        this.renderables.element=new this.rendererInstance.elements.LargeValue(this.rendererInstance, this.id,  this.renderables.frame.frameNode, classes);
        this.renderables.element.data(
            this.content.data.top, 
            this.content.data.center, 
            this.content.data.bottom, 
            this.content.data.bottomNotice
        );
        this.renderables.element.create();
    };
}