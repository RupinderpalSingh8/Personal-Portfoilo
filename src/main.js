import './style.css'
import { links, scenes } from './scenes.js'
import { createWorld } from './world.js'
import { createScroller } from './scroll.js'
import { renderArticle, renderRail, renderSnaps } from './ui.js'

const root = document.documentElement
const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const mobileQuery = window.matchMedia('(max-width: 760px)')

const story = document.getElementById('story')
const canvas = document.getElementById('world')
const toggle = document.getElementById('mode-toggle') || document.getElementById('mode')
const count = document.getElementById('count')
const resume = document.getElementById('resume-link') || document.getElementById('resume')
const skip = document.querySelector('.skip')

resume.href = links.resume.href
resume.target = '_blank'
resume.rel = 'noopener'

const articles = scenes.map((scene, index) => renderArticle(scene, index))
const rail = renderRail(scenes)
story.append(renderSnaps(scenes), ...articles)
document.body.insertBefore(rail, canvas)

const railLinks = [...rail.querySelectorAll('a')]
let world = null
let index = 0
let mode = reduceQuery.matches ? 'read' : 'flight'
let userOverride = false

function pad(value) {
  return String(value).padStart(2, '0')
}

function scrollTo(nextIndex, behavior = 'smooth', focus = false) {
  const scene = scenes[nextIndex]
  if (!scene) return
  const flight = root.classList.contains('flight')
  const target = document.getElementById(flight ? `snap-${scene.id}` : `station-${scene.id}`)
  target?.scrollIntoView({ behavior, block: 'start' })
  if (focus) {
    document.getElementById(`station-${scene.id}`)?.querySelector('h1, h2')?.focus({ preventScroll: true })
  }
}

function paint(progress) {
  const last = Math.max(1, scenes.length - 1)
  const scaled = progress * last
  index = Math.round(scaled)
  world?.setProgress(progress)

  const crossfade = root.classList.contains('flight')
  articles.forEach((article, articleIndex) => {
    if (!crossfade) {
      article.style.opacity = ''
      article.style.visibility = ''
      article.classList.remove('is-active')
      article.removeAttribute('inert')
      article.removeAttribute('aria-hidden')
      return
    }
    const distance = Math.abs(scaled - articleIndex)
    const t = Math.min(1, distance / 0.62)
    const opacity = 1 - t * t * (3 - 2 * t)
    const active = articleIndex === index && opacity > 0.55
    article.style.opacity = opacity.toFixed(3)
    article.style.visibility = opacity < 0.05 ? 'hidden' : 'visible'
    article.classList.toggle('is-active', active)
    article.toggleAttribute('inert', !active)
    article.setAttribute('aria-hidden', active ? 'false' : 'true')
  })

  railLinks.forEach((link, linkIndex) => {
    if (linkIndex === index) link.setAttribute('aria-current', 'true')
    else link.removeAttribute('aria-current')
  })
  count.textContent = `${pad(index + 1)} / ${pad(scenes.length)} ${scenes[index].nav}`
  const currentLink = railLinks[index]
  if (currentLink && root.classList.contains('mobile')) {
    const bar = currentLink.parentElement
    const left = currentLink.offsetLeft - bar.clientWidth / 2 + currentLink.clientWidth / 2
    bar.scrollTo({ left: Math.max(0, left), behavior: 'auto' })
  }
}

const scroller = createScroller(paint)

function ensureWorld() {
  if (world) return world
  try {
    world = createWorld(canvas, scenes, (picked) => scrollTo(picked))
    return world
  } catch (error) {
    mode = 'read'
    userOverride = true
    toggle.disabled = true
    toggle.textContent = 'Read'
    canvas.remove()
    return null
  }
}

function apply(behavior = 'auto') {
  const mobile = mobileQuery.matches
  root.classList.toggle('mobile', mobile)
  root.classList.toggle('desktop', !mobile)
  root.classList.toggle('flight', mode === 'flight')
  root.classList.toggle('read', mode === 'read')
  root.classList.toggle('snap', mode === 'flight')
  root.style.setProperty('--stations', String(scenes.length))

  const reading = mode === 'read'
  toggle.textContent = reading ? 'Watch' : 'Read'
  toggle.setAttribute('aria-pressed', reading ? 'true' : 'false')

  if (mode === 'flight' && ensureWorld()) {
    world.setRunning(true)
  } else {
    mode = 'read'
    root.classList.add('read')
    root.classList.remove('flight')
    world?.setRunning(false)
  }

  requestAnimationFrame(() => {
    world?.resize()
    scroller.bind()
    scrollTo(index, behavior)
    paint(index / Math.max(1, scenes.length - 1))
  })
}

railLinks.forEach((link, linkIndex) => {
  link.addEventListener('click', (event) => {
    event.preventDefault()
    scrollTo(linkIndex, 'smooth', true)
  })
})

document.querySelector('.brand')?.addEventListener('click', (event) => {
  event.preventDefault()
  scrollTo(0, 'smooth', true)
})

skip?.addEventListener('click', (event) => {
  event.preventDefault()
  const digits = scenes.findIndex((scene) => scene.id === 'digits')
  scrollTo(digits === -1 ? 0 : digits, 'smooth', true)
})

toggle.addEventListener('click', () => {
  if (toggle.disabled) return
  userOverride = true
  mode = mode === 'flight' ? 'read' : 'flight'
  apply('auto')
})

mobileQuery.addEventListener('change', () => apply('auto'))
reduceQuery.addEventListener('change', () => {
  if (userOverride) return
  mode = reduceQuery.matches ? 'read' : 'flight'
  apply('auto')
})

window.addEventListener('resize', () => {
  world?.resize()
})

window.addEventListener('scroll', () => {
  if (!root.classList.contains('read')) return
  const line = mobileQuery.matches ? 140 : 108
  let next = 0
  articles.forEach((article, articleIndex) => {
    if (article.getBoundingClientRect().top <= line) next = articleIndex
  })
  if (next === index) return
  index = next
  railLinks.forEach((link, linkIndex) => {
    if (linkIndex === index) link.setAttribute('aria-current', 'true')
    else link.removeAttribute('aria-current')
  })
  count.textContent = `${pad(index + 1)} / ${pad(scenes.length)} ${scenes[index].nav}`
}, { passive: true })

apply('auto')

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    scroller.destroy()
    world?.destroy()
  })
}
