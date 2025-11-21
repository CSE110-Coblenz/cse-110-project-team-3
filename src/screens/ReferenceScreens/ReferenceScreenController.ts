import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher, Screen } from "../../types.ts";
import { ReferenceScreenView } from "./ReferenceScreenView.ts";

/*
ReferenceController handles the reference screen interactions
*/

export class ReferenceScreenController extends ScreenController {
  private view: ReferenceScreenView;
  private screenSwitcher: ScreenSwitcher;
  private currentReturnTo: Screen = { type: "map" }; // Default return to map

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new ReferenceScreenView(() => this.handleExitClick());
  }

  /*
    Sets the screen to return to when the exit button is clicked.
    */
  public setReturnTo(screen: Screen): void {
    this.currentReturnTo = screen;
  }

  /*
    Handles the exit button click to be implemented after game view is implemented?
    */
  private handleExitClick(): void {
    this.screenSwitcher.switchToScreen(this.currentReturnTo);
  }

  /*
    Gets the reference screen view
    */
  getView(): ReferenceScreenView {
    return this.view;
  }
}
