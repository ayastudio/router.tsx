import { Route } from './Route';
import { State } from './State';
import { PageParams } from './Types';
export declare class Location {
    route: Route;
    state: State;
    constructor(route: Route, state: State);
    /**
     * @ignore
     * @param viewId
     */
    getLastPanelInView(viewId: string): string | undefined;
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
    getViewHistory(viewId: string): string[];
    getViewHistoryWithLastPanel(viewId: string): string[];
    /**
     * @deprecated use getViewActivePanel
     * @ignore
     * @param viewId
     */
    getPanelIdInView(viewId: string): string | undefined;
    getViewActivePanel(viewId: string): string | undefined;
    getPanelId(): string;
    getViewId(): string;
    getModalId(): string | null;
    getPopupId(): string | null;
    getPageId(): string;
    getParams(): PageParams;
    hasOverlay(): boolean;
    /**
     * Если вам надо отрисовать стрелочку назад или домик то используйте эту функцию
     */
    isFirstPage(): boolean;
}
