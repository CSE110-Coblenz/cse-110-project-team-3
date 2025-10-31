import type { ScreenSwitcher } from "../../types";
import { ScreenController } from "../../types";
import { SimulationScreenView } from "./SimulationScreenView";

export class SimulationScreenController extends ScreenController {
  private view: SimulationScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.view = new SimulationScreenView(
      "Force",
      () => this.handleBackClick(),
      () => this.handleNextClick(),
    );
    this.screenSwitcher = screenSwitcher;
  }

  private handleBackClick = () => {
    console.log("Simulation: BACK clicked");
  };

  private handleNextClick = () => {
    console.log("Simulation: NEXT clicked");
  };

  getView(): SimulationScreenView {
    return this.view;
  }
}
