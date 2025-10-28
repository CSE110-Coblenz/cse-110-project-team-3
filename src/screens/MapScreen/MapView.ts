import Konva from "konva";
import type { View } from "../../type";
import {
  COLORS,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  FONT_FAMILY,
} from "../../constants";

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
    handleReferenceClick?: () => void,
    handleRulesClick?: () => void,
    handleExitClick?: () => void
  ) {
    this.group = new Konva.Group();

    // Background
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: COLORS.bg,
      cornerRadius: 8,
    });
    this.group.add(background);

    // Map Nodes
    const nodeA = this.createNode(100, STAGE_HEIGHT / 2 - 50, "1");
    const nodeB = this.createNode(300, STAGE_HEIGHT / 2 - 50, "2");
    const nodeC = this.createNode(500, STAGE_HEIGHT / 2 - 50, "Game 1", {
      height: 120,
      width: 250,
    });

    // Level Buttons
    const refBtn = this.createPillButton(
      "REFERENCE",
      STAGE_WIDTH - 260,
      24,
      220,
      64
    );
    const rulesBtn = this.createPillButton(
      "RULES",
      32,
      STAGE_HEIGHT - 92,
      160,
      64
    );
    const exitBtn = this.createPillButton(
      "EXIT",
      STAGE_WIDTH - 192,
      STAGE_HEIGHT - 96,
      160,
      64
    );

    // Link handle clicks
    if (handleReferenceClick) {
      refBtn.on("click", handleReferenceClick);
    }
    if (handleRulesClick) {
      rulesBtn.on("click", handleRulesClick);
    }
    if (handleExitClick) {
      exitBtn.on("click", handleExitClick);
    }

    // Arrows (add BEFORE nodes so nodes sit on top)
    const arrowAB = this.createArrow(
      nodeA.x + nodeA.width,
      nodeA.y + nodeA.height / 2,
      nodeB.x,
      nodeB.y + nodeB.height / 2
    );
    const arrowBC = this.createArrow(
      nodeB.x + nodeB.width,
      nodeB.y + nodeB.height / 2,
      nodeC.x,
      nodeC.y + nodeC.height / 2
    );

    // Add all elements to the main group
    this.group.add(refBtn, rulesBtn, exitBtn);
    this.group.add(nodeA.group, nodeB.group, nodeC.group);
    this.group.add(arrowAB, arrowBC);
  }

  private createNode(
    x: number,
    y: number,
    label: string,
    opts: { height?: number; width?: number } = {}
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
      (width - pad * 2) * 0.24
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
    return { group, x, y, height, width };
  }

  private createPillButton(
    label: string,
    x: number,
    y: number,
    width: number,
    height: number
  ): Konva.Group {
    const g = new Konva.Group({ x, y });

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
    });

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
      horizontalAlign: "center",
      fontFamily: FONT_FAMILY,
    });

    g.add(rect, text);

    return g;
  }

  private createArrow(
    x1: number,
    y1: number,
    x2: number,
    y2: number
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
