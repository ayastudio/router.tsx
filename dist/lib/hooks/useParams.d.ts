import { PageParams } from '../..';
/**
 * Возвращает {@link PageParams} текущего {@link Location}
 * если передать panelId то можно получить правильные параметры для "предыдущей" панели во время жеста swipe back
 * https://github.com/HappySanta/router/issues/16
 * @param {string} panelId id панели для которой надо получить параметры
 */
export declare function useParams(panelId?: string): PageParams;
