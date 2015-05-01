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
    for (let post; post = await deletionMonitor.nextPost();) {
      broadcasting.broadcast({
        'type': 'deleted-post',
        'data': post
      });
    }
  }
  
  async function processUndeletionVotes(undeletionVoteMonitor) {
    for (let post; post = await undeletionVoteMonitor.nextPost();) {
      broadcasting.broadcast({
        'type': 'deleted-post',
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
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 4 * 1000);
    })
  }
 
  for (let broadcast; broadcast = await broadcasting.nextMessage();) {
    if (broadcast.type === 'deleted-post' && broadcast.data.isQuestion) {
      await sendMessage(
        `**\`QUESTION DELETED\`** \\[[${message.id}](http://stackoverflow.com/q/${message.id})] ${message.title}`);
    }
  }
}

function main() {
  const localConnection = new LocalConnection();

  if (location.host.match(/^chat\./)) { 
    console.log('Chat host detected, assuming chat room.');
    chatMain(localConnection);
  } else {
    console.log('Non-chat host detected, assuming main community site.');
    siteMain(localConnection);
  }
}

setTimeout(main);
