import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

export function createScroller(onProgress) {
  let ctx = null

  function bind() {
    ctx?.revert()
    ctx = null
    const root = document.documentElement
    if (!root.classList.contains('flight')) return

    ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#story',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.35,
        onUpdate: (self) => onProgress(self.progress),
      })
    })
    ScrollTrigger.refresh()
  }

  function destroy() {
    ctx?.revert()
    ctx = null
  }

  return { bind, destroy }
}
