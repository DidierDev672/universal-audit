import * as pdf from 'pdf-parse'
import * as mammoth from 'mammoth'
import * as XLSX from 'xlsx'

// Servicio para extraer contenido de diferentes tipos de archivos
export const contentExtractor = {
  // Extraer contenido de PDF
  async extractPDFContent(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const data = await (pdf as any)(buffer)
      return data.text
    } catch (error) {
      console.error('Error extracting PDF content:', error)
      return `Error al extraer contenido del PDF: ${error}`
    }
  },

  // Extraer contenido de Word (.docx)
  async extractWordContent(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      return result.value
    } catch (error) {
      console.error('Error extracting Word content:', error)
      return `Error al extraer contenido del Word: ${error}`
    }
  },

  // Extraer contenido de Excel
  async extractExcelContent(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      
      let content = ''
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName]
        if (worksheet) {
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          
          content += `\n=== Hoja: ${sheetName} ===\n`
          jsonData.forEach((row: any) => {
            if (Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
              content += row.join(' | ') + '\n'
            }
          })
        }
      })
      
      return content
    } catch (error) {
      console.error('Error extracting Excel content:', error)
      return `Error al extraer contenido del Excel: ${error}`
    }
  },

  // Extraer contenido de texto plano
  async extractTextContent(file: File): Promise<string> {
    try {
      return await file.text()
    } catch (error) {
      console.error('Error extracting text content:', error)
      return `Error al extraer contenido del texto: ${error}`
    }
  },

  // Extraer contenido de URL (simulado - en producción necesitarías backend)
  async extractUrlContent(url: string): Promise<string> {
    try {
      // Para URLs, intentamos obtener información básica
      // En producción, necesitarías un backend para hacer web scraping
      const response = await fetch(url)
      if (response.ok) {
        const text = await response.text()
        // Extraer texto relevante del HTML
        const cleanText = text
          .replace(/<script[^>]*>.*?<\/script>/gis, '')
          .replace(/<style[^>]*>.*?<\/style>/gis, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
        
        return cleanText.substring(0, 10000) // Limitar a 10k caracteres
      }
      return `No se pudo acceder al contenido de la URL: ${url}`
    } catch (error) {
      console.error('Error extracting URL content:', error)
      return `Error al extraer contenido de la URL: ${error}`
    }
  },

  // Función principal para extraer contenido según el tipo de archivo
  async extractContent(file?: File, url?: string, fileName?: string): Promise<string> {
    if (url) {
      return await this.extractUrlContent(url)
    }
    
    if (!file || !fileName) {
      return 'No se proporcionó archivo o URL válida'
    }

    const extension = fileName.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'pdf':
        return await this.extractPDFContent(file)
      case 'docx':
      case 'doc':
        return await this.extractWordContent(file)
      case 'xlsx':
      case 'xls':
        return await this.extractExcelContent(file)
      case 'txt':
      case 'text':
        return await this.extractTextContent(file)
      default:
        return `Tipo de archivo no soportado: ${extension}`
    }
  }
}
