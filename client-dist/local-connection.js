'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var LocalConnection = (function () {
  function LocalConnection(callback) {
    var _this = this;

    _classCallCheck(this, LocalConnection);

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
    this.frame_.src = 'http://localhost:29684/broadcaster.html?' + Math.random();
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

  _createClass(LocalConnection, [{
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

  return LocalConnection;
})();

module.exports = { LocalConnection: LocalConnection };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2NsaWVudC1zcmMvbG9jYWwtY29ubmVjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBTSxlQUFlO0FBQ1IsV0FEUCxlQUFlLENBQ1AsUUFBUSxFQUFFOzs7MEJBRGxCLGVBQWU7O0FBRWpCLFFBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBQSxDQUFDLENBQUM7QUFDeEQsUUFBSSxDQUFDLFFBQVEsR0FBRyxBQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxNQUFNLEdBQUksQ0FBQyxDQUFDO0FBQzdDLFFBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDOztBQUUxQixRQUFJLFFBQVEsWUFBQTtRQUFFLFNBQVMsWUFBQSxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ2xELGNBQVEsR0FBRyxPQUFPLENBQUM7QUFDbkIsZUFBUyxHQUFHLE1BQU0sQ0FBQTtLQUNuQixDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9DLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLDBDQUEwQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUM3RSxRQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMvQyxRQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNqRCxZQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXZDLFdBQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QixRQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQzthQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDO0tBQUEsQ0FBQyxDQUFBOztBQUV2RCxRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O2VBRVEsSUFBSSxjQUFjLEVBQUE7O1FBQTdDLE9BQU8sUUFBZCxLQUFLO1FBQWtCLE9BQU8sUUFBZCxLQUFLOztBQUM1QixRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztBQUNyQixRQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxVQUFBLEtBQUssRUFBSTtBQUM5QixhQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25CLFVBQUksQ0FBQyxNQUFLLGVBQWUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUM1QyxjQUFLLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3hDLGNBQUssZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNDLGVBQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ3JDLE1BQU07QUFDTCxlQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ2xEO0tBQ0YsQ0FBQTtBQUNELFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUN4QyxZQUFLLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDM0UsQ0FBQyxDQUFDO0dBQ0o7O2VBdENHLGVBQWU7O1dBd0NMLHdCQUFDLE9BQU8sRUFBRTtBQUN0QixhQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ2pEOzs7V0FFYyxtQkFBQyxPQUFPOzs7O0FBQ3JCLG1CQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7O21CQUN4QyxJQUFJLENBQUMsTUFBTTs7O0FBQ2pCLG1CQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZDLGdCQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUM7QUFDcEMsa0JBQUksRUFBRSxTQUFTO0FBQ2Ysa0JBQUksRUFBRTtBQUNKLHVCQUFPLEVBQUUsT0FBTztBQUNoQixrQkFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRTtlQUNuQzthQUNGLEVBQUUsR0FBRyxDQUFDLENBQUM7Ozs7Ozs7S0FDVDs7O1NBdkRHLGVBQWU7OztBQTBEckIsTUFBTSxDQUFDLE9BQU8sR0FBRyxFQUFDLGVBQWUsRUFBZixlQUFlLEVBQUMsQ0FBQyIsImZpbGUiOiJjbGllbnQtc3JjL2xvY2FsLWNvbm5lY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBMb2NhbENvbm5lY3Rpb24ge1xuICBjb25zdHJ1Y3RvcihjYWxsYmFjaykge1xuICAgIHRoaXMuaWRCYXNlXyA9IFN0cmluZyhNYXRoLnJhbmRvbSgpKSArIFN0cmluZyhuZXcgRGF0ZSk7XG4gICAgdGhpcy5pZEluZGV4XyA9IChNYXRoLnJhbmRvbSgpICogNTEyNTEyKSB8IDA7XG4gICAgdGhpcy5jYWxsYmFja18gPSBjYWxsYmFjaztcbiAgICBcbiAgICBsZXQgc2V0UmVhZHksIGZhaWxSZWFkeTtcbiAgICB0aGlzLmZyYW1lUmVhZHlfID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgc2V0UmVhZHkgPSByZXNvbHZlO1xuICAgICAgZmFpbFJlYWR5ID0gcmVqZWN0XG4gICAgfSk7XG4gICAgXG4gICAgdGhpcy5mcmFtZV8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICB0aGlzLmZyYW1lXy5zcmMgPSAnaHR0cDovL2xvY2FsaG9zdDoyOTY4NC9icm9hZGNhc3Rlci5odG1sPycgKyBNYXRoLnJhbmRvbSgpO1xuICAgIHRoaXMuZnJhbWVfLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBzZXRSZWFkeSk7XG4gICAgdGhpcy5mcmFtZV8uYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBmYWlsUmVhZHkpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5mcmFtZV8pO1xuXG4gICAgY29uc29sZS5sb2coXCJjcmVhdGVkIGlmcmFtZVwiKTtcbiAgICB0aGlzLmZyYW1lUmVhZHlfLnRoZW4oKCkgPT4gY29uc29sZS5sb2coXCJGUkFNRSBSRUFEWVwiKSlcblxuICAgIHRoaXMuc2Vlbk1lc3NhZ2VJZHNfID0gbmV3IFNldCgpO1xuXG4gICAgY29uc3Qge3BvcnQxOiBvdXJQb3J0LCBwb3J0MjogZmFyUG9ydH0gPSBuZXcgTWVzc2FnZUNoYW5uZWw7XG4gICAgdGhpcy5wb3J0XyA9IG91clBvcnQ7XG4gICAgdGhpcy5wb3J0Xy5vbm1lc3NhZ2UgPSBldmVudCA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhldmVudCk7XG4gICAgICBpZiAoIXRoaXMuc2Vlbk1lc3NhZ2VJZHNfLmhhcyhldmVudC5kYXRhLmlkKSkge1xuICAgICAgICB0aGlzLmhhbmRsZU1lc3NhZ2VfKGV2ZW50LmRhdGEubWVzc2FnZSk7XG4gICAgICAgIHRoaXMuc2Vlbk1lc3NhZ2VJZHNfLmFkZChldmVudC5kYXRhLnRlc2lkKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJoYW5kbGVkIGV2ZW50XCIsIGV2ZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaWdub3JpbmcgZHVwbGljYXRlIG1lc3NhZ2VcIiwgZXZlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnJlYWR5XyA9IHRoaXMuZnJhbWVSZWFkeV8udGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmZyYW1lXy5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKHt0eXBlOiAnbGlzdGVuZXInfSwgJyonLCBbZmFyUG9ydF0pO1xuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlTWVzc2FnZV8obWVzc2FnZSkge1xuICAgIGNvbnNvbGUubG9nKFwiZ290IGJyb2FkY2FzdGVkIG1lc3NhZ2VcIiwgbWVzc2FnZSk7IFxuICB9XG5cbiAgYXN5bmMgYnJvYWRjYXN0KG1lc3NhZ2UpIHtcbiAgICBjb25zb2xlLmxvZygnYXdhaXRpbmcgcmVhZHkgdG8gYnJvYWRjYXN0Li4uJyk7XG4gICAgYXdhaXQgdGhpcy5yZWFkeV87XG4gICAgY29uc29sZS5sb2coJ2Jyb2RjYXN0aW5nLi4uJywgbWVzc2FnZSk7XG4gICAgdGhpcy5mcmFtZV8uY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSh7XG4gICAgICB0eXBlOiAnbWVzc2FnZScsXG4gICAgICBib2R5OiB7XG4gICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgIGlkOiB0aGlzLmlkQmFzZV8gKyB0aGlzLmlkSW5kZXhfKytcbiAgICAgIH1cbiAgICB9LCAnKicpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge0xvY2FsQ29ubmVjdGlvbn07XG4iXX0=