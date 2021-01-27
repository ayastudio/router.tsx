"use strict";

var _ = require("..");

var _tools = require("./tools");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

describe('restoreFromCache', function () {
  it('firstPageCHeckWorked', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(done) {
      var _Router;

      var USER_PAGE, r;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              USER_PAGE = '/user/:id([0-9]+)';
              r = new _.Router((_Router = {
                '/': new _.Page('main', 'main')
              }, _defineProperty(_Router, USER_PAGE, new _.Page('user', 'main')), _defineProperty(_Router, '/info', new _.Page('info', 'main')), _defineProperty(_Router, '/create', new _.Page('create', 'main')), _defineProperty(_Router, '/done', new _.Page('done', 'main')), _Router), null);
              r.start();
              expect(r.getCurrentLocation().isFirstPage()).toBeTruthy();
              r.pushPage('/info');
              expect(r.getCurrentLocation().getPageId()).toBe('/info');
              expect(r.getCurrentLocation().isFirstPage()).toBeFalsy();
              window.location.hash = '#user/12';
              _context.next = 10;
              return (0, _tools.delay)();

            case 10:
              expect(r.getCurrentLocation().isFirstPage()).toBeTruthy();
              expect(r.getCurrentLocation().getPageId()).toBe(USER_PAGE);
              expect(r.getCurrentLocation().getParams()).toMatchObject({
                id: '12'
              });
              done();

            case 14:
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