function Scene(scenes, loaded) {
  //Variable to control how many resources must be loaded
  let toLoad = 0

  let tempScenes = []
  scenes.forEach((scene) => {
    toLoad += 1 + scene.scenario.length + scene.objects.length

    let scenario = []
    scene.scenario.forEach((obj, i, arr) => {
      let tempImg = new Image()
      tempImg.src = obj.src
      tempImg.onload = imageLoaded

      scenario.push({
        x: obj.x,
        y: obj.y,
        visible: obj.visible,
        img: tempImg
      })
    })

    let objects = []
    scene.objects.forEach((obj, i, arr) => {
      let tempImg = new Image()
      tempImg.src = obj.src
      tempImg.onload = imageLoaded

      objects.push({
        key: obj.key,
        x: obj.x,
        y: obj.y,
        action: obj.action,
        maxActions: obj.maxActions,
        destroy: obj.destroy,
        visible: obj.visible,
        img: tempImg
      })
    })

    let background = new Image()
    background.src = scene.backgroundSrc
    background.onload = imageLoaded
    tempScenes.push({ background: background, scenario: scenario, objects: objects })
  })
  this.scenes = tempScenes
  this.actualScene = 0

  //Function to call loaded function when all of the resources were loaded
  function imageLoaded() {
    toLoad--
    if (toLoad == 0)
      loaded()
  }
}

Scene.prototype.render = function() {
  let scene = this.scenes[this.actualScene]

  //Draw the background
  x.drawImage(scene.background, 0, 0)

  //Draw the scenario
  scene.scenario.forEach((obj, i) => this.renderScenarioObject(i))

  //Draw the interactable objects
  scene.objects.forEach((obj, i) => this.renderInteractiveObject(i))
}

Scene.prototype.renderScenarioObject = function(i) {
  let obj = this.scenes[this.actualScene].scenario[i]

  if (obj)
    if (obj.visible)
      x.drawImage(obj.img, obj.x * ratios.W_RATIO, obj.y * ratios.H_RATIO, obj.img.width * ratios.W_RATIO, obj.img.height * ratios.H_RATIO)
}

Scene.prototype.toggleScenarioObjectVisibility = function(i) {
  let obj = this.scenes[this.actualScene].scenario[i]

  if (obj)
    this.scenes[this.actualScene].scenario[i].visible = !this.scenes[this.actualScene].scenario[i].visible;
}

Scene.prototype.renderInteractiveObject = function(i) {
  let obj = this.scenes[this.actualScene].objects[i]

  if (obj)
    if (obj.visible)
      x.drawImage(obj.img, obj.x * ratios.W_RATIO, obj.y * ratios.H_RATIO, obj.img.width * ratios.W_RATIO, obj.img.height * ratios.H_RATIO)
}

Scene.prototype.toggleInteractiveObjectVisibility = function(key) {
  let obj = this.scenes[this.actualScene].objects.findIndex((o) => o.key == key)

  if (obj > -1)
    this.scenes[this.actualScene].objects[obj].visible = !this.scenes[this.actualScene].objects[obj].visible;
}

Scene.prototype.changeBackground = function(src, scene, loaded) {
  this.scenes[scene].background = new Image()
  this.scenes[scene].background.src = src

  if (loaded)
    this.scenes[scene].background.onload = loaded
}

Scene.prototype.interact = function(pos) {
  //Searches among all the objects in the actual scene which is intersecting the pos given and is visible 
  this.scenes[this.actualScene].objects.some((obj, i) => {
    obj.width = obj.img.width
    obj.height = obj.img.height

    if (obj.visible && intersects(pos, obj) && obj.action && (obj.maxActions === undefined || obj.maxActions > 0)) {
      if (obj.action()) { //Executes the action and receives if it's execution was successful or not
        if (obj.maxActions)
          obj.maxActions--

        //If maxActions is undefined or equals to 0 and the object has the property destroy equals to true, the visibillity is toggled
        if (!obj.maxActions && obj.destroy)
            this.scenes[this.actualScene].objects[i].visible = !this.scenes[this.actualScene].objects[i].visible;
      }
      return true
    }
  })
}

Scene.prototype.changeScene = function(direction) {
  this.actualScene += (direction > 0 ? 1 : -1)
}