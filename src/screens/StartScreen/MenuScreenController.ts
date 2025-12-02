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
    const hasResume = this.model.getHasResume();
    const lastScreen = this.model.getLastScreen();
    console.log("MenuScreen show() - hasResume:", hasResume, "lastScreen:", lastScreen);
    this.view.setResumeEnabled(hasResume);
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
    console.log("Resume button clicked");
    // Resume from where the user left off - go directly to the last screen
    const lastScreen = this.model.getLastScreen();
    console.log("Last screen from model:", lastScreen);
    
    if (!lastScreen) {
      console.warn("No last screen found, resume button should be disabled");
      // Should not happen if button is enabled, but handle gracefully
      return;
    }

    // Navigate directly to the last screen (skip login)
    console.log("Navigating directly to:", lastScreen);
    this.screenSwitcher.switchToScreen(lastScreen);
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
