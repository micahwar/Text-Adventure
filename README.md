# Text-Adventure
A mobile (android but not IOS) and desktop friendly Text Adventure website.\
Can be accessed at https://micahwar.github.io/Text-Adventure/
## To Do
- [x] CLI\
  - [x] put CLI functions and data into separate class\
  - [x] clean up output to make prettier\
  - [x] make CLI more robust\
- [x] add subtexts for all the rooms\
- [x] deal with locked exits (either obvious ones or exits which aren't available but not obviously locked)\
  - [x] add locked properties to JSON and objects that stop player moving through certain connections\
  - [x] make certain exits reliant on items\
  - [x] interaction with certain items turns off exits\
- [ ] items\
  - [x] add items to each room\
  - [x] add subtexts for each items\
  - [x] add item specific interation command data\
  - [x] items will have 2 types, holdable / not.CLI\
    - [x] items: non-holdable (e.g. furniture) & holdable (e.g. pick up items)
  - [x] items can switch between states when items are 'unlocked'\
  - [x] items can have more than one resultant action\
  - [ ] resultant actions can set values that are object references rather than just constants\
- [x] commands\
  - [x] (see items) add commands for picking up, turning on, touching and any interations\
  - [x] add useless commands, lie down, jump, yawn etc.\
- [ ] make it so rooms link to other rooms, not by id but by the object itself\
- [ ] list of highly used commands and guide\
- [ ] find the object in a box game\
- [ ] something ominous when you try to press the buzzer [ ] hard mode\
- [x] make colours more meaningful\
