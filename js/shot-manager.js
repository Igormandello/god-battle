function ShotManager(imageSrc, loaded) {
  this.shotImg = new Image()
  this.shotImg.src = imageSrc
  this.shotImg.onload = loaded

  this.shots = []
}

ShotManager.prototype.sendShot = function(initialPosition, angle, speed, fn) {
  this.shots.push({
    x: initialPosition.x,
    y: initialPosition.y,
    speedX: Math.cos(angle) * speed,
    speedY: -Math.sin(angle) * speed,
    action: fn
  })
}

ShotManager.prototype.update = function(character, delta) {
  let hit = false
  this.shots.forEach((obj, i, arr) => {
    if (obj.y + this.shotImg.height >= baseScreen.ground) {
      arr.splice(i, 1)
      return
    }

    if (intersects({
        x: obj.x,
        y: obj.y,
        width: this.shotImg.width,
        height: this.shotImg.height
      }, character))
      hit = true

    arr[i].x += obj.speedX * delta
    arr[i].y += obj.speedY * delta
  })

  return !hit
}

ShotManager.prototype.render = function() {
  this.shots.forEach(obj => x.drawImage(this.shotImg, obj.x * ratios.W_RATIO, obj.y * ratios.H_RATIO, this.shotImg.width * ratios.W_RATIO, this.shotImg.height * ratios.H_RATIO))
}