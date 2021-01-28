import React from 'react';
import { useRouter, useThrottlingLocation } from '../..';
import { getDisplayName } from '../tools';
/**
 * Смотри описание {@link useThrottlingLocation}
 * @param Component
 */
export function withThrottlingRouter(Component) {
    function WithThrottlingRouter(props) {
        const router = useRouter(false);
        const [location, onTransitionEnd] = useThrottlingLocation();
        return React.createElement(Component, Object.assign({}, props, { router: router, onTransitionEnd: onTransitionEnd, routeState: location.state, location: location, route: location.route }));
    }
    WithThrottlingRouter.displayName = `WithThrottlingRouter(${getDisplayName(Component)})`;
    return WithThrottlingRouter;
}
