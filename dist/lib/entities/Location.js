export class Location {
    constructor(route, state) {
        this.route = route;
        this.state = state;
    }
    /**
     * @ignore
     * @param viewId
     */
    getLastPanelInView(viewId) {
        const state = this.state;
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
    getViewHistory(viewId) {
        const route = this.route;
        const state = this.state;
        if (route.getViewId() === viewId) {
            return state.history;
        }
        else {
            const lastPanelId = this.getViewActivePanel(viewId);
            if (lastPanelId) {
                return [lastPanelId];
            }
            return [];
        }
    }
    getViewHistoryWithLastPanel(viewId) {
        const history = this.getViewHistory(viewId);
        const lastPanel = this.getLastPanelInView(viewId);
        if (lastPanel && !history.includes(lastPanel)) {
            return history.concat([lastPanel]);
        }
        else {
            return history;
        }
    }
    /**
     * @deprecated use getViewActivePanel
     * @ignore
     * @param viewId
     */
    getPanelIdInView(viewId) {
        return this.getViewActivePanel(viewId);
    }
    getViewActivePanel(viewId) {
        const route = this.route;
        if (route.getViewId() === viewId) {
            return route.getPanelId();
        }
        else {
            return this.getLastPanelInView(viewId);
        }
    }
    getPanelId() {
        return this.route.getPanelId();
    }
    getViewId() {
        return this.route.getViewId();
    }
    getModalId() {
        return this.route.getModalId();
    }
    getPopupId() {
        return this.route.getPopupId();
    }
    getPageId() {
        return this.route.getPageId();
    }
    getParams() {
        return this.route.getParams();
    }
    hasOverlay() {
        return this.route.hasOverlay();
    }
    /**
     * Если вам надо отрисовать стрелочку назад или домик то используйте эту функцию
     */
    isFirstPage() {
        return this.state.first === 1;
    }
}
