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
      () => this.handleExitClick()
    );
    this.screenSwitcher = screenSwitcher;
  }

  private handleNodeClick = (level: string) => {
    console.log(`Node ${level} clicked`);
  };

  private handleReferenceClick = () => {
    console.log("Reference button clicked");
  };

  private handleRulesClick = () => {
    console.log("Rules button clicked");
  };

  private handleExitClick = () => {
    console.log("Exit button clicked");
  };

  getView(): MapScreenView {
    return this.view;
  }
}
