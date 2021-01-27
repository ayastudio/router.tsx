"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouterContext = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Все приложение необходимо оборачивать в контекст для корректной работы {@link withRouter} {@link useRouter}
 *
 * ```javascript
 * import { RouterContext } from '@happysanta/router';
 * import { router } from './routers';
 *
 * ReactDOM.render(<RouterContext.Provider value={router}>
 *   <ConfigProvider isWebView={true}>
 *     <App/>
 *   </ConfigProvider>
 * </RouterContext.Provider>, document.getElementById('root'));
 * ```
 */
var RouterContext = /*#__PURE__*/_react["default"].createContext(null);

exports.RouterContext = RouterContext;
RouterContext.displayName = 'Router';