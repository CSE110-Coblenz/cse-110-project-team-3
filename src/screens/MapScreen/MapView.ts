import Konva from "konva";
import type { View } from "../../type";

export class MapScreenView implements View {
    private group: Konva.Group;

    constructor() {
        this.group = new Konva.Group();
    }

    getGroup(): Konva.Group {
        return this.group;
    }

    show(): void {
        this.group.visible(true);
        this.group.getLayer()?.draw();
    }

    hide(): void {
        this.group.visible(false);
        this.group.getLayer()?.draw();
    }
}