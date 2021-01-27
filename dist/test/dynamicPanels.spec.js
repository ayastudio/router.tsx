"use strict";

var _tools = require("./tools");

var _ = require("..");

var _react = _interopRequireDefault(require("react"));

var _Root = _interopRequireDefault(require("@vkontakte/vkui/dist/components/Root/Root"));

var _View = _interopRequireDefault(require("@vkontakte/vkui/dist/components/View/View"));

var _Panel = _interopRequireDefault(require("@vkontakte/vkui/dist/components/Panel/Panel"));

var _react2 = require("@testing-library/react");

var _ConfigProvider = _interopRequireDefault(require("@vkontakte/vkui/dist/components/ConfigProvider/ConfigProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

describe('dynamic panels', function () {
  test('work with fast back press', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(done) {
      var _list;

      var PAGE_MAIN, PAGE_PLAYER, VIEW_MAIN, PANEL_MAIN, PANEL_PLAYER, list, Main, router, component, expectPanel, expectInfinityPanel, PUSH_COUNT, _loop, i;

      return regeneratorRuntime.wrap(function _callee5$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              // scrollTo is not implemented
              Object.defineProperty(global.window, 'scrollTo', {
                value: _tools.noop
              });
              PAGE_MAIN = '/';
              PAGE_PLAYER = '/player/:id([0-9]+)';
              VIEW_MAIN = 'view_main';
              PANEL_MAIN = 'panel_main';
              PANEL_PLAYER = 'panel_player';
              list = (_list = {}, _defineProperty(_list, PAGE_MAIN, new _.Page(PANEL_MAIN, VIEW_MAIN)), _defineProperty(_list, PAGE_PLAYER, new _.Page(PANEL_PLAYER, VIEW_MAIN).makeInfinity()), _list);

              Main = function Main() {
                var _useThrottlingLocatio = (0, _.useThrottlingLocation)(),
                    _useThrottlingLocatio2 = _slicedToArray(_useThrottlingLocatio, 2),
                    location = _useThrottlingLocatio2[0],
                    _onTransition = _useThrottlingLocatio2[1];

                var router = (0, _.useRouter)(false);
                var panelList = [/*#__PURE__*/_react["default"].createElement(_Panel["default"], {
                  id: PANEL_MAIN,
                  key: PANEL_MAIN,
                  "data-testid": PANEL_MAIN
                }, PANEL_MAIN)].concat(_toConsumableArray(router.getInfinityPanelList(VIEW_MAIN).map(function (panelId) {
                  if ((0, _.isInfinityPanel)(panelId)) {
                    var type = (0, _.getInfinityPanelId)(panelId);

                    if (type === PANEL_PLAYER) {
                      return /*#__PURE__*/_react["default"].createElement(_Panel["default"], {
                        key: panelId,
                        "data-testid": "dynamic",
                        id: panelId
                      }, panelId);
                    }
                  }

                  return null;
                }).filter(function (x) {
                  return !!x;
                }))); // console.log('render', location.getViewHistoryWithLastPanel(VIEW_MAIN))

                return /*#__PURE__*/_react["default"].createElement(_Root["default"], {
                  onTransition: function onTransition() {
                    return _onTransition();
                  },
                  activeView: location.getViewId()
                }, /*#__PURE__*/_react["default"].createElement(_View["default"], {
                  onTransition: function onTransition() {
                    return _onTransition();
                  },
                  activePanel: location.getViewActivePanel(VIEW_MAIN),
                  history: location.getViewHistory(VIEW_MAIN),
                  id: VIEW_MAIN
                }, panelList));
              };

              router = new _.Router(list);
              router.start();
              component = (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(_ConfigProvider["default"], {
                transitionMotionEnabled: true
              }, /*#__PURE__*/_react["default"].createElement(_.RouterContext.Provider, {
                value: router
              }, /*#__PURE__*/_react["default"].createElement(Main, null)), ","));

              expectPanel = /*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(panel) {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.t0 = expect;
                          _context.next = 3;
                          return component.findByTestId(panel);

                        case 3:
                          _context.t1 = _context.sent;
                          (0, _context.t0)(_context.t1).toBeTruthy();

                        case 5:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function expectPanel(_x2) {
                  return _ref2.apply(this, arguments);
                };
              }();

              expectInfinityPanel = /*#__PURE__*/function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(panel) {
                  var panel2;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return component.findByTestId('dynamic');

                        case 2:
                          panel2 = _context2.sent;
                          expect(panel2.innerHTML).toContain(panel);

                        case 4:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function expectInfinityPanel(_x3) {
                  return _ref3.apply(this, arguments);
                };
              }();

              _context6.next = 15;
              return expectPanel(PANEL_MAIN);

            case 15:
              PUSH_COUNT = 7;
              _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(i) {
                return regeneratorRuntime.wrap(function _loop$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return (0, _react2.act)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                          return regeneratorRuntime.wrap(function _callee4$(_context4) {
                            while (1) {
                              switch (_context4.prev = _context4.next) {
                                case 0:
                                  router.pushPage(PAGE_PLAYER, {
                                    id: "1".concat(i.toString())
                                  });
                                  _context4.next = 3;
                                  return (0, _tools.delay)(400);

                                case 3:
                                case "end":
                                  return _context4.stop();
                              }
                            }
                          }, _callee4);
                        })));

                      case 2:
                        _context5.next = 4;
                        return expectInfinityPanel(PANEL_PLAYER);

                      case 4:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _loop);
              });
              i = 1;

            case 18:
              if (!(i < PUSH_COUNT)) {
                _context6.next = 23;
                break;
              }

              return _context6.delegateYield(_loop(i), "t0", 20);

            case 20:
              i++;
              _context6.next = 18;
              break;

            case 23:
              _context6.next = 25;
              return (0, _tools.delay)(350);

            case 25:
              _context6.next = 27;
              return (0, _react2.act)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var _i2;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _i2 = 1;

                      case 1:
                        if (!(_i2 < PUSH_COUNT)) {
                          _context3.next = 8;
                          break;
                        }

                        router.popPage();
                        _context3.next = 5;
                        return (0, _tools.delay)(1);

                      case 5:
                        _i2++;
                        _context3.next = 1;
                        break;

                      case 8:
                        _context3.next = 10;
                        return (0, _tools.delay)(950);

                      case 10:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              })));

            case 27:
              _context6.next = 29;
              return expectPanel(PANEL_MAIN);

            case 29:
              done();

            case 30:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
});