var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import DataAPI from './module/dataAPI.js';
import Renderables from './module/render.js';
import Displays from './module/displays.js';
let dataAPI = new DataAPI();
window.requestAPI = dataAPI;
let renderables = new Renderables();
window.renderables = renderables;
let displays = new Displays();
window.displays = displays;
const page = window.page;
let pageFunction;
if (page === "" || page === undefined || page === null) {
    pageFunction = OverallStatisticsDisplays;
}
else {
    pageFunction = personalDisplays;
}
displays.setup(dataAPI, renderables, "defaultDisplay").then(() => {
    pageFunction(page);
});
function personalDisplays(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const frame_splash = new renderables.frames.WideFrame(renderables, 'frame_nameSplash', document.getElementById('screenWrapper'), []);
        yield frame_splash.create();
        let splash = new displays.Splash(renderables, dataAPI, displays, name, frame_splash.elementNode);
        yield splash.run();
        const frame_warning = new renderables.frames.WideFrame(renderables, 'frame_warning', document.getElementById('screenWrapper'), []);
        yield frame_warning.create();
        const frame_dash = new renderables.frames.DashboardFrame(renderables, 'frame_dash', document.getElementById('screenWrapper'), []);
        yield frame_dash.create();
        let personalPointsTotal = new displays.personalPointsTotal(renderables, dataAPI, displays, name, frame_dash.elementNode);
        yield personalPointsTotal.run();
        let personalLastActivities = new displays.personalLastActivities(renderables, dataAPI, displays, name, false, frame_dash.elementNode);
        yield personalLastActivities.run();
        let personalPointsSeason = new displays.personalPointsSeason(renderables, dataAPI, displays, name, frame_dash.elementNode);
        yield personalPointsSeason.run();
        let personalPointsMonth = new displays.personalPointsMonth(renderables, dataAPI, displays, name, frame_dash.elementNode);
        yield personalPointsMonth.run();
        let personalGroupContributions = new displays.personalGroupContributions(renderables, dataAPI, displays, name, false, frame_dash.elementNode);
        yield personalGroupContributions.run();
        for (const group of displays.groups) {
            const dp_obj = new displays.personalGroupBreakdown(renderables, dataAPI, displays, name, group.identifier, false, frame_dash.elementNode);
            yield dp_obj.run();
        }
        const frame_bottom = new renderables.frames.DashboardFrameWide(renderables, 'frame_bottom', document.getElementById('screenWrapper'), []);
        yield frame_bottom.create();
        let activityGraph = new displays.ActivityChart(renderables, dataAPI, displays, name, 'all', true, frame_bottom.elementNode);
        yield activityGraph.run();
    });
}
function OverallStatisticsDisplays() {
    return __awaiter(this, void 0, void 0, function* () {
        const frame_input = new renderables.frames.DashboardFrameWide(renderables, 'frame_input', document.getElementById('screenWrapper'), []);
        yield frame_input.create();
        let input = new displays.NameInput(renderables, dataAPI, displays, frame_input.elementNode);
        yield input.run();
        const frame_dash = new renderables.frames.DashboardFrame(renderables, 'frame_dash', document.getElementById('screenWrapper'), []);
        yield frame_dash.create();
        let groupPeriodLeaders = new displays.GroupPeriodLeaders(renderables, dataAPI, displays, false, frame_dash.elementNode);
        yield groupPeriodLeaders.run();
        let groupAllTimeLeaders = new displays.GroupAllTimeLeaders(renderables, dataAPI, displays, false, frame_dash.elementNode);
        yield groupAllTimeLeaders.run();
        let monthLeaders = new displays.PeriodLeaders(renderables, dataAPI, displays, false, frame_dash.elementNode);
        yield monthLeaders.run();
        let allTimeLeaders = new displays.AllTimeLeaders(renderables, dataAPI, displays, false, frame_dash.elementNode);
        yield allTimeLeaders.run();
        const frame_bottom = new renderables.frames.DashboardFrameWide(renderables, 'frame_bottom', document.getElementById('screenWrapper'), []);
        yield frame_bottom.create();
        let activityGraph = new displays.ActivityChartOverall(renderables, dataAPI, displays, true, frame_bottom.elementNode);
        yield activityGraph.run();
    });
}
//fetch("/get_data.php?type=personalmetadata&person_name=Kalev%20Miljan", {}).then(res=>res.json()).then(data=>console.log(data));
