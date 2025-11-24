import type { ScreenSwitcher } from "../../../types";
import { TitleScreenView } from "./TitleScreenView";
import { ScreenController } from "../../../types";

export class TitleScreenController extends ScreenController {
  private view: TitleScreenView;
  private screenSwitcher: ScreenSwitcher;
  private level: number;

  constructor(screenSwitcher: ScreenSwitcher, level: number) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.level = level;
    this.view = new TitleScreenView(
      () => this.handleNextClick(),
      () => this.handleBackClick(),
    );
  }

  private handleNextClick(): void {
    this.screenSwitcher.switchToScreen({
      type: "minigame",
      screen: "rules",
      level: this.level,
    });
    // TODO: Implement next button functionality
  }

  private handleBackClick(): void {
    this.screenSwitcher.switchToScreen({ type: "map" });
  }

  getView(): TitleScreenView {
    return this.view;
  }
}
