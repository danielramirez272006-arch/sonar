/** @vitest-environment jsdom */
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { SanctionPanel } from '../src/features/admin/sanction-panel.jsx'
import { ReportsPage } from '../src/pages/admin/reports-page.jsx'
vi.mock('../src/shared/context/auth-context.jsx', () => ({ useAuth: () => ({ user: { id: 'a', username: 'Admin' } }) }))
vi.mock('../src/shared/services/api-client.js', () => ({ apiRequest: vi.fn().mockResolvedValue([]) }))
afterEach(cleanup)
it('requires confirmation before saving a sanction', async () => {
  const save = vi.fn().mockResolvedValue({})
  render(<SanctionPanel user={{ id: 'u', role: 'user', username: 'Mateo' }} onUserUpdate={save} />)
  fireEvent.change(screen.getByLabelText('Motivo'), { target: { value: 'Insultos' } })
  fireEvent.click(screen.getByText('Revisar acción'))
  expect(save).not.toHaveBeenCalled()
  fireEvent.click(screen.getByText('Confirmar acción'))
  await screen.findByText('Acción guardada en el historial.')
  expect(save).toHaveBeenCalledWith('u', expect.objectContaining({ sanctions: [expect.objectContaining({ adminId: 'a', reason: 'Insultos' })] }))
})
it('keeps report pending if sending to moderation fails', async () => {
  const save = vi.fn()
  render(<ReportsPage users={[{ id: 'u', username: 'Mateo', conductReports: [{ id: 'r', status: 'pending', contentType: 'review', contentId: '10', reason: 'Insultos' }] }]} reviews={[{ id: '10', content: 'Texto reportado' }]} onUserUpdate={save} onSendToModeration={vi.fn().mockRejectedValue(new Error('Sin conexión'))} />)
  fireEvent.click(screen.getByText('Enviar a moderación'))
  await screen.findByText('Sin conexión')
  expect(save).not.toHaveBeenCalled()
})
it('resolves reports without removing the record', async () => {
  const save = vi.fn().mockResolvedValue({})
  render(<ReportsPage users={[{ id: 'u', username: 'Mateo', conductReports: [{ id: 'r', status: 'pending', reason: 'Insultos' }] }]} onUserUpdate={save} />)
  fireEvent.click(screen.getByText('Resolver reporte'))
  await screen.findByText('Reporte actualizado.')
  expect(save).toHaveBeenCalledWith('u', { conductReports: [expect.objectContaining({ id: 'r', status: 'resolved' })] })
})
