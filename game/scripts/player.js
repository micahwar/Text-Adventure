class Player {
  constructor(pos) {
    this.pos = pos;
    this.focus = undefined;
    this.inventory = [];
  }

  showInventory() {
    terminal.writeText("Checking your pockets, you find: " + this.inventory.join(", "), "yellow");
  }

  move(direction) {
    if (Object.values(rooms[this.pos].exits).includes(direction)) {
      //if direction is actually a given room
      this.pos = direction;
      rooms[this.pos].show();
      player.focus = undefined;
    } else if (!(direction in rooms[this.pos]["exits"])) {
      terminal.writeText("Not a valid direction.", "red");
    } else if (rooms[rooms[this.pos]["exits"][direction]].locked) {
      rooms[rooms[this.pos]["exits"][direction]].show();
    } else {
      //if direction is a direction
      this.pos = rooms[this.pos]["exits"][direction];
      rooms[this.pos].show();
      player.focus = undefined;
    }

  }
}