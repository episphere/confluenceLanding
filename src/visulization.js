import { hideAnimation, getFileJSON } from './shared.js';
import { variables } from './variables.js';

const unique = arr => {
    let u={}
    arr.forEach(v=>{
        if(v=='888'||v=='777'||v==""){v=undefined} // 888 undefined code
        if(!u[v]){u[v]=0}
        u[v]++
    })
    return u
}

export const txt2dt = txt => {
    let dt = txt.split(/\n/g).map(tx => tx.split(/\t/g))
    // trailing blank
    if((txt.split(/\n+/).slice(-1).length == 1) && (txt.slice(-1)[0].length)){
        dt.pop()
    }
    let tab = {}
    let hh = dt[0].forEach((h,j)=>{ // headers
        tab[h] = []
        dt.slice(1).forEach((vv,i)=>{
            tab[h][i] = vv[j]
        })
    });

    let uni = {}
    Object.keys(tab).forEach(k => {
        uni[k] = unique(tab[k])
    })
    return {
        tab:tab,
        uni:uni
    }
};

export const getData = (studyEntries, studyIds, values) => {
    let allIds = {};
    studyIds.forEach(id => {
        const dataEntries = studyEntries[parseInt(id)].dataEntries;
        let selectedDataIds = [];
        values.forEach(value => {
            const selectedDataEntries = Object.keys(dataEntries).filter(key => dataEntries[key].name === value);
            if(selectedDataEntries.length > 0) selectedDataIds.push(parseInt(selectedDataEntries[0]));
        });

        selectedDataIds.forEach(dataId => {
            let fileEntries = dataEntries[dataId].fileEntries;
            allIds = {...allIds, ...fileEntries};
        });
    });
    getFileContent(allIds);
}

export const getFileContent = async (allIds) => {
    // const jsonData = await convertTextToJson(allIds);
    const jsonData = await getFileJSON(558252350024, JSON.parse(localStorage.parms).access_token); // Get summary level data
    const cf = getCrossFilter(jsonData);
    // let parameterList = document.getElementById('parameterList');
    // parameterList.innerHTML = parameterListTemplate();
    // addEventVariableItem(cf, jsonData);
    // document.getElementById('showAllVariables').innerHTML = '<a href="#" id="toggleVariable">Show All <i class="fas fa-caret-down"></i></a>'
    // addEventShowAllVariables(cf, jsonData);
    // document.getElementById('showPieChart').innerHTML = '<input type="checkbox"> Show pie chart'
    // addEventShowPieChart(cf, jsonData);
    
    
    generateBarChart(cf, jsonData, 'ageInt', 'dataSummaryVizChart3', 'dataSummaryVizLabel3', 'selectedRange3', 'chartDiv3');

    dc.config.defaultColors(d3.schemePaired);
    renderPieChart(cf, jsonData, 'consortium', 'dataSummaryVizChart7', 'dataSummaryVizLabel7', 'selectedRange7', 'chartDiv7');
    generateBarSingleSelect(cf, 'famHist', 'dataSummaryVizChart6', 'dataSummaryVizLabel6', 'selectedRange6', 'chartDiv6')
    dc.config.defaultColors(d3.schemePastel1);
    renderPieChart(cf, jsonData, 'Study', 'dataSummaryVizChart1', 'dataSummaryVizLabel1', 'selectedRange1', 'chartDiv1');
    dc.config.defaultColors(d3.schemeSet2);
    renderPieChart(cf, jsonData, 'status', 'dataSummaryVizChart2', 'dataSummaryVizLabel2', 'selectedRange2', 'chartDiv2');
    dc.config.defaultColors(d3.schemeBrBG[8]);
    renderPieChart(cf, jsonData, 'ER_statusIndex', 'dataSummaryVizChart4', 'dataSummaryVizLabel4', 'selectedRange4', 'chartDiv4');
    dc.config.defaultColors(d3.schemeSet3);
    renderPieChart(cf, jsonData, 'ethnicityClass', 'dataSummaryVizChart5', 'dataSummaryVizLabel5', 'selectedRange5', 'chartDiv5');
    // document.getElementById('chartInteractionMsg').innerHTML = `<i class="fas fa-info-circle"></i> Click on chart(s) for interaction!`;
    // setTimeout(() => document.getElementById('chartInteractionMsg').innerHTML = ``, 5000);
    hideAnimation();
};

export const generateBarChart = (cf, jsonData, parameter, id, labelID, rangeLabelID, chartDiv) => {
    document.getElementById(chartDiv).classList.add('background-white');
    let barChart = dc.barChart(`#${id}`);
    const { min, max } = getMinMax(jsonData, parameter);
    let age = cf.dimension(function(d) {return d[parameter] ? d[parameter] : ""});
    let ageCount = age.group().reduceCount();
    barChart.dimension(age)
        .group(ageCount)
        .x(d3.scaleLinear().domain([min, max]))
        .yAxisLabel(function(){
            return `Count (${barChart.data()[0].domainValues.map(d=>d.y).reduce((a,b)=>a+b)})`
        })
        .elasticY(true)
        .render();

    barChart.on('filtered', function(chart) {
        const filters = chart.filters();
        if(filters.length) {
            const range = filters[0];
            const bottomRange = Math.ceil(range[0]);
            const topRange = Math.ceil(range[1]);
            document.getElementById(rangeLabelID).innerHTML = `<button class="filter-btn"><i class="fas fa-filter"></i> ${bottomRange} - ${topRange} years </button>`;
            // const filterBtn = document.getElementsByClassName('filter-btn');
            // Array.from(filterBtn).forEach(btn => {
            //     btn.addEventListener('click', () => {
            //         chart.filter(null);
            //     })
            // });
        }else{
            document.getElementById(rangeLabelID).innerHTML = ``;
        }
    });
    document.getElementById(labelID).innerHTML = `${variables.BCAC[parameter]['label']}`;
    // unHideDivs();
    // disableCheckBox(false);
}

const generateBarSingleSelect = (cf, parameter, id, labelID, rangeLabelID, chartDiv) => {
    document.getElementById(chartDiv).classList.add('background-white');
    let rowChart = dc.rowChart(`#${id}`);
    let age = cf.dimension(function(d) {return d[parameter] ? d[parameter] : ""});
    let ageCount = age.group().reduceSum(function(d) {return +1});
    
    rowChart
        .dimension(age)
        .group(ageCount)
        .x(d3.scaleBand())
        .gap(5)
        .elasticX(true)
        .colorAccessor(function (d, i){return i;})
        .label(function(c){
            return `${c.key} (${c.value})`
        })
        .render()

    rowChart.on('filtered', function(chart) {
        const filters = chart.filters();
        if(filters.length) {
            let selection = '';
            filters.forEach((dt) => {
                selection += `<button class="filter-btn"><i class="fas fa-filter"></i> ${dt} </button>`
            });
            document.getElementById(rangeLabelID).innerHTML = selection;
            // const filterBtn = document.getElementsByClassName('filter-btn');
            // Array.from(filterBtn).forEach(btn => {
            //     btn.addEventListener('click', () => {
            //         chart.filter(null);
            //     })
            // });
        }else{
            document.getElementById(rangeLabelID).innerHTML = ``;
        }
    });

    document.getElementById(labelID).innerHTML = `${variables.BCAC[parameter]['label']}`;
}

const renderPieChart = (cf, jsonData, parameter, id, labelID, rangeLabelID, chartDiv) => {
    document.getElementById(chartDiv).classList.add('background-white');
    // let variableItem = document.getElementsByClassName('variableItem');
    // Array.from(variableItem).forEach(element => {
    //     if(element.innerHTML === parameter) {
    //         removeActiveClass('variableItem', 'active');
    //         element.classList.add('active');
    //     }
    // });
    let data_reduce = valUnique(parameter, 0, jsonData);

    // If there are less then 10 unique value render pie chart else render bar chart
    if(Object.keys(data_reduce).length < 10){
        // document.getElementById('showPieChart').childNodes[0].checked = false;
        // document.getElementById('showPieChart').style.display = 'none';
        document.getElementById(id).innerHTML = '';
        let pieChart = dc.pieChart(`#${id}`);
        let data = cf.dimension(function(d){return d[parameter] ? d[parameter] : ""});
        
        let G_status2 = data.group().reduce(
            function(p,v){
                data_reduce[v[parameter]] += 1
                return data_reduce[v[parameter]]
            },
            function(p,v){
                data_reduce[v[parameter]] -= 1
                return data_reduce[v[parameter]]
            },
            function(p){return 0}
        )
        pieChart.innerRadius(80)
            .dimension(data)
            .group(G_status2)
            .externalRadiusPadding(10)
            .label(function(c){
                return `${c.key} (${c.value})`
            });

        pieChart.render();
        pieChart.on('filtered', function(chart) {
            const filters = chart.filters();
            if(filters.length) {
                let selection = '';
                filters.forEach((dt) => {
                    selection += `<button class="filter-btn"><i class="fas fa-filter"></i> ${dt} </button>`
                });
                document.getElementById(rangeLabelID).innerHTML = selection;
                // const filterBtn = document.getElementsByClassName('filter-btn');
                // Array.from(filterBtn).forEach(btn => {
                //     btn.addEventListener('click', () => {
                //         chart.filter(null);
                //     })
                // });
            }else{
                document.getElementById(rangeLabelID).innerHTML = ``;
            }
        });
    }
    else{
        // document.getElementById('showPieChart').style.display = 'block';
        document.getElementById('dataSummaryVizChart2').innerHTML = '';
        const { min, max } = getMinMax(jsonData, parameter);
        let barChart = dc.barChart('#dataSummaryVizChart2');
        let age = cf.dimension(function(d) {return d[parameter] ? d[parameter] : "";});
        let ageCount = age.group().reduceCount();
        barChart.dimension(age)
            .group(ageCount)
            .x(d3.scaleLinear().domain([min, max]))
            .xAxisLabel(parameter)
            .yAxisLabel(function(){
                return `Count (${barChart.data()[0].domainValues.map(d=>d.y).reduce((a,b)=>a+b)})`
            })
            .elasticY(true);
        barChart.render();
    };
    
    let pieLabel = ''
    if(variables.BCAC[parameter] && variables.BCAC[parameter]['label']){
        pieLabel = variables.BCAC[parameter]['label'];
    }else{
        pieLabel = parameter;
    }
    document.getElementById(labelID).innerHTML = `${pieLabel}`;
}

const getCrossFilter = (jsonData) => crossfilter(jsonData);

const valUnique=function(k,v, jsonData){
    var u={}
    jsonData.forEach(d=>{
        if(d[k] === "") return;
        u[d[k]]=v
    })
    return u
}

const getMinMax = (jsonData, parameter) => {
    let values = [];
    jsonData.forEach(data => {
        if(data[parameter] && data[parameter] !== "" && data[parameter] !== "Don't Know"){
            values.push(parseInt(data[parameter]));
        }
    });
    return {min: Math.min(...values), max: Math.max(...values)}
}
