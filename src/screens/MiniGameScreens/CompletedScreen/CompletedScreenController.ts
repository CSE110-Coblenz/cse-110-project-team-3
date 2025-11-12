import type { ScreenSwitcher } from "../../../types";
import { MinigameCompletedScreenView } from "./CompletedScreenView";
import { ScreenController } from "../../../types";

export class CompletedScreenController extends ScreenController {
  private view: MinigameCompletedScreenView;
  private screenSwitcher: ScreenSwitcher;
  private level: number;

  constructor(screenSwitcher: ScreenSwitcher, level: number) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.level = level;
    this.view = new MinigameCompletedScreenView(this.level, () =>
      this.handleBackClick(),
    );
  }

  private handleBackClick(): void {
    this.screenSwitcher.switchToScreen({ type: "map" });
  }

  getView(): MinigameCompletedScreenView {
    return this.view;
  }
}
