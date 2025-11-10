import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { MenuScreenModel } from "./MenuScreenModel.ts";
import { MenuScreenView } from "./MenuScreenView.ts";

/**
 * MenuScreenController - wires button behavior and resume logic
 */
export class MenuScreenController extends ScreenController {
  private model: MenuScreenModel;
  private view: MenuScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;

    this.model = new MenuScreenModel();
    this.view = new MenuScreenView({
      onStart: () => this.startGame(),
      onResume: () => this.resume(),
      onRules: () => this.gotoRules(),
      onQuit: () => this.quit(),
    });
  }

  /** Called when this screen becomes active */
  show(): void {
    this.model.load();
    this.view.setResumeEnabled(this.model.getHasResume());
    this.view.show();
  }

  hide(): void {
    this.view.hide();
  }

  //private startGame() {
  //  MenuScreenModel.setLastScreen("game");
  //  this.screenSwitcher.switchToScreen({ type: "game" });
  //}

  private resume() {
    const last = this.model.getLastScreen();
    if (!last) return;
    this.screenSwitcher.switchToScreen({ type: last as any });
  }

  private gotoRules() {
    MenuScreenModel.setLastScreen("rules");
    this.screenSwitcher.switchToScreen({ type: "rules" });
  }

  private quit() {
    // If you have a dedicated quit/credits screen, route there:
    this.screenSwitcher.switchToScreen({ type: "quit" as any });
    // Otherwise, you could also simply clear last screen:
    // MenuScreenModel.clearLastScreen();
  }

  getView(): MenuScreenView {
    return this.view;
  }
}
