class LocalConnection {
  constructor(callback) {
    this.idBase_ = String(Math.random()) + String(new Date);
    this.idIndex_ = (Math.random() * 512512) | 0;
    this.callback_ = callback;
    
    let setReady, failReady;
    this.frameReady_ = new Promise((resolve, reject) => {
      setReady = resolve;
      failReady = reject
    });
    
    this.frame_ = document.createElement('iframe');
    this.frame_.src = 'http://localhost:29684/broadcaster.html?' + Math.random();
    this.frame_.addEventListener('load', setReady);
    this.frame_.addEventListener('error', failReady);
    document.body.appendChild(this.frame_);

    console.log("created iframe");
    this.frameReady_.then(() => console.log("FRAME READY"))

    this.seenMessageIds_ = new Set();

    const {port1: ourPort, port2: farPort} = new MessageChannel;
    this.port_ = ourPort;
    this.port_.onmessage = event => {
      console.log(event);
      if (!this.seenMessageIds_.has(event.data.id)) {
        this.handleMessage_(event.data.message);
        this.seenMessageIds_.add(event.data.tesid);
        console.log("handled event", event);
      } else {
        console.log("ignoring duplicate message", event);
      }
    }
    this.ready_ = this.frameReady_.then(() => {
      this.frame_.contentWindow.postMessage({type: 'listener'}, '*', [farPort]);
    });
  }

  handleMessage_(message) {
    console.log("got broadcasted message", message); 
  }

  async broadcast(message) {
    console.log('awaiting ready to broadcast...');
    await this.ready_;
    console.log('brodcasting...', message);
    this.frame_.contentWindow.postMessage({
      type: 'message',
      body: {
        message: message,
        id: this.idBase_ + this.idIndex_++
      }
    }, '*');
  }
}

module.exports = {LocalConnection};
