function Inventory(maxItems, itemDatabase, loaded) {
  this.max = maxItems
  this.items = []

  let toLoad = itemDatabase.length,
    db = []
  itemDatabase.forEach(obj => {
    let tempObj = {
      img: new Image()
    }

    tempObj.img.src = obj.src
    tempObj.img.onload = itemLoaded

    delete obj.src
    db.push(Object.assign(obj, tempObj))
  })

  this.db = db

  function itemLoaded() {
    toLoad--

    if (!toLoad)
      loaded()
  }
}

Inventory.prototype.addItem = function(key) {
  if (this.items.length > this.max - 1)
    return false

  this.items.push(this.db.find(obj => obj.key == key))
  return true
}

Inventory.prototype.removeItem = function(key) {
  this.items.forEach((obj, i, arr) => {
    if (obj.key == key)
      arr.splice(i, 1)
  })
}

Inventory.prototype.hasItem = function(key) {
  return this.items.some(obj => obj.key == key)
}

Inventory.prototype.render = function() {
  this.items.forEach((obj, i) => {
    x.drawImage(obj.img, 50 * i, 0, 50, 50)
  })
}