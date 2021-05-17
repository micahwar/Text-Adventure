class Item {
  constructor(names, holdable, contents, actions) {
    this.names = names;
    this.holdable = holdable;
    this.contents = contents;
    this.actions = actions;
  }

  init() {
    //registers contents as new room (item container here)
    if (!this.holdable) {
      this.contents = new Room(this.contents, this.actions["inspect"].subtext, undefined);
    }
    //formats the resultantActions array so that it's 2d
    for (const action in this.actions) {
      if (this.actions[action].resultantActions && !Array.isArray(this.actions[action].resultantActions[0])) {
        this.actions[action].resultantActions = [this.actions[action].resultantActions];
      }
    }
  }

  affect(action, colour = "green") {
    //checks if you've got the required items to perform the actions
    if (this.actions[action].required) {
      for (let i = 0; i < this.actions[action].required.length; i++) {
        if (!player.inventory.includes(this.actions[action].required[i])) {
          terminal.writeText("You seem to be missing something important to do this...", "red");
          return;
        }
      }
    }
    terminal.writeText(this.actions[action].subtext, colour);
    if (this.actions[action].resultantActions) {
      //this changes the value of whatever object is specified in the items json to the value also
      //given in the json
      this.actions[action].resultantActions.forEach(element => {
        if (element[0] == "end") {
          //game over
          endGame(element[1]);
        }
        let a = element[0].split(" ");
        let obj = (a[0] == "rooms") ? rooms : items;
        a.splice(0, 1);
        while (isObject(obj[a[0]])) {
          obj = obj[a[0]];
          a.splice(0, 1);
        }
        console.log(obj + " : " + obj[a[0]]);
        obj[a[0]] = element[1] === "increment" ? obj + 1 : element[1];
      });

    }

  }

  interact(cmd) {
    //checks all of the possible interaction commands (and aliases) to see if command
    //is valid for given item, if it is, call affect function.
    for (const command in this.actions) {
      if (command == cmd || (this.actions[command].names && this.actions[command].names.includes(cmd))) {
        this.affect(command);
        if (command == "inspect" && this.contents) {
          player.focus = this.contents;
        }
        break;
      }
    }
  }

  inspect() {
    //can probably merge this into a separate function
    if (this.contents) {
      player.focus = this.contents;
    }
    this.affect("inspect");
  }

  pickup() {
    //picks up the item and puts into inventory if valid etc.
    if (this.holdable && !player.inventory.includes(this.names[0])) {
      player.inventory.push(this.names[0]);
      this.affect("pickup", "yellow");
    } else if (player.inventory.includes(this.names[0])) {
      terminal.write("you've already picked up the key")
    } else {
      terminal.writeText("bit difficult to pick up a " + this.names[this.names.length - 1] + ", eh?");
    }
  }
}