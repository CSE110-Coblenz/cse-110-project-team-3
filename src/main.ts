import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types.ts";
import { MapScreenController } from "./screens/MapScreen/MapController.ts";
import { RulesScreenController } from "./screens/RulesScreen/RulesScreenController.ts";
import { MenuScreenController } from "./screens/StartScreen/MenuScreenController.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants.ts";

class App implements ScreenSwitcher {
  private stage: Konva.Stage;
  private layer: Konva.Layer;

  private menuScreenController: MenuScreenController;
  private mapScreenController: MapScreenController;
  private rulesScreenController: RulesScreenController;

  constructor(container: string = "container") {
    // Initialize stage
    this.stage = new Konva.Stage({
      container: container,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
    });

    // Initialize layer
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // Initialize screen controllers
    this.menuScreenController = new MenuScreenController(this);
    this.mapScreenController = new MapScreenController(this);
    this.rulesScreenController = new RulesScreenController(this);

    // add all screen views to the layer
    this.layer.add(this.menuScreenController.getView().getGroup());
    this.layer.add(this.mapScreenController.getView().getGroup());
    this.layer.add(this.rulesScreenController.getView().getGroup());

    // Draw the layer
    this.layer.draw();

    // Start with the menu screen
    this.switchToScreen({ type: "menu" });
  }

  switchToScreen(screen: Screen): void {
    // Hide all screens
    this.menuScreenController.hide();
    this.mapScreenController.hide();
    this.rulesScreenController.hide();

    // Show the selected screen
    switch (screen.type) {
      case "menu":
        this.menuScreenController.show();
        break;
      case "map":
        this.mapScreenController.show();
        break;
      case "rules":
        this.rulesScreenController.show();
        break;
      // Add cases for other screens as needed
    }
  }
}

new App();
