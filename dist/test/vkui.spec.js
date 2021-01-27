"use strict";

var _react = _interopRequireDefault(require("react"));

var _ = require("..");

var _react2 = require("@testing-library/react");

var _tools = require("./tools");

var _ConfigProvider = _interopRequireDefault(require("@vkontakte/vkui/dist/components/ConfigProvider/ConfigProvider"));

var _Root = _interopRequireDefault(require("@vkontakte/vkui/dist/components/Root/Root"));

var _View = _interopRequireDefault(require("@vkontakte/vkui/dist/components/View/View"));

var _Panel = _interopRequireDefault(require("@vkontakte/vkui/dist/components/Panel/Panel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getViewProps = function getViewProps(viewId, location) {
  return {
    id: viewId,
    activePanel: location.getViewActivePanel(viewId),
    history: location.getViewHistory(viewId)
  };
};

test('VKUI integration stress test', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(done) {
    var _list;

    var PAGE_MAIN, PAGE_ABOUT, PAGE_ABOUT_NEXT, PAGE_INFO, PANEL_MAIN, PANEL_ABOUT, PANEL_ABOUT_NEXT, PANEL_INFO, VIEW_MAIN, VIEW_ABOUT, VIEW_INFO, list, Main, router, component, updateAct, expectPanel, i;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // scrollTo is not implemented
            Object.defineProperty(global.window, 'scrollTo', {
              value: _tools.noop
            });
            PAGE_MAIN = '/';
            PAGE_ABOUT = '/about';
            PAGE_ABOUT_NEXT = '/about/next';
            PAGE_INFO = '/info';
            PANEL_MAIN = 'panel_main';
            PANEL_ABOUT = 'panel_about';
            PANEL_ABOUT_NEXT = 'panel_about_next';
            PANEL_INFO = 'panel_info';
            VIEW_MAIN = 'view_main';
            VIEW_ABOUT = 'view_about';
            VIEW_INFO = 'view_info';
            list = (_list = {}, _defineProperty(_list, PAGE_MAIN, new _.Page(PANEL_MAIN, VIEW_MAIN)), _defineProperty(_list, PAGE_ABOUT, new _.Page(PANEL_ABOUT, VIEW_ABOUT)), _defineProperty(_list, PAGE_ABOUT_NEXT, new _.Page(PANEL_ABOUT_NEXT, VIEW_ABOUT)), _defineProperty(_list, PAGE_INFO, new _.Page(PANEL_INFO, VIEW_INFO)), _list);

            Main = function Main() {
              var location = (0, _.useLocation)(true);
              return /*#__PURE__*/_react["default"].createElement(_Root["default"], {
                activeView: location.getViewId()
              }, /*#__PURE__*/_react["default"].createElement(_View["default"], getViewProps(VIEW_MAIN, location), /*#__PURE__*/_react["default"].createElement(_Panel["default"], {
                id: PANEL_MAIN,
                "data-testid": PANEL_MAIN
              }, PANEL_MAIN)), /*#__PURE__*/_react["default"].createElement(_View["default"], getViewProps(VIEW_ABOUT, location), /*#__PURE__*/_react["default"].createElement(_Panel["default"], {
                id: PANEL_ABOUT,
                "data-testid": PANEL_ABOUT
              }, PANEL_ABOUT), /*#__PURE__*/_react["default"].createElement(_Panel["default"], {
                id: PANEL_ABOUT_NEXT,
                "data-testid": PANEL_ABOUT_NEXT
              }, PANEL_ABOUT_NEXT)), /*#__PURE__*/_react["default"].createElement(_View["default"], getViewProps(VIEW_INFO, location), /*#__PURE__*/_react["default"].createElement(_Panel["default"], {
                id: PANEL_INFO,
                "data-testid": PANEL_INFO
              }, PANEL_INFO)));
            };

            router = new _.Router(list);
            router.start();
            component = (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(_ConfigProvider["default"], {
              transitionMotionEnabled: false
            }, /*#__PURE__*/_react["default"].createElement(_.RouterContext.Provider, {
              value: router
            }, /*#__PURE__*/_react["default"].createElement(Main, null)), ","));

            updateAct = /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(count, callback) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _react2.act)(function () {
                          return new Promise(function (resolve, reject) {
                            var updates = 0;

                            var update = function update() {
                              updates = updates + 1;

                              if (updates >= count) {
                                router.off('update', update);
                                setTimeout(resolve, 20);
                              }
                            };

                            router.on('update', update);
                            setTimeout(function () {
                              reject(new Error('Update timeout'));
                            }, 2E3);

                            try {
                              callback();
                            } catch (e) {
                              reject(e);
                            }
                          });
                        });

                      case 2:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function updateAct(_x2, _x3) {
                return _ref2.apply(this, arguments);
              };
            }();

            expectPanel = /*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(panel) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.t0 = expect;
                        _context2.next = 3;
                        return component.findByTestId(panel);

                      case 3:
                        _context2.t1 = _context2.sent;
                        (0, _context2.t0)(_context2.t1).toBeTruthy();

                      case 5:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function expectPanel(_x4) {
                return _ref3.apply(this, arguments);
              };
            }();

            _context3.next = 21;
            return expectPanel(PANEL_MAIN);

          case 21:
            _context3.next = 23;
            return updateAct(2, function () {
              router.pushPage(PAGE_INFO);
              router.pushPageAfterPreviews(PAGE_MAIN, PAGE_ABOUT);
            });

          case 23:
            _context3.next = 25;
            return expectPanel(PANEL_ABOUT);

          case 25:
            _context3.next = 27;
            return updateAct(1, function () {
              router.popPage();
            });

          case 27:
            _context3.next = 29;
            return expectPanel(PANEL_MAIN);

          case 29:
            _context3.next = 31;
            return updateAct(3, function () {
              router.pushPage(PAGE_ABOUT);
              router.pushPage(PAGE_ABOUT_NEXT);
              router.pushPageAfterPreviews(PAGE_MAIN, PAGE_INFO);
            });

          case 31:
            _context3.next = 33;
            return expectPanel(PANEL_INFO);

          case 33:
            _context3.next = 35;
            return updateAct(1, function () {
              router.popPage();
            });

          case 35:
            _context3.next = 37;
            return expectPanel(PANEL_MAIN);

          case 37:
            _context3.next = 39;
            return updateAct(2, function () {
              router.pushPage(PAGE_INFO);
              router.pushPageAfterPreviews(PAGE_MAIN, PAGE_INFO);
            });

          case 39:
            _context3.next = 41;
            return expectPanel(PANEL_INFO);

          case 41:
            i = 3;

          case 42:
            if (!(i > 0)) {
              _context3.next = 50;
              break;
            }

            _context3.next = 45;
            return updateAct(1, function () {
              router.pushPageAfterPreviews(PAGE_MAIN, PAGE_ABOUT);
            });

          case 45:
            _context3.next = 47;
            return expectPanel(PANEL_ABOUT);

          case 47:
            --i;
            _context3.next = 42;
            break;

          case 50:
            _context3.next = 52;
            return updateAct(1, function () {
              router.popPage();
            });

          case 52:
            _context3.next = 54;
            return expectPanel(PANEL_MAIN);

          case 54:
            _context3.next = 56;
            return updateAct(3, function () {
              router.pushPage(PAGE_ABOUT);
              router.pushPage(PAGE_ABOUT_NEXT);
              router.pushPage(PAGE_INFO);
            });

          case 56:
            _context3.next = 58;
            return expectPanel(PANEL_INFO);

          case 58:
            _context3.next = 60;
            return updateAct(1, function () {
              router.popPageTo(-3);
            });

          case 60:
            _context3.next = 62;
            return expectPanel(PANEL_MAIN);

          case 62:
            _context3.next = 64;
            return updateAct(3, function () {
              router.pushPage(PAGE_INFO);
              router.pushPage(PAGE_ABOUT_NEXT);
              router.pushPage(PAGE_ABOUT);
            });

          case 64:
            _context3.next = 66;
            return expectPanel(PANEL_ABOUT);

          case 66:
            _context3.next = 68;
            return updateAct(1, function () {
              router.popPageTo(-3);
            });

          case 68:
            _context3.next = 70;
            return expectPanel(PANEL_MAIN);

          case 70:
            _context3.next = 72;
            return updateAct(3, function () {
              router.pushPage(PAGE_ABOUT_NEXT);
              router.pushPage(PAGE_ABOUT);
              router.pushPage(PAGE_INFO);
            });

          case 72:
            _context3.next = 74;
            return expectPanel(PANEL_INFO);

          case 74:
            _context3.next = 76;
            return updateAct(1, function () {
              router.popPageTo(-3);
            });

          case 76:
            _context3.next = 78;
            return expectPanel(PANEL_MAIN);

          case 78:
            _context3.next = 80;
            return (0, _tools.delay)();

          case 80:
            (0, _react2.cleanup)();
            done();

          case 82:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());