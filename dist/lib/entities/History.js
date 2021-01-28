/**
 * @ignore
 * @packageDocumentation
 */
/**
 * @ignore
 */
export const HISTORY_UPDATE_PUSH = 'PUSH';
/**
 * @ignore
 */
export const HISTORY_UPDATE_REPLACE = 'REPLACE';
/**
 * @ignore
 */
export const HISTORY_UPDATE_MOVE = 'MOVE';
/**
 * @ignore
 */
export class History {
    constructor() {
        this.stack = [];
        this.currentIndex = 0;
        this.setLastPanelInView = (next, prev) => {
            const state = this.getCurrentState();
            if (!state) {
                return;
            }
            state.panelInView = Object.assign(Object.assign({}, state.panelInView), { [next.getViewId()]: next.getPanelId() });
            if (prev) {
                state.panelInView = Object.assign(Object.assign({}, state.panelInView), { [prev.getViewId()]: prev.getPanelId() });
            }
        };
    }
    push(r, s) {
        const current = this.getCurrentRoute();
        if (this.getCurrentIndex() !== this.getLength() - 1) {
            // Пуш после отката назад, в этом случае вся история "впереди" удаляется
            this.stack = this.stack.slice(0, this.getCurrentIndex() + 1);
        }
        this.stack.push([r, s]);
        this.currentIndex = this.stack.length - 1;
        const next = this.getCurrentRoute();
        current === null || current === void 0 ? void 0 : current.out();
        next === null || next === void 0 ? void 0 : next.in();
        if (next) {
            this.setLastPanelInView(next, current);
            return [next, current, true, HISTORY_UPDATE_PUSH];
        }
        else {
            // Если мы только что запушили новое состояние то оно никак не может оказаться пустым
            // если оказалось то что-то не так
            throw new Error('Impossible error on push state, next state is empty!');
        }
    }
    replace(r, s) {
        const current = this.getCurrentRoute();
        this.stack[this.currentIndex] = [r, s];
        const next = this.getCurrentRoute();
        current === null || current === void 0 ? void 0 : current.out();
        next === null || next === void 0 ? void 0 : next.in();
        if (next) {
            this.setLastPanelInView(next, current);
            return [next, current, true, HISTORY_UPDATE_REPLACE];
        }
        else {
            // Если мы только что заменили состояние то оно никак не может оказаться пустым
            // если оказалось то что-то не так
            throw new Error('Impossible error on replace state, next state is empty!');
        }
    }
    setCurrentIndex(x) {
        const current = this.getCurrentRoute();
        this.currentIndex = x;
        const next = this.getCurrentRoute();
        current === null || current === void 0 ? void 0 : current.out();
        next === null || next === void 0 ? void 0 : next.in();
        if (next) {
            this.setLastPanelInView(next, current);
            return [next, current, false, HISTORY_UPDATE_MOVE];
        }
        else {
            // Если мы только что заменили состояние то оно никак не может оказаться пустым
            // если оказалось то что-то не так
            throw new Error('Impossible error on push state, next state is empty!');
        }
    }
    move(to) {
        this.currentIndex += to;
    }
    getLength() {
        return this.stack.length;
    }
    getCurrentIndex() {
        return this.currentIndex;
    }
    getCurrentRoute() {
        return this.stack[this.currentIndex] ? this.stack[this.currentIndex][0] : undefined;
    }
    getCurrentState() {
        return this.stack[this.currentIndex] ? this.stack[this.currentIndex][1] : undefined;
    }
    getHistoryItem(offset = 0) {
        const index = this.currentIndex + offset;
        return this.stack[index] ? this.stack[index] : undefined;
    }
    canJumpIntoOffset(offset) {
        const index = this.currentIndex + offset;
        return index >= 0 && index <= this.getLength() - 1;
    }
    getPageOffset(pageId) {
        for (let i = this.currentIndex - 1; i >= 0; i--) {
            const route = this.stack[i][0];
            if (route.getPageId() === pageId) {
                // Страница совпадает но может быть ситуация когда поверх этой страницы попап или модалка
                // такое мы должны пропустить нас попросили найти смещение до конкретной страницы
                if (!route.hasOverlay()) {
                    return i - this.currentIndex;
                }
            }
        }
        return 0;
    }
    getFirstPageOffset() {
        for (let i = this.currentIndex - 1; i >= 0; i--) {
            const route = this.stack[i][0];
            if (!route.hasOverlay()) {
                return i - this.currentIndex;
            }
        }
        return 0;
    }
    getHistoryFromStartToCurrent() {
        return this.stack.slice(0, this.currentIndex);
    }
}
