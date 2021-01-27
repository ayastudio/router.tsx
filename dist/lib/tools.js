"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preventBlinkingBySettingScrollRestoration = preventBlinkingBySettingScrollRestoration;
exports.getDisplayName = getDisplayName;

/**
 * @ignore
 * @packageDocumentation
 */

/**
 * @ignore
 */
function preventBlinkingBySettingScrollRestoration() {
  if ('scrollRestoration' in window.history && window.history.scrollRestoration === 'auto') {
    window.history.scrollRestoration = 'manual';
  }
}
/**
 * @ignore
 * @param WrappedComponent
 */


function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}