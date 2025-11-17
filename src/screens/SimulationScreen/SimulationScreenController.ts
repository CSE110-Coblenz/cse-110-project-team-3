import type { ScreenSwitcher } from "../../types";
import { ScreenController } from "../../types";
import { SimulationScreenView } from "./SimulationScreenView";
import type { SimulationScreenConfig } from "./types";

export class SimulationScreenController extends ScreenController {
  private view: SimulationScreenView;
  private screenSwitcher: ScreenSwitcher;
  private config: SimulationScreenConfig;

  constructor(screenSwitcher: ScreenSwitcher, config: SimulationScreenConfig) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.config = config;

    this.view = new SimulationScreenView(
      config,
      () => this.handleBackClick(),
      () => this.handleNextClick(),
    );
  }

  private handleBackClick = () => {
    console.log("Simulation: BACK clicked");
    this.screenSwitcher.switchToScreen(this.config.navigation.backScreen);
  };

  private handleNextClick = () => {
    console.log("Simulation: NEXT clicked");
    this.screenSwitcher.switchToScreen(this.config.navigation.nextScreen);
  };

  getView(): SimulationScreenView {
    return this.view;
  }
}
