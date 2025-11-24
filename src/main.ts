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
import { MenuScreenController } from "./screens/StartScreen/MenuScreenController.ts";
import { Minigame1SimulController } from "./screens/MiniGameScreens/Minigame1SimulScreen/Minigame1SimulController.ts";

// Import configurations for minigames
import { MinigameSimulController } from "./screens/MiniGameScreens/MinigameSimulScreen/MinigameSimulController";
import { miniGameRuleConfig } from "./configs/rules";

// Import coonfigurations for levels (topic + simulation)
import {
  forceConfig,
  frictionConfig,
  distanceConfig,
  gravityConfig,
  projectileMotionConfig,
  trajectoryConfig,
} from "./configs/topics";
import {
  Lev1SimulationConfig,
  Lev2SimulationConfig,
  Lev3SimulationConfig,
  Lev4SimulationConfig,
  Lev5SimulationConfig,
  Lev6SimulationConfig,
} from "./configs/simulations";

class App implements ScreenSwitcher {
  private stage: Konva.Stage;
  private layer: Konva.Layer;

  private menuScreenController: MenuScreenController;
  private mapScreenController: MapScreenController;
  private referenceScreenController: ReferenceScreenController;
  private rulesScreenController: RulesScreenController;
  // Topics
  private forceTopicController: TopicScreenController;
  private frictionTopicController: TopicScreenController;
  private distanceTopicController: TopicScreenController;
  private gravityTopicController: TopicScreenController;
  private projectileMotionTopicController: TopicScreenController;
  private trajectoryTopicController: TopicScreenController;
  // Simulations
  private lev1SimulationController: SimulationScreenController;
  private lev2SimulationController: SimulationScreenController;
  private lev3SimulationController: SimulationScreenController;
  private lev4SimulationController: SimulationScreenController;
  private lev5SimulationController: SimulationScreenController;
  private lev6SimulationController: SimulationScreenController;

  // for minigame they depend on the level
  private titleScreenController?: TitleScreenController;
  private miniGameRuleScreenController?: MiniGameRuleScreenController;
  private minigameSimulController?: MinigameSimulController;
  private completedScreenController?: CompletedScreenController;
  private gameOverScreenController?: GameOverScreenController;
  private minigame1SimulController?: Minigame1SimulController;

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
    this.referenceScreenController = new ReferenceScreenController(this);
    //this.minigameSimulController = new MinigameSimulController(this);

    // Initialize topic screens with different configurations
    this.forceTopicController = new TopicScreenController(this, forceConfig);
    this.frictionTopicController = new TopicScreenController(
      this,
      frictionConfig,
    );
    this.distanceTopicController = new TopicScreenController(
      this,
      distanceConfig,
    );
    this.gravityTopicController = new TopicScreenController(
      this,
      gravityConfig,
    );
    this.projectileMotionTopicController = new TopicScreenController(
      this,
      projectileMotionConfig,
    );
    this.trajectoryTopicController = new TopicScreenController(
      this,
      trajectoryConfig,
    );

    // Initialize Simulation screens with different configurations
    this.lev1SimulationController = new SimulationScreenController(
      this,
      Lev1SimulationConfig,
    );
    this.lev2SimulationController = new SimulationScreenController(
      this,
      Lev2SimulationConfig,
    );
    this.lev3SimulationController = new SimulationScreenController(
      this,
      Lev3SimulationConfig,
    );
    this.lev4SimulationController = new SimulationScreenController(
      this,
      Lev4SimulationConfig,
    );
    this.lev5SimulationController = new SimulationScreenController(
      this,
      Lev5SimulationConfig,
    );
    this.lev6SimulationController = new SimulationScreenController(
      this,
      Lev6SimulationConfig,
    );

    // add all screen views to the layer
    this.layer.add(this.menuScreenController.getView().getGroup());
    this.layer.add(this.mapScreenController.getView().getGroup());
    this.layer.add(this.referenceScreenController.getView().getGroup());
    this.layer.add(this.rulesScreenController.getView().getGroup());

    this.layer.add(this.forceTopicController.getView().getGroup());
    this.layer.add(this.frictionTopicController.getView().getGroup());
    this.layer.add(this.distanceTopicController.getView().getGroup());
    this.layer.add(this.gravityTopicController.getView().getGroup());
    this.layer.add(this.projectileMotionTopicController.getView().getGroup());
    this.layer.add(this.trajectoryTopicController.getView().getGroup());

    this.layer.add(this.lev1SimulationController.getView().getGroup());
    this.layer.add(this.lev2SimulationController.getView().getGroup());
    this.layer.add(this.lev3SimulationController.getView().getGroup());
    this.layer.add(this.lev4SimulationController.getView().getGroup());
    this.layer.add(this.lev5SimulationController.getView().getGroup());
    this.layer.add(this.lev6SimulationController.getView().getGroup());
    //this.layer.add(this.minigameSimulController.getView().getGroup());

    // Draw the layer
    this.layer.draw();

    // Start with the menu screen
    this.switchToScreen({ type: "minigame" , screen: "simulation", level: 1 });
  }

  switchToScreen(screen: Screen): void {
    // Hide all screens
    this.menuScreenController.getView().hide();
    this.mapScreenController.getView().hide();
    this.referenceScreenController.getView().hide();
    this.rulesScreenController.getView().hide();

    this.forceTopicController.getView().hide();
    this.frictionTopicController.getView().hide();
    this.distanceTopicController.getView().hide();
    this.gravityTopicController.getView().hide();
    this.projectileMotionTopicController.getView().hide();
    this.trajectoryTopicController.getView().hide();

    this.lev1SimulationController.getView().hide();
    this.lev2SimulationController.getView().hide();
    this.lev3SimulationController.getView().hide();
    this.lev4SimulationController.getView().hide();
    this.lev5SimulationController.getView().hide();
    this.lev6SimulationController.getView().hide();

    this.titleScreenController?.getView().hide();
    this.miniGameRuleScreenController?.getView().hide();
    this.minigameSimulController?.getView().hide();
    this.completedScreenController?.getView().hide();
    this.gameOverScreenController?.getView().hide();
    this.minigame1SimulController?.getView().hide();

    // Show the selected screen
    switch (screen.type) {
      case "menu":
        this.menuScreenController.show();
        break;
      case "map":
        this.mapScreenController.getView().show();
        break;
      case "rules":
        this.rulesScreenController.getView().show();
        break;
      case "reference":
        if (screen.returnTo) {
          this.referenceScreenController.setReturnTo(screen.returnTo);
        }
        this.referenceScreenController.getView().show();
        break;
      case "topic":
        if (screen.level === "force") {
          this.forceTopicController.getView().show();
        } else if (screen.level === "friction") {
          this.frictionTopicController.getView().show();
        } else if (screen.level === "distance") {
          this.distanceTopicController.getView().show();
        } else if (screen.level === "gravity") {
          this.gravityTopicController.getView().show();
        } else if (screen.level === "projectile motion") {
          this.projectileMotionTopicController.getView().show();
        } else if (screen.level === "trajectory") {
          this.trajectoryTopicController.getView().show();
        }
        break;
      case "simulation":
        if (screen.topic === "force") {
          this.lev1SimulationController.getView().show();
        } else if (screen.topic === "friction") {
          this.lev2SimulationController.getView().show();
        } else if (screen.topic === "distance") {
          this.lev3SimulationController.getView().show();
        } else if (screen.topic === "gravity") {
          this.lev4SimulationController.getView().show();
        } else if (screen.topic === "projectile motion") {
          this.lev5SimulationController.getView().show();
        } else if (screen.topic === "trajectory") {
          this.lev6SimulationController.getView().show();
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
            this.miniGameRuleScreenController =
              new MiniGameRuleScreenController(
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
            switch (screen.level) {
              case 1:
                this.minigame1SimulController = new Minigame1SimulController(
                  this,
                  screen.level,
                );
                this.layer.add(
                  this.minigame1SimulController.getView().getGroup(),
                );
                this.minigame1SimulController.getView().show();
                break;
              case 2:
                this.minigameSimulController = new MinigameSimulController(
                  this,
                  screen.level,
                );
                this.layer.add(
                  this.minigameSimulController.getView().getGroup(),
                );
                this.minigameSimulController.getView().show();
                break;
            }
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
