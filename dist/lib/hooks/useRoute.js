/**
 * @ignore
 * @packageDocumentation
 */
import { useLocation } from '../..';
/**
 * @param withUpdate
 * @param panelId
 * @deprecated useRouter
 * @ignore
 */
export function useRoute(withUpdate = true, panelId) {
    const location = useLocation(withUpdate, panelId);
    return location.route;
}
