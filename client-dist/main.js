'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

try {
  require('babel/polyfill');
} catch (e) {
  console.error(e);
}

var monitors = require('./monitors');

var LocalBroadcasting = (function () {
  function LocalBroadcasting(callback) {
    var _this = this;

    _classCallCheck(this, LocalBroadcasting);

    this.idBase_ = String(Math.random()) + String(new Date());
    this.idIndex_ = Math.random() * 512512 | 0;
    this.callback_ = callback;

    var setReady = undefined,
        failReady = undefined;
    this.frameReady_ = new Promise(function (resolve, reject) {
      setReady = resolve;
      failReady = reject;
    });

    this.frame_ = document.createElement('iframe');
    this.frame_.src = 'http://localhost:29684/html/broadcaster.html?' + Math.random();
    this.frame_.addEventListener('load', setReady);
    this.frame_.addEventListener('error', failReady);
    document.body.appendChild(this.frame_);

    console.log('created iframe');
    this.frameReady_.then(function () {
      return console.log('FRAME READY');
    });

    this.seenMessageIds_ = new Set();

    var _ref = new MessageChannel();

    var ourPort = _ref.port1;
    var farPort = _ref.port2;

    this.port_ = ourPort;
    this.port_.onmessage = function (event) {
      console.log(event);
      if (!_this.seenMessageIds_.has(event.data.id)) {
        _this.handleMessage_(event.data.message);
        _this.seenMessageIds_.add(event.data.tesid);
        console.log('handled event', event);
      } else {
        console.log('ignoring duplicate message', event);
      }
    };
    this.ready_ = this.frameReady_.then(function () {
      _this.frame_.contentWindow.postMessage({ type: 'listener' }, '*', [farPort]);
    });
  }

  _createClass(LocalBroadcasting, [{
    key: 'handleMessage_',
    value: function handleMessage_(message) {
      console.log('got broadcasted message', message);
    }
  }, {
    key: 'broadcast',
    value: function broadcast(message) {
      return regeneratorRuntime.async(function broadcast$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            console.log('awaiting ready to broadcast...');
            context$2$0.next = 3;
            return this.ready_;

          case 3:
            console.log('brodcasting...', message);
            this.frame_.contentWindow.postMessage({
              type: 'message',
              body: {
                message: message,
                id: this.idBase_ + this.idIndex_++
              }
            }, '*');

          case 5:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }]);

  return LocalBroadcasting;
})();

function siteMain() {
  var broadcasting, deletionMonitor, pollIntervald;
  return regeneratorRuntime.async(function siteMain$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        broadcasting = new LocalBroadcasting();

        window.broadcasting = broadcasting;
        console.log('SETTING UP BROADCASTING');
        console.log(broadcasting);
        deletionMonitor = new monitors.DeletionMonitor();
        pollIntervald = setInterval(function () {
          deletionMonitor.getNew().then(function (newPosts) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = newPosts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var post = _step.value;

                broadcasting.broadcast(post);
                console.log('' + post.utcTime + ' [' + post.id + '] ' + post.title);
                break; // skipping rest because we have no throttling
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator['return']) {
                  _iterator['return']();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          });
        }, 25 * 1000);

        broadcasting.broadcast('SITE UP AND RUNNING');

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function chatMain() {
  var broadcasting;
  return regeneratorRuntime.async(function chatMain$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        broadcasting = new LocalBroadcasting();

        window.broadcasting = broadcasting;

        broadcasting.broadcast('CHAT UP AND RUNNING');
        broadcasting.handleMessage_ = function (message) {
          console.log('MESSSAGE!');
          if (!message.isQuestion) return;
          document.getElementById('input').value = '**`DELETED QUESTION`** \\[[' + message.id + '](http://stackoverflow.com/q/' + message.id + ')] ' + message.title;
          document.getElementById('sayit-button').click();
        };

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function main() {
  if (location.host.match(/^chat\./)) {
    chatMain();
  } else {
    siteMain();
  }
}

setTimeout(main);
//# sourceMappingURL=data:application/json;base64,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RUQsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDIiwiZmlsZSI6ImNsaWVudC1zcmMvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInRyeSB7XG4gIHJlcXVpcmUoJ2JhYmVsL3BvbHlmaWxsJyk7XG59IGNhdGNoIChlKSB7XG4gIGNvbnNvbGUuZXJyb3IoZSk7XG59XG5cbmNvbnN0IG1vbml0b3JzID0gcmVxdWlyZSgnLi9tb25pdG9ycycpO1xuXG5jbGFzcyBMb2NhbEJyb2FkY2FzdGluZyB7XG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5pZEJhc2VfID0gU3RyaW5nKE1hdGgucmFuZG9tKCkpICsgU3RyaW5nKG5ldyBEYXRlKTtcbiAgICB0aGlzLmlkSW5kZXhfID0gKE1hdGgucmFuZG9tKCkgKiA1MTI1MTIpIHwgMDtcbiAgICB0aGlzLmNhbGxiYWNrXyA9IGNhbGxiYWNrO1xuICAgIFxuICAgIGxldCBzZXRSZWFkeSwgZmFpbFJlYWR5O1xuICAgIHRoaXMuZnJhbWVSZWFkeV8gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzZXRSZWFkeSA9IHJlc29sdmU7XG4gICAgICBmYWlsUmVhZHkgPSByZWplY3RcbiAgICB9KTtcbiAgICBcbiAgICB0aGlzLmZyYW1lXyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICAgIHRoaXMuZnJhbWVfLnNyYyA9ICdodHRwOi8vbG9jYWxob3N0OjI5Njg0L2h0bWwvYnJvYWRjYXN0ZXIuaHRtbD8nICsgTWF0aC5yYW5kb20oKTtcbiAgICB0aGlzLmZyYW1lXy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgc2V0UmVhZHkpO1xuICAgIHRoaXMuZnJhbWVfLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZmFpbFJlYWR5KTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZnJhbWVfKTtcblxuICAgIGNvbnNvbGUubG9nKFwiY3JlYXRlZCBpZnJhbWVcIik7XG4gICAgdGhpcy5mcmFtZVJlYWR5Xy50aGVuKCgpID0+IGNvbnNvbGUubG9nKFwiRlJBTUUgUkVBRFlcIikpXG5cbiAgICB0aGlzLnNlZW5NZXNzYWdlSWRzXyA9IG5ldyBTZXQoKTtcblxuICAgIGNvbnN0IHtwb3J0MTogb3VyUG9ydCwgcG9ydDI6IGZhclBvcnR9ID0gbmV3IE1lc3NhZ2VDaGFubmVsO1xuICAgIHRoaXMucG9ydF8gPSBvdXJQb3J0O1xuICAgIHRoaXMucG9ydF8ub25tZXNzYWdlID0gZXZlbnQgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXZlbnQpO1xuICAgICAgaWYgKCF0aGlzLnNlZW5NZXNzYWdlSWRzXy5oYXMoZXZlbnQuZGF0YS5pZCkpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVNZXNzYWdlXyhldmVudC5kYXRhLm1lc3NhZ2UpO1xuICAgICAgICB0aGlzLnNlZW5NZXNzYWdlSWRzXy5hZGQoZXZlbnQuZGF0YS50ZXNpZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaGFuZGxlZCBldmVudFwiLCBldmVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhcImlnbm9yaW5nIGR1cGxpY2F0ZSBtZXNzYWdlXCIsIGV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5yZWFkeV8gPSB0aGlzLmZyYW1lUmVhZHlfLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5mcmFtZV8uY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSh7dHlwZTogJ2xpc3RlbmVyJ30sICcqJywgW2ZhclBvcnRdKTtcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZU1lc3NhZ2VfKG1lc3NhZ2UpIHtcbiAgICBjb25zb2xlLmxvZyhcImdvdCBicm9hZGNhc3RlZCBtZXNzYWdlXCIsIG1lc3NhZ2UpOyBcbiAgfVxuXG4gIGFzeW5jIGJyb2FkY2FzdChtZXNzYWdlKSB7XG4gICAgY29uc29sZS5sb2coJ2F3YWl0aW5nIHJlYWR5IHRvIGJyb2FkY2FzdC4uLicpO1xuICAgIGF3YWl0IHRoaXMucmVhZHlfO1xuICAgIGNvbnNvbGUubG9nKCdicm9kY2FzdGluZy4uLicsIG1lc3NhZ2UpO1xuICAgIHRoaXMuZnJhbWVfLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2Uoe1xuICAgICAgdHlwZTogJ21lc3NhZ2UnLFxuICAgICAgYm9keToge1xuICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICBpZDogdGhpcy5pZEJhc2VfICsgdGhpcy5pZEluZGV4XysrXG4gICAgICB9XG4gICAgfSwgJyonKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBzaXRlTWFpbigpIHtcbiAgY29uc3QgYnJvYWRjYXN0aW5nID0gbmV3IExvY2FsQnJvYWRjYXN0aW5nO1xuICB3aW5kb3dbJ2Jyb2FkY2FzdGluZyddID0gYnJvYWRjYXN0aW5nO1xuICBjb25zb2xlLmxvZyhcIlNFVFRJTkcgVVAgQlJPQURDQVNUSU5HXCIpXG4gIGNvbnNvbGUubG9nKGJyb2FkY2FzdGluZyk7XG4gIGNvbnN0IGRlbGV0aW9uTW9uaXRvciA9IG5ldyBtb25pdG9ycy5EZWxldGlvbk1vbml0b3I7XG4gIGNvbnN0IHBvbGxJbnRlcnZhbGQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgZGVsZXRpb25Nb25pdG9yLmdldE5ldygpLnRoZW4obmV3UG9zdHMgPT4ge1xuICAgICAgZm9yIChsZXQgcG9zdCBvZiBuZXdQb3N0cykge1xuICAgICAgICBicm9hZGNhc3RpbmcuYnJvYWRjYXN0KHBvc3QpO1xuICAgICAgICBjb25zb2xlLmxvZyhgJHtwb3N0LnV0Y1RpbWV9IFske3Bvc3QuaWR9XSAke3Bvc3QudGl0bGV9YCk7XG4gICAgICAgIGJyZWFrOyAvLyBza2lwcGluZyByZXN0IGJlY2F1c2Ugd2UgaGF2ZSBubyB0aHJvdHRsaW5nXG4gICAgICB9XG4gICAgfSk7XG4gIH0sIDI1ICogMTAwMCk7XG5cbiAgYnJvYWRjYXN0aW5nLmJyb2FkY2FzdChcIlNJVEUgVVAgQU5EIFJVTk5JTkdcIik7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNoYXRNYWluKCkge1xuICBjb25zdCBicm9hZGNhc3RpbmcgPSBuZXcgTG9jYWxCcm9hZGNhc3Rpbmc7XG4gIHdpbmRvd1snYnJvYWRjYXN0aW5nJ10gPSBicm9hZGNhc3Rpbmc7XG5cbiAgYnJvYWRjYXN0aW5nLmJyb2FkY2FzdChcIkNIQVQgVVAgQU5EIFJVTk5JTkdcIik7XG4gIGJyb2FkY2FzdGluZy5oYW5kbGVNZXNzYWdlXyA9IG1lc3NhZ2UgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiTUVTU1NBR0UhXCIpO1xuICAgIGlmICghbWVzc2FnZS5pc1F1ZXN0aW9uKSByZXR1cm47XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0JykudmFsdWUgPSAoXG4gICAgICBgKipcXGBERUxFVEVEIFFVRVNUSU9OXFxgKiogXFxcXFtbJHttZXNzYWdlLmlkfV0oaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3EvJHttZXNzYWdlLmlkfSldICR7bWVzc2FnZS50aXRsZX1gKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2F5aXQtYnV0dG9uJykuY2xpY2soKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWFpbigpIHtcbiAgaWYgKGxvY2F0aW9uLmhvc3QubWF0Y2goL15jaGF0XFwuLykpIHtcbiAgICBjaGF0TWFpbigpO1xuICB9IGVsc2Uge1xuICAgIHNpdGVNYWluKCk7XG4gIH1cbn1cblxuc2V0VGltZW91dChtYWluKTtcbiJdfQ==