import type { ScreenSwitcher } from "../../../types";
import { ScreenController } from "../../../types";
import { TitleScreenView } from "./TitleScreenView";

export class TitleScreenController extends ScreenController {
  private view: TitleScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new TitleScreenView(
      () => this.handleNextClick(),
      () => this.handleBackClick()
    );
  }

  private handleNextClick(): void {
    this.screenSwitcher.switchToScreen({ type: "minigame", screen: "rules" });
    // TODO: Implement next button functionality
  }

  private handleBackClick(): void {
    console.log("Back button clicked");
    // TODO: Implement back button functionality
  }

  getView(): TitleScreenView {
    return this.view;
  }
}
