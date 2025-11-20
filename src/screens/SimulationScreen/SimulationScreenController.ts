import type { ScreenSwitcher } from "../../types";
import { ScreenController } from "../../types";
import { SimulationScreenView } from "./SimulationScreenView";
import type { SimulationScreenConfig } from "./types";
import { getSimulationNavigationButtons } from "../../configs/NavigationButtons/Simulation";

export class SimulationScreenController extends ScreenController {
  private view: SimulationScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher, config: SimulationScreenConfig) {
    super();
    this.screenSwitcher = screenSwitcher;

    // Create navigation buttons with screens from config
    const navigationButtons = getSimulationNavigationButtons(
      config.navigation.backScreen,
      config.navigation.nextScreen,
    );

    // Create view with navigation buttons and click handler
    this.view = new SimulationScreenView(config, navigationButtons, (buttonId) => {
      const button = navigationButtons.find((b) => b.id === buttonId);
      if (button) {
        console.log(`Simulation: ${button.label} clicked`);
        this.screenSwitcher.switchToScreen(button.target);
      }
    });
  }

  getView(): SimulationScreenView {
    return this.view;
  }
}
