function Scene(backgroundSrc, objects, loaded)
{
  this.background = new Image()
  this.background.src = backgroundSrc
  
  let elements = []
  objects.forEach((obj, i, arr) =>
  {
    let tempImg = new Image()
    tempImg.src = obj.src
    
    elements.push({ x: obj.x, y: obj.y, img: tempImg })
  })
  
  this.elements = elements
  
  this.render = () =>
  {
    let wRatio = c.width / 1920,
        hRatio = c.height / 1080
    
    //Draw the background
    x.drawImage(this.background, 0, 0)
    
    //Draw the elements
    this.elements.forEach((obj) =>
    {
      x.drawImage(obj.img, obj.x * this.wRatio, obj.y * this.hRatio, obj.img.width * this.wRatio, obj.img.height * this.hRatio)
    })
  }
    
  this.wRatio = 1
  this.hRatio = 1
  this.resize = () =>
  {
    this.wRatio = c.width / 1920
    this.hRatio = c.height / 1080
  }
}