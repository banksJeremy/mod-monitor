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
    let done, post;
    while ({done, value: post} = await deletionMonitor.next(), !done) {
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
    await util.sleep(4 * 1000);
  }
 
  let done, message;
  while ({done, value: message} = await localConnection.next(), !done) {
    console.debug("Got broadcasted message:", message);
    if (message.type === 'deleted-post' && message.data.isQuestion) {
      await sendMessage(
        `**\`QUESTION DELETED\`** \\[[${message.id}](http://stackoverflow.com/q/${message.id})] ${message.title}`);
    } else {
      await sendMessage(`Unrecognized message! ${JSON.stringify(message)}`);
    }
  }
}

function main() {
  const localConnection = new LocalConnection();

  if (location.host.match(/^chat\./)) { 
    console.info("Chat host detected, assuming chat room.");
    chatMain(localConnection);
  } else {
    console.info("Non-chat host detected, assuming main community site.");
    siteMain(localConnection);
  }
}

setTimeout(main);
