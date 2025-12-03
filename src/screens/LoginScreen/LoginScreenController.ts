import { ScreenController } from "../../types";
import type { ScreenSwitcher, Screen } from "../../types";
import { LoginScreenModel } from "./LoginScreenModel";
import { LoginScreenView } from "./LoginScreenView";

/**
 * LoginScreenController - wires login behavior and username storage
 */
export class LoginScreenController extends ScreenController {
  private model: LoginScreenModel;
  private view: LoginScreenView;
  private screenSwitcher: ScreenSwitcher;
  private nextScreen: Screen = { type: "map" };

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

  setNextScreen(screen: Screen): void {
    this.nextScreen = screen;
  }

  /** Called when this screen becomes active */
  show(): void {
    // Only pre-fill username if coming from START (new game)
    // For RESUME, always require username entry
    // Check if nextScreen is map (START) vs other screens (RESUME)
    const isNewGame = this.nextScreen.type === "map";

    if (isNewGame) {
      // For new game, pre-fill if user exists
      const existingUsername = this.model.getExistingUsername();
      if (existingUsername) {
        this.view.setUsername(existingUsername);
      } else {
        this.view.setUsername(""); // Clear for new users
      }
    } else {
      // For resume, always clear to require fresh login
      this.view.setUsername("");
    }

    this.view.show();
  }

  hide(): void {
    this.view.hide();
  }

  private async handleLogin(username: string): Promise<void> {
    console.log("handleLogin called with username:", username);
    this.view.clearError();

    // Update model with username
    this.model.setUsername(username);

    // Validate
    if (!this.model.isValid()) {
      this.view.setError("Please enter a valid username");
      return;
    }

    try {
      // Save to dataset (SQLite database) - don't wait, do it in background
      this.model.login().catch((err) => {
        console.warn("Database save failed, but continuing:", err);
      });

      // Navigate to the destination screen (map for START, saved screen for RESUME)
      const destination = this.nextScreen || { type: "map" };
      console.log("Login successful, navigating to:", destination);
      this.screenSwitcher.switchToScreen(destination);
    } catch (error) {
      console.error("Login error:", error);
      // Even if there's an error, still navigate to the destination
      const destination = this.nextScreen || { type: "map" };
      this.screenSwitcher.switchToScreen(destination);
    }
  }

  getView(): LoginScreenView {
    return this.view;
  }
}
