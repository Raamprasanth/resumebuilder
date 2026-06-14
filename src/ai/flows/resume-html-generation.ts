'use server';

import {
  type GenerateResumeInput,
  type GenerateResumeOutput,
} from '@/ai/schemas/resume-generation';

export async function generateHtmlResume(input: GenerateResumeInput): Promise<GenerateResumeOutput> {
  const { template, fullName, email, phone, summary, experiences, education, skills } = input;

  let htmlContent = '';

  if (template === 'elegant') {
    const experiencesHtml = experiences.map(exp => `
    <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between;">
            <h3 style="margin: 0; font-size: 17px; font-weight: bold; color: #2c3e50;">${exp.jobTitle}</h3>
            <span style="font-size: 14px; font-style: italic; color: #555;">${exp.startDate} - ${exp.endDate}</span>
        </div>
        <p style="margin: 2px 0 8px 0; font-size: 15px; font-style: italic; color: #7f8c8d;">${exp.company}</p>
        <p style="font-size: 14px; margin-left: 15px; color: #333; white-space: pre-line;">${exp.jobDescription}</p>
    </div>
    `).join('');

    const educationHtml = education.map(edu => `
            <div style="margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 17px; font-weight: bold; color: #2c3e50;">${edu.degree}</h3>
                <p style="margin: 2px 0; font-size: 15px; font-style: italic; color: #7f8c8d;">${edu.university}</p>
                <p style="margin: 0; font-size: 14px; font-style: italic; color: #555;">${edu.startDate} - ${edu.endDate}</p>
            </div>
    `).join('');

    htmlContent = `
<div id="resume-container" style="font-family: 'Garamond', 'Baskerville', 'Times New Roman', serif; line-height: 1.5; color: #1a1a1a; background-color: #f9f9f9; width: 210mm; min-height: 297mm; padding: 25mm 30mm; border: 1px solid #ddd;">
    <h1 style="font-size: 42px; font-weight: normal; text-align: center; letter-spacing: 2px; margin: 0 0 5px 0; color: #2c3e50;">${fullName}</h1>
    <p style="text-align: center; font-size: 14px; margin-bottom: 25px; color: #555;">${email} &nbsp;&bull;&nbsp; ${phone}</p>

    <p style="text-align: center; font-size: 16px; font-style: italic; margin: 0 10% 25px 10%; color: #34495e;">${summary}</p>

    <hr style="border: 0; height: 1.5px; background-color: #3498db; margin: 25px 0;">

    <h2 style="font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 15px; color: #3498db; border-bottom: 1px solid #ecf0f1; padding-bottom: 5px;">Experience</h2>
    ${experiencesHtml}

    <hr style="border: 0; height: 1px; background-color: #ecf0f1; margin: 25px 0;">

    <div style="display: flex; justify-content: space-between;">
        <div style="width: 48%;">
            <h2 style="font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 15px; color: #3498db; border-bottom: 1px solid #ecf0f1; padding-bottom: 5px;">Education</h2>
            ${educationHtml}
        </div>
        <div style="width: 48%;">
            <h2 style="font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 15px; color: #3498db; border-bottom: 1px solid #ecf0f1; padding-bottom: 5px;">Skills</h2>
            <p style="font-size: 14px; color: #333; white-space: pre-line;">${skills}</p>
        </div>
    </div>
</div>
    `;
  } else if (template === 'professional') {
    const experiencesHtml = experiences.map(exp => `
        <div style="margin-bottom: 20px; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #222;">${exp.jobTitle}</h3>
                <span style="font-size: 14px; font-weight: 500; color: #666;">${exp.startDate} &ndash; ${exp.endDate}</span>
            </div>
            <p style="margin: 2px 0 10px 0; font-size: 16px; font-style: italic; color: #555;">${exp.company}</p>
            <p style="font-size: 14px; margin-left: 20px; color: #444; white-space: pre-line;">${exp.jobDescription}</p>
        </div>
    `).join('');

    const educationHtml = education.map(edu => `
                <div style="margin-bottom: 15px;">
                    <h3 style="margin: 0; font-size: 17px; font-weight: 600; color: #222;">${edu.degree}</h3>
                    <p style="margin: 2px 0; font-size: 15px; color: #555;">${edu.university}</p>
                    <p style="margin: 0; font-size: 14px; color: #666;">${edu.startDate} &ndash; ${edu.endDate}</p>
                </div>
    `).join('');

    htmlContent = `
<div id="resume-container" style="font-family: 'Helvetica Neue', 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #fff; width: 210mm; min-height: 297mm; padding: 20mm;">
    <header style="border-bottom: 2px solid #005a9c; padding-bottom: 15px; margin-bottom: 25px; text-align: left;">
        <h1 style="font-size: 48px; font-weight: 700; margin: 0; color: #005a9c;">${fullName}</h1>
        <p style="font-size: 16px; margin: 5px 0 0 0; color: #555;">${email} &nbsp;|&nbsp; ${phone}</p>
    </header>

    <section style="margin-bottom: 25px;">
        <h2 style="font-size: 20px; font-weight: 600; color: #005a9c; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px;">PROFESSIONAL SUMMARY</h2>
        <p style="font-size: 15px; color: #444;">${summary}</p>
    </section>

    <section style="margin-bottom: 25px;">
        <h2 style="font-size: 20px; font-weight: 600; color: #005a9c; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px;">PROFESSIONAL EXPERIENCE</h2>
        ${experiencesHtml}
    </section>

    <section>
        <div style="display: flex; gap: 20px;">
            <div style="width: 50%; break-inside: avoid;">
                 <h2 style="font-size: 20px; font-weight: 600; color: #005a9c; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px;">EDUCATION</h2>
                ${educationHtml}
            </div>
            <div style="width: 50%; break-inside: avoid;">
                <h2 style="font-size: 20px; font-weight: 600; color: #005a9c; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px;">SKILLS</h2>
                 <p style="font-size: 14px; color: #444; white-space: pre-line;">${skills}</p>
            </div>
        </div>
    </section>
</div>
    `;
  } else if (template === 'modern') {
    const experiencesHtml = experiences.map(exp => `
            <div style="margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <h3 style="font-size: 18px; font-weight: bold; margin: 0; color: #2c3e50;">${exp.jobTitle}</h3>
                    <p style="font-size: 13px; font-style: italic; color: #95a5a6; margin:0;">${exp.startDate} - ${exp.endDate}</p>
                </div>
                <p style="font-size: 16px; font-style: italic; color: #7f8c8d; margin: 2px 0 10px 0;">${exp.company}</p>
                <div style="font-size: 14px; line-height: 1.6; white-space: pre-line;">${exp.jobDescription}</div>
            </div>
    `).join('');

    const educationHtml = education.map(edu => `
            <div style="margin-bottom: 15px;">
                <h3 style="font-size: 15px; font-weight: bold; margin: 0;">${edu.degree}</h3>
                <p style="font-size: 14px; font-style: italic; margin: 2px 0;">${edu.university}</p>
                <p style="font-size: 13px; color: #bdc3c7; margin: 2px 0;">${edu.startDate} - ${edu.endDate}</p>
            </div>
    `).join('');

    htmlContent = `
<div id="resume-container" style="font-family: 'Lato', 'Helvetica Neue', Arial, sans-serif; display: flex; width: 210mm; min-height: 297mm; background-color: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <div style="width: 38%; background-color: #2c3e50; color: #ecf0f1; padding: 30px;">
        <h1 style="font-size: 36px; font-weight: 700; margin: 0; line-height: 1.2;">${fullName}</h1>
        
        <div style="margin-top: 30px;">
            <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #7f8c8d; padding-bottom: 8px; margin-bottom: 15px;">Contact</h2>
            <p style="font-size: 14px; margin: 5px 0;">${email}</p>
            <p style="font-size: 14px; margin: 5px 0;">${phone}</p>
        </div>

        <div style="margin-top: 30px;">
            <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #7f8c8d; padding-bottom: 8px; margin-bottom: 15px;">Education</h2>
            ${educationHtml}
        </div>

        <div style="margin-top: 30px;">
            <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #7f8c8d; padding-bottom: 8px; margin-bottom: 15px;">Skills</h2>
            <div style="font-size: 14px; white-space: pre-line; line-height: 1.6;">${skills}</div>
        </div>
    </div>

    <div style="width: 62%; padding: 30px; color: #34495e;">
        <div style="margin-bottom: 30px;">
            <h2 style="font-size: 20px; text-transform: uppercase; letter-spacing: 2px; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-bottom: 20px;">Summary</h2>
            <p style="font-size: 15px; line-height: 1.6;">${summary}</p>
        </div>

        <div>
            <h2 style="font-size: 20px; text-transform: uppercase; letter-spacing: 2px; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-bottom: 20px;">Experience</h2>
            ${experiencesHtml}
        </div>
    </div>
</div>
    `;
  } else if (template === 'classic') {
    const experiencesHtml = experiences.map(exp => `
        <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">${exp.jobTitle}</h3>
                <span style="font-size: 14px; font-weight: bold; color: #000;">${exp.startDate} – ${exp.endDate}</span>
            </div>
            <p style="margin: 2px 0 8px 0; font-size: 15px; font-style: italic; color: #666;">${exp.company}</p>
            <p style="font-size: 14px; margin-left: 0; color: #444; white-space: pre-line;">${exp.jobDescription}</p>
        </div>
    `).join('');

    const educationHtml = education.map(edu => `
        <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">${edu.university}</h3>
                <span style="font-size: 14px; font-weight: bold; color: #000;">${edu.startDate} – ${edu.endDate}</span>
            </div>
            <p style="margin: 2px 0; font-size: 15px; font-style: italic; color: #666;">${edu.degree}</p>
        </div>
    `).join('');

    htmlContent = `
<div id="resume-container" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.5; color: #333; background-color: #fff; width: 210mm; min-height: 297mm; padding: 25mm 20mm;">
    <h1 style="font-size: 40px; font-weight: bold; text-align: left; margin: 0 0 5px 0; color: #8B1A1A;">${fullName}</h1>
    <p style="text-align: left; font-size: 14px; margin-bottom: 25px; color: #666;">${email} &nbsp;&bull;&nbsp; ${phone}</p>

    <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; color: #8B1A1A; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Summary</h2>
    <p style="font-size: 14px; margin-bottom: 25px; color: #444;">${summary}</p>

    <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; color: #8B1A1A; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Work Experience</h2>
    ${experiencesHtml}

    <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; color: #8B1A1A; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Education</h2>
    ${educationHtml}

    <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; color: #8B1A1A; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Skills</h2>
    <p style="font-size: 14px; color: #444; white-space: pre-line;">${skills}</p>
</div>
    `;
  } else if (template === 'vibrant') {
    const experiencesHtml = experiences.map(exp => `
        <div style="margin-bottom: 20px;">
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #222;">${exp.jobTitle}</h3>
            </div>
            <p style="margin: 2px 0 8px 0; font-size: 14px; font-weight: bold; color: #555;">${exp.company} | <span style="font-weight: normal; color: #888;">${exp.startDate} - ${exp.endDate}</span></p>
            <p style="font-size: 13px; color: #444; white-space: pre-line;">${exp.jobDescription}</p>
        </div>
    `).join('');

    const educationHtml = education.map(edu => `
        <div style="margin-bottom: 15px;">
            <h3 style="margin: 0; font-size: 15px; font-weight: bold; color: #222;">${edu.degree}</h3>
            <p style="margin: 2px 0; font-size: 14px; font-weight: bold; color: #555;">${edu.university}</p>
            <p style="margin: 0; font-size: 13px; color: #888;">${edu.startDate} - ${edu.endDate}</p>
        </div>
    `).join('');

    htmlContent = `
<div id="resume-container" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.5; color: #333; background-color: #fff; width: 210mm; min-height: 297mm; padding: 20mm;">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;">
        <div>
            <h1 style="font-size: 42px; font-weight: 800; margin: 0; color: #111; line-height: 1;">${fullName}</h1>
            <p style="font-size: 14px; margin: 10px 0 0 0; color: #555;">Phone: ${phone} | Email: ${email}</p>
        </div>
        <div style="width: 50px; height: 40px; background-color: #f05a22; border-radius: 10px 10px 10px 0;"></div>
    </div>

    <p style="font-size: 14px; margin-bottom: 30px; color: #444;">${summary}</p>

    <div style="display: flex; gap: 30px;">
        <div style="width: 60%;">
            <div style="background-color: #f05a22; color: #fff; padding: 8px 15px; border-radius: 20px; font-weight: bold; font-size: 16px; margin-bottom: 20px; display: inline-block;">Education</div>
            ${educationHtml}

            <div style="background-color: #f05a22; color: #fff; padding: 8px 15px; border-radius: 20px; font-weight: bold; font-size: 16px; margin-bottom: 20px; margin-top: 30px; display: inline-block;">Work Experience</div>
            ${experiencesHtml}
        </div>
        <div style="width: 40%;">
            <div style="background-color: #999; color: #fff; padding: 8px 15px; border-radius: 20px; font-weight: bold; font-size: 16px; margin-bottom: 20px; display: inline-block;">Skills</div>
            <p style="font-size: 14px; color: #444; white-space: pre-line;">${skills}</p>
        </div>
    </div>
</div>
    `;
  } else if (template === 'dark_sidebar') {
    const experiencesHtml = experiences.map(exp => `
        <div style="margin-bottom: 20px; display: flex;">
            <div style="width: 30%; font-size: 13px; color: #777;">
                ${exp.startDate} - ${exp.endDate}
                <div style="font-weight: bold; color: #444; margin-top: 5px;">${exp.company}</div>
            </div>
            <div style="width: 70%; padding-left: 15px; border-left: 2px solid #ccc;">
                <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #222;">${exp.jobTitle}</h3>
                <p style="font-size: 14px; margin-top: 10px; color: #444; white-space: pre-line;">${exp.jobDescription}</p>
            </div>
        </div>
    `).join('');

    const educationHtml = education.map(edu => `
        <div style="margin-bottom: 15px; display: flex;">
            <div style="width: 30%; font-size: 13px; color: #777;">
                ${edu.startDate} - ${edu.endDate}
                <div style="font-weight: bold; color: #444; margin-top: 5px;">${edu.university}</div>
            </div>
            <div style="width: 70%; padding-left: 15px; border-left: 2px solid #ccc;">
                <h3 style="margin: 0; font-size: 15px; font-weight: bold; color: #222;">${edu.degree}</h3>
            </div>
        </div>
    `).join('');

    htmlContent = `
<div id="resume-container" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; display: flex; width: 210mm; min-height: 297mm; background-color: #fff;">
    <div style="width: 35%; background-color: #333; color: #fff; padding: 30px;">
        <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #555; padding-bottom: 5px; margin-top: 40px; margin-bottom: 15px;">About Me</h2>
        <p style="font-size: 13px; line-height: 1.6; color: #ddd;">${summary}</p>
        
        <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #555; padding-bottom: 5px; margin-top: 40px; margin-bottom: 15px;">Skills</h2>
        <p style="font-size: 13px; line-height: 1.6; color: #ddd; white-space: pre-line;">${skills}</p>
    </div>
    <div style="width: 65%; padding: 30px 40px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
            <h1 style="font-size: 48px; font-weight: 800; text-transform: uppercase; line-height: 1; margin: 0; color: #222; width: 60%;">${fullName}</h1>
            <div style="font-size: 13px; color: #666; text-align: right;">
                <p style="margin: 2px 0;">${email}</p>
                <p style="margin: 2px 0;">${phone}</p>
            </div>
        </div>

        <h2 style="font-size: 18px; text-transform: uppercase; letter-spacing: 1px; color: #222; border-bottom: 2px solid #222; padding-bottom: 5px; margin-bottom: 20px;">Work Experience</h2>
        ${experiencesHtml}

        <h2 style="font-size: 18px; text-transform: uppercase; letter-spacing: 1px; color: #222; border-bottom: 2px solid #222; padding-bottom: 5px; margin-bottom: 20px; margin-top: 30px;">Education</h2>
        ${educationHtml}
    </div>
</div>
    `;
  } else if (template === 'soft_split') {
    const experiencesHtml = experiences.map(exp => `
        <div style="margin-bottom: 25px;">
            <h3 style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">${exp.jobTitle}</h3>
            <div style="font-size: 16px; font-weight: bold; color: #d9534f; margin: 5px 0;">${exp.company}</div>
            <div style="font-size: 14px; color: #888; margin-bottom: 10px;">${exp.startDate} - ${exp.endDate}</div>
            <p style="font-size: 14px; color: #444; line-height: 1.6; white-space: pre-line;">${exp.jobDescription}</p>
        </div>
    `).join('');

    const educationHtml = education.map(edu => `
        <div style="margin-bottom: 15px;">
            <div style="font-size: 14px; font-weight: bold; color: #333;">${edu.degree}</div>
            <div style="font-size: 15px; font-weight: bold; color: #d9534f; margin: 2px 0;">${edu.university}</div>
            <div style="font-size: 13px; color: #888;">${edu.startDate} - ${edu.endDate}</div>
        </div>
    `).join('');

    htmlContent = `
<div id="resume-container" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; display: flex; width: 210mm; min-height: 297mm; background-color: #fff; border: 2px solid #222;">
    <div style="width: 35%; background-color: #fff0eb; padding: 40px 30px; border-right: 2px solid #222;">
        <h1 style="font-size: 40px; font-weight: 900; line-height: 1.1; margin: 0 0 20px 0; color: #222; text-transform: uppercase;">${fullName}</h1>
        <p style="font-size: 14px; color: #444; line-height: 1.5; margin-bottom: 30px;">${summary}</p>

        <h2 style="font-size: 18px; font-weight: 900; text-transform: uppercase; margin-bottom: 15px; color: #222; display: flex; align-items: center;"><span style="color: #d9534f; margin-right: 10px;">@</span> Contact</h2>
        <p style="font-size: 14px; margin: 5px 0; color: #555;">${email}</p>
        <p style="font-size: 14px; margin: 5px 0; color: #555;">${phone}</p>

        <h2 style="font-size: 18px; font-weight: 900; text-transform: uppercase; margin-bottom: 15px; margin-top: 40px; color: #222;">Education</h2>
        ${educationHtml}

        <h2 style="font-size: 18px; font-weight: 900; text-transform: uppercase; margin-bottom: 15px; margin-top: 40px; color: #222;">Skills</h2>
        <p style="font-size: 14px; color: #444; white-space: pre-line;">${skills}</p>
    </div>
    <div style="width: 65%; padding: 40px;">
        <h2 style="font-size: 22px; font-weight: 900; text-transform: uppercase; margin-bottom: 30px; color: #222; display: flex; align-items: center;">Work Experience</h2>
        ${experiencesHtml}
    </div>
</div>
    `;
  }

  return { htmlContent };
}
