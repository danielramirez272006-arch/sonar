import { catalogTypes, validateCatalog } from './catalog-service.js'

async function workbook() {
  const { default: ExcelJS } = await import('exceljs')
  return new ExcelJS.Workbook()
}
export async function catalogTemplate(type) {
  const book = await workbook()
  const sheet = book.addWorksheet('Catálogo')
  sheet.columns = catalogTypes[type].fields.map(([key]) => ({ header: key, key, width: 28 }))
  sheet.getRow(1).font = { bold: true }
  const instructions = book.addWorksheet('Instrucciones')
  instructions.addRow(['Columna', 'Descripción', 'Formato', 'Obligatorio'])
  catalogTypes[type].fields.forEach(([key, label, kind, required]) => instructions.addRow([key, label, kind === 'date' ? 'AAAA-MM-DD' : kind, required ? 'Sí' : 'No']))
  instructions.addRow(['', 'Completa Catálogo desde la fila 2. Se guardará como borrador. Máximo 200 registros.'])
  instructions.columns.forEach(column => { column.width = 32 })
  return book.xlsx.writeBuffer()
}
export async function readCatalogExcel(type, buffer) {
  const book = await workbook()
  try { await book.xlsx.load(await normalizeSpreadsheetXml(buffer)) }
  catch (cause) { throw new Error('No se pudo abrir el Excel. Comprueba que sea un archivo .xlsx válido y sin contraseña.', { cause }) }
  const sheet = book.worksheets[0]
  if (!sheet || sheet.rowCount < 2) throw new Error('La primera hoja no contiene registros. Completa la plantilla desde la fila 2.')
  if (sheet.rowCount > 201) throw new Error('Importa hasta 200 filas por archivo.')
  const fields = catalogTypes[type].fields
  const columns = new Map()
  sheet.getRow(1).eachCell((cell, column) => {
    const heading = cell.text.trim().toLocaleLowerCase()
    const field = fields.find(([key, label]) => [key.toLocaleLowerCase(), label.toLocaleLowerCase()].includes(heading))
    if (field) {
      if (columns.has(field[0])) throw new Error(`Columna repetida: ${field[1]}.`)
      columns.set(field[0], column)
    }
  })
  for (const [key, label, , required] of fields) if (required && !columns.has(key)) throw new Error(`Falta la columna ${label}. Utiliza la plantilla.`)
  const rows = []
  sheet.eachRow((row, number) => {
    if (number === 1) return
    const data = { status: 'draft' }
    for (const [key, column] of columns) {
      const cell = row.getCell(column)
      if (cell.type === 6) throw new Error(`Fila ${number}: reemplaza las fórmulas por valores.`)
      data[key] = cell.value instanceof Date ? cell.value.toISOString().slice(0, 10) : cell.text.trim()
    }
    if (![...columns.keys()].some(key => data[key])) return
    try { rows.push({ row: number, data: validateCatalog(type, data) }) }
    catch (error) { throw new Error(`Fila ${number}: ${error.message}`, { cause: error }) }
  })
  if (!rows.length) throw new Error('No se encontraron registros para importar.')
  return rows
}

// ExcelJS expects unprefixed spreadsheet element names. Some Excel writers
// serialize the same namespace using x: (or another prefix) instead.
export async function normalizeSpreadsheetXml(buffer) {
  const { default: JSZip } = await import('jszip')
  const zip = await JSZip.loadAsync(buffer)
  const namespace = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
  let changed = false
  for (const entry of Object.values(zip.files)) {
    if (!/^xl\/.*\.xml$/.test(entry.name)) continue
    const xml = await entry.async('string')
    if (!xml.includes(namespace)) continue
    const doc = new DOMParser().parseFromString(xml, 'application/xml')
    if (doc.getElementsByTagName('parsererror').length) throw new Error('XML inválido.')
    if (![...doc.getElementsByTagNameNS(namespace, '*')].some(node => node.prefix)) continue
    function copy(node) {
      if (node.nodeType !== 1) return node.cloneNode(true)
      const element = doc.createElementNS(node.namespaceURI, node.namespaceURI === namespace ? node.localName : node.nodeName)
      for (const attr of node.attributes) { if (attr.namespaceURI === 'http://www.w3.org/2000/xmlns/' && attr.value === namespace) continue; element.setAttributeNS(attr.namespaceURI, attr.name, attr.value) }
      for (const child of node.childNodes) element.appendChild(copy(child))
      return element
    }
    doc.replaceChild(copy(doc.documentElement), doc.documentElement)
    zip.file(entry.name, new XMLSerializer().serializeToString(doc))
    changed = true
  }
  return changed ? zip.generateAsync({ type: 'arraybuffer' }) : buffer
}
