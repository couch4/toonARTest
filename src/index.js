import AFRAME from 'aframe'
import 'aframe-extras'
import { animateIn } from './animate'
import sceneHtml from './scene.html'

console.log('AFRAME', sceneHtml)

AFRAME.registerComponent('model', {
  init: () => {
    model.addEventListener('model-loaded', () => {
      console.log(model, animateIn)
      animateIn(model.object3D, model.sceneEl)
    })
  },
})

const insertHtml = (sceneHtml) => {
  const html = document.getElementsByTagName('html')[0]
  const origHtmlClass = html.className
  document.body.insertAdjacentHTML('beforeend', sceneHtml)
  // Cleanup
  return () => {
    const ascene = document.getElementsByTagName('a-scene')[0]
    ascene.parentNode.removeChild(ascene)
    html.className = origHtmlClass
  }
}

insertHtml(sceneHtml)
