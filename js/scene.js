function Scene(backgroundSrc, objects, loaded)
{
  this.wRatio = 1
  this.hRatio = 1
  
  this.background = new Image()
  this.background.src = backgroundSrc
  this.background.onload = imageLoaded
  
  let elements = []
  objects.forEach((obj, i, arr) =>
  {
    let tempImg = new Image()
    tempImg.src = obj.src
    tempImg.onload = imageLoaded
    
    elements.push({ x: obj.x, y: obj.y, img: tempImg })
  })
  this.elements = elements
  
  let toLoad = 1 + elements.length
  function imageLoaded()
  {
    toLoad--
    if (toLoad == 0)
      loaded()
  }
  
  this.render = () =>
  {
    //Draw the background
    x.drawImage(this.background, 0, 0)
    
    //Draw the elements
    this.elements.forEach((obj) =>
    {
      x.drawImage(obj.img, obj.x * this.wRatio, obj.y * this.hRatio, obj.img.width * this.wRatio, obj.img.height * this.hRatio)
    })
  }
  
  this.renderElement = (i) =>
  {
    let obj = this.elements[i]
    x.drawImage(obj.img, obj.x * this.wRatio, obj.y * this.hRatio, obj.img.width * this.wRatio, obj.img.height * this.hRatio)
  }
    
  this.resize = () =>
  {
    this.wRatio = c.width / baseScreen.width,
    this.hRatio = c.height / baseScreen.height
  }
  
  this.resize()
}