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

function lpad(subject, length, padding=' ') {
  subject = String(subject);
  if (subject.length <= length) {
    return subject;
  } else {
    return new Array(length - subject.length + 1).join(padding) + subject; 
  }
}

function truncate(subject, length, terminator='…') {
  if (subject.length <= length) {
    return subject;
  } else {
    return subject.slice(0, length - terminator.length) + terminator;
  }

}

module.exports = {
  sleep,
  nextEvent,
  lpad,
  truncate
};
