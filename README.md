# Text-Adventure
A mobile (android but not IOS) and desktop friendly Text Adventure website.\
Can be accessed at https://micahwar.github.io/Text-Adventure/
## To Do
[x] CLI\
&nbsp;&nbsp;[x] put CLI functions and data into separate class\
&nbsp;&nbsp;[x] clean up output to make prettier\
&nbsp;&nbsp;[x] make CLI more robust\
[x] add subtexts for all the rooms\
[x] deal with locked exits (either obvious ones or exits which aren't available but not obviously locked)\
&nbsp;&nbsp;[x] add locked properties to JSON and objects that stop player moving through certain connections\
&nbsp;&nbsp;[x] make certain exits reliant on items\
&nbsp;&nbsp;[x] interaction with certain items turns off exits\
[/] items\
&nbsp;&nbsp;[x] add items to each room\
&nbsp;&nbsp;[x] add subtexts for each items\
&nbsp;&nbsp;&nbsp;[x] add item specific interation command data\
&nbsp;[x] items will have 2 types, holdable / not.CLI\
&nbsp;&nbsp;&nbsp;[x] items -> non-holdable -> all furniture / non=holdables\
&nbsp;&nbsp;&nbsp;&nbsp;-> holdable -> all items\
&nbsp;&nbsp;[x] items can switch between states when items are 'unlocked'\
&nbsp;&nbsp;[x] items can have more than one resultant action\
&nbsp;&nbsp;[ ] resultant actions can set values that are object references rather than just constants\
[x] commands\
&nbsp;&nbsp;[x] (see items) add commands for picking up, turning on, touching and any interations\
&nbsp;&nbsp;[x] add useless commands, lie down, jump, yawn etc.\
[ ] make it so rooms link to other rooms, not by id but by the object itself\
[/] list of highly used commands and guide\
[ ] find the object in a box game\
[/] something ominous when you try to press the buzzer [ ] hard mode\
[x] make colours more meaningful\
