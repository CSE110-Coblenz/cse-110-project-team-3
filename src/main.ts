import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types.ts";
import { MapScreenController } from "./screens/MapScreen/MapController.ts";
import { ReferenceScreenController } from "./screens/ReferenceScreens/ReferenceScreenController.ts";
import { RulesScreenController } from "./screens/RulesScreen/RulesScreenController.ts";
import { SimulationScreenController } from "./screens/SimulationScreen/SimulationScreenController.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants.ts";
import { TopicScreenController } from "./screens/TopicScreen/TopicScreenController";
import { frictionConfig, projectileMotionConfig } from "./configs/topics";

class App implements ScreenSwitcher {
  private stage: Konva.Stage;
  private layer: Konva.Layer;

  private mapScreenController: MapScreenController;
  private referenceScreenController: ReferenceScreenController;
  private rulesScreenController: RulesScreenController;
  private frictionTopicController: TopicScreenController;
  private projectileMotionTopicController: TopicScreenController;

  private Lev1SimulationController: SimulationScreenController;
  private Lev2SimulationController: SimulationScreenController;

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
    this.referenceScreenController = new ReferenceScreenController(this);

    // Initialize topic screens with different configurations
    this.frictionTopicController = new TopicScreenController(
      this,
      frictionConfig,
    );
    this.projectileMotionTopicController = new TopicScreenController(
      this,
      projectileMotionConfig,
    );

    this.Lev1SimulationController = new SimulationScreenController(this, {
      level: "lev1",
      topic: "friction",
    });
    this.Lev2SimulationController = new SimulationScreenController(this, {
      level: "lev2",
      topic: "projectile motion",
    });

    // add all screen views to the layer
    this.layer.add(this.mapScreenController.getView().getGroup());
    this.layer.add(this.frictionTopicController.getView().getGroup());
    this.layer.add(this.projectileMotionTopicController.getView().getGroup());
    this.layer.add(this.referenceScreenController.getView().getGroup());
    this.layer.add(this.rulesScreenController.getView().getGroup());
    this.layer.add(this.SimulationScreenController.getView().getGroup());

    this.layer.add(this.Lev1SimulationController.getView().getGroup());
    this.layer.add(this.Lev2SimulationController.getView().getGroup());

    // Draw the layer
    this.layer.draw();

    // Start with the map screen
    // this.switchToScreen({ type: "simulation", topic: "projectile motion", level: "lev2"});
    this.switchToScreen({ type: "map" });
  }

  switchToScreen(screen: Screen): void {
    // Hide all screens
    this.mapScreenController.getView().hide();
    this.referenceScreenController.getView().hide();
    this.rulesScreenController.getView().hide();
    this.frictionTopicController.getView().hide();
    this.projectileMotionTopicController.getView().hide();

    this.Lev1SimulationController.getView().hide();
    this.Lev2SimulationController.getView().hide();

    // Show the selected screen
    switch (screen.type) {
      case "map":
        this.mapScreenController.getView().show();
        break;
      case "rules":
        this.rulesScreenController.getView().show();
        break;
      case "reference":
        this.referenceScreenController.getView().show();
        break;
      case "topic":
        if (screen.level === "friction") {
          this.frictionTopicController.getView().show();
        } else if (screen.level === "projectile motion") {
          this.projectileMotionTopicController.getView().show();
        }
        break;
      case "simulation":
        if (screen.topic === "projectile motion") {
          if (screen.level === "lev1") {
            this.Lev1SimulationController.getView().show();
          } else {
            this.Lev2SimulationController.getView().show();
          }
        }
        break;
    }
  }
}

const app = new App();
// use this format to test your screen. I had a specifier for topic, level, so you dont need to add that.
// app.switchToScreen({ type: "topic", level: "friction" });
