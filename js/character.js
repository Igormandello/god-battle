function Character(cx, cy, cw, ch, speed, spriteSrc, loaded)
{
  this.x = cx
  this.y = cy
  
  this.width  = cw
  this.height = ch
  
  this.speed = speed
  
  this.image = new Image()
  this.image.src = spriteSrc
  this.image.onload = loaded
  
  this.wRatio = 1
  this.hRatio = 1
  this.render = () =>
  {
    x.drawImage(this.image, this.x * this.wRatio, this.y * this.hRatio, this.width * this.wRatio, this.height * this.hRatio)
  }
  
  this.resize = () =>
  {
    this.wRatio = c.width / baseScreen.width,
    this.hRatio = c.height / baseScreen.height
  }
  
  this.move = (dir) =>
  {
    this.x += dir * this.speed
    
    if (!this.limits)
    {
      if (this.x < 0)
        this.x = 0
      else if (this.x + this.width > baseScreen.width)
        this.x = baseScreen.width - this.width
    }
    else
      if (this.x < this.limits.min)
        this.x = this.limits.min
      else if (this.x + this.width > this.limits.max)
        this.x = this.limits.max - this.width
  }
  
  this.resize()
}