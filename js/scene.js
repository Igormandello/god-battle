function Scene(backgroundSrc, scenario, objects, loaded) {
  this.background = new Image()
  this.background.src = backgroundSrc
  this.background.onload = imageLoaded

  let elements = []
  scenario.forEach((obj, i, arr) => {
    let tempImg = new Image()
    tempImg.src = obj.src
    tempImg.onload = imageLoaded

    elements.push({
      x: obj.x,
      y: obj.y,
      visible: obj.visible,
      img: tempImg
    })
  })
  this.scenario = elements

  elements = []
  objects.forEach((obj, i, arr) => {
    let tempImg = new Image()
    tempImg.src = obj.src
    tempImg.onload = imageLoaded

    elements.push({
      key: obj.key,
      x: obj.x,
      y: obj.y,
      action: obj.action,
      maxActions: obj.maxActions,
      visible: obj.visible,
      img: tempImg
    })
  })
  this.objects = elements

  //Function to call loaded function when all of the resources were loaded
  let toLoad = 1 + scenario.length + objects.length

  function imageLoaded() {
    toLoad--
    if (toLoad == 0)
      loaded()
  }
}

Scene.prototype.render = function() {
  //Draw the background
  x.drawImage(this.background, 0, 0)

  //Draw the scenario
  this.scenario.forEach((obj, i) => this.renderScenarioObject(i))

  //Draw the interactable objects
  this.objects.forEach((obj, i) => this.renderInteractableObject(i))
}

Scene.prototype.renderScenarioObject = function(i) {
  let obj = this.scenario[i]

  if (obj)
    if (obj.visible)
      x.drawImage(obj.img, obj.x * ratios.W_RATIO, obj.y * ratios.H_RATIO, obj.img.width * ratios.W_RATIO, obj.img.height * ratios.H_RATIO)
}

Scene.prototype.toggleScenarioObjectVisibility = function(i) {
  let obj = this.scenario[i]

  if (obj)
    obj.visible = !obj.visible;
}

Scene.prototype.renderInteractableObject = function(i) {
  let obj = this.objects[i]

  if (obj)
    if (obj.visible)
      x.drawImage(obj.img, obj.x * ratios.W_RATIO, obj.y * ratios.H_RATIO, obj.img.width * ratios.W_RATIO, obj.img.height * ratios.H_RATIO)
}

Scene.prototype.toggleInteractableObjectVisibility = function(key) {
  let obj = -1

  this.objects.forEach((o, i, arr) => {
    if (o.key == key)
      obj = i
  })

  if (obj > -1)
    this.objects[obj].visible = !this.objects[obj].visible;
}

Scene.prototype.changeBackground = function(src, loaded) {
  this.background = new Image()
  this.background.src = src

  if (loaded)
    this.background.onload = loaded
}

Scene.prototype.interact = function(pos) {
  this.objects.some(obj => {
    obj.width = obj.img.width
    obj.height = obj.img.height

    if (obj.visible && intersects(pos, obj) && obj.action && (obj.maxActions === undefined || obj.maxActions > 0)) {
      if (obj.action() && obj.maxActions)
        obj.maxActions--
      
      return true
    }
  })
}