const util = require('./util');


class LocalConnection {
  constructor(callback) {
    this.frame_ = document.createElement('iframe');
    this.frameLoaded_ = util.nextEvent(this.frame_, 'load');
    this.frame_.src = 'http://localhost:29684/local-connector.html?' + Math.random();
    this.frame_.style.display = 'none';
    document.body.appendChild(this.frame_);
    
    const {port1: ourPort, port2: farPort} = new MessageChannel;
    this.port_ = ourPort;
    this.port_.onmessage = event => this.handlePortMessage_(event);

    this.ready_ = this.frameLoaded_.then(event => {
      console.debug("Frame ready, initializing it with port.");
      this.frame_.contentWindow.postMessage({type: 'port'}, '*', [farPort]);
    });

    this.nextPromise_ = null;
    this.resolveNextPromise_ = null;
    this.buffer_ = [];
  }

  async next() {
    if (this.buffer_.length) {
      return {value: this.buffer_.shift()};
    }
    if (!this.nextPromise_) {
      this.nextPromise_ = new Promise(resolve => {
        this.resolveNextPromise_ = resolve;
      });
    }
    return {value: await this.nextPromise_};
  }

  handlePortMessage_(event) {
    console.debug("Got port message", event);
    if (this.resolveNextPromise_) {
      const resolve = this.resolveNextPromise_;
      this.nextPromise_ = null;
      this.resolveNextPromise_ = null;
      resolve(event.data);
    } else {
      console.debug("Buffering it.");
      this.buffer_.push(event.data);
    }
  }

  async broadcast(message) {
    await this.ready_;
    this.frame_.contentWindow.postMessage({
      type: 'broadcast',
      data: message
    }, '*');
  }
}

module.exports = {LocalConnection};
