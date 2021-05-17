class Room {
  constructor(items, subtext, lockedText, exits=[]) {
    this.exits = exits;
    this.itemList = items;
    this.items = {};
    if (this.itemList) {
      this.loadItems();
    }
    this.subtext = subtext;
    this.lockedText = lockedText;
    this.locked = this.lockedText != undefined
  }

  loadItems() {
    //converts list of strings to item reference objects
    for (let i = 0; i < this.itemList.length; i++) {
      this.items[this.itemList[i]] = items[this.itemList[i]];
    }
  }

  contains (item) {
    //function for just checking if a room contains an item
    for (const key in this.items) {
      console.log(key)
      if (this.items[key].names.includes(item)) {
        return this.items[key];
      }
    }
    return false;
  }

  show() {
    if (this.locked) {
      terminal.writeText(this.lockedText, "red");
    } else {
      terminal.writeText(this.subtext, "green");
    }
  }
}