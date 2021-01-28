import { PANEL_MAIN, VIEW_MAIN } from '../const';
export class Page {
    constructor(panelId = PANEL_MAIN, viewId = VIEW_MAIN) {
        this.isInfinityPanel = false;
        this.panelId = panelId;
        this.viewId = viewId;
    }
    clone() {
        const p = new Page(this.panelId, this.viewId);
        p.isInfinityPanel = this.isInfinityPanel;
        return p;
    }
    makeInfinity() {
        this.isInfinityPanel = true;
        return this;
    }
}
