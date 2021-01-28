import { Page } from './Page';
import { History } from './History';
import { MODAL_KEY, POPUP_KEY, Route as MyRoute } from './Route';
import { preventBlinkingBySettingScrollRestoration } from '../tools';
import { stateFromLocation } from './State';
import { EventEmitter } from 'tsee';
import { PAGE_MAIN, PANEL_MAIN, VIEW_MAIN } from '../const';
import { Location } from './Location';
export class Router extends EventEmitter {
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
    constructor(routes, routerConfig = null) {
        super();
        this.routes = {};
        this.enableLogging = false;
        this.defaultPage = PAGE_MAIN;
        this.defaultView = VIEW_MAIN;
        this.defaultPanel = PANEL_MAIN;
        this.alwaysStartWithSlash = true;
        this.deferOnGoBack = null;
        this.startHistoryOffset = 0;
        this.started = false;
        this.infinityPanelCacheInstance = new Map();
        this.useHash = false;
        this.replacerUnknownRoute = (r) => r;
        this.onPopState = () => {
            let nextRoute = this.createRouteFromLocationWithReplace();
            const state = stateFromLocation(this.history.getCurrentIndex());
            let enterEvent = null;
            let updateEvent = null;
            if (state.blank === 1) {
                // Пустое состояние бывает когда приложение восстанавливают из кеша с другим хешом
                // такое состояние помечаем как первая страница
                state.first = 1;
                state.index = this.history.getCurrentIndex();
                state.history = [nextRoute.getPanelId()];
                enterEvent = [nextRoute, this.history.getCurrentRoute()];
                updateEvent = this.history.push(nextRoute, state);
                window.history.replaceState(state, `page=${state.index}`, (this.useHash ? '#' : '') + nextRoute.getLocation());
            }
            else {
                updateEvent = this.history.setCurrentIndex(state.index);
            }
            if (this.deferOnGoBack) {
                this.log('onPopStateInDefer');
                this.deferOnGoBack();
                this.deferOnGoBack = null;
                return;
            }
            this.log('onPopState', [nextRoute, this.history.getCurrentRoute(), state]);
            if (enterEvent) {
                this.emit('enter', ...enterEvent);
            }
            if (updateEvent) {
                this.emit('update', ...updateEvent);
            }
        };
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
        }
    }
    static back() {
        window.history.back();
    }
    static backTo(x) {
        window.history.go(x);
    }
    start() {
        if (this.started) {
            throw new Error('start method call twice! this is not allowed');
        }
        this.started = true;
        let enterEvent = null;
        this.startHistoryOffset = window.history.length;
        let nextRoute = this.createRouteFromLocationWithReplace();
        const state = stateFromLocation(this.history.getCurrentIndex());
        state.first = 1;
        if (state.blank === 1) {
            enterEvent = [nextRoute, this.history.getCurrentRoute()];
            state.history = [nextRoute.getPanelId()];
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
    getCurrentRouteOrDef() {
        const r = this.history.getCurrentRoute();
        if (r) {
            return r;
        }
        return this.createRouteFromLocation(this.defaultPage);
    }
    getCurrentStateOrDef() {
        const s = this.history.getCurrentState();
        if (s) {
            return Object.assign({}, s);
        }
        return stateFromLocation(this.history.getCurrentIndex());
    }
    log(...args) {
        if (!this.enableLogging) {
            return;
        }
        console.log.apply(this, args);
    }
    /**
     * Добавляет новую страницу в историю
     * @param pageId страница указанная в конструкторе {@link Router.constructor}
     * @param params можно получить из {@link Location.getParams}
     */
    pushPage(pageId, params = {}) {
        this.log(`pushPage ${pageId}`, params);
        Router.checkParams(params);
        let currentRoute = this.getCurrentRouteOrDef();
        let nextRoute = MyRoute.fromPageId(this.routes, pageId, params);
        const s = Object.assign({}, this.getCurrentStateOrDef());
        if (currentRoute.getViewId() === nextRoute.getViewId()) {
            s.history = s.history.concat([nextRoute.getPanelId()]);
        }
        else {
            s.history = [nextRoute.getPanelId()];
        }
        this.push(s, nextRoute);
    }
    /**
     * Заменяет текущую страницу на переданную
     * @param pageId страница указанная в конструкторе {@link Router.constructor}
     * @param params можно получить из {@link Location.getParams}
     */
    replacePage(pageId, params = {}) {
        this.log(`replacePage ${pageId}`, params);
        let currentRoute = this.getCurrentRouteOrDef();
        let nextRoute = MyRoute.fromPageId(this.routes, pageId, params);
        const s = Object.assign({}, this.getCurrentStateOrDef());
        if (currentRoute.getViewId() === nextRoute.getViewId()) {
            s.history = s.history.concat([]);
            s.history.pop();
            s.history.push(nextRoute.getPanelId());
        }
        else {
            s.history = [nextRoute.getPanelId()];
        }
        this.replace(s, nextRoute);
    }
    pushPageAfterPreviews(prevPageId, pageId, params = {}) {
        this.log('pushPageAfterPreviews', [prevPageId, pageId, params]);
        const offset = this.history.getPageOffset(prevPageId);
        if (this.history.canJumpIntoOffset(offset)) {
            return this.popPageToAndPush(offset, pageId, params);
        }
        else {
            return this.popPageToAndPush(0, pageId, params);
        }
    }
    /**
     * Переход по истории назад
     */
    popPage() {
        this.log('popPage');
        Router.back();
    }
    /**
     * Если x - число, то осуществляется переход на указанное количество шагов назад
     * Если x - строка, то в истории будет найдена страница с указанным pageId и осуществлен переход до нее
     * @param {string|number} x
     */
    popPageTo(x) {
        this.log('popPageTo', x);
        if (typeof x === 'number') {
            Router.backTo(x);
        }
        else {
            const offset = this.history.getPageOffset(x);
            if (this.history.canJumpIntoOffset(offset)) {
                Router.backTo(offset);
            }
            else {
                throw new Error(`Unexpected offset ${offset} then try jump to page ${x}`);
            }
        }
    }
    popPageToAndPush(x, pageId, params = {}) {
        if (x !== 0) {
            this.deferOnGoBack = () => {
                this.pushPage(pageId, params);
            };
            Router.backTo(x);
        }
        else {
            this.pushPage(pageId, params);
        }
    }
    /**
     *  История ломается когда открывается VKPay или пост из колокольчика
     */
    isHistoryBroken() {
        return window.history.length !== this.history.getLength() + this.startHistoryOffset;
    }
    /**
     * Способ починить историю браузера когда ее сломали снаружи из фрейма
     * например перейдя по колокольчику или открыв вкпей
     */
    fixBrokenHistory() {
        this.history.getHistoryFromStartToCurrent().forEach(([r, s]) => {
            window.history.pushState(s, `page=${s.index}`, (this.useHash ? '#' : '') + r.getLocation());
        });
        this.startHistoryOffset = window.history.length - this.history.getLength();
    }
    /**
     * @param modalId
     * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
     */
    pushModal(modalId, params = {}) {
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
    pushPopup(popupId, params = {}) {
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
    replaceModal(modalId, params = {}) {
        this.log(`replaceModal ${modalId}`, params);
        let currentRoute = this.getCurrentRouteOrDef();
        const nextRoute = currentRoute.clone().setModalId(modalId).setParams(params);
        this.replace(this.getCurrentStateOrDef(), nextRoute);
    }
    /**
     * @param popupId
     * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
     */
    replacePopup(popupId, params = {}) {
        this.log(`replacePopup ${popupId}`, params);
        let currentRoute = this.getCurrentRouteOrDef();
        const nextRoute = currentRoute.clone().setPopupId(popupId).setParams(params);
        this.replace(this.getCurrentStateOrDef(), nextRoute);
    }
    popPageIfModal() {
        let currentRoute = this.getCurrentRouteOrDef();
        if (currentRoute.isModal()) {
            this.log('popPageIfModal');
            Router.back();
        }
    }
    popPageIfPopup() {
        let currentRoute = this.getCurrentRouteOrDef();
        if (currentRoute.isPopup()) {
            this.log('popPageIfPopup');
            Router.back();
        }
    }
    /**
     * @deprecated use popPageIfHasOverlay
     */
    popPageIfModalOrPopup() {
        let currentRoute = this.getCurrentRouteOrDef();
        if (currentRoute.isPopup() || currentRoute.isModal()) {
            this.log('popPageIfModalOrPopup');
            Router.back();
        }
    }
    popPageIfHasOverlay() {
        let currentRoute = this.getCurrentRouteOrDef();
        if (currentRoute.hasOverlay()) {
            this.log('popPageIfHasOverlay');
            Router.back();
        }
    }
    /**
     * @param pageId
     * @param fn
     * @return unsubscribe function
     */
    onEnterPage(pageId, fn) {
        const _fn = (newRoute, oldRoute, isNewRoute, type) => {
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
    onLeavePage(pageId, fn) {
        const _fn = (newRoute, oldRoute, isNewRoute, type) => {
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
    getCurrentLocation() {
        return new Location(this.getCurrentRouteOrDef(), this.getCurrentStateOrDef());
    }
    getPreviousLocation() {
        const history = this.history.getHistoryItem(-1);
        if (history) {
            const [route, state] = history;
            return new Location(route, Object.assign({}, state));
        }
        return undefined;
    }
    /**
     * @param safety - true будет ждать события не дольше 700мс, если вы уверены что надо ждать дольше передайте false
     */
    afterUpdate(safety = true) {
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
                t = setTimeout(fn, 700);
            }
        });
    }
    static checkParams(params) {
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
    getDefaultRoute(location, params) {
        try {
            return MyRoute.fromLocation(this.routes, '/', this.alwaysStartWithSlash);
        }
        catch (e) {
            if (e && e.message === 'ROUTE_NOT_FOUND') {
                return new MyRoute(new Page(this.defaultPanel, this.defaultView), this.defaultPage, params);
            }
            throw e;
        }
    }
    replace(state, nextRoute) {
        state.length = window.history.length;
        state.index = this.history.getCurrentIndex();
        state.blank = 0;
        const updateEvent = this.history.replace(nextRoute, state);
        window.history.replaceState(state, `page=${state.index}`, (this.useHash ? '#' : '') + nextRoute.getLocation());
        preventBlinkingBySettingScrollRestoration();
        this.emit('update', ...updateEvent);
    }
    push(state, nextRoute) {
        state.length = window.history.length;
        state.blank = 0;
        state.first = 0;
        let updateEvent = this.history.push(nextRoute, state);
        state.index = this.history.getCurrentIndex();
        window.history.pushState(state, `page=${state.index}`, (this.useHash ? '#' : '') + nextRoute.getLocation());
        preventBlinkingBySettingScrollRestoration();
        this.emit('update', ...updateEvent);
    }
    createRouteFromLocationWithReplace() {
        const location = this.useHash ? window.location.hash : window.location.pathname;
        try {
            return MyRoute.fromLocation(this.routes, location, this.alwaysStartWithSlash);
        }
        catch (e) {
            if (e && e.message === 'ROUTE_NOT_FOUND') {
                const def = this.getDefaultRoute(location, MyRoute.getParamsFromPath(location));
                return this.replacerUnknownRoute(def, this.history.getCurrentRoute());
            }
            throw e;
        }
    }
    createRouteFromLocation(location) {
        try {
            return MyRoute.fromLocation(this.routes, location, this.alwaysStartWithSlash);
        }
        catch (e) {
            if (e && e.message === 'ROUTE_NOT_FOUND') {
                return this.getDefaultRoute(location, MyRoute.getParamsFromPath(location));
            }
            throw e;
        }
    }
    static isErrorThrowingEnabled() {
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
    getInfinityPanelList(viewId) {
        const list = this.getCurrentLocation().getViewHistoryWithLastPanel(viewId);
        const oldList = this.infinityPanelCacheInstance.get(viewId) || [];
        const mergedList = Array.from(new Set(list.concat(oldList)));
        mergedList.sort((a, b) => {
            const [, xa] = a.split('..');
            const [, xb] = b.split('..');
            return Number(xa) - Number(xb);
        });
        this.infinityPanelCacheInstance.set(viewId, mergedList);
        return mergedList;
    }
}
