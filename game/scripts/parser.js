class Parser {

  constructor() {
    //predefined lists of words for validation,
    //some of these can be calculated when the JSON is loaded
    this.movementWords = ["move", "go", "walk", "left", "right", "towards", "enter"];
    this.directions = ["north", "east", "south", "west", "up", "down"];
    this.inspectionWords = ["interact", "look", "inspect", "check"];
    this.pickupWords = ["pickup", "get", "hold"];
    this.ditchWords = ["at", "to", "the", "off", "for", "in"];
    this.interactCommands = ["open", "unlock", "press", "push", "cut", "chop", "drink", "lick", "sitdown", "siton", "sit", "kick", "turnon", "switchon", "liedown", "lieon", "sleep", "close", "shut", "attack", "hit", "punch", "use", "hit", "attack","kick", "slap", "push"];
    this.doubleWords = ["sit down", "sit on", "turn on", "switch on", "lie down", "lie on", "look around"]
    this.inventoryCommands = ["inventory", "inv", "i"];
    this.helpMessage = "Welcome! Here are some commands to get you started:\n\t- <span style=\"color:orange;\">[inspect/look at/check]</span> allows you to, well, inspect an object, showing things that may not be apparent at first sight.\n\t- <span style=\"color:orange;\">[get/pick up]</span> will pick up the specified item.\n\t- all movement is done through cardinal directions <span style=\"color:orange;\">[north/south/east/west]</span> and also <span style=\"color:orange;\">[up/down]</span>.\n-Interactable items are highlighted in the room descriptions to give a helping hand.\n<span style=\"color:orange;\">All items have custom interactions so have fun inspecting everything you can!</span>\n";
  }

  sanatise(cmd) {
    //cleans up command input
    cmd = cmd.trim().toLowerCase().split(String.fromCharCode(160)).join(" ");
    this.doubleWords.forEach(word => {
      cmd = cmd.replace(word, word.replace(" ", ""));
    });
    if (cmd == "sleep") {
      cmd += " bed";
    }
    return cmd.split(" ").filter(word => !this.ditchWords.includes(word));
  }

  parse(cmd) {
    //basic command args parsing - hands more detailed
    //analysis to more specific functions
    let cmdArgs = this.sanatise(cmd);
    console.log(cmdArgs);
    if (cmdArgs[0] == "help" || (cmdArgs.length == 1 && cmdArgs[0] == "h")) {
      terminal.writeText(this.helpMessage);
    } else if (cmdArgs.length == 1 && (cmdArgs[0] == "look" || cmdArgs[0] == "lookaround")) {
      rooms[player.pos].show();
    } else if (this.movementWords.includes(cmdArgs[0]) || this.directions.includes(cmdArgs[0])) {
      this.parseMove(cmdArgs);
    } else if (this.inspectionWords.includes(cmdArgs[0])) {
      this.parseItemCommand(cmdArgs, "inspect");
    } else if (this.pickupWords.includes(cmdArgs[0])) {
      this.parseItemCommand(cmdArgs, "pickup");
    } else if (this.interactCommands.includes(cmdArgs[0])) {
      this.parseItemCommand(cmdArgs, "interact");
    } else if (this.inventoryCommands.includes(cmdArgs[0])) {
      player.showInventory();
    } else {
      terminal.writeText("Invalid command.", "red")
    }

  }

  parseItemCommand(cmdArgs, type) {
    let i = 1, hasInspected = false;
    while (i < cmdArgs.length && !hasInspected) {
      let item = rooms[player.pos].contains(cmdArgs[i]);
      if (item) {
        item[type](cmdArgs[0]);
        hasInspected = true;
      } else if (player.focus) {
        item = player.focus.contains(cmdArgs[i]);
        player.inFocus = true;
        if (item) {
          item[type](cmdArgs[0]);
          hasInspected = true;
        }

      }
      i++;
    }
    if (!hasInspected) {
      if (type == "inspect" || type == "pickup") {
        terminal.writeText("You couldn't find what you were looking for...", "red");
      } else if (type == "interact") {
        terminal.writeText("Couldn't find item to interact with...", "red")
      }
    }
  }

  parseMove(cmdArgs) {
    //parses any input (identified prior as a movement command) through to the 
    //play.move function - making sure it's a valid movement
    let hasMoved = false;
    if (rooms[cmdArgs[1]] != undefined) {
      if (Object.values(rooms[player.pos].exits).includes(cmdArgs[1])) {
        player.move(cmdArgs[1]);
        hasMoved = true;
      }
    } else {
      let i = 0;
      while (i < cmdArgs.length && !hasMoved) {
        if (this.directions.includes(cmdArgs[i])) {
          player.move(cmdArgs[i]);
          hasMoved = true;
        }
        i++;
      }

    }
    if (!hasMoved) {
      terminal.writeText("Movement invalid", "red");
    }
  }
}