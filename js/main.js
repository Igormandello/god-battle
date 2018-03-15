var c, x, baseScreen = { width: 1920, height: 1080 }, characterSize = { width: 36, height: 48 };

(function()
{
  var player, god, scene;

  window.onload = () =>
  {
    c = document.getElementById("cnv")
    x = c.getContext("2d")

    c.width  = document.body.clientWidth
    c.height = document.body.clientHeight

    let toLoad = 3
    
    let objects =
    [
      {
        x: 300,
        y: 200,
        src: './imgs/cloud.png'
      }
    ]
    scene  = new Scene('./imgs/background.png', objects, resourceLoaded)
    
    god    = new Character(960 - characterSize.width, 220 - characterSize.height, characterSize.width, characterSize.height, './imgs/god.png', resourceLoaded)
    player = new Character(960 - characterSize.width, 1000 - characterSize.height, characterSize.width, characterSize.height, './imgs/player.png', resourceLoaded)
    
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

  function frame()
  {
    scene.render()
    player.render()
    god.render()
    scene.renderElement(0)
    
    requestAnimationFrame(frame)
  }
})();