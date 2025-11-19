import Konva from "konva";
import type { View, NavButton } from "../../types";
import {
  COLORS,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  FONT_FAMILY,
} from "../../constants";
import { createKonvaButton } from "../../utils/ui/NavigationButton.ts";
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

    // Background
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: COLORS.bg,
    });
    this.group.add(background);

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
    opts: { height?: number; width?: number } = {},
    handleClick?: (level: string) => void,
  ): NodeDescription {
    const height = opts.height ?? 120;
    const width = opts.width ?? height;
    const radius = 24;
    const isWide = width > height + 20;
    const pad = isWide ? 18 : 0;

    const group = new Konva.Group({ x, y });

    // Border rectangle
    const outer = new Konva.Rect({
      width,
      height,
      cornerRadius: radius,
      fill: COLORS.nodeFill,
      stroke: COLORS.nodeStroke,
      strokeWidth: 6,
      shadowColor: "#000",
      shadowBlur: 10,
      shadowOpacity: 0.3,
    });

    // For wide nodes, pick a size that respects BOTH height and width
    const wideFontSize = Math.min(
      (height - pad * 2) * 0.58,
      (width - pad * 2) * 0.24,
    );

    const text = new Konva.Text({
      x: pad,
      y: pad,
      width: width - pad * 2,
      height: height - pad * 2,
      text: label,
      fill: COLORS.text,
      fontFamily: FONT_FAMILY,
      fontStyle: "bold",
      fontSize: isWide ? wideFontSize : 64,
      align: "center",
      verticalAlign: "middle",
      wrap: isWide ? "word" : "none",
      lineHeight: 1.0,
    });

    group.add(outer, text);

    // Click handler
    if (handleClick) {
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