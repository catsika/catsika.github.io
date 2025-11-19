// PDF Resume Generator
// Generates a professional PDF resume from content.json data

// Load jsPDF library dynamically if not already loaded
function loadJsPDF() {
    return new Promise((resolve, reject) => {
        if (window.jspdf) {
            resolve(window.jspdf.jsPDF);
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
            resolve(window.jspdf.jsPDF);
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Resume Preview Generator
const resumePreview = {
    // Main function to create and show the modal
    show(contentData) {
        // Remove any existing modal before adding a new one
        const existingModal = document.getElementById('resumePreviewModal');
        if (existingModal) {
            existingModal.remove();
        }

        const { personal, hero, about, projects, resume } = contentData;
        
        const modalHTML = `
            <div id="resumePreviewModal" class="resume-preview-modal">
                <div class="resume-preview-container">
                    <div class="resume-preview-header">
                        <h2>Resume Preview</h2>
                        <button class="close-preview" onclick="closePreviewModal()">&times;</button>
                    </div>
                    <div class="resume-preview-content">
                        ${this.renderHeader(personal)}
                        ${this.renderSummary(resume)}
                        ${this.renderCompetencies(hero)}
                        ${this.renderSkills(about)}
                        ${this.renderExperience(resume)}
                        ${this.renderProjects(projects)}
                        ${this.renderEducation(resume)}
                        ${this.renderCertifications(resume)}
                        ${this.renderAchievements(resume)}
                        ${this.renderLanguagesAndInterests(resume)}
                    </div>
                    <div class="resume-preview-footer">
                        <button class="btn-secondary" onclick="closePreviewModal()">Cancel</button>
                        <button class="btn-primary" onclick="downloadResumeFromPreview()">Download PDF</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addStyles();
        window.resumeContentData = contentData;
    },

    // Render different sections
    renderHeader(personal) {
        return `
            <div class="preview-section preview-header">
                <h1>${personal.name}</h1>
                <p class="preview-title">${personal.title}</p>
                <div class="preview-contact">
                    <span>${personal.email}</span>
                    ${personal.phone ? `<span>${personal.phone}</span>` : ''}
                    <span>${personal.location || ''}</span>
                    <span><a href="${personal.githubUrl}" target="_blank">${personal.githubUrl}</a></span>
                </div>
            </div>
        `;
    },

    renderSummary(resume) {
        return `
            <div class="preview-section">
                <h3 class="preview-heading">PROFESSIONAL SUMMARY</h3>
                <p>${resume.objective}</p>
            </div>
        `;
    },

    renderCompetencies(hero) {
        return `
            <div class="preview-section">
                <h3 class="preview-heading">CORE COMPETENCIES</h3>
                <ul class="preview-meta">
                    ${hero.meta.map(item => `<li><strong>${item.label}:</strong> ${item.value}</li>`).join('')}
                </ul>
            </div>
        `;
    },

    renderSkills(about) {
        return `
            <div class="preview-section">
                <h3 class="preview-heading">TECHNICAL SKILLS</h3>
                ${about.skills.map(skill => `
                    <div class="preview-skill">
                        <strong>${skill.title}</strong>
                        <p>${skill.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderExperience(resume) {
        if (!resume.experience || resume.experience.length === 0) return '';
        return `
            <div class="preview-section">
                <h3 class="preview-heading">PROFESSIONAL EXPERIENCE</h3>
                ${resume.experience.map(job => `
                    <div class="preview-job">
                        <div class="preview-job-header">
                            <div>
                                <strong>${job.title}</strong>
                                <p class="preview-company">${job.company} | ${job.location}</p>
                            </div>
                            <span class="preview-period">${job.period}</span>
                        </div>
                        <ul class="preview-achievements">
                            ${job.achievements.map(ach => `<li>${ach}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderProjects(projects) {
        return `
            <div class="preview-section">
                <h3 class="preview-heading">KEY PROJECTS</h3>
                ${projects.items.map(project => `
                    <div class="preview-project">
                        <div class="preview-project-header">
                            <strong>${project.title}</strong>
                            <span class="preview-subtitle">${project.subtitle}</span>
                        </div>
                        <p class="preview-project-description">${project.description}</p>
                        <p class="preview-tags"><strong>Technologies:</strong> ${project.tags.join(', ')}</p>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderEducation(resume) {
        if (!resume.education || resume.education.length === 0) return '';
        return `
            <div class="preview-section">
                <h3 class="preview-heading">EDUCATION</h3>
                ${resume.education.map(edu => `
                    <div class="preview-edu">
                        <div class="preview-edu-header">
                            <div>
                                <strong>${edu.degree}</strong>
                                <p class="preview-institution">${edu.institution}, ${edu.location}</p>
                                ${edu.honors && edu.honors.length > 0 ? `<p class="preview-honors">${edu.honors.join(', ')}</p>` : ''}
                            </div>
                            <span class="preview-period">${edu.period}</span>
                        </div>
                        ${edu.relevant && edu.relevant.length > 0 ? `
                            <p class="preview-coursework"><strong>Relevant Coursework:</strong> ${edu.relevant.join(', ')}</p>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderCertifications(resume) {
        if (!resume.certifications || resume.certifications.length === 0) return '';
        return `
            <div class="preview-section">
                <h3 class="preview-heading">CERTIFICATIONS</h3>
                <ul class="preview-list">
                    ${resume.certifications.map(cert => `
                        <li><strong>${cert.name}</strong> - ${cert.issuer} (${cert.date})</li>
                    `).join('')}
                </ul>
            </div>
        `;
    },

    renderAchievements(resume) {
        if (!resume.achievements || resume.achievements.length === 0) return '';
        return `
            <div class="preview-section">
                <h3 class="preview-heading">KEY ACHIEVEMENTS</h3>
                <ul class="preview-list">
                    ${resume.achievements.map(ach => `<li>${ach}</li>`).join('')}
                </ul>
            </div>
        `;
    },

    renderLanguagesAndInterests(resume) {
        const languages = (resume.languages && resume.languages.length > 0) ? `
            <div>
                <h3 class="preview-heading">LANGUAGES</h3>
                <ul class="preview-list">
                    ${resume.languages.map(lang => `<li><strong>${lang.language}:</strong> ${lang.proficiency}</li>`).join('')}
                </ul>
            </div>
        ` : '';
        const interests = (resume.interests && resume.interests.length > 0) ? `
            <div>
                <h3 class="preview-heading">INTERESTS</h3>
                <ul class="preview-list">
                    ${resume.interests.map(interest => `<li>${interest}</li>`).join('')}
                </ul>
            </div>
        ` : '';

        if (!languages && !interests) return '';
        
        return `<div class="preview-section preview-two-col">${languages}${interests}</div>`;
    },
    
    // Add modal styles to the page
    addStyles() {
        if (document.getElementById('resumePreviewStyles')) return;
        const styles = document.createElement('style');
        styles.id = 'resumePreviewStyles';
        styles.textContent = `
            .resume-preview-modal {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center;
                z-index: 10000; padding: 20px; animation: fadeIn 0.3s ease;
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            .resume-preview-container {
                background: white; border-radius: 8px; max-width: 900px; width: 100%;
                max-height: 90vh; display: flex; flex-direction: column;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); animation: slideUp 0.3s ease;
            }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .resume-preview-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 20px 30px; border-bottom: 2px solid #e0e0e0;
            }
            .resume-preview-header h2 { margin: 0; font-size: 24px; color: #121212; }
            .close-preview {
                background: none; border: none; font-size: 32px; color: #666; cursor: pointer;
                line-height: 1; padding: 0; width: 32px; height: 32px;
                display: flex; align-items: center; justify-content: center; transition: color 0.2s;
            }
            .close-preview:hover { color: #121212; }
            .resume-preview-content { flex: 1; overflow-y: auto; padding: 30px; background: #f9f9f9; }
            .preview-section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
            .preview-header { background: #326891; color: white; text-align: center; }
            .preview-header h1 { margin: 0 0 5px 0; font-size: 32px; }
            .preview-title { font-size: 18px; margin: 0 0 15px 0; opacity: 0.95; }
            .preview-contact { display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; font-size: 14px; }
            .preview-contact a { color: white; text-decoration: underline; }
            .preview-heading { color: #326891; font-size: 18px; font-weight: bold; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #326891; }
            .preview-section p { margin: 0 0 10px 0; line-height: 1.6; color: #333; }
            .preview-meta, .preview-list { list-style: none; padding: 0; margin: 0; }
            .preview-meta li, .preview-list li { margin-bottom: 8px; color: #333; }
            .preview-skill { margin-bottom: 15px; }
            .preview-skill strong { color: #326891; display: block; margin-bottom: 5px; }
            .preview-skill p { color: #666; font-size: 14px; margin: 0; }
            .preview-job { margin-bottom: 20px; }
            .preview-job:last-child { margin-bottom: 0; }
            .preview-job-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
            .preview-job-header strong { font-size: 16px; color: #121212; display: block; }
            .preview-company { color: #326891; margin: 3px 0 0 0; font-size: 14px; }
            .preview-period { color: #666; font-size: 14px; font-style: italic; white-space: nowrap; }
            .preview-achievements { list-style: none; padding: 0; margin: 0; }
            .preview-achievements li { position: relative; padding-left: 20px; margin-bottom: 6px; color: #333; font-size: 14px; line-height: 1.5; }
            .preview-achievements li:before { content: "•"; position: absolute; left: 0; color: #326891; font-weight: bold; }
            .preview-project { margin-bottom: 20px; }
            .preview-project:last-child { margin-bottom: 0; }
            .preview-project-header { display: flex; gap: 10px; align-items: baseline; margin-bottom: 8px; }
            .preview-project-header strong { color: #121212; }
            .preview-subtitle { color: #666; font-style: italic; font-size: 14px; }
            .preview-project-description { font-size: 14px; margin-bottom: 10px; color: #333; line-height: 1.6; }
            .preview-tags { color: #666; font-size: 14px; margin-top: 8px; }
            .preview-edu { margin-bottom: 20px; }
            .preview-edu:last-child { margin-bottom: 0; }
            .preview-edu-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
            .preview-institution { color: #326891; margin: 3px 0; font-size: 14px; }
            .preview-honors { color: #666; font-style: italic; font-size: 14px; margin: 3px 0 0 0; }
            .preview-coursework { color: #666; font-size: 14px; margin-top: 8px; }
            .preview-list li { position: relative; padding-left: 20px; margin-bottom: 6px; font-size: 14px; }
            .preview-list li:before { content: "•"; position: absolute; left: 0; color: #326891; font-weight: bold; }
            .preview-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
            @media (max-width: 768px) { .preview-two-col { grid-template-columns: 1fr; } }
            .resume-preview-footer { display: flex; justify-content: flex-end; gap: 15px; padding: 20px 30px; border-top: 2px solid #e0e0e0; }
            .btn-primary, .btn-secondary { padding: 12px 30px; border: none; border-radius: 4px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
            .btn-primary { background: #326891; color: white; }
            .btn-primary:hover { background: #2a5675; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(50, 104, 145, 0.3); }
            .btn-secondary { background: #e0e0e0; color: #333; }
            .btn-secondary:hover { background: #d0d0d0; }
        `;
        document.head.appendChild(styles);
    }
};

// Show preview modal
function showPreviewModal(contentData) {
    resumePreview.show(contentData);
}

// Close preview modal
function closePreviewModal() {
    const modal = document.getElementById('resumePreviewModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

// Download resume from preview
async function downloadResumeFromPreview() {
    closePreviewModal();
    if (window.resumeContentData) {
        await generateResumePDF(window.resumeContentData);
    }
}

// Make functions global
window.closePreviewModal = closePreviewModal;
window.downloadResumeFromPreview = downloadResumeFromPreview;

// PDF Theme for easy customization
const pdfTheme = {
    colors: {
        primary: [50, 104, 145], // #326891
        dark: [18, 18, 18],
        lightGray: [102, 102, 102],
        white: [255, 255, 255]
    },
    fonts: {
        header: {
            family: 'helvetica',
            style: 'bold',
            size: 28
        },
        title: {
            family: 'helvetica',
            style: 'normal',
            size: 14
        },
        contact: {
            family: 'helvetica',
            style: 'normal',
            size: 9
        },
        h1: {
            family: 'helvetica',
            style: 'bold',
            size: 14
        },
        h2: {
            family: 'helvetica',
            style: 'bold',
            size: 11
        },
        body: {
            family: 'helvetica',
            style: 'normal',
            size: 10
        },
        bodyBold: {
            family: 'helvetica',
            style: 'bold',
            size: 10
        },
        small: {
            family: 'helvetica',
            style: 'normal',
            size: 9
        },
        smallBold: {
            family: 'helvetica',
            style: 'bold',
            size: 9
        },
        extraSmall: { // New font definition
            family: 'helvetica',
            style: 'normal',
            size: 8
        },
        italic: {
            family: 'helvetica',
            style: 'italic',
            size: 9
        }
    },
    layout: {
        margin: 20,
        lineHeight: 5
    }
};

// Generate PDF Resume
async function generateResumePDF(contentData) {
    try {
        showNotification('Generating your resume...', 'info');
        
        const jsPDF = await loadJsPDF();
        const doc = new jsPDF();
        
        const { personal, hero, about, projects, resume } = contentData;
        const { colors, fonts, layout } = pdfTheme;
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = pageWidth - (layout.margin * 2);
        let yPosition = layout.margin;

        // Helper to check for page breaks
        const checkPageBreak = (requiredSpace = 20) => {
            if (yPosition + requiredSpace > doc.internal.pageSize.getHeight() - layout.margin) {
                doc.addPage();
                yPosition = layout.margin;
                return true;
            }
            return false;
        };
        
        // Helper to add wrapped text
        const addWrappedText = (text, options) => {
            const { x, y, maxWidth, font, color, lineHeight } = {
                x: layout.margin,
                y: yPosition,
                maxWidth: contentWidth,
                font: fonts.body,
                color: colors.dark,
                lineHeight: layout.lineHeight,
                ...options
            };
            doc.setFont(font.family, font.style);
            doc.setFontSize(font.size);
            doc.setTextColor(...color);

            const lines = doc.splitTextToSize(text, maxWidth);
            lines.forEach((line, index) => {
                checkPageBreak();
                doc.text(line, x, y + (index * lineHeight));
            });
            return lines.length * lineHeight;
        };

        // Helper to add a section heading
        const addSection = (title) => {
            checkPageBreak(20);
            yPosition += 10;
            doc.setFont(fonts.h1.family, fonts.h1.style);
            doc.setFontSize(fonts.h1.size);
            doc.setTextColor(...colors.dark);
            doc.text(title, layout.margin, yPosition);
            
            yPosition += 2;
            doc.setDrawColor(...colors.primary);
            doc.setLineWidth(0.5);
            doc.line(layout.margin, yPosition, pageWidth - layout.margin, yPosition);
            yPosition += 8;
        };

        // === HEADER SECTION ===
        doc.setFillColor(...colors.primary);
        doc.rect(0, 0, pageWidth, 45, 'F');
        doc.setTextColor(...colors.white);
        
        doc.setFont(fonts.header.family, fonts.header.style);
        doc.setFontSize(fonts.header.size);
        doc.text(personal.name, layout.margin, yPosition + 15);
        
        doc.setFont(fonts.title.family, fonts.title.style);
        doc.setFontSize(fonts.title.size);
        doc.text(personal.title, layout.margin, yPosition + 25);
        
        doc.setFont(fonts.contact.family, fonts.contact.style);
        doc.setFontSize(fonts.contact.size);
        doc.text(personal.email, layout.margin, yPosition + 35);
        doc.text(personal.githubUrl, layout.margin + 80, yPosition + 35);
        
        yPosition = 55;

        // === PROFESSIONAL SUMMARY ===
        addSection('PROFESSIONAL SUMMARY');
        const summary = (resume?.objective || hero.lede).replace(/<[^>]+>/g, '');
        const summaryHeight = addWrappedText(summary, { y: yPosition });
        yPosition += summaryHeight;

        // === CORE COMPETENCIES ===
        addSection('CORE COMPETENCIES');
        hero.meta.forEach(item => {
            checkPageBreak(6);
            addWrappedText(`${item.label}:`, { y: yPosition, font: fonts.h2, color: colors.dark });
            addWrappedText(item.value, { x: layout.margin + 35, y: yPosition });
            yPosition += 6;
        });

        // === TECHNICAL SKILLS ===
        addSection('TECHNICAL SKILLS');
        about.skills.forEach(skill => {
            checkPageBreak(15);
            addWrappedText(`• ${skill.title}`, { y: yPosition, font: fonts.h2, color: colors.primary });
            yPosition += 5;
            const skillHeight = addWrappedText(skill.description, { x: layout.margin + 5, y: yPosition, color: colors.lightGray, font: fonts.small });
            yPosition += skillHeight + 3;
        });
        
        // === PROFESSIONAL EXPERIENCE ===
        if (resume?.experience) {
            addSection('PROFESSIONAL EXPERIENCE');
            resume.experience.forEach(job => {
                checkPageBreak(30);
                addWrappedText(job.title, { y: yPosition, font: fonts.h2 });
                addWrappedText(`${job.company} | ${job.location}`, { y: yPosition + 5, font: fonts.body, color: colors.primary });
                addWrappedText(job.period, { x: pageWidth - layout.margin - 40, y: yPosition, font: fonts.italic, color: colors.lightGray });
                yPosition += 10;

                job.achievements.forEach(achievement => {
                    checkPageBreak(10);
                    const bulletHeight = addWrappedText(`• ${achievement}`, { x: layout.margin + 5, y: yPosition, font: fonts.small });
                    yPosition += bulletHeight + 2;
                });
                yPosition += 5;
            });
        }
        
        // === KEY PROJECTS ===
        addSection('KEY PROJECTS');
        projects.items.forEach(project => {
            checkPageBreak(18);
            addWrappedText(project.title, { y: yPosition, font: fonts.smallBold });
            if (project.subtitle) {
                addWrappedText(project.subtitle, { x: layout.margin + 60, y: yPosition, font: fonts.italic, color: colors.lightGray });
            }
            yPosition += 4; // Reduced from 5
            const descHeight = addWrappedText(`• ${project.description}`, { x: layout.margin + 5, y: yPosition, font: fonts.extraSmall });
            yPosition += descHeight + 1; // Reduced from +3

            if (project.tags?.length > 0) {
                addWrappedText(project.tags.join(', '), { x: layout.margin + 10, y: yPosition, font: fonts.extraSmall, color: colors.lightGray });
                yPosition += 5; // Reduced from 6
            } else {
                yPosition += 1; // Reduced from 2
            }
        });

        // === EDUCATION ===
        if (resume?.education) {
            addSection('EDUCATION');
            resume.education.forEach(edu => {
                checkPageBreak(20);
                addWrappedText(edu.degree, { y: yPosition, font: fonts.h2 });
                addWrappedText(edu.period, { x: pageWidth - layout.margin - 30, y: yPosition, font: fonts.italic, color: colors.lightGray });
                yPosition += 5;
                addWrappedText(`${edu.institution}, ${edu.location}`, { y: yPosition, color: colors.primary });
                yPosition += 5;

                if (edu.honors) {
                    addWrappedText(edu.honors, { y: yPosition, font: fonts.italic, color: colors.lightGray });
                    yPosition += 5;
                }
                if (edu.relevant?.length > 0) {
                    addWrappedText('Relevant Coursework:', { y: yPosition, font: fonts.h2 });
                    yPosition += 4;
                    const courseHeight = addWrappedText(edu.relevant.join(', '), { x: layout.margin + 5, y: yPosition, font: fonts.small, color: colors.lightGray });
                    yPosition += courseHeight + 5;
                }
                yPosition += 3;
            });
        }

        // Helper for creating multi-column layouts
        const createMultiColumn = (columns, y) => {
            const numColumns = columns.length;
            const columnWidth = (contentWidth - (numColumns - 1) * 10) / numColumns;
            let maxY = y;

            columns.forEach((column, index) => {
                let currentY = y;
                const x = layout.margin + index * (columnWidth + 10);
                
                addWrappedText(column.title, { x, y: currentY, font: fonts.h2, color: colors.dark });
                currentY += 2;
                doc.setDrawColor(...colors.primary);
                doc.line(x, currentY, x + columnWidth, currentY);
                currentY += 6;

                column.items.forEach(item => {
                    checkPageBreak(6);
                    const itemHeight = addWrappedText(item, { x: x, y: currentY, maxWidth: columnWidth, font: fonts.small });
                    currentY += itemHeight + 2;
                });

                if (currentY > maxY) {
                    maxY = currentY;
                }
            });

            return maxY;
        };

        // === LANGUAGES & INTERESTS ===
        if (resume?.languages || resume?.interests) {
            addSection('LANGUAGES & INTERESTS');
            const columns = [];
            if (resume.languages?.length > 0) {
                columns.push({
                    title: 'LANGUAGES',
                    items: resume.languages.map(lang => `• ${lang.language}: ${lang.proficiency}`)
                });
            }
            if (resume.interests?.length > 0) {
                columns.push({
                    title: 'INTERESTS',
                    items: resume.interests.map(interest => `• ${interest}`)
                });
            }
            yPosition = createMultiColumn(columns, yPosition);
        }

        // === FOOTER ===
        const footerY = doc.internal.pageSize.getHeight() - 15;
        doc.setFont(fonts.italic.family, fonts.italic.style);
        doc.setFontSize(fonts.italic.size);
        doc.setTextColor(...colors.lightGray);
        const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        doc.text(`Generated on ${currentDate}`, pageWidth / 2, footerY, { align: 'center' });
        
        // Add page numbers
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - layout.margin, footerY, { align: 'right' });
        }
        
        // Save the PDF
        const fileName = `${personal.name.replace(/\s+/g, '_')}_Resume.pdf`;
        doc.save(fileName);
        
        showNotification('Resume downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error generating resume. Please try again.', 'error');
    }
}


// Initialize resume generator
function initResumeGenerator() {
    // Find all resume links
    const resumeLinks = document.querySelectorAll('a[href*="resume"]');
    
    resumeLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Wait for content to be loaded
            if (!contentData) {
                showNotification('Please wait for content to load...', 'info');
                setTimeout(() => {
                    if (contentData) {
                        showPreviewModal(contentData);
                    } else {
                        showNotification('Content not available. Please refresh the page.', 'error');
                    }
                }, 1000);
                return;
            }
            
            // Show preview modal instead of directly downloading
            showPreviewModal(contentData);
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for content to load
    setTimeout(initResumeGenerator, 500);
});

// Also initialize when content is loaded
window.addEventListener('contentLoaded', initResumeGenerator);
