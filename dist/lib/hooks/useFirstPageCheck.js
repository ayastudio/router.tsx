"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFirstPageCheck = useFirstPageCheck;

var _useLocation = require("./useLocation");

/**
 * Проверка на первую страницу для ситуаций когда пользователь входит в приложение по ссылке вида
 * https://vk.com/app7574523#product/12
 * @param withUpdate
 * @param panelId
 */
function useFirstPageCheck() {
  var withUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var panelId = arguments.length > 1 ? arguments[1] : undefined;
  var location = (0, _useLocation.useLocation)(withUpdate, panelId);
  return location.isFirstPage();
}