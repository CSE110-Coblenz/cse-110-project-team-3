import { ScreenController } from "../../types";
import type { ScreenSwitcher } from "../../types";
import { VALID_SIMPLE_SCREEN_TYPES } from "../../constants";
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

  private handleResumeClick(): void {}
  private startGame() {
    MenuScreenModel.setLastScreen("menu");
    this.screenSwitcher.switchToScreen({ type: "map" });
  }

  private resume() {
    const last = this.model.getLastScreen();
    if (!last) return;

    // Validate that the stored screen type is a valid simple screen type
    // Note: This only handles simple screen types (map, rules, level, reference)
    // Complex types (topic, minigame, simulation) would need JSON storage
    if (!VALID_SIMPLE_SCREEN_TYPES.includes(last as any)) {
      console.warn(
        `Invalid screen type stored: ${last}. Clearing resume state.`,
      );
      MenuScreenModel.clearLastScreen();
      this.view.setResumeEnabled(false);
      return;
    }

    this.screenSwitcher.switchToScreen({
      type: last as "map" | "rules" | "level" | "reference",
    });
  }

  private handleRulesClick(): void {
    MenuScreenModel.setLastScreen("rules");
    this.screenSwitcher.switchToScreen({
      type: "rules",
      returnTo: { type: "menu" },
    });
  }

  private handleQuitClick(): void {
    // Browser game "quit": clear resume info and stay on menu
    MenuScreenModel.clearLastScreen();
    this.view.setResumeEnabled(false);
  }

  getView(): MenuScreenView {
    return this.view;
  }
}
