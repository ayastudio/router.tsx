import { Location } from '../..';
/**
 * хук для обхода решения проблемы с слишком частой сменой панелей/попапов/модалок
 * которая может приводить к зависанию всего приложения
 *
 * работает аналогично {@link useLocation} возвращяет функцию onTransitionEnd котору надо вызывать в колбеках onTransition компонента View
 *
 */
export declare function useThrottlingLocation(): [Location, () => void];
