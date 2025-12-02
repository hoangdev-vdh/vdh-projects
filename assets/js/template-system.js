/**
 * PROJECT TEMPLATE GENERATOR
 * Tool để generate project pages mới một cách tự động
 */

const PROJECT_TEMPLATE = {
    // Template cho project page mới
    generateProjectPage: (projectData) => {
        return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectData.title} - Project Details</title>
    <link rel="stylesheet" href="../assets/css/main.css">
    <link rel="stylesheet" href="../assets/css/project-detail.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism-tomorrow.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Header Component -->
    <div id="header-placeholder"></div>

    <main class="main">
        <div class="container">
            <!-- Project Hero -->
            <section class="project-hero">
                <div class="project-hero-content">
                    <div class="project-breadcrumb">
                        <a href="../index.html"><i class="fas fa-home"></i> Home</a>
                        <span><i class="fas fa-chevron-right"></i></span>
                        <span>Projects</span>
                        <span><i class="fas fa-chevron-right"></i></span>
                        <span>${projectData.title}</span>
                    </div>
                    
                    <div class="project-title-section">
                        <div class="project-icon-hero">
                            <i class="${projectData.icon}"></i>
                        </div>
                        <div class="project-title-content">
                            <h1>${projectData.title}</h1>
                            <p class="project-tagline">${projectData.description}</p>
                            <div class="project-meta">
                                <span class="meta-item"><i class="fas fa-calendar"></i> ${projectData.date || 'December 2024'}</span>
                                <span class="meta-item"><i class="fas fa-code"></i> ${projectData.tech[0]}</span>
                                <span class="meta-item"><i class="fas fa-tag"></i> ${projectData.category || 'Web Scraping'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Project Overview -->
            <section class="project-section">
                <h2><i class="fas fa-info-circle"></i> Project Overview</h2>
                <div class="overview-grid">
                    <div class="overview-content">
                        <p>${projectData.overview || projectData.description}</p>
                        
                        <h3>Key Features:</h3>
                        <ul class="feature-list">
                            ${projectData.features ? projectData.features.map(feature => 
                                `<li><i class="fas fa-check"></i> ${feature}</li>`
                            ).join('') : '<li><i class="fas fa-check"></i> Advanced automation capabilities</li>'}
                        </ul>
                    </div>
                    
                    <div class="project-stats-panel">
                        ${projectData.stats ? projectData.stats.map((stat, index) => 
                            `<div class="stat-card">
                                <i class="fas fa-${['users', 'shield-virus', 'file-csv', 'check-circle'][index] || 'star'}"></i>
                                <span class="stat-number">${stat.split(' ')[0]}</span>
                                <span class="stat-label">${stat.split(' ').slice(1).join(' ')}</span>
                            </div>`
                        ).join('') : ''}
                    </div>
                </div>
            </section>

            <!-- Technical Implementation -->
            <section class="project-section">
                <h2><i class="fas fa-cogs"></i> Technical Implementation</h2>
                <div class="tech-showcase">
                    ${projectData.tech.map(tech => 
                        `<div class="tech-item">
                            <div class="tech-icon">
                                <i class="fab fa-${tech.toLowerCase()}"></i>
                            </div>
                            <h3>${tech}</h3>
                            <p>Advanced ${tech} implementation với modern best practices</p>
                        </div>`
                    ).join('')}
                </div>
            </section>

            <!-- Add more sections as needed -->

        </div>
    </main>

    <!-- Footer Component -->
    <div id="footer-placeholder"></div>

    <!-- Scripts -->
    <script src="../assets/js/components.js"></script>
    <script src="../assets/js/main.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/plugins/autoloader/prism-autoloader.min.js"></script>
</body>
</html>`;
    },

    // Configuration cho từng project type
    projectTypes: {
        webScraping: {
            icon: 'fas fa-spider',
            category: 'Web Scraping',
            defaultTech: ['Python', 'BeautifulSoup', 'Selenium'],
            defaultFeatures: [
                'Advanced web scraping capabilities',
                'Data extraction & processing',
                'Export to structured formats',
                'Error handling & retry logic'
            ]
        },
        securityTesting: {
            icon: 'fas fa-shield-alt',
            category: 'Security Testing',
            defaultTech: ['Python', 'Playwright', 'Security Tools'],
            defaultFeatures: [
                'Vulnerability assessment',
                'Automated penetration testing',
                'Security reporting',
                'Evidence collection'
            ]
        },
        dataAnalysis: {
            icon: 'fas fa-chart-line',
            category: 'Data Analysis',
            defaultTech: ['Python', 'Pandas', 'Visualization'],
            defaultFeatures: [
                'Large dataset processing',
                'Statistical analysis',
                'Data visualization',
                'Insights generation'
            ]
        },
        automation: {
            icon: 'fas fa-robot',
            category: 'Process Automation',
            defaultTech: ['Python', 'Automation Tools', 'APIs'],
            defaultFeatures: [
                'End-to-end automation',
                'Task scheduling',
                'Monitoring & alerting',
                'Scalable architecture'
            ]
        }
    }
};

/**
 * EASY PROJECT ADDITION GUIDE
 */
const ADD_NEW_PROJECT = {
    // Step 1: Add to project list (in components.js)
    step1_addToProjectList: `
// In assets/js/components.js - ProjectManager class
{
    id: 'your-project-id',
    title: 'Your Project Title',
    description: 'Brief project description',
    tech: ['Tech1', 'Tech2', 'Tech3'],
    stats: ['Stat1', 'Stat2'],
    icon: 'fas fa-icon-name',
    featured: true,
    folder: 'your_project_folder'
}
    `,

    // Step 2: Create project page (optional)
    step2_createProjectPage: `
// Copy existing project page template
cp projects/automation-testing.html projects/your-project-id.html

// Or use PROJECT_TEMPLATE.generateProjectPage() function
    `,

    // Step 3: Update navigation (automatic)
    step3_navigation: `
// Navigation automatically updates from project list
// No manual changes needed!
    `,

    // Quick setup function
    quickSetup: (projectId, title, description, tech, type = 'webScraping') => {
        const typeConfig = PROJECT_TEMPLATE.projectTypes[type];
        return {
            id: projectId,
            title: title,
            description: description,
            tech: tech || typeConfig.defaultTech,
            icon: typeConfig.icon,
            category: typeConfig.category,
            features: typeConfig.defaultFeatures,
            featured: true,
            folder: projectId.replace('-', '_')
        };
    }
};

/**
 * COMPONENT EXTENSION SYSTEM
 */
const COMPONENT_EXTENSIONS = {
    // Add new reusable component
    addComponent: (name, htmlPath) => {
        // Add to components object in ComponentLoader
        return `
// In assets/js/components.js
this.components.${name} = '${htmlPath}';

// Add placeholder in HTML
<div id="${name}-placeholder"></div>
        `;
    },

    // Common components you might want to add
    suggestedComponents: {
        breadcrumb: 'components/breadcrumb.html',
        socialShare: 'components/social-share.html',
        newsletter: 'components/newsletter.html',
        testimonials: 'components/testimonials.html',
        skills: 'components/skills.html'
    }
};

/**
 * DEPLOYMENT CONFIGURATION
 */
const DEPLOYMENT_CONFIG = {
    githubPages: {
        setup: `
1. Push code to GitHub repository
2. Go to Settings > Pages
3. Select source: Deploy from a branch
4. Choose: main branch / root
5. Your portfolio will be live at: https://username.github.io/repository-name/
        `,
        
        customDomain: `
1. Add CNAME file with your domain
2. Configure DNS settings
3. Enable HTTPS in GitHub Pages settings
        `
    },

    netlify: {
        setup: `
1. Connect GitHub repository to Netlify
2. Build settings:
   - Build command: (leave empty for static site)
   - Publish directory: /
3. Deploy automatically on git push
        `
    },

    performance: {
        optimization: [
            'Enable compression',
            'Optimize images',
            'Minify CSS/JS',
            'Use CDN for assets',
            'Enable caching headers'
        ]
    }
};

// Export for use in development tools
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PROJECT_TEMPLATE,
        ADD_NEW_PROJECT,
        COMPONENT_EXTENSIONS,
        DEPLOYMENT_CONFIG
    };
}

console.log('🛠️ Project Template System loaded');
console.log('📚 Use ADD_NEW_PROJECT.quickSetup() to create new projects');
console.log('🔧 Use COMPONENT_EXTENSIONS.addComponent() to add new components');