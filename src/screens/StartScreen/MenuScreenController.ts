import { ScreenController } from "../../types";
import type { ScreenSwitcher } from "../../types";
import { MenuScreenModel } from "./MenuScreenModel";
import { MenuScreenView } from "./MenuScreenView";

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
      onStart: () => this.handleStartClick(),
      onResume: () => this.handleResumeClick(),
      onRules: () => this.handleRulesClick(),
      onQuit: () => this.handleQuitClick(),
    });
  }

  /** Called when this screen becomes active (App already calls this) */
  show(): void {
    this.model.load();
    this.view.setResumeEnabled(this.model.getHasResume());
    super.show(); // calls this.getView().show()
  }

  private handleStartClick(): void {
    // New game: clear any saved last screen and go to the map
    MenuScreenModel.clearLastScreen();
    this.screenSwitcher.switchToScreen({ type: "map" });
  }

  private handleResumeClick(): void {
    const last = this.model.getLastScreen();
    if (!last) return;

    // For now, support simple screen types only
    if (last === "map" || last === "rules" || last === "reference") {
      this.screenSwitcher.switchToScreen({ type: last });
    }
    // If you later want to resume into topics/simulations,
    // extend MenuScreenModel to store a richer object.
  }

  private handleRulesClick(): void {
    MenuScreenModel.setLastScreen("rules");
    this.screenSwitcher.switchToScreen({ type: "rules" });
  }

  private handleQuitClick(): void {
    // Browser game "quit": clear resume info and stay on menu
    MenuScreenModel.clearLastScreen();
  }

  getView(): MenuScreenView {
    return this.view;
  }
}
