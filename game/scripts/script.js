// To do:
//  + CLI
//   + put CLI functions and data into separate class
//   + clean up output to make prettier
//   + make CLI more robust
//  + add subtexts for all the rooms
//  + deal with locked exits (either obvious ones or exits which aren't available but not obviously locked)
//    + add locked properties to JSON and objects that stop player moving through
//      certain connections
//    + make certain exits reliant on items
//    + interaction with certain items turns off exits
//  / items
//   + add items to each room
//   + add subtexts for each items
//   + add item specific interation command data
//   + items will have 2 types, holdable/not.CLI
//    + items -> non-holdable -> all furniture/non-holdables
//            -> holdable -> all items
//    + items can switch between states when items are 'unlocked'
//    + items can have more than one resultant action
//    - resultant actions can set values that are object references rather than just constants
//  + commands
//   + (see items) add commands for picking up, turning on, touching and any interations
//   + add useless commands, lie down, jump, yawn etc.
//  - make it so rooms link to other rooms, not by id but by the object itself
//  / list of highly used commands and guide
//  - find the object in a box game
//  / something ominous when you try to press the buzzer - hard mode
//  + make colours more meaningful
let currentPosition;
let rooms = {}, items = {}, parser, player, terminal, itemList = {};

function getJSON(path) {
  //uses XMLHttpRequest to return an awaitable promise that, when fulfullied,
  //returns a JSON object, containing the contents of the JSON file specified.
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', path);
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function (e) {
      if (this.status == 200) {
        resolve(xhr.response);
      } else {
        let msg = "An error occurred while retrieving assets.";
        terminal.writeText(msg, "red");
        throw new Error(msg);
      }
    }
  });
}

function endGame(route) {
  terminal.enabled = false;
  terminal.writeText("--GAME OVER--", "RED");
  terminal.writeText("You can try again to explore more items and win routes!", "orange")
}

async function loadAssets() {
  //this asynchronously loads the JSON assets and then puts them into the items and rooms objects,
  //just allowing the page to load while it retrieves.
  let JSONdataRooms, JSONdataItems;
  JSONdataRooms = await getJSON("assets/rooms.json").catch(e => {
    console.error(e)
  });
  JSONdataItems = await getJSON("assets/items.json").catch(e => {
    console.error(e)
  });
  for (let item in JSONdataItems) {
    items[item] = new Item(JSONdataItems[item]["names"], JSONdataItems[item]["holdable"], JSONdataItems[item]["contents"], JSONdataItems[item]["actions"]);
  }
  for (let room in JSONdataRooms) {
    rooms[room] = new Room(JSONdataRooms[room]["items"], JSONdataRooms[room]["subtext"], JSONdataRooms[room]["locked"], JSONdataRooms[room]["exits"]);
  }
}

function createItemList() {
  //creates a list of all valid item names from json file
  for (const key in items) {
    items[key].names.map(name => {
      itemList[name] = 1;
    });
  }
}

async function initGame() {
  //initialisation function, starts here.
  currentPosition = "frontGate";
  terminal = new Terminal(document.getElementById("gridBox"));
  parser = new Parser();
  terminal.writeText(parser.helpMessage);
  terminal.writeText("---Press Enter to continue...");
  //parses data from rooms.json into the rooms object
  await loadAssets().then(() => {terminal.enabled = true});
  console.log(rooms);
  console.log(items);
  for (const key in items) {
    items[key].init();
  }
  player = new Player(currentPosition);
  terminal.waitDone = [rooms[player.pos].subtext, "green"];
  createItemList();
}