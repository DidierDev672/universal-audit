import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.js?url";
import * as mammoth from "mammoth";
import * as XLSX from "xlsx";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

type PdfTextItem = { str?: string };

async function extractPDFContent(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const partes: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => (item as PdfTextItem).str ?? "")
      .join(" ");

    partes.push(`--- Página ${pageNum} ---\n${pageText}`);
  }

  return partes.join("\n\n").trim();
}

export const contentExtractor = {
  async extractPDFContent(file: File): Promise<string> {
    try {
      return await extractPDFContent(file);
    } catch (error) {
      console.error("Error extracting PDF content:", error);
      return `Error al extraer contenido del PDF: ${error}`;
    }
  },

  async extractWordContent(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error("Error extracting Word content:", error);
      return `Error al extraer contenido del Word: ${error}`;
    }
  },

  async extractExcelContent(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      let content = "";
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        if (worksheet) {
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          content += `\n=== Hoja: ${sheetName} ===\n`;
          jsonData.forEach((row: unknown) => {
            if (
              Array.isArray(row) &&
              row.some(
                (cell) => cell !== null && cell !== undefined && cell !== "",
              )
            ) {
              content += row.join(" | ") + "\n";
            }
          });
        }
      });

      return content;
    } catch (error) {
      console.error("Error extracting Excel content:", error);
      return `Error al extraer contenido del Excel: ${error}`;
    }
  },

  async extractTextContent(file: File): Promise<string> {
    try {
      return await file.text();
    } catch (error) {
      console.error("Error extracting text content:", error);
      return `Error al extraer contenido del texto: ${error}`;
    }
  },

  async extractUrlContent(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const text = await response.text();
        const cleanText = text
          .replace(/<script[^>]*>.*?<\/script>/gis, "")
          .replace(/<style[^>]*>.*?<\/style>/gis, "")
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        return cleanText.substring(0, 10000);
      }
      return `No se pudo acceder al contenido de la URL: ${url}`;
    } catch (error) {
      console.error("Error extracting URL content:", error);
      return `Error al extraer contenido de la URL: ${error}`;
    }
  },

  async extractContent(
    file?: File,
    url?: string,
    fileName?: string,
  ): Promise<string> {
    if (url) {
      return await this.extractUrlContent(url);
    }

    if (!file || !fileName) {
      return "No se proporcionó archivo o URL válida";
    }

    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return await this.extractPDFContent(file);
      case "docx":
      case "doc":
        return await this.extractWordContent(file);
      case "xlsx":
      case "xls":
        return await this.extractExcelContent(file);
      case "txt":
      case "text":
        return await this.extractTextContent(file);
      default:
        return `Tipo de archivo no soportado: ${extension}`;
    }
  },
};
