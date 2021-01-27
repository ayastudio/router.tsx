import { ComponentType } from 'react';
import { Location, PageParams, Route, Router, State } from '../..';
export interface RouterProps {
    /**
     * @deprecated
     */
    routeState: State;
    /**
     * @deprecated
     */
    route: Route;
    router: Router;
    location: Location;
}
export interface RouterParams {
    params: PageParams;
}
/**
 * @deprecated use RouterProps
 */
export declare type SantaRouterProps = RouterProps;
/**
 * @deprecated use withRouter
 * @ignore
 */
export declare function withSantaRouter<T>(Component: ComponentType<RouterProps & T>): ComponentType<T>;
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
export declare function withRouter<T>(Component: ComponentType<RouterProps & T>, withUpdate?: boolean): ComponentType<T>;
