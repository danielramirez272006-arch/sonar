// Plugin mínimo: sustituye `import.meta` por `{ env: process.env }` para que Jest (CommonJS) pueda ejecutar el código de Vite.
const importMetaToProcessEnv = ({ types: t }) => ({
  visitor: {
    MetaProperty(path) {
      if (path.node.meta.name !== 'import' || path.node.property.name !== 'meta') return
      path.replaceWith(
        t.objectExpression([
          t.objectProperty(
            t.identifier('env'),
            t.memberExpression(t.identifier('process'), t.identifier('env')),
          ),
        ]),
      )
    },
  },
})

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [importMetaToProcessEnv],
}
