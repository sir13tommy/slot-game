import * as PIXI from 'pixi.js'

export default class {
  constructor (app) {
    this.app = app
    this.width = app.renderer.width
    this.height = app.renderer.height
    this.init()
  }
  init () {
    // load an images
    PIXI.loader.add(['sprite_main.json']).load((loader, resources) => {
      let mainContainer = new PIXI.Container()

      let bg = new PIXI.Sprite(PIXI.utils.TextureCache['BG.png'])
      this.bg = bg
      bg.position.set(0, 0)
      mainContainer.addChild(bg)

      let spin = new PIXI.Sprite(PIXI.utils.TextureCache['BTN_Spin.png'])
      spin.anchor.x = 0.5
      spin.anchor.y = 0.5

      spin.position.set(873, 268)
      mainContainer.addChild(spin)

      let spinRotation = PIXI.tweenManager.createTween(spin)
      spinRotation.to({
        rotation: Math.PI / 180 * 360
      })
      spinRotation.easing = PIXI.tween.Easing.linear()
      spinRotation.time = 400000
      spinRotation.loop = true
      spinRotation.start()

      this.app.stage.addChild(mainContainer)
    });
  }
  update () {

  }
}
