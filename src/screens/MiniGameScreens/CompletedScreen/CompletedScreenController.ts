import type { ScreenSwitcher } from "../../../types";
import { MinigameCompletedScreenView } from "./CompletedScreenView";
import { ScreenController } from "../../../types";
import { getCompletedScreenNavigationButtons } from "../../../configs/NavigationButtons/MiniGame";

/**
 * Controller for the minigame completed screen
 */
export class CompletedScreenController extends ScreenController {
  private view: MinigameCompletedScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher, level: number) {
    super();
    this.screenSwitcher = screenSwitcher;

    // Create navigation buttons
    const navigationButtons = getCompletedScreenNavigationButtons(level);

    // Create view with navigation buttons and click handler
    this.view = new MinigameCompletedScreenView(
      level,
      navigationButtons,
      (buttonId) => {
        const button = navigationButtons.find((b) => b.id === buttonId);
        if (button) {
          console.log(`CompletedScreen: ${button.label} clicked`);
          this.screenSwitcher.switchToScreen(button.target);
        }
      },
    );
  }

  getView(): MinigameCompletedScreenView {
    return this.view;
  }
}
