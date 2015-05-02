function sleep(millis) {
  return new Promise(resolve => {
    setTimeout(resolve, millis);    
  });
}

function nextEvent(target, type, useCapture) {
  return new Promise(resolve => {
    const listener = event => {
      target.removeEventListener(type, listener, useCapture);
      resolve(event);
    }
    target.addEventListener(type, listener, useCapture);
  });
}

module.exports = {sleep, nextEvent};
