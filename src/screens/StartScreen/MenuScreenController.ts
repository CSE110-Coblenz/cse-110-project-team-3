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
    // New game: clear resume info and go through login before the map
    MenuScreenModel.clearLastScreen();
    this.screenSwitcher.switchToScreen({
      type: "login",
      nextScreen: { type: "map" },
    });
  }

  private handleResumeClick(): void {
    // Resume from where the user left off
    const lastScreen = this.model.getLastScreen();
    if (!lastScreen) {
      // Should not happen if button is enabled, but handle gracefully
      return;
    }

    // Navigate to login screen with the last screen as the destination
    // This allows the user to log in and then continue from where they left off
    this.screenSwitcher.switchToScreen({
      type: "login",
      nextScreen: lastScreen,
    });
  }

  private handleRulesClick(): void {
    MenuScreenModel.setLastScreen({ type: "rules", returnTo: { type: "menu" } });
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
