function Scene(backgroundSrc, scenario, objects, loaded)
{
  this.wRatio = 1
  this.hRatio = 1
  
  this.background = new Image()
  this.background.src = backgroundSrc
  this.background.onload = imageLoaded
  
  let elements = []
  scenario.forEach((obj, i, arr) =>
  {
    let tempImg = new Image()
    tempImg.src = obj.src
    tempImg.onload = imageLoaded
    
    elements.push({ x: obj.x, y: obj.y, img: tempImg })
  })
  this.scenario = elements
  
  elements = []
  objects.forEach((obj, i, arr) =>
  {
    let tempImg = new Image()
    tempImg.src = obj.src
    tempImg.onload = imageLoaded
    
    elements.push({ x: obj.x, y: obj.y, img: tempImg })
  })
  this.objects = elements
  
  //Function to call loaded function when all of the resources were loaded
  let toLoad = 1 + scenario.length + objects.length
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
    
    //Draw the scenario
    this.scenario.forEach((obj) =>
    {
      x.drawImage(obj.img, obj.x * this.wRatio, obj.y * this.hRatio, obj.img.width * this.wRatio, obj.img.height * this.hRatio)
    })
    
    //Draw the interactable objects
    this.objects.forEach((obj) =>
    {
      x.drawImage(obj.img, obj.x * this.wRatio, obj.y * this.hRatio, obj.img.width * this.wRatio, obj.img.height * this.hRatio)
    })
  }
  
  this.renderSceneObject = (i) =>
  {
    let obj = this.scenario[i]
    if (obj)
      x.drawImage(obj.img, obj.x * this.wRatio, obj.y * this.hRatio, obj.img.width * this.wRatio, obj.img.height * this.hRatio)
  }
    
  this.resize = () =>
  {
    this.wRatio = c.width / baseScreen.width,
    this.hRatio = c.height / baseScreen.height
  }
  
  this.resize()
}