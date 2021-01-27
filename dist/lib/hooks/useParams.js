"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useParams = useParams;

var _ = require("../..");

var _react = require("react");

/**
 * Возвращает {@link PageParams} текущего {@link Location}
 * если передать panelId то можно получить правильные параметры для "предыдущей" панели во время жеста swipe back
 * https://github.com/HappySanta/router/issues/16
 * @param {string} panelId id панели для которой надо получить параметры
 */
function useParams(panelId) {
  var location = (0, _.useLocation)(false, panelId);
  var params = (0, _react.useRef)(location.getParams());
  return params.current;
}