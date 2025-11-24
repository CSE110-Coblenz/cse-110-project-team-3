import { ScreenController } from "../../types";
import type { ScreenSwitcher } from "../../types";
import { LoginScreenModel } from "./LoginScreenModel";
import { LoginScreenView } from "./LoginScreenView";

/**
 * LoginScreenController - wires login behavior and username storage
 */
export class LoginScreenController extends ScreenController {
  private model: LoginScreenModel;
  private view: LoginScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;

    this.model = new LoginScreenModel();
    this.view = new LoginScreenView({
      onSubmit: (username: string) => this.handleLogin(username),
    });

    // Attach input to document body when controller is created
    document.body.appendChild(this.view.getUsernameInput());
  }

  /** Called when this screen becomes active */
  show(): void {
    // Check if there's an existing user
    const existingUsername = this.model.getExistingUsername();
    if (existingUsername) {
      this.view.setUsername(existingUsername);
    }

    this.view.show();
  }

  hide(): void {
    this.view.hide();
  }

  private handleLogin(username: string): void {
    this.view.clearError();

    // Update model with username
    this.model.setUsername(username);

    // Validate
    if (!this.model.isValid()) {
      this.view.setError("Please enter a valid username");
      return;
    }

    // Save to dataset
    const success = this.model.login();
    if (!success) {
      this.view.setError("Failed to save username. Please try again.");
      return;
    }

    // Navigate to menu screen
    this.screenSwitcher.switchToScreen({ type: "menu" });
  }

  getView(): LoginScreenView {
    return this.view;
  }
}
