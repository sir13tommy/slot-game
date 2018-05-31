import * as PIXI from 'pixi.js'
import utils from './utils'

export default class {
  constructor (config) {
    this.app = config.app
    this.onInput = config.onInput || null
    this.onInputCtx = config.onInputCtx || null

    this.width = config.app.renderer.width
    this.height = config.app.renderer.height
    this._cols = []
    this._items = [
      'SYM1.png',
      'SYM3.png',
      'SYM4.png',
      'SYM5.png',
      'SYM6.png',
      'SYM7.png'
    ]
    this._totalItems = this._items.length
    this._itemSize = {
      width: 235,
      height: 155
    }
    this._offset = {
      left: 70,
      x: 6,
      // TODO: fix issues with wrong vertical offset
      y: 0
    }

    this._baseTileOffsetY = 0

    this._colSize = {
      width: 235,
      height: 155 * this._items.length
    }

    this.init()
  }
  init () {
    this.inputLocked = false
    // load an images
    PIXI.loader.add(['sprite_main.json']).load((loader, resources) => {
      let container = new PIXI.Container()
      this.container = container

      let bg = new PIXI.Sprite(PIXI.utils.TextureCache['BG.png'])
      this.bg = bg
      bg.position.set(0, 0)
      container.addChild(bg)

      // mask all content within background
      let mask = new PIXI.Graphics()
      mask.beginFill(0xffffff, 1)
      mask.drawRect(0, 0, bg.width, bg.height)
      mask.endFill()
      container.addChild(mask)
      container.mask = mask

      let spinTexture = PIXI.utils.TextureCache['BTN_SPIN.png']
      let spin = new PIXI.Sprite(spinTexture)
      spin.anchor.x = 0.5
      spin.anchor.y = 0.5

      spin.position.set(873, 268)
      container.addChild(spin)

      utils.spriteToButton(spin, this._handleInput(), spinTexture, spinTexture, spinTexture)

      this._baseTileOffsetY = this.bg.height / 2 - this._itemSize.height / 2
      this._initCols()

      // center view in canvas
      this._centerContainer()
      this.app.stage.addChild(container)
    });
  }

  _handleInput () {
    if (this.inputLocked) {
      return
    }
    if (this.onInput) {
      this.onInput.call(this.onInputCtx || null)
    }
  }

  _initCols () {
    this._initCol(0);
    this._initCol(1);
    this._initCol(2);
  }

  _initCol (idx) {
    let texturesContainer = new PIXI.Container()
    this._items.forEach((item, idx) => {
      let sprite = new PIXI.Sprite(PIXI.utils.TextureCache[item])
      sprite.position.set(0, this._offset.y + idx * (this._itemSize.height + this._offset.y))
      texturesContainer.addChild(sprite)
    })
    let tilesTexture = this.app.renderer.generateTexture(texturesContainer)
    let col = new PIXI.extras.TilingSprite(tilesTexture, texturesContainer.width, texturesContainer.height)
    col.position.x = this._offset.left + idx * (this._colSize.width + this._offset.x)
    col.tileTransform.position.y = this._baseTileOffsetY + idx * (this._itemSize.height + this._offset.y)
    this._cols.push(col)
    this.container.addChild(col)
  }

  rollTo (nums) {
    let lastTween
    nums.forEach((num, idx) => {
      let col = this._cols[idx]
      if (!col) {
        return
      }
      let currentOffsetY = col.tilePosition.y

      let step = this._itemSize.height + this._offset.y
      let targetOffsetY = this._baseTileOffsetY + num * step
      let colRolling = PIXI.tweenManager.createTween(col.tilePosition)
      colRolling.to({y: targetOffsetY})
      colRolling.easing = PIXI.tween.Easing.linear()
      colRolling.time = 400000
      colRolling.start()

      lastTween = colRolling
    })
  }

  update () {
  }

  resize (width, height) {
    this.width = width
    this.height = height
    this._centerContainer()
  }
  _centerContainer () {
    this.container.x = this.width / 2 - this.bg.width / 2
    this.container.y = this.height / 2 - this.bg.height / 2
  }
}
