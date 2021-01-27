"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Location = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Location = /*#__PURE__*/function () {
  function Location(route, state) {
    _classCallCheck(this, Location);

    _defineProperty(this, "route", void 0);

    _defineProperty(this, "state", void 0);

    this.route = route;
    this.state = state;
  }
  /**
   * @ignore
   * @param viewId
   */


  _createClass(Location, [{
    key: "getLastPanelInView",
    value: function getLastPanelInView(viewId) {
      var state = this.state;

      if (state && state.panelInView[viewId]) {
        return state.panelInView[viewId];
      }

      return undefined;
    }
    /**
     * Массив из id панелей для передачи в атрибут history <View>
     *
     * ```javascript
     * import { useLocation } from '@happysanta/router';
     *
     * const App = () => {
     *    const location = useLocation();
     *    return <View id={VIEW_MAIN}
     *                 history={location.getViewHistory(VIEW_MAIN)}
     *                 activePanel={location.getViewActivePanel(VIEW_MAIN)}>
     *           <Home id={PANEL_MAIN}/>
     *           <Persik id={PANEL_PERSIK}/>
     *    </View>
     * }
     * ```
     *
     * @param viewId
     */

  }, {
    key: "getViewHistory",
    value: function getViewHistory(viewId) {
      var route = this.route;
      var state = this.state;

      if (route.getViewId() === viewId) {
        return state.history;
      } else {
        var lastPanelId = this.getViewActivePanel(viewId);

        if (lastPanelId) {
          return [lastPanelId];
        }

        return [];
      }
    }
  }, {
    key: "getViewHistoryWithLastPanel",
    value: function getViewHistoryWithLastPanel(viewId) {
      var history = this.getViewHistory(viewId);
      var lastPanel = this.getLastPanelInView(viewId);

      if (lastPanel && !history.includes(lastPanel)) {
        return history.concat([lastPanel]);
      } else {
        return history;
      }
    }
    /**
     * @deprecated use getViewActivePanel
     * @ignore
     * @param viewId
     */

  }, {
    key: "getPanelIdInView",
    value: function getPanelIdInView(viewId) {
      return this.getViewActivePanel(viewId);
    }
  }, {
    key: "getViewActivePanel",
    value: function getViewActivePanel(viewId) {
      var route = this.route;

      if (route.getViewId() === viewId) {
        return route.getPanelId();
      } else {
        return this.getLastPanelInView(viewId);
      }
    }
  }, {
    key: "getPanelId",
    value: function getPanelId() {
      return this.route.getPanelId();
    }
  }, {
    key: "getViewId",
    value: function getViewId() {
      return this.route.getViewId();
    }
  }, {
    key: "getModalId",
    value: function getModalId() {
      return this.route.getModalId();
    }
  }, {
    key: "getPopupId",
    value: function getPopupId() {
      return this.route.getPopupId();
    }
  }, {
    key: "getPageId",
    value: function getPageId() {
      return this.route.getPageId();
    }
  }, {
    key: "getParams",
    value: function getParams() {
      return this.route.getParams();
    }
  }, {
    key: "hasOverlay",
    value: function hasOverlay() {
      return this.route.hasOverlay();
    }
    /**
     * Если вам надо отрисовать стрелочку назад или домик то используйте эту функцию
     */

  }, {
    key: "isFirstPage",
    value: function isFirstPage() {
      return this.state.first === 1;
    }
  }]);

  return Location;
}();

exports.Location = Location;