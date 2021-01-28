import { useRouter } from '../..';
import { useRef } from 'react';
/**
 * @param withUpdate
 * @param {string} panelId id панели для которой надо получить Location
 */
export function useLocation(withUpdate = true, panelId) {
    var _a;
    const router = useRouter(withUpdate);
    const cachedLocation = useRef(router.getCurrentLocation());
    const prevLocation = useRef(router.getPreviousLocation());
    if (withUpdate) {
        const curLocation = router.getCurrentLocation();
        const prevLocation = router.getPreviousLocation();
        if (panelId && (prevLocation === null || prevLocation === void 0 ? void 0 : prevLocation.getPanelId()) === panelId) {
            return prevLocation;
        }
        return curLocation;
    }
    else {
        if (panelId && ((_a = prevLocation.current) === null || _a === void 0 ? void 0 : _a.getPanelId()) === panelId) {
            return prevLocation.current;
        }
        return cachedLocation.current;
    }
}
