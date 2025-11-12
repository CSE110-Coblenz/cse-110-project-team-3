import type { RuleConfig, ScreenSwitcher } from "../../../types";
import { ScreenController } from "../../../types";
import { MiniGameRuleScreenView } from "./MiniGameRuleScreenView";

export class MiniGameRuleScreenController extends ScreenController {
  private view: MiniGameRuleScreenView;
  private screenSwitcher: ScreenSwitcher;
  private ruleConfig: RuleConfig;

  constructor(screenSwitcher: ScreenSwitcher, ruleConfig: RuleConfig) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.ruleConfig = ruleConfig;
    this.view = new MiniGameRuleScreenView(
      this.ruleConfig,
      () => this.handleNextClick(),
      () => this.handleBackClick()
    );
  }

  private handleNextClick(): void {
    console.log("Next button clicked");
  }

  private handleBackClick(): void {
    this.screenSwitcher.switchToScreen({ type: "minigame", screen: "title" });
  }

  getView(): MiniGameRuleScreenView {
    return this.view;
  }
}
