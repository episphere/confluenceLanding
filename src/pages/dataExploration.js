import { getFolderItems, getFile, hideAnimation, showError, disableCheckBox, convertTextToJson, uploadFile, filterConsortiums, filterProjects } from "../shared.js";
import { studyDropDownTemplate } from "../components/elements.js";
import { txt2dt, getFileContent } from "../visulization.js";
import { addEventStudiesCheckBox, addEventDataTypeCheckBox, addEventSearchDataType, addEventSearchStudies, addEventSelectAllStudies, addEventSelectAllDataType, addEventDataGovernanceNavBar, addEventMyProjects } from "../event.js";

export const template = () => {
    return `
        <div class="main-summary-row">
            <div class="row chart-interaction-msg" id="chartInteractionMsg"></div>
            <div class="main-summary-row dynamic-charts">
                <div class="summary-inner-col col-md-3">
                    <div id="chartDiv7">
                        <span class="data-summary-label-wrap"><label class="dataSummary-label" id="dataSummaryVizLabel7"></label></span>
                        <div class="dataSummary-chart" id="dataSummaryVizChart7"></div>
                        <span class="data-summary-label-wrap"><label class="dataSummary-label" id="dataSummaryVizLabel7"></label><label class="dataSummary-selected-range" id="selectedRange7"></label></span>
                    </div>
                </div>
                <div class="summary-inner-col col-md-3">
                    <div id="chartDiv1">
                        <span class="data-summary-label-wrap"><label class="dataSummary-label" id="dataSummaryVizLabel1"></label></span>
                        <div class="dataSummary-chart" id="dataSummaryVizChart1"></div>
                        <span class="data-summary-label-wrap"><label class="dataSummary-label" id="dataSummaryVizLabel1"></label><label class="dataSummary-selected-range" id="selectedRange1"></label></span>
                    </div>
                </div>
                <div class="summary-inner-col col-md-3">
                    <div id="chartDiv2">
                        <span class="data-summary-label-wrap"><label class="dataSummary-label" id="dataSummaryVizLabel2"></label></span>
                        <div class="dataSummary-chart" id="dataSummaryVizChart2"></div>
                        <span class="data-summary-label-wrap"><label class="dataSummary-label" id="dataSummaryVizLabel2"></label><label class="dataSummary-selected-range" id="selectedRange2"></label></span>
                    </div>
                </div>
                <div class="summary-inner-col col-md-3">
                    <div id="chartDiv5">
                        <span class="data-summary-label-wrap"><label class="dataSummary-label" id="dataSummaryVizLabel5"></label></span>
                        <div class="dataSummary-chart" id="dataSummaryVizChart5"></div>
                        <span class="data-summary-label-wrap"><label class="dataSummary-selected-range" id="selectedRange5"></label></span>
                    </div>
                </div>
            </div>

            <div class="main-summary-row dynamic-charts">
                <div class="summary-inner-col col-md-4">
                    <div id="chartDiv3">
                        <span class="data-summary-label-wrap"><label class="dataSummary-label" id="dataSummaryVizLabel3"></label></span>
                        <div class="dataSummary-chart" id="dataSummaryVizChart3"></div>
                        <span class="data-summary-label-wrap"><label class="dataSummary-label" id="dataSummaryVizLabel3"></label><label class="dataSummary-selected-range" id="selectedRange3"></label></span>
                    </div>
                </div>
                <div class="summary-inner-col col-md-4">
                    <div id="chartDiv6">
                        <span class="data-summary-label-wrap"><label class="dataSummary-label" id="dataSummaryVizLabel6"></label></span>
                        <div class="dataSummary-chart" id="dataSummaryVizChart6"></div>
                        <span class="data-summary-label-wrap"><label class="dataSummary-label" id="dataSummaryVizLabel6"></label><label class="dataSummary-selected-range" id="selectedRange6"></label></span>
                    </div>
                </div>
                <div class="summary-inner-col col-md-4">
                    <div id="chartDiv4">
                        <span class="data-summary-label-wrap"><label class="dataSummary-label" id="dataSummaryVizLabel4"></label></span>
                        <div class="dataSummary-chart" id="dataSummaryVizChart4"></div>
                        <span class="data-summary-label-wrap"><label class="dataSummary-label" id="dataSummaryVizLabel4"></label><label class="dataSummary-selected-range" id="selectedRange4"></label></span>
                    </div>
                </div>
            </div>
        </div>
    `;  
}

export const getSummary = async () => {
    const response = await getFolderItems(0);
    const array = filterConsortiums(response.entries);
    const projectArray = filterProjects(response.entries);

    if(array.length > 0 && projectArray.length > 0){
        document.getElementById('governanceNav').innerHTML = `
            
            <div class="nav-item  grid-elements">
                <a class="nav-link nav-menu-links" href="#" title="Govern Data" id="dataGovernance"><i class="fas fa-database"></i> Data Governance</a>
            </div>
        `;
        document.getElementById('myProjectsNav').innerHTML = `
            
            <div class="nav-item  grid-elements">
                <a class="nav-link nav-menu-links" href="#" title="My Projects" id="myProjects"><i class="fas fa-project-diagram"></i> My Projects</a>
            </div>
        `;
        addEventDataGovernanceNavBar(true);
        addEventMyProjects(projectArray);
    }
    else if(array.length > 0) {
        document.getElementById('governanceNav').innerHTML = `
            
            <div class="nav-item  grid-elements">
                <a class="nav-link nav-menu-links" href="#" title="Data Governance" id="dataGovernance"><i class="fas fa-database"></i> Data Governance</a>
            </div>
        `;
        addEventDataGovernanceNavBar();
    }
    else if(projectArray.length > 0){
        document.getElementById('myProjectsNav').innerHTML = `
            
            <div class="nav-item  grid-elements">
                <a class="nav-link nav-menu-links" href="#" title="My Projects" id="myProjects"><i class="fas fa-project-diagram"></i> My Projects</a>
            </div>
        `;
        addEventMyProjects(projectArray);
        // else{
        //     document.getElementById('governanceNav').innerHTML = `
        //         <div class="nav-item grid-elements">
        //             <a class="nav-link nav-menu-links" href="#" title="Govern Data" id="dataGovernance"><i class="fas fa-database"></i> Data Governance</a>
        //         </div>
        //         
        //     `;
        //     addEventDataGovernanceNavBar();
        //     const newFolder = await createFolder(0, 'BCAC');
        //     consortiaId = parseInt(newFolder.id);
        //     dataObject[consortiaId] = {};
        //     dataObject[consortiaId].studyEntries = {};
        //     dataObject[consortiaId].name = 'BCAC';
        //     dataObject[consortiaId].type = 'folder';
        //     // localStorage.data_summary = JSON.stringify(dataObject);
        //     hideAnimation();
        // }
    }
    
    // // generateConfluenceSummaryLevelData();

    // document.getElementById('consortiaCount').innerHTML = Object.keys(JSON.parse(localStorage.data_summary)).length;
    // const consortiaOptions = document.getElementById('consortiaOption');
    // consortiaOptions.innerHTML = renderConsortium();
    // const consortiaCheckBox = document.getElementsByName('consortiaCheckBox');
    // Array.from(consortiaCheckBox).forEach((element) => {
    //     element.addEventListener('click', () => {
    //         if(element.value === "") return;
    //         countSpecificStudy(parseInt(element.value));
    //     });
    // });
    // consortiaOptions.hidden = false;

    // consortiaCheckBox[0].checked = true;
    // consortiaCheckBox[0].dispatchEvent(new Event('click'));
    // getAgeDataForAllStudies(studyEntries);
    getFileContent();
}

const generateConfluenceSummaryLevelData = async () => {
    const fs = JSON.parse(localStorage.data_summary);
    const obj = {};
    const sentries = fs[89412660666].studyEntries;
    for(const data in sentries){
        const dentries = sentries[data].dataEntries;
        for(let ds in dentries){
            const fileEntries = dentries[ds].fileEntries;
            for(const id in fileEntries){
                obj[id] = {};
                obj[id].name = fileEntries[id].name;
                obj[id].type = 'file';
            }
        }
    }
    
    const jsonData = await convertTextToJson(obj);
    
    const summaryData = jsonData.map(data => { return { BCAC_ID: data.BCAC_ID, status: data.status, ageInt: data.ageInt, ethnicityClass: data.ethnicityClass, famHist: data.famHist, fhnumber: data.fhnumber, study: data.study, ER_statusIndex: data.ER_statusIndex}})
    uploadFile(summaryData, 'summary_data.json', 92639258921);
}

export const countSpecificStudy = (folderId) => {
    const studyOption = document.getElementById('studyOption');
    studyOption.hidden = false;
    let dataObject = JSON.parse(localStorage.data_summary);
    let studyEntries = '';
    if(dataObject[folderId]){
        studyEntries = dataObject[folderId].studyEntries;
        let studiesList = document.getElementById('studiesList');
        studiesList.innerHTML = studyDropDownTemplate(studyEntries, 'studyOptions');
        document.getElementById('studyCount').textContent = Object.keys(studyEntries).length
    };

    addEventStudiesCheckBox(dataObject, folderId);

    // Select first study by default and trigger event
    const studiesCheckBox = document.getElementsByName('studiesCheckBox');
    let index = 0;
    if(Object.keys(dataObject[folderId].studyEntries).length === 0 ) {
        hideAnimation();
        return;
    }
    if(dataObject[folderId].studyEntries && Object.keys(dataObject[folderId].studyEntries[studiesCheckBox[index].value].dataEntries).length > 0){
        studiesCheckBox[index].checked = true;
        studiesCheckBox[index].dispatchEvent(new Event('click'));
    }
    else{
        studiesCheckBox[index].checked = true;
        showError('No Data Found in this study!');
        hideAnimation();
    }
    addEventSearchStudies();

    addEventSelectAllStudies(studyEntries);
};

export const countSpecificData = async (selectedValues, studyEntries) => {
    const dataDropDown = document.getElementById('dataDropDown');
    dataDropDown.hidden = false;
    let template = '';
    let dataCounter = 0;
    let checker_obj = {};

    selectedValues.forEach(studyId => {
        const intStudyId = parseInt(studyId);
        if(studyEntries[intStudyId]){
            if(selectedValues.length === 1 && Object.keys(studyEntries[intStudyId].dataEntries).length === 0) {
                showError('No Data Found in this study!');
                hideAnimation();
                disableCheckBox(false); 
                return;
            }
            const dataEntries = studyEntries[intStudyId].dataEntries;
            dataCounter += Object.keys(dataEntries).length;
            for(let dataId in dataEntries){
                if(checker_obj[dataEntries[dataId].name.toLowerCase().trim()]) return;
                checker_obj[dataEntries[dataId].name.toLowerCase().trim()] = {};
                template += `<li>
                                <label><input type="checkbox" class="chk-box-margin" name="dataTypeCheckBox" data-study-id="${selectedValues.toString()}" value="${dataEntries[dataId].name}"/>${dataEntries[dataId].name}</label>
                            </li>`;
            }
        }
    });

    let dataTypeList = document.getElementById('dataTypeList');
    dataTypeList.innerHTML = template;

    // Add event listener to data type check box list
    addEventDataTypeCheckBox(studyEntries);
    addEventSelectAllDataType(studyEntries);
    
    // Select first data type by default and trigger event
    if(selectedValues.length > 0){
        const dataTypeCheckBox = document.getElementsByName('dataTypeCheckBox');
        dataTypeCheckBox[0] ? dataTypeCheckBox[0].checked = true : showError('No Data Found in this study!');
        dataTypeCheckBox[0] ? dataTypeCheckBox[0].dispatchEvent(new Event('click')) : '';
    }else{
        document.getElementById('dataDropDown').hidden = true;
    }
    
    document.getElementById('dataCount').textContent = dataCounter;
    
    // Data type search/filter Event
    addEventSearchDataType();
};

const getAgeDataForAllStudies = async (studyEntries) => {
    let obj = {
        age:[],
        ethnicity : []
    }
    for(const study of studyEntries){
        const studyId = study.id;
        const folderData = await getFolderItems(studyId);
        const folderEntries = folderData.entries;
        
        for(const data of folderEntries){
            if(data.name.toLowerCase().trim() === 'core data'){
                const dataId = data.id;
                const dataContent = await getFolderItems(dataId);
                const dataEntries = dataContent.entries;
                for(const fileData of dataEntries){
                    const fileId = fileData.id;
                    const fileContent = await getFile(fileId);
                    const fileDt = txt2dt(fileContent).tab;
                    obj.age = obj.age.concat(fileDt.ageInt);
                    obj.ethnicity = obj.ethnicity.concat(fileDt.ethnicityClass)
                };
            };
        };
    };
};

export const clearGraphAndParameters = () => {
    document.getElementById('dataSummaryVizBarChart').innerHTML = '';
    document.getElementById('dataSummaryVizPieChart').hidden = true;
    document.getElementById('dataSummaryVizChart2').innerHTML = '';
//     document.getElementById('dataSummaryParameter').hidden = true;
    document.getElementById('barChartLabel').innerHTML = '';
    document.getElementById('pieChartLabel').innerHTML = '';
    document.getElementById('statusPieChart').innerHTML = '';
    // document.getElementById('showPieChart').style.display = 'none';
}

export const unHideDivs = () => {
    document.getElementById('dataSummaryVizPieChart').hidden = false;
//     document.getElementById('dataSummaryParameter').hidden = false;
}
