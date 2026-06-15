import {
  type GenerateResumeInput,
} from '@/ai/schemas/resume-generation';

export function generateHtmlResumeString(input: GenerateResumeInput): string {
  const { fullName, email, phone, summary, experiences, education, projects, skills, photoDataUri } = input;

  const experiencesHtml = experiences.map(exp => `
    <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between;">
            <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">${exp.jobTitle}</h3>
            <span style="font-size: 14px; color: #666;">${exp.startDate} - ${exp.endDate}</span>
        </div>
        <p style="margin: 2px 0 8px 0; font-size: 14px; font-weight: 500; color: #444;">${exp.company}</p>
        <p style="font-size: 13px; margin: 0; color: #555; white-space: pre-line;">${exp.jobDescription}</p>
    </div>
  `).join('');

  const educationHtml = education.map(edu => `
    <div style="margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between;">
            <h3 style="margin: 0; font-size: 15px; font-weight: bold; color: #333;">${edu.degree}</h3>
            <span style="font-size: 14px; color: #666;">${edu.startDate} - ${edu.endDate}</span>
        </div>
        <p style="margin: 2px 0 0 0; font-size: 14px; color: #444;">${edu.university}</p>
    </div>
  `).join('');

  const projectsHtml = projects && projects.length > 0 ? projects.map(proj => `
    <div style="margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between;">
            <h3 style="margin: 0; font-size: 15px; font-weight: bold; color: #333;">${proj.name}</h3>
            <span style="font-size: 14px; color: #666;">${proj.timeline}</span>
        </div>
        <p style="font-size: 13px; margin: 5px 0 0 0; color: #555; white-space: pre-line;">${proj.description}</p>
    </div>
  `).join('') : '';

  const baseHtml = `
<div id="resume-container" style="font-family: 'Arial', sans-serif; line-height: 1.5; color: #333; background-color: #fff; width: 210mm; min-height: 297mm; padding: 25mm 20mm; box-sizing: border-box;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px;">
        <div style="flex: 1;">
            <h1 style="font-size: 32px; font-weight: bold; margin: 0 0 10px 0; color: #111;">${fullName}</h1>
            <p style="font-size: 13px; margin: 0; color: #555;">${email} | ${phone}</p>
        </div>
        ${photoDataUri ? `
        <div style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden; border: 2px solid #ddd; flex-shrink: 0; margin-left: 20px;">
            <img src="${photoDataUri}" alt="Profile Photo" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        ` : ''}
    </div>

    <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; color: #222; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Summary</h2>
    <p style="font-size: 13px; margin-bottom: 25px; color: #444;">${summary}</p>

    <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; color: #222; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Experience</h2>
    ${experiencesHtml}

    <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; margin-top: 25px; color: #222; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Education</h2>
    ${educationHtml}

    ${projectsHtml ? `
    <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; margin-top: 25px; color: #222; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Projects</h2>
    ${projectsHtml}
    ` : ''}

    <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; margin-top: 25px; color: #222; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Skills</h2>
    <p style="font-size: 13px; color: #444; white-space: pre-line;">${skills}</p>
</div>
  `;

  if (input.templateId === 'modern') {
    return baseHtml.replace(/font-family: 'Arial', sans-serif;/g, "font-family: 'Helvetica Neue', Helvetica, sans-serif;").replace(/color: #111;/g, "color: #2563eb;");
  }
  if (input.templateId === 'creative') {
    return baseHtml.replace(/font-family: 'Arial', sans-serif;/g, "font-family: 'Georgia', serif;").replace(/color: #111;/g, "color: #db2777;");
  }
  
  return baseHtml;
}
