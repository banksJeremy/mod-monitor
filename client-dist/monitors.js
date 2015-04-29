'use strict';

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var HOST = 'http://stackoverflow.com';
var PATHS = {
  RECENTLY_DELETED: '/tools?tab=delete&daterange=last30days&mode=recentlyDeleted'
};

var DeletedPost = (function () {
  function DeletedPost(_ref) {
    var id = _ref.id;
    var utcTime = _ref.utcTime;
    var isQuestion = _ref.isQuestion;
    var isAnswer = _ref.isAnswer;
    var title = _ref.title;

    _classCallCheck(this, DeletedPost);

    this.id = id;
    this.utcTime = utcTime;
    this.isQuestion = isQuestion;
    this.isAnswer = isAnswer;
    this.title = title;
  }

  _createClass(DeletedPost, [{
    key: 'euqals',
    value: function euqals(other) {
      return other instanceof DeletedPost && other.id == this.id && other.utcTime == this.utcTime;
    }
  }, {
    key: 'equalityKey',
    value: function equalityKey() {
      return '' + this.utcTime + '.' + this.id + '.DeletedPost';
    }
  }]);

  return DeletedPost;
})();

var DeletionMonitor = (function () {
  function DeletionMonitor() {
    _classCallCheck(this, DeletionMonitor);

    this.seenPosts_ = new Map();
  }

  _createClass(DeletionMonitor, [{
    key: 'getNew',
    value: function getNew() {
      var latestPosts, newPosts, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, post, key;

      return regeneratorRuntime.async(function getNew$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return this.getLatest_();

          case 2:
            latestPosts = context$2$0.sent;
            newPosts = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            context$2$0.prev = 7;

            for (_iterator = latestPosts[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              post = _step.value;
              key = post.equalityKey();

              if (!this.seenPosts_.has(key)) {
                this.seenPosts_.set(key, post);
                newPosts.unshift(post);
              }
            }

            context$2$0.next = 15;
            break;

          case 11:
            context$2$0.prev = 11;
            context$2$0.t0 = context$2$0['catch'](7);
            _didIteratorError = true;
            _iteratorError = context$2$0.t0;

          case 15:
            context$2$0.prev = 15;
            context$2$0.prev = 16;

            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }

          case 18:
            context$2$0.prev = 18;

            if (!_didIteratorError) {
              context$2$0.next = 21;
              break;
            }

            throw _iteratorError;

          case 21:
            return context$2$0.finish(18);

          case 22:
            return context$2$0.finish(15);

          case 23:
            return context$2$0.abrupt('return', newPosts);

          case 24:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[7, 11, 15, 23], [16,, 18, 22]]);
    }
  }, {
    key: 'getLatest_',
    value: function getLatest_() {
      var doc, rows, data;
      return regeneratorRuntime.async(function getLatest_$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return this.getHTML_(HOST + PATHS.RECENTLY_DELETED);

          case 2:
            doc = context$2$0.sent;
            rows = Array.from(doc.querySelectorAll('.summary-table tr'));
            data = rows.map(function (row) {
              var link = row.querySelector('a');
              var linkMatch = link.getAttribute('href').match(/\/questions\/(\d+)(?:[^#]*#(\d+)$)?/);
              if (!linkMatch) throw new Error('bad link: ' + link.outerHTML);

              var _linkMatch = _slicedToArray(linkMatch, 3);

              var questionIdStr = _linkMatch[1];
              var answerIdStr = _linkMatch[2];

              return new DeletedPost({
                id: Number(answerIdStr || questionIdStr),
                utcTime: row.querySelector('.relativetime').title,
                isQuestion: link.classList.contains('question-hyperlink'),
                isAnswer: link.classList.contains('answer-hyperlink'),
                title: link.textContent
              });
            });
            return context$2$0.abrupt('return', data);

          case 6:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'getHTML_',
    value: function getHTML_(url) {
      var response, text;
      return regeneratorRuntime.async(function getHTML_$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return fetch(url, {
              credentials: 'include',
              headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

          case 2:
            response = context$2$0.sent;
            context$2$0.next = 5;
            return response.text();

          case 5:
            text = context$2$0.sent;
            return context$2$0.abrupt('return', new DOMParser().parseFromString(text, 'text/html'));

          case 7:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }]);

  return DeletionMonitor;
})();

module.exports = { DeletedPost: DeletedPost, DeletionMonitor: DeletionMonitor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2NsaWVudC1zcmMvbW9uaXRvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFNLElBQUksR0FBRywwQkFBMEIsQ0FBQztBQUN4QyxJQUFNLEtBQUssR0FBRztBQUNiLGtCQUFnQixFQUFFLDZEQUE2RDtDQUMvRSxDQUFDOztJQUVJLFdBQVc7QUFDSixXQURQLFdBQVcsT0FDeUM7UUFBM0MsRUFBRSxRQUFGLEVBQUU7UUFBRSxPQUFPLFFBQVAsT0FBTztRQUFFLFVBQVUsUUFBVixVQUFVO1FBQUUsUUFBUSxRQUFSLFFBQVE7UUFBRSxLQUFLLFFBQUwsS0FBSzs7MEJBRGpELFdBQVc7O0FBRWIsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUE7QUFDWixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUN0QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtBQUN4QixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtHQUNuQjs7ZUFQRyxXQUFXOztXQVNULGdCQUFDLEtBQUssRUFBRTtBQUNaLGFBQ0UsS0FBSyxZQUFZLFdBQVcsSUFDNUIsS0FBSyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsRUFBRSxJQUNuQixLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDakM7OztXQUVVLHVCQUFHO0FBQ1osa0JBQVUsSUFBSSxDQUFDLE9BQU8sU0FBSSxJQUFJLENBQUMsRUFBRSxrQkFBZTtLQUNqRDs7O1NBbEJHLFdBQVc7OztJQXFCWCxlQUFlO0FBQ1IsV0FEUCxlQUFlLEdBQ0w7MEJBRFYsZUFBZTs7QUFFakIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBQSxDQUFBO0dBQzFCOztlQUhHLGVBQWU7O1dBS1A7VUFDSixXQUFXLEVBQ1gsUUFBUSxrRkFDTCxJQUFJLEVBQ0wsR0FBRzs7Ozs7O21CQUhlLElBQUksQ0FBQyxVQUFVLEVBQUU7OztBQUFyQyx1QkFBVztBQUNYLG9CQUFRLEdBQUcsRUFBRTs7Ozs7O0FBQ25CLDZCQUFpQixXQUFXLHVIQUFFO0FBQXJCLGtCQUFJO0FBQ0wsaUJBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFOztBQUM5QixrQkFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQzdCLG9CQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDL0Isd0JBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7ZUFDeEI7YUFDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dEQUVNLFFBQVE7Ozs7Ozs7S0FDaEI7OztXQUVlO1VBQ1IsR0FBRyxFQUNILElBQUksRUFDSixJQUFJOzs7OzttQkFGUSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7OztBQUF4RCxlQUFHO0FBQ0gsZ0JBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzVELGdCQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsRUFBSTtBQUMzQixrQkFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQyxrQkFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQy9DLHFDQUFxQyxDQUFDLENBQUM7QUFDekMsa0JBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxJQUFJLEtBQUssZ0JBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBRyxDQUFBOzs4Q0FDdkIsU0FBUzs7a0JBQXZDLGFBQWE7a0JBQUUsV0FBVzs7QUFDbkMscUJBQU8sSUFBSSxXQUFXLENBQUM7QUFDckIsa0JBQUUsRUFBRSxNQUFNLENBQUMsV0FBVyxJQUFJLGFBQWEsQ0FBQztBQUN4Qyx1QkFBTyxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSztBQUNqRCwwQkFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDO0FBQ3pELHdCQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUM7QUFDckQscUJBQUssRUFBRSxJQUFJLENBQUMsV0FBVztlQUN4QixDQUFDLENBQUM7YUFDSixDQUFDO2dEQUNLLElBQUk7Ozs7Ozs7S0FDWjs7O1dBRWEsa0JBQUMsR0FBRztVQUNWLFFBQVEsRUFJUixJQUFJOzs7OzttQkFKYSxLQUFLLENBQUUsR0FBRyxFQUFFO0FBQ2pDLHlCQUFXLEVBQUUsU0FBUztBQUN0QixxQkFBTyxFQUFFLEVBQUMsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUM7YUFDaEQsQ0FBQzs7O0FBSEksb0JBQVE7O21CQUlLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7OztBQUE1QixnQkFBSTtnREFDSCxBQUFDLElBQUksU0FBUyxFQUFBLENBQUUsZUFBZSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUM7Ozs7Ozs7S0FDMUQ7OztTQTlDRyxlQUFlOzs7QUFpRHJCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBQyxXQUFXLEVBQVgsV0FBVyxFQUFFLGVBQWUsRUFBZixlQUFlLEVBQUMsQ0FBQyIsImZpbGUiOiJjbGllbnQtc3JjL21vbml0b3JzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgSE9TVCA9ICdodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20nO1xuY29uc3QgUEFUSFMgPSB7XG5cdFJFQ0VOVExZX0RFTEVURUQ6ICcvdG9vbHM/dGFiPWRlbGV0ZSZkYXRlcmFuZ2U9bGFzdDMwZGF5cyZtb2RlPXJlY2VudGx5RGVsZXRlZCdcbn07XG5cbmNsYXNzIERlbGV0ZWRQb3N0IHtcbiAgY29uc3RydWN0b3Ioe2lkLCB1dGNUaW1lLCBpc1F1ZXN0aW9uLCBpc0Fuc3dlciwgdGl0bGV9KSB7XG4gICAgdGhpcy5pZCA9IGlkXG4gICAgdGhpcy51dGNUaW1lID0gdXRjVGltZVxuICAgIHRoaXMuaXNRdWVzdGlvbiA9IGlzUXVlc3Rpb25cbiAgICB0aGlzLmlzQW5zd2VyID0gaXNBbnN3ZXJcbiAgICB0aGlzLnRpdGxlID0gdGl0bGVcbiAgfVxuXG4gIGV1cWFscyhvdGhlcikge1xuICAgIHJldHVybiAoXG4gICAgICBvdGhlciBpbnN0YW5jZW9mIERlbGV0ZWRQb3N0ICYmXG4gICAgICBvdGhlci5pZCA9PSB0aGlzLmlkICYmXG4gICAgICBvdGhlci51dGNUaW1lID09IHRoaXMudXRjVGltZSlcbiAgfVxuXG4gIGVxdWFsaXR5S2V5KCkge1xuICAgIHJldHVybiBgJHt0aGlzLnV0Y1RpbWV9LiR7dGhpcy5pZH0uRGVsZXRlZFBvc3RgO1xuICB9XG59XG5cbmNsYXNzIERlbGV0aW9uTW9uaXRvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VlblBvc3RzXyA9IG5ldyBNYXBcbiAgfVxuICBcbiAgYXN5bmMgZ2V0TmV3KCkge1xuICAgIGNvbnN0IGxhdGVzdFBvc3RzID0gYXdhaXQgdGhpcy5nZXRMYXRlc3RfKCk7XG4gICAgY29uc3QgbmV3UG9zdHMgPSBbXTtcbiAgICBmb3IgKGxldCBwb3N0IG9mIGxhdGVzdFBvc3RzKSB7XG4gICAgICBjb25zdCBrZXkgPSBwb3N0LmVxdWFsaXR5S2V5KCk7XG4gICAgICBpZiAoIXRoaXMuc2VlblBvc3RzXy5oYXMoa2V5KSkge1xuICAgICAgICB0aGlzLnNlZW5Qb3N0c18uc2V0KGtleSwgcG9zdCk7XG4gICAgICAgIG5ld1Bvc3RzLnVuc2hpZnQocG9zdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld1Bvc3RzO1xuICB9XG5cbiAgYXN5bmMgZ2V0TGF0ZXN0XygpIHtcbiAgICBjb25zdCBkb2MgPSBhd2FpdCB0aGlzLmdldEhUTUxfKEhPU1QgKyBQQVRIUy5SRUNFTlRMWV9ERUxFVEVEKTtcbiAgICBjb25zdCByb3dzID0gQXJyYXkuZnJvbShkb2MucXVlcnlTZWxlY3RvckFsbCgnLnN1bW1hcnktdGFibGUgdHInKSlcbiAgICBjb25zdCBkYXRhID0gcm93cy5tYXAocm93ID0+IHtcbiAgICAgIGNvbnN0IGxpbmsgPSByb3cucXVlcnlTZWxlY3RvcignYScpO1xuICAgICAgY29uc3QgbGlua01hdGNoID0gbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5tYXRjaChcbiAgICAgICAgL1xcL3F1ZXN0aW9uc1xcLyhcXGQrKSg/OlteI10qIyhcXGQrKSQpPy8pO1xuICAgICAgaWYgKCFsaW5rTWF0Y2gpIHRocm93IG5ldyBFcnJvcihgYmFkIGxpbms6ICR7bGluay5vdXRlckhUTUx9YClcbiAgICAgIGNvbnN0IFssIHF1ZXN0aW9uSWRTdHIsIGFuc3dlcklkU3RyXSA9IGxpbmtNYXRjaDtcbiAgICAgIHJldHVybiBuZXcgRGVsZXRlZFBvc3Qoe1xuICAgICAgICBpZDogTnVtYmVyKGFuc3dlcklkU3RyIHx8IHF1ZXN0aW9uSWRTdHIpLFxuICAgICAgICB1dGNUaW1lOiByb3cucXVlcnlTZWxlY3RvcignLnJlbGF0aXZldGltZScpLnRpdGxlLFxuICAgICAgICBpc1F1ZXN0aW9uOiBsaW5rLmNsYXNzTGlzdC5jb250YWlucygncXVlc3Rpb24taHlwZXJsaW5rJyksXG4gICAgICAgIGlzQW5zd2VyOiBsaW5rLmNsYXNzTGlzdC5jb250YWlucygnYW5zd2VyLWh5cGVybGluaycpLFxuICAgICAgICB0aXRsZTogbGluay50ZXh0Q29udGVudFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbiAgXG4gIGFzeW5jIGdldEhUTUxfKHVybCkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2ggKHVybCwge1xuICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgIGhlYWRlcnM6IHsnWC1SZXF1ZXN0ZWQtV2l0aCc6ICdYTUxIdHRwUmVxdWVzdCd9XG4gICAgfSk7XG4gICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxuICAgIHJldHVybiAobmV3IERPTVBhcnNlcikucGFyc2VGcm9tU3RyaW5nKHRleHQsICd0ZXh0L2h0bWwnKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtEZWxldGVkUG9zdCwgRGVsZXRpb25Nb25pdG9yfTtcbiJdfQ==