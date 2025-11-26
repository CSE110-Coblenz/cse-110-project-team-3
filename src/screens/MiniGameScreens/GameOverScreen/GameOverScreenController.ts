import type { ScreenSwitcher } from "../../../types";
import { ScreenController } from "../../../types";
import { GameOverScreenView } from "./GameOverScreenView";
import { getGameOverScreenNavigationButtons } from "../../../configs/NavigationButtons/MiniGame";

export class GameOverScreenController extends ScreenController {
  private view: GameOverScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher, level: number) {
    super();
    this.screenSwitcher = screenSwitcher;

    // Create navigation buttons with level
    const navigationButtons = getGameOverScreenNavigationButtons(level);

    // Create view with navigation buttons and click handler
    this.view = new GameOverScreenView(level, navigationButtons, (buttonId) => {
      const button = navigationButtons.find((b) => b.id === buttonId);
      if (button) {
        console.log(`GameOverScreen: ${button.label} clicked`);
        this.screenSwitcher.switchToScreen(button.target);
      }
    });
  }

  getView(): GameOverScreenView {
    return this.view;
  }
}
