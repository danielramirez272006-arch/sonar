/** @vitest-environment jsdom */
import { expect, it } from 'vitest'
import JSZip from 'jszip'
import ExcelJS from 'exceljs'
import { catalogTemplate, readCatalogExcel } from '../src/shared/services/catalog-excel.js'

async function sample(values) {
  const book = new ExcelJS.Workbook()
  await book.xlsx.load(await catalogTemplate('releases'))
  book.worksheets[0].addRow(values)
  return book.xlsx.writeBuffer()
}
it('imports spreadsheet XML with explicit namespace prefixes', async () => {
  const zip = await JSZip.loadAsync(await sample(['Álbum & Sol', 'Artista', '2026-09-25']))
  for (const entry of Object.values(zip.files)) {
    if (!/^xl\/.*\.xml$/.test(entry.name)) continue
    let xml = await entry.async('string')
    if (!xml.includes('xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"')) continue
    xml = xml.replace('xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"', 'xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main"').replace(/<(\/?)([A-Za-z][\w]*)(?=[\s/>])/g, '<$1x:$2')
    zip.file(entry.name, xml)
  }
  const rows = await readCatalogExcel('releases', await zip.generateAsync({ type: 'arraybuffer' }))
  expect(rows[0].data.title).toBe('Álbum & Sol')
  expect(rows[0].data.releaseDate).toBe('2026-09-25')
})
it('imports a real workbook as validated drafts', async () => {
  const result = await readCatalogExcel('releases', await sample(['Disco', 'Artista', new Date('2026-09-25')]))
  expect(result).toEqual([expect.objectContaining({ row: 2, data: expect.objectContaining({ title: 'Disco', artist: 'Artista', releaseDate: '2026-09-25', status: 'draft' }) })])
})
it('reports the row with invalid data', async () => {
  await expect(readCatalogExcel('releases', await sample(['Disco', '', '2026-09-25']))).rejects.toThrow('Fila 2: Artista')
})
it('rejects formulas instead of interpreting them', async () => {
  await expect(readCatalogExcel('releases', await sample([{ formula: '1+1', result: 2 }, 'Artista', '2026-09-25']))).rejects.toThrow('reemplaza las fórmulas')
})
it('rejects empty templates and missing required columns', async () => {
  await expect(readCatalogExcel('releases', await catalogTemplate('releases'))).rejects.toThrow('no contiene registros')
  const book = new ExcelJS.Workbook()
  const sheet = book.addWorksheet('Datos')
  sheet.addRow(['title']); sheet.addRow(['Disco'])
  await expect(readCatalogExcel('releases', await book.xlsx.writeBuffer())).rejects.toThrow('Falta la columna Artista')
})
