import { generatePath, matchPath } from '../workWithPathRegexp';
import * as qs from 'querystring';
/**
 * @ignore
 */
export const POPUP_KEY = 'p';
/**
 * @ignore
 */
export const MODAL_KEY = 'm';
let routeUniqueId = 1;
function getNextUniqId() {
    return routeUniqueId++;
}
export class Route {
    constructor(structure, pageId, params) {
        this.params = {};
        this.structure = structure;
        this.pageId = pageId;
        this.params = params;
        this.uniqId = getNextUniqId();
    }
    static getParamsFromPath(location) {
        return location.includes('?')
            ? qs.parse(location.split('?', 2)[1])
            : {};
    }
    /**
     * @param {RouteList} routeList
     * @param location "info?w=about&show=1" то, что лежит в window.location.hash
     * @param noSlash
     */
    static fromLocation(routeList, location, noSlash = true) {
        const params = Route.getParamsFromPath(location);
        location = location.replace('#', '');
        if (noSlash && location.length && !location.startsWith('/')) {
            location = `/${location}`;
        }
        if (noSlash && !location.length) {
            location = `/${location}`;
        }
        location = location.split('?', 2).shift() || (noSlash ? '/' : '');
        let match = null;
        for (let pageId in routeList) {
            if (routeList.hasOwnProperty(pageId)) {
                match = matchPath(location, pageId);
                if (match && match.isExact) {
                    break;
                }
            }
        }
        if (!match) {
            throw new Error('ROUTE_NOT_FOUND');
        }
        const ps = routeList[match.path];
        if (!ps) {
            throw new Error(`Router fail: cant find structure in routes for ${location}`);
        }
        return new Route(ps, match.path, Object.assign(Object.assign({}, params), match.params));
    }
    static fromPageId(routeList, pageId, params) {
        const ps = routeList[pageId];
        if (!ps) {
            throw new Error(`Router fail: cant find structure in routes for ${pageId}`);
        }
        return new Route(ps, pageId, params || {});
    }
    clone() {
        const copy = new Route(this.structure.clone(), this.pageId, Object.assign({}, this.params));
        copy.uniqId = this.uniqId;
        return copy;
    }
    getLocation() {
        return generatePath(this.pageId, this.params);
    }
    getPageId() {
        return this.pageId;
    }
    getPanelId() {
        if (this.structure.isInfinityPanel) {
            return `_${this.structure.panelId}..${String(this.uniqId)}`;
        }
        return this.structure.panelId;
    }
    getPanelIdWithoutInfinity() {
        return this.structure.panelId;
    }
    getViewId() {
        return this.structure.viewId;
    }
    getParams() {
        return this.params;
    }
    setParams(params = {}) {
        this.params = Object.assign(Object.assign({}, this.params), params);
        return this;
    }
    isPopup() {
        return !!this.getPopupId();
    }
    getPopupId() {
        var _a;
        return ((_a = this.params[POPUP_KEY]) === null || _a === void 0 ? void 0 : _a.toString()) || null;
    }
    setPopupId(popupId) {
        this.params[POPUP_KEY] = popupId;
        return this;
    }
    isModal() {
        return !!this.getModalId();
    }
    hasOverlay() {
        return this.isModal() || this.isPopup();
    }
    getModalId() {
        var _a;
        return ((_a = this.params[MODAL_KEY]) === null || _a === void 0 ? void 0 : _a.toString()) || null;
    }
    setModalId(modalId) {
        this.params[MODAL_KEY] = modalId;
        return this;
    }
    out() {
        // $TSFixMe
    }
    in() {
        // $TSFixMe
    }
}
