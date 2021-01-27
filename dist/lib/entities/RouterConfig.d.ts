export interface RouterConfig {
    /** Тип роутинга: false - обычный роутинг, true - хэш-роутинг */
    useHash: boolean;
    /** Логи для отладки переходов */
    enableLogging?: boolean;
    defaultPage?: string;
    defaultView?: string;
    defaultPanel?: string;
    /**
     * Добавление слэша перед хэшем (для обычного роутинга всегда используйте true)
     * vk.com/app123#product/123 и
     * vk.com/app123#/product/123
     */
    noSlash?: boolean;
}
