import Konva from "konva";
import { NAVIGATION_BUTTON_DEFAULT_STYLES, STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";
import type { NavButton } from "../../types";

/**
 * Creates a Konva button group with hover effects
 * @param config Button configuration
 * @returns Konva.Group containing the button
 */
export function createKonvaButton(config: NavButton, onClick: (buttonId: string) => void): Konva.Group {
    const buttonGroup = new Konva.Group();

    // Calculate button dimensions
    const buttonWidth = NAVIGATION_BUTTON_DEFAULT_STYLES.width;
    const buttonHeight = NAVIGATION_BUTTON_DEFAULT_STYLES.height;

    // Calculate position
    let xPos = STAGE_WIDTH / 2; // Default center
    if (config.position?.x !== undefined) {
        xPos = config.position.x * STAGE_WIDTH;
    }

    let yPos = STAGE_HEIGHT / 2; // Default center
    if (config.position?.y !== undefined) {
        yPos = config.position.y * STAGE_HEIGHT;
    }

    // Create button rectangle
    const buttonRect = new Konva.Rect({
        x: xPos - buttonWidth / 2,
        y: yPos,
        width: buttonWidth,
        height: buttonHeight,
        fill: NAVIGATION_BUTTON_DEFAULT_STYLES.fill,
        stroke: NAVIGATION_BUTTON_DEFAULT_STYLES.stroke,
        strokeWidth: NAVIGATION_BUTTON_DEFAULT_STYLES.strokeWidth,
        cornerRadius: NAVIGATION_BUTTON_DEFAULT_STYLES.cornerRadius,
    });

    // Create button text
    const buttonText = new Konva.Text({
        x: xPos,
        y: yPos + buttonHeight / 2,
        text: config.label,
        fontSize: NAVIGATION_BUTTON_DEFAULT_STYLES.fontSize,
        fontFamily: NAVIGATION_BUTTON_DEFAULT_STYLES.fontFamily,
        fill: NAVIGATION_BUTTON_DEFAULT_STYLES.textFill,
        align: "center",
    });

    // Center text
    buttonText.offsetX(buttonText.width() / 2);
    buttonText.offsetY(buttonText.height() / 2);

    // Add elements to group
    buttonGroup.add(buttonRect);
    buttonGroup.add(buttonText);

    // Add hover effects
    buttonGroup.on("mouseenter", () => {
        document.body.style.cursor = "pointer";
        buttonRect.shadowEnabled(true);
        buttonRect.shadowBlur(10);
        buttonRect.shadowColor("black");
        buttonRect.shadowOpacity(0.3);
        buttonGroup.getLayer()?.draw();
    });

    buttonGroup.on("mouseleave", () => {
        document.body.style.cursor = "default";
        buttonRect.shadowEnabled(false);
        buttonGroup.getLayer()?.draw();
    });

    // Wire up click handler if provided
    buttonGroup.on("click", () => onClick(config.id));

    return buttonGroup;
}