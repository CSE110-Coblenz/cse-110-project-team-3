import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { RulesScreenView } from "./RulesScreenView.ts";

/**
 * MenuScreenController - Handles menu interactions
 */
export class RulesScreenController extends ScreenController {
	private view: RulesScreenView;
	private screenSwitcher: ScreenSwitcher;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.view = new RulesScreenView(() => this.handleStartClick());
	}

	/**
	 * Handle start button click
	 */
	private handleStartClick(): void {
		// TODO: Task 1 - Implement screen transition from menu to game
		this.screenSwitcher.switchToScreen({ type: "rules" });
	}

	/**
	 * Get the view
	 */
	getView(): RulesScreenView {
		return this.view;
	}
}
