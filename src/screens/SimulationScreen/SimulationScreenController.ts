import type { ScreenSwitcher } from "../../types";
import { ScreenController, setCurrentLevelIndex } from "../../types";
import { SimulationScreenView } from "./SimulationScreenView";
import type { SimulationScreenConfig } from "./types";
import { getSimulationNavigationButtons } from "../../configs/NavigationButtons/Simulation";

// mapping ID config -> progress index
const SIM_UNLOCK_INDEX: Record<string, number> = {
  "lev1-force": 1, // completed sim 1 -> unlock lev 2
  "lev2-friction": 2,
  "lev3-distance": 3, // unlock game1
  "lev4-gravity": 5,
  "lev5-projectile": 6,
  "lev6-trajectory": 7, // unlock game2
};

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
    this.view = new SimulationScreenView(
      config,
      navigationButtons,
      (buttonId) => {
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
