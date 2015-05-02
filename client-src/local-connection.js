const util = require('./util');


class LocalConnection {
  constructor(callback) {
    this.idBase_ = String(Math.random()) + String(new Date);
    this.idIndex_ = (Math.random() * 5e12) | 0;
    
    this.frame_ = document.createElement('iframe');
    this.frameLoaded_ = util.nextEvent(this.frame_, 'load');
    this.frame_.src = 'http://localhost:29684/local-connector.html?' + Math.random();
    
    const {port1: ourPort, port2: farPort} = new MessageChannel;
    this.port_ = ourPort;
    this.port_.onmessage = event => this.handlePortMessage_(event);

    this.ready_ = this.frameLoaded_.then(event => {
      this.frame_.contentWindow.postMessage({type: 'port'}, '*', [farPort]);
    });

    this.nextPromise_ = null;
    this.resolveNextPromise_ = null;
  }

  async next() {
    if (!this.nextPromise_) {
      this.nextPromise_ = new Promise(resolve => {
        this.resolveNextPromise_ = resolve;
      });
    }
    return this.nextPromise_;
  }

  handlePortMessage_(event) {
    if (this.resolveNextPromise_) {
      const resolve = this.resolveNextPromise_;
      this.nextPromise_ = null;
      this.resolveNextPromise_ = null;
      resolve(event.data);
    } else {
      // TODO: buffer instead of dropping?
      console.warn("Message event dropped:", event);
    }
  }

  handleMessage_(message) {
    console.log("got broadcasted message", message); 
  }

  async broadcast(message) {
    console.log('awaiting ready to broadcast...');
    await this.ready_;
    console.log('brodcasting...', message);
    this.frame_.contentWindow.postMessage({
      type: 'broadcast',
      data: {
        message: message,
        id: this.idBase_ + this.idIndex_++
      }
    }, '*');
  }
}

module.exports = {LocalConnection};
