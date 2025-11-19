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
        primary: '#1a202c', // A dark, near-black for text
        secondary: '#718096', // A medium gray for subtitles and secondary text
        accent: '#2E5A80', // The accent blue
        lightGray: '#EAEAEA',
        white: '#FFFFFF'
    },
    fonts: {
        name: { family: 'helvetica', style: 'bold', size: 32 },
        title: { family: 'helvetica', style: 'normal', size: 14 },
        h1: { family: 'helvetica', style: 'bold', size: 16 },
        h2: { family: 'helvetica', style: 'bold', size: 12 },
        body: { family: 'helvetica', style: 'normal', size: 10 },
        small: { family: 'helvetica', style: 'normal', size: 9 },
        italic: { family: 'helvetica', style: 'italic', size: 9 }
    },
    layout: {
        margin: 20,
        lineHeight: 5,
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
            checkPageBreak(15);
            doc.setFont(fonts.h1.family, fonts.h1.style);
            doc.setFontSize(fonts.h1.size);
            doc.setTextColor(colors.primary);
            doc.text(title, layout.margin, y);
            y += layout.lineHeight * 1.5;
            doc.setDrawColor(colors.lightGray);
            doc.line(layout.margin, y, pageWidth - layout.margin, y);
            y += layout.lineHeight * 1.5;
        };

        // --- PDF Structure ---

        // 1. Header Section
        doc.setTextColor(colors.primary);
        doc.setFont(fonts.name.family, fonts.name.style);
        doc.setFontSize(fonts.name.size);
        doc.text(personal.name, layout.margin, y);
        y += 12;

        doc.setFont(fonts.title.family, fonts.title.style);
        doc.setFontSize(fonts.title.size);
        doc.setTextColor(colors.secondary);
        doc.text(personal.title, layout.margin, y);
        y += 6;

        const contactInfo = [personal.email, personal.githubUrl, personal.phone].filter(Boolean).join('  |  ');
        doc.setFont(fonts.small.family, fonts.small.style);
        doc.setFontSize(fonts.small.size);
        doc.setTextColor(colors.accent);
        doc.text(contactInfo, layout.margin, y);
        y += 15;


        // 2. Main Content
        addSection('Professional Summary');
        const summary = (resume?.objective || hero.lede).replace(/<[^>]+>/g, '');
        y += addWrappedText(summary, { x: layout.margin, font: fonts.body, color: colors.primary, maxWidth: pageWidth - (layout.margin * 2) });
        
        addSection('Professional Experience');
        resume.experience.forEach(job => {
            checkPageBreak(20);
            const jobTitleY = y;
            doc.setFont(fonts.h2.family, fonts.h2.style);
            doc.setFontSize(fonts.h2.size);
            doc.setTextColor(colors.primary);
            doc.text(job.title, layout.margin, y);

            doc.setFont(fonts.small.family, fonts.small.style);
            doc.setFontSize(fonts.small.size);
            doc.setTextColor(colors.secondary);
            doc.text(job.period, pageWidth - layout.margin, y, { align: 'right' });
            y += layout.lineHeight;

            doc.setFont(fonts.body.family, fonts.body.style);
            doc.setFontSize(fonts.body.size);
            doc.setTextColor(colors.accent);
            doc.text(`${job.company} | ${job.location}`, layout.margin, y);
            y += layout.lineHeight * 1.5;
            
            job.achievements.forEach(achievement => {
                checkPageBreak(10);
                const bullet = '•';
                const bulletWidth = doc.getTextWidth(bullet + ' ');
                const textY = y;
                const textHeight = addWrappedText(achievement, {
                    x: layout.margin + bulletWidth,
                    font: fonts.body,
                    color: colors.primary,
                    maxWidth: pageWidth - (layout.margin * 2) - bulletWidth
                });
                doc.text(bullet, layout.margin, textY);
                y = textY + textHeight + 2;
            });
            y+= 5;
        });

        addSection('Key Projects');
        projects.items.forEach(project => {
            checkPageBreak(20);
            doc.setFont(fonts.h2.family, fonts.h2.style);
            doc.setFontSize(fonts.h2.size);
            doc.setTextColor(colors.primary);
            doc.text(project.title, layout.margin, y);
            y += layout.lineHeight;

            if (project.tags?.length > 0) {
                doc.setFont(fonts.italic.family, fonts.italic.style);
                doc.setFontSize(fonts.italic.size);
                doc.setTextColor(colors.secondary);
                doc.text(project.tags.join(' · '), layout.margin, y);
                y += layout.lineHeight;
            }

            const descHeight = addWrappedText(project.description, {
                x: layout.margin,
                font: fonts.body,
                color: colors.primary,
                maxWidth: pageWidth - (layout.margin * 2)
            });
            y += descHeight + 5;
        });

        // 3. Education Section
        addSection('Education');
        resume.education.forEach(edu => {
            checkPageBreak(15);
            doc.setFont(fonts.h2.family, fonts.h2.style);
            doc.setFontSize(fonts.h2.size);
            doc.setTextColor(colors.primary);
            doc.text(edu.degree, layout.margin, y);
            
            doc.setFont(fonts.small.family, fonts.small.style);
            doc.setFontSize(fonts.small.size);
            doc.setTextColor(colors.secondary);
            doc.text(edu.period, pageWidth - layout.margin, y, { align: 'right' });
            y += layout.lineHeight;

            doc.setFont(fonts.body.family, fonts.body.style);
            doc.setFontSize(fonts.body.size);
            doc.setTextColor(colors.accent);
            doc.text(edu.institution, layout.margin, y);
            y += layout.lineHeight * 2;
        });

        // 4. Skills Section
        addSection('Skills');
        const skills = about.skills.map(skill => skill.title);
        const midIndex = Math.ceil(skills.length / 2);
        const col1 = skills.slice(0, midIndex);
        const col2 = skills.slice(midIndex);

        const initialY = y;
        let yCol1 = y;
        let yCol2 = y;

        col1.forEach(skill => {
            doc.text("•", layout.margin, yCol1);
            addWrappedText(skill, { x: layout.margin + 4, y: yCol1, font: fonts.body, color: colors.primary, maxWidth: 80 });
            yCol1 += layout.lineHeight * 1.5;
        });

        col2.forEach(skill => {
            doc.text("•", layout.margin + 100, yCol2);
            addWrappedText(skill, { x: layout.margin + 104, y: yCol2, font: fonts.body, color: colors.primary, maxWidth: 80 });
            yCol2 += layout.lineHeight * 1.5;
        });

        y = Math.max(yCol1, yCol2);



        // --- Save the PDF ---
        const fileName = `${personal.name.replace(/\s+/g, '_')}_Resume_v2.pdf`;
        doc.save(fileName);
        
        showNotification('Your new resume has been downloaded!', 'success');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error generating resume. Please try again.', 'error');
    }
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
                        ${this.renderSection('Professional Summary', `<p>${(resume?.objective || hero.lede).replace(/<[^>]+>/g, '')}</p>`)}
                        ${this.renderExperience(resume)}
                        ${this.renderProjects(projects)}
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
        const contactInfo = [personal.email, personal.githubUrl, personal.phone].filter(Boolean).join('  |  ');
        return `
            <div class="preview-section preview-header-section">
                <h1>${personal.name}</h1>
                <p class="preview-title">${personal.title}</p>
                <p class="preview-contact">${contactInfo}</p>
            </div>
        `;
    },

    renderSection(title, content) {
        return `
            <div class="preview-section">
                <h2 class="preview-heading">${title}</h2>
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
                    <strong>${job.title}</strong>
                    <span>${job.period}</span>
                </div>
                <div class="preview-company">${job.company} | ${job.location}</div>
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
                    <strong>${project.title}</strong>
                </div>
                <p class="preview-project-description">${project.description}</p>
            </div>
        `).join('');
        return this.renderSection('Key Projects', content);
    },

    renderEducation(resume) {
        if (!resume.education || resume.education.length === 0) return '';
        const content = resume.education.map(edu => `
            <div class="preview-job">
                <div class="preview-job-header">
                    <strong>${edu.degree}</strong>
                    <span>${edu.period}</span>
                </div>
                <div class="preview-company">${edu.institution}</div>
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
            .preview-header-section { text-align: center; border-bottom: none; }
            .preview-header-section h1 { font-size: 36px; font-family: var(--font-serif); color: #1a202c; margin: 0 0 5px 0; }
            .preview-header-section .preview-title { font-size: 18px; color: #718096; margin: 0 0 15px 0; }
            .preview-header-section .preview-contact { font-size: 14px; color: #2E5A80; }
            .preview-heading { font-family: var(--font-helvetica); font-size: 16px; text-transform: none; letter-spacing: 0; color: #1a202c; font-weight: bold; margin: 0 0 20px 0; }
            .preview-section-content p { font-family: var(--font-serif); line-height: 1.7; color: #1a202c; }
            .preview-job, .preview-project { margin-bottom: 25px; }
            .preview-job:last-child, .preview-project:last-child { margin-bottom: 0; }
            .preview-job-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
            .preview-job-header strong { font-size: 16px; color: #1a202c; font-family: var(--font-serif); font-weight: 600; }
            .preview-job-header span { font-size: 14px; color: #718096; }
            .preview-company { font-size: 15px; color: #2E5A80; margin-bottom: 8px; }
            .preview-achievements { list-style: none; padding-left: 15px; margin: 0; }
            .preview-achievements li { position: relative; margin-bottom: 6px; font-size: 15px; line-height: 1.6; font-family: var(--font-serif); }
            .preview-achievements li:before { content: "•"; position: absolute; left: -15px; color: #718096; }
            .preview-project-description { font-size: 15px; line-height: 1.6; font-family: var(--font-serif); }
            .resume-preview-footer { display: flex; justify-content: flex-end; gap: 15px; padding: 20px 30px; border-top: 1px solid #EAEAEA; }
            .btn-primary, .btn-secondary { padding: 10px 24px; border: 1px solid; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
            .btn-primary { background: #1a202c; color: white; border-color: #1a202c; }
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