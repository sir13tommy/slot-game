function spriteToButton (sprite, onclick, textureOver, textureDown, contentContainer) {
  let texture = sprite.texture

  sprite.buttonMode = true
  sprite.interactive = true

  sprite.on('pointerdown', onButtonDown)
    .on('pointerup', onButtonUp)
    .on('pointerupoutside', onButtonUp)
    .on('pointerover', onButtonOver)
    .on('pointerout', onButtonOut)
    .on('click', onclick)
    .on('tap', onclick)

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
