import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher, Screen } from "../../types.ts";
import { ReferenceScreenView } from "./ReferenceScreenView.ts";
import { ReferenceScreenNavigationButtons } from "../../configs/NavigationButtons/Reference.ts";

/**
 * ReferenceController handles the reference screen interactions
 */
export class ReferenceScreenController extends ScreenController {
  private view: ReferenceScreenView;
  private screenSwitcher: ScreenSwitcher;
  private currentReturnTo: Screen = { type: "map" }; // Default return to map

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new ReferenceScreenView((buttonId: string) =>
      this.handleButtonClick(buttonId),
    );
  }

  /*
    Sets the screen to return to when the exit button is clicked.
    */
  public setReturnTo(screen: Screen): void {
    this.currentReturnTo = screen;
  }

  /*
    Handles button clicks based on configuration
    */
  private handleButtonClick = (buttonId: string) => {
    console.log(`Button ${buttonId} clicked`);

    // Find the button configuration
    const buttonConfig = ReferenceScreenNavigationButtons.find(
      (btn) => btn.id === buttonId,
    );

    if (!buttonConfig) {
      console.warn(`No configuration found for button: ${buttonId}`);
      return;
    }

    // Special handling for exit button - use currentReturnTo instead of config target
    if (buttonId === "exit") {
      this.screenSwitcher.switchToScreen(this.currentReturnTo);
      return;
    }

    // For other buttons, navigate to the target screen from config
    this.screenSwitcher.switchToScreen(buttonConfig.target);
  };

  /*
    Gets the reference screen view
    */
  getView(): ReferenceScreenView {
    return this.view;
  }
}
