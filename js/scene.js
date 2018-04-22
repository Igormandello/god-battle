function Scene(scenes, loaded) {
  //Variable to control how many resources must be loaded
  let toLoad = 0

  let tempScenes = []
  scenes.forEach((scene) => {
    toLoad += 1 + scene.scenario.length + scene.objects.length

    let scenario = []
    scene.scenario.forEach(obj => {
      let tempObj = {
        img: new Image()
      }
      tempObj.img.src = obj.src
      tempObj.img.onload = imageLoaded
      delete obj.src

      scenario.push(Object.assign(obj, tempObj))
    })

    let objects = []
    scene.objects.forEach(obj => {
      let tempObj = {
        img: new Image()
      }
      tempObj.img.src = obj.src
      tempObj.img.onload = imageLoaded
      delete obj.src

      objects.push(Object.assign(obj, tempObj))
    })

    let background = new Image()
    background.src = scene.backgroundSrc
    background.onload = imageLoaded
    delete scene.backgroundSrc

    let defaultLimits = { min: 0, max: baseScreen.width },
        limits = Object.assign({ god: defaultLimits, player: defaultLimits }, scene.limits)

    tempScenes.push(Object.assign(scene, { background: background, scenario: scenario, objects: objects, limits: limits }))
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

Scene.prototype.update = function (god, player, delta, currentTime) {
  let actualScene = this.scenes[this.actualScene]
  god.update(delta, actualScene.limits.god)

  let dir = player.update(delta, actualScene.limits.player)
  if (dir > 0 && actualScene.nextScene !== undefined)
    return this.changeScene(god, player, actualScene.nextScene, currentTime)
  else if (dir < 0 && actualScene.previousScene !== undefined)
    return this.changeScene(god, player, actualScene.previousScene, currentTime)
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
  //Saves the actual scene # to prevent scene transation's problems in obj.action()
  let actualScene = this.actualScene

  //Searches among all the objects in the actual scene which is intersecting the pos given and is visible 
  this.scenes[actualScene].objects.some((obj, i) => {
    obj.width = obj.img.width
    obj.height = obj.img.height

    if (obj.visible && intersects(pos, obj) && obj.action && (obj.maxActions === undefined || obj.maxActions > 0)) {
      if (obj.action()) { //Executes the action and receives if it's execution was successful or not
        if (obj.maxActions)
          obj.maxActions--

        //If maxActions is undefined or equals to 0 and the object has the property destroy equals to true, the visibillity is toggled
        if (!obj.maxActions && obj.destroy)
            this.scenes[actualScene].objects[i].visible = !this.scenes[actualScene].objects[i].visible;
      }
      return true
    }
  })
}

Scene.prototype.changeScene = function(god, player, destiny, startTime) {
  let ctx = this

  //Function to do the fadeout transition, returns if the transition is still running
  let fadeOut = (actualTime) => {
    let alpha = 1 - (actualTime - startTime) / transitionTime

    x.fillStyle = "rgba(0, 0, 0, " + alpha + ")"
    x.fillRect(0, 0, c.width, c.height)

    if (alpha <= 0)
      return false

    return true
  }

  //Function to do the transation, it must be called every frame by the main, 
  //the return true represents that the transation keeps going, when the fadeIn is completed, it returns a object
  //this objects contains the preivous scene, the actual scene and the fade out function
  let fadeIn = (actualTime) => {
    let alpha = (actualTime - startTime) / transitionTime

    x.fillStyle = "rgba(0, 0, 0, " + alpha + ")"
    x.fillRect(0, 0, c.width, c.height)

    if (alpha >= 1) {
      let previous = ctx.actualScene
      ctx.actualScene = destiny
      startTime = actualTime

      return { from: previous, to: destiny, fadeOut: fadeOut }
    }

    return true
  }

  return fadeIn
}