import Konva from "konva";
import { NAVIGATION_BUTTON_DEFAULT_STYLES, STAGE_WIDTH, STAGE_HEIGHT, COLORS } from "../../constants";
import type { NavButton } from "../../types";

/**
 * Creates a Konva button group with hover effects (pill-button style)
 * @param config Button configuration
 * @returns Konva.Group containing the button
 */
export function createKonvaButton(config: NavButton, onClick: (buttonId: string) => void): Konva.Group {
    // Calculate button dimensions
    const buttonWidth = config.style?.width || NAVIGATION_BUTTON_DEFAULT_STYLES.width;
    const buttonHeight = config.style?.height || NAVIGATION_BUTTON_DEFAULT_STYLES.height;

    // Calculate position
    let xPos = STAGE_WIDTH / 2; // Default center
    if (config.position?.x !== undefined) {
        xPos = config.position.x * STAGE_WIDTH;
    }

    let yPos = STAGE_HEIGHT / 2; // Default center
    if (config.position?.y !== undefined) {
        yPos = config.position.y * STAGE_HEIGHT;
    }

    const buttonGroup = new Konva.Group({ x: xPos, y: yPos });

    // Use config styles or fall back to defaults, matching SimulationScreenView
    const baseFill = config.style?.fill || NAVIGATION_BUTTON_DEFAULT_STYLES.fill;
    const strokeColor = config.style?.stroke || NAVIGATION_BUTTON_DEFAULT_STYLES.stroke;
    const textFill = config.style?.textFill || NAVIGATION_BUTTON_DEFAULT_STYLES.textFill;

    // Create pill-shaped button rectangle with shadow (stone tablet base)
    const buttonRect = new Konva.Rect({
        width: buttonWidth,
        height: buttonHeight,
        cornerRadius: Math.min(buttonHeight / 2 + 6, 24), // Pill shape like SimulationScreenView
        fill: baseFill,
        stroke: strokeColor,
        strokeWidth: 4,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowBlur: 8,
    });

    // Chiseled edge highlight (inner highlight for 3D carved stone effect)
    const chiselHighlight = new Konva.Rect({
        x: 2,
        y: 2,
        width: buttonWidth - 4,
        height: buttonHeight - 4,
        stroke: COLORS.stoneLight,
        strokeWidth: 2,
        cornerRadius: Math.min(buttonHeight / 2 + 4, 22),
        opacity: 0.3,
        listening: false,
    });

    // Create button text with centered alignment (carved text effect)
    const buttonText = new Konva.Text({
        width: buttonWidth,
        height: buttonHeight,
        text: config.label,
        fill: textFill,
        fontSize: NAVIGATION_BUTTON_DEFAULT_STYLES.fontSize,
        fontStyle: "bold",
        align: "center",
        verticalAlign: "middle",
        fontFamily: NAVIGATION_BUTTON_DEFAULT_STYLES.fontFamily,
        shadowColor: COLORS.black,
        shadowBlur: 2,
        shadowOpacity: 0.8,
        shadowOffsetY: 2,  // Engraved text effect
    });

    // Add elements to group
    buttonGroup.add(buttonRect);
    buttonGroup.add(chiselHighlight);
    buttonGroup.add(buttonText);

    // Add hover effects - stone tablet glows like torchlight
    buttonGroup.on("mouseenter", () => {
        if (buttonGroup.getAttr("disabled") || buttonGroup.getAttr("locked")) return;
        document.body.style.cursor = "pointer";
        buttonRect.fill(COLORS.buttonHover);  // Lit stone
        buttonRect.shadowBlur(16);  // Stronger glow
        buttonText.fill(COLORS.textHighlight);  // Torch yellow glow
        buttonGroup.getLayer()?.batchDraw();
    });

    buttonGroup.on("mouseleave", () => {
        if (buttonGroup.getAttr("disabled") || buttonGroup.getAttr("locked")) return;
        document.body.style.cursor = "default";
        buttonRect.fill(baseFill);  // Return to stone tablet
        buttonRect.shadowBlur(8);  // Normal shadow
        buttonText.fill(textFill);  // Return to normal text
        buttonGroup.getLayer()?.batchDraw();
    });

    // Wire up click handler if provided
    buttonGroup.on("click", () => onClick(config.id));

    return buttonGroup;
}