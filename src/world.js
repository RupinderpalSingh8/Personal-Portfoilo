import * as THREE from 'three'

const SPACING = 7
const INK = 0x0e1a24

export function createWorld(canvas, scenes, onPick) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
    alpha: false,
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor(INK, 1)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(INK)
  scene.fog = new THREE.Fog(INK, 9, 26)

  const camera = new THREE.PerspectiveCamera(40, 1, 0.08, 80)
  const stations = new THREE.Group()
  scene.add(stations)

  const owned = []
  const gold = track(
    new THREE.MeshStandardMaterial({ color: 0xcc8e3c, metalness: 0.45, roughness: 0.38 }),
  )
  const plinthMat = track(
    new THREE.MeshStandardMaterial({ color: 0x1b242e, roughness: 0.9, metalness: 0.04 }),
  )
  const boardMat = track(
    new THREE.MeshStandardMaterial({ color: 0x17212b, roughness: 0.88 }),
  )
  const wallMat = track(
    new THREE.MeshStandardMaterial({ color: 0x121c27, roughness: 1 }),
  )
  const lampMetal = track(
    new THREE.MeshStandardMaterial({ color: 0x3a2c1d, metalness: 0.55, roughness: 0.42 }),
  )
  const shadeMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xcc8e3c,
      emissive: 0xcc8e3c,
      emissiveIntensity: 0.55,
      roughness: 0.4,
      side: THREE.DoubleSide,
    }),
  )

  scene.add(new THREE.AmbientLight(0xf3efe6, 0.38))
  scene.add(new THREE.HemisphereLight(0xf4efe6, 0x0e1a24, 0.45))
  const cool = new THREE.DirectionalLight(0x9eb8c9, 0.5)
  cool.position.set(-4, 5, 6)
  scene.add(cool)

  const spot = new THREE.SpotLight(0xffd7a1, 3.4, 14, 0.62, 0.55, 1)
  scene.add(spot)
  scene.add(spot.target)

  const looks = []
  const cams = []
  const loader = new THREE.TextureLoader()

  scenes.forEach((station, index) => {
    const x = Math.sin(index * 0.48) * 0.4
    const z = -index * SPACING
    const group = new THREE.Group()
    group.position.set(x, 0, z)
    stations.add(group)

    const plinth = new THREE.Mesh(track(new THREE.BoxGeometry(2.5, 0.56, 0.78)), plinthMat)
    plinth.position.y = 0.28
    const strip = new THREE.Mesh(track(new THREE.BoxGeometry(1.5, 0.025, 0.03)), gold)
    strip.position.set(0, 0.27, 0.4)
    plinth.add(strip)
    group.add(plinth)

    const mount = new THREE.Group()
    group.add(mount)
    tag(group, index)

    if (station.marker === 'lamp') addLamp(mount)
    else if (!station.images?.length) addEmptyFrame(mount)
    else loadImages(station, mount, plinth, index)

    looks.push(new THREE.Vector3(x, 1.42, z))
    cams.push(new THREE.Vector3(x, 1.42, z + 5.15))
  })

  const length = (scenes.length - 1) * SPACING + 18
  const midZ = -((scenes.length - 1) * SPACING) / 2
  const floor = new THREE.Mesh(
    track(new THREE.PlaneGeometry(16, length)),
    track(new THREE.MeshStandardMaterial({ color: 0x101920, roughness: 0.94, metalness: 0.04 })),
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0, midZ)
  scene.add(floor)

  const ceiling = new THREE.Mesh(
    track(new THREE.PlaneGeometry(16, length)),
    track(new THREE.MeshStandardMaterial({ color: 0x0c141c, roughness: 1 })),
  )
  ceiling.rotation.x = Math.PI / 2
  ceiling.position.set(0, 4.3, midZ)
  scene.add(ceiling)

  ;[-5.4, 5.4].forEach((x) => {
    const wall = new THREE.Mesh(track(new THREE.BoxGeometry(0.28, 4.3, length)), wallMat)
    wall.position.set(x, 2.15, midZ)
    scene.add(wall)
  })

  const ribGeo = track(new THREE.BoxGeometry(0.07, 3.5, 0.07))
  for (let i = 0; i < scenes.length; i += 1) {
    ;[-5.15, 5.15].forEach((x) => {
      const rib = new THREE.Mesh(ribGeo, wallMat)
      rib.position.set(x, 1.75, -i * SPACING)
      scene.add(rib)
    })
  }

  const floorCurve = new THREE.CatmullRomCurve3(
    looks.map((point) => new THREE.Vector3(point.x, 0.045, point.z)),
    false,
    'centripetal',
  )
  scene.add(
    new THREE.Mesh(track(new THREE.TubeGeometry(floorCurve, 120, 0.02, 5, false)), gold),
  )

  const cameraCurve = new THREE.CatmullRomCurve3(cams, false, 'centripetal')
  const lookCurve = new THREE.CatmullRomCurve3(looks, false, 'centripetal')

  const pointer = new THREE.Vector2()
  const raycaster = new THREE.Raycaster()
  let progress = 0
  let running = false
  let raf = 0

  function track(resource) {
    owned.push(resource)
    return resource
  }

  function tag(object, index) {
    object.traverse((child) => {
      child.userData.sceneIndex = index
    })
  }

  function addBorder(parent, width, height) {
    const t = 0.045
    const d = 0.05
    const parts = [
      [width + t * 2, t, d, 0, height / 2 + t / 2, 0],
      [width + t * 2, t, d, 0, -height / 2 - t / 2, 0],
      [t, height, d, -width / 2 - t / 2, 0, 0],
      [t, height, d, width / 2 + t / 2, 0, 0],
    ]
    parts.forEach(([w, h, depth, x, y, z]) => {
      const piece = new THREE.Mesh(track(new THREE.BoxGeometry(w, h, depth)), gold)
      piece.position.set(x, y, z)
      parent.add(piece)
    })
  }

  function addEmptyFrame(mount) {
    const width = 1.45
    const height = 1.9
    const holder = new THREE.Group()
    holder.position.y = 0.64 + height / 2
    const backing = new THREE.Mesh(
      track(new THREE.PlaneGeometry(width, height)),
      track(new THREE.MeshBasicMaterial({ color: 0x101820 })),
    )
    backing.position.z = 0.01
    holder.add(backing)
    addBorder(holder, width, height)
    mount.add(holder)
  }

  function addLamp(mount) {
    mount.position.y = 0.56
    const base = new THREE.Mesh(track(new THREE.CylinderGeometry(0.28, 0.32, 0.08, 20)), lampMetal)
    base.position.y = 0.08
    const stem = new THREE.Mesh(track(new THREE.CylinderGeometry(0.025, 0.025, 0.62, 10)), lampMetal)
    stem.position.y = 0.4
    const shade = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.16, 0.28, 0.28, 20, 1, true)),
      shadeMat,
    )
    shade.position.y = 0.78
    mount.add(base, stem, shade)
  }

  function loadImages(station, mount, plinth, index) {
    const planes = new Array(station.images.length)
    let pending = station.images.length

    const finish = () => {
      pending -= 1
      if (pending > 0) return
      const ready = planes.filter(Boolean)
      if (!ready.length) {
        addEmptyFrame(mount)
        tag(mount, index)
        return
      }
      layoutPhotos(mount, plinth, ready)
      tag(mount, index)
    }

    station.images.forEach((image, imageIndex) => {
      loader.load(
        image.src,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace
          tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
          owned.push(tex)
          const aspect = tex.image.width / Math.max(1, tex.image.height)
          planes[imageIndex] = { tex, aspect, matte: Boolean(image.matte) }
          finish()
        },
        undefined,
        () => finish(),
      )
    })
  }

  function layoutPhotos(mount, plinth, planes) {
    const count = planes.length
    const maxH = count > 1 ? 1.15 : 1.72
    const maxW = count > 1 ? 1.2 : 2.35
    const gap = 0.16
    const sized = planes.map((plane) => {
      let height = maxH
      let width = height * plane.aspect
      if (width > maxW) {
        width = maxW
        height = width / plane.aspect
      }
      return { ...plane, width, height }
    })
    const totalW = sized.reduce((sum, plane) => sum + plane.width, 0) + gap * (count - 1)
    let cursor = -totalW / 2
    const tallest = Math.max(...sized.map((plane) => plane.height))
    const baseY = 0.64

    sized.forEach((plane) => {
      const holder = new THREE.Group()
      const centerX = cursor + plane.width / 2
      cursor += plane.width + gap
      holder.position.set(centerX, baseY + plane.height / 2, 0.05)
      if (plane.matte) {
        const matte = new THREE.Mesh(
          track(new THREE.PlaneGeometry(plane.width, plane.height)),
          track(new THREE.MeshBasicMaterial({ color: 0xf3efe6 })),
        )
        matte.position.z = 0.01
        holder.add(matte)
      }
      const photoMat = track(new THREE.MeshBasicMaterial({ map: plane.tex }))
      const photo = new THREE.Mesh(track(new THREE.PlaneGeometry(plane.width, plane.height)), photoMat)
      photo.position.z = 0.03
      holder.add(photo)
      addBorder(holder, plane.width, plane.height)
      mount.add(holder)
    })

    const board = new THREE.Mesh(
      track(new THREE.BoxGeometry(totalW + 0.28, tallest + 0.24, 0.05)),
      boardMat,
    )
    board.position.set(0, baseY + tallest / 2, -0.02)
    mount.add(board)
    plinth.scale.x = Math.max(1, (totalW + 0.7) / 2.5)
  }

  function applyProgress(value) {
    progress = Math.min(1, Math.max(0, value))
    const camPos = cameraCurve.getPointAt(progress)
    const lookPos = lookCurve.getPointAt(Math.min(1, progress + 0.04))
    const desktop = document.documentElement.classList.contains('desktop')
    const shift = desktop ? 1.05 : 0
    camera.position.set(camPos.x + shift * 0.3, camPos.y, camPos.z)
    camera.lookAt(lookPos.x - shift, lookPos.y, lookPos.z)
    const frame = lookCurve.getPointAt(progress)
    spot.position.set(frame.x + 0.35, frame.y + 1.7, frame.z + 1.5)
    spot.target.position.copy(frame)
  }

  function resize() {
    const width = canvas.clientWidth || window.innerWidth
    const height = canvas.clientHeight || window.innerHeight
    if (!width || !height) return
    const mobile = window.matchMedia('(max-width: 760px)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 2 : 1.5))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  function loop() {
    if (!running) return
    renderer.render(scene, camera)
    raf = requestAnimationFrame(loop)
  }

  function setRunning(value) {
    if (value) {
      resize()
      applyProgress(progress)
      if (!running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
      return
    }
    running = false
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  function pick(event) {
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return null
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    const hits = raycaster.intersectObjects(stations.children, true)
    return hits.find((hit) => hit.object.userData.sceneIndex !== undefined) || null
  }

  function onPointerDown(event) {
    const hit = pick(event)
    if (hit) onPick(hit.object.userData.sceneIndex)
  }

  function onPointerMove(event) {
    canvas.style.cursor = pick(event) ? 'pointer' : 'default'
  }

  function onVisibility() {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      return
    }
    if (running) raf = requestAnimationFrame(loop)
  }

  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  document.addEventListener('visibilitychange', onVisibility)
  const observer = new ResizeObserver(() => resize())
  observer.observe(canvas)
  resize()
  applyProgress(0)

  function destroy() {
    setRunning(false)
    observer.disconnect()
    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('visibilitychange', onVisibility)
    owned.forEach((resource) => {
      if (resource.isTexture) resource.dispose()
      else if (resource.dispose) resource.dispose()
    })
    renderer.dispose()
  }

  return {
    setProgress: applyProgress,
    setRunning,
    resize,
    destroy,
  }
}
