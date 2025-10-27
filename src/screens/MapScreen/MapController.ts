import type { ScreenSwitcher } from "../../type";
import { ScreenController } from "../../type";
import { MapScreenView } from "./MapView";

export class MapScreenController extends ScreenController {
    private view: MapScreenView;
    private screenSwitcher: ScreenSwitcher;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.view = new MapScreenView();
        this.screenSwitcher = screenSwitcher;
    }

    private switchToLevelScreen(): void {
        // Implementation for switching to level screen goes here
        this.screenSwitcher.switchTo({ type: "level" });
    }

    getView(): MapScreenView {
        return this.view;
    }
}