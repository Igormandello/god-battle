function Character(cx, cy, cw, ch, spriteSrc, loaded)
{
  this.x = cx
  this.y = cy
  
  this.width  = cw
  this.height = ch
  
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
    this.x += dir * 20
    
    if (!this.limits)
    {
      if (this.x < 0)
        this.x = 0
      else if (this.x + this.width > baseScreen.width)
        this.x = baseScreen.width - this.width
    }
    else
      if (this.x < this.limits.min)
        this.x = 0
      else if (this.x + this.width > this.limits.max)
        this.x = baseScreen.width - this.width
  }
  
  this.resize()
}