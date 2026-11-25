import { links } from './scenes.js'

function external(anchor, link) {
  anchor.href = link.href
  anchor.textContent = link.label
  if (link.external) {
    anchor.target = '_blank'
    anchor.rel = 'noopener'
  }
}

export function renderArticle(scene, index) {
  const article = document.createElement('article')
  article.id = `station-${scene.id}`
  article.dataset.index = String(index)

  const kicker = document.createElement('p')
  kicker.className = 'kicker'
  kicker.textContent = `${String(index + 1).padStart(2, '0')}  ·  ${scene.kicker}`

  const heading = document.createElement(index === 0 ? 'h1' : 'h2')
  heading.tabIndex = -1
  heading.textContent = scene.title
  article.append(kicker, heading)

  if (scene.lede) {
    const lede = document.createElement('p')
    lede.className = 'lede'
    lede.textContent = scene.lede
    article.append(lede)
  }

  if (scene.lines) {
    const list = document.createElement('dl')
    scene.lines.forEach((line) => {
      const row = document.createElement('div')
      const term = document.createElement('dt')
      term.textContent = line.label
      const detail = document.createElement('dd')
      detail.textContent = line.text
      row.append(term, detail)
      list.append(row)
    })
    article.append(list)
  }

  if (scene.schools) {
    const schools = document.createElement('ul')
    schools.className = 'schools'
    scene.schools.forEach((school) => {
      const item = document.createElement('li')
      const image = document.createElement('img')
      image.src = school.src
      image.alt = school.alt
      image.decoding = 'async'
      const text = document.createElement('div')
      const name = document.createElement('strong')
      name.textContent = school.name
      const meta = document.createElement('span')
      meta.textContent = school.meta
      text.append(name, meta)
      item.append(image, text)
      schools.append(item)
    })
    article.append(schools)
  }

  if (!scene.schools) {
    scene.images?.forEach((image) => {
      const still = document.createElement('img')
      still.className = 'still'
      still.src = image.src
      still.alt = image.alt
      still.decoding = 'async'
      article.append(still)
    })
  }

  if (scene.contact) {
    const resume = document.createElement('a')
    resume.className = 'button'
    external(resume, links.resume)
    const list = document.createElement('ul')
    list.className = 'contact-links'
    ;[links.linkedin, links.github, links.phone, links.email].forEach((link) => {
      const item = document.createElement('li')
      const anchor = document.createElement('a')
      external(anchor, link)
      item.append(anchor)
      list.append(item)
    })
    article.append(resume, list)
  }

  if (scene.hint) {
    const hint = document.createElement('p')
    hint.className = 'hint'
    hint.textContent = scene.hint
    article.append(hint)
  }

  if (scene.closing) {
    const closing = document.createElement('p')
    closing.className = 'closing'
    closing.textContent = scene.closing
    article.append(closing)
  }

  return article
}

export function renderRail(scenes) {
  const rail = document.createElement('nav')
  rail.id = 'rail'
  rail.setAttribute('aria-label', 'Stations')
  scenes.forEach((scene) => {
    const link = document.createElement('a')
    link.href = `#station-${scene.id}`
    link.textContent = scene.nav
    rail.append(link)
  })
  return rail
}

export function renderSnaps(scenes) {
  const snaps = document.createElement('div')
  snaps.id = 'snaps'
  snaps.setAttribute('aria-hidden', 'true')
  scenes.forEach((scene) => {
    const snap = document.createElement('div')
    snap.className = 'snap'
    snap.id = `snap-${scene.id}`
    snaps.append(snap)
  })
  return snaps
}
