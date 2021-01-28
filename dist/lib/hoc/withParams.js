import React from 'react';
import { useParams } from '../..';
import { getDisplayName } from '../tools';
/**
 * HOC для добавления
 * params:{@link PageParams}
 * в компонент
 * параметры не обновляются при переходах по страницам
 * @param Component
 * @param panelId если true, то из props будет взято свойство id для передачи в {@link useParams}, если строка то она будет передана
 */
export function withParams(Component, panelId = false) {
    function WithParams(props) {
        let proxyPanelId = undefined;
        if (typeof panelId === 'string') {
            proxyPanelId = panelId;
        }
        else if (panelId) {
            const p = props;
            if (p && p.id) {
                proxyPanelId = p.id;
            }
        }
        const params = useParams(proxyPanelId);
        return React.createElement(Component, Object.assign({}, props, { params: params }));
    }
    WithParams.displayName = `WithParams(${getDisplayName(Component)})`;
    return WithParams;
}
