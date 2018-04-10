var Direction = { LEFT: -1, RIGHT: 1 },
    ratios = { W_RATIO: 1, H_RATIO: 1 },
    baseScreen = { width: 1920, height: 1080 },
    characterProps = { width: 46, height: 79, speed: 7 };

var c, x;

function getClippedRegion(image, x, y, width, height)
{
  var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  //                   source region         dest. region
  ctx.drawImage(image, x, y, width, height,  0, 0, width, height);
  
  return canvas;
}

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
    
    ratios.W_RATIO = document.body.clientWidth  / baseScreen.width
    ratios.H_RATIO = document.body.clientHeight / baseScreen.height

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
        y: 820,
        visible: true,
        action: Actions.pentagram,
        src: './imgs/pentagram.png'
      },
    ]
    
    scene  = new Scene('./imgs/background.png', scenario, interactable, resourceLoaded)
    
    god    = new Character(960 - characterProps.width, 210 - characterProps.height, characterProps.width, characterProps.height, characterProps.speed, './imgs/god.png', resourceLoaded)
    god.limits = { min: 300, max: baseScreen.width - 300 }
    
    player = new Character(960 - characterProps.width, 920 - characterProps.height, characterProps.width, characterProps.height, characterProps.speed, './imgs/player.png', resourceLoaded)
    
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
    
    ratios.W_RATIO = document.body.clientWidth  / baseScreen.width
    ratios.H_RATIO = document.body.clientHeight / baseScreen.height
  }

  window.onkeydown = (e) =>
  {
    switch (e.keyCode)
    {
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
  
  function frame()
  {
    scene.render()
    player.render()
    god.render()
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