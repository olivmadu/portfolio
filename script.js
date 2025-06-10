
// Project Modal Data
const projectData = {
    crbr: {
        title: "Chappell Roan Brasil",
        description: "Portal de fãs dedicado à cantora Chappell Roan que reúne notícias, discografia, letras, agenda de shows, galeria de fotos e curiosidades em uma única experiência responsiva e vibrante, inspirada na estética camp-pop da artista.",
        details: "Construído com HTML5, CSS3 (paleta customizada + grid flexível) e JavaScript vanilla. O site conta com player flutuante, carrosséis, accordions reutilizáveis, linha do tempo dinâmica, formulários de newsletter, embeds de Spotify e YouTube e um sistema de filtros para notícias/galeria. Performance otimizada com lazy-loading de imagens WebP, minificação automatizada e cache inteligente. Acessibilidade implementada via ARIA, navegação por teclado e contraste adequado.",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        github: "https://github.com/olivmadu/chappell_roan_br",
        demo: "https://olivmadu.github.io/chappell_roan_br/",
        images: [
            "img/crbr1.png",
            "img/crbr2.png",
            "img/crbr3.png",
            "img/crbr4.png",
            "img/crbr5.png",
            "img/crbr6.png"
        ]
    },
    aquila: {
        title: "Aquila Ambiental",
        description: "Página web de empresa de educação ambiental que para divulgar serviços e divulgar portfólio, atraindo mais clientes.",
        details: "Construído como PWA em HTML, CSS e JavaScript puro, com layout responsivo e instalável no celular.",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        github: "https://github.com/seuusuario/meditation-app",
        demo: "https://olivmadu.github.io/aquila_ambiental/",
        images: [
            "img/aquila1.png",
            "img/aquila2.png",
            "img/aquila3.png",
            "img/aquila4.png"
        ]
    },
    store: {
        title: "INDIE THREADS",
        description: "Página web para uma loja de roupas voltada ao público jovem. A paleta de cores e design foram estruturados em torno do público alvo.",
        details: "Construído como PWA em HTML, CSS e JavaScript puro, com layout responsivo e instalável no celular.",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        github: "https://github.com/olivmadu/indie_threads",
        demo: "https://olivmadu.github.io/indie_threads/",
        images: [
            "img/it1.png",
            "img/it2.png",
            "img/it3.png"
        ]
    },
    portfolio: {
        title: "Portfolio Website",
        description: "Site pessoal desenvolvido com foco em apresentar projetos de forma elegante e interativa. O design combina elementos modernos com uma navegação intuitiva e animações suaves.",
        details: "Criado com HTML5, CSS3 e JavaScript vanilla, o site utiliza técnicas avançadas de CSS Grid e Flexbox para layouts responsivos. Implementei animações CSS personalizadas e um sistema de navegação por seções com transições suaves.",
        technologies: ["HTML5", "CSS3", "JavaScript", "SASS", "Responsive Design", "CSS Animations"],
        github: "https://github.com/seuusuario/portfolio-website",
        demo: "https://meuportfolio.vercel.app",
        images: [
            "/placeholder.svg?height=300&width=500&text=Portfolio+Home",
            "/placeholder.svg?height=300&width=500&text=Projects+Section",
            "/placeholder.svg?height=300&width=500&text=About+Page",
            "/placeholder.svg?height=300&width=500&text=Contact+Form"
        ]
    }
};

// Navigation and section management
class PortfolioNavigation {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.navItems = document.querySelectorAll('.nav-item');
        this.currentSection = 0;
        this.isScrolling = false;
        this.isNavigationLocked = false;
        this.wheelTimeout = null;
        this.lastWheelTime = 0;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showSection(0);
        this.detectScrollableContent();
    }
    
    detectScrollableContent() {
        this.sections.forEach((section, index) => {
            const content = section.querySelector('.section-content');
            if (content && content.scrollHeight > content.clientHeight) {
                section.setAttribute('data-scrollable', 'true');
            }
        });
    }
    
    bindEvents() {
        // Navigation clicks
        this.navItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToSection(index);
            });
        });
        
        // Hash navigation fallback
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });
        
        this.handleHashChange();
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (this.isScrolling || this.isNavigationLocked) return;
            
            switch(e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSection();
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSection();
                    break;
            }
        });
        
        // Mouse wheel navigation
        document.addEventListener('wheel', (e) => {
            this.handleWheelNavigation(e);
        }, { passive: false });
        
        this.setupTouchNavigation();
        this.setupContentHoverLocks();
    }
    
    handleHashChange() {
        const hash = window.location.hash;
        if (hash) {
            const sectionMap = {
                '#intro': 0,
                '#about': 1,
                '#work': 2,
                '#contact': 3
            };
            
            const sectionIndex = sectionMap[hash];
            if (sectionIndex !== undefined && sectionIndex !== this.currentSection) {
                this.goToSection(sectionIndex);
            }
        }
    }
    
    handleWheelNavigation(e) {
        const currentTime = Date.now();
        
        if (this.isScrolling || this.isNavigationLocked || (currentTime - this.lastWheelTime) < 100) {
            return;
        }
        
        const currentSectionEl = this.sections[this.currentSection];
        const scrollableContent = currentSectionEl.querySelector('.section-content');
        
        if (scrollableContent) {
            const isScrollingDown = e.deltaY > 0;
            const isScrollingUp = e.deltaY < 0;
            const isAtTop = scrollableContent.scrollTop <= 0;
            const isAtBottom = scrollableContent.scrollTop >= (scrollableContent.scrollHeight - scrollableContent.clientHeight - 5);
            
            if ((isScrollingDown && !isAtBottom) || (isScrollingUp && !isAtTop)) {
                return;
            }
        }
        
        clearTimeout(this.wheelTimeout);
        
        this.wheelTimeout = setTimeout(() => {
            if (Math.abs(e.deltaY) > 10) {
                if (e.deltaY > 0) {
                    this.nextSection();
                } else {
                    this.prevSection();
                }
            }
        }, 150);
        
        this.lastWheelTime = currentTime;
    }
    
    setupTouchNavigation() {
        let touchStartY = 0;
        let touchEndY = 0;
        let touchStartTime = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
            touchStartTime = Date.now();
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (this.isScrolling || this.isNavigationLocked) return;
            
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            
            if (touchDuration > 300) return;
            
            touchEndY = e.changedTouches[0].screenY;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > 80) {
                if (diff > 0) {
                    this.nextSection();
                } else {
                    this.prevSection();
                }
            }
        }, { passive: true });
    }
    
    setupContentHoverLocks() {
        const interactiveElements = document.querySelectorAll('.project-card, .contact-content, .about-grid, .projects-grid');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.isNavigationLocked = true;
            });
            
            element.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    this.isNavigationLocked = false;
                }, 200);
            });
        });
        
        const scrollableContents = document.querySelectorAll('.section-content');
        scrollableContents.forEach(content => {
            let scrollTimeout;
            content.addEventListener('scroll', () => {
                this.isNavigationLocked = true;
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    this.isNavigationLocked = false;
                }, 500);
            });
        });
    }
    
    goToSection(index) {
        if (index === this.currentSection || this.isScrolling) return;
        if (index < 0 || index >= this.sections.length) return;
        
        this.currentSection = index;
        this.showSection(index);
        this.updateNavigation(index);
        this.updateHash(index);
    }
    
    updateHash(index) {
        const hashes = ['#intro', '#about', '#work', '#contact'];
        if (hashes[index]) {
            history.replaceState(null, null, hashes[index]);
        }
    }
    
    nextSection() {
        if (this.currentSection < this.sections.length - 1) {
            this.goToSection(this.currentSection + 1);
        }
    }
    
    prevSection() {
        if (this.currentSection > 0) {
            this.goToSection(this.currentSection - 1);
        }
    }
    
    showSection(index) {
        this.isScrolling = true;
        
        this.sections.forEach((section, i) => {
            section.classList.remove('active');
        });
        
        setTimeout(() => {
            this.sections[index].classList.add('active');
        }, 100);
        
        setTimeout(() => {
            this.isScrolling = false;
        }, 800);
    }
    
    updateNavigation(index) {
        this.navItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }
}

// Project Modal Management
class ProjectModal {
    constructor() {
        this.modal = document.getElementById('projectModal');
        this.closeBtn = document.getElementById('closeModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDescription = document.getElementById('modalDescription');
        this.modalDetails = document.getElementById('modalDetails');
        this.modalTags = document.getElementById('modalTags');
        this.githubLink = document.getElementById('githubLink');
        this.demoLink = document.getElementById('demoLink');
        this.mainImage = document.getElementById('mainImage');
        this.galleryThumbs = document.getElementById('galleryThumbs');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        // Project card clicks
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectKey = card.getAttribute('data-project');
                this.openModal(projectKey);
            });
        });
        
        // Close modal events
        this.closeBtn.addEventListener('click', () => this.closeModal());
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
    
    openModal(projectKey) {
        const project = projectData[projectKey];
        if (!project) return;
        
        // Populate modal content
        this.modalTitle.textContent = project.title;
        this.modalDescription.textContent = project.description;
        this.modalDetails.textContent = project.details;
        this.githubLink.href = project.github;
        this.demoLink.href = project.demo;
        
        // Set main image
        this.mainImage.src = project.images[0];
        this.mainImage.alt = project.title;
        
        // Create thumbnails
        this.galleryThumbs.innerHTML = '';
        project.images.forEach((image, index) => {
            const thumb = document.createElement('div');
            thumb.className = `gallery-thumb ${index === 0 ? 'active' : ''}`;
            thumb.innerHTML = `<img src="${image}" alt="${project.title} ${index + 1}">`;
            thumb.addEventListener('click', () => {
                this.mainImage.src = image;
                document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
            this.galleryThumbs.appendChild(thumb);
        });
        
        // Create technology tags
        this.modalTags.innerHTML = '';
        project.technologies.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = tech;
            this.modalTags.appendChild(tag);
        });
        
        // Show modal
        this.modal.style.display = 'flex';
        setTimeout(() => {
            this.modal.classList.add('active');
        }, 10);
        
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Text animations
class TextAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.animateHeroTitle();
        this.setupIntersectionObserver();
    }
    
    animateHeroTitle() {
        const titleLines = document.querySelectorAll('.hero-title .title-line');
        
        titleLines.forEach((line, index) => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                line.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, 500 + (index * 200));
        });
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);
        
        const animateElements = document.querySelectorAll('.section-title, .project-card, .about-text, .contact-content');
        animateElements.forEach(el => observer.observe(el));
    }
    
    animateElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Cursor effects
class CursorEffects {
    constructor() {
        this.cursor = null;
        this.cursorFollower = null;
        this.init();
    }
    
    init() {
        if (window.innerWidth > 768) {
            this.createCursor();
            this.bindEvents();
        }
    }
    
    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: #f4a6a6;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
        `;
        
        this.cursorFollower = document.createElement('div');
        this.cursorFollower.className = 'cursor-follower';
        this.cursorFollower.style.cssText = `
            position: fixed;
            width: 30px;
            height: 30px;
            border: 1px solid rgba(244, 166, 166, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorFollower);
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            if (this.cursor && this.cursorFollower) {
                this.cursor.style.left = e.clientX - 4 + 'px';
                this.cursor.style.top = e.clientY - 4 + 'px';
                
                this.cursorFollower.style.left = e.clientX - 15 + 'px';
                this.cursorFollower.style.top = e.clientY - 15 + 'px';
            }
        });
        
        const hoverElements = document.querySelectorAll('a, button, .project-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (this.cursor && this.cursorFollower) {
                    this.cursor.style.transform = 'scale(1.5)';
                    this.cursorFollower.style.transform = 'scale(1.5)';
                }
            });
            
            el.addEventListener('mouseleave', () => {
                if (this.cursor && this.cursorFollower) {
                    this.cursor.style.transform = 'scale(1)';
                    this.cursorFollower.style.transform = 'scale(1)';
                }
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioNavigation();
    new ProjectModal();
    new TextAnimations();
    new CursorEffects();
    
    // Hide loading screen if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    const customCursor = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (window.innerWidth <= 768) {
        if (customCursor) customCursor.remove();
        if (cursorFollower) cursorFollower.remove();
    } else if (!customCursor) {
        new CursorEffects();
    }
});