(function()
{
  var playerMoving = 0, godMoving = 0;
  var player, god, scene, shotManager;

  window.onload = () =>
  {
    c = document.getElementById("cnv")
    x = c.getContext("2d")

    c.width  = document.body.clientWidth
    c.height = document.body.clientHeight
    
    ratios.W_RATIO = document.body.clientWidth  / baseScreen.width
    ratios.H_RATIO = document.body.clientHeight / baseScreen.height

    start()
  }
  
  window.onresize = () =>
  {
    c.width  = document.body.clientWidth
    c.height = document.body.clientHeight
    
    ratios.W_RATIO = document.body.clientWidth  / baseScreen.width
    ratios.H_RATIO = document.body.clientHeight / baseScreen.height
  }

  window.onkeydown = (e) =>
  {
    switch (e.keyCode)
    {
      case 32: shotManager.sendShot({ x: god.x, y: god.y }, 3 / 2 * Math.PI, 7); break
      case 37: player.startMoving(Direction.LEFT); break
      case 39: player.startMoving(Direction.RIGHT); break
      case 65: god.startMoving(Direction.LEFT); break
      case 68: god.startMoving(Direction.RIGHT); break
      case 13: scene.interact({ x: player.x, y: player.y, width: characterProps.width, height: characterProps.height })
    }
  }
  
  window.onkeyup = (e) =>
  {
    switch (e.keyCode)
    {
      case 37: player.stopMoving(Direction.LEFT); break
      case 39: player.stopMoving(Direction.RIGHT); break
      case 65: god.stopMoving(Direction.LEFT); break
      case 68: god.stopMoving(Direction.RIGHT); break
    }
  }
  
  function start()
  {
    let toLoad = 4
    
    let scenario =
    [
      {
        x: 300,
        y: 200,
        visible: true,
        src: './imgs/cloud.png'
      },
      {
        x: 0,
        y: 792,
        visible: true,
        src: './imgs/ground.png'
      }
    ]
    
    let interactable =
    [
      {
        x: 1550,
        y: 820,
        visible: true,
        action: Actions.pentagram,
        src: './imgs/pentagram.png'
      },
    ]
    
    scene  = new Scene('./imgs/background.png', scenario, interactable, resourceLoaded)
    shotManager = new ShotManager('./imgs/lightning.png', resourceLoaded) 
    
    god    = new Character(960 - characterProps.width, 210 - characterProps.height, characterProps.width, characterProps.height, characterProps.speed, './imgs/god.png', resourceLoaded)
    god.limits = { min: 300, max: baseScreen.width - 300 }
    
    player = new Character(960 - characterProps.width, baseScreen.ground - characterProps.height, characterProps.width, characterProps.height, characterProps.speed, './imgs/player.png', resourceLoaded)
    
    function resourceLoaded()
    {
      toLoad--
      
      if (!toLoad)
        requestAnimationFrame(frame)
    }
  }
  
  function frame()
  {
    if (!shotManager.update(player))
    {
      start()
      return
    }
    
    scene.render()
    player.render()
    god.render()
    shotManager.render()
    scene.renderScenarioObject(0)
    
    requestAnimationFrame(frame)
  }
  
  var Actions =
  {
    pentagram: function()
    {
      scene.toggleInteractableObjectVisibility(0)
      scene.changeBackground('./imgs/bloodyBackground.png')
    }
  }
})();