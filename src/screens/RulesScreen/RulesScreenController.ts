import type { ScreenSwitcher } from "../../types";
import { ScreenController } from "../../types";
import { RulesScreenView } from "./RulesScreenView";
import { RulesScreenNavigationButtons } from "../../configs/NavigationButtons/Rules.ts";

export class RulesScreenController extends ScreenController {
  private view: RulesScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.view = new RulesScreenView((buttonId: string) =>
      this.handleButtonClick(buttonId)
    );
    this.screenSwitcher = screenSwitcher;
  }

  private handleButtonClick = (buttonId: string) => {
    console.log(`Button ${buttonId} clicked`);

    // Find the button configuration
    const buttonConfig = RulesScreenNavigationButtons.find(
      (btn) => btn.id === buttonId
    );

    if (!buttonConfig) {
      console.warn(`No configuration found for button: ${buttonId}`);
      return;
    }

    // Navigate to the target screen
    this.screenSwitcher.switchToScreen(buttonConfig.target);
  };

  getView(): RulesScreenView {
    return this.view;
  }
}