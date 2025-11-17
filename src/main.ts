import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types.ts";
import { MapScreenController } from "./screens/MapScreen/MapController.ts";
import { ReferenceScreenController } from "./screens/ReferenceScreens/ReferenceScreenController.ts";
import { RulesScreenController } from "./screens/RulesScreen/RulesScreenController.ts";
import { MenuScreenController } from "./screens/StartScreen/MenuScreenController.ts";
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

  private menuScreenController: MenuScreenController;
  private mapScreenController: MapScreenController;
  private referenceScreenController: ReferenceScreenController;
  private rulesScreenController: RulesScreenController;
  private frictionTopicController: TopicScreenController;
  private projectileMotionTopicController: TopicScreenController;
  private titleScreenController?: TitleScreenController;

  private lev1SimulationController: SimulationScreenController;
  private lev2SimulationController: SimulationScreenController;
  private minigameSimulController: MinigameSimulController;
  private miniGameRuleScreenController?: MiniGameRuleScreenController;
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

const app = new App();
