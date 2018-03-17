var Direction = { LEFT: -1, RIGHT: 1 },
    baseScreen = { width: 1920, height: 1080 },
    characterProps = { width: 36, height: 48, speed: 10 };

var c, x;

(function()
{
  var playerMoving = 0, godMoving = 0;
  var player, god, scene;

  window.onload = () =>
  {
    c = document.getElementById("cnv")
    x = c.getContext("2d")

    c.width  = document.body.clientWidth
    c.height = document.body.clientHeight

    let toLoad = 3
    
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
        y: 850,
        visible: true,
        action: Actions.pentagram,
        src: './imgs/pentagram.png'
      },
    ]
    
    scene  = new Scene('./imgs/background.png', scenario, interactable, resourceLoaded)
    
    god    = new Character(960 - characterProps.width, 210 - characterProps.height, characterProps.width, characterProps.height, characterProps.speed, './imgs/god.png', resourceLoaded)
    god.limits = { min: 300, max: baseScreen.width - 300 }
    
    player = new Character(960 - characterProps.width, 1000 - characterProps.height, characterProps.width, characterProps.height, characterProps.speed, './imgs/player.png', resourceLoaded)
    
    function resourceLoaded()
    {
      toLoad--
      
      if (!toLoad)
        requestAnimationFrame(frame)
    }
  }
  
  window.onresize = () =>
  {
    c.width  = document.body.clientWidth
    c.height = document.body.clientHeight
    
    player.resize()
    god.resize()
    scene.resize()
  }

  window.onkeydown = (e) =>
  {
    switch (e.keyCode)
    {
      case 37: playerMoving = Direction.LEFT; break
      case 39: playerMoving = Direction.RIGHT; break
      case 65: godMoving = Direction.LEFT; break
      case 68: godMoving = Direction.RIGHT; break
      case 13: scene.interact({ x: player.x, y: player.y, width: characterProps.width, height: characterProps.height })
    }
  }
  
  window.onkeyup = (e) =>
  {
    if (playerMoving)
      if (playerMoving == Direction.LEFT && e.keyCode == 37)
        playerMoving = 0
      else if (playerMoving == Direction.RIGHT && e.keyCode == 39)
        playerMoving = 0
    
    if (godMoving)
      if (godMoving == Direction.LEFT && e.keyCode == 65)
        godMoving = 0
      else if (godMoving == Direction.RIGHT && e.keyCode == 68)
        godMoving = 0
  }
  
  function frame()
  {
    scene.render()
    player.render()
    god.render()
    scene.renderScenarioObject(0)
    
    if (playerMoving)
      player.move(playerMoving)
    
    if (godMoving)
      god.move(godMoving)
    
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