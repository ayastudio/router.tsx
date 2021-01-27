import { ComponentType } from 'react';
import { RouterParams } from '../..';
/**
 * HOC для добавления
 * params:{@link PageParams}
 * в компонент
 * параметры не обновляются при переходах по страницам
 * @param Component
 * @param panelId если true, то из props будет взято свойство id для передачи в {@link useParams}, если строка то она будет передана
 */
export declare function withParams<T>(Component: ComponentType<RouterParams & T>, panelId?: string | boolean): ComponentType<T>;
