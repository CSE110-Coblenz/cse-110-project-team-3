import Konva from "konva";
import { COLORS, FONT_FAMILY, STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export interface ButtonStyle {
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    cornerRadius?: number;
    textFill?: string;
    fontSize?: number;
    fontFamily?: string;
}

export interface ButtonPosition {
    x?: number;  // 0-1 relative position
    y?: number;  // 0-1 relative position
}

export interface ButtonConfig {
    id: string;
    label: string;
    position?: ButtonPosition;
    style?: ButtonStyle;
    onClick?: (id: string) => void;
}

const DEFAULT_BUTTON_STYLE: ButtonStyle = {
    width: 200,
    height: 60,
    fill: COLORS.buttonFill,
    stroke: COLORS.buttonStroke,
    strokeWidth: 3,
    cornerRadius: 10,
    textFill: COLORS.buttonText,
    fontSize: 24,
    fontFamily: FONT_FAMILY
};

/**
 * Creates a Konva button group with hover effects
 * @param config Button configuration
 * @returns Konva.Group containing the button
 */
export function createKonvaButton(config: ButtonConfig): Konva.Group {
    const buttonGroup = new Konva.Group();

    // Calculate button dimensions
    const buttonWidth = config.style?.width || DEFAULT_BUTTON_STYLE.width!;
    const buttonHeight = config.style?.height || DEFAULT_BUTTON_STYLE.height!;

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
        fill: config.style?.fill || DEFAULT_BUTTON_STYLE.fill,
        stroke: config.style?.stroke || DEFAULT_BUTTON_STYLE.stroke,
        strokeWidth: config.style?.strokeWidth || DEFAULT_BUTTON_STYLE.strokeWidth,
        cornerRadius: config.style?.cornerRadius || DEFAULT_BUTTON_STYLE.cornerRadius,
    });

    // Create button text
    const buttonText = new Konva.Text({
        x: xPos,
        y: yPos + buttonHeight / 2,
        text: config.label,
        fontSize: config.style?.fontSize || DEFAULT_BUTTON_STYLE.fontSize,
        fontFamily: config.style?.fontFamily || DEFAULT_BUTTON_STYLE.fontFamily,
        fill: config.style?.textFill || DEFAULT_BUTTON_STYLE.textFill,
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
    if (config.onClick) {
        buttonGroup.on("click", () => config.onClick!(config.id));
    }

    return buttonGroup;
}