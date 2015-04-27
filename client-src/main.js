require('babel/polyfill');

var monitors = require('./monitors');

async function main() {
  const deletionMonitor = new monitors.DeletionMonitor;
  const newPosts = await deletionMonitor.getNew()
  window.newPosts = newPosts;
}

window.main = main;

setTimeout(main);
