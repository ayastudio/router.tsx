"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useRoute = useRoute;

var _ = require("../..");

/**
 * @ignore
 * @packageDocumentation
 */

/**
 * @param withUpdate
 * @param panelId
 * @deprecated useRouter
 * @ignore
 */
function useRoute() {
  var withUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var panelId = arguments.length > 1 ? arguments[1] : undefined;
  var location = (0, _.useLocation)(withUpdate, panelId);
  return location.route;
}