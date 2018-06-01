import * as PIXI from 'pixi.js'
import utils from './utils'

export default class {
  constructor (config) {
    this.app = config.app
    this._onInput = config.onInput || null
    this._onInputCtx = config.onInputCtx || null

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

      let spinTexture = PIXI.utils.TextureCache['BTN_Spin.png']
      let spin = new PIXI.Sprite(spinTexture)
      spin.anchor.x = 0.5
      spin.anchor.y = 0.5

      spin.position.set(873, 268)
      container.addChild(spin)

      utils.spriteToButton(spin, this._handleInput, this, spinTexture, spinTexture, spinTexture)

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
    if (this._onInput) {
      this._onInput.call(this._onInputCtx || null)
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
    this.inputLocked = true
    let lastTween
    nums.forEach((num, idx) => {
      let col = this._cols[idx]
      if (!col) {
        return
      }

      let step = this._itemSize.height + this._offset.y
      let targetOffsetY = this._baseTileOffsetY + (this._totalItems - num) * step

      let colRolling = PIXI.tweenManager.createTween(col.tilePosition)
      colRolling.to({y: this._colSize.height * 20})
      colRolling.easing = PIXI.tween.Easing.inSine()
      colRolling.delay = 50000 * idx
      colRolling.time = 600000

      let moveToItem = PIXI.tweenManager.createTween(col.tilePosition)
      moveToItem.to({y: targetOffsetY})
      moveToItem.easing = PIXI.tween.Easing.outSine()
      moveToItem.time = 200000

      colRolling.on('end', () => {
        col.tilePosition.y = 0
        moveToItem.start()
      })

      colRolling.start()

      lastTween = moveToItem
    })

    lastTween.on('end', () => {
      this.inputLocked = false
    }, this)
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
