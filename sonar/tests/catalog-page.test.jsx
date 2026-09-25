/** @vitest-environment jsdom */
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { CatalogPage } from '../src/pages/admin/catalog-page.jsx'
import { getCatalog, saveCatalog, deleteCatalog } from '../src/shared/services/catalog-service.js'
vi.mock('../src/shared/context/auth-context.jsx', () => ({ useAuth: () => ({ user: { role: 'admin' } }) }))
vi.mock('../src/shared/components/ui/modal.jsx', () => ({ Modal: ({ children, title }) => <div role="dialog" aria-label={title}>{children}</div> }))
vi.mock('../src/shared/services/catalog-service.js', async importOriginal => ({ ...await importOriginal(), getCatalog: vi.fn(), saveCatalog: vi.fn(), deleteCatalog: vi.fn() }))
afterEach(() => { cleanup(); vi.resetAllMocks() })
it('creates an announcement, preserves the editor on failure and confirms deletion', async () => {
  getCatalog.mockResolvedValue([])
  saveCatalog.mockRejectedValueOnce(new Error('Sin conexión')).mockResolvedValue({ id: 'a', title: 'Novedades', description: 'Texto', status: 'draft' })
  deleteCatalog.mockResolvedValue(null)
  render(<CatalogPage type="announcements" />)
  await screen.findByText('Tu catálogo empieza aquí')
  fireEvent.click(screen.getByText('Nuevo registro'))
  fireEvent.change(screen.getByLabelText('Título *'), { target: { value: 'Novedades' } })
  fireEvent.change(screen.getByLabelText('Mensaje *'), { target: { value: 'Texto' } })
  fireEvent.change(screen.getByLabelText('Fecha de inicio *'), { target: { value: '2026-10-01' } })
  fireEvent.change(screen.getByLabelText('Fecha de fin *'), { target: { value: '2026-10-31' } })
  fireEvent.click(screen.getByText('Guardar registro'))
  await screen.findByText('Sin conexión')
  expect(screen.getByLabelText('Título *').value).toBe('Novedades')
  fireEvent.click(screen.getByText('Guardar registro'))
  await screen.findByText('Registro guardado correctamente.')
  fireEvent.click(screen.getByLabelText('Eliminar Novedades'))
  expect(deleteCatalog).not.toHaveBeenCalled()
  fireEvent.click(screen.getByText('Confirmar eliminación'))
  await screen.findByText('Registro eliminado correctamente.')
  expect(deleteCatalog).toHaveBeenCalledWith('announcements', 'a', { role: 'admin' })
})
