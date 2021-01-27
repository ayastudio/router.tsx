"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delay = delay;
exports.noop = noop;

function delay() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;
  return new Promise(function (resolve) {
    return setTimeout(resolve, time);
  });
}

function noop() {// noop
}