var render={
    screen: {
        fadeTime: 400,
        fadeOut: function() {
            document.getElementById("screen").classList.add("_invis");
            return new Promise((resolve) => {
                setTimeout(resolve, render.screen.fadeTime);
            });
        },
        fadeIn: function() {
            document.getElementById("screen").classList.remove("_invis");
            return new Promise((resolve) => {
                setTimeout(resolve, render.screen.fadeTime);
            });
        }
    },
    header: {
        create: function(context, backbuttonAction, ibuttonAction) {
            let div=document.createElement('div');
            div.setAttribute("id", "header_wrapper");
            div.classList.add("header_wrapper");
            let icon=document.createElement('div');
            icon.classList.add("header_icon");
            icon.innerHTML=`
            <svg width="98.401mm" height="106.19mm" version="1.1" viewBox="0 0 98.401 106.19" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(-17.954 -167.14)">
             <path d="m97.81 236.18-8.0418-4.6354h-21.003l-8.0422 4.6354c7.6946 13.367 30.703 35.264 55.632 37.156-8.6882-4.8688-22.512-22.351-18.545-37.156" style="fill:var(--darkTextColor)"/>
             <path d="m103.49 167.14c0.12623 9.9533-8.0968 30.665-22.906 34.634l0.0052 9.2842 10.503 18.19 8.0343 4.6478c7.731-13.347 15.187-44.224 4.3636-66.756m-22.901 43.918-0.15696-0.27032z" style="fill:var(--darkTextColor)"/>
             <path d="m17.954 231.38c8.5588-5.0938 30.612-8.325 41.451 2.5154l8.0364-4.6478-0.15914 0.27566 10.66-18.462 0.0073-9.2839c-15.424-0.0239-45.89 8.9575-59.995 29.603" style="fill:var(--darkTextColor)"/>
             <path d="m74.344 223.95c0-2.7185 2.2015-4.9239 4.9217-4.9239 2.7203 0 4.925 2.2054 4.925 4.9239 0 2.7199-2.2047 4.9235-4.925 4.9235-2.7202 0-4.9217-2.2036-4.9217-4.9235" style="fill:var(--darkTextColor)"/>
            </g>
           </svg>
           `;
            let backbutton=document.createElement('div');
            backbutton.setAttribute("id", "header_backbutton");
            if(backbuttonAction!=undefined) {
               backbutton.addEventListener("click", backbuttonAction); 
            }
            backbutton.classList.add("header_backbutton", "_hidden");   
            backbutton.innerHTML=`<svg width="10.583mm" height="10.583mm" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0 -286.42)">
             <path d="m6.0854 288.8-2.9104 2.9104 2.9104 2.9104" style="fill:none;paint-order:markers fill stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:.66146;stroke:var(--darkTextColor)"/>
            </g>
           </svg>
           `;
            let ibutton=document.createElement('div');
            ibutton.setAttribute("id", "header_ibutton");
            if(ibuttonAction!=undefined) {
                ibutton.addEventListener("click", ibuttonAction);
                
            }
            else {
                ibutton.classList.add("_hidden"); 
            }
            ibutton.classList.add("header_ibutton");   
            ibutton.innerHTML=`<svg width="10.583mm" height="10.583mm" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
            <path d="m2.3543 2.1163a0.23792 0.23792 0 0 0-0.23849 0.23685v5.8763a0.23792 0.23792 0 0 0 0.23849 0.23685h0.20981v-5.9025h4.8256v-0.44748zm5.6648 0v5.9025h-4.8256v0.44748h5.0354a0.23792 0.23792 0 0 0 0.23849-0.23685v-5.8763a0.23792 0.23792 0 0 0-0.23849-0.23685zm-3.0816 1.6014v0.62943h0.70811v-0.62943zm0 1.1539v2.0981h0.70811v-2.0981z" style="color-rendering:auto;color:#000000;dominant-baseline:auto;fill:#000000;font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;image-rendering:auto;isolation:auto;mix-blend-mode:normal;paint-order:markers fill stroke;shape-padding:0;shape-rendering:auto;solid-color:#000000;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
           </svg>
                     
           `;
            div.appendChild(icon);
            div.appendChild(backbutton);
            div.appendChild(ibutton);
            context.appendChild(div);
        },
        hideBackbutton: function() {
            document.getElementById("header_backbutton").classList.add("_hidden");
        },
        showBackbutton: function() {
            document.getElementById("header_backbutton").classList.remove("_hidden");
        }
    },
    elementWrapper: {
        create: function(UID, hidden, loading, classes) {
            let wrapper=document.createElement('div');
            wrapper.classList.add("displayElement", "_loadingCapable", "_invisCapable");
            if(hidden!=undefined) {
                if(hidden) {
                    wrapper.classList.add("_invis");
                }
            }
            if(loading!=undefined) {
                if(loading) {
                    wrapper.classList.add("_loading");
                }
            }
            if(classes!=undefined) {
                if(classes.length>0) {
                    classes.forEach(function(value){
                        wrapper.classList.add(value);
                    });
                }
                
            }
            
            wrapper.setAttribute('id', UID)
            document.getElementById("screen").appendChild(wrapper);
            return document.getElementById(UID);
        },
        destroy: function(UID) {
            let elem = document.getElementById(UID);
            elem.parentNode.removeChild(elem);
        },
        destroyE: function(elem) {
            elem.parentNode.removeChild(elem);
        },
        fadeTime: 400,
        fadeOut: function(UID) {
            document.getElementById(UID).classList.add("_invis");
            return new Promise((resolve) => {
                setTimeout(resolve, render.elementWrapper.fadeTime);
            });
        },
        fadeIn: function(UID) {
            document.getElementById(UID).classList.remove("_invis");
            return new Promise((resolve) => {
                setTimeout(resolve, render.elementWrapper.fadeTime);
            });
        },
        loadIn: function(element) {
            element.classList.remove("_loading");
            return new Promise((resolve) => {
                setTimeout(resolve, render.elementWrapper.fadeTime);
            });
        },
        waypoints: [],
        addWaypoint: function(UID, data) {
            render.elementWrapper.waypoints.push({UID, data});
        },
        removeWaypoint: function(UID) {
            render.elementWrapper.waypoints.forEach(function(waypoint) {
                if(waypoint.UID==UID) {
                    waypoint.data.destroy();
                }
            })
        },
        whenScrolledToOnce: function(UID) {
            return new Promise((resolve)=>{
                render.elementWrapper.addWaypoint(
                    UID,
                    new Waypoint({
                        element: document.getElementById(UID),
                        //element: document.getElementById("p-bruh"),
                        handler: resolve,
                        offset: 'bottom-in-view'
                    })
                );
            }).then(
                function() {
                    render.elementWrapper.removeWaypoint(UID);
                    return new Promise((resolve) => {
                        resolve();
                    }
                    )
                }
            )
        }
        
    },
    autocompleteInput: {
        fill: function(context) {
            let wrapper=document.createElement('div');
            wrapper.setAttribute('id', "screen-input");
            wrapper.classList.add("screen-nameInput");
            wrapper.innerHTML=`<form autocomplete="off">
            <div class="autocomplete" >
                <input id="input-name" type="text" class="name-input" name="user-name" placeholder="Nimi">
            </div>
        
            </form>
            <button id="nameInput-submit" class="submitName _inactive">
            <svg width="10.583mm" height="10.583mm" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0 -286.42)">
             <path d="m3.9688 288.8 2.9104 2.9104-2.9104 2.9104" style="fill:none;paint-order:markers fill stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:.66146;stroke:var(--lightTextColor)"/>
            </g>
           </svg>
           </button>`;
            context.appendChild(wrapper);
        },
        inactivateSubmit: function() {
            let elem=document.getElementById("nameInput-submit");
            elem.classList.add("_inactive");
            elem.removeEventListener('click', showUserData);
        },
        activateSubmit: function() {
            let elem=document.getElementById("nameInput-submit");
            elem.classList.remove("_inactive");
            elem.addEventListener('click', showUserData);
        }
    },
    element: {
        hide: function(context, id) {
            context.querySelector("#"+id).classList.add("_render-hidden");
        },
        show: function(context, id) {
            context.querySelector("#"+id).classList.remove("_render-hidden");
        }
    },
    table: {
        create: function(title, headers, data, UID, classes) {
            let table=document.createElement("table");
            table.setAttribute("id", UID);
            if(classes!=undefined) {
                if(classes.length>0) {
                    classes.forEach(function(value){
                        table.classList.add(value);
                    });
                }
                
            }
            
            let row;
            let element;
            if(title!=undefined) {
                row=document.createElement("tr");
                row.classList.add("r_table_title");
                element=document.createElement("th");
                element.classList.add("r_table_title");
                element.setAttribute("id", UID+'_titlecell');
                element.innerText=title;
                row.appendChild(element);
                table.appendChild(row);
                
            }
            let table_cols=0;
            if(headers.length>0) {
                if(headers.length>table_cols) {
                    table_cols=headers.length;
                }
                row=document.createElement("tr");
                row.classList.add("r_table_header");
                for(let i=0; i<headers.length; i++) {
                    element=document.createElement("th");
                    element.classList.add("r_table_header");
                    element.innerText=headers[i];
                    row.appendChild(element);
                }
                table.appendChild(row);
            }
            
            if(data.length>0) {
                for(let i=0; i<data.length; i++) {
                    row=document.createElement("tr");
                    row.classList.add("r_table_data");
                    for(let j=0; j<data[i].length; j++) {
                        if(data[i].length>table_cols) {
                            table_cols=data[i].length;
                        }
                        element=document.createElement("td");
                        element.classList.add("r_table_data")
                        //debugger;
                        element.innerText=data[i][j];
                        row.appendChild(element);
                    }
                    table.appendChild(row);
                }
            }

            table.querySelector('#'+UID+'_titlecell').setAttribute("colspan", table_cols);
            fitty('#'+UID+'_titlecell');
            return table;
        }
    },
    tableList: {
        create: function(title, headers, data, UID, classes) {
            let div=document.createElement("div");
            let table=document.createElement("table");
            table.setAttribute("id", UID);
            if(classes!=undefined) {
                if(classes.length>0) {
                    classes.forEach(function(value){
                        table.classList.add(value);
                    });
                }
                
            }
            let row;
            let element;
            let chartTitle=document.createElement('p');
            chartTitle.innerText=title;
            chartTitle.classList.add('r_chart_title');
            chartTitle.setAttribute('id', UID+'_title');
            let chartTitleContainer=document.createElement('div');
            chartTitleContainer.classList.add('r_chart_title_container');
            chartTitleContainer.appendChild(chartTitle);
            div.appendChild(chartTitleContainer);
            /*if(title!=undefined) {
                row=document.createElement("tr");
                row.classList.add("r_tableList_title");
                element=document.createElement("th");
                element.classList.add("r_table_title");
                element.setAttribute("id", UID+'_titlecell');
                element.innerText=title;
                row.appendChild(element);
                table.appendChild(row);
                
            }*/
            let table_cols=0;
            if(headers.length>0) {
                if(headers.length>table_cols) {
                    table_cols=headers.length;
                }
                row=document.createElement("tr");
                row.classList.add("r_table_header");
                for(let i=0; i<headers.length; i++) {
                    element=document.createElement("th");
                    element.classList.add("r_table_header");
                    element.innerText=headers[i];
                    row.appendChild(element);
                }
                table.appendChild(row);
            }
            
            if(data.length>0) {
                for(let i=0; i<data.length; i++) {
                    row=document.createElement("tr");
                    row.classList.add("r_table_data");
                    for(let j=0; j<data[i].length; j++) {
                        if(data[i].length>table_cols) {
                            table_cols=data[i].length;
                        }
                        element=document.createElement("td");
                        element.classList.add("r_table_data")
                        //debugger;
                        element.innerText=data[i][j];
                        row.appendChild(element);
                    }
                    table.appendChild(row);
                }
            }

            //table.querySelector('#'+UID+'_titlecell').setAttribute("colspan", table_cols);
            fitty('#'+UID+'_titlecell');
            div.appendChild(table);
            return div;
        },
        enableFitty: function(UID) {
            fitty('#'+UID+'_title');
        }
    },
    display: {
        create: function(name, value, footnote, UID, classes) {
            let div=document.createElement("div");
            div.setAttribute("id", UID);
            div.classList.add("r_display");
            if(classes!=undefined) {
                if(classes.length>0) {
                    classes.forEach(function(value){
                        div.classList.add(value);
                    });
                }
            }
            let header=document.createElement("p");
            header.textContent=name;
            header.classList.add("r_display_header");
            let text=document.createElement("p");
            text.textContent=value;
            text.setAttribute("id", UID+'_value');
            text.classList.add("r_display_value");
            
            div.appendChild(header);
            div.appendChild(text);
            if (footnote!=undefined) {
                let footer=document.createElement("p");
                footer.textContent=footnote;
                footer.classList.add("r_display_footer");
                div.appendChild(footer);
            }
            
            return div;
        },
        enableFitty: function(UID) {
            fitty('#'+UID+'_value');
        }

    },
    text: {
        create: function(value, UID, classes) {
            let div=document.createElement("div");
            div.setAttribute("id", UID);
            div.classList.add("r_text");
            if(classes!=undefined) {
                if(classes.length>0) {
                    classes.forEach(function(value){
                        div.classList.add(value);
                    });
                }
            }
            let text=document.createElement("p");
            text.setAttribute("id", UID+'_text');
            text.textContent=value;
            text.classList.add("r_text_value");
            div.appendChild(text);
            return div;
        },
        enableFitty: function(UID) {
            fitty('#'+UID+'_text');
        }
    },
    list: {
        create: function(title, data, UID, classes) {
            let listContainer=document.createElement('div');

            let chartTitle=document.createElement('p');
            chartTitle.innerText=title;
            chartTitle.classList.add('r_chart_title');
            chartTitle.setAttribute('id', UID+'_title');
            let chartTitleContainer=document.createElement('div');
            chartTitleContainer.classList.add('r_chart_title_container');
            chartTitleContainer.appendChild(chartTitle);

            listContainer.appendChild(chartTitleContainer);

            let listElementContainer=document.createElement("div");

            if(data!=undefined) {
                if(data.length>0) {
                    data.forEach(function(dataElement){
                        if(dataElement.group==undefined || dataElement.name==undefined || dataElement.score==undefined) {
                            debugger;
                            return;
                        }
                        let element=document.createElement("div");
                        element.classList.add("list_element");


                        let group=document.createElement("p");
                        group.classList.add("list_element_group");
                        group.innerText=dataElement.group;

                        let name=document.createElement("p");
                        name.classList.add("list_element_name");
                        name.innerText=dataElement.name;

                        let score=document.createElement("p");
                        score.classList.add("list_element_score");
                        score.innerText=dataElement.score;

                        element.appendChild(group);
                        element.appendChild(name);
                        element.appendChild(score);
                        
                        listElementContainer.appendChild(element);
                    });
                }
                //else {return undefined;}
            }
            //else {return undefined;}
            listContainer.appendChild(listElementContainer);
            
            listContainer.setAttribute("id", UID);
            listContainer.classList.add("r_list");
            if(classes!=undefined) {
                if(classes.length>0) {
                    classes.forEach(function(value){
                        listContainer.classList.add(value);
                    });
                }
            }
            return listContainer;
        },
        enableFitty: function(UID) {
            fitty('#'+UID+'_title');
        }
    },
    warning: {
        create: function(value, UID, classes) {
            let div=document.createElement("div");
            div.setAttribute("id", UID);
            div.classList.add("r_warning");
            if(classes!=undefined) {
                if(classes.length>0) {
                    classes.forEach(function(value){
                        div.classList.add(value);
                    });
                }
            }
            let icon=document.createElement("div");
            icon.classList.add("r_warning_icon");
            icon.innerHTML=`<svg width="50.8mm" height="50.8mm" version="1.1" viewBox="0 0 50.8 50.8" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(0,-246.2)">
                        <path d="m25.525 250.97a2.6461 2.6461 0 0 0-0.26511 0 2.6461 2.6461 0 0 0-2.1502 1.3204l-20.164 34.924a2.6461 2.6461 0 0 0 2.2908 3.9688h40.328a2.6461 2.6461 0 0 0 2.2908-3.9688l-20.164-34.924a2.6461 2.6461 0 0 0-2.1663-1.3208zm-0.16536 8.4264a2.6461 2.6461 0 0 1 2.6851 2.6836v12.699a2.6461 2.6461 0 1 1-5.2906 0v-12.699a2.6461 2.6461 0 0 1 2.6055-2.6836zm0 21.168a2.6461 2.6461 0 0 1 2.6851 2.682v0.26564a2.6461 2.6461 0 1 1-5.2906 0v-0.26564a2.6461 2.6461 0 0 1 2.6055-2.682z" style="fill:var(--svg-fgcolor)"/>
                    </g>
        </svg>`;
            let textWrapper=document.createElement("div");
            textWrapper.classList.add("r_warning_textwrapper");
            let text=document.createElement("p");
            text.setAttribute("id", UID+'_warning');
            text.innerHTML=value;
            text.classList.add("r_warning_value");
            div.appendChild(icon);
            textWrapper.appendChild(text);
            div.appendChild(textWrapper);
            
            return div;
        },
        enableFitty: function(UID) {
            fitty('#'+UID+'_warning', {multiLine: true});
        }
    },
    chart: {
        charts: [],
        chart: function(drawHandler, HTMLparameters, chartObject) {
            this.drawHandler=drawHandler;
            this.HTMLparameters=HTMLparameters;
            this.chartObject=chartObject;
        },
        enableChartRedraws: function() {
            window.addEventListener('resize', this.redrawCharts.redrawCharts);
            let ctime=new Date();
            this.redrawCharts.lastRedraw=ctime.getTime();

        },
        redrawCharts: {
            redrawTimer: undefined,
            lastRedraw: 0,
            redrawInterval: 300,
            redrawCharts: function() {
                let ctime=new Date();
                if((ctime.getTime()-render.chart.redrawCharts.lastRedraw)>render.chart.redrawCharts.redrawInterval) {
                    render.chart.redrawCharts.redrawTimer=setTimeout(function(){
                        render.chart.charts.forEach(function(chartObj){
                            chartObj.drawHandler(chartObj.HTMLparameters, chartObj.chartObject);
                        });
                    }, render.chart.redrawCharts.redrawInterval);
                    

                    render.chart.redrawCharts.lastRedraw=ctime.getTime();
                }
                
            }
        },
            
        clearChartUpdateList: function() {
            render.chart.charts=[];
            clearTimeout(render.chart.redrawCharts.redrawTimer);
        },
        colors: [
            '#1973BE',
            '#69CD28',
            '#FAA519',
            
            '#BED746',
            '#91C3EB',
            '#FFCD32',
            '#E6F0C3',
            '#C8EBFA',
            '#FFF0BE'
        ],
        pieChart: {
            create: function(headers, dataArray, optionsobject) {
                if(headers.length==2 /*&& data.length==2*/) {
                    var data = new google.visualization.DataTable();
                    headers.forEach(function(header) {
                        data.addColumn(header.type, header.name);
                    })
                    data.addRows(dataArray);
                    if(optionsobject==undefined) {
                        var optionsobject = {
                        'width':'setByContainer',
                        'height':'setByContainer',
                        'pieHole': 0.7,
                        'pieStartAngle': 100
                    };
                    }
                    // Instantiate and draw our chart, passing in some options.
                    return {'options': optionsobject, 'data':data};
                }
            },
            draw: function(title, chartObject, container, UID, classes) {
                let chartContainer=document.createElement('div');
                chartContainer.setAttribute('id', UID);
                chartContainer.classList.add("r_chart");
                if(classes!=undefined) {
                    if(classes.length>0) {
                        classes.forEach(function(value){
                            chartContainer.classList.add(value);
                        });
                    }
                }
                container.appendChild(chartContainer);
                let HTMLparameters={
                    wrapperElement: container, 
                    UID:UID, 
                    chartContainer:chartContainer
                };
                let chart=render.chart.pieChart.GCDraw(
                    HTMLparameters,
                    chartObject
                );
                
                render.chart.charts.push(new render.chart.chart(
                    render.chart.pieChart.GCDraw,
                    HTMLparameters,
                    chartObject
                ));


                return new Promise((resolve)=>{
                    google.visualization.events.addListener(chart, 'ready', resolve);
                });
            },
            GCDraw: function(HTMLparameters, chartObject) {
                if (chartObject.options.widthSrc=='setByContainer') {
                    chartObject.options.width=HTMLparameters.chartContainer.offsetWidth;
                }
                if (chartObject.options.widthSrc=='setByContainer') {
                    chartObject.options.height=1.3*chartObject.options.width;
                }
                
                var chart=new google.visualization.PieChart(HTMLparameters.chartContainer);

                
                chart.draw(chartObject.data, chartObject.options);
                return chart;
            }
        },
        barGraph: {
            create: function(headers, dataArray, optionsobject) {
                if(headers.length /*&& data.length==2*/) {
                    let dataArr=[
                        headers
                    ];
                    dataArray.forEach(function(row){
                        dataArr.push(row);
                    });
                    var data = google.visualization.arrayToDataTable(dataArr);

                    if(optionsobject==undefined) {
                        var optionsobject = {
                        'width':'setByContainer',
                        'height':'setByContainer',
                    };
                    }
                    return {'options': optionsobject, 'data':data};
                }
            },
            draw: function(title, chartObject, container, UID, classes) {
                let chartContainer=document.createElement('div');
                let chartTitle=document.createElement('p');
                chartTitle.innerText=title;
                chartTitle.classList.add('r_chart_title');
                chartTitle.setAttribute('id', UID+'_title');
                let chartTitleContainer=document.createElement('div');
                chartTitleContainer.classList.add('r_chart_title_container');
                chartTitleContainer.appendChild(chartTitle);
                container.appendChild(chartTitleContainer);
                chartContainer.setAttribute('id', UID);
                chartContainer.classList.add("r_chart");
                if(classes!=undefined) {
                    if(classes.length>0) {
                        classes.forEach(function(value){
                            chartContainer.classList.add(value);
                        });
                    }
                }
                container.appendChild(chartContainer);
                let HTMLparameters={
                    wrapperElement: container, 
                    UID:UID, 
                    chartContainer:chartContainer
                };
                let chart=render.chart.barGraph.GCDraw(
                    HTMLparameters,
                    chartObject
                );
                
                render.chart.charts.push(new render.chart.chart(
                    render.chart.barGraph.GCDraw,
                    HTMLparameters,
                    chartObject
                ));
                return new Promise((resolve)=>{
                    google.visualization.events.addListener(chart, 'ready', resolve);
                });

                
            },
            GCDraw: function(HTMLparameters, chartObject) {
                if (chartObject.options.widthSrc=='setByContainer') {
                    chartObject.options.width=HTMLparameters.chartContainer.offsetWidth;
                }
                if (chartObject.options.widthSrc=='setByContainer') {
                    chartObject.options.height=1.3*chartObject.options.width;
                }
                
                var chart=new google.visualization.BarChart(HTMLparameters.chartContainer);

                chart.draw(chartObject.data, chartObject.options);
                //debugger;
                return chart;
            },
            enableFitty: function(UID) {
                fitty('#'+UID+'_title');
            }
        },
        lineGraph: {
            create: function(headers, dataArray, optionsobject) {
                if(headers.length) {
                    var data = new google.visualization.DataTable();
                    headers.forEach(function(header) {
                        data.addColumn(header.type, header.name);
                    })
                    data.addRows(dataArray);

                    if(optionsobject==undefined) {
                        var optionsobject = {
                        'width':'setByContainer',
                        'height':'setByContainer',
                        'curveType': 'function',
                        'legend': { position: 'bottom' }
                    };
                    }
                    // Instantiate and draw our chart, passing in some options.
                    return {'options': optionsobject, 'data':data};
                }
                /*var data = google.visualization.arrayToDataTable([
                    ['Year', 'Sales', 'Expenses'],
                    ['2004',  1000,      400],
                    ['2005',  1170,      460],
                    ['2006',  660,       1120],
                    ['2007',  1030,      540]
                  ]);
          
                  var options = {
                    title: 'Company Performance',
                    curveType: 'function',
                    legend: { position: 'bottom' }
                  };
                return {'options': options, 'data':data};*/
            },
            draw: function(title, chartObject, container, UID, classes) {
                let chartContainer=document.createElement('div');
                let chartTitle=document.createElement('p');
                chartTitle.innerText=title;
                chartTitle.classList.add('r_chart_title');
                chartTitle.setAttribute('id', UID+'_title');
                let chartTitleContainer=document.createElement('div');
                chartTitleContainer.classList.add('r_chart_title_container');
                chartTitleContainer.appendChild(chartTitle);
                container.appendChild(chartTitleContainer);
                chartContainer.setAttribute('id', UID);
                chartContainer.classList.add("r_chart");
                if(classes!=undefined) {
                    if(classes.length>0) {
                        classes.forEach(function(value){
                            chartContainer.classList.add(value);
                        });
                    }
                }
                container.appendChild(chartContainer);

                let HTMLparameters={
                    wrapperElement: container, 
                    UID:UID, 
                    chartContainer:chartContainer
                };


                let chart=render.chart.lineGraph.GCDraw(
                    HTMLparameters,
                    chartObject
                );
                
                render.chart.charts.push(new render.chart.chart(
                    render.chart.lineGraph.GCDraw,
                    HTMLparameters,
                    chartObject
                ));

                return new Promise((resolve)=>{
                    google.visualization.events.addListener(chart, 'ready', resolve);
                });
            },
            GCDraw: function(HTMLparameters, chartObject) {
                if (chartObject.options.widthSrc=='setByContainer') {
                    chartObject.options.width=HTMLparameters.chartContainer.offsetWidth;
                }
                if (chartObject.options.widthSrc=='setByContainer') {
                    chartObject.options.height=0.6*chartObject.options.width;
                    if(chartObject.options.height>800){
                        chartObject.options.height=600;
                    }
                }
                
                var chart=new google.visualization.LineChart(HTMLparameters.chartContainer);

                chart.draw(chartObject.data, chartObject.options);
                return chart;
            },
            enableFitty: function(UID) {
                fitty('#'+UID+'_title');
            }
        },
        chartTitle: {
            create: function(title, container, UID) {
                let chartContainer=document.createElement('div');
                let chartTitle=document.createElement('p');
                chartTitle.innerText=title;
                chartTitle.classList.add('r_chart_title');
                chartTitle.setAttribute('id', UID+'_title');
                let chartTitleContainer=document.createElement('div');
                chartTitleContainer.classList.add('r_chart_title_container');
                chartTitleContainer.appendChild(chartTitle);
                container.appendChild(chartTitleContainer);
                container.appendChild(chartContainer);
            }
        }
    }
}