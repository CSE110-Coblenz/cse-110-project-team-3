import type { ScreenSwitcher } from "../../types";
import { ScreenController } from "../../types";
import { RulesScreenView } from "./RulesScreenView";

export class RulesScreenController extends ScreenController {
  private view: RulesScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.view = new RulesScreenView(() => this.handleExitClick());
    this.screenSwitcher = screenSwitcher;
  }
  private handleExitClick = () => {
    console.log("Exit button clicked");
    this.screenSwitcher.switchToScreen({ type: "map" });
  };

  getView(): RulesScreenView {
    return this.view;
  }
}
