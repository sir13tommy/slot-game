import * as PIXI from 'pixi.js'
import 'pixi-tween'
import SlotMachine from './slot-machine'
import SlotMachineView from './slot-machine-view'

function gameStart () {
  const app = new PIXI.Application({
    transparent: true,
    antialias: true,
    width: window.innerWidth,
    height: window.innerHeight
  });

  const views = []

  const slotMachine = new SlotMachine(0, 6)
  const slotMachineView = new SlotMachineView(app)
  views.push(slotMachineView)

  // append our game to body
  document.body.appendChild(app.view);

  // Add game resizing including device pixel ratio
  app.renderer.view.style.position = 'absolute';
  app.renderer.view.style.display = 'block';

  window.addEventListener('resize', () => {
    let windowWidth = window.innerWidth
    let windowHeight = window.innerHeight
    app.renderer.resize(windowWidth, windowHeight)
  })

  // update views
  app.ticker.add(delta => {
    // make all tweens working
    PIXI.tweenManager.update(delta)

    // update views
    views.forEach(view => {
      if (view.hasOwnProperty('update') && typeof view.update === 'function') {
        view.update(delta)
      }
    })
  })
}

gameStart()

if (__DEV__) {
  console.log(`Build hash: ${__webpack_hash__}`)
}
