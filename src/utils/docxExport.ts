import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import { GeneratedResume, CareerProfile } from "../types";

/**
 * Builds and downloads a professional Word (.docx) document from resume data
 */
export async function downloadResumeAsDocx(
  resume: GeneratedResume,
  filename?: string
): Promise<void> {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          // Candidate Name
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: resume.fullName || "Your Name",
                bold: true,
                size: 36, // 18pt
                color: "1A365D", // Dark navy
                font: "Calibri",
              }),
            ],
          }),

          // Contact line (Email | Phone | Location | LinkedIn | GitHub)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: [
                  resume.contact.email,
                  resume.contact.phone,
                  resume.contact.location,
                  resume.contact.linkedinUrl,
                  resume.contact.githubUrl,
                  resume.contact.portfolioUrl,
                ]
                  .filter(Boolean)
                  .join("  |  "),
                size: 20, // 10pt
                color: "4A5568",
                font: "Calibri",
              }),
            ],
          }),

          // Horizontal Divider
          new Paragraph({
            border: {
              bottom: {
                color: "CBD5E1",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
            spacing: { after: 160 },
          }),

          // PROFESSIONAL SUMMARY
          ...(resume.summary
            ? [
                createSectionHeading("PROFESSIONAL SUMMARY"),
                new Paragraph({
                  spacing: { after: 200, line: 276 },
                  children: [
                    new TextRun({
                      text: resume.summary,
                      size: 21,
                      font: "Calibri",
                      color: "2D3748",
                    }),
                  ],
                }),
              ]
            : []),

          // EDUCATION
          ...(resume.education && resume.education.length > 0
            ? [
                createSectionHeading("EDUCATION"),
                ...resume.education.flatMap((edu) => [
                  new Paragraph({
                    spacing: { before: 80, after: 40 },
                    children: [
                      new TextRun({
                        text: edu.institution,
                        bold: true,
                        size: 22,
                        font: "Calibri",
                        color: "1A202C",
                      }),
                      new TextRun({
                        text: edu.year ? `   (${edu.year})` : "",
                        italics: true,
                        size: 20,
                        color: "718096",
                        font: "Calibri",
                      }),
                    ],
                  }),
                  new Paragraph({
                    spacing: { after: 80 },
                    children: [
                      new TextRun({
                        text: edu.degree,
                        size: 21,
                        font: "Calibri",
                        color: "2D3748",
                      }),
                      edu.scoreOrCgpa
                        ? new TextRun({
                            text: `  —  Grade/CGPA: ${edu.scoreOrCgpa}`,
                            bold: true,
                            size: 20,
                            color: "0D9488",
                            font: "Calibri",
                          })
                        : new TextRun({ text: "" }),
                    ],
                  }),
                  ...(edu.details
                    ? [
                        new Paragraph({
                          bullet: { level: 0 },
                          spacing: { after: 80 },
                          children: [
                            new TextRun({
                              text: edu.details,
                              size: 20,
                              font: "Calibri",
                              color: "4A5568",
                            }),
                          ],
                        }),
                      ]
                    : []),
                ]),
              ]
            : []),

          // TECHNICAL & CORE SKILLS
          ...(resume.skills && resume.skills.length > 0
            ? [
                createSectionHeading("TECHNICAL & PROFESSIONAL SKILLS"),
                ...resume.skills.map(
                  (s) =>
                    new Paragraph({
                      spacing: { after: 80 },
                      children: [
                        new TextRun({
                          text: `${s.category}: `,
                          bold: true,
                          size: 21,
                          font: "Calibri",
                          color: "1A202C",
                        }),
                        new TextRun({
                          text: s.items.join(", "),
                          size: 21,
                          font: "Calibri",
                          color: "4A5568",
                        }),
                      ],
                    })
                ),
              ]
            : []),

          // EXPERIENCE / INTERNSHIPS
          ...(resume.experience && resume.experience.length > 0
            ? [
                createSectionHeading("WORK & INTERNSHIP EXPERIENCE"),
                ...resume.experience.flatMap((exp) => [
                  new Paragraph({
                    spacing: { before: 100, after: 40 },
                    children: [
                      new TextRun({
                        text: exp.role,
                        bold: true,
                        size: 22,
                        font: "Calibri",
                        color: "1A202C",
                      }),
                      new TextRun({
                        text: `  |  ${exp.company}`,
                        size: 21,
                        font: "Calibri",
                        color: "2B6CB0",
                      }),
                      new TextRun({
                        text: exp.period ? `   (${exp.period})` : "",
                        italics: true,
                        size: 20,
                        color: "718096",
                        font: "Calibri",
                      }),
                    ],
                  }),
                  ...exp.bullets.map(
                    (b) =>
                      new Paragraph({
                        bullet: { level: 0 },
                        spacing: { after: 40, line: 260 },
                        children: [
                          new TextRun({
                            text: b,
                            size: 20,
                            font: "Calibri",
                            color: "2D3748",
                          }),
                        ],
                      })
                  ),
                ]),
              ]
            : []),

          // PROJECTS
          ...(resume.projects && resume.projects.length > 0
            ? [
                createSectionHeading("KEY PROJECTS"),
                ...resume.projects.flatMap((proj) => [
                  new Paragraph({
                    spacing: { before: 100, after: 40 },
                    children: [
                      new TextRun({
                        text: proj.title,
                        bold: true,
                        size: 22,
                        font: "Calibri",
                        color: "1A202C",
                      }),
                      ...(proj.techStack
                        ? [
                            new TextRun({
                              text: `  [Stack: ${proj.techStack}]`,
                              size: 19,
                              italics: true,
                              color: "4A5568",
                              font: "Calibri",
                            }),
                          ]
                        : []),
                      ...(proj.link
                        ? [
                            new TextRun({
                              text: `  |  ${proj.link}`,
                              size: 19,
                              color: "2B6CB0",
                              font: "Calibri",
                            }),
                          ]
                        : []),
                    ],
                  }),
                  ...proj.bullets.map(
                    (b) =>
                      new Paragraph({
                        bullet: { level: 0 },
                        spacing: { after: 40, line: 260 },
                        children: [
                          new TextRun({
                            text: b,
                            size: 20,
                            font: "Calibri",
                            color: "2D3748",
                          }),
                        ],
                      })
                  ),
                ]),
              ]
            : []),

          // CERTIFICATIONS & ACHIEVEMENTS
          ...(resume.certifications && resume.certifications.length > 0
            ? [
                createSectionHeading("CERTIFICATIONS & HONORS"),
                ...resume.certifications.map(
                  (cert) =>
                    new Paragraph({
                      bullet: { level: 0 },
                      spacing: { after: 40 },
                      children: [
                        new TextRun({
                          text: cert,
                          size: 20,
                          font: "Calibri",
                          color: "2D3748",
                        }),
                      ],
                    })
                ),
              ]
            : []),

          ...(resume.achievements && resume.achievements.length > 0
            ? [
                createSectionHeading("KEY ACHIEVEMENTS"),
                ...resume.achievements.map(
                  (ach) =>
                    new Paragraph({
                      bullet: { level: 0 },
                      spacing: { after: 40 },
                      children: [
                        new TextRun({
                          text: ach,
                          size: 20,
                          font: "Calibri",
                          color: "2D3748",
                        }),
                      ],
                    })
                ),
              ]
            : []),
        ],
      },
    ],
  });

  // Pack and trigger download
  const blob = await Packer.toBlob(doc);
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const sanitizedName = (resume.fullName || "Professional")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  a.href = downloadUrl;
  a.download = filename || `${sanitizedName}_Resume.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

function createSectionHeading(title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    border: {
      bottom: {
        color: "2B6CB0",
        space: 2,
        style: BorderStyle.SINGLE,
        size: 8,
      },
    },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 23,
        color: "1A365D",
        font: "Calibri",
      }),
    ],
  });
}
