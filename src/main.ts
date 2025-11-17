import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types.ts";
import { MapScreenController } from "./screens/MapScreen/MapController.ts";
import { ReferenceScreenController } from "./screens/ReferenceScreens/ReferenceScreenController.ts";
import { RulesScreenController } from "./screens/RulesScreen/RulesScreenController.ts";
import { SimulationScreenController } from "./screens/SimulationScreen/SimulationScreenController.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants.ts";
import { TopicScreenController } from "./screens/TopicScreen/TopicScreenController";
import { TitleScreenController } from "./screens/MiniGameScreens/TitleScreen/TitleScreenController";
import { MiniGameRuleScreenController } from "./screens/MiniGameScreens/MiniGameRuleScreen/MiniGameRuleScreenController.ts";
import { CompletedScreenController } from "./screens/MiniGameScreens/CompletedScreen/CompletedScreenController.ts";
import { GameOverScreenController } from "./screens/MiniGameScreens/GameOverScreen/GameOverScreenController.ts";

// Import configurations for topics and rules
import { frictionConfig, projectileMotionConfig } from "./configs/topics";
import { MinigameSimulController } from "./screens/MiniGameScreens/MinigameSimulScreen/MinigameSimulController";
import { miniGameRuleConfig } from "./configs/rules";

class App implements ScreenSwitcher {
  private stage: Konva.Stage;
  private layer: Konva.Layer;

  private mapScreenController: MapScreenController;
  private referenceScreenController: ReferenceScreenController;
  private rulesScreenController: RulesScreenController;
  private frictionTopicController: TopicScreenController;
  private projectileMotionTopicController: TopicScreenController;

  private lev1SimulationController: SimulationScreenController;
  private lev2SimulationController: SimulationScreenController;

  // for minigame they depend on the level
  private titleScreenController?: TitleScreenController;
  private miniGameRuleScreenController?: MiniGameRuleScreenController;
  private minigameSimulController?: MinigameSimulController;
  private completedScreenController?: CompletedScreenController;
  private gameOverScreenController?: GameOverScreenController;

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
    //this.minigameSimulController = new MinigameSimulController(this);

    // Initialize topic screens with different configurations
    this.frictionTopicController = new TopicScreenController(
      this,
      frictionConfig,
    );
    this.projectileMotionTopicController = new TopicScreenController(
      this,
      projectileMotionConfig,
    );

    this.lev1SimulationController = new SimulationScreenController(this, {
      level: "lev1",
      topic: "friction",
    });
    this.lev2SimulationController = new SimulationScreenController(this, {
      level: "lev2",
      topic: "projectile motion",
    });

    // add all screen views to the layer
    this.layer.add(this.mapScreenController.getView().getGroup());
    this.layer.add(this.frictionTopicController.getView().getGroup());
    this.layer.add(this.projectileMotionTopicController.getView().getGroup());
    this.layer.add(this.referenceScreenController.getView().getGroup());
    this.layer.add(this.rulesScreenController.getView().getGroup());
    this.layer.add(this.lev1SimulationController.getView().getGroup());
    this.layer.add(this.lev2SimulationController.getView().getGroup());
    //this.layer.add(this.minigameSimulController.getView().getGroup());

    // Draw the layer
    this.layer.draw();

    // Start with the map screen
    this.switchToScreen({ type: "map" });
  }

  switchToScreen(screen: Screen): void {
    // Hide all screens
    this.mapScreenController.getView().hide();
    this.referenceScreenController.getView().hide();
    this.rulesScreenController.getView().hide();
    this.frictionTopicController.getView().hide();
    this.projectileMotionTopicController.getView().hide();

    this.lev1SimulationController.getView().hide();
    this.lev2SimulationController.getView().hide();

    this.titleScreenController?.getView().hide();
    this.miniGameRuleScreenController?.getView().hide();
    this.minigameSimulController?.getView().hide();
    this.completedScreenController?.getView().hide();
    this.gameOverScreenController?.getView().hide();

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
            this.lev1SimulationController.getView().show();
          } else {
            this.lev2SimulationController.getView().show();
          }
        }
        break;
      case "minigame":
        switch (screen.screen) {
          case "title":
            this.titleScreenController = new TitleScreenController(
              this,
              screen.level,
            );
            this.layer.add(this.titleScreenController.getView().getGroup());
            this.titleScreenController.getView().show();
            break;
          case "rules":
            this.miniGameRuleScreenController = new MiniGameRuleScreenController(
              this,
              miniGameRuleConfig,
              screen.level,
            );
            this.layer.add(
              this.miniGameRuleScreenController.getView().getGroup(),
            );
            this.miniGameRuleScreenController.getView().show();
            break;
          case "simulation":
            this.minigameSimulController = new MinigameSimulController(this, screen.level);
            this.layer.add(this.minigameSimulController.getView().getGroup());
            this.minigameSimulController.getView().show();
            break;
          case "completed":
            this.completedScreenController = new CompletedScreenController(
              this,
              screen.level,
            );
            this.layer.add(this.completedScreenController.getView().getGroup());
            this.completedScreenController.getView().show();
            break;
          case "gameover":
            this.gameOverScreenController = new GameOverScreenController(
              this,
              screen.level,
            );
            this.layer.add(this.gameOverScreenController.getView().getGroup());
            this.gameOverScreenController.getView().show();
            break;
        }
        break;
    }
  }
}

const app = new App();
