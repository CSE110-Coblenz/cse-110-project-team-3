import type { ScreenSwitcher } from "../../../types";
import { TitleScreenView } from "./TitleScreenView";
import { ScreenController } from "../../../types";
import { getTitleScreenNavigationButtons } from "../../../configs/NavigationButtons/MiniGame";

/** 
 * Controller for the minigame title screen 
 */
export class TitleScreenController extends ScreenController {
  private view: TitleScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher, level: number) {
    super();
    this.screenSwitcher = screenSwitcher;

    // Create navigation buttons with level
    const navigationButtons = getTitleScreenNavigationButtons(level);

    // Create view with navigation buttons and click handler
    this.view = new TitleScreenView(navigationButtons, level, (buttonId) => {
      const button = navigationButtons.find((b) => b.id === buttonId);
      if (button) {
        console.log(`TitleScreen: ${button.label} clicked`);
        this.screenSwitcher.switchToScreen(button.target);
      }
    });
  }

  getView(): TitleScreenView {
    return this.view;
  }
}
