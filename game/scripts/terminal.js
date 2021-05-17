class Terminal {
  constructor(elem) {
    //links properties to elements on the page
    this.parent = elem;
    this.enabled = false;
    this.outputBox = this.parent.children["textbox"];
    this.cli = this.parent.children["cliContainer"].children["cli"];
    this.android = {};
    this.android.cli = this.parent.children["androidInput"];
    this.caret = this.parent.children["cliContainer"].children["caret"];
    //makes the caret (underscore cursor) blink every 450ms
    window.setInterval(() => this.caret.style.visibility = this.caret.style.visibility ? "" : "hidden", 450);
    if (this.isAndroid()) {
      this.initAndroid();
      this.parent.className = "vw-100";
    } else {
      this.initPC();
    }
    this.waiting = true;
    this.waitDone = false;
  }

  isAndroid() {
    let userAgent = navigator.userAgent.toLowerCase();
    return userAgent.indexOf("android") != -1;
  }

  initPC() {
    //basic initalisation for PC (all non android)
    this.cli.addEventListener("keydown", this.CLIKeyDown.bind(this));
    //any click on the terminal window will focus the text input
    this.parent.addEventListener("mousedown", (e) => {
      this.cli.focus();
      e.preventDefault();
    });
    this.cli.focus();
  }

  androidClear() {
    this.android.shouldClear = false;
    this.android.inputDelta = "";
    this.android.cli.innerHTML = "";
    this.CLIKeyDown({ "keyCode": 13 });
  }

  initAndroid() {
    //One of the main issues with android, in particular, is that the keyDown & keyUp functions (keyPressed depreciated)
    //don't actually give keyCodes, they return keyCode 229 for 95% of all key presses.
    //This is because it represents the buffer that the keyboard holds on to, so that predictive text and autocorrect
    //can properly function. Which is lovely and all. However, on android mobile particularly, writing the e.key property
    //each keypress would leave you with something like: NNoNNorNNoNNort, where it is writing the entire buffer each time.
    
    //So the solution I've come up with is for the user to be writing into a hidden textbox, with the changes in letter
    //being sent through to the CLIKeyDown function instead. I'm 99% sure this is required for firefox on mobile,
    //but chrome seemed to work fine with the normal initialisation when I checked, however I have found mobile to be so temperamental
    //that it's worth initalisating this for all browsers just in case.
    this.android.inputDelta = "";
    this.cli.contentEditable = false;
    this.android.cli.contentEditable = true;
    this.android.shouldClear = false;
    this.parent.style.fontSize = "15px";
    //These just deal with focusing (special cases for firefox because it's special) so that the user doesn't have 
    //to magically find the exact position of the textbox to focus it.
    
    // 20ms delay on forcing focus to let the browser finish removing the focus first
    this.android.cli.addEventListener("focusout", () => setTimeout(this.android.cli.focus(), 20));
    window.addEventListener("touchend", (e) => e.preventDefault(), false);
    window.addEventListener("touchstart", () => {
      setTimeout(terminal.android.cli.focus(), 20);
      e.preventDefault();
      e.stopPropagation();
    });
    this.android.cli.addEventListener("keydown", (e) => { this.android.inputDelta = this.android.cli.textContent });

    //this just detects a keypress of code 10 (newline) and tells the program to send an enter press (firefox special cases again)
    this.android.cli.addEventListener("input", (e) => { if (e.data.charCodeAt(e.data.length - 1) == 10) { this.android.shouldClear = true } });
    this.android.cli.addEventListener("keyup", (e) => {
      if (this.android.inputDelta.length > this.android.cli.textContent.length) {
        //if the change in length is negative then evidently the backspace (keycode 8) has been pressed
        this.CLIKeyDown({ "keyCode": 8 });
      } else {
        //gets difference in string from last keyDown call
        this.android.inputDelta = this.android.cli.textContent.replace(this.android.inputDelta);
        if (this.android.cli.innerHTML.indexOf("<div>") > -1 || this.android.shouldClear) {
          //detects an enter in the invisible box (an enter press puts the newline in a seperate div element)
          this.androidClear();
        } else if (this.android.inputDelta.substring(0, 9) == "undefined") {
            // this.android.inputDelta often has undefined at the start, so this just removes that to only get the wanted character
          this.CLIKeyDown({ "keyCode": this.android.inputDelta.toUpperCase().charCodeAt(9) });
        }
      }

    });
    this.android.cli.focus();
    this.setCursorPosition(this.android.cli, 0);
  }

  writeText(txt, c = "white") {
    // appends a new paragraph node to the output
    //with given text and colour
    let tempP = document.createElement("p");
    tempP.style.color = c;
    let newTxt = "";
    txt.split(" ").map(word => {
      if (itemList[word.toLowerCase().replace(".","").replace(",","")]) {
        newTxt += "<span style=\"color:yellow;\">"+word+"</span> ";
      } else if (parser.directions.includes(word.replace(".","").replace(",",""))) {
        newTxt += "<span style=\"color:cyan;\">"+word+"</span> ";
      } else {
        newTxt += word + " ";
      }
    });
    console.log(newTxt);
    tempP.innerHTML = newTxt;
    this.outputBox.appendChild(tempP);
    tempP.scrollIntoView();
  }

  setCursorPosition(elem, offset) {
    //The offset here is actually a node offset, so the range is starting
    //at the second text node, and given there's only one, it goes to the end
    let range = document.createRange();
    let sel = window.getSelection();
    range.setStart(elem, offset);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  CLIKeyDown(e) {
    //Handles any keypresses within the CLI, cursor
    //should always be at the end of the input
    if (!this.enabled) {
      e.preventDefault();
      return;
    }
    if (e.keyCode == 13) {
      if (this.waiting) {
        this.waiting = false;
        this.writeText(...this.waitDone);
        this.waitDone = false;
      } else {
        this.writeText(this.cli.textContent, "white");
        parser.parse(this.cli.textContent.replace(">", ""));
      }
      this.cli.innerHTML = ">";
    } else if ((e.keyCode == 37 || e.keyCode == 8) && !(this.cli.textContent == ">")) {
      //backspace/left arrow with a little added protection to give illusion of > being graphical
      this.cli.innerHTML = this.cli.textContent.substr(0, this.cli.textContent.length - 1);
      e.preventDefault();
    } else if (e.keyCode == 32 || e.keyCode == 160) {
      //either normal or non-breaking space just goes to a normal one
      this.cli.innerHTML += "&nbsp;";
    } else if (e.ctrlKey) {
      e.stopPropagation();
    } else if (e.keyCode >= 65 && e.keyCode <= 90) {
      this.cli.innerHTML = this.cli.textContent + String.fromCharCode(e.keyCode).toLowerCase();
    }
    e.preventDefault();
    this.setCursorPosition(this.cli, 1);
  }
}