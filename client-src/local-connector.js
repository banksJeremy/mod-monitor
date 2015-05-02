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

    this.broadcastStorageKey_ = '__latestLocalBroadcast__';
  }

  handleEvent(event) {
    if (event.type === 'message' && event.target === window) {
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
    if (event.data.type == 'port') {
      console.assert(this.port_ === null);
      this.port_ = event.ports[0];
    }
    if (event.data.type == 'broadcast') {
      localStorage.setItem(this.broadcastStorageKey_, JSON.stringify(event.data.data));
    }
  }

  handlePortMessage_(event) {
    console.log("Got message from port.", event);
    console.log("Ignoring -- I've no idea what to do with this.");
  }

  handleWindowStorage_(event) {
    if (event.key === this.broadcastStorageKey_) {
      console.log("Got broadcast storage event.", event);
      const value = JSON.parse(event.newValue)
      if (value.type == 'broadcast') {
        listeningPorts.forEach(port => port.postMessage(value.body));
      }
    }
  }
}

window.LocalConnector = LocalConnector;
