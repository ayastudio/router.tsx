/**
 * @ignore
 * @packageDocumentation
 */
let randomIdForCheckState = `${Math.random() * 2000000}.${Date.now()}`;
/**
 * Используется для тестов где не сбрасывается состояние jsdom
 * @ignore
 */
export function __testResetHistoryUniqueId() {
    randomIdForCheckState = `${Math.random() * 2000000}.${Date.now()}`;
}
/**
 * @ignore
 * @param currentIndex
 */
export function stateFromLocation(currentIndex) {
    const state = window.history.state;
    if (state && typeof state === 'object') {
        const s = state;
        if (s.i === randomIdForCheckState) {
            return Object.assign({}, s);
        }
    }
    return {
        blank: 1,
        first: 0,
        length: window.history.length,
        index: currentIndex,
        history: [],
        i: randomIdForCheckState,
        panelInView: {},
    };
}
