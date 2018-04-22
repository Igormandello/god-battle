var SPRITE_CHANGE = 7

var SPRITE_DIRECTIONS = {
  right_stop: 0,
  right_1: 1,
  right_2: 2,
  left_stop: 3,
  left_1: 4,
  left_2: 5
}

var SPRITE_SEQUENCE =
[
    [SPRITE_DIRECTIONS.right_1, SPRITE_DIRECTIONS.right_stop, SPRITE_DIRECTIONS.right_2, SPRITE_DIRECTIONS.right_stop],
    [SPRITE_DIRECTIONS.left_1, SPRITE_DIRECTIONS.left_stop, SPRITE_DIRECTIONS.left_2, SPRITE_DIRECTIONS.left_stop]
]

var DIRECTION = {
  right: 0,
  left: 1,
}

function Character(cx, cy, cw, ch, speed, spritesheet, loaded) {
  this.x = cx
  this.y = cy

  this.width = cw
  this.height = ch

  this.speed = speed

  this.images = [];
  let sheetLoaded = () => {
    for (let y = 0; y < sheet.height; y += ch)
      for (let x = 0; x < sheet.width; x += cw)
        this.images.push(getClippedRegion(sheet, x, y, cw, ch))

    loaded()
  }

  let sheet = new Image()
  sheet.src = spritesheet
  sheet.onload = sheetLoaded

  this.moving = 0
  this.frameCount = 0
  this.lastDir = DIRECTION.left
}

Character.prototype.update = function(delta, limits) {
  let ret = this.move(delta, limits)

  if (Math.floor(this.frameCount / SPRITE_CHANGE) >= SPRITE_SEQUENCE[0].length)
    this.frameCount = 0

  return ret
}

Character.prototype.render = function() {
  let actualImg = (this.moving == 0 ? this.images[this.lastDir * 3] : this.images[SPRITE_SEQUENCE[this.lastDir][Math.floor(this.frameCount / SPRITE_CHANGE)]])
  x.drawImage(actualImg, this.x * ratios.W_RATIO, this.y * ratios.H_RATIO, this.width * ratios.W_RATIO, this.height * ratios.H_RATIO)
}

Character.prototype.startMoving = function(dir) {
  if (dir > 0)
    this.lastDir = DIRECTION.right
  else
    this.lastDir = DIRECTION.left

  this.moving = dir
}

Character.prototype.move = function(delta, limits) {
  this.frameCount++
  this.x += this.moving * this.speed * delta

  // -1 = hit left limit
  //  0 = no limit was hit
  //  1 = hit right limit
  if (this.x <= limits.min) {
    this.x = limits.min + 1
    return -1
  } else if (this.x + this.width >= limits.max) {
    this.x = limits.max - this.width - 1
    return 1
  }

  return 0
}

Character.prototype.stopMoving = function(dir) {
  if (this.moving == dir)
    this.moving = 0

  this.frameCount = 0
}