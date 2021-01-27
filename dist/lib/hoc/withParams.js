"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withParams = withParams;

var _react = _interopRequireDefault(require("react"));

var _ = require("../..");

var _tools = require("../tools");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * HOC для добавления
 * params:{@link PageParams}
 * в компонент
 * параметры не обновляются при переходах по страницам
 * @param Component
 * @param panelId если true, то из props будет взято свойство id для передачи в {@link useParams}, если строка то она будет передана
 */
function withParams(Component) {
  var panelId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  function WithParams(props) {
    var proxyPanelId = undefined;

    if (typeof panelId === 'string') {
      proxyPanelId = panelId;
    } else if (panelId) {
      var p = props;

      if (p && p.id) {
        proxyPanelId = p.id;
      }
    }

    var params = (0, _.useParams)(proxyPanelId);
    return /*#__PURE__*/_react["default"].createElement(Component, _extends({}, props, {
      params: params
    }));
  }

  WithParams.displayName = "WithParams(".concat((0, _tools.getDisplayName)(Component), ")");
  return WithParams;
}