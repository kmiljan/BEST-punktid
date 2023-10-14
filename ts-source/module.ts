import DataAPI from './module/dataAPI.js';
import Renderables from './module/render.js';
import Displays from './module/displays.js';

let dataAPI=new DataAPI();
window.requestAPI=dataAPI;
let renderables=new Renderables();
window.renderables=renderables;
let displays=new Displays();

window.displays=displays;
const page=window.page;
let pageFunction;
if (page==="" || page===undefined || page===null){
    pageFunction=OverallStatisticsDisplays;
}
else {
    pageFunction=personalDisplays;
}
displays.setup(dataAPI, renderables, "defaultDisplay").then(
    ()=>{
        pageFunction(page);
    }
);
async function personalDisplays(name:string) {
    const frame_splash=new renderables.frames.WideFrame(renderables, 'frame_nameSplash', document.getElementById('screenWrapper'), []);
    await frame_splash.create();
    let splash=new displays.Splash(renderables, dataAPI, displays,  name, frame_splash.elementNode);
    await splash.run();

    const frame_warning=new renderables.frames.WideFrame(renderables, 'frame_warning', document.getElementById('screenWrapper'), []);
    await frame_warning.create();
    const frame_dash=new renderables.frames.DashboardFrame(renderables, 'frame_dash', document.getElementById('screenWrapper'), []);
    await frame_dash.create();
    let personalPointsTotal=new displays.personalPointsTotal(renderables, dataAPI, displays,  name, frame_dash.elementNode);
    await personalPointsTotal.run();
    let personalLastActivities=new displays.personalLastActivities(renderables, dataAPI, displays, name, false, frame_dash.elementNode);
    await personalLastActivities.run();
    let personalPointsSeason=new displays.personalPointsSeason(renderables, dataAPI, displays,  name, frame_dash.elementNode);
    await personalPointsSeason.run();
    let personalPointsMonth=new displays.personalPointsMonth(renderables, dataAPI, displays,  name, frame_dash.elementNode);
    await personalPointsMonth.run();
    let personalGroupContributions=new displays.personalGroupContributions(renderables, dataAPI, displays,  name, false, frame_dash.elementNode);
    await personalGroupContributions.run();

    let groupdatabreakdowns=[];
    displays.groups.forEach(
        (group)=>{
            const dp_obj=new displays.personalGroupBreakdown(renderables, dataAPI, displays,  name, group.identifier, false, frame_dash.elementNode);
            dp_obj.run();
            groupdatabreakdowns.push=dp_obj;
            
        }
    )

    const frame_bottom=new renderables.frames.DashboardFrameWide(renderables, 'frame_bottom', document.getElementById('screenWrapper'), []);
    await frame_bottom.create();

    let activityGraph=new displays.ActivityChart(renderables, dataAPI, displays,  name, 'all', true, frame_bottom.elementNode);
    await activityGraph.run();
}
async function OverallStatisticsDisplays() {
    const frame_input=new renderables.frames.DashboardFrameWide(renderables, 'frame_input', document.getElementById('screenWrapper'), []);
    await frame_input.create();
    let input=new displays.NameInput(renderables, dataAPI, displays, frame_input.elementNode);
    await input.run();


    const frame_dash=new renderables.frames.DashboardFrame(renderables, 'frame_dash', document.getElementById('screenWrapper'), []);
    await frame_dash.create();
    let groupPeriodLeaders=new displays.GroupPeriodLeaders(renderables, dataAPI, displays,  false, frame_dash.elementNode);
    await groupPeriodLeaders.run();
    let groupAllTimeLeaders=new displays.GroupAllTimeLeaders(renderables, dataAPI, displays,  false, frame_dash.elementNode);
    await groupAllTimeLeaders.run();
    let monthLeaders=new displays.PeriodLeaders(renderables, dataAPI, displays,  false, frame_dash.elementNode);
    await monthLeaders.run();
    let allTimeLeaders=new displays.AllTimeLeaders(renderables, dataAPI, displays,  false, frame_dash.elementNode);
    await allTimeLeaders.run();

    const frame_bottom=new renderables.frames.DashboardFrameWide(renderables, 'frame_bottom', document.getElementById('screenWrapper'), []);
    await frame_bottom.create();

    let activityGraph=new displays.ActivityChartOverall(renderables, dataAPI, displays, true, frame_bottom.elementNode);
    await activityGraph.run();
}

//fetch("/get_data.php?type=personalmetadata&person_name=Kalev%20Miljan", {}).then(res=>res.json()).then(data=>console.log(data));