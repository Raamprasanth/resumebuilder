import {
  type GenerateResumeInput,
} from '@/ai/schemas/resume-generation';

export function generateHtmlResumeString(input: GenerateResumeInput): string {
  const { fullName, email, phone, summary, experiences, education, projects, skills, photoDataUri, templateId } = input;

  const templateStyles: Record<string, { font: string; primaryColor: string; headerBorder: string }> = {
    'template-1': { font: "'Arial', sans-serif", primaryColor: "#111", headerBorder: "#ccc" },
    'template-2': { font: "'Helvetica Neue', Helvetica, sans-serif", primaryColor: "#2563eb", headerBorder: "#2563eb" },
    'template-3': { font: "'Georgia', serif", primaryColor: "#db2777", headerBorder: "#db2777" },
    'template-4': { font: "'Verdana', sans-serif", primaryColor: "#16a34a", headerBorder: "#16a34a" },
    'template-5': { font: "'Courier New', monospace", primaryColor: "#9333ea", headerBorder: "#9333ea" },
    'template-6': { font: "'Trebuchet MS', sans-serif", primaryColor: "#ea580c", headerBorder: "#ea580c" },
    'template-7': { font: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", primaryColor: "#0d9488", headerBorder: "#0d9488" },
    'template-8': { font: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif", primaryColor: "#4f46e5", headerBorder: "#4f46e5" },
    'template-9': { font: "'Times New Roman', Times, serif", primaryColor: "#be123c", headerBorder: "#be123c" },
    'template-10': { font: "'Garamond', serif", primaryColor: "#1d4ed8", headerBorder: "#1d4ed8" },
    'template-11': { font: "'Impact', Charcoal, sans-serif", primaryColor: "#b45309", headerBorder: "#b45309" },
    'template-12': { font: "'Comic Sans MS', cursive, sans-serif", primaryColor: "#047857", headerBorder: "#047857" },
    'template-13': { font: "'Arial Black', Gadget, sans-serif", primaryColor: "#be185d", headerBorder: "#be185d" },
    'template-14': { font: "'Century Gothic', sans-serif", primaryColor: "#4338ca", headerBorder: "#4338ca" },
    'template-15': { font: "'Optima', sans-serif", primaryColor: "#c2410c", headerBorder: "#c2410c" },
    'template-16': { font: "'Candara', sans-serif", primaryColor: "#0f766e", headerBorder: "#0f766e" },
    'template-17': { font: "'Geneva', Tahoma, sans-serif", primaryColor: "#6d28d9", headerBorder: "#6d28d9" },
    'template-18': { font: "'Copperplate', 'Copperplate Gothic Light', fantasy", primaryColor: "#1e3a8a", headerBorder: "#1e3a8a" },
    'template-19': { font: "'Papyrus', fantasy", primaryColor: "#831843", headerBorder: "#831843" },
    'template-20': { font: "'Brush Script MT', cursive", primaryColor: "#14532d", headerBorder: "#14532d" },
  };

  const style = templateStyles[templateId || 'template-1'] || templateStyles['template-1'];

  const experiencesHtml = experiences.map(exp => `
    <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between;">
            <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: ${style.primaryColor};">${exp.jobTitle}</h3>
            <span style="font-size: 14px; color: #666;">${exp.startDate} - ${exp.endDate}</span>
        </div>
        <p style="margin: 2px 0 8px 0; font-size: 14px; font-weight: 500; color: #444;">${exp.company}</p>
        <p style="font-size: 13px; margin: 0; color: #555; white-space: pre-line;">${exp.jobDescription}</p>
    </div>
  `).join('');

  const educationHtml = education.map(edu => `
    <div style="margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between;">
            <h3 style="margin: 0; font-size: 15px; font-weight: bold; color: ${style.primaryColor};">${edu.degree}</h3>
            <span style="font-size: 14px; color: #666;">${edu.startDate} - ${edu.endDate}</span>
        </div>
        <p style="margin: 2px 0 0 0; font-size: 14px; color: #444;">${edu.university}</p>
    </div>
  `).join('');

  const projectsHtml = projects && projects.length > 0 ? projects.map(proj => `
    <div style="margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between;">
            <h3 style="margin: 0; font-size: 15px; font-weight: bold; color: ${style.primaryColor};">${proj.name}</h3>
            <span style="font-size: 14px; color: #666;">${proj.timeline}</span>
        </div>
        <p style="font-size: 13px; margin: 5px 0 0 0; color: #555; white-space: pre-line;">${proj.description}</p>
    </div>
  `).join('') : '';

  const baseHtml = `
<div id="resume-container" style="font-family: ${style.font}; line-height: 1.5; color: #333; background-color: #fff; width: 210mm; min-height: 297mm; padding: 25mm 20mm; box-sizing: border-box;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px;">
        <div style="flex: 1;">
            <h1 style="font-size: 32px; font-weight: bold; margin: 0 0 10px 0; color: ${style.primaryColor};">${fullName}</h1>
            <p style="font-size: 13px; margin: 0; color: #555;">${email} | ${phone}</p>
        </div>
        ${photoDataUri ? `
        <div style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden; border: 2px solid ${style.primaryColor}; flex-shrink: 0; margin-left: 20px;">
            <img src="${photoDataUri}" alt="Profile Photo" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        ` : ''}
    </div>

    <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; color: ${style.primaryColor}; border-bottom: 1px solid ${style.headerBorder}; padding-bottom: 5px;">Summary</h2>
    <p style="font-size: 13px; margin-bottom: 25px; color: #444;">${summary}</p>

    <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; color: ${style.primaryColor}; border-bottom: 1px solid ${style.headerBorder}; padding-bottom: 5px;">Experience</h2>
    ${experiencesHtml}

    <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; margin-top: 25px; color: ${style.primaryColor}; border-bottom: 1px solid ${style.headerBorder}; padding-bottom: 5px;">Education</h2>
    ${educationHtml}

    ${projectsHtml ? `
    <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; margin-top: 25px; color: ${style.primaryColor}; border-bottom: 1px solid ${style.headerBorder}; padding-bottom: 5px;">Projects</h2>
    ${projectsHtml}
    ` : ''}

    <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; margin-top: 25px; color: ${style.primaryColor}; border-bottom: 1px solid ${style.headerBorder}; padding-bottom: 5px;">Skills</h2>
    <p style="font-size: 13px; color: #444; white-space: pre-line;">${skills}</p>
</div>
  `;

  return baseHtml;
}
