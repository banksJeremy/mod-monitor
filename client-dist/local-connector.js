'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/**
 * Provides cross-window cross-origin messaging, and storage.
 *
 * This isn't safe against a targeted attack.
 */

var LocalConnector = (function () {
  function LocalConnector() {
    _classCallCheck(this, LocalConnector);

    // Handle the initialization message recieved from the parent frame.
    window.addEventListener('message', this);
    // Handle messages relayed from from LocalConnectors in other windows.
    window.addEventListener('storage', this);
    // A MessagePort will be used to communicate with the LocalConnection of the parent frame.
    this.port_ = null;
  }

  _createClass(LocalConnector, [{
    key: 'handleEvent',
    value: function handleEvent(event) {
      if (event.type === 'message' && event.target === 'window') {
        return this.handleWindowMessage_(event);
      } else if (event.type === 'message' && event.target instanceof MessagePort) {
        return this.handlePortMessage_(event);
      } else if (event.type === 'storage' && event.target === window) {
        return this.handleWindowStorage_(event);
      } else {
        throw new Error('cannot handle unexpected event ' + event);
      }
    }
  }, {
    key: 'handleWindowMessage_',
    value: function handleWindowMessage_(event) {}
  }, {
    key: 'handlePortMessage_',
    value: function handlePortMessage_(event) {}
  }, {
    key: 'handleWindowStorage_',
    value: function handleWindowStorage_(event) {}
  }]);

  return LocalConnector;
})();

window.addEventListener('message', function (event) {
  console.log('GOT MESSAGe', event);
  if (event.data.type == 'listener') {
    console.log('ADDING LISTENER');
    listeningPorts.push(event.ports[0]);
  }
  if (event.data.type == 'message') {
    console.log('get message from outside, broadcasting through storage');
    localStorage.setItem('message_', JSON.stringify(event.data));
  }
});

window.addEventListener('storage', function (event) {
  console.log('got storage event dur');
  if (event.key == 'message_') {
    (function () {
      console.log('got storage message_!', event);
      var value = JSON.parse(event.newValue);
      if (value.type == 'message') {
        console.log('got message from storage, sharing with ports');
        listeningPorts.forEach(function (port) {
          return port.postMessage(value.body);
        });
      }
    })();
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2NsaWVudC1zcmMvbG9jYWwtY29ubmVjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUtNLGNBQWM7QUFDUCxXQURQLGNBQWMsR0FDSjswQkFEVixjQUFjOzs7QUFHaEIsVUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFekMsVUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFekMsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7R0FDbkI7O2VBUkcsY0FBYzs7V0FVUCxxQkFBQyxLQUFLLEVBQUU7QUFDakIsVUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRTtBQUN6RCxlQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUN6QyxNQUFNLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksS0FBSyxDQUFDLE1BQU0sWUFBWSxXQUFXLEVBQUU7QUFDMUUsZUFBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDdkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFO0FBQzlELGVBQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3pDLE1BQU07QUFDTCxjQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxHQUFHLEtBQUssQ0FBQyxDQUFDO09BQzVEO0tBQ0Y7OztXQUVtQiw4QkFBQyxLQUFLLEVBQUUsRUFFM0I7OztXQUVpQiw0QkFBQyxLQUFLLEVBQUUsRUFFekI7OztXQUVtQiw4QkFBQyxLQUFLLEVBQUUsRUFFM0I7OztTQWhDRyxjQUFjOzs7QUFtQ3BCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBQSxLQUFLLEVBQUk7QUFDMUMsU0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEMsTUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxVQUFVLEVBQUU7QUFDakMsV0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQzlCLGtCQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNyQztBQUNELE1BQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFO0FBQ2hDLFdBQU8sQ0FBQyxHQUFHLENBQUMsd0RBQXdELENBQUMsQ0FBQztBQUN0RSxnQkFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUM5RDtDQUNGLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQUEsS0FBSyxFQUFJO0FBQzFDLFNBQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtBQUNwQyxNQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksVUFBVSxFQUFFOztBQUMzQixhQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3hDLFVBQUksS0FBSyxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUU7QUFDM0IsZUFBTyxDQUFDLEdBQUcsQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0FBQzVELHNCQUFjLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtpQkFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7U0FBQSxDQUFDLENBQUM7T0FDOUQ7O0dBQ0Y7Q0FDRixDQUFDLENBQUMiLCJmaWxlIjoiY2xpZW50LXNyYy9sb2NhbC1jb25uZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFByb3ZpZGVzIGNyb3NzLXdpbmRvdyBjcm9zcy1vcmlnaW4gbWVzc2FnaW5nLCBhbmQgc3RvcmFnZS5cbiAqXG4gKiBUaGlzIGlzbid0IHNhZmUgYWdhaW5zdCBhIHRhcmdldGVkIGF0dGFjay5cbiAqL1xuY2xhc3MgTG9jYWxDb25uZWN0b3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyBIYW5kbGUgdGhlIGluaXRpYWxpemF0aW9uIG1lc3NhZ2UgcmVjaWV2ZWQgZnJvbSB0aGUgcGFyZW50IGZyYW1lLlxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcyk7XG4gICAgLy8gSGFuZGxlIG1lc3NhZ2VzIHJlbGF5ZWQgZnJvbSBmcm9tIExvY2FsQ29ubmVjdG9ycyBpbiBvdGhlciB3aW5kb3dzLlxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzdG9yYWdlJywgdGhpcyk7XG4gICAgLy8gQSBNZXNzYWdlUG9ydCB3aWxsIGJlIHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgTG9jYWxDb25uZWN0aW9uIG9mIHRoZSBwYXJlbnQgZnJhbWUuXG4gICAgdGhpcy5wb3J0XyA9IG51bGw7XG4gIH1cblxuICBoYW5kbGVFdmVudChldmVudCkge1xuICAgIGlmIChldmVudC50eXBlID09PSAnbWVzc2FnZScgJiYgZXZlbnQudGFyZ2V0ID09PSAnd2luZG93Jykge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlV2luZG93TWVzc2FnZV8oZXZlbnQpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ21lc3NhZ2UnICYmIGV2ZW50LnRhcmdldCBpbnN0YW5jZW9mIE1lc3NhZ2VQb3J0KSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVQb3J0TWVzc2FnZV8oZXZlbnQpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ3N0b3JhZ2UnICYmIGV2ZW50LnRhcmdldCA9PT0gd2luZG93KSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVXaW5kb3dTdG9yYWdlXyhldmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGhhbmRsZSB1bmV4cGVjdGVkIGV2ZW50ICcgKyBldmVudCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlV2luZG93TWVzc2FnZV8oZXZlbnQpIHtcblxuICB9XG5cbiAgaGFuZGxlUG9ydE1lc3NhZ2VfKGV2ZW50KSB7XG4gICAgXG4gIH1cblxuICBoYW5kbGVXaW5kb3dTdG9yYWdlXyhldmVudCkge1xuXG4gIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBldmVudCA9PiB7XG4gIGNvbnNvbGUubG9nKFwiR09UIE1FU1NBR2VcIiwgZXZlbnQpO1xuICBpZiAoZXZlbnQuZGF0YS50eXBlID09ICdsaXN0ZW5lcicpIHtcbiAgICBjb25zb2xlLmxvZyhcIkFERElORyBMSVNURU5FUlwiKVxuICAgIGxpc3RlbmluZ1BvcnRzLnB1c2goZXZlbnQucG9ydHNbMF0pO1xuICB9XG4gIGlmIChldmVudC5kYXRhLnR5cGUgPT0gJ21lc3NhZ2UnKSB7XG4gICAgY29uc29sZS5sb2coXCJnZXQgbWVzc2FnZSBmcm9tIG91dHNpZGUsIGJyb2FkY2FzdGluZyB0aHJvdWdoIHN0b3JhZ2VcIik7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ21lc3NhZ2VfJywgSlNPTi5zdHJpbmdpZnkoZXZlbnQuZGF0YSkpO1xuICB9XG59KTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3JhZ2UnLCBldmVudCA9PiB7XG4gIGNvbnNvbGUubG9nKCdnb3Qgc3RvcmFnZSBldmVudCBkdXInKVxuICBpZiAoZXZlbnQua2V5ID09ICdtZXNzYWdlXycpIHtcbiAgICBjb25zb2xlLmxvZygnZ290IHN0b3JhZ2UgbWVzc2FnZV8hJywgZXZlbnQpO1xuICAgIGNvbnN0IHZhbHVlID0gSlNPTi5wYXJzZShldmVudC5uZXdWYWx1ZSlcbiAgICBpZiAodmFsdWUudHlwZSA9PSAnbWVzc2FnZScpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZ290IG1lc3NhZ2UgZnJvbSBzdG9yYWdlLCBzaGFyaW5nIHdpdGggcG9ydHNcIik7XG4gICAgICBsaXN0ZW5pbmdQb3J0cy5mb3JFYWNoKHBvcnQgPT4gcG9ydC5wb3N0TWVzc2FnZSh2YWx1ZS5ib2R5KSk7XG4gICAgfVxuICB9XG59KTtcbiJdfQ==