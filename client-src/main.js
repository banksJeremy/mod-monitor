try {
  require('babel/polyfill');
} catch (e) {
  console.error(e);
}

const {DeletionMonitor, UndeletionVoteMonitor} = require('./monitors');
const {LocalConnection} = require('./local-connection'); 
const util = require('./util');

function siteMain(localConnection) {
  async function processDeletions(deletionMonitor) {
    let done, post;
    while ({done, value: post} = await deletionMonitor.nextPost(), !done) {
      localConnection.broadcast({
        'type': 'deleted-post',
        'data': post
      });
    }
  }
  
  async function processUndeletionVotes(undeletionVoteMonitor) {
    let done, post;
    while ({done, value: post} = await undeletionVoteMonitor.nextPost(), !done) {
      localConnection.broadcast({
        'type': 'undeletion-vote',
        'data': post
      });
    }
  }

  processDeletions(new DeletionMonitor);
  processUndeletionVotes(new UndeletionVoteMonitor);
}

async function chatMain(localConnection) {
  async function sendMessage(message) {
    document.getElementById('input').value = message;
    document.getElementById('sayit-button').click();
    await util.sleep(4 * 1000);
  }
 
  let done, message;
  while ({done, value: message} = await localConnection.nextMessage(), !done) {
    if (message.type === 'deleted-post' && message.data.isQuestion) {
      await sendMessage(
        `**\`QUESTION DELETED\`** \\[[${message.id}](http://stackoverflow.com/q/${message.id})] ${message.title}`);
    } else {
      await sendMessage(`Unrecognized m1essage! ${JSON.stringify(message)}`);
    }
  }
}

function main() {
  const localConnection = new LocalConnection();

  if (location.host.match(/^chat\./)) { 
    console.log("Chat host detected, assuming chat room.");
    chatMain(localConnection);
  } else {
    console.log("Non-chat host detected, assuming main community site.");
    siteMain(localConnection);
  }
}

setTimeout(main);
