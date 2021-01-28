/**
 * Эти функции будут работать после вызова {@link setGlobalRouter}
 * @packageDocumentation
 */
import { Router } from './entities/Router';
import { __testResetHistoryUniqueId } from './entities/State';
let globalRouter = null;
/**
 * @ignore
 * @param routes
 * @param config
 */
export function startGlobalRouter(routes, config = null) {
    if (globalRouter) {
        throw new Error('startGlobalRouter called twice is not allowed');
    }
    globalRouter = new Router(routes, config);
    globalRouter.start();
    return globalRouter;
}
export function getGlobalRouter() {
    if (!globalRouter) {
        throw new Error('getGlobalRouter called before startGlobalRouter');
    }
    return globalRouter;
}
export function setGlobalRouter(router) {
    globalRouter = router;
}
/**
 * @ignore
 */
export function dangerousResetGlobalRouterUseForTestOnly() {
    if (globalRouter) {
        globalRouter.stop();
        window.history.pushState(null, '', '');
    }
    if (window.history.state) {
        window.history.pushState(null, '', '');
    }
    __testResetHistoryUniqueId();
    globalRouter = null;
}
export function pushPage(pageId, params = {}) {
    return getGlobalRouter().pushPage(pageId, params);
}
export function replacePage(pageId, params = {}) {
    return getGlobalRouter().replacePage(pageId, params);
}
export function popPage() {
    return getGlobalRouter().popPage();
}
export function pushModal(modalId, params = {}) {
    return getGlobalRouter().pushModal(modalId, params);
}
export function pushPopup(popupId, params = {}) {
    return getGlobalRouter().pushPopup(popupId, params);
}
export function replaceModal(modalId, params = {}) {
    return getGlobalRouter().replaceModal(modalId, params);
}
export function replacePopout(popupId, params = {}) {
    return getGlobalRouter().replacePopup(popupId, params);
}
export function popPageTo(x) {
    return getGlobalRouter().popPageTo(x);
}
/**
 * @deprecated use popPageIfHasOverlay
 */
export function popPageIfModalOrPopup() {
    return getGlobalRouter().popPageIfModalOrPopup();
}
export function popPageIfHasOverlay() {
    return getGlobalRouter().popPageIfHasOverlay();
}
export function pushPageAfterPreviews(prevPageId, pageId, params = {}) {
    return getGlobalRouter().pushPageAfterPreviews(prevPageId, pageId, params);
}
/**
 * @deprecated getCurrentStateOrDef
 * @ignore
 */
export function getCurrentRouterState() {
    return getCurrentStateOrDef();
}
export function getCurrentStateOrDef() {
    return getGlobalRouter().getCurrentStateOrDef();
}
/**
 * @deprecated getCurrentRouteOrDef
 * @ignore
 */
export function getCurrentRoute() {
    return getCurrentRouteOrDef();
}
export function getCurrentRouteOrDef() {
    return getGlobalRouter().getCurrentRouteOrDef();
}
export function isInfinityPanel(panelId) {
    // see Route.getPanelId
    return !!panelId && panelId.startsWith('_');
}
export function getInfinityPanelId(panelId) {
    // see Route.getPanelId
    return (panelId.split('..').shift() || '').replace('_', '');
}
