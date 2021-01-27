import { Page } from './Page';
import { History } from './History';
import { Route as MyRoute } from './Route';
import { State } from './State';
import { EventEmitter } from 'tsee';
import { RouterConfig } from './RouterConfig';
import { Location } from './Location';
import { HistoryUpdateType, PageParams } from './Types';
export declare type RouteList = {
    [key: string]: Page;
};
export declare type ReplaceUnknownRouteFn = (newRoute: MyRoute, oldRoute?: MyRoute) => MyRoute;
/**
 * @ignore
 */
export declare type UpdateEventFn = (newRoute: MyRoute, oldRoute: MyRoute | undefined, isNewRoute: boolean, type: HistoryUpdateType) => void;
/**
 * @ignore
 */
export declare type EnterEventFn = (newRoute: MyRoute, oldRoute?: MyRoute) => void;
/**
 * @ignore
 */
export declare type LeaveEventFn = (newRoute: MyRoute, oldRoute: MyRoute, isNewRoute: boolean, type: HistoryUpdateType) => void;
export declare class Router extends EventEmitter<{
    update: UpdateEventFn;
    enter: EnterEventFn;
}> {
    routes: RouteList;
    history: History;
    enableLogging: boolean;
    defaultPage: string;
    defaultView: string;
    defaultPanel: string;
    alwaysStartWithSlash: boolean;
    private deferOnGoBack;
    private startHistoryOffset;
    private started;
    private readonly infinityPanelCacheInstance;
    private useHash;
    /**
     *
     * ```javascript
     * export const PAGE_MAIN = '/';
     * export const PAGE_PERSIK = '/persik';
     * export const PANEL_MAIN = 'panel_main';
     * export const PANEL_PERSIK = 'panel_persik';
     * export const VIEW_MAIN = 'view_main';
     * const routes = {
     *   [PAGE_MAIN]: new Page(PANEL_MAIN, VIEW_MAIN),
     *   [PAGE_PERSIK]: new Page(PANEL_PERSIK, VIEW_MAIN),
     * };
     * export const router = new Router(routes);
     * router.start();
     * ```
     * @param routes
     * @param routerConfig
     */
    constructor(routes: RouteList, routerConfig?: RouterConfig | null);
    private static back;
    private static backTo;
    replacerUnknownRoute: ReplaceUnknownRouteFn;
    start(): void;
    stop(): void;
    getCurrentRouteOrDef(): MyRoute;
    getCurrentStateOrDef(): State;
    log(...args: any): void;
    /**
     * Добавляет новую страницу в историю
     * @param pageId страница указанная в конструкторе {@link Router.constructor}
     * @param params можно получить из {@link Location.getParams}
     */
    pushPage(pageId: string, params?: PageParams): void;
    /**
     * Заменяет текущую страницу на переданную
     * @param pageId страница указанная в конструкторе {@link Router.constructor}
     * @param params можно получить из {@link Location.getParams}
     */
    replacePage(pageId: string, params?: PageParams): void;
    pushPageAfterPreviews(prevPageId: string, pageId: string, params?: PageParams): void;
    /**
     * Переход по истории назад
     */
    popPage(): void;
    /**
     * Если x - число, то осуществляется переход на указанное количество шагов назад
     * Если x - строка, то в истории будет найдена страница с указанным pageId и осуществлен переход до нее
     * @param {string|number} x
     */
    popPageTo(x: number | string): void;
    popPageToAndPush(x: number, pageId: string, params?: PageParams): void;
    /**
     *  История ломается когда открывается VKPay или пост из колокольчика
     */
    isHistoryBroken(): boolean;
    /**
     * Способ починить историю браузера когда ее сломали снаружи из фрейма
     * например перейдя по колокольчику или открыв вкпей
     */
    fixBrokenHistory(): void;
    /**
     * @param modalId
     * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
     */
    pushModal(modalId: string, params?: PageParams): void;
    /**
     * @param popupId
     * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
     */
    pushPopup(popupId: string, params?: PageParams): void;
    /**
     * @param modalId
     * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
     */
    replaceModal(modalId: string, params?: PageParams): void;
    /**
     * @param popupId
     * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
     */
    replacePopup(popupId: string, params?: PageParams): void;
    popPageIfModal(): void;
    popPageIfPopup(): void;
    /**
     * @deprecated use popPageIfHasOverlay
     */
    popPageIfModalOrPopup(): void;
    popPageIfHasOverlay(): void;
    /**
     * @param pageId
     * @param fn
     * @return unsubscribe function
     */
    onEnterPage(pageId: string, fn: UpdateEventFn): () => void;
    /**
     * @param pageId
     * @param fn
     * @return unsubscribe function
     */
    onLeavePage(pageId: string, fn: LeaveEventFn): () => void;
    getCurrentLocation(): Location;
    getPreviousLocation(): Location | undefined;
    /**
     * @param safety - true будет ждать события не дольше 700мс, если вы уверены что надо ждать дольше передайте false
     */
    afterUpdate(safety?: boolean): Promise<void>;
    private static checkParams;
    private getDefaultRoute;
    private readonly onPopState;
    private replace;
    private push;
    private createRouteFromLocationWithReplace;
    private createRouteFromLocation;
    private static isErrorThrowingEnabled;
    /**
     * Чтобы отрендерить бесконечне панели надо знать их id
     * этот метод возвращает все id панелей которые хоть раз были отрендерены
     * это не эффективно, однако сейчас точно нельзя сказать когда панель нужна а когда нет
     * это обусловленно тем что панели надо убирать из дерева только после того как пройдет анимация vkui
     * кроме того панели могут убираться из середины, благодоря useThrottlingLocation.ts
     *
     * текущее решение -- рендерить все панели всегда
     *
     * @param viewId
     */
    getInfinityPanelList(viewId: string): string[];
}
