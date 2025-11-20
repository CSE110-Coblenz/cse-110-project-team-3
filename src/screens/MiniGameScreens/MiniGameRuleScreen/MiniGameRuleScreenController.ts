import type { RuleConfig, ScreenSwitcher } from "../../../types";
import { MiniGameRuleScreenView } from "./MiniGameRuleScreenView";
import { ScreenController } from "../../../types";

export class MiniGameRuleScreenController extends ScreenController {
  private view: MiniGameRuleScreenView;
  private ruleConfig: RuleConfig;
  private screenSwitcher: ScreenSwitcher;
  private level: number;

  constructor(
    screenSwitcher: ScreenSwitcher,
    ruleConfig: RuleConfig,
    level: number,
  ) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.ruleConfig = ruleConfig;
    this.level = level;
    this.view = new MiniGameRuleScreenView(
      this.ruleConfig,
      () => this.handleNextClick(),
      () => this.handleBackClick(),
    );
  }

  private handleNextClick(): void {
    // TODO: Swith to the actual game screen, passing the level
    this.screenSwitcher.switchToScreen({
      type: "minigame",
      screen: "simulation",
      level: this.level,
    });
  }

  private handleBackClick(): void {
    this.screenSwitcher.switchToScreen({
      type: "minigame",
      screen: "title",
      level: this.level,
    });
  }

  getView(): MiniGameRuleScreenView {
    return this.view;
  }
}
