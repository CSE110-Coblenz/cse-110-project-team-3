import Konva from "konva";
import type { View } from "../../types";
import { COLORS, STAGE_WIDTH, STAGE_HEIGHT, FONTS } from "../../constants.ts";

/**
 * MenuScreenView - Konva rendering for the welcome screen
 */
export class MenuScreenView implements View {
  private group: Konva.Group;

  private resumeBtn?: Konva.Group;

  constructor(handlers: {
    onStart: () => void;
    onResume: () => void;
    onRules: () => void;
    onQuit: () => void;
  }) {
    this.group = new Konva.Group({ visible: false });

    // Background - Animated dungeon entrance GIF
    const backgroundRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: COLORS.bg,
      cornerRadius: 8,
    });
    this.group.add(backgroundRect);

    // Load and display dungeon entrance GIF
    const gifImage = new Image();
    gifImage.src = "/dungeon_entrance.gif";
    gifImage.onload = () => {
      const bgImage = new Konva.Image({
        x: 0,
        y: 0,
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        image: gifImage,
        listening: false,
      });
      this.group.add(bgImage);
      bgImage.moveToBottom(); // Ensure it's behind everything
      backgroundRect.moveToBottom();
      this.group.getLayer()?.batchDraw();
    };

    // Add vignette overlay for depth and readability
    const vignette = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fillRadialGradientStartPoint: { x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 },
      fillRadialGradientStartRadius: 0,
      fillRadialGradientEndPoint: { x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 },
      fillRadialGradientEndRadius: STAGE_WIDTH / 1.5,
      fillRadialGradientColorStops: [
        0,
        "rgba(0,0,0,0.3)", // Slightly dark center
        1,
        "rgba(0,0,0,0.8)", // Very dark edges
      ],
      listening: false,
    });
    this.group.add(vignette);

    // Title with dramatic styling
    // Shadow layer (depth effect)
    const shadowTitle = new Konva.Text({
      x: 0,
      y: 82, // Offset from main title for 3D effect
      width: STAGE_WIDTH,
      align: "center",
      text: "PHUNGEON",
      fontSize: 72,
      fontStyle: "bold",
      fontFamily: FONTS.dungeon,
      fill: COLORS.bgDark,
      listening: false,
    });
    this.group.add(shadowTitle);

    // Main title with torch-fire gradient
    const mainTitle = new Konva.Text({
      x: 0,
      y: 80,
      width: STAGE_WIDTH,
      align: "center",
      text: "PHUNGEON",
      fontSize: 72,
      fontStyle: "bold",
      fontFamily: FONTS.dungeon,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 0, y: 72 },
      fillLinearGradientColorStops: [
        0,
        COLORS.torchYellow, // Top: torch glow
        0.5,
        COLORS.torchOrange, // Middle: flame
        1,
        COLORS.emberRed, // Bottom: ember
      ],
      stroke: COLORS.rustBrown,
      strokeWidth: 3,
      shadowColor: COLORS.torchOrange,
      shadowBlur: 30,
      shadowOpacity: 0.8,
      listening: false,
    });
    this.group.add(mainTitle);

    // Add pulsing glow animation to main title
    const titleAnim = new Konva.Animation((frame) => {
      if (!frame) return;
      const pulse = Math.sin(frame.time / 800) * 0.3 + 0.7;
      mainTitle.shadowBlur(30 * pulse);
    }, mainTitle.getLayer());
    titleAnim.start();

    // Buttons stack
    const centerX = STAGE_WIDTH / 2;
    const buttonWidth = 300;
    const buttonHeight = 64;
    let startY = 240;

    const startBtn = this.createPillButton(
      "START",
      centerX - buttonWidth / 2,
      startY,
      buttonWidth,
      buttonHeight,
      handlers.onStart,
    );
    this.group.add(startBtn);
    startY += 80;

    this.resumeBtn = this.createPillButton(
      "RESUME",
      centerX - buttonWidth / 2,
      startY,
      buttonWidth,
      buttonHeight,
      () => {
        console.log("Resume button clicked in view");
        handlers.onResume();
      },
    );
    this.group.add(this.resumeBtn);
    startY += 80;

    const rulesBtn = this.createPillButton(
      "RULES",
      centerX - buttonWidth / 2,
      startY,
      buttonWidth,
      buttonHeight,
      handlers.onRules,
    );
    this.group.add(rulesBtn);
    startY += 80;

    const quitBtn = this.createPillButton(
      "QUIT",
      centerX - buttonWidth / 2,
      startY,
      buttonWidth,
      buttonHeight,
      handlers.onQuit,
    );
    this.group.add(quitBtn);
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

    // Create pill-shaped button rectangle with shadow (stone tablet base)
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
    });
    g.add(rect);

    // Chiseled edge highlight (inner highlight for 3D carved stone effect)
    const chiselHighlight = new Konva.Rect({
      x: 2,
      y: 2,
      width: width - 4,
      height: height - 4,
      stroke: COLORS.stoneLight,
      strokeWidth: 2,
      cornerRadius: r - 2,
      opacity: 0.3,
      listening: false,
    });
    g.add(chiselHighlight);

    // Create button text with centered alignment (carved text effect)
    const text = new Konva.Text({
      x: 0,
      y: 0,
      width,
      height,
      text: label,
      fill: COLORS.buttonText,
      fontSize: 32,
      fontStyle: "bold",
      align: "center",
      verticalAlign: "middle",
      fontFamily: FONTS.dungeon,
      shadowColor: COLORS.black,
      shadowBlur: 2,
      shadowOpacity: 0.8,
      shadowOffsetY: 2, // Engraved text effect
    });
    g.add(text);

    // Add hover effects - stone tablet glows like torchlight
    g.on("mouseenter", () => {
      if ((g as any)._disabled) return;
      document.body.style.cursor = "pointer";
      rect.fill(COLORS.buttonHover); // Lit stone
      rect.shadowBlur(16); // Stronger glow
      text.fill(COLORS.textHighlight); // Torch yellow glow
      g.getLayer()?.batchDraw();
    });

    g.on("mouseleave", () => {
      if ((g as any)._disabled) return;
      document.body.style.cursor = "default";
      rect.fill(COLORS.buttonFill); // Return to stone tablet
      rect.shadowBlur(8); // Normal shadow
      text.fill(COLORS.buttonText); // Return to normal text
      g.getLayer()?.batchDraw();
    });

    // Click handler
    if (onClick) {
      g.on("click", () => {
        console.log("Button clicked, disabled:", (g as any)._disabled);
        if ((g as any)._disabled) {
          console.log("Button is disabled, ignoring click");
          return;
        }
        console.log("Calling onClick handler");
        onClick();
      });
      // Also try tap event for mobile
      g.on("tap", () => {
        if ((g as any)._disabled) return;
        onClick();
      });
    }

    return g;
  }

  /** Enable/disable visual state for Resume */
  setResumeEnabled(enabled: boolean) {
    console.log("setResumeEnabled called with:", enabled);
    if (!this.resumeBtn) {
      console.warn("Resume button not found");
      return;
    }

    (this.resumeBtn as any)._disabled = !enabled;
    console.log("Resume button disabled state:", !enabled);

    // Tint when disabled
    const rect = this.resumeBtn.findOne<Konva.Rect>("Rect");
    const text = this.resumeBtn.findOne<Konva.Text>("Text");
    if (rect && text) {
      rect.fill(enabled ? COLORS.buttonFill : "#bdbdbd");
      text.fill(enabled ? COLORS.buttonText : "#555");
    }
    // Ensure button is listening when enabled
    if (enabled) {
      this.resumeBtn.listening(true);
    }
    this.group.getLayer()?.draw();
  }

  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}
