function Scene(backgroundSrc, scenario, objects, loaded)
{
  this.background = new Image()
  this.background.src = backgroundSrc
  this.background.onload = imageLoaded
  
  let elements = []
  scenario.forEach((obj, i, arr) =>
  {
    let tempImg = new Image()
    tempImg.src = obj.src
    tempImg.onload = imageLoaded
    
    elements.push({ x: obj.x, y: obj.y, visible: obj.visible, img: tempImg })
  })
  this.scenario = elements
  
  elements = []
  objects.forEach((obj, i, arr) =>
  {
    let tempImg = new Image()
    tempImg.src = obj.src
    tempImg.onload = imageLoaded
    
    elements.push({ x: obj.x, y: obj.y, action: obj.action, visible: obj.visible, img: tempImg })
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
}

Scene.prototype.render = function()
{
  //Draw the background
  x.drawImage(this.background, 0, 0)

  //Draw the scenario
  this.scenario.forEach((obj, i) => this.renderScenarioObject(i))

  //Draw the interactable objects
  this.objects.forEach((obj, i) => this.renderInteractableObject(i))
}

Scene.prototype.renderScenarioObject = function(i)
{
  let obj = this.scenario[i]
  
  if (obj)
    if (obj.visible)
      x.drawImage(obj.img, obj.x * ratios.W_RATIO, obj.y * ratios.H_RATIO, obj.img.width * ratios.W_RATIO, obj.img.height * ratios.H_RATIO)
}

Scene.prototype.toggleScenarioObjectVisibility = function(i)
{
  let obj = this.scenario[i]
  
  if (obj)
    obj.visible = !obj.visible;
}

Scene.prototype.renderInteractableObject = function(i)
{
  let obj = this.objects[i]
  
  if (obj)
    if (obj.visible)
      x.drawImage(obj.img, obj.x * ratios.W_RATIO, obj.y * ratios.H_RATIO, obj.img.width * ratios.W_RATIO, obj.img.height * ratios.H_RATIO)
}

Scene.prototype.toggleInteractableObjectVisibility = function(i)
{
  let obj = this.objects[i]
  
  if (obj)
    obj.visible = !obj.visible;
}

Scene.prototype.changeBackground = function(src, loaded)
{
  this.background = new Image()
  this.background.src = src

  if (loaded)
    this.background.onload = loaded
}

Scene.prototype.interact = function(pos)
{
  this.objects.forEach((obj) => 
  {
    if (!(pos.x < obj.x || pos.y < obj.y || pos.y + pos.height > obj.y + obj.img.height || pos.x + pos.width > obj.x + obj.img.width))
      obj.action();
  })
}