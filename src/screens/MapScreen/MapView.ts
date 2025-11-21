import Konva from "konva";
import type { View, NavButton } from "../../types";
import {
  COLORS,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  FONTS,
} from "../../constants";
import { createKonvaButton } from "../../utils/ui/NavigationButton.ts";
import { BackgroundHelper } from "../../utils/ui/BackgroundHelper.ts";
import { MapScreenNavigationButtons } from "../../configs/NavigationButtons/Map.ts";

type NodeDescription = {
  group: Konva.Group;
  x: number;
  y: number;
  height: number;
  width: number;
};

export class MapScreenView implements View {
  private group: Konva.Group;

  constructor(
    handleButtonClick?: (buttonId: string) => void,
    handleNodeClick?: (level: string) => void,
  ) {
    this.group = new Konva.Group();

    this.group = new Konva.Group({ visible: false });
  
    // Add dungeon background
    const background = BackgroundHelper.createDungeonBackground();
    this.group.add(background);
    
    // Add torch lights in corners (optional)
    const topLeftTorch = BackgroundHelper.createTorchLight(80, 80);
    const topRightTorch = BackgroundHelper.createTorchLight(STAGE_WIDTH - 80, 80);
    this.group.add(topLeftTorch);
    this.group.add(topRightTorch);

    // Map Nodes
    const nodeA = this.createNode(
      100,
      STAGE_HEIGHT / 2 - 50,
      "1",
      {},
      handleNodeClick,
    );
    const nodeB = this.createNode(
      300,
      STAGE_HEIGHT / 2 - 50,
      "2",
      {},
      handleNodeClick,
    );
    const nodeC = this.createNode(
      500,
      STAGE_HEIGHT / 2 - 50,
      "Game 1",
      {
        height: 120,
        width: 250,
      },
      handleNodeClick,
    );

    // Arrows (add BEFORE nodes so nodes sit on top)
    const arrowAB = this.createArrow(
      nodeA.x + nodeA.width,
      nodeA.y + nodeA.height / 2,
      nodeB.x,
      nodeB.y + nodeB.height / 2,
    );
    const arrowBC = this.createArrow(
      nodeB.x + nodeB.width,
      nodeB.y + nodeB.height / 2,
      nodeC.x,
      nodeC.y + nodeC.height / 2,
    );

    // Add arrows
    this.group.add(arrowAB, arrowBC);

    // Add nodes
    this.group.add(nodeA.group, nodeB.group, nodeC.group);

    // Create navigation buttons from configuration
    if (handleButtonClick) {
      MapScreenNavigationButtons.forEach((buttonConfig: NavButton) => {
        const button = createKonvaButton(buttonConfig, handleButtonClick);
        this.group.add(button);
      });
    }
  }

  private createNode(
    x: number,
    y: number,
    label: string,
    opts: { height?: number; width?: number; locked?: boolean; isBoss?: boolean } = {},
    handleClick?: (level: string) => void,
  ): NodeDescription {
    const height = opts.height ?? 120;
    const width = opts.width ?? height;
    const radius = 24;
    const isWide = width > height + 20;
    const pad = isWide ? 18 : 0;
    const locked = opts.locked ?? false;
    const isBoss = opts.isBoss ?? false;

    const group = new Konva.Group({ x, y });

    // Border rectangle (dungeon room door/archway)
    const outer = new Konva.Rect({
      width,
      height,
      cornerRadius: radius,
      fill: locked ? COLORS.nodeFill : COLORS.stoneMid,
      stroke: locked ? COLORS.nodeStroke : COLORS.nodeActive,
      strokeWidth: isBoss ? 8 : 6,
      shadowColor: COLORS.black,
      shadowBlur: 20,
      shadowOpacity: 0.8,
    });

    // Torch brackets for unlocked rooms (decorative fire glow)
    if (!locked) {
      const leftTorch = new Konva.Circle({
        x: 15,
        y: height / 2,
        radius: 8,
        fill: COLORS.torchOrange,
        shadowColor: COLORS.torchYellow,
        shadowBlur: 15,
        opacity: 0.8,
        listening: false,
      });
      const rightTorch = new Konva.Circle({
        x: width - 15,
        y: height / 2,
        radius: 8,
        fill: COLORS.torchOrange,
        shadowColor: COLORS.torchYellow,
        shadowBlur: 15,
        opacity: 0.8,
        listening: false,
      });
      group.add(leftTorch);
      group.add(rightTorch);
    }

    // Lock icon for locked rooms
    if (locked) {
      const lock = new Konva.Text({
        x: width / 2 - 15,
        y: 20,
        text: "🔒",
        fontSize: 30,
        listening: false,
      });
      group.add(lock);
    }

    // For wide nodes, pick a size that respects BOTH height and width
    const wideFontSize = Math.min(
      (height - pad * 2) * 0.58,
      (width - pad * 2) * 0.24,
    );

    const text = new Konva.Text({
      x: pad,
      y: locked ? pad + 30 : pad,  // Offset if lock is present
      width: width - pad * 2,
      height: locked ? height - pad * 2 - 30 : height - pad * 2,
      text: label,
      fill: locked ? COLORS.textDim : COLORS.text,
      fontFamily: FONTS.dungeon,
      fontStyle: "bold",
      fontSize: isWide ? wideFontSize : 64,
      align: "center",
      verticalAlign: "middle",
      wrap: isWide ? "word" : "none",
      lineHeight: 1.0,
      shadowColor: COLORS.black,
      shadowBlur: 3,
      shadowOpacity: 1,
    });

    group.add(outer, text);

    // Hover glow effect for unlocked rooms
    if (!locked) {
      group.on("mouseenter", () => {
        outer.stroke(COLORS.torchOrange);  // Torch-lit glow
        outer.shadowBlur(30);  // Increased glow
        if (group.getStage()) {
          group.getStage()!.container().style.cursor = "pointer";
        }
        group.getLayer()?.batchDraw();
      });

      group.on("mouseleave", () => {
        outer.stroke(COLORS.nodeActive);  // Return to normal
        outer.shadowBlur(20);
        if (group.getStage()) {
          group.getStage()!.container().style.cursor = "default";
        }
        group.getLayer()?.batchDraw();
      });
    }

    // Click handler
    if (handleClick && !locked) {
      group.on("click", () => handleClick(label));
    }

    return { group, x, y, height, width };
  }

  private createArrow(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): Konva.Arrow {
    return new Konva.Arrow({
      points: [x1, y1, x2, y2],
      pointerLength: 14,
      pointerWidth: 14,
      stroke: COLORS.nodeStroke,
      fill: COLORS.nodeStroke,
      strokeWidth: 6,
      lineCap: "round",
      lineJoin: "round",
      listening: false,
    });
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }
}