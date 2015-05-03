try {
  require('babel/polyfill');
} catch (e) {
  console.warn(e);
}

const {
  DeletionMonitor,
  UndeletionVoteMonitor,
  ModFlagMonitor,
  DeletedEditsMonitor
} = require('./monitors');
const {LocalConnection} = require('./local-connection'); 
const util = require('./util');

function siteMain(localConnection) {
  async function processDeletions(deletionMonitor) {
    for (;;) {
      let {done, value: post} = await deletionMonitor.next();
      if (done) break;
      console.debug("Post deletion observed:", post);
      localConnection.broadcast({
        'type': 'deleted-post',
        'data': post
      });
    }
  }
  
  async function processUndeletionVotes(undeletionVoteMonitor) {
    let done, post;
    while ({done, value: post} = await undeletionVoteMonitor.next(), !done) {
      console.debug("Undeletion vote observed:", post);
      localConnection.broadcast({
        'type': 'undeletion-vote',
        'data': post
      });
    }
  }

  processDeletions(new DeletionMonitor);
  // processUndeletionVotes(new UndeletionVoteMonitor);
}

async function chatMain(localConnection) {
  async function sendMessage(message) {
    document.getElementById('input').value = message;
    document.getElementById('sayit-button').click();
    await util.sleep(24 * 1024);
  }
 
  let done, message;
  while ({done, value: message} = await localConnection.next(), !done) {
    console.debug("Got broadcasted message:", message);
    if (message.type === 'deleted-post' && message.data.isQuestion) {
      await sendMessage(
        '**`QUESTION DELETED`** ' +
        '`' + util.lpad(message.data.id, 8) + '` ' +
        '[' + util.truncate(message.data.title, 48).replace(/([\[\]])/g, '\\$1') + ']' +
        `(http://stackoverflow.com/q/${message.data.id})`);
      console.debug("Message sent, and sleep finished.");
    } else {
      console.debug('Ignoring message:', JSON.stringify(message));
    }
  }
}

function main() {
  const localConnection = new LocalConnection();
  window.localConnection = localConnection;

  if (location.host.match(/^chat\./)) { 
    console.info("Chat host detected, assuming chat room.");
    chatMain(localConnection);
  } else {
    console.info("Non-chat host detected, assuming main community site.");
    siteMain(localConnection);
  }
}

setTimeout(main);
