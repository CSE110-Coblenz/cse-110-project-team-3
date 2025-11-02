import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types.ts";
import { MapScreenController } from "./screens/MapScreen/MapController.ts";
//import { ReferenceScreenController } from "./screens/ReferenceScreens/ReferenceScreenController.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants.ts";

class App implements ScreenSwitcher {
  private stage: Konva.Stage;
  private layer: Konva.Layer;

  private mapScreenController: MapScreenController;
  //private referenceScreenController: ReferenceScreenController;

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
    //this.referenceScreenController = new ReferenceScreenController(this);

    // add all screen views to the layer
    this.layer.add(this.mapScreenController.getView().getGroup());
    //this.layer.add(this.referenceScreenController.getView().getGroup());
    // Start with the map screen
    this.mapScreenController.getView().show();
    //this.referenceScreenController.getView().show();
  }

  switchToScreen(screen: Screen): void {
    // Hide all screens
    this.mapScreenController.getView().hide();
    //this.referenceScreenController.getView().hide();

    // Show the selected screen
    switch (screen.type) {
      case "map":
        this.mapScreenController.getView().show();
        break;
      // Add cases for other screens as needed
      case "reference":
        //this.referenceScreenController.getView().show();
        break;
    }
  }
}

new App();
