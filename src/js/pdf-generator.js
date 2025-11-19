// PDF Resume Generator - v2.0
// A comprehensive redesign for a modern, professional, and visually appealing resume.

// Load jsPDF library dynamically if not already loaded
function loadJsPDF() {
    return new Promise((resolve, reject) => {
        if (window.jspdf) {
            resolve(window.jspdf.jsPDF);
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => resolve(window.jspdf.jsPDF);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// --- PDF Design System ---
const pdfTheme = {
    colors: {
        primary: '#000000', // Pure black for text
        secondary: '#333333', // Dark gray for secondary text
        accent: '#666666', // Medium gray for subtle elements
        line: '#E0E0E0', // Light gray for lines
        white: '#FFFFFF'
    },
    fonts: {
        name: { family: 'helvetica', style: 'bold', size: 24 },
        title: { family: 'helvetica', style: 'normal', size: 11 },
        contact: { family: 'helvetica', style: 'normal', size: 9 },
        sectionTitle: { family: 'helvetica', style: 'bold', size: 11 },
        jobTitle: { family: 'helvetica', style: 'bold', size: 10 },
        body: { family: 'helvetica', style: 'normal', size: 9 },
        small: { family: 'helvetica', style: 'normal', size: 8 },
        italic: { family: 'helvetica', style: 'italic', size: 9 }
    },
    layout: {
        margin: 25,
        lineHeight: 4.5,
        sectionSpacing: 8,
    }
};

// --- PDF Generation Logic ---

async function generateResumePDF(contentData) {
    try {
        showNotification('Generating your new resume...', 'info');
        
        const jsPDF = await loadJsPDF();
        const doc = new jsPDF('p', 'mm', 'a4');
        const { personal, hero, about, projects, resume } = contentData;
        const { colors, fonts, layout } = pdfTheme;
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let y = layout.margin;

        // --- PDF Helper Functions ---
        
        const checkPageBreak = (requiredSpace) => {
            if (y + requiredSpace > pageHeight - layout.margin) {
                doc.addPage();
                y = layout.margin;
            }
        };

        const addWrappedText = (text, options) => {
            const { x, font, color, maxWidth, lineHeight } = options;
            doc.setFont(font.family, font.style);
            doc.setFontSize(font.size);
            doc.setTextColor(color);
            const lines = doc.splitTextToSize(text, maxWidth);
            doc.text(lines, x, y);
            return (lines.length * (lineHeight || layout.lineHeight));
        };

        const addSection = (title, startY) => {
            y = startY || y;
            checkPageBreak(16); // more space for better grouping
            doc.setFont(fonts.sectionTitle.family, fonts.sectionTitle.style);
            doc.setFontSize(fonts.sectionTitle.size);
            doc.setTextColor(colors.primary);
            doc.text(title.toUpperCase(), layout.margin, y);
            y += layout.lineHeight * 1.7; // more space after title
            doc.setDrawColor(colors.line);
            doc.setLineWidth(0.4);
            doc.line(layout.margin, y, pageWidth - layout.margin, y);
            y += 5; // more space after line
        };

        // --- PDF Structure ---

        // 1. Header Section - Centered
        const nameWidth = doc.getTextWidth(personal.name);
        const centerX = pageWidth / 2;
        
        doc.setTextColor(colors.primary);
        doc.setFont(fonts.name.family, fonts.name.style);
        doc.setFontSize(fonts.name.size);
        doc.text(personal.name.toUpperCase(), centerX, y, { align: 'center' });
        y += 6;

        doc.setFont(fonts.title.family, fonts.title.style);
        doc.setFontSize(fonts.title.size);
        doc.setTextColor(colors.primary);
        doc.text(personal.title, centerX, y, { align: 'center' });
        y += 5;

        const contactInfo = [personal.phone, personal.email, personal.githubUrl].filter(Boolean).join(' | ');
        doc.setFont(fonts.contact.family, fonts.contact.style);
        doc.setFontSize(fonts.contact.size);
        doc.setTextColor(colors.secondary);
        doc.text(contactInfo, centerX, y, { align: 'center' });
        y += 12;

        // Horizontal line after header
        doc.setDrawColor(colors.line);
        doc.setLineWidth(0.5);
        doc.line(layout.margin, y, pageWidth - layout.margin, y);
        y += 10;

        // 2. Profile/Summary Section
        addSection('Profile');
        const summary = (resume?.objective || hero.lede).replace(/<[^>]+>/g, '');
        y += addWrappedText(summary, { x: layout.margin, font: fonts.body, color: colors.primary, maxWidth: pageWidth - (layout.margin * 2), lineHeight: 4 });
        y += layout.sectionSpacing;
        
        // 3. Projects Section
        if (projects.items && projects.items.length > 0) {
            addSection('Projects');
            projects.items.forEach((project, index) => {
                checkPageBreak(30);
                // Project title in uppercase
                doc.setFont(fonts.jobTitle.family, fonts.jobTitle.style);
                doc.setFontSize(fonts.jobTitle.size);
                doc.setTextColor(colors.primary);
                doc.text(project.title.toUpperCase(), layout.margin, y);
                y += layout.lineHeight * 1.5;

                // Project subtitle/description
                if (project.subtitle) {
                    doc.setFont(fonts.italic.family, fonts.italic.style);
                    doc.setFontSize(fonts.italic.size);
                    doc.setTextColor(colors.secondary);
                    doc.text(project.subtitle, layout.margin, y);
                    y += layout.lineHeight * 1.3;
                }

                // Project description with bullets
                const descLines = project.description.split('\n').filter(line => line.trim());
                descLines.forEach(line => {
                    checkPageBreak(10);
                    const bullet = '•';
                    const bulletWidth = 4;
                    doc.setFont(fonts.body.family, fonts.body.style);
                    doc.setFontSize(fonts.body.size);
                    doc.setTextColor(colors.primary);
                    doc.text(bullet, layout.margin, y);
                    
                    const textHeight = addWrappedText(line.trim(), {
                        x: layout.margin + bulletWidth,
                        font: fonts.body,
                        color: colors.primary,
                        maxWidth: pageWidth - (layout.margin * 2) - bulletWidth,
                        lineHeight: 4
                    });
                    y += textHeight + 2.5;
                });
                
                if (index < projects.items.length - 1) {
                    y += 8;
                }
            });
            y += layout.sectionSpacing + 4;
        }
        
        // 4. Professional Experience
        addSection('Professional Experience');
        resume.experience.forEach((job, index) => {
            checkPageBreak(30);
            
            // Job title and period on same line
            doc.setFont(fonts.jobTitle.family, fonts.jobTitle.style);
            doc.setFontSize(fonts.jobTitle.size);
            doc.setTextColor(colors.primary);
            doc.text(job.title.toUpperCase(), layout.margin, y);

            doc.setFont(fonts.small.family, fonts.small.style);
            doc.setFontSize(fonts.small.size);
            doc.setTextColor(colors.secondary);
            doc.text(job.period, pageWidth - layout.margin, y, { align: 'right' });
            y += layout.lineHeight * 1.5;

            // Company and location
            doc.setFont(fonts.body.family, fonts.body.style);
            doc.setFontSize(fonts.body.size);
            doc.setTextColor(colors.secondary);
            doc.text(`${job.company}, ${job.location}`, layout.margin, y);
            y += layout.lineHeight * 1.7;
            
            // Achievements
            job.achievements.forEach(achievement => {
                checkPageBreak(10);
                const bullet = '•';
                const bulletWidth = 4;
                doc.setFont(fonts.body.family, fonts.body.style);
                doc.setFontSize(fonts.body.size);
                doc.setTextColor(colors.primary);
                doc.text(bullet, layout.margin, y);
                
                const textHeight = addWrappedText(achievement, {
                    x: layout.margin + bulletWidth,
                    font: fonts.body,
                    color: colors.primary,
                    maxWidth: pageWidth - (layout.margin * 2) - bulletWidth,
                    lineHeight: 4
                });
                y += textHeight + 2.5;
            });
            
            if (index < resume.experience.length - 1) {
                y += 10;
            }
        });
        y += layout.sectionSpacing + 4;

        // 5. Education Section
        addSection('Education');
        resume.education.forEach((edu, index) => {
            checkPageBreak(18);
            
            // Institution name and period
            doc.setFont(fonts.jobTitle.family, fonts.jobTitle.style);
            doc.setFontSize(fonts.jobTitle.size);
            doc.setTextColor(colors.primary);
            doc.text(edu.institution.toUpperCase(), layout.margin, y);
            
            doc.setFont(fonts.small.family, fonts.small.style);
            doc.setFontSize(fonts.small.size);
            doc.setTextColor(colors.secondary);
            doc.text(edu.period, pageWidth - layout.margin, y, { align: 'right' });
            y += layout.lineHeight * 1.5;

            // Degree
            doc.setFont(fonts.body.family, fonts.body.style);
            doc.setFontSize(fonts.body.size);
            doc.setTextColor(colors.secondary);
            doc.text(edu.degree, layout.margin, y);
            if (index < resume.education.length - 1) {
                y += layout.lineHeight * 2.5;
            } else {
                y += layout.lineHeight * 2;
            }
        });
        y += layout.sectionSpacing + 4;

        // 6. Skills and Interests Section
        addSection('Skills and Interests');
        // Group skills by category if available, otherwise list titles
        if (about.skills && about.skills.length > 0) {
            // Check if skills have a 'category' property
            const hasCategory = about.skills.some(skill => skill.category);
            if (hasCategory) {
                // Group by category
                const grouped = {};
                about.skills.forEach(skill => {
                    const cat = skill.category || 'Other';
                    if (!grouped[cat]) grouped[cat] = [];
                    grouped[cat].push(skill.title);
                });
                Object.entries(grouped).forEach(([cat, skills]) => {
                    checkPageBreak(12);
                    doc.setFont(fonts.jobTitle.family, fonts.jobTitle.style);
                    doc.setFontSize(fonts.jobTitle.size);
                    doc.setTextColor(colors.primary);
                    doc.text(cat, layout.margin, y);
                    y += layout.lineHeight * 1.2;
                    skills.forEach(skillTitle => {
                        checkPageBreak(8);
                        const bullet = '•';
                        const bulletWidth = 4;
                        doc.setFont(fonts.body.family, fonts.body.style);
                        doc.setFontSize(fonts.body.size);
                        doc.setTextColor(colors.primary);
                        doc.text(bullet, layout.margin, y);
                        doc.text(skillTitle, layout.margin + bulletWidth, y);
                        y += layout.lineHeight * 1.1;
                    });
                    y += 4;
                });
            } else {
                // No categories, just list all skill titles as bullets
                about.skills.forEach(skill => {
                    checkPageBreak(8);
                    const bullet = '•';
                    const bulletWidth = 4;
                    doc.setFont(fonts.body.family, fonts.body.style);
                    doc.setFontSize(fonts.body.size);
                    doc.setTextColor(colors.primary);
                    doc.text(bullet, layout.margin, y);
                    doc.text(skill.title, layout.margin + bulletWidth, y);
                    y += layout.lineHeight * 1.1;
                });
            }
        }
        y += layout.sectionSpacing + 4;

        // 7. Reference Section (if applicable)
        if (resume.references && resume.references.length > 0) {
            addSection('Reference');
            resume.references.forEach(ref => {
                checkPageBreak(16);
                doc.setFont(fonts.jobTitle.family, fonts.jobTitle.style);
                doc.setFontSize(fonts.jobTitle.size);
                doc.setTextColor(colors.primary);
                doc.text(ref.name, layout.margin, y);
                y += layout.lineHeight * 1.5;

                doc.setFont(fonts.body.family, fonts.body.style);
                doc.setFontSize(fonts.body.size);
                doc.setTextColor(colors.secondary);
                doc.text(ref.title, layout.margin, y);
                y += layout.lineHeight * 2;
            });
        }

        // --- Save the PDF ---
        const fileName = `${personal.name.replace(/\s+/g, '_')}_Resume.pdf`;
        doc.save(fileName);
        
        showNotification('Your new resume has been downloaded!', 'success');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error generating resume. Please try again.', 'error');
    }
}

// Notification helper function
function showNotification(message, type) {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // You can enhance this with actual UI notifications
}

// Resume Preview Generator v2.0
const resumePreview = {
    show(contentData) {
        this.close(); // Close any existing modal
        const { personal, hero, about, projects, resume } = contentData;

        const modalHTML = `
            <div id="resumePreviewModal" class="resume-preview-modal">
                <div class="resume-preview-container">
                    <div class="resume-preview-header">
                        <h2>Resume Preview</h2>
                        <button class="close-preview">&times;</button>
                    </div>
                    <div class="resume-preview-content">
                        ${this.renderHeader(personal)}
                        ${this.renderSection('Profile', `<p>${(resume?.objective || hero.lede).replace(/<[^>]+>/g, '')}</p>`)}
                        ${this.renderProjects(projects)}
                        ${this.renderExperience(resume)}
                        ${this.renderEducation(resume)}
                        ${this.renderSkills(about)}
                    </div>
                    <div class="resume-preview-footer">
                        <button class="btn-secondary close-preview">Cancel</button>
                        <button class="btn-primary" id="downloadPdfBtn">Download PDF</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addEventListeners(contentData);
    },

    renderHeader(personal) {
        const contactInfo = [personal.phone, personal.email, personal.githubUrl].filter(Boolean).join('  |  ');
        return `
            <div class="preview-section preview-header-section">
                <h1>${personal.name.toUpperCase()}</h1>
                <p class="preview-title">${personal.title}</p>
                <p class="preview-contact">${contactInfo}</p>
            </div>
        `;
    },

    renderSection(title, content) {
        return `
            <div class="preview-section">
                <h2 class="preview-heading">${title.toUpperCase()}</h2>
                <div class="preview-section-content">
                    ${content}
                </div>
            </div>
        `;
    },

    renderExperience(resume) {
        if (!resume.experience || resume.experience.length === 0) return '';
        const content = resume.experience.map(job => `
            <div class="preview-job">
                <div class="preview-job-header">
                    <strong>${job.title.toUpperCase()}</strong>
                    <span>${job.period}</span>
                </div>
                <div class="preview-company">${job.company}, ${job.location}</div>
                <ul class="preview-achievements">
                    ${job.achievements.map(ach => `<li>${ach}</li>`).join('')}
                </ul>
            </div>
        `).join('');
        return this.renderSection('Professional Experience', content);
    },

    renderProjects(projects) {
        if (!projects.items || projects.items.length === 0) return '';
        const content = projects.items.map(project => `
            <div class="preview-project">
                <div class="preview-job-header">
                    <strong>${project.title.toUpperCase()}</strong>
                </div>
                ${project.subtitle ? `<p class="preview-subtitle">${project.subtitle}</p>` : ''}
                <p class="preview-project-description">${project.description}</p>
            </div>
        `).join('');
        return this.renderSection('Projects', content);
    },

    renderEducation(resume) {
        if (!resume.education || resume.education.length === 0) return '';
        const content = resume.education.map(edu => `
            <div class="preview-job">
                <div class="preview-job-header">
                    <strong>${edu.institution.toUpperCase()}</strong>
                    <span>${edu.period}</span>
                </div>
                <div class="preview-company">${edu.degree}</div>
            </div>
        `).join('');
        return this.renderSection('Education', content);
    },

    renderSkills(about) {
        if (!about.skills || about.skills.length === 0) return '';
        const content = `<p>${about.skills.map(skill => skill.title).join('  |  ')}</p>`;
        return this.renderSection('Skills', content);
    },
    
    addEventListeners(contentData) {
        const modal = document.getElementById('resumePreviewModal');
        modal.querySelectorAll('.close-preview').forEach(btn => btn.addEventListener('click', () => this.close()));
        document.getElementById('downloadPdfBtn').addEventListener('click', () => generateResumePDF(contentData));
    },

    close() {
        const modal = document.getElementById('resumePreviewModal');
        if (modal) {
            modal.remove();
        }
    }
};

// Initialize resume generator when content is loaded
window.addEventListener('contentLoaded', (event) => {
    const contentData = event.detail;
    initResumeGenerator(contentData);
});

function initResumeGenerator(contentData) {
    // Add styles for the preview modal to the head
    if (!document.getElementById('resumePreviewStyles')) {
        const styles = document.createElement('style');
        styles.id = 'resumePreviewStyles';
        styles.textContent = `
            .resume-preview-modal {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center;
                z-index: 10000; padding: 20px; animation: fadeIn 0.3s ease;
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            .resume-preview-container {
                background: #FFFFFF; border-radius: 8px; max-width: 900px; width: 100%;
                max-height: 90vh; display: flex; flex-direction: column;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); animation: slideUp 0.3s ease;
            }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .resume-preview-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 20px 30px; border-bottom: 1px solid #EAEAEA;
            }
            .resume-preview-header h2 { margin: 0; font-size: 20px; color: #121212; font-family: var(--font-serif); }
            .close-preview { cursor: pointer; background: none; border: none; font-size: 32px; color: #999; }
            .resume-preview-content { flex: 1; overflow-y: auto; padding: 40px; }
            .preview-section { margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #EAEAEA; }
            .preview-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .preview-header-section { text-align: center; border-bottom: 2px solid #E0E0E0; padding-bottom: 20px; }
            .preview-header-section h1 { font-size: 28px; font-family: 'Helvetica', sans-serif; font-weight: bold; color: #000; margin: 0 0 5px 0; letter-spacing: 1px; }
            .preview-header-section .preview-title { font-size: 14px; color: #000; margin: 0 0 10px 0; }
            .preview-header-section .preview-contact { font-size: 11px; color: #333; }
            .preview-heading { font-family: 'Helvetica', sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #000; font-weight: bold; margin: 0 0 15px 0; border-bottom: 1px solid #E0E0E0; padding-bottom: 8px; }
            .preview-section-content p { font-family: 'Helvetica', sans-serif; line-height: 1.6; color: #000; font-size: 11px; }
            .preview-job, .preview-project { margin-bottom: 20px; }
            .preview-job:last-child, .preview-project:last-child { margin-bottom: 0; }
            .preview-job-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
            .preview-job-header strong { font-size: 12px; color: #000; font-family: 'Helvetica', sans-serif; font-weight: bold; }
            .preview-job-header span { font-size: 10px; color: #333; }
            .preview-company { font-size: 11px; color: #333; margin-bottom: 8px; }
            .preview-subtitle { font-size: 11px; color: #666; font-style: italic; margin: 4px 0 8px 0; }
            .preview-achievements { list-style: none; padding-left: 15px; margin: 0; }
            .preview-achievements li { position: relative; margin-bottom: 6px; font-size: 11px; line-height: 1.6; font-family: 'Helvetica', sans-serif; }
            .preview-achievements li:before { content: "•"; position: absolute; left: -15px; color: #333; }
            .preview-project_description { font-size: 11px; line-height: 1.6; font-family: 'Helvetica', sans-serif; }
            .resume-preview-footer { display: flex; justify-content: flex-end; gap: 15px; padding: 20px 30px; border-top: 1px solid #EAEAEA; }
            .btn-primary, .btn-secondary { padding: 10px 24px; border: 1px solid; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
            .btn-primary { background: #000; color: white; border-color: #000; }
            .btn-primary:hover { background: #333; border-color: #333; }
            .btn-secondary { background: transparent; color: #333; border-color: #E0E0E0; }
            .btn-secondary:hover { background: #f7f7f7; border-color: #ccc; }
        `;
        document.head.appendChild(styles);
    }

    const resumeLinks = document.querySelectorAll('a[href*="resume"]');
    resumeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            resumePreview.show(contentData);
        });
    });
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateResumePDF, resumePreview, initResumeGenerator };
}