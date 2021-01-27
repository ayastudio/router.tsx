"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLocation = useLocation;

var _ = require("../..");

var _react = require("react");

/**
 * @param withUpdate
 * @param {string} panelId id панели для которой надо получить Location
 */
function useLocation() {
  var withUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var panelId = arguments.length > 1 ? arguments[1] : undefined;
  var router = (0, _.useRouter)(withUpdate);
  var cachedLocation = (0, _react.useRef)(router.getCurrentLocation());
  var prevLocation = (0, _react.useRef)(router.getPreviousLocation());

  if (withUpdate) {
    var curLocation = router.getCurrentLocation();

    var _prevLocation = router.getPreviousLocation();

    if (panelId && (_prevLocation === null || _prevLocation === void 0 ? void 0 : _prevLocation.getPanelId()) === panelId) {
      return _prevLocation;
    }

    return curLocation;
  } else {
    var _prevLocation$current;

    if (panelId && ((_prevLocation$current = prevLocation.current) === null || _prevLocation$current === void 0 ? void 0 : _prevLocation$current.getPanelId()) === panelId) {
      return prevLocation.current;
    }

    return cachedLocation.current;
  }
}