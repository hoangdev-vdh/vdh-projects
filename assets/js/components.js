/**
 * MODULAR COMPONENT LOADER
 * Loads reusable components (header, footer, intro) into placeholders
 */

class ComponentLoader {
    constructor() {
        // Detect if we're in a subdirectory (like projects/)
        const isInSubdir = window.location.pathname.includes('/projects/') || 
                          window.location.pathname.includes('\\projects\\');
        const basePath = isInSubdir ? '../' : '';
        
        this.components = {
            header: `${basePath}components/header.html`,
            footer: `${basePath}components/footer.html`,
            intro: `${basePath}components/intro.html`,
            'additional-projects': `${basePath}components/additional-projects.html`
        };
        this.init();
    }

    async init() {
        await this.loadAllComponents();
        this.initializeEventListeners();
        this.startAnimations();
    }

    async loadAllComponents() {
        const loadPromises = Object.entries(this.components).map(([name, path]) => 
            this.loadComponent(name, path)
        );
        
        try {
            await Promise.all(loadPromises);
            console.log('✅ All components loaded successfully');
        } catch (error) {
            console.error('❌ Error loading components:', error);
        }
    }

    async loadComponent(name, path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load ${name}: ${response.status}`);
            }
            
            const html = await response.text();
            const placeholder = document.getElementById(`${name}-placeholder`);
            
            if (placeholder) {
                placeholder.innerHTML = html;
                
                // Fix navigation paths after loading header
                if (name === 'header') {
                    this.fixNavigationPaths();
                }
                
                console.log(`✅ ${name} component loaded`);
            }
        } catch (error) {
            console.error(`❌ Error loading ${name} component:`, error);
            // Fallback for development
            this.createFallbackComponent(name);
        }
    }

    createFallbackComponent(name) {
        const placeholder = document.getElementById(`${name}-placeholder`);
        if (!placeholder) return;

        // Simple fallback message since we have actual component files
        placeholder.innerHTML = `
            <div class="component-fallback">
                <p>⚠️ Component "${name}" failed to load. Check file path: components/${name}.html</p>
            </div>
        `;
        
        console.warn(`⚠️ Using fallback for ${name} component`);
    }

    initializeEventListeners() {
        // Mobile navigation toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-toggle')) {
                this.toggleMobileMenu();
            }
        });

        // Modal controls
        const modal = document.getElementById('additional-projects');
        const closeBtn = document.querySelector('.close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        }
    }

    fixNavigationPaths() {
        // Detect if we're in a subdirectory (like projects/)
        const isInSubdir = window.location.pathname.includes('/projects/') || 
                          window.location.pathname.includes('\\projects\\');
        
        if (isInSubdir) {
            const basePath = '../';
            
            // Fix image paths
            const navProfile = document.querySelector('.nav-profile');
            if (navProfile) {
                navProfile.src = basePath + navProfile.getAttribute('src');
            }
            
            // Fix navigation links
            const navLinks = document.querySelectorAll('.nav-link[href], .dropdown-content a[href]');
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('../')) {
                    link.setAttribute('href', basePath + href);
                }
            });
        }
    }

    startAnimations() {
        // Counter animation for stats
        this.animateCounters();
        
        // Typing animation
        this.initTypingAnimation();
        
        // Intersection Observer for fade-in animations
        this.initScrollAnimations();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            // Start animation when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });

            observer.observe(counter);
        });
    }

    initTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const texts = [
            'Web Scraping',
            'Automation Testing',
            'Data Analysis',
            'Automation Engineer',
            'Wireshark Analyst'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseTime = 2000;

        const type = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let speed = isDeleting ? deleteSpeed : typeSpeed;

            if (!isDeleting && charIndex === currentText.length) {
                speed = pauseTime;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }

            setTimeout(type, speed);
        };

        // Start typing animation
        setTimeout(type, 1000);
    }

    initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.project-card, .capability-card, .skill-category'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('fade-in');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }
}

/**
 * PROJECT CONFIGURATION
 * Centralized project data management
 */
class ProjectManager {
    constructor() {
        this.projects = this.getProjectsData();
    }

    getProjectsData() {
        return [
            {
                id: 'automation-testing',
                title: 'Altoro Bank Security Audit',
                description: 'Comprehensive security testing & automation suite for banking system vulnerability assessment',
                tech: ['Python', 'Playwright', 'Security Testing'],
                stats: ['4 Vulnerabilities', '16 CSV Exports'],
                icon: 'fas fa-shield-alt',
                featured: true,
                folder: 'automation_demotestfire'
            },
            {
                id: 'vnexpress-news',
                title: 'VNExpress News Scraper',
                description: 'Automated news category extraction & classification system for VNExpress.net',
                tech: ['Python', 'Selenium', 'BeautifulSoup'],
                stats: ['Categories', 'CSV Export'],
                icon: 'fas fa-newspaper',
                featured: true,
                folder: 'vnexpress_news'
            },
            {
                id: 'bbc-converter',
                title: 'BBC Article to DOCX',
                description: 'Advanced web scraper converting BBC articles to formatted Word documents with images',
                tech: ['Python', 'BeautifulSoup', 'python-docx'],
                stats: ['Image Support', 'DOCX Format'],
                icon: 'fas fa-file-word',
                featured: true,
                folder: 'bbc'
            },
            {
                id: 'wiki-table',
                title: 'Wikipedia Table Extractor',
                description: 'Automated Olympic medal table extraction and CSV export from Wikipedia',
                tech: ['Python', 'BeautifulSoup', 'CSV Processing'],
                stats: ['Olympic Data', 'Table Parsing'],
                icon: 'fas fa-table',
                featured: true,
                folder: 'table_wiki'
            },
            {
                id: 'thpt-scores',
                title: 'THPT Exam Score Crawler',
                description: 'Mass data collection system for Vietnamese high school graduation exam results',
                tech: ['Python', 'Requests', 'Mass Scraping'],
                stats: ['Mass Data', 'Analytics'],
                icon: 'fas fa-graduation-cap',
                featured: true,
                folder: 'vnexpress_diemthi_thptqg'
            }
        ];
    }

    getProject(id) {
        return this.projects.find(project => project.id === id);
    }

    getFeaturedProjects() {
        return this.projects.filter(project => project.featured);
    }

    getAllProjects() {
        return this.projects;
    }
}

// Global instances
window.componentLoader = new ComponentLoader();
window.projectManager = new ProjectManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ComponentLoader, ProjectManager };
}