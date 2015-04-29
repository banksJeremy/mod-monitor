window.listeningPorts = [];
console.log("FRAME ALIVE HERE!");

window.addEventListener('message', event => {
  console.log("GOT MESSAGe", event);
  if (event.data.type == 'listener') {
    console.log("ADDING LISTENER")
    listeningPorts.push(event.ports[0]);
  }
  if (event.data.type == 'message') {
    console.log("get message from outside, broadcasting through storage");
    localStorage.setItem('message_', JSON.stringify(event.data));
  }
});

window.addEventListener('storage', event => {
  console.log('got storage event dur')
  if (event.key == 'message_') {
    console.log('got storage message_!', event);
    const value = JSON.parse(event.newValue)
    if (value.type == 'message') {
      console.log("got message from storage, sharing with ports");
      listeningPorts.forEach(port => port.postMessage(value.body));
    }
  }
});
