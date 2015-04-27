try {
  require('babel/polyfill');
} catch (e) {
  console.error(e);
}

const monitors = require('./monitors');

async function siteMain() {
  const deletionMonitor = new monitors.DeletionMonitor;
  const pollIntervald = setInterval(async function() {
    const newPosts = await deletionMonitor.getNew();
    for (let post of newPosts) {
      console.log(`${post.utcTime} [${post.id}] ${post.title}`);
    }
  }, 25 * 1000);
}

async function chatMain() {
  f;
}

const main = location.host.match(/^chat\./) ? chatMain : siteMain;

setTimeout(main);
