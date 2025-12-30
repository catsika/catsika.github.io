// Content Loader - Dynamically populate HTML from JSON

let contentData = null;

// Load content from JSON
async function loadContent() {
    try {
        const response = await fetch('data/content.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        contentData = await response.json();
        populateContent();
        console.log('✅ Content loaded successfully from JSON');
        
        // Dispatch event for other scripts
        window.dispatchEvent(new CustomEvent('contentLoaded', { detail: contentData }));
    } catch (error) {
        console.error('❌ Error loading content:', error);
        console.log('ℹ️ Content will use HTML fallback. To use JSON content, run a local server:');
        console.log('   python -m http.server 8000');
        console.log('   OR use VS Code Live Server extension');
        // Fallback: content is already in HTML
    }
}

// Populate all sections with content
function populateContent() {
    if (!contentData) return;
    
    populateHero();
    populateAbout();
    populateProjects();
    populateContact();
    populateFooter();
    updateMetaTags();
}

// Update meta tags and title
function updateMetaTags() {
    const { personal } = contentData;
    document.title = `${personal.name} | Portfolio`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = `${personal.name} - ${personal.title} Portfolio`;
    }
}

// Populate Hero Section
function populateHero() {
    const { hero, personal } = contentData;
    
    // Byline
    const bylineLabel = document.querySelector('.byline-label');
    const bylineDate = document.querySelector('.byline-date');
    if (bylineLabel) bylineLabel.textContent = hero.byline.label;
    if (bylineDate) bylineDate.textContent = hero.byline.date;
    
    // Title and subtitle
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroTitle) heroTitle.textContent = personal.name;
    if (heroSubtitle) heroSubtitle.textContent = personal.tagline;
    
    // Meta items
    const metaContainer = document.querySelector('.hero-meta');
    if (metaContainer) {
        metaContainer.innerHTML = hero.meta.map(item => `
            <div class="meta-item">
                <span class="meta-label">${item.label}</span>
                <span class="meta-value">${item.value}</span>
            </div>
        `).join('');
    }
    
    // Lede
    const heroLede = document.querySelector('.hero-lede p');
    if (heroLede) heroLede.innerHTML = hero.lede;
}

// Populate About Section
function populateAbout() {
    const { about } = contentData;
    
    // Section header
    const eyebrow = document.querySelector('#about .section-eyebrow');
    const title = document.querySelector('#about .section-title');
    if (eyebrow) eyebrow.textContent = about.eyebrow;
    if (title) title.textContent = about.title;
    
    // Intro
    const intro = document.querySelector('.about-intro');
    if (intro) intro.textContent = about.intro;
    
    // Paragraphs
    const aboutText = document.querySelector('.about-text');
    if (aboutText && about.paragraphs) {
        const existingIntro = aboutText.querySelector('.about-intro');
        const existingPullquote = aboutText.querySelector('.pullquote');
        const existingSkills = aboutText.querySelector('.skills');
        
        // Remove existing paragraphs (not intro, pullquote, or skills)
        const paragraphs = aboutText.querySelectorAll('p:not(.about-intro)');
        paragraphs.forEach(p => {
            if (!p.closest('.pullquote')) {
                p.remove();
            }
        });
        
        // Insert new paragraphs after intro
        about.paragraphs.forEach((text, index) => {
            const p = document.createElement('p');
            p.innerHTML = text;
            if (existingPullquote && index === about.paragraphs.length - 1) {
                existingPullquote.insertAdjacentElement('beforebegin', p);
            } else {
                existingIntro.insertAdjacentElement('afterend', p);
            }
        });
    }
    
    // Quote
    const quote = document.querySelector('.pullquote p');
    if (quote) quote.textContent = about.quote;
    
    // Skills
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid && about.skills) {
        skillsGrid.innerHTML = about.skills.map((skill, index) => `
            <div class="skill-card">
                <div class="skill-number">${String(index + 1).padStart(2, '0')}</div>
                <h4>${skill.title}</h4>
                <div class="skill-tags">
                    ${skill.description.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }
}

// Populate Projects Section
function populateProjects() {
    const { projects } = contentData;
    
    // Section header
    const eyebrow = document.querySelector('#projects .section-eyebrow');
    const title = document.querySelector('#projects .section-title');
    const description = document.querySelector('#projects .section-description');
    if (eyebrow) eyebrow.textContent = projects.eyebrow;
    if (title) title.textContent = projects.title;
    if (description) description.textContent = projects.description;
    
    // Projects list
    const projectsList = document.querySelector('.projects-list');
    if (projectsList && projects.items) {
        projectsList.innerHTML = projects.items.map(project => `
            <article class="project-card ${project.featured ? 'featured' : ''}">
                <div class="project-header">
                    ${project.featured ? '<span class="project-label">Featured Project</span>' : ''}
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-subtitle">${project.subtitle}</p>
                </div>
                
                                    <div class="project-content">
                                    <p class="project-description">
                                        ${project.description}
                                    </p>
                                    
                                    ${project.link && project.link.url ? `
                                        <div class="project-link">
                                            <a href="${project.link.url}" target="_blank" class="link-with-arrow">
                                                ${project.link.text}
                                            </a>
                                        </div>
                                    ` : ''}
                                </div>            </article>
        `).join('');
    }
}

// Populate Contact Section
function populateContact() {
    const { contact } = contentData;
    
    // Section header
    const eyebrow = document.querySelector('#contact .section-eyebrow');
    const title = document.querySelector('#contact .section-title');
    const intro = document.querySelector('.contact-intro');
    if (eyebrow) eyebrow.textContent = contact.eyebrow;
    if (title) title.textContent = contact.title;
    if (intro) intro.textContent = contact.intro;
    
    // Contact methods
    const methodsContainer = document.querySelector('.contact-methods');
    if (methodsContainer && contact.methods) {
        methodsContainer.innerHTML = contact.methods.map(method => `
            <a href="${method.link}" class="contact-card" ${method.link.startsWith('http') ? 'target="_blank"' : ''}>
                <div class="contact-number">${method.number}</div>
                <h3>${method.title}</h3>
                <p>${method.value}</p>
                <span class="contact-arrow">→</span>
            </a>
        `).join('');
    }
    
    // Form title
    const formTitle = document.querySelector('.form-title');
    if (formTitle) formTitle.textContent = contact.formTitle;
}

// Populate Footer
function populateFooter() {
    const { footer } = contentData;
    
    // Copyright
    const copyright = document.querySelector('.footer p');
    if (copyright) copyright.textContent = `© ${footer.copyright}`;
    
    // Social links
    const socialLinks = document.querySelector('.social-links');
    if (socialLinks && footer.links) {
        socialLinks.innerHTML = footer.links.map(link => `
            <a href="${link.url}" ${link.url.startsWith('http') ? 'target="_blank"' : ''}>${link.text}</a>
        `).join('');
    }
}

// Update navigation resume link
function updateNavLinks() {
    if (!contentData) return;
    
    const resumeLink = document.querySelector('.btn-resume');
    if (resumeLink) {
        resumeLink.href = contentData.personal.resumePath;
    }
}

// Initialize content loading
document.addEventListener('DOMContentLoaded', () => {
    loadContent();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadContent, contentData };
}
