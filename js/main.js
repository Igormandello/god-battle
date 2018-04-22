(function() {
  var currentTime = 0, transition = undefined

  var playerMoving = 0, godMoving = 0
  var player, god, scene, shotManager, inventory

  window.onload = () => {
    c = document.getElementById("cnv")
    x = c.getContext("2d")

    c.width = document.body.clientWidth
    c.height = document.body.clientHeight

    ratios.W_RATIO = document.body.clientWidth / baseScreen.width
    ratios.H_RATIO = document.body.clientHeight / baseScreen.height

    start()
  }

  window.onresize = () => {
    c.width = document.body.clientWidth
    c.height = document.body.clientHeight

    ratios.W_RATIO = document.body.clientWidth / baseScreen.width
    ratios.H_RATIO = document.body.clientHeight / baseScreen.height
  }

  window.onkeydown = (e) => {
    //If there is a transition running, cancel all the action requests
    if (transition)
      return

    switch (e.keyCode) {
      case 32:
        shotManager.sendShot({
          x: god.x + 5,
          y: god.y + 20
        }, 3 / 2 * Math.PI, 7);
        break

      case 37:
        player.startMoving(Direction.LEFT);
        break

      case 39:
        player.startMoving(Direction.RIGHT);
        break

      case 65:
        god.startMoving(Direction.LEFT);
        break

      case 68:
        god.startMoving(Direction.RIGHT);
        break

      case 13:
        scene.interact({
          x: player.x,
          y: player.y,
          width: characterProps.width,
          height: characterProps.height
        });
        break
    }
  }

  window.onkeyup = (e) => {
    switch (e.keyCode) {
      case 37:
        player.stopMoving(Direction.LEFT);
        break

      case 39:
        player.stopMoving(Direction.RIGHT);
        break

      case 65:
        god.stopMoving(Direction.LEFT);
        break

      case 68:
        god.stopMoving(Direction.RIGHT);
        break
    }
  }

  function start() {
    let toLoad = 5

    let scenes = [{
      backgroundSrc: './imgs/scene/background.png',
      limits: {
        god: {
          min: 300,
          max: baseScreen.width - 300
        }
      },
      scenario: [
        {
          x: 300,
          y: 200,
          visible: true,
          src: './imgs/scene/cloud.png'
        },
        {
          x: 0,
          y: 792,
          visible: true,
          src: './imgs/scene/ground.png'
        }
      ],
      objects: [
        {
          key: "goat",
          x: 100,
          y: 835,
          visible: true,
          action: Actions.goat,
          destroy: true,
          src: './imgs/scene/goat.png'
        },
        {
          key: "deadGoat",
          x: 100,
          y: 835,
          visible: false,
          action: Actions.deadGoat,
          maxActions: 1,
          src: './imgs/scene/deadGoat.png'
        },
        {
          key: "pentagram",
          x: 1550,
          y: 820,
          visible: true,
          action: Actions.pentagram,
          destroy: true,
          src: './imgs/scene/pentagram.png'
        },
        {
          key: "bloodyPentagram",
          x: 1550,
          y: 820,
          visible: false,
          src: './imgs/scene/bloodyPentagram.png'
        },
      ]
    }, {
      backgroundSrc: './imgs/scene/background.png',
      scenario: [
        {
          x: 300,
          y: 200,
          visible: true,
          src: './imgs/scene/cloud.png'
        },
        {
          x: 0,
          y: 792,
          visible: true,
          src: './imgs/scene/ground.png'
        }
      ],
      objects: [
      ]
    }]

    let items =
    [
      {
        key: "bucket",
        src: "./imgs/items/bloodBucket.png"
      }
    ]

    scene = new Scene(scenes, resourceLoaded)
    shotManager = new ShotManager('./imgs/scene/lightning.png', resourceLoaded)

    god = new Character(960 - characterProps.width, 210 - characterProps.height, characterProps.width, characterProps.height, characterProps.speed, './imgs/characters/god.png', resourceLoaded)

    player = new Character(960 - characterProps.width, baseScreen.ground - characterProps.height, characterProps.width, characterProps.height, characterProps.speed, './imgs/characters/player.png', resourceLoaded)
    inventory = new Inventory(5, items, resourceLoaded)

    function resourceLoaded() {
      toLoad--

      if (!toLoad)
        requestAnimationFrame(frame)
    }
  }

  function frame(t) {
    let delta = (t - currentTime) / (1000 / 60)
    currentTime = t

    //Characters and shots can't move in a transition
    if (!transition) {
      if (!shotManager.update(player, delta)) {
        start()
        return
      }

      transition = scene.update(god, player, delta, currentTime)
    } else
      shotManager.clearShots()

    scene.render()
    player.render()
    god.render()

    //The Object #0 is the cloud, and it must be above the characters
    scene.renderScenarioObject(0)
    shotManager.render()

    //Inventory is above all
    inventory.render()

    if (transition && !transition(currentTime))
      transition = undefined

    requestAnimationFrame(frame)
  }

  var Actions = {
    goat: function() {
      scene.toggleInteractiveObjectVisibility("deadGoat")

      return true
    },

    deadGoat: function() {
      inventory.addItem("bucket")
      
      return true
    },

    pentagram: function() {
      if (!inventory.hasItem("bucket"))
        return false

      inventory.removeItem("bucket")

      scene.toggleInteractiveObjectVisibility("bloodyPentagram")
      scene.changeBackground('./imgs/scene/bloodyBackground.png', 0)

      return true
    }
  }
})();