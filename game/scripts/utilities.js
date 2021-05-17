function monitorEvents(element, func) {
  //e.g. monitorEvents(terminal.cli, terminal.writeText.bind(terminal));
  let events = [];
  for (var i in element) {
    if (i.startsWith("on")) events.push(i.substr(2));
  }
  events.forEach(function (eventName) {
    element.addEventListener(eventName, (e) => func(e.type));
  });
}

function isObject(inst) {
  return (inst instanceof Object && !(inst instanceof Array));
}