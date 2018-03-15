function Character(cx, cy, spriteSrc, loaded)
{
  this.x = cx
  this.y = cy
  
  this.image = new Image()
  this.image.src = spriteSrc
  this.image.onload = loaded
  
  this.render = () =>
  {
    x.drawImage(this.image, this.x, this.y)
  }
}