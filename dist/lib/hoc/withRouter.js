import React from 'react';
import { useRouter } from '../..';
import { getDisplayName } from '../tools';
/**
 * @deprecated use withRouter
 * @ignore
 */
export function withSantaRouter(Component) {
    return withRouter(Component);
}
/**
 * HOC для добавления свойств
 *
 * location:{@link Location}
 * router:{@link Router}
 *
 * в переданный компонент
 *
 * ```typescript
 * export default withRouter(App);
 * ```
 * @param Component
 * @param withUpdate true - обновлять изменении при изменении location false - не обновлять
 */
export function withRouter(Component, withUpdate = true) {
    function WithRouter(props) {
        const router = useRouter(withUpdate);
        return React.createElement(Component, Object.assign({}, props, { router: router, location: router.getCurrentLocation(), routeState: router.getCurrentStateOrDef(), route: router.getCurrentRouteOrDef() }));
    }
    WithRouter.displayName = `WithRouter(${getDisplayName(Component)})`;
    return WithRouter;
}
