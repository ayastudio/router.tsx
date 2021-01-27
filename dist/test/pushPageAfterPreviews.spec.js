"use strict";

var _ = require("..");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function delay() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;
  return new Promise(function (resolve) {
    return setTimeout(resolve, time);
  });
}

describe('pushPageAfterPreviews', function () {
  beforeEach(function () {
    (0, _.dangerousResetGlobalRouterUseForTestOnly)();
  });
  it('simple', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(done) {
      var r;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              r = new _.Router({
                '/': new _.Page('main', 'main'),
                '/user': new _.Page('user', 'main'),
                '/info': new _.Page('info', 'main'),
                '/create': new _.Page('create', 'create'),
                '/done': new _.Page('done', 'create')
              }, null);
              r.start();
              r.pushPage('/user');
              r.pushPage('/info');
              r.pushPage('/create');
              r.pushPage('/done');
              _context.next = 8;
              return delay();

            case 8:
              r.popPage();
              _context.next = 11;
              return delay();

            case 11:
              expect(r.getCurrentRouteOrDef().getPageId()).toBe('/create');
              r.pushPageAfterPreviews('/', '/done');
              _context.next = 15;
              return delay();

            case 15:
              expect(r.getCurrentRouteOrDef().getPageId()).toBe('/done');
              r.popPage();
              _context.next = 19;
              return delay();

            case 19:
              expect(r.getCurrentRouteOrDef().getPageId()).toBe('/');
              done();

            case 21:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  it('complex', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(done) {
      var r, updateCallback;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              r = new _.Router({
                '/': new _.Page('main', 'main'),
                '/user': new _.Page('user', 'main'),
                '/info': new _.Page('info', 'main'),
                '/create': new _.Page('create', 'main'),
                '/done': new _.Page('done', 'main')
              }, null);
              r.start();
              r.pushPage('/user');
              r.pushPage('/info');
              r.pushPage('/create');
              r.pushPage('/done');
              _context2.next = 8;
              return delay();

            case 8:
              expect(r.getCurrentRouteOrDef().getPageId()).toBe('/done');
              updateCallback = jest.fn();
              r.on('update', updateCallback);
              r.pushPageAfterPreviews('/', '/done');
              _context2.next = 14;
              return r.afterUpdate();

            case 14:
              r.off('update', updateCallback);
              expect(r.getCurrentRouteOrDef().getPageId()).toBe('/done');
              expect(r.history.getLength()).toBe(2);
              expect(updateCallback).toHaveBeenCalled();
              r.pushPageAfterPreviews('/info', '/create'); // Тут страницы /info у нас нет, это обычный push

              _context2.next = 21;
              return r.afterUpdate();

            case 21:
              expect(r.getCurrentRouteOrDef().getPageId()).toBe('/create');
              expect(r.history.getLength()).toBe(3);
              r.popPage();
              _context2.next = 26;
              return r.afterUpdate();

            case 26:
              expect(r.getCurrentRouteOrDef().getPageId()).toBe('/done');
              r.popPage();
              _context2.next = 30;
              return r.afterUpdate();

            case 30:
              expect(r.getCurrentRouteOrDef().getPageId()).toBe('/');
              done();

            case 32:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());
  it('save correct activePanel', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(done) {
      var r;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              r = new _.Router({
                '/': new _.Page('main', 'main'),
                '/user': new _.Page('user', 'main'),
                '/info': new _.Page('info', 'main'),
                // 2
                '/create': new _.Page('create', 'create'),
                '/done': new _.Page('done', 'create') // 1

              }, null);
              r.start();
              expect(r.getCurrentLocation().getViewActivePanel('create')).toBe(undefined);
              r.pushPage('/user');
              r.pushPage('/info');
              r.pushPage('/create');
              expect(r.getCurrentLocation().getViewActivePanel('create')).toBe('create');
              r.pushPage('/done');
              expect(r.getCurrentLocation().getViewActivePanel('create')).toBe('done');
              expect(r.getCurrentLocation().getViewActivePanel('main')).toBe('info');
              r.popPageTo('/');
              _context3.next = 13;
              return r.afterUpdate();

            case 13:
              expect(r.getCurrentLocation().getViewActivePanel('create')).toBe('done');
              done();

            case 15:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
});