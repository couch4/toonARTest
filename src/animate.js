import {
  AnimationMixer,
  Clock,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
  ReinhardToneMapping,
  Vector2,
  Vector3,
} from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { gsap, Elastic, Expo } from 'gsap'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'

let vars = {
  speed: 1,
}

let visible = false
let action
let shoeState = 1
let shoeEl

const speedUp = () => {
  gsap.to(vars, 1.1, {
    speed: 10,
    delay: 6,
    ease: Expo.easeIn,
    onStart: () => {
      action.reset().play()
      action.paused = false
      setTimeout(() => {
        const [pixels, shoeMesh, tuneSquad] = shoeEl.children
        gsap.set(shoeMesh.scale, { x: shoeState === 0 ? 1 : -1 })
        gsap.set(tuneSquad.scale, {
          x: shoeState,
          y: shoeState,
          z: shoeState,
        })
        const six = shoeMesh.children.filter((val) => val.name === '6')[0]
        const sixScale = shoeState === 0 ? 1 : 0
        gsap.set(six.scale, { x: sixScale, y: sixScale, z: sixScale })
      }, 1100)
    },
    onComplete: slowDown,
  })
}

const slowDown = () => {
  gsap.to(vars, 1.1, {
    speed: 1,
    delay: 0.5,
    ease: Expo.easeOut,
    onComplete: () => {
      shoeState = shoeState === 0 ? 1 : 0
      if (visible === true) speedUp()
      action.paused = true
    },
  })
}

const getEdges = (mesh, color) => {
  const edges = new EdgesGeometry(mesh.geometry)
  const line = new LineSegments(edges, new LineBasicMaterial({ color }))
  mesh.add(line)
}

const setLayer = (obj) => {
  obj.traverse(function (object) {
    if (object.isMesh) {
      object.layers.enable(1)
    }
  })
}

const getRingEdges = (sjRings) => {
  const rings = sjRings.children
  for (let i = 0; i < rings.length; i++) {
    const ring = rings[i]
    getEdges(ring, 0xd5c04e)
  }
}

const spinLogo = (converse) => {
  if (!visible) return null

  const delay = 8
  gsap.to(converse.position, 1, { z: -0.2, delay, ease: Expo.easeOut })
  gsap.to(converse.scale, 1, {
    x: 0.5,
    y: 0.5,
    z: 0.5,
    delay,
    ease: Expo.easeOut,
  })
  gsap.to(converse, 1, { alpha: 0, ease: Expo.easeOut })
  gsap.to(converse.rotation, 1, {
    z: 20,
    delay,
    ease: Expo.easeOut,
    onComplete: () => {
      gsap.to(converse.position, 1, {
        z: 0.2,
        x: 1,
        ease: Expo.easeOut,
      })
      gsap.to(converse.scale, 1, { x: 2, y: 2, z: 2, ease: Expo.easeOut })
      gsap.to(converse, 1, { alpha: 1, ease: Expo.easeOut })
      gsap.to(converse.rotation, 0.8, {
        z: 0.5,
        ease: Expo.easeOut,
        onComplete: () => {
          spinLogo(converse)
        },
      })
    },
  })
}

const resetAll = (objects) => {
  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i]
    gsap.set(obj.scale, { x: 0, y: 0, z: 0 })
  }
}

export const animateIn = (model, sceneEl) => {
  const main = model.children[0]

  const [basketballs, spaceJam, ticker, converse, rings, shoe] = main.children
  const [sjText, sjRings, sjNewLegacy] = spaceJam.children

  const renderer = sceneEl.renderer
  const camera = document.querySelector('[camera]').getObject3D('camera')
  const scene = sceneEl.object3D
  shoeEl = shoe
  const tuneSquad = shoe.children[2]
  const pixels = shoe.children[0]
  tuneSquad.scale.set(new Vector3(0, 0, 0))

  getEdges(sjText.children[0].children[1])

  renderer.toneMapping = ReinhardToneMapping

  //   camera.layers.enable(0)
  //   camera.layers.enable(1)

  //   scene.traverse(function (object) {
  //     if (object.isLight) {
  //       object.layers.enable(1)
  //     }
  //   })

  //   renderer.autoClear = false
  //   setLayer(pixels)
  //   setLayer(converse)
  //   setLayer(ticker)

  //   const renderPass = new RenderPass(scene, camera)

  const params = {
    exposure: 1,
    bloomStrength: 5,
    bloomThreshold: 0,
    bloomRadius: 0,
    scene: 'Scene with Glow',
  }

  //   const bloom = new BloomPass(
  //     new Vector2(window.innerWidth, window.innerHeight),
  //     1.5,
  //     0.4,
  //     0.85
  //   )
  //   bloom.exposure = params.exposure
  //   bloom.threshold = params.bloomThreshold
  //   bloom.strength = params.bloomStrength
  //   bloom.radius = params.bloomRadius
  //   bloom.renderToScreen = true

  //   const composer = new EffectComposer(renderer)
  //   composer.setSize(window.innerWidth, window.innerHeight)
  //   composer.addPass(renderPass)
  //   composer.addPass(bloom)

  const gui = new GUI()

  const folder = gui.addFolder('Exposure')
  //   const folder2 = gui.addFolder('glass Texture')

  folder.add(params, 'exposure', 0.1, 2).onChange(function (value) {
    renderer.toneMappingExposure = Math.pow(value, 4.0)
    composer.render()
  })

  //   folder.add(params, 'bloomThreshold', 0.0, 1.0).onChange(function (value) {
  //     bloom.threshold = Number(value)
  //     composer.render()
  //   })

  //   folder.add(params, 'bloomStrength', 0.0, 10.0).onChange(function (value) {
  //     bloom.strength = Number(value)
  //     composer.render()
  //   })

  //   folder
  //     .add(params, 'bloomRadius', 0.0, 1.0)
  //     .step(0.01)
  //     .onChange(function (value) {
  //       bloom.radius = Number(value)
  //       composer.render()
  //     })

  //   const materialParams = {
  //     reflectivity: 0.5,
  //     roughness: 0.5,
  //     alpha: 0.5,
  //   }

  //   const glass = scene.traverse(function (object) {
  //     if (object.isMaterial) {
  //       console.log(object)
  //     }
  //   })

  //   folder2.add(materialParams, 'reflectivity', 0, 1).onChange((value) => {})

  ////////////////////////////// SETUP GLTF ANIMATION

  const mixer = new AnimationMixer(main)
  action = mixer.clipAction(main.animations[0])
  action.clampWhenFinished = true
  action.enabled = true
  action.play()
  action.paused = true

  const clock = new Clock()

  const animateRings = (rings, wave) => {
    for (let i = 0; i < rings.length; i++) {
      let ringScale = 0.9
      if (i === 5) ringScale = 5.5
      const ring = rings[i]
      ring.scale.y = ringScale - wave + 0.1 * i
      ring.scale.x = ringScale - wave + 0.1 * i
    }
  }

  const bbSpinSpeed = [
    Math.random() * 0.5,
    Math.random() * 0.5,
    Math.random() * 0.5,
  ]

  const spinBasketballs = (bbs, delta) => {
    for (let i = 0; i < bbs.length; i++) {
      const bb = bbs[i]

      bb.rotation.x += delta * bbSpinSpeed[0]
      bb.rotation.y += delta * bbSpinSpeed[1]
      bb.rotation.z += delta * bbSpinSpeed[2]
    }
  }

  resetAll(main.children)
  shoe.rotation.y = Math.PI * 0.7
  gsap.set(model.scale, { x: 0.7, y: 0.7, z: 0.7 })
  gsap.to(rings.scale, 2, {
    x: 1,
    y: 1,
    z: 1,
    delay: 0.5,
    ease: Elastic.easeOut,
  })
  gsap.to(shoe.scale, 2, {
    x: 4,
    y: 4,
    z: 4,
    delay: 1.4,
    ease: Elastic.easeOut,
  })
  gsap.to(basketballs.scale, 2, {
    x: 1,
    y: 1,
    z: 1,
    delay: 1.2,
    ease: Elastic.easeOut,
  })
  gsap.to(converse.scale, 2, {
    x: 2,
    y: 2,
    z: 2,
    delay: 1.4,
    ease: Elastic.easeOut,
  })
  gsap.to(spaceJam.scale, 2, {
    x: 1,
    y: 1,
    z: 1,
    delay: 1.7,
    ease: Elastic.easeOut,
  })
  gsap.to(ticker.scale, 2, {
    x: 1.2,
    y: 1.2,
    z: 1.2,
    delay: 1.9,
    ease: Expo.easeOut,
  })

  gsap.set(sjRings.position, { z: 0.8, x: 0.05 })
  gsap.set(sjRings.scale, { z: 0, y: 0, x: 0 })
  gsap.to(sjRings.position, 2, {
    z: 0,
    y: 0,
    delay: 2.8,
    ease: Elastic.easeOut,
  })
  sjRings.rotation.order = 'XZY'
  gsap.set(sjRings.rotation, { x: 6 })
  gsap.to(sjRings.rotation, 2, {
    x: 1.7,
    delay: 2.8,
    ease: Elastic.easeOut,
  })
  gsap.to(sjRings.scale, 0.5, {
    x: 1,
    y: 1,
    z: 1,
    delay: 2.8,
    ease: Expo.easeOut,
  })

  speedUp()

  //   sjRings.rotation.x = 2.5

  function step() {
    const delta = clock.getDelta()
    const elapsed = clock.getElapsedTime()
    const wave = Math.cos(elapsed) * 0.1
    const wave2 = Math.sin(elapsed) * 0.2

    shoe.rotation.y += delta * vars.speed
    shoe.rotation.x = 0 - wave2 * 1
    shoe.rotation.z = 0 - wave2 * 0.5

    ticker.rotation.z -= delta * (vars.speed / 10)
    basketballs.rotation.y -= delta * (vars.speed / 5)
    animateRings(rings.children, wave)
    spinBasketballs(basketballs.children, delta)

    sjRings.rotation.y -= delta * 0.5
    sjRings.rotation.z = 0 - wave2 * 1

    // spaceJam.rotation.x = -1.5 - wave * 0.5
    spaceJam.rotation.y = 0 - wave * 0.1
    spaceJam.rotation.z = 0 - wave * 0.1
    spaceJam.position.y = 0.74 - wave * 0.3

    converse.rotation.x = 1.7 - wave * 0.5
    converse.rotation.y = 0 - wave * 0.9
    converse.position.y = 0.74 - wave * 0.4

    mixer.update(delta)

    main.visible = true

    // renderer.clear()

    // camera.layers.set(1)
    // composer.render()

    // Clear depth cache
    // renderer.clearDepth()
    // camera.layers.set(0)
    // renderer.render(scene, camera)

    //continue animation if visible
    if (visible === true) {
      requestAnimationFrame(step)
    }
  }
  visible = true
  spinLogo(converse)
  window.requestAnimationFrame(step)
}

export const animateOut = (model) => {
  const main = model.children[0]
  const [basketballs, spaceJam, ticker, converse, rings, shoe] = main.children
  visible = false

  gsap.to(rings.scale, 0.8, { x: 0, y: 0, z: 0, ease: Expo.easeOut })
  gsap.to(shoe.scale, 0.8, { x: 0, y: 0, z: 0, ease: Expo.easeOut })
  gsap.to(ticker.scale, 0.8, { x: 0, y: 0, z: 0, ease: Expo.easeOut })
  gsap.to(converse.scale, 0.8, { x: 0, y: 0, z: 0, ease: Expo.easeOut })
  gsap.to(basketballs.scale, 0.8, { x: 0, y: 0, z: 0, ease: Expo.easeOut })
  gsap.to(spaceJam.scale, 0.8, { x: 0, y: 0, z: 0, ease: Expo.easeOut })
}
