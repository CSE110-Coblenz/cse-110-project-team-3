import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types.ts";
import { MapScreenController } from "./screens/MapScreen/MapController.ts";
import { RulesScreenController } from "./screens/RulesScreen/RulesScreenController.ts";
import { SimulationScreenController } from "./screens/SimulationScreen/SimulationScreenController.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants.ts";

class App implements ScreenSwitcher {
  private stage: Konva.Stage;
  private layer: Konva.Layer;

  private mapScreenController: MapScreenController;
  private rulesScreenController: RulesScreenController;
  private SimulationScreenController: SimulationScreenController;
  

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
    this.mapScreenController = new MapScreenController(this);
	  this.rulesScreenController = new RulesScreenController(this);
    this.SimulationScreenController = new SimulationScreenController(this);

    // add all screen views to the layer
    this.layer.add(this.mapScreenController.getView().getGroup());
	  this.layer.add(this.rulesScreenController.getView().getGroup());
    this.layer.add(this.SimulationScreenController.getView().getGroup());

    // Draw the layer
	  this.layer.draw();

    // Display simulation screen
    this.SimulationScreenController.getView().show();
  }

  switchToScreen(screen: Screen): void {
    // Hide all screens
    this.mapScreenController.getView().hide();
	  this.rulesScreenController.getView().hide();
    this.SimulationScreenController.getView().hide();

    // Show the selected screen
    switch (screen.type) {
      case "map":
        this.mapScreenController.getView().show();
        break;
      case "rules":
        this.rulesScreenController.getView().show();
        break;
      case "simulation":
        this.SimulationScreenController.getView().show();
        break;
      // Add cases for other screens as needed
    }
  }
}

new App();