import Konva from "konva";
import type { View } from "../../types";

export class Lev1 implements View{
    private group = new Konva.Group();
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