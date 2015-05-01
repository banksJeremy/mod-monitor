/**
 * Provides cross-window cross-origin messaging, and storage.
 *
 * This isn't safe against a targeted attack.
 */
class LocalConnector {
  constructor() {
    // Handle the initialization message recieved from the parent frame.
    window.addEventListener('message', this);
    // Handle messages relayed from from LocalConnectors in other windows.
    window.addEventListener('storage', this);
    // A MessagePort will be used to communicate with the LocalConnection of the parent frame.
    this.port_ = null;
  }

  handleEvent(event) {
    if (event.type === 'message' && event.target === 'window') {
      return this.handleWindowMessage_(event);
    } else if (event.type === 'message' && event.target instanceof MessagePort) {
      return this.handlePortMessage_(event);
    } else if (event.type === 'storage' && event.target === window) {
      return this.handleWindowStorage_(event);
    } else {
      throw new Error('cannot handle unexpected event ' + event);
    }
  }

  handleWindowMessage_(event) {

  }

  handlePortMessage_(event) {
    
  }

  handleWindowStorage_(event) {

  }
}

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
