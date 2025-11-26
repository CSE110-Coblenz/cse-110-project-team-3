import type { RuleConfig, ScreenSwitcher } from "../../../types";
import { MiniGameRuleScreenView } from "./MiniGameRuleScreenView";
import { ScreenController } from "../../../types";
import { getMiniGameRuleScreenNavigationButtons } from "../../../configs/NavigationButtons/MiniGame";

/**
 * Controller for the minigame rules screen
 */
export class MiniGameRuleScreenController extends ScreenController {
  private view: MiniGameRuleScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(
    screenSwitcher: ScreenSwitcher,
    ruleConfig: RuleConfig,
    level: number,
  ) {
    super();
    this.screenSwitcher = screenSwitcher;

    // Create navigation buttons with level
    const navigationButtons = getMiniGameRuleScreenNavigationButtons(level);

    // Create view with rule config, navigation buttons and click handler
    this.view = new MiniGameRuleScreenView(
      ruleConfig,
      navigationButtons,
      (buttonId) => {
        const button = navigationButtons.find((b) => b.id === buttonId);
        if (button) {
          console.log(`MiniGameRuleScreen: ${button.label} clicked`);
          this.screenSwitcher.switchToScreen(button.target);
        }
      },
    );
  }

  getView(): MiniGameRuleScreenView {
    return this.view;
  }
}
