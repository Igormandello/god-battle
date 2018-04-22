var Direction = {
    LEFT: -1,
    RIGHT: 1
  },
  ratios = {
    W_RATIO: 1,
    H_RATIO: 1
  },
  baseScreen = {
    width: 1920,
    height: 1080,
    ground: 920
  },
  characterProps = {
    width: 48,
    height: 79,
    speed: 7
  };

var transitionTime = 1000;

var c, x;

function getClippedRegion(image, x, y, width, height) {
  var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

  return canvas;
}

function intersects(rect1, rect2) {
  return !(rect1.x + rect1.width < rect2.x || rect1.x > rect2.x + rect2.width || rect1.y + rect1.height < rect2.y || rect1.y > rect2.y + rect2.height)
}