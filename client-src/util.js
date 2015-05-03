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
  if (subject.length >= length) {
    return subject;
  } else {
    return (new Array(length - subject.length + 1)).join(padding) + subject; 
  }
}

function truncate(subject, length, terminator='…') {
  if (subject.length <= length) {
    return subject;
  } else {
    return trim(subject.slice(0, length - terminator.length)) + terminator;
  }
}

function trim(subject, trimmable=' \n\r\t\u00a0') {
  let startOffset = 0;
  for (let i = 0; i < subject.length; i++) {
    if (trimmable.indexOf(subject[i]) != -1) {
      startOffset = i + 1;
    } else {
      break;
    }
  }

  let endOffset = 0;
  for (let i = 0; i < subject.length - startOffset; i++) {
    if (trimmable.indexOf(subject[subject.length - 1 - i]) != -1) {
      endOffset = i + 1;
    } else {
      break;
    }
  }

  return subject.slice(startOffset, subject.length - endOffset);
}

module.exports = {
  sleep,
  nextEvent,
  lpad,
  truncate,
  trim
};

window.util = module.exports;
