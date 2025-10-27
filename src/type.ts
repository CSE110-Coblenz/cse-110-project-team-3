import type { Group } from "konva/lib/Group";

export interface View {
    getGroup(): Group;
    show(): void;
    hide(): void;
}

export type Screen =
	| { type: "map" };

export abstract class ScreenController {
    abstract getView(): View;

    show(): void {
        this.getView().show();
    }

    hide(): void {
        this.getView().hide();
    }
}

export interface ScreenSwitcher {
    switchTo(screen: ScreenController): void;
}   