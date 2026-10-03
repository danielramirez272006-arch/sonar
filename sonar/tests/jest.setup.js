import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'

// Auto-cleanup del DOM entre pruebas (equivalente al comportamiento con globals de Vitest).
afterEach(() => cleanup())

// Vite inyectaba VITE_* desde .env; en Jest se define un valor de prueba.
process.env.VITE_GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || 'test-google-client-id'

// Reemplazos de vi.stubGlobal / vi.stubEnv para Jest.
const globalBackup = new Map()
const envBackup = new Map()

globalThis.__stubGlobal = (name, value) => {
  if (!globalBackup.has(name)) globalBackup.set(name, Object.getOwnPropertyDescriptor(globalThis, name))
  Object.defineProperty(globalThis, name, { value, writable: true, configurable: true })
}
globalThis.__unstubAllGlobals = () => {
  globalBackup.forEach((desc, name) => {
    if (desc) Object.defineProperty(globalThis, name, desc)
    else delete globalThis[name]
  })
  globalBackup.clear()
}
globalThis.__stubEnv = (name, value) => {
  if (!envBackup.has(name)) envBackup.set(name, process.env[name])
  process.env[name] = value
}
globalThis.__unstubAllEnvs = () => {
  envBackup.forEach((value, name) => {
    if (value === undefined) delete process.env[name]
    else process.env[name] = value
  })
  envBackup.clear()
}

// Matchers que existen en Vitest pero no en Jest.
expect.extend({
  toHaveBeenCalledOnce(received) {
    const pass = received.mock.calls.length === 1
    return { pass, message: () => `expected 1 call, received ${received.mock.calls.length}` }
  },
  toHaveBeenCalledExactlyOnceWith(received, ...args) {
    const calls = received.mock.calls
    const pass = calls.length === 1 && this.equals(calls[0], args)
    return { pass, message: () => `expected exactly one call with ${this.utils.printExpected(args)}, received ${this.utils.printReceived(calls)}` }
  },
})

// jsdom no implementa estas APIs; se silencian como en Vitest.
window.scrollTo = () => {}
window.HTMLMediaElement.prototype.play = () => Promise.resolve()
window.HTMLMediaElement.prototype.pause = () => {}

// Vitest permite expect(valor, mensaje); Jest no. Se acepta el mensaje y se antepone al error.
const jestExpect = globalThis.expect
const wrappedExpect = (actual, message) => {
  const base = jestExpect(actual)
  if (!message) return base
  const wrap = target => new Proxy(target, {
    get(obj, prop) {
      const value = obj[prop]
      if (prop === 'not' || prop === 'resolves' || prop === 'rejects') return wrap(value)
      if (typeof value !== 'function') return value
      return (...args) => {
        try {
          const result = value.apply(obj, args)
          return result && typeof result.catch === 'function'
            ? result.catch(error => { error.message = `${message}\n${error.message}`; throw error })
            : result
        } catch (error) {
          error.message = `${message}\n${error.message}`
          throw error
        }
      }
    },
  })
  return wrap(base)
}
Object.assign(wrappedExpect, jestExpect)
globalThis.expect = wrappedExpect
