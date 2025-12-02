/**
 * MAIN APPLICATION LOGIC
 * Handles navigation, interactions, and dynamic content
 */

class PortfolioApp {
    constructor() {
        this.currentProject = null;
        this.init();
    }

    init() {
        // Wait for components to load
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeApp();
        });
    }

    initializeApp() {
        this.setupEventListeners();
        this.initializeCopyButtons();
        this.setupProjectNavigation();
        console.log('🚀 Portfolio App initialized');
    }

    setupEventListeners() {
        // Project card clicks
        document.addEventListener('click', (e) => {
            const projectCard = e.target.closest('.project-card');
            if (projectCard && !projectCard.classList.contains('add-more')) {
                const projectId = this.getProjectIdFromCard(projectCard);
                if (projectId) {
                    this.navigateToProject(projectId);
                }
            }
        });

        // "View All Projects" button
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-more')) {
                this.showAllProjects();
            }
        });

        // Copy code functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-btn')) {
                this.copyCode(e.target);
            }
        });
    }

    getProjectIdFromCard(card) {
        // Extract project ID from onclick attribute or data attribute
        const onClickAttr = card.getAttribute('onclick');
        if (onClickAttr) {
            const match = onClickAttr.match(/navigateToProject\('([^']+)'\)/);
            return match ? match[1] : null;
        }
        return card.getAttribute('data-project-id');
    }

    navigateToProject(projectId) {
        const project = window.projectManager.getProject(projectId);
        if (!project) {
            console.error(`Project not found: ${projectId}`);
            return;
        }

        // For multi-page architecture, navigate to project page
        const projectUrl = `projects/${projectId}.html`;
        
        // Check if page exists, otherwise show modal or create dynamic page
        this.loadProjectPage(projectUrl, project);
    }

    async loadProjectPage(url, project) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                // Navigate to existing page
                window.location.href = url;
            } else {
                // Create dynamic project page
                this.showProjectModal(project);
            }
        } catch (error) {
            console.log('Creating dynamic project view');
            this.showProjectModal(project);
        }
    }

    showProjectModal(project) {
        const modal = document.getElementById('additional-projects');
        const content = modal.querySelector('.modal-content');
        
        if (!modal || !content) return;

        content.innerHTML = `
            <span class="close">&times;</span>
            <div class="project-detail">
                <header class="project-header">
                    <div class="project-icon-large">
                        <i class="${project.icon}"></i>
                    </div>
                    <div class="project-title-section">
                        <h1>${project.title}</h1>
                        <p class="project-subtitle">${project.description}</p>
                        <div class="project-tech-tags">
                            ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                </header>
                
                <div class="project-content">
                    <div class="project-stats-detailed">
                        ${project.stats.map(stat => `<div class="stat-badge">${stat}</div>`).join('')}
                    </div>
                    
                    <div class="project-info">
                        <h3>🎯 Project Overview</h3>
                        <p>This project demonstrates advanced ${project.tech.join(', ')} skills in a real-world application.</p>
                        
                        <h3>🔧 Technical Implementation</h3>
                        <p>Built using modern ${project.tech[0]} practices with emphasis on scalability and maintainability.</p>
                        
                        <h3>📊 Results & Impact</h3>
                        <p>Successfully delivered ${project.stats.join(' and ')} with high performance and reliability.</p>
                    </div>
                    
                    <div class="project-actions">
                        <a href="#" class="btn btn-primary" onclick="window.open('https://github.com/vuduchoangs/${project.folder}', '_blank')">
                            <i class="fab fa-github"></i> View Source
                        </a>
                        <a href="#" class="btn btn-outline" onclick="alert('Live demo coming soon!')">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Re-attach close event listener
        const closeBtn = content.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        modal.style.display = 'block';
    }

    showAllProjects() {
        const modal = document.getElementById('additional-projects');
        const content = modal.querySelector('.modal-content');
        
        if (!modal || !content) return;

        const allProjects = window.projectManager.getAllProjects();

        content.innerHTML = `
            <span class="close">&times;</span>
            <h2><i class="fas fa-th"></i> All Projects Portfolio</h2>
            <div class="all-projects-grid">
                ${allProjects.map(project => this.generateProjectCard(project)).join('')}
            </div>
        `;

        // Re-attach event listeners
        const closeBtn = content.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        modal.style.display = 'block';
    }

    generateProjectCard(project) {
        return `
            <div class="project-card modal-project-card" data-project-id="${project.id}">
                <div class="project-image">
                    <i class="${project.icon} project-icon"></i>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="tech-tags">
                        ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-stats">
                        ${project.stats.map(stat => `<span><i class="fas fa-star"></i> ${stat}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    initializeCopyButtons() {
        // Add copy functionality to existing code blocks
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            if (!block.closest('.code-container').querySelector('.copy-btn')) {
                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-btn';
                copyBtn.textContent = 'Copy';
                copyBtn.addEventListener('click', () => this.copyCode(copyBtn));
                
                block.closest('.code-container').appendChild(copyBtn);
            }
        });
    }

    copyCode(button) {
        const codeContainer = button.closest('.code-container');
        const codeBlock = codeContainer.querySelector('code');
        
        if (!codeBlock) return;

        const text = codeBlock.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.textContent;
            const originalBg = button.style.background;
            
            button.textContent = 'Copied!';
            button.style.background = '#38b2ac';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = originalBg;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy code:', err);
            // Fallback for older browsers
            this.fallbackCopy(text);
        });
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            console.log('Code copied using fallback method');
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        
        document.body.removeChild(textArea);
    }

    setupProjectNavigation() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.projectId) {
                this.loadProject(e.state.projectId);
            }
        });
    }

    // Utility method for external calls
    static navigateToProject(projectId) {
        if (window.portfolioApp) {
            window.portfolioApp.navigateToProject(projectId);
        }
    }

    static showAllProjects() {
        if (window.portfolioApp) {
            window.portfolioApp.showAllProjects();
        }
    }
}

/**
 * PERFORMANCE OPTIMIZATION
 */
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.setupLazyLoading();
        this.preloadCriticalResources();
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" for non-critical images
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyElements = document.querySelectorAll('.lazy-load');
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('loaded');
                        lazyObserver.unobserve(entry.target);
                    }
                });
            });

            lazyElements.forEach(el => lazyObserver.observe(el));
        }
    }

    preloadCriticalResources() {
        const criticalResources = [
            'assets/css/main.css',
            'components/header.html',
            'components/footer.html'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'fetch';
            document.head.appendChild(link);
        });
    }
}

// Global functions for onclick handlers
function navigateToProject(projectId) {
    PortfolioApp.navigateToProject(projectId);
}

function showAllProjects() {
    PortfolioApp.showAllProjects();
}

// Initialize application
window.portfolioApp = new PortfolioApp();
window.performanceOptimizer = new PerformanceOptimizer();

// Debug helper
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugPortfolio = {
        app: window.portfolioApp,
        componentLoader: window.componentLoader,
        projectManager: window.projectManager,
        optimizer: window.performanceOptimizer
    };
    console.log('🔧 Debug tools available: window.debugPortfolio');
}