import type { ScreenSwitcher } from "../../types";
import { ScreenController } from "../../types";
import { SimulationScreenView } from "./SimulationScreenView";

export class SimulationScreenController extends ScreenController {
  private view: SimulationScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(
    screenSwitcher: ScreenSwitcher,
    opts: { level: "lev1" | "lev2"; topic: "friction" | "projectile motion" },
  ) {
    super();
    this.screenSwitcher = screenSwitcher;

    this.view = new SimulationScreenView(
      opts.level,
      () => this.handleBackClick(opts.topic),
      () => this.handleNextClick(),
    );
  }

  private handleBackClick = (topic: "friction" | "projectile motion") => {
    console.log("Simulation: BACK clicked");
    this.screenSwitcher.switchToScreen({ type: "topic", level: topic });
  };

  private handleNextClick = () => {
    console.log("Simulation: NEXT clicked");
  };

  getView(): SimulationScreenView {
    return this.view;
  }
}
