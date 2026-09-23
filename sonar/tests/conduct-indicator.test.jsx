/** @vitest-environment jsdom */
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ConductIndicator } from '../src/features/admin/conduct-indicator.jsx'
afterEach(cleanup)
const reports = count => Array.from({ length: count }, (_, id) => ({ id: String(id), reason: 'Insultos', status: 'pending' }))
it.each([[0, 'Cara feliz'], [1, 'Cara preocupada'], [3, 'Cara preocupada'], [4, 'Cara seria'], [6, 'Cara seria'], [7, 'Cara molesta'], [9, 'Cara molesta'], [10, 'Cara enojada'], [15, 'Cara enojada']])('shows the correct face with %i reports', (count, name) => {
  render(<ConductIndicator user={{ id: '1', conductReports: reports(count) }} onUserUpdate={vi.fn()} />)
  expect(screen.getByRole('img', { name })).toBeTruthy()
})
it('does not count dismissed reports', () => {
  render(<ConductIndicator user={{ id: '1', conductReports: reports(10).map(report => ({ ...report, status: 'dismissed' })) }} onUserUpdate={vi.fn()} />)
  expect(screen.getByRole('img', { name: 'Cara feliz' })).toBeTruthy()
})
it('persists a report with a reason and resets the form after saving', async () => {
  const save = vi.fn().mockResolvedValue({})
  render(<ConductIndicator user={{ id: '1' }} onUserUpdate={save} />)
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Insultos reiterados' } })
  fireEvent.click(screen.getByRole('button', { name: 'Registrar reporte' }))
  await screen.findByText('Reporte registrado.')
  expect(save).toHaveBeenCalledWith('1', { conductReports: [expect.objectContaining({ reason: 'Insultos reiterados', status: 'pending' })] })
  expect(screen.getByRole('textbox').value).toBe('')
})
it('preserves the reason when saving fails', async () => {
  render(<ConductIndicator user={{ id: '1' }} onUserUpdate={vi.fn().mockRejectedValue(new Error('Sin conexión'))} />)
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Insultos' } })
  fireEvent.click(screen.getByRole('button', { name: 'Registrar reporte' }))
  await screen.findByText('Sin conexión')
  await waitFor(() => expect(screen.getByRole('textbox').value).toBe('Insultos'))
})
it('discards a report without deleting its history', async () => {
  const save = vi.fn().mockResolvedValue({})
  render(<ConductIndicator user={{ id: '1', conductReports: reports(1) }} onUserUpdate={save} />)
  fireEvent.click(screen.getByText('Historial de reportes (1)'))
  fireEvent.click(screen.getByRole('button', { name: 'Descartar' }))
  await screen.findByText('Reporte descartado.')
  expect(save).toHaveBeenCalledWith('1', { conductReports: [expect.objectContaining({ id: '0', status: 'dismissed' })] })
})
