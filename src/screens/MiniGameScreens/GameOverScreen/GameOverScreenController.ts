import type { ScreenSwitcher } from "../../../types";
import { ScreenController } from "../../../types";
import { GameOverScreenView } from "./GameOverScreenView";

export class GameOverScreenController extends ScreenController {
  private view: GameOverScreenView;
  private screenSwitcher: ScreenSwitcher;
  private level: number;

  constructor(screenSwitcher: ScreenSwitcher, level: number) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.level = level;
    this.view = new GameOverScreenView(
      this.level,
      () => this.handleBackClick(),
      () => this.handleExitClick(),
    );
  }

  private handleBackClick(): void {
    this.screenSwitcher.switchToScreen({ type: "map" });
  }

  private handleExitClick(): void {
    // For now, log a message to the console.
    // TOOD: Implement actual exit functionality if needed.
    console.log("Exiting game...");
  }

  getView(): GameOverScreenView {
    return this.view;
  }
}
