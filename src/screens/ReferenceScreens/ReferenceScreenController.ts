import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { ReferenceScreenView } from "./ReferenceScreenView.ts";

/*
ReferenceController handles the reference screen interactions
*/

export class ReferenceScreenController extends ScreenController {
  private view: ReferenceScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new ReferenceScreenView(() => this.handleExitClick());
  }

  /*
    Handles the exit button click to be implemented after game view is implemented?
    */
  private handleExitClick(): void {
    //this.screenSwitcher.switchToScreen({type: "game"});
  }

  /*
    Gets the reference screen view
    */
  getView(): ReferenceScreenView {
    return this.view;
  }
}
