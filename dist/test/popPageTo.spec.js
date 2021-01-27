"use strict";

var _ = require("..");

var _tools = require("./tools");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

describe('popPageTo', function () {
  beforeEach(function () {
    (0, _.dangerousResetGlobalRouterUseForTestOnly)();
  });
  it('move to expected', /*#__PURE__*/function () {
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
              return (0, _tools.delay)();

            case 8:
              r.popPageTo('/info');
              _context.next = 11;
              return (0, _tools.delay)();

            case 11:
              expect(r.getCurrentRouteOrDef().getPageId()).toBe('/info');
              r.popPage();
              _context.next = 15;
              return (0, _tools.delay)();

            case 15:
              expect(r.getCurrentRouteOrDef().getPageId()).toBe('/user');
              r.pushPage('/info');
              r.pushPage('/create');
              r.pushPage('/done');
              _context.next = 21;
              return (0, _tools.delay)();

            case 21:
              r.popPageTo('/user');
              _context.next = 24;
              return (0, _tools.delay)();

            case 24:
              expect(r.getCurrentRouteOrDef().getPageId()).toBe('/user');
              r.popPage();
              _context.next = 28;
              return (0, _tools.delay)();

            case 28:
              expect(r.getCurrentRouteOrDef().getPageId()).toBe('/');
              done();

            case 30:
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
});