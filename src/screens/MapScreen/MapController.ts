import type { ScreenSwitcher, MapScreenConfig } from "../../types";
import { ScreenController } from "../../types";
import { MapScreenView } from "./MapView";
import { map1Config, map2Config } from "../../configs/maps/MapScreenConfig.ts";

export class MapScreenController extends ScreenController {
  private view: MapScreenView;
  private screenSwitcher: ScreenSwitcher;
  private currentConfig: MapScreenConfig;

  constructor(screenSwitcher: ScreenSwitcher, mapId: number = 1) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.currentConfig = this.getConfigForMap(mapId);
    this.view = MapScreenView.fromConfig(
      this.currentConfig,
      (buttonId: string) => this.handleButtonClick(buttonId),
      (nodeId: string) => this.handleNodeClick(nodeId),
    );
  }

  private getConfigForMap(mapId: number): MapScreenConfig {
    switch (mapId) {
      case 2:
        return map2Config;
      case 1:
        return map1Config;
      default:
        console.error(`Unknown mapId: ${mapId}, defaulting to map 1`);
        return map1Config;
    }
  }

  private handleButtonClick = (buttonId: string) => {
    console.log(`Button ${buttonId} clicked`);

    // Find the button configuration
    const buttonConfig = this.currentConfig.buttons.find(
      (btn) => btn.id === buttonId,
    );

    if (!buttonConfig) {
      console.warn(`No configuration found for button: ${buttonId}`);
      return;
    }

    // Navigate to the target screen
    this.screenSwitcher.switchToScreen(buttonConfig.target);
  };

  private handleNodeClick = (nodeId: string) => {
    console.log(`Node ${nodeId} clicked`);

    // Find the node configuration
    const nodeConfig = this.currentConfig.nodes.find(
      (node) => node.id === nodeId,
    );

    if (!nodeConfig) {
      console.warn(`No configuration found for node: ${nodeId}`);
      return;
    }

    // Navigate to the target screen
    this.screenSwitcher.switchToScreen(nodeConfig.target);
  };

  getView(): MapScreenView {
    return this.view;
  }
}
