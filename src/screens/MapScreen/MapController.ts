import type { ScreenSwitcher } from "../../types";
import { ScreenController } from "../../types";
import { MapScreenView } from "./MapView";
import { MapScreenNavigationButtons } from "../../configs/NavigationButtons/Map.ts";

export class MapScreenController extends ScreenController {
  private view: MapScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.view = new MapScreenView(
      (buttonId: string) => this.handleButtonClick(buttonId),
      (level: string) => this.handleNodeClick(level),
    );
    this.screenSwitcher = screenSwitcher;
  }

  private handleButtonClick = (buttonId: string) => {
    console.log(`Button ${buttonId} clicked`);
    
    // Find the button configuration
    const buttonConfig = MapScreenNavigationButtons.find(
      (btn) => btn.id === buttonId
    );

    if (!buttonConfig) {
      console.warn(`No configuration found for button: ${buttonId}`);
      return;
    }

    // Navigate to the target screen
    this.screenSwitcher.switchToScreen(buttonConfig.target);
  };

  private handleNodeClick = (level: string) => {
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

  getView(): MapScreenView {
    return this.view;
  }
}