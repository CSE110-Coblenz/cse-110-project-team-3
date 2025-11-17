import { ScreenController, type ScreenSwitcher } from "../../types";
import type { TopicScreenConfig } from "./types";
import { TopicScreenView } from "./TopicScreenView";

/**
 * A configurable controller for topic-based screens
 */
export class TopicScreenController extends ScreenController {
  private view: TopicScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher, config: TopicScreenConfig) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new TopicScreenView(config, (buttonId) => {
      const button = config.buttons.find((b) => b.id === buttonId);
      if (button) {
        this.screenSwitcher.switchToScreen(button.target);
      }
    });
  }

  getView(): TopicScreenView {
    return this.view;
  }
}
