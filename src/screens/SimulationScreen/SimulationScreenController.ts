import type { ScreenSwitcher } from "../../types";
import { ScreenController, setCurrentLevelIndex  } from "../../types";
import { SimulationScreenView } from "./SimulationScreenView";
import type { SimulationScreenConfig } from "./types";
import { getSimulationNavigationButtons } from "../../configs/NavigationButtons/Simulation";
import { SIM_UNLOCK_INDEX } from "../../configs/maps/MapScreenConfig"

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
        if (!button) return;
        if (buttonId === "next") {
          const idx = SIM_UNLOCK_INDEX[config.id];
          if (idx !== undefined) {
            setCurrentLevelIndex(idx);
          }
        } 
        console.log(`Simulation: ${button.label} clicked`);
        this.screenSwitcher.switchToScreen(button.target);
      },
    );
  }

  getView(): SimulationScreenView {
    return this.view;
  }
}
