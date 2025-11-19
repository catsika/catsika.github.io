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

// Show preview modal
function showPreviewModal(contentData) {
    const { personal, hero, about, projects, resume } = contentData;
    
    // Create modal HTML
    const modalHTML = `
        <div id="resumePreviewModal" class="resume-preview-modal">
            <div class="resume-preview-container">
                <div class="resume-preview-header">
                    <h2>Resume Preview</h2>
                    <button class="close-preview" onclick="closePreviewModal()">&times;</button>
                </div>
                <div class="resume-preview-content">
                    <!-- Header -->
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
                    
                    <!-- Professional Summary -->
                    <div class="preview-section">
                        <h3 class="preview-heading">PROFESSIONAL SUMMARY</h3>
                        <p>${resume.objective}</p>
                    </div>
                    
                    <!-- Core Competencies -->
                    <div class="preview-section">
                        <h3 class="preview-heading">CORE COMPETENCIES</h3>
                        <ul class="preview-meta">
                            ${hero.meta.map(item => `<li><strong>${item.label}:</strong> ${item.value}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <!-- Technical Skills -->
                    <div class="preview-section">
                        <h3 class="preview-heading">TECHNICAL SKILLS</h3>
                        ${about.skills.map(skill => `
                            <div class="preview-skill">
                                <strong>${skill.title}</strong>
                                <p>${skill.description}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Professional Experience -->
                    ${resume.experience && resume.experience.length > 0 ? `
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
                    ` : ''}
                    
                    <!-- Key Projects -->
                    <div class="preview-section">
                        <h3 class="preview-heading">KEY PROJECTS</h3>
                        ${projects.items.map(project => `
                            <div class="preview-project">
                                <div class="preview-project-header">
                                    <strong>${project.title}</strong>
                                    <span class="preview-subtitle">${project.subtitle}</span>
                                </div>
                                <p>${project.description}</p>
                                <p class="preview-tags"><strong>Technologies:</strong> ${project.tags.join(', ')}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Education -->
                    ${resume.education && resume.education.length > 0 ? `
                    <div class="preview-section">
                        <h3 class="preview-heading">EDUCATION</h3>
                        ${resume.education.map(edu => `
                            <div class="preview-edu">
                                <div class="preview-edu-header">
                                    <div>
                                        <strong>${edu.degree}</strong>
                                        <p class="preview-institution">${edu.institution}, ${edu.location}</p>
                                        ${edu.honors ? `<p class="preview-honors">${edu.honors}</p>` : ''}
                                    </div>
                                    <span class="preview-period">${edu.period}</span>
                                </div>
                                ${edu.relevant && edu.relevant.length > 0 ? `
                                    <p class="preview-coursework"><strong>Relevant Coursework:</strong> ${edu.relevant.join(', ')}</p>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    <!-- Certifications -->
                    ${resume.certifications && resume.certifications.length > 0 ? `
                    <div class="preview-section">
                        <h3 class="preview-heading">CERTIFICATIONS</h3>
                        <ul class="preview-list">
                            ${resume.certifications.map(cert => `
                                <li><strong>${cert.name}</strong> - ${cert.issuer} (${cert.date})</li>
                            `).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    <!-- Achievements -->
                    ${resume.achievements && resume.achievements.length > 0 ? `
                    <div class="preview-section">
                        <h3 class="preview-heading">KEY ACHIEVEMENTS</h3>
                        <ul class="preview-list">
                            ${resume.achievements.map(ach => `<li>${ach}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    <!-- Languages & Interests -->
                    <div class="preview-section preview-two-col">
                        ${resume.languages && resume.languages.length > 0 ? `
                        <div>
                            <h3 class="preview-heading">LANGUAGES</h3>
                            <ul class="preview-list">
                                ${resume.languages.map(lang => `<li><strong>${lang.language}:</strong> ${lang.proficiency}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                        ${resume.interests && resume.interests.length > 0 ? `
                        <div>
                            <h3 class="preview-heading">INTERESTS</h3>
                            <ul class="preview-list">
                                ${resume.interests.map(interest => `<li>${interest}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="resume-preview-footer">
                    <button class="btn-secondary" onclick="closePreviewModal()">Cancel</button>
                    <button class="btn-primary" onclick="downloadResumeFromPreview()">Download PDF</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles if not already present
    if (!document.getElementById('resumePreviewStyles')) {
        const styles = document.createElement('style');
        styles.id = 'resumePreviewStyles';
        styles.textContent = `
            .resume-preview-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .resume-preview-container {
                background: white;
                border-radius: 8px;
                max-width: 900px;
                width: 100%;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .resume-preview-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 30px;
                border-bottom: 2px solid #e0e0e0;
            }
            
            .resume-preview-header h2 {
                margin: 0;
                font-size: 24px;
                color: #121212;
            }
            
            .close-preview {
                background: none;
                border: none;
                font-size: 32px;
                color: #666;
                cursor: pointer;
                line-height: 1;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
            }
            
            .close-preview:hover {
                color: #121212;
            }
            
            .resume-preview-content {
                flex: 1;
                overflow-y: auto;
                padding: 30px;
                background: #f9f9f9;
            }
            
            .preview-section {
                background: white;
                padding: 20px;
                margin-bottom: 20px;
                border-radius: 6px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .preview-header {
                background: #326891;
                color: white;
                text-align: center;
            }
            
            .preview-header h1 {
                margin: 0 0 5px 0;
                font-size: 32px;
            }
            
            .preview-title {
                font-size: 18px;
                margin: 0 0 15px 0;
                opacity: 0.95;
            }
            
            .preview-contact {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 15px;
                font-size: 14px;
            }
            
            .preview-contact a {
                color: white;
                text-decoration: underline;
            }
            
            .preview-heading {
                color: #326891;
                font-size: 18px;
                font-weight: bold;
                margin: 0 0 15px 0;
                padding-bottom: 8px;
                border-bottom: 2px solid #326891;
            }
            
            .preview-section p {
                margin: 0 0 10px 0;
                line-height: 1.6;
                color: #333;
            }
            
            .preview-meta {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .preview-meta li {
                margin-bottom: 8px;
                color: #333;
            }
            
            .preview-skill {
                margin-bottom: 15px;
            }
            
            .preview-skill strong {
                color: #326891;
                display: block;
                margin-bottom: 5px;
            }
            
            .preview-skill p {
                color: #666;
                font-size: 14px;
                margin: 0;
            }
            
            .preview-job {
                margin-bottom: 20px;
            }
            
            .preview-job:last-child {
                margin-bottom: 0;
            }
            
            .preview-job-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 10px;
            }
            
            .preview-job-header strong {
                font-size: 16px;
                color: #121212;
                display: block;
            }
            
            .preview-company {
                color: #326891;
                margin: 3px 0 0 0;
                font-size: 14px;
            }
            
            .preview-period {
                color: #666;
                font-size: 14px;
                font-style: italic;
                white-space: nowrap;
            }
            
            .preview-achievements {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .preview-achievements li {
                position: relative;
                padding-left: 20px;
                margin-bottom: 6px;
                color: #333;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .preview-achievements li:before {
                content: "•";
                position: absolute;
                left: 0;
                color: #326891;
                font-weight: bold;
            }
            
            .preview-project {
                margin-bottom: 20px;
            }
            
            .preview-project:last-child {
                margin-bottom: 0;
            }
            
            .preview-project-header {
                display: flex;
                gap: 10px;
                align-items: baseline;
                margin-bottom: 8px;
            }
            
            .preview-project-header strong {
                color: #121212;
            }
            
            .preview-subtitle {
                color: #666;
                font-style: italic;
                font-size: 14px;
            }
            
            .preview-tags {
                color: #666;
                font-size: 14px;
                margin-top: 8px;
            }
            
            .preview-edu {
                margin-bottom: 20px;
            }
            
            .preview-edu:last-child {
                margin-bottom: 0;
            }
            
            .preview-edu-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 8px;
            }
            
            .preview-institution {
                color: #326891;
                margin: 3px 0;
                font-size: 14px;
            }
            
            .preview-honors {
                color: #666;
                font-style: italic;
                font-size: 14px;
                margin: 3px 0 0 0;
            }
            
            .preview-coursework {
                color: #666;
                font-size: 14px;
                margin-top: 8px;
            }
            
            .preview-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .preview-list li {
                position: relative;
                padding-left: 20px;
                margin-bottom: 6px;
                color: #333;
                font-size: 14px;
            }
            
            .preview-list li:before {
                content: "•";
                position: absolute;
                left: 0;
                color: #326891;
                font-weight: bold;
            }
            
            .preview-two-col {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
            }
            
            @media (max-width: 768px) {
                .preview-two-col {
                    grid-template-columns: 1fr;
                }
            }
            
            .resume-preview-footer {
                display: flex;
                justify-content: flex-end;
                gap: 15px;
                padding: 20px 30px;
                border-top: 2px solid #e0e0e0;
            }
            
            .btn-primary, .btn-secondary {
                padding: 12px 30px;
                border: none;
                border-radius: 4px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .btn-primary {
                background: #326891;
                color: white;
            }
            
            .btn-primary:hover {
                background: #2a5675;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(50, 104, 145, 0.3);
            }
            
            .btn-secondary {
                background: #e0e0e0;
                color: #333;
            }
            
            .btn-secondary:hover {
                background: #d0d0d0;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Store content data for download
    window.resumeContentData = contentData;
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

// Generate PDF Resume
async function generateResumePDF(contentData) {
    try {
        // Show loading notification
        showNotification('Generating your resume...', 'info');
        
        const jsPDF = await loadJsPDF();
        const doc = new jsPDF();
        
        const { personal, hero, about, projects, resume } = contentData;
        
        // Page dimensions and margins
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);
        let yPosition = margin;
        
        // Helper function to add new page if needed
        function checkPageBreak(requiredSpace = 20) {
            if (yPosition + requiredSpace > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
                return true;
            }
            return false;
        }
        
        // Helper function to wrap text
        function addWrappedText(text, x, y, maxWidth, lineHeight = 7) {
            const lines = doc.splitTextToSize(text, maxWidth);
            lines.forEach((line, index) => {
                checkPageBreak();
                doc.text(line, x, y + (index * lineHeight));
            });
            return lines.length * lineHeight;
        }
        
        // Colors
        const primaryColor = [50, 104, 145]; // #326891
        const darkColor = [18, 18, 18];
        const lightGray = [102, 102, 102];
        
        // === HEADER SECTION ===
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, pageWidth, 45, 'F');
        
        // Name
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text(personal.name, margin, yPosition + 15);
        
        // Title
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text(personal.title, margin, yPosition + 25);
        
        // Contact Info
        doc.setFontSize(9);
        doc.text(personal.email, margin, yPosition + 35);
        doc.text(personal.githubUrl, margin + 80, yPosition + 35);
        
        yPosition = 55;
        
        // === PROFESSIONAL SUMMARY ===
        doc.setTextColor(...darkColor);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSIONAL SUMMARY', margin, yPosition);
        
        // Draw line under heading
        yPosition += 2;
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        
        yPosition += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...darkColor);
        
        // Remove HTML tags from lede
        const cleanLede = (resume && resume.objective ? resume.objective : hero.lede)
            .replace(/<strong>/g, '')
            .replace(/<\/strong>/g, '')
            .replace(/<em>/g, '')
            .replace(/<\/em>/g, '');
        
        const ledeHeight = addWrappedText(cleanLede, margin, yPosition, contentWidth);
        yPosition += ledeHeight + 10;
        
        // === CORE COMPETENCIES ===
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('CORE COMPETENCIES', margin, yPosition);
        
        yPosition += 2;
        doc.setDrawColor(...primaryColor);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        
        yPosition += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        // Display hero meta items
        hero.meta.forEach(item => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${item.label}:`, margin, yPosition);
            doc.setFont('helvetica', 'normal');
            doc.text(item.value, margin + 35, yPosition);
            yPosition += 6;
        });
        
        yPosition += 5;
        
        // === TECHNICAL SKILLS ===
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('TECHNICAL SKILLS', margin, yPosition);
        
        yPosition += 2;
        doc.setDrawColor(...primaryColor);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        
        yPosition += 8;
        doc.setFontSize(10);
        
        about.skills.forEach(skill => {
            checkPageBreak(15);
            
            // Skill title
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...primaryColor);
            doc.text(`• ${skill.title}`, margin, yPosition);
            
            yPosition += 5;
            
            // Skill description
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...lightGray);
            const skillHeight = addWrappedText(skill.description, margin + 5, yPosition, contentWidth - 5, 5);
            yPosition += skillHeight + 3;
        });
        
        yPosition += 5;
        
        // === PROFESSIONAL EXPERIENCE ===
        if (resume && resume.experience) {
            checkPageBreak(30);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...darkColor);
            doc.text('PROFESSIONAL EXPERIENCE', margin, yPosition);
            
            yPosition += 2;
            doc.setDrawColor(...primaryColor);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            
            yPosition += 8;
            
            resume.experience.forEach((job, index) => {
                checkPageBreak(30);
                
                // Job title and company
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...darkColor);
                doc.text(job.title, margin, yPosition);
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(...primaryColor);
                doc.text(`${job.company} | ${job.location}`, margin, yPosition + 5);
                
                doc.setFontSize(9);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(...lightGray);
                doc.text(job.period, pageWidth - margin - 40, yPosition);
                
                yPosition += 10;
                
                // Achievements
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(...darkColor);
                
                job.achievements.forEach(achievement => {
                    checkPageBreak(10);
                    const bulletHeight = addWrappedText(`• ${achievement}`, margin + 5, yPosition, contentWidth - 5, 5);
                    yPosition += bulletHeight + 2;
                });
                
                yPosition += 5;
            });
            
            yPosition += 3;
        }
        
        // === KEY PROJECTS ===
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...darkColor);
        doc.text('KEY PROJECTS', margin, yPosition);
        yPosition += 2;
        doc.setDrawColor(...primaryColor);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;
        doc.setFontSize(10);
        projects.items.forEach((project, index) => {
            checkPageBreak(18);
            // Title and subtitle on one line
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...darkColor);
            let titleText = project.title;
            doc.text(titleText, margin, yPosition);
            if (project.subtitle) {
                doc.setFont('helvetica', 'italic');
                doc.setFontSize(9);
                doc.setTextColor(...lightGray);
                doc.text(project.subtitle, margin + 60, yPosition);
            }
            yPosition += 5;
            // Description as bullet
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(...darkColor);
            const descHeight = addWrappedText(`• ${project.description}`, margin + 5, yPosition, contentWidth - 10, 5);
            yPosition += descHeight;
            // Technologies as muted line
            if (project.tags && project.tags.length > 0) {
                doc.setFont('helvetica', 'italic');
                doc.setFontSize(8);
                doc.setTextColor(...lightGray);
                doc.text(project.tags.join(', '), margin + 10, yPosition);
                yPosition += 6;
            } else {
                yPosition += 2;
            }
        });
        
        // === EDUCATION ===
        if (resume && resume.education) {
            yPosition += 5;
            checkPageBreak(30);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...darkColor);
            doc.text('EDUCATION', margin, yPosition);
            
            yPosition += 2;
            doc.setDrawColor(...primaryColor);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            
            yPosition += 8;
            
            resume.education.forEach(edu => {
                checkPageBreak(20);
                
                // Degree
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...darkColor);
                doc.text(edu.degree, margin, yPosition);
                
                doc.setFontSize(9);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(...lightGray);
                doc.text(edu.period, pageWidth - margin - 30, yPosition);
                
                yPosition += 5;
                
                // Institution
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(...primaryColor);
                doc.text(`${edu.institution}, ${edu.location}`, margin, yPosition);
                
                yPosition += 5;
                
                // Honors
                if (edu.honors) {
                    doc.setFont('helvetica', 'italic');
                    doc.setFontSize(9);
                    doc.setTextColor(...lightGray);
                    doc.text(edu.honors, margin, yPosition);
                    yPosition += 5;
                }
                
                // Relevant coursework
                if (edu.relevant && edu.relevant.length > 0) {
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(9);
                    doc.setTextColor(...darkColor);
                    doc.text('Relevant Coursework:', margin, yPosition);
                    yPosition += 4;
                    
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(...lightGray);
                    const courseHeight = addWrappedText(edu.relevant.join(', '), margin + 5, yPosition, contentWidth - 5, 4);
                    yPosition += courseHeight + 5;
                }
                
                yPosition += 3;
            });
        }
        
        // === CERTIFICATIONS ===
        if (resume && resume.certifications && resume.certifications.length > 0) {
            yPosition += 5;
            checkPageBreak(30);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...darkColor);
            doc.text('CERTIFICATIONS', margin, yPosition);
            
            yPosition += 2;
            doc.setDrawColor(...primaryColor);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            
            yPosition += 8;
            doc.setFontSize(10);
            
            resume.certifications.forEach(cert => {
                checkPageBreak(8);
                
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...darkColor);
                doc.text(`• ${cert.name}`, margin, yPosition);
                
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(...lightGray);
                doc.text(`- ${cert.issuer} (${cert.date})`, margin + 5, yPosition + 4);
                
                yPosition += 9;
            });
            
            yPosition += 3;
        }
        
        // === ACHIEVEMENTS ===
        if (resume && resume.achievements && resume.achievements.length > 0) {
            yPosition += 5;
            checkPageBreak(30);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...darkColor);
            doc.text('KEY ACHIEVEMENTS', margin, yPosition);
            
            yPosition += 2;
            doc.setDrawColor(...primaryColor);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            
            yPosition += 8;
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...darkColor);
            
            resume.achievements.forEach(achievement => {
                checkPageBreak(8);
                const achHeight = addWrappedText(`• ${achievement}`, margin, yPosition, contentWidth, 5);
                yPosition += achHeight + 2;
            });
            
            yPosition += 3;
        }
        
        // === LANGUAGES & INTERESTS ===
        if ((resume && resume.languages) || (resume && resume.interests)) {
            yPosition += 5;
            checkPageBreak(25);
            
            const halfWidth = (contentWidth / 2) - 5;
            let leftY = yPosition;
            let rightY = yPosition;
            
            // Languages
            if (resume.languages && resume.languages.length > 0) {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...darkColor);
                doc.text('LANGUAGES', margin, leftY);
                
                leftY += 2;
                doc.setDrawColor(...primaryColor);
                doc.line(margin, leftY, margin + halfWidth, leftY);
                
                leftY += 6;
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                
                resume.languages.forEach(lang => {
                    checkPageBreak(6);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(...darkColor);
                    doc.text(`• ${lang.language}:`, margin, leftY);
                    
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(...lightGray);
                    doc.text(lang.proficiency, margin + 25, leftY);
                    
                    leftY += 5;
                });
            }
            
            // Interests
            if (resume.interests && resume.interests.length > 0) {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...darkColor);
                doc.text('INTERESTS', margin + halfWidth + 10, rightY);
                
                rightY += 2;
                doc.setDrawColor(...primaryColor);
                doc.line(margin + halfWidth + 10, rightY, pageWidth - margin, rightY);
                
                rightY += 6;
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(...darkColor);
                
                resume.interests.forEach(interest => {
                    checkPageBreak(6);
                    doc.text(`• ${interest}`, margin + halfWidth + 10, rightY);
                    rightY += 5;
                });
            }
            
            yPosition = Math.max(leftY, rightY) + 5;
        }
        
        // === FOOTER ===
        const footerY = pageHeight - 15;
        doc.setFontSize(8);
        doc.setTextColor(...lightGray);
        doc.setFont('helvetica', 'italic');
        const currentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        doc.text(`Generated on ${currentDate}`, pageWidth / 2, footerY, { align: 'center' });
        
        // Add page numbers
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(...lightGray);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, footerY, { align: 'right' });
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
