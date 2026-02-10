
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  HeadingLevel, 
  WidthType, 
  BorderStyle, 
  ShadingType, 
  AlignmentType, 
  Header, 
  Footer,
  PageNumber
} from "docx";
import { ChannelAnalysis, MockChannelStats } from "../types";

const US_LETTER_WIDTH = 12240;
const US_LETTER_HEIGHT = 15840;
const CONTENT_WIDTH = 9360;
const MARGIN = 1440;

export const exportStrategyToDocx = async (analysis: ChannelAnalysis, stats: MockChannelStats): Promise<Blob> => {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };

  const children: any[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: `YouTube Strategy Report: ${stats.name}`, bold: true, size: 36 })]
    }),
    new Paragraph({
      children: [new TextRun({ text: `Subscribers: ${stats.subscribers.toLocaleString()} | Total Views: ${stats.totalViews.toLocaleString()}`, size: 20, color: "666666" })]
    }),

    new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "1. Executive Summary", bold: true, size: 28 })] }),
    new Paragraph({ children: [new TextRun({ text: analysis.successfulConcept.description, size: 24 })] }),

    new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "2. Strategic Analysis", bold: true, size: 28 })] }),
    new Paragraph({ children: [new TextRun({ text: "Strengths:", bold: true, size: 24 })] }),
    ...analysis.strengths.map(s => new Paragraph({ text: `• ${s}`, indent: { left: 720 } })),
    new Paragraph({ children: [new TextRun({ text: "Weaknesses:", bold: true, size: 24 })] }),
    ...analysis.weaknesses.map(w => new Paragraph({ text: `• ${w}`, indent: { left: 720 } })),

    new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "3. Video Ideas Inventory", bold: true, size: 28 })] }),
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [3000, 6360],
      rows: [
        new TableRow({
          children: [
            new TableCell({ borders, shading: { fill: "EEEEEE", type: ShadingType.CLEAR }, children: [new Paragraph({ text: "Title", bold: true })] }),
            new TableCell({ borders, shading: { fill: "EEEEEE", type: ShadingType.CLEAR }, children: [new Paragraph({ text: "Strategy & Reasoning", bold: true })] })
          ]
        }),
        ...analysis.videoIdeas.map(idea => new TableRow({
          children: [
            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ text: idea.title, bold: true })] }),
            new TableCell({ borders, width: { size: 6360, type: WidthType.DXA }, children: [new Paragraph({ text: idea.reasoning })] })
          ]
        }))
      ]
    })
  ];

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 24 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", run: { size: 36, bold: true, font: "Arial" }, paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", run: { size: 28, bold: true, font: "Arial" }, paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1 } },
      ]
    },
    sections: [{
      properties: {
        page: { size: { width: US_LETTER_WIDTH, height: US_LETTER_HEIGHT }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } }
      },
      headers: {
        default: new Header({ children: [new Paragraph({ text: "TubeArchitect AI Strategy", alignment: AlignmentType.RIGHT })] })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun("Page "), new TextRun({ children: [PageNumber.CURRENT] })]
          })]
        })
      },
      children
    }]
  });

  return await Packer.toBlob(doc);
};
