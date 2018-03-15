var c, x;

(function()
{
  var player, god, scene;

  window.onload = () =>
  {
    c = document.getElementById("cnv")
    x = c.getContext("2d")

    c.width  = document.body.clientWidth
    c.height = document.body.clientHeight

    player = new Character(200, 200, './imgs/player.png', function() { player.render() })
    god    = new Character(200, 0, './imgs/god.png', function() { god.render() })
    
    let objects =
    [
      {
        x: 300,
        y: 200,
        src: './imgs/cloud.png'
      }
    ]
    scene  = new Scene('./imgs/background.png', objects)
    scene.resize()
    
    requestAnimationFrame(frame)
  }
  
  window.onresize = () =>
  {
    c.width  = document.body.clientWidth
    c.height = document.body.clientHeight
    
    scene.resize()
  }

  function frame()
  {
    scene.render()
    
    requestAnimationFrame(frame)
  }
})();