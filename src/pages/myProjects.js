import { getFolderItems, getFileInfo, getFileVersions } from "../shared.js";
import { fileVersionsModal } from "../components/modal.js";

export const myProjectsTemplate = async (data) => {
    let template = `
        <div class="my-projects-div"><ul class="ul-list-style first-list-item">`;
    for(let i = 0 ; i < data.length; i++) {
        let name = data[i].name;
        let type = data[i].type;
        let liClass = type === 'folder' ? 'collapsible consortia-folder' : '';
        let expandClass = type === 'folder' ? 'fas fa-folder-plus' : 'fas fa-file-alt';
        let title = type === 'folder' ? 'Expand / Collapse' : '';
        template += `<li><a class="${liClass}" href="#"><i title="${title}" class="${expandClass}"></i></a> ${name}</li>`;
        if(type === 'folder'){
            template += '<ul class="ul-list-style content">';
            const response = await getFolderItems(data[i].id);
            const files = response.entries;
            for(let obj of files){
                const fileInfo = await getFileInfo(obj.id);
                type = obj.type;
                if(obj.type !== 'file') return;
                name = obj.name.slice(0, obj.name.lastIndexOf('.'));
                expandClass = type === 'folder' ? 'fas fa-folder-plus' : 'fas fa-file-alt';
                title = type === 'folder' ? 'Expand / Collapse' : '';
                template += `<li>
                        <table class="table table-bordered table-striped my-projects-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>File id</th>
                                    <th>Created by</th>
                                    <th>Created at</th>
                                    <th>Last modified by</th>
                                    <th>Last modified at</th>
                                    <th>Latest version id</th>
                                    <th>API</th>
                                    <th>Older versions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${name}</td>
                                    <td>${fileInfo.id} <a href="#" class="copy-file-api" title="Copy file id" data-file-id="${obj.id}"><i class="far fa-copy"></i></a></td>
                                    <td>${fileInfo.created_by.name || fileInfo.created_by.login}</td>
                                    <td>${new Date(fileInfo.created_at).toLocaleString()}</td>
                                    <td>${fileInfo.modified_by.name || fileInfo.modified_by.login}</td>
                                    <td>${new Date(fileInfo.modified_at).toLocaleString()}</td>
                                    <td>${fileInfo.file_version.id} <a href="#" class="copy-file-api" title="Copy version id" data-version-id="${fileInfo.file_version.id}"><i class="far fa-copy"></i></a></td>
                                    <td><a href="#" class="copy-file-api" title="Copy API" data-file-id="${obj.id}" data-version-id="${fileInfo.file_version.id}"><i class="far fa-copy"></i></a></td>
                                    <td><a data-toggle="modal" data-target="#modalFileVersions" href="#" class="getAllFileversions" data-file-id="${obj.id}" data-file-name="${name}">See old versions</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </li>`
            }
            template += '</ul>'
        }
    }
    template += `</ul>${fileVersionsModal()}</div>`;
    return template;
}

export const expandProjects = () => {
    let collapsible = document.getElementsByClassName('collapsible');
    Array.from(collapsible).forEach(element => {
        element.addEventListener('click', () => {
            element.classList.toggle('.active');
            var content = element.parentNode.nextElementSibling;
            if (content.style.maxHeight){
                content.style.maxHeight = null;
                element.getElementsByClassName('fa-folder-minus')[0].classList.add('fa-folder-plus');
                element.getElementsByClassName('fa-folder-minus')[0].classList.remove('fa-folder-minus');
            } else {
                element.getElementsByClassName('fa-folder-plus')[0].classList.add('fa-folder-minus');
                element.getElementsByClassName('fa-folder-plus')[0].classList.remove('fa-folder-plus');
                content.style.maxHeight = "1000px";
            } 
        })
    });
    
    let consortiaFolder = document.getElementsByClassName('consortia-folder');
    Array.from(consortiaFolder).forEach(element => {
        element.dispatchEvent(new Event('click'));
    });
}