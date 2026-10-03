const { TestEnvironment } = require('jest-environment-jsdom')

// jsdom no expone algunas APIs de Node/Web que Vitest sí dejaba disponibles.
class JsdomWithNodeGlobals extends TestEnvironment {
  constructor(config, context) {
    super(config, context)
    const g = this.global
    for (const name of ['TextEncoder', 'TextDecoder', 'Response', 'Request', 'Headers', 'fetch', 'structuredClone', 'ReadableStream', 'BroadcastChannel']) {
      if (typeof g[name] === 'undefined' && typeof globalThis[name] !== 'undefined') g[name] = globalThis[name]
    }
  }
}

module.exports = JsdomWithNodeGlobals
