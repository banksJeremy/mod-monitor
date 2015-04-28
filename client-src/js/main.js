try {
  require('babel/polyfill');
} catch (e) {
  console.error(e);
}

const monitors = require('./monitors');

class LocalBroadcasting {
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
    this.frame_.src = 'http://localhost:29684/html/broadcaster.html?' + Math.random();
    this.frame_.addEventListener('load', setReady);
    this.frame_.addEventListener('error', failReady);
    document.body.appendChild(this.frame_);

    console.log("created iframe");
    this.frameReady_.then(() => console.log("FRAME READY"))

    this.seenMessageIds_ = new Set();

    const {port1: ourPort, port2: farPort} = new MessageChannel;
    this.port_ = ourPort;
    this.port_.onmessage = event => {
      const {id, data: body} = event.data;
      if (!this.seenMessageIds_.has(id)) {
        this.handleMessage_(data);
        this.seenMessageIds_.add(id);
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

async function siteMain() {
  const broadcasting = new LocalBroadcasting;
  window['broadcasting'] = broadcasting;
  console.log("SETTING UP BROADCASTING")
  console.log(broadcasting);
  const deletionMonitor = new monitors.DeletionMonitor;
  const pollIntervald = setInterval(async function() {
    const newPosts = await deletionMonitor.getNew();
    for (let post of newPosts) {
      broadcasting.broadcast(post);
      console.log(`${post.utcTime} [${post.id}] ${post.title}`);
    }
  }, 25 * 1000);

  broadcasting.broadcast("SITE UP AND RUNNING");
}

async function chatMain() {
  const broadcasting = new LocalBroadcasting;
  window['broadcasting'] = broadcasting;

  broadcasting.broadcast("CHAT UP AND RUNNING");
  broadcasting.handleMessage_ = message => {
    document.getElementById('input').value = JSON.stringify(message);
    document.getElementById('sayit-button').click();
  };
}

const main = location.host.match(/^chat\./) ? chatMain : siteMain;

setTimeout(main);
