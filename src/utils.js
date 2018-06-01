function spriteToButton (sprite, onclick, ctx, textureOver, textureDown, contentContainer) {
  let texture = sprite.texture

  sprite.buttonMode = true
  sprite.interactive = true

  ctx = ctx || null
  sprite.on('pointerdown', onButtonDown)
    .on('pointerup', onButtonUp)
    .on('pointerupoutside', onButtonUp)
    .on('pointerover', onButtonOver)
    .on('pointerout', onButtonOut)
    .on('click', onclick, ctx)
    .on('tap', onclick, ctx)

  function onButtonDown () {
    this.isdown = true;

    if (contentContainer) {
      contentContainer.y = this.y - 6
    }

    this.texture = textureDown;
    this.alpha = 1;
  }

  function onButtonUp () {
    this.isdown = false;
    if (contentContainer) {
      contentContainer.y = this.y
    }

    if (this.isOver) {
      this.texture = textureOver;
    } else {
      this.texture = texture;
    }
  }

  function onButtonOver () {
    this.isOver = true;

    if (this.isdown) {
      return;
    }

    this.texture = textureOver;
  }

  function onButtonOut () {
    this.isOver = false;

    if (this.isdown) {
      return;
    }

    this.texture = texture;
  }
}

export default {
  spriteToButton
}
