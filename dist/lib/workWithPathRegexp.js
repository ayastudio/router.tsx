/**
 * @ignore
 * @packageDocumentation
 */
import * as ptr from 'path-to-regexp';
import * as qs from 'querystring';
const cache = new Map();
const cacheLimit = 10000;
let cacheCount = 0;
function parsePath(pageId) {
    const cached = cache.get(pageId);
    if (cached) {
        return cached;
    }
    const tokens = ptr.parse(pageId);
    const generator = ptr.tokensToFunction(tokens);
    if (cacheCount < cacheLimit) {
        cache.set(pageId, [generator, tokens]);
        cacheCount++;
    }
    return [generator, tokens];
}
const convertCache = new Map();
function convertPath(path, options) {
    const cacheKey = `${(options === null || options === void 0 ? void 0 : options.end) ? '1' : '0'}${options === null || options === void 0 ? void 0 : options.strict}${options === null || options === void 0 ? void 0 : options.sensitive}${path}`;
    const pathCache = convertCache.get(cacheKey);
    if (pathCache) {
        return pathCache;
    }
    const keys = [];
    const regexp = ptr.pathToRegexp(path, keys);
    const result = { regexp, keys };
    if (cacheCount < cacheLimit) {
        convertCache.set(cacheKey, result);
        cacheCount++;
    }
    return result;
}
/**
 * Создание пути из шаблона
 * @param pageId /user/:id
 * @param params {id:5,name:Ivan}
 * @return {string} /user/5?name=Ivan
 * @ignore
 */
export function generatePath(pageId, params) {
    if (!params) {
        params = {};
    }
    params = Object.assign({}, params);
    const [generatePath, tokens] = parsePath(pageId);
    const path = generatePath(params);
    const restParams = Object.assign({}, params);
    tokens.forEach((t) => {
        if (typeof t === 'object') {
            delete restParams[t.name.toString()];
        }
    });
    const result = `${path}?${qs.stringify(restParams)}`;
    return result.replace(/\?$/gmu, '');
}
/**
 * Проверка что строка удовлетворяет шаблону
 * @param location /user/5
 * @param pageId /user/:id([0-9]+)
 * @ignore
 */
export function matchPath(location, pageId) {
    const { regexp, keys } = convertPath(pageId, {
        end: false,
        strict: false,
        sensitive: false,
    });
    let match = regexp.exec(location);
    if (!match) {
        return null;
    }
    const [url, ...values] = match;
    const isExact = location === url;
    return {
        path: pageId,
        url: pageId === '/' && url === '' ? '/' : url,
        isExact,
        params: keys.reduce((memo, key, index) => {
            if (typeof key === 'object') {
                memo[key.name] = values[index];
            }
            return memo;
        }, {}),
    };
}
