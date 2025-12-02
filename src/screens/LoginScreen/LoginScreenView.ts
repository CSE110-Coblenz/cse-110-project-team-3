import Konva from "konva";
import type { View } from "../../types";
import {
  COLORS,
  STAGE_WIDTH,
  STAGE_HEIGHT,
  FONTS,
} from "../../constants";

/**
 * LoginScreenView - Konva rendering for the login screen
 */
export class LoginScreenView implements View {
  private group: Konva.Group;
  private usernameInput: HTMLInputElement;
  private errorText?: Konva.Text;
  private submitBtn: Konva.Group;

  constructor(handlers: { onSubmit: (username: string) => void }) {
    this.group = new Konva.Group({ visible: false });

    // Background
    this.group.add(
      new Konva.Rect({
        x: 0,
        y: 0,
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        fill: COLORS.bg,
        cornerRadius: 8,
      }),
    );

    // Title
    const title = new Konva.Text({
      x: 0,
      y: 120,
      width: STAGE_WIDTH,
      align: "center",
      text: "ENTER YOUR USERNAME",
      fontSize: 36,
      fontStyle: "bold",
      fontFamily: FONTS.topic,
      fill: COLORS.text,
      listening: false,
    });
    this.group.add(title);

    // Create HTML input element for username
    this.usernameInput = document.createElement("input");
    this.usernameInput.type = "text";
    this.usernameInput.placeholder = "Username";
    this.usernameInput.style.position = "absolute";
    this.usernameInput.style.width = "400px";
    this.usernameInput.style.height = "50px";
    this.usernameInput.style.padding = "0 20px";
    this.usernameInput.style.fontSize = "24px";
    this.usernameInput.style.fontFamily = FONTS.topic;
    this.usernameInput.style.border = "4px solid " + COLORS.buttonStroke;
    this.usernameInput.style.borderRadius = "12px";
    this.usernameInput.style.backgroundColor = COLORS.buttonFill;
    this.usernameInput.style.color = COLORS.buttonText;
    this.usernameInput.style.outline = "none";
    this.usernameInput.style.display = "none"; // Hidden by default
    this.usernameInput.style.zIndex = "1000"; // Ensure it's on top
    this.updateInputPosition();

    // Handle Enter key press
    this.usernameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handlers.onSubmit(this.usernameInput.value);
      }
    });

    // Submit button
    const centerX = STAGE_WIDTH / 2;
    const buttonWidth = 200;
    const buttonHeight = 60;
    const buttonY = STAGE_HEIGHT / 2 + 60;

    this.submitBtn = this.createPillButton(
      "LOGIN",
      centerX - buttonWidth / 2,
      buttonY,
      buttonWidth,
      buttonHeight,
      () => {
        console.log("Login button clicked, username:", this.usernameInput.value);
        handlers.onSubmit(this.usernameInput.value);
      },
    );
    this.group.add(this.submitBtn);

    // Error message (initially hidden)
    this.errorText = new Konva.Text({
      x: 0,
      y: buttonY + 80,
      width: STAGE_WIDTH,
      align: "center",
      text: "",
      fontSize: 18,
      fontFamily: FONTS.topic,
      fill: "#ff4d4f",
      listening: false,
      visible: false,
    });
    this.group.add(this.errorText);
  }

  /** Create a pill-shaped button matching the style of other screens */
  private createPillButton(
    label: string,
    x: number,
    y: number,
    width: number,
    height: number,
    onClick?: () => void,
  ): Konva.Group {
    const g = new Konva.Group({ x, y, listening: true });

    const r = Math.min(height / 2 + 6, 24);
    const rect = new Konva.Rect({
      width,
      height,
      cornerRadius: r,
      fill: COLORS.buttonFill,
      stroke: COLORS.buttonStroke,
      strokeWidth: 4,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowBlur: 8,
      listening: true, // Enable click detection
    });

    const text = new Konva.Text({
      x: 0,
      y: 0,
      width,
      height,
      text: label,
      fill: COLORS.buttonText,
      fontSize: 28,
      fontStyle: "bold",
      align: "center",
      verticalAlign: "middle",
      horizontalAlign: "center",
      fontFamily: FONTS.topic,
      listening: true, // Enable click detection
    });

    // hover + click interactions
    if (onClick) {
      g.on("mouseenter", () => (document.body.style.cursor = "pointer"));
      g.on("mouseleave", () => (document.body.style.cursor = "default"));
      g.on("click", () => {
        if ((g as any)._disabled) return;
        onClick();
      });
      // Also enable pointer events on the group
      g.listening(true);
    }

    g.add(rect, text);
    return g;
  }

  /** Get the username input element */
  getUsernameInput(): HTMLInputElement {
    return this.usernameInput;
  }

  /** Set error message */
  setError(message: string): void {
    if (this.errorText) {
      this.errorText.text(message);
      this.errorText.visible(message.length > 0);
      this.group.getLayer()?.draw();
    }
  }

  /** Clear error message */
  clearError(): void {
    this.setError("");
  }

  /** Set username in input field */
  setUsername(username: string): void {
    this.usernameInput.value = username;
  }

  /** Update input position relative to container */
  private updateInputPosition(): void {
    const container = document.getElementById("container");
    if (container) {
      const rect = container.getBoundingClientRect();
      this.usernameInput.style.left = `${rect.left + STAGE_WIDTH / 2 - 200}px`;
      this.usernameInput.style.top = `${rect.top + STAGE_HEIGHT / 2 - 20}px`;
    } else {
      // Fallback to absolute positioning if container not found
      this.usernameInput.style.left = `${STAGE_WIDTH / 2 - 200}px`;
      this.usernameInput.style.top = `${STAGE_HEIGHT / 2 - 20}px`;
    }
  }

  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
    // Ensure button is listening
    if (this.submitBtn) {
      this.submitBtn.listening(true);
    }
    // Update position and show the input
    this.updateInputPosition();
    this.usernameInput.style.display = "block";
    // Small delay to ensure container is positioned
    setTimeout(() => {
      this.usernameInput.focus();
    }, 10);
  }

  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
    // Hide the input
    this.usernameInput.style.display = "none";
    this.clearError();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}
