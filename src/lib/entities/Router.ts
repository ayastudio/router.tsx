import * as qs from 'querystring';
import { compile } from 'path-to-regexp';
import { EventEmitter } from 'tsee';

import { Page } from './Page';
import { History, UpdateEventType } from './History';
import { MODAL_KEY, POPUP_KEY, Route as MyRoute } from './Route';
import { preventBlinkingBySettingScrollRestoration } from '../tools';
import { State, stateFromLocation } from './State';

import { PAGE_MAIN, PANEL_MAIN, VIEW_MAIN } from '../const';
import { RouterConfig } from './RouterConfig';
import { Location } from './Location';
import { HistoryUpdateType, PageParams } from './Types';

import { matchPath } from '../workWithPathRegexp';


export declare type RouteList = { [key: string]: Page };

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

export class Router extends EventEmitter<{
    update: UpdateEventFn;
    enter: EnterEventFn;
}> {
    routes: RouteList = {};
    history: History;
    enableLogging = false;
    defaultPage: string = PAGE_MAIN;
    defaultView: string = VIEW_MAIN;
    defaultPanel: string = PANEL_MAIN;
    alwaysStartWithSlash = true;
    private deferOnGoBack: (() => void) | null = null;
    private startHistoryOffset = 0;
    private started = false;
    private readonly infinityPanelCacheInstance: Map<string, string[]> = new Map<string, string[]>();
    private readonly useHash: boolean = false;
    private readonly notFoundRoute: string = '/404';

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
    constructor(routes: RouteList, routerConfig: RouterConfig | null = null) {
        super();

        this.routes = routes;
        this.history = new History();

        if (routerConfig) {
            if (routerConfig.enableLogging !== undefined) {
                this.enableLogging = routerConfig.enableLogging;
            }
            if (routerConfig.defaultPage !== undefined) {
                this.defaultPage = routerConfig.defaultPage;
            }
            if (routerConfig.defaultView !== undefined) {
                this.defaultView = routerConfig.defaultView;
            }
            if (routerConfig.defaultPanel !== undefined) {
                this.defaultPanel = routerConfig.defaultPanel;
            }
            if (routerConfig.noSlash !== undefined) {
                this.alwaysStartWithSlash = routerConfig.noSlash;
            }
            if (routerConfig.useHash !== undefined) {
                this.useHash = routerConfig.useHash;
            }
            if (routerConfig.notFoundRoute !== undefined) {
                this.notFoundRoute = routerConfig.notFoundRoute;
            }
        }
    }

    private back() {
        let mayGoBack = this.checkCanGoBack();

        mayGoBack ? window.history.back() : this.replaceBackOrDefault();
    }

    private backTo(x: number) {
        if (x < 0) {
            let mayGoBack = this.checkCanGoBack();
            mayGoBack ? window.history.go(x) : this.replaceBackOrDefault();

            return;
        }

        window.history.go(x);
    }

    private checkCanGoBack() {
        return this.useHash || window.history.state.first !== 1;
    }

    /**
     * Проверяем возможность получить информацию о предыдыщей странице,
     * чтобы вернуться на нее, в случае отсутствия - на главную страницу приложения
     *
     * @private
     */
    private replaceBackOrDefault() {
        let route = this.makeMyRoute(this.tryGetPrevPageOrDefault());

        this.replace(window.history.state, route);
    }

    private tryGetPrevPageOrDefault() {
        let page = this.defaultPage;

        let query = new URLSearchParams(window.location.search);

        let samePage = false;

        if (query.has(MODAL_KEY) || query.has(POPUP_KEY)) {

            query.delete(MODAL_KEY);
            query.delete(POPUP_KEY);

            page = window.location.pathname;

            samePage = true;
        }

        let queryUrl = !samePage ? '' : decodeURIComponent(query.toString());

        return page + (queryUrl ? `?${queryUrl}` : '');
    }

    private makeMyRoute(location: string) {
        return MyRoute.fromLocation(
            this.routes,
            location,
            this.alwaysStartWithSlash,
            this.useHash,
        );
    }

    /**
     * Возвращает назад, если состояние не позволяет, то на указанную страницу
     *
     * @param route
     */
    backOrTo(route: string) {
        if (!route) route = this.defaultPage;

        let mayGoBack = this.checkCanGoBack();

        if (mayGoBack) {
            return window.history.back();
        }

        let currentRoute = this.makeMyRoute(this.getCurrentLink());

        let prevRoute = this.makeMyRoute(route);

        this.replace(window.history.state, prevRoute);
        this.push(window.history.state, currentRoute);
        this.back();
    }

    getCurrentLink() {
        return this.useHash
            ? window.location.hash
            : window.location.pathname + window.location.search;
    }

    replacerUnknownRoute: ReplaceUnknownRouteFn = (r) => r;

    start() {
        if (this.started) {
            throw new Error('start method call twice! this is not allowed');
        }

        this.started = true;

        let enterEvent: [ MyRoute, MyRoute | undefined ] | null = null;
        this.startHistoryOffset = window.history.length;
        let nextRoute = this.createRouteFromLocationWithReplace();
        const state = stateFromLocation(this.history.getCurrentIndex());
        state.first = 1;

        if (state.blank === 1) {
            enterEvent = [ nextRoute, this.history.getCurrentRoute() ];
            state.history = [ nextRoute.getPanelId() ];
        }

        this.replace(state, nextRoute);

        window.removeEventListener('popstate', this.onPopState);
        window.addEventListener('popstate', this.onPopState);

        if (enterEvent) {
            this.emit('enter', ...enterEvent);
        }
    }

    stop() {
        this.started = false;
        window.removeEventListener('popstate', this.onPopState);
    }

    getRoute() {
        return this.history.getCurrentRoute();
    }

    getQueryParam(name: string) {
        let urlParams = new URLSearchParams(window.location.search);

        return urlParams.get(name);
    }

    getCurrentRouteOrDef(): MyRoute {
        const r = this.history.getCurrentRoute();
        if (r) {
            return r;
        }
        return this.createRouteFromLocation(this.defaultPage);
    }

    getCurrentStateOrDef(): State {
        const s = this.history.getCurrentState();
        if (s) {
            return { ...s };
        }
        return stateFromLocation(this.history.getCurrentIndex());
    }

    log(...args: any) {
        if (!this.enableLogging) {
            return;
        }
        console.log.apply(this, args);
    }

    compile(pageId: string, params: PageParams = {}) {
        const generator = compile(pageId, { encode: encodeURIComponent });

        return generator(params);
    }

    static matchPath(location: string, pageId: string) {
        return matchPath(location, pageId);
    }

    /**
     * Добавляет новую страницу в историю
     * @param pageId страница указанная в конструкторе {@link Router.constructor}
     * @param params можно получить из {@link Location.getParams}
     */
    pushPage(pageId: string, params: PageParams = {}) {
        this.log(`pushPage ${pageId}`, params);
        Router.checkParams(params);
        let currentRoute = this.getCurrentRouteOrDef();
        let nextRoute = MyRoute.fromPageId(this.routes, pageId, params);
        const s = { ...this.getCurrentStateOrDef() };
        if (currentRoute.getViewId() === nextRoute.getViewId()) {
            s.history = s.history.concat([ nextRoute.getPanelId() ]);
        } else {
            s.history = [ nextRoute.getPanelId() ];
        }
        this.push(s, nextRoute);
    }

    /**
     * Заменяет текущую страницу на переданную
     * @param pageId страница указанная в конструкторе {@link Router.constructor}
     * @param params можно получить из {@link Location.getParams}
     */
    replacePage(pageId: string, params: PageParams = {}) {
        this.log(`replacePage ${pageId}`, params);
        let currentRoute = this.getCurrentRouteOrDef();
        let nextRoute = MyRoute.fromPageId(this.routes, pageId, params);
        const s = { ...this.getCurrentStateOrDef() };
        if (currentRoute.getViewId() === nextRoute.getViewId()) {
            s.history = s.history.concat([]);
            s.history.pop();
            s.history.push(nextRoute.getPanelId());
        } else {
            s.history = [ nextRoute.getPanelId() ];
        }
        this.replace(s, nextRoute);
    }

    pushPageAfterPreviews(prevPageId: string, pageId: string, params: PageParams = {}) {
        this.log('pushPageAfterPreviews', [ prevPageId, pageId, params ]);
        const offset = this.history.getPageOffset(prevPageId);
        if (this.history.canJumpIntoOffset(offset)) {
            return this.popPageToAndPush(offset, pageId, params);
        } else {
            return this.popPageToAndPush(0, pageId, params);
        }
    }

    /**
     * Переход по истории назад
     */
    popPage() {
        this.log('popPage');
        this.back();
    }

    /**
     * Если x - число, то осуществляется переход на указанное количество шагов назад
     * Если x - строка, то в истории будет найдена страница с указанным pageId и осуществлен переход до нее
     * @param {string|number} x
     */
    popPageTo(x: number | string) {
        this.log('popPageTo', x);
        if (typeof x === 'number') {
            this.backTo(x);
        } else {
            const offset = this.history.getPageOffset(x);
            if (this.history.canJumpIntoOffset(offset)) {
                this.backTo(offset);
            } else {
                throw new Error(`Unexpected offset ${offset} then try jump to page ${x}`);
            }
        }
    }

    popPageToAndPush(x: number, pageId: string, params: PageParams = {}) {
        if (x !== 0) {
            this.deferOnGoBack = () => {
                this.pushPage(pageId, params);
            };
            this.backTo(x);
        } else {
            this.pushPage(pageId, params);
        }
    }

    /**
     *  История ломается когда открывается VKPay или пост из колокольчика
     */
    isHistoryBroken(): boolean {
        return window.history.length !== this.history.getLength() + this.startHistoryOffset;
    }

    /**
     * Способ починить историю браузера когда ее сломали снаружи из фрейма
     * например перейдя по колокольчику или открыв вкпей
     */
    fixBrokenHistory() {
        this.history.getHistoryFromStartToCurrent().forEach(([ r, s ]) => {
            window.history.pushState(s, `page=${s.index}`, (this.useHash ? '#' : '') + r.getLocation());
        });
        this.startHistoryOffset = window.history.length - this.history.getLength();
    }

    /**
     * @param modalId
     * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
     */
    pushModal(modalId: string, params: PageParams = {}) {
        Router.checkParams(params);
        this.log(`pushModal ${modalId}`, params);
        let currentRoute = this.getCurrentRouteOrDef();
        const nextRoute = currentRoute.clone().setModalId(modalId).setParams(params);
        this.push(this.getCurrentStateOrDef(), nextRoute);
    }

    /**
     * @param popupId
     * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
     */
    pushPopup(popupId: string, params: PageParams = {}) {
        Router.checkParams(params);
        this.log(`pushPopup ${popupId}`, params);
        let currentRoute = this.getCurrentRouteOrDef();
        const nextRoute = currentRoute.clone().setPopupId(popupId).setParams(params);
        this.push(this.getCurrentStateOrDef(), nextRoute);
    }

    /**
     * @param modalId
     * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
     */
    replaceModal(modalId: string, params: PageParams = {}) {
        this.log(`replaceModal ${modalId}`, params);
        let currentRoute = this.getCurrentRouteOrDef();
        const nextRoute = currentRoute.clone().setModalId(modalId).setParams(params);
        this.replace(this.getCurrentStateOrDef(), nextRoute);
    }

    /**
     * @param popupId
     * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
     */
    replacePopup(popupId: string, params: PageParams = {}) {
        this.log(`replacePopup ${popupId}`, params);
        let currentRoute = this.getCurrentRouteOrDef();
        const nextRoute = currentRoute.clone().setPopupId(popupId).setParams(params);
        this.replace(this.getCurrentStateOrDef(), nextRoute);
    }

    popPageIfModal() {
        let currentRoute = this.getCurrentRouteOrDef();
        if (currentRoute.isModal()) {
            this.log('popPageIfModal');
            this.back();
        }
    }

    popPageIfPopup() {
        let currentRoute = this.getCurrentRouteOrDef();
        if (currentRoute.isPopup()) {
            this.log('popPageIfPopup');
            this.back();
        }
    }

    /**
     * @deprecated use popPageIfHasOverlay
     */
    popPageIfModalOrPopup() {
        let currentRoute = this.getCurrentRouteOrDef();
        if (currentRoute.isPopup() || currentRoute.isModal()) {
            this.log('popPageIfModalOrPopup');
            this.back();
        }
    }

    popPageIfHasOverlay() {
        let currentRoute = this.getCurrentRouteOrDef();
        if (currentRoute.hasOverlay()) {
            this.log('popPageIfHasOverlay');
            this.back();
        }
    }

    /**
     * @param pageId
     * @param fn
     * @return unsubscribe function
     */
    onEnterPage(pageId: string, fn: UpdateEventFn): () => void {
        const _fn = (newRoute: MyRoute, oldRoute: MyRoute | undefined, isNewRoute: boolean, type: HistoryUpdateType) => {
            if (newRoute.pageId === pageId) {
                if (!newRoute.hasOverlay()) {
                    fn(newRoute, oldRoute, isNewRoute, type);
                }
            }
        };

        this.on('update', _fn);
        return () => {
            this.off('update', _fn);
        };
    }

    /**
     * @param pageId
     * @param fn
     * @return unsubscribe function
     */
    onLeavePage(pageId: string, fn: LeaveEventFn): () => void {
        const _fn = (newRoute: MyRoute, oldRoute: MyRoute | undefined, isNewRoute: boolean, type: HistoryUpdateType) => {
            if (oldRoute && oldRoute.pageId === pageId) {
                if (!oldRoute.hasOverlay()) {
                    fn(newRoute, oldRoute, isNewRoute, type);
                }
            }
        };

        this.on('update', _fn);
        return () => {
            this.off('update', _fn);
        };
    }

    getCurrentLocation(): Location {
        return new Location(this.getCurrentRouteOrDef(), this.getCurrentStateOrDef());
    }

    getPreviousLocation(): Location | undefined {
        const history = this.history.getHistoryItem(-1);
        if (history) {
            const [ route, state ] = history;
            return new Location(route, { ...state });
        }
        return undefined;
    }

    /**
     * @param safety - true будет ждать события не дольше 700мс, если вы уверены что надо ждать дольше передайте false
     */
    afterUpdate(safety = true): Promise<void> {
        return new Promise((resolve) => {
            let t = 0;
            const fn = () => {
                clearTimeout(t);
                this.off('update', fn);
                resolve();
            };
            this.on('update', fn);
            if (safety) {
                // На случай когда метод ошибочно используется не после popPage
                // чтобы не завис навечно
                t = setTimeout(fn, 700) as any as number;
            }
        });
    }

    private static checkParams(params: PageParams) {
        if (params.hasOwnProperty(POPUP_KEY)) {
            if (Router.isErrorThrowingEnabled()) {
                throw new Error(`pushPage with key [${POPUP_KEY}]:${params[POPUP_KEY]} is not allowed use another key`);
            }
        }
        if (params.hasOwnProperty(MODAL_KEY)) {
            if (Router.isErrorThrowingEnabled()) {
                throw new Error(`pushPage with key [${MODAL_KEY}]:${params[MODAL_KEY]} is not allowed use another key`);
            }
        }
    }

    private getNotFoundRoute(location: string, params: PageParams) {
        try {
            return this.makeMyRoute(
                this.notFoundRoute + `?location=${location}&params=${qs.stringify(params)}`
            );
        } catch (e: any) {
            if (e && e.message === 'ROUTE_NOT_FOUND') {
                return new MyRoute(
                    new Page(this.defaultPanel, this.defaultView),
                    this.defaultPage,
                    params,
                );
            }
            throw e;
        }
    }

    private readonly onPopState = () => {
        let nextRoute = this.createRouteFromLocationWithReplace();
        const state = stateFromLocation(this.history.getCurrentIndex());
        let enterEvent: [ MyRoute, MyRoute | undefined ] | null = null;
        let updateEvent: UpdateEventType | null = null;
        if (state.blank === 1) {
            // Пустое состояние бывает когда приложение восстанавливают из кеша с другим хешом
            // такое состояние помечаем как первая страница
            state.first = 1;
            state.index = this.history.getCurrentIndex();
            state.history = [ nextRoute.getPanelId() ];
            enterEvent = [ nextRoute, this.history.getCurrentRoute() ];
            updateEvent = this.history.push(nextRoute, state);
            window.history.replaceState(state, `page=${state.index}`, (this.useHash ? '#' : '') + nextRoute.getLocation());
        } else {
            updateEvent = this.history.setCurrentIndex(state.index);
        }

        if (this.deferOnGoBack) {
            this.log('onPopStateInDefer');
            this.deferOnGoBack();
            this.deferOnGoBack = null;
            return;
        }

        this.log('onPopState', [ nextRoute, this.history.getCurrentRoute(), state ]);

        if (enterEvent) {
            this.emit('enter', ...enterEvent);
        }
        if (updateEvent) {
            this.emit('update', ...updateEvent);
        }
    };

    private replace(state: State, nextRoute: MyRoute) {
        state.length = window.history.length;
        state.index = this.history.getCurrentIndex();
        state.blank = 0;
        const updateEvent = this.history.replace(nextRoute, state);
        window.history.replaceState(state, `page=${state.index}`, (this.useHash ? '#' : '') + nextRoute.getLocation());
        preventBlinkingBySettingScrollRestoration();

        this.emit('update', ...updateEvent);
    }

    private push(state: State, nextRoute: MyRoute) {
        state.length = window.history.length;
        state.blank = 0;
        state.first = 0;
        let updateEvent = this.history.push(nextRoute, state);
        state.index = this.history.getCurrentIndex();
        window.history.pushState(state, `page=${state.index}`, (this.useHash ? '#' : '') + nextRoute.getLocation());
        preventBlinkingBySettingScrollRestoration();

        this.emit('update', ...updateEvent);
    }

    private createRouteFromLocationWithReplace() {
        const location = this.getCurrentLink();

        try {
            return this.makeMyRoute(location);
        } catch (e: any) {
            if (e && e.message === 'ROUTE_NOT_FOUND') {
                const def = this.getNotFoundRoute(location, MyRoute.getParamsFromPath(location));
                return this.replacerUnknownRoute(def, this.history.getCurrentRoute());
            }
            throw e;
        }
    }

    private createRouteFromLocation(location: string): MyRoute {
        try {
            return this.makeMyRoute(location);
        } catch (e: any) {
            if (e && e.message === 'ROUTE_NOT_FOUND') {
                return this.getNotFoundRoute(location, MyRoute.getParamsFromPath(location));
            }
            throw e;
        }
    }

    private static isErrorThrowingEnabled() {
        return process.env.NODE_ENV !== 'production';
    }

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
    public getInfinityPanelList(viewId: string): string[] {
        const list = this.getCurrentLocation().getViewHistoryWithLastPanel(viewId);
        const oldList = this.infinityPanelCacheInstance.get(viewId) || [];
        const mergedList = Array.from(new Set(list.concat(oldList)));
        mergedList.sort((a, b) => {
            const [ , xa ] = a.split('..');
            const [ , xb ] = b.split('..');
            return Number(xa) - Number(xb);
        });
        this.infinityPanelCacheInstance.set(viewId, mergedList);
        return mergedList;
    }
}
