try {
  require('babel/polyfill');
} catch (e) {
  console.warn(e);
}

const {
  PostDeletionMonitor,
  UndeletionVoteMonitor,
  ModFlagMonitor,
  DeletedEditsMonitor
} = require('./monitors');
const {LocalConnection} = require('./local-connection'); 
const util = require('./util');

function siteMain(localConnection) {
  async function processPostDeletions(postDeletionMonitor) {
    for (;;) {
      let {done, value: post} = await postDeletionMonitor.next();
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

  processPostDeletions(new PostDeletionMonitor);
  processUndeletionVotes(new UndeletionVoteMonitor);
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
    let data = message.data;
    if (message.type === 'deleted-post' && data.isQuestion) {
      await sendMessage(
        '**`QUESTION DELETED`** ' +
        '`\u200B' + util.lpad(data.id, 8) + '` ' +
        '[' + util.truncate(data.title, 48).replace(/([\[\]])/g, '\\$1') + ']' +
        `(http://stackoverflow.com/q/${data.id})`);
      console.debug("Deletion message sent, and sleep finished.");
    } else if (message.type === 'undeletion-vote' && data.isQuestion) {
      await sendMessage(
        `**\`${data.voteCount}:${data.votesRequired} VtUNDELETE\`** ` +
        '`\u200B' + util.lpad(data.id, 8) + '` ' +
        '[' + util.truncate(data.title, 48).replace(/([\[\]])/g, '\\$1') + ']' +
        `(http://stackoverflow.com/q/${data.id})`);
      console.debug("Undeletion vote message sent, and sleep finished.");
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
