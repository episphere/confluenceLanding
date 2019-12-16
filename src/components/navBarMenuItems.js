const template = () => {
    return `
        
        <div class="nav-item  grid-elements">
            <a class="nav-link nav-menu-links" href="#" title="Explore Data" id="dataSummary"><i class="fas fa-chart-bar"></i> Explore Data</a>
        </div>
        
        <div class="nav-item  grid-elements">
            <a class="nav-link nav-menu-links" href="#" title="Submit Data" id="dataSubmission"><i class="fas fa-upload"></i>Submit Data</a>
        </div>
        <div id="governanceNav"></div>
        <div id="myProjectsNav"></div>
        
        <div class="nav-item  pages-coming-soon grid-elements">
            <a class="nav-link nav-menu-links" href="#" title="Request Data" id="dataRequest"><i class="fas fa-database"></i>Request Data</a>
        </div>
        
        <div class="nav-item  pages-coming-soon grid-elements">
            <a class="nav-link nav-menu-links" href="#" title="Analyze Data" id="dataAnalysis"><i class="fas fa-database"></i>Analyze Data</a>
        </div>
        
        <div class="navbar-nav ml-auto">
            
            ${localStorage.parms && JSON.parse(localStorage.parms).name ? `
                <div class="nav-item  grid-elements dropdown">
                    <a class="nav-link nav-menu-links dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-user"></i> ${JSON.parse(localStorage.parms).name}
                    </a>
                    <div class="dropdown-menu navbar-dropdown" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item nav-link nav-menu-links" href="#" id="logOutBtn"><i class="fas fa-sign-out-alt"></i> Log Out</a>
                    </div>
                </div>
            ` : `
                <div class="nav-item grid-elements">
                    <a class="nav-link nav-menu-links" href="#" id="logOutBtn"><i class="fas fa-sign-out-alt"></i> Log Out</a>
                </div>
            `}
            
        </div>
    `;
}

export default template;
