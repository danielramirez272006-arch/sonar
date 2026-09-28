/** @vitest-environment jsdom */
import { afterEach, beforeAll, expect, it } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { Avatar } from '../src/shared/components/ui/avatar.jsx'
import { BlobatarAvatar } from '../src/shared/components/ui/blobatar-avatar.jsx'
import { avatarPropsFor } from '../src/shared/components/ui/avatar-props.js'

// El driver de mirada de blobatar consulta matchMedia, que jsdom no implementa.
beforeAll(() => {
  window.matchMedia = window.matchMedia || (query => ({
    matches: false, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {}, dispatchEvent: () => false,
  }))
  globalThis.ResizeObserver = globalThis.ResizeObserver || class {
    observe() {} unobserve() {} disconnect() {}
  }
})

afterEach(cleanup)

const svgOf = (container) => container.querySelector('svg')?.outerHTML || ''
const imgOf = (container) => container.querySelector('img')?.getAttribute('src') || ''

// El mismo usuario visto desde dos componentes: si el SVG no es identico, esa
// persona se ve distinta segun donde mires.
const user = {
  username: 'ana',
  avatarUrl: '',
  avatarSeed: 'vinyl-master',
  avatarHue: 210,
  avatarTone: 'vivid',
  avatarBg: '#0284c7',
}

it('el mismo usuario produce el mismo blobatar en Avatar y en BlobatarAvatar', () => {
  // Mismo tamano explicito en los dos: si el SVG difiere, es la cara o el
  // color, no la caja.
  const a = render(<Avatar {...avatarPropsFor(user)} size={44} />)
  const b = render(<BlobatarAvatar {...avatarPropsFor(user)} size={44} />)
  expect(svgOf(a.container)).toBeTruthy()
  expect(svgOf(a.container)).toBe(svgOf(b.container))
})

it('el nombre cambia de texto, la cara no', () => {
  // El perfilHeader muestra "Ana Maria" (formatUserIdentity capitaliza el
  // username) y el resto de sitios muestran el username crudo. La cara tiene
  // que ser la misma en los dos.
  const conUsername = { username: 'ana_maria', name: 'Ana Maria' }
  const perfil = render(<Avatar {...avatarPropsFor(conUsername, { name: 'Ana Maria' })} size={96} />).container
  const passport = render(<Avatar {...avatarPropsFor(conUsername)} size={96} />).container
  expect(svgOf(perfil)).toBe(svgOf(passport))
})

it('un usuario sin avatarSeed y sin name no comparte cara con los demas', () => {
  const sinNombre = render(<Avatar {...avatarPropsFor({ username: 'ana' })} />).container
  const otro = render(<Avatar {...avatarPropsFor({ username: 'luis' })} />).container
  expect(svgOf(sinNombre)).not.toBe(svgOf(otro))
  // El passport caia en el literal "Usuario", que es la misma cara para todos.
  const literal = render(<Avatar {...avatarPropsFor({})} />).container
  const mismoDefecto = render(<Avatar {...avatarPropsFor({ username: 'quien sea' }, { name: 'Usuario' })} />).container
  expect(svgOf(literal)).not.toBe(svgOf(mismoDefecto))
})

it('Avatar y BlobatarAvatar usan el mismo tamano por defecto', () => {
  const a = render(<Avatar {...avatarPropsFor(user)} />).container
  const b = render(<BlobatarAvatar {...avatarPropsFor(user)} />).container
  expect(a.firstElementChild.style.width).toBe('44px')
  expect(b.firstElementChild.style.width).toBe('44px')
})

it('avatarSeed, avatarHue y avatarTone determinan la cara, no solo el nombre', () => {
  const base = render(<Avatar {...avatarPropsFor(user)} />).container
  const otraSeed = render(<Avatar {...avatarPropsFor({ ...user, avatarSeed: 'otro' })} />).container
  const otroHue = render(<Avatar {...avatarPropsFor({ ...user, avatarHue: 20 })} />).container
  expect(svgOf(base)).not.toBe(svgOf(otraSeed))
  expect(svgOf(base)).not.toBe(svgOf(otroHue))
})

it('dos personas distintas no comparten blobatar', () => {
  const a = render(<Avatar {...avatarPropsFor({ username: 'ana' })} />).container
  const b = render(<Avatar {...avatarPropsFor({ username: 'luis' })} />).container
  expect(svgOf(a)).not.toBe(svgOf(b))
})

it('la foto manda sobre el blobatar en los dos componentes', () => {
  const conFoto = { ...user, avatarUrl: 'https://lh3.googleusercontent.com/a/ana' }
  const a = render(<Avatar {...avatarPropsFor(conFoto)} />)
  const b = render(<BlobatarAvatar {...avatarPropsFor(conFoto)} />)
  expect(imgOf(a.container)).toBe('https://lh3.googleusercontent.com/a/ana')
  expect(imgOf(b.container)).toBe('https://lh3.googleusercontent.com/a/ana')
  expect(svgOf(a.container)).toBe('')
})

it('si la foto falla al cargar, cae al blobatar en vez de romperse', () => {
  const conFoto = { ...user, avatarUrl: 'https://example.test/roto.png' }
  const { container } = render(<Avatar {...avatarPropsFor(conFoto)} />)
  fireEvent.error(container.querySelector('img'))
  expect(container.querySelector('svg')).toBeTruthy()
})

it('los mocks locales /avatars/ no cuentan como foto real', () => {
  const { container } = render(<Avatar {...avatarPropsFor({ ...user, avatarUrl: '/avatars/ana.png' })} />)
  expect(container.querySelector('img')).toBeNull()
  expect(svgOf(container)).toBeTruthy()
})

it('avatarStyle elige iniciales e icono en vez del blobatar', () => {
  const iniciales = render(<Avatar {...avatarPropsFor({ ...user, avatarStyle: 'initials' })} />).container
  expect(iniciales.textContent).toBe('a')
  expect(iniciales.querySelector('svg')).toBeNull()
  const icono = render(<Avatar {...avatarPropsFor({ ...user, avatarStyle: 'icon', avatarIcon: 'headphones' })} />).container
  expect(icono.querySelector('svg')).toBeTruthy()
  expect(svgOf(icono)).not.toBe(svgOf(render(<Avatar {...avatarPropsFor(user)} />).container))
})

it('el nombre sale de username, y userName y name son respaldo', () => {
  const conUsername = render(<Avatar {...avatarPropsFor({ username: 'ana', name: 'Ana Otra' })} />).container
  const conName = render(<Avatar {...avatarPropsFor({ name: 'ana' })} />).container
  expect(svgOf(conUsername)).toBe(svgOf(conName))
  const conUserName = render(<Avatar {...avatarPropsFor({ userName: 'ana' })} />).container
  expect(svgOf(conUsername)).toBe(svgOf(conUserName))
})

it('acepta avatarColor como alias de avatarBg y un size en pixeles', () => {
  const { container } = render(<Avatar {...avatarPropsFor({ ...user, avatarBg: undefined, avatarColor: '#059669' })} size={72} />)
  const box = container.firstElementChild
  expect(box.style.width).toBe('72px')
  expect(box.style.background).toBe('rgb(5, 150, 105)')
})
