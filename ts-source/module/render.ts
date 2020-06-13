import ApexCharts from '../include/apexcharts/dist/apexcharts.esm.js'
import autocomplete from './autocomplete.js'
export default class Renderables {
    frames: object;
    elements: object;
    registeredFrameList:Array<FrameBase>;
    registerFrame(frame:FrameBase){
        this.registeredFrameList.push(frame);
    };
    removeRegisteredFrame(frameToRemove:ElementBase){
        this.registeredFrameList.forEach((frame, index)=>{
            if(frame.id===frameToRemove.id){
                frame.destroy();
                this.registeredFrameList.splice(index, 1);
            }
        });
    };
    removeAllRegisteredFrames(){
        this.registeredFrameList.forEach(frame=>{
            frame.destroy();
        });
        this.registeredFrameList=[];
    }

    constructor(){
        this.registeredFrameList=[];

        this.frames={
            PageHeader: class extends FrameBase {
                classes:Array<string>;
                content: {
                    backButtonEnabled:boolean, backButtonAction:Function
                };
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                data(backButtonEnabled:boolean, backButtonAction:Function):void {
                    this.content={backButtonEnabled: backButtonEnabled, backButtonAction: backButtonAction};
                };
                render():void{
                    if(this.content.backButtonEnabled){
                        this.parentNode.querySelector(`#${this.id+"_bbtn"}`).classList.remove("r_invis");
                        this.parentNode.querySelector(`#${this.id+"_bbtn"}`).onclick=this.content.backButtonAction;
                    }
                    else{
                        this.parentNode.querySelector(`#${this.id+"_bbtn"}`).classList.add("r_invis");
                        this.parentNode.querySelector(`#${this.id+"_bbtn"}`).onclick=undefined;
                    }
                };
                create():void{
                    //this.baseInstance.registerFrame(this);
                    const baseClass='pageHeader';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class=${classList}>
                            <div id="${this.id+"_bbtn"}" class="${baseClass+"_bbtn"}">
                            <div id="${this.id+"_logo"}" class="${baseClass+"_logo"}">
                        </div>
                    `;
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
                    this.render();
                }
            },
            WideFrame: class extends FrameBase {
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                create():void{
                    this.baseInstance.registerFrame(this);
                    const baseClass='wideFrame';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                        </div>
                    `;
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
                }
            },
            DashboardFrameWide: class extends FrameBase {
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                create():void{
                    this.baseInstance.registerFrame(this);
                    const baseClass='dashboardFrameWide';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                        </div>
                    `;
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
                }
            },
            DashboardFrame: class extends FrameBase {
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                create():void{
                    this.baseInstance.registerFrame(this);
                    const baseClass='dashboardFrame';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                        </div>
                    `;
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
                }
            },
            DashboardElementFrame: class extends FrameBase {
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                create():void{
                    this.baseInstance.registerFrame(this);
                    const baseClass='dashboardElementFrame';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                            <div id="${this.id+"_fdiv"}" class="${baseClass+"_fdiv"}">
                            </div>
                        </div>
                    `;
                    this.elementNode=this.toDOMElement(HTMLString);
                    this.frameNode=this.elementNode.children[0];
                    this.toDOM(this.elementNode);
                }
            },
            InputFrame: class extends FrameBase {
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                create():void{
                    this.baseInstance.registerFrame(this);
                    const baseClass='inputFrame';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                            <div id="${this.id+"_fdiv"}" class="${baseClass+"_fdiv"}">
                            </div>
                        </div>
                    `;
                    this.elementNode=this.toDOMElement(HTMLString);
                    this.frameNode=this.elementNode.children[0];
                    this.toDOM(this.elementNode);
                }
            },
            WarningFrame: class extends FrameBase {
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                create():void{
                    this.baseInstance.registerFrame(this);
                    const baseClass='warningFrame';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                            <div id="${this.id+"_fdiv"}" class="${baseClass+"_fdiv"}">
                            </div>
                        </div>
                    `;
                    this.elementNode=this.toDOMElement(HTMLString);
                    this.frameNode=this.elementNode.children[0];
                    this.toDOM(this.elementNode);
                }
            }
        };
        this.elements={
            StyleContainer: class extends ElementBase{
                content: {
                    style: Array<object>
                };
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement){
                    super(baseInstance, id, parentNode);
                    this.content={style: []};
                };
                data(style: Array<object>):void {
                    this.content=style;
                };
                add(classElement:object){
                    this.content.style.push(classElement);
                    this.render();
                };
                render():void{
                    const styleStr=this.content.style.reduce(
                        (str, classElement)=>{
                            return str+="."+classElement.name+"{"+classElement.styles+"}";
                        },
                        ""
                    );
                    this.elementNode.innerHTML=styleStr;
                };
                create():void{
                    const styleElement=document.createElement('style');
                    styleElement.setAttribute('id', this.id);
                    this.elementNode=styleElement;
                    this.parentNode.appendChild(styleElement);
                    this.render();
                }
            },
            ElementTitle: class extends ElementBase{
                content: {
                    top:string, bottom:string
                };
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                data(top:string, bottom:string):void {
                    this.content={top: top, bottom: bottom};
                };
                render():void{
                    this.parentNode.querySelector(`#${this.id+"_p1"}`).innerText=this.content.top;
                    this.parentNode.querySelector(`#${this.id+"_p2"}`).innerText=this.content.bottom;
                };
                create():void{
                    const baseClass='elementTitle';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                            <p id="${this.id+"_p1"}" class="${baseClass+"_p1"}"></p>
                            <p id="${this.id+"_p2"}" class="${baseClass+"_p2"}"></p>
                        </div>
                    `;
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
                    this.render();
                }
            },
            Value: class extends ElementBase{
                content: {
                    value:string
                };
                
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                data(value:string):void {
                    this.content={value: value};
                };
                render():void{
                    this.parentNode.querySelector(`#${this.id+"_p1"}`).innerText=this.content.value;
                };
                create():void{
                    const baseClass='value';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                            <p id="${this.id+"_p1"}" class="${baseClass+"_p1"}"></p>
                        </div>
                    `;
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
                    this.render();
                }
            },
            Warning: class extends ElementBase{
                content: {
                    value:string
                };
                
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                data(value:string):void {
                    this.content={value: value};
                };
                render():void{
                    this.parentNode.querySelector(`#${this.id+"_p1"}`).innerText=this.content.value;
                };
                create():void{
                    const baseClass='warning';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                            <svg width="50.8mm" height="50.8mm" version="1.1" viewBox="0 0 50.8 50.8" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
                                <g transform="translate(0,-246.2)">
                                    <path d="m25.525 250.97a2.6461 2.6461 0 0 0-0.26511 0 2.6461 2.6461 0 0 0-2.1502 1.3204l-20.164 34.924a2.6461 2.6461 0 0 0 2.2908 3.9688h40.328a2.6461 2.6461 0 0 0 2.2908-3.9688l-20.164-34.924a2.6461 2.6461 0 0 0-2.1663-1.3208zm-0.16536 8.4264a2.6461 2.6461 0 0 1 2.6851 2.6836v12.699a2.6461 2.6461 0 1 1-5.2906 0v-12.699a2.6461 2.6461 0 0 1 2.6055-2.6836zm0 21.168a2.6461 2.6461 0 0 1 2.6851 2.682v0.26564a2.6461 2.6461 0 1 1-5.2906 0v-0.26564a2.6461 2.6461 0 0 1 2.6055-2.682z" style="fill:var(--svg-fgcolor)"/>
                                </g>
                            </svg>
                            <p id="${this.id+"_p1"}" class="${baseClass+"_p1"}"></p>
                        </div>
                    `;
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
                    this.render();
                }
            },
            AutocompleteInput: class extends ElementBase{
                content: {
                    list:Array<string>,
                    submitAction:CallableFunction
                };
                
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                data(list:Array<string>,submitAction:CallableFunction):void {
                    this.content={list: list, submitAction: submitAction};
                };
                render():void{
                    //this.parentNode.querySelector(`#${this.id+"_p1"}`).innerText=this.content.value;
                };
                changeSubmitState(state:boolean, renderableInstance:AutocompleteInput) {
                    const baseClass='autocompleteInput';
                    const element:HTMLButtonElement=renderableInstance.elementNode.querySelector('#'+renderableInstance.id+"_submit");
                    if(state) {
                        element.classList.remove(baseClass+"_submit_inactive");
                        element.addEventListener('click', renderableInstance.content.submitAction);
                    }
                    else {
                        renderableInstance.elementNode.querySelector('#'+renderableInstance.id+"_submit").classList.add(baseClass+"_submit_inactive");
                        element.removeEventListener('click', renderableInstance.content.submitAction);
                    }
                }
                create():void{
                    const baseClass='autocompleteInput';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                            <!--<p id="${this.id+"_p1"}" class="${baseClass+"_p1"}">Sisesta nimi</p>-->
                            <form autocomplete="off">
                                <div class="autocomplete" >
                                    <input id="${this.id+"_input"}" type="text" class="name-input" name="user-name" placeholder="Nimi">
                                </div>  
                            </form>
                            <button id="${this.id+"_submit"}" class="${baseClass+"_submit"+" "+baseClass+"_submit_inactive"}">
                                <svg width="10.583mm" height="10.583mm" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                                    <g transform="translate(0 -286.42)">
                                        <path d="m3.9688 288.8 2.9104 2.9104-2.9104 2.9104" style="fill:none;paint-order:markers fill stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:.66146;stroke:var(--svgFGColor)"/>
                                    </g>
                                </svg>
                            </button>
                        </div>
                    `;
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
                    autocomplete(this.elementNode.querySelector('#'+this.id+"_input"), this.content.list, this.content.submitAction, this.changeSubmitState, this);
                    this.render();
                }
            },
            ChartLegend: class extends ElementBase{
                content: {
                    data: []
                };
                elements:Array<ChartLegendElement>;
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                data(elements:Array<object>):void {
                    this.content={};
                    this.content.data=elements;
                };
                render():void{
                    this.elements.forEach((element)=>{element.render()});
                };
                create():void{
                    const baseClass='chartLegend';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                        </div>
                    `;
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
    
                    this.elements=[];
                    this.content.data.forEach((legendElement, index)=>{
                        const element=new ChartLegendElement(this.baseInstance, this.id+"_"+index, this.elementNode, []);
                        element.data( legendElement.colorClass, legendElement.title);
                        element.create();
                        this.elements.push();
                    })
    
                    //this.render();
                }
            },
            
            LargeValue: class extends ElementBase{
                content: {
                    top:string, center:string, bottom:string, bottomNotice:string
                };
                
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                data(top:string, center:string, bottom:string, bottomNotice:string):void {
                    this.content={top: top, center: center, bottom: bottom, bottomNotice: bottomNotice};
                };
                render():void{
                    this.parentNode.querySelector(`#${this.id+"_p1"}`).innerText=this.content.top;
                    this.parentNode.querySelector(`#${this.id+"_p2span"}`).innerText=this.content.center;
                    this.parentNode.querySelector(`#${this.id+"_p3span1"}`).innerText=this.content.bottom;
                    this.parentNode.querySelector(`#${this.id+"_p3span2"}`).innerText=this.content.bottomNotice;
                    fitty(`#${this.id+"_p2"}`, {minSize: 12, maxSize: 130});
                };
                create():void{
                    const baseClass='largeValue';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                            <p id="${this.id+"_p1"}" class="${baseClass+"_p1"}"></p>
                            <div class="${baseClass+"_p2div"}">
                                <p class="${baseClass+"_p2"}" id="${this.id+"_p2"}"><span id="${this.id+"_p2span"}"></span></p>
                            </div>
                            <p id="${this.id+"_p3"}" class="${baseClass+"_p3"}">
                                <span id="${this.id+"_p3span1"}" class="${baseClass+"_p3span1"}"></span>
                                <span id="${this.id+"_p3span2"}" class="${baseClass+"_p3span2"}"></span>
                            </p>
                        </div>
                    `;
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
                    this.render();
                }
            },
            Stripe: class extends ElementBase{
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                /*data(gradient:Array<string>):void {
                    this.content={gradient};
                };*/
                /*render():void{
                    //Add all the color values to a string and then remove the last comma
                    const colorString=this.content.gradient.reduce(
                        (colorString, color)=>{
                            return colorString+=(color+" ,");
                        },
                        ""
                    ).slice(0, -1); 
    
    
                    const div=this.parentNode.querySelector(`#${this.id+"_div"}`);
                    div.style.background="linear-gradient(to right, "+colorString+")";
                    debugger
                };*/
                create():void{
                    const baseClass='stripe';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                        </div>
                    `;
                    this.elementNode=this.toDOMElement(HTMLString);
                    this.toDOM(this.elementNode);
                    //this.render();
                }
            },
            PointList: class extends ElementBase{
                content: {
                    elements: Array<pointListElement>
                };
                
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                data(elements: Array<pointListElement>):void {
                    this.content={elements: elements};
                };
                render():void{
                    const baseClass='pointList';
                    let ListElementHTMLString="";
                    this.content.elements.forEach(element=>{
                        ListElementHTMLString+=`<div class="${baseClass+"_element"}">
                        <p class="${baseClass+"_group"}">${element.group}</p>
                        <p class="${baseClass+"_name"}">${element.name}</p>
                        <p class="${baseClass+"_value"}">${element.value}</p>
                        </div>`;
                    })
                    this.elementNode.innerHTML=ListElementHTMLString;
                    
                };
                create():void{
                    const baseClass='pointList';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                        </div>
                    `;
    
    
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
                    this.render();
                }
            },
            ActivityList: class extends ElementBase{
                content: {
                    elements: Array<activityListElement>
                };
                
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                data(elements: Array<activityListElement>):void {
                    this.content={elements: elements};
                };
                render():void{
                    const baseClass='acitivtyList';
                    let ListElementHTMLString="";
                    this.content.elements.forEach(element=>{
                        ListElementHTMLString+=`<div class="${baseClass+"_element"}">
                        <p class="${baseClass+"_name"}">${element.activity}</p>
                        <p class="${baseClass+"_repeats"}">${element.repeats}</p>
                        <p class="${baseClass+"_value"}">${element.value}</p>
                        </div>`;
                    })
                    this.elementNode.innerHTML=ListElementHTMLString;
                    
                };
                create():void{
                    const baseClass='acitivtyList';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                        </div>
                    `;
    
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
                    this.render();
                }
            },
            GroupLeaderList: class extends ElementBase{
                content: {
                    elements: Array<object>
                };
                
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                data(elements: Array<object>):void {
                    this.content={elements: elements};
                };
                render():void{
                    const baseClass='groupLeaderList';
                    let ListElementHTMLString="";
                    this.content.elements.forEach(element=>{
                        const classList=classListToString(element.classes.concat([baseClass+"_element"]));
                        ListElementHTMLString+=`<div class="${classList}">
                            <p class="${baseClass+"_group"}">${element.group}</p>
                            <div class="${baseClass+"_line"}"></div>
                            <p class="${baseClass+"_name"}">${element.name}</p>
                            <p class="${baseClass+"_value"}">${element.value}</p>
                        </div>`;
                    })
                    this.elementNode.innerHTML=ListElementHTMLString;
                    
                };
                create():void{
                    const baseClass='groupLeaderList';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                        </div>
                    `;
    
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
                    this.render();
                }
            },
            DynamicBackground: class extends ElementBase{
                content: {
                    center:string,
                    bottom: string,
                    excitedness: number
                };
                
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                data(center:string, bottom: string, excitedness: number, icon:string):void {
                    this.content={center:center, bottom: bottom, excitedness:excitedness, icon};
                };
                render():void{
                    this.parentNode.querySelector(`#${this.id+"_p1"}`).innerText=this.content.center;
                    this.parentNode.querySelector(`#${this.id+"_p2"}`).innerText=this.content.bottom;
                    fitty("#"+this.id+"_p1", {minSize: 12, maxSize: 100});
                    
                };
                create():void{
                    const baseClass='dynamicBackground';
                    const classList=classListToString(this.classes.concat([baseClass]));
    
                    const nrOfIcons=Math.round(7*this.content.excitedness);
                    let iconStr="";
                    for(let i=0; i<nrOfIcons; i++) {
                        iconStr+=this.content.icon;
                    }
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                            ${iconStr}
                            <div class="${baseClass+"_p1div"}">
                                <p id="${this.id+"_p1"}" class="${baseClass+"_p1"}"></p>
                            </div>
                            <div class="${baseClass+"_p2div"}">
                                <p id="${this.id+"_p2"}" class="${baseClass+"_p2"}"></p>
                            </div>
                        </div>
                    `;
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
                    let index=0;
                    this.elementNode.querySelectorAll("svg").forEach((element:Element)=>{
                        element.setAttribute('id', this.id+"_svg_"+index);
                        index++;
                    })
                    this.render();
                }
            },
            PieChart: class extends ElementBase{
                content: {
                    values:Array<number>
                };
                
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                data(values):void {
                    this.content={values:values};
                };
                render():void{
                };
                create():void{
                    const baseClass='pieChart';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                        </div>
                    `;
                    let options = {
                        series: this.content.values.series,
                        labels: this.content.values.labels,
                        chart: {
                            type: 'donut',
                            redrawOnParentResize: true,
                            selection: {
                                enabled: false,
                            },
                            animations: {
                                enabled: false,
                            }
                        },
                        plotOptions: {
                            pie: {
                            startAngle: 10,
                            expandOnClick: false,
                            donut: {
                                size: '72%',
                                background: 'transparent',
                                labels: {
                                    show: false,
                                    name: {
                                        show: false,
                                    },
                                    value: {
                                        show: false,
                                    },
                                    total: {
                                        show: false,
                                        showAlways: false,
                                    }
                                }
                            },
                        },},
                        
                        states: {
                            normal: {
                                filter: {
                                    type: 'none',
                                    value: 0,
                                }
                            },
                            hover: {
                                filter: {
                                    type: 'none',
                                    value: 0,
                                }
                            },
                            active: {
                                allowMultipleDataPointsSelection: false,
                                filter: {
                                    type: 'none',
                                    value: 0,
                                }
                            },
                        },
                        stroke: {
                            show: false,   
                        },
                        
                        fill: {
                            type: 'image',
                            image: {
                                src: this.content.values.gradients/*,
                                width: 100,
                                height: 100*/
                            },
                        },
                        dataLabels: {
                            enabled: false
                        },
                        tooltip: {
                            enabled: false,
                            onDatasetHover: {
                                highlightDataSeries: false,
                            },
                        },
                        legend: {
                            show: false 
                        },
                        responsive: [{
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 200
                                }
                            }
                        }]
                    };
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
                    let chart = new ApexCharts(this.elementNode, options);
                    chart.render();
                    this.render();
                }
            },
            AreaChart: class extends ElementBase{
                content: {
                    values:Array<number>
                };
                
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                data(values):void {
                    this.content={values:values};
                };
                render():void{
                };
                create():void{
                    const baseClass='areaChart';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                        </div>
                    `;
                    this.content.values.yaxis.style={
                        cssClass: 'chart-text',
                    };
                    let options = {
                        series: this.content.values.series,
                        colors: this.content.values.colors,
                        chart: {
                            height: 350,
                            type: 'area',
                            redrawOnParentResize: true,
                            zoom: {
                                enabled: false,
                            },
                            toolbar: {
                                show: false,
                                offsetX: 0,
                                offsetY: 0,
                                tools: {
                                    download: false,
                                    selection: false,
                                    zoom: false,
                                    zoomin: false,
                                    zoomout: false,
                                    pan: false,
                                    reset: false,
                                    customIcons: []
                                }
                                //autoSelected: 'zoom' 
                            },
                            selection: {
                                enabled: false,
                            }
                        },
                        dataLabels: {
                            enabled: false
                        },
                        stroke: {
                            curve: 'smooth',
                            width: 1.3
                        },
                        xaxis: {
                            categories: this.content.values.categories,
                            style: {
                                cssClass: 'chart-text',
                            }
                        },
                        yaxis: this.content.values.yaxis,
                        animations: {
                            enabled: false,
                        },
                        tooltip: {
                            enabled: false,
                            onDatasetHover: {
                                highlightDataSeries: false,
                            },
                        },
                        
                        legend: {
                            show: false 
                        },
                        states: {
                            normal: {
                                filter: {
                                    type: 'none',
                                    value: 0,
                                }
                            },
                            hover: {
                                filter: {
                                    type: 'none',
                                    value: 0,
                                }
                            },
                            active: {
                                allowMultipleDataPointsSelection: false,
                                filter: {
                                    type: 'none',
                                    value: 0,
                                }
                            },
                        }
                        
                        
                    };
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
                    let chart = new ApexCharts(this.elementNode, options);
                    chart.render();
                    this.render();
                }
            },
            StackedBarChart: class extends ElementBase{
                content: {
                    values:Array<number>
                };
                
                classes:Array<string>;
                constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
                    super(baseInstance, id, parentNode);
                    this.classes=classes;
                };
                data(values):void {
                    this.content={values:values};
                };
                render():void{
                };
                create():void{
                    const baseClass='stackedBarChart';
                    const classList=classListToString(this.classes.concat([baseClass]));
                    const HTMLString=`
                        <div id="${this.id+"_div"}" class="${classList}">
                        </div>
                    `;
                    let options = {
                        /*series: this.content.values.series,
                        colors: this.content.values.colors,*/
                        /*xaxis: {
                            categories: this.content.values.categories
                        },*/
                        series: this.content.values.series,
                        colors: this.content.values.colors,
                        chart: {
                            type: 'bar',
                            height: 350,
                            stacked: true,
                            redrawOnParentResize: true,
                            zoom: {
                                enabled: false,
                            },
                            toolbar: {
                                show: false,
                                offsetX: 0,
                                offsetY: 0,
                                tools: {
                                    download: false,
                                    selection: false,
                                    zoom: false,
                                    zoomin: false,
                                    zoomout: false,
                                    pan: false,
                                    reset: false,
                                    customIcons: []
                                }
                                //autoSelected: 'zoom' 
                            },
                            selection: {
                                enabled: false,
                            }
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        plotOptions: {
                            bar: {
                                horizontal: true,
                            },
                        },
                        xaxis: {
                            categories: this.content.values.categories,
                            style: {
                                cssClass: 'chart-text',
                            }
                        },
                        yaxis: {
                            title: {
                                text: undefined
                            },
                            style: {
                                cssClass: 'chart-text',
                            }
                        },
                        tooltip: {
                            enabled: false,
                            onDatasetHover: {
                                highlightDataSeries: false,
                            },
                        },
                        fill: {
                            opacity: 1
                        },
                        legend: {
                            show: false 
                        },
                        states: {
                            normal: {
                                filter: {
                                    type: 'none',
                                    value: 0,
                                }
                            },
                            hover: {
                                filter: {
                                    type: 'none',
                                    value: 0,
                                }
                            },
                            active: {
                                allowMultipleDataPointsSelection: false,
                                filter: {
                                    type: 'none',
                                    value: 0,
                                }
                            },
                        }
                    };
                    this.elementNode=this.toDOMElement(HTMLString)
                    this.toDOM(this.elementNode);
                    let chart = new ApexCharts(this.elementNode, options);
                    chart.render();
                    this.render();
                }
            }
        }
    }
}
interface pointListElement {
    group:string;
    name:string;
    value:string;
}
interface activityListElement {
    activity:string;
    repeats:string;
    value:string;
}
class ElementBase {
    id:string;
    parentNode:HTMLElement;
    elementNode:Element;
    baseInstance:Renderables;
    constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement){
        this.baseInstance=baseInstance;
        this.id=id;
        this.parentNode=parentNode;
    };
    toDOMElement(HTMLstr:string):Element {
        const htmlObject = document.createElement('div');
        htmlObject.innerHTML = HTMLstr;
        return htmlObject.children[0];
    };
    toDOM(element:Element){
        this.parentNode.appendChild(element);
    };
    destroy(){
        this.parentNode.removeChild(this.elementNode);
    }
};
class  ChartLegendElement extends ElementBase{
    content: {
        colorClass:string,
        title:string
    };
    
    classes:Array<string>;
    constructor(baseInstance:Renderables, id:string, parentNode: HTMLElement, classes:Array<string>){
        super(baseInstance, id, parentNode);
        this.classes=classes;
    };
    data(colorClass:string, title:string):void {
        this.content={colorClass: colorClass, title: title};
    };
    render():void{
        this.parentNode.querySelector(`#${this.id+"_p1"}`).innerText=this.content.title;
        this.parentNode.querySelector(`#${this.id+"_color"}`).className=this.content.colorClass;
    };
    create():void{
        const baseClass='chartLegendElement';
        const classList=classListToString(this.classes.concat([baseClass]));
        const HTMLString=`
            <div id="${this.id+"_div"}" class="${classList}">
                <div id="${this.id+"_color"}" class=${this.content.colorClass}"></div>
                <p id="${this.id+"_p1"}" class="${baseClass+"_p1"}"></p>
            </div>
        `;
        this.elementNode=this.toDOMElement(HTMLString)
        this.toDOM(this.elementNode);
        this.render();
    }
}
class FrameBase extends ElementBase{
    frameNode:Element;
    constructor(baseInstance:Renderables,id:string, parentNode: HTMLElement){
        super(baseInstance, id, parentNode);
    }
}
function classListToString(classList:Array<string>) {
    return classList.reduce((str:string, className:string)=>{
        str+=" "+className;
        return str;
    });
}
