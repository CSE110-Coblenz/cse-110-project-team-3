import type { ScreenSwitcher } from "../../types";
import { ScreenController } from "../../types";
import { MapScreenView } from "./MapView";

export class MapScreenController extends ScreenController {
  private view: MapScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.view = new MapScreenView(
      () => this.handleReferenceClick(),
      () => this.handleRulesClick(),
      () => this.handleExitClick(),
      (level: string) => this.handleNodeClick(level),
    );
    this.screenSwitcher = screenSwitcher;
  }

  private handleNodeClick = (level: string) => {
    console.log(`Node ${level} clicked`);
    switch (level) {
      case "1":
        this.screenSwitcher.switchToScreen({
          type: "topic",
          level: "friction",
        });
        break;
      case "2":
        this.screenSwitcher.switchToScreen({
          type: "topic",
          level: "projectile motion",
        });
        break;
      case "Game 1":
        this.screenSwitcher.switchToScreen({
          type: "minigame",
          screen: "title",
          level: 1,
        });
    }
  };

  private handleReferenceClick = () => {
    console.log("Reference button clicked");
    this.screenSwitcher.switchToScreen({ type: "reference" });
  };

  private handleRulesClick = () => {
    console.log("Rules button clicked");
    this.screenSwitcher.switchToScreen({ type: "rules" });
  };

  private handleExitClick = () => {
    console.log("Exit button clicked");
  };

  getView(): MapScreenView {
    return this.view;
  }
}
