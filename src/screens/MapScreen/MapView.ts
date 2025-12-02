import Konva from "konva";
import type { View, NavButton, MapScreenConfig, MapNode } from "../../types";
import { COLORS, STAGE_WIDTH, FONTS } from "../../constants";
import { createKonvaButton } from "../../utils/ui/NavigationButton.ts";
import { BackgroundHelper } from "../../utils/ui/BackgroundHelper.ts";
import { defaultMapConfig } from "../../configs/maps/MapScreenConfig.ts";
import { currentLevelIndex } from "../../types";

type NodeDescription = {
  group: Konva.Group;
  unlockIndex: number;
  x: number;
  y: number;
  height: number;
  width: number;
};

/**
 * View for the map screen
 */
export class MapScreenView implements View {
  private group: Konva.Group;
  private nodes: NodeDescription[] = [];

  /**
   * Factory method to create a MapScreenView from a configuration
   * @param config - Map screen configuration
   * @param handleButtonClick - Callback for button clicks
   * @param handleNodeClick - Callback for node clicks (receives node id)
   * @returns A new MapScreenView instance
   */
  static fromConfig(
    config: MapScreenConfig,
    handleButtonClick?: (buttonId: string) => void,
    handleNodeClick?: (nodeId: string) => void,
  ): MapScreenView {
    return new MapScreenView(config, handleButtonClick, handleNodeClick);
  }

  constructor(
    config: MapScreenConfig = defaultMapConfig,
    handleButtonClick?: (buttonId: string) => void,
    handleNodeClick?: (nodeId: string) => void,
  ) {
    this.group = new Konva.Group({ visible: false });

    // Add dungeon background
    const background = BackgroundHelper.createDungeonBackground();
    this.group.add(background);

    // Add torch lights in corners (optional)
    const topLeftTorch = BackgroundHelper.createTorchLight(80, 80);
    const topRightTorch = BackgroundHelper.createTorchLight(
      STAGE_WIDTH - 80,
      80,
    );
    this.group.add(topLeftTorch);
    this.group.add(topRightTorch);

    // Create nodes from configuration
    const nodeMap = new Map<string, NodeDescription>();
    config.nodes.forEach((nodeConfig: MapNode) => {
      const unlockIndex = nodeConfig.unlockIndex ?? 0;
      const node = this.createNodeFromConfig(
        nodeConfig,
        handleNodeClick,
        unlockIndex,
      );
      nodeMap.set(nodeConfig.id, node);
      this.nodes.push(node);
    });

    // Create arrows from configuration
    const arrows: Konva.Arrow[] = [];
    config.arrows.forEach((arrowConfig) => {
      const fromNode = nodeMap.get(arrowConfig.from);
      const toNode = nodeMap.get(arrowConfig.to);

      if (fromNode && toNode) {
        const arrow = this.createArrow(
          fromNode.x + fromNode.width,
          fromNode.y + fromNode.height / 2,
          toNode.x,
          toNode.y + toNode.height / 2,
        );
        arrows.push(arrow);
      }
    });

    // Add arrows first (so they appear behind nodes)
    arrows.forEach((arrow) => this.group.add(arrow));

    // Add nodes on top of arrows
    nodeMap.forEach((node) => this.group.add(node.group));

    // Create navigation buttons from configuration
    if (handleButtonClick) {
      config.buttons.forEach((buttonConfig: NavButton) => {
        const button = createKonvaButton(buttonConfig, handleButtonClick);
        this.group.add(button);
      });
    }
    this.updateNodeLockState(); // lock/unlock nodes if enough progress
  }

  /**
   * Lock/unlock node management
   */
  private updateNodeLockState(): void {
    this.nodes.forEach((node) => {
      const unlocked = node.unlockIndex <= currentLevelIndex;
      const g = node.group;
      g.setAttr("disabled", !unlocked);
      g.listening(unlocked);
      g.opacity(unlocked ? 1 : 0.4); // change in opacity if node is locked
    });
    this.group.getLayer()?.batchDraw();
  }

  /**
   * Creates a map node from configuration
   */
  private createNodeFromConfig(
    nodeConfig: MapNode,
    handleClick: ((nodeId: string) => void) | undefined,
    unlockIndex: number,
  ): NodeDescription {
    return this.createNode(
      nodeConfig.position.x,
      nodeConfig.position.y,
      nodeConfig.label,
      {
        height: nodeConfig.style?.height,
        width: nodeConfig.style?.width,
        isBoss: nodeConfig.isBoss,
      },
      handleClick ? () => handleClick(nodeConfig.id) : undefined,
      unlockIndex,
    );
  }

  private createNode(
    x: number,
    y: number,
    label: string,
    opts: { height?: number; width?: number; isBoss?: boolean } = {},
    handleClick?: () => void,
    unlockIndex: number = 0,
  ): NodeDescription {
    const height = opts.height ?? 120;
    const width = opts.width ?? height;
    const radius = 24;
    const isWide = width > height + 20;
    const pad = isWide ? 18 : 0;
    const isBoss = opts.isBoss ?? false;

    const group = new Konva.Group({ x, y });
    group.setAttr("unlockIndex", unlockIndex); // keep unlockIndex as Konva attribute

    // Border rectangle (dungeon room door/archway)
    const outer = new Konva.Rect({
      width,
      height,
      cornerRadius: radius,
      fill: COLORS.stoneMid,
      stroke: COLORS.nodeActive,
      strokeWidth: isBoss ? 8 : 6,
      shadowColor: COLORS.black,
      shadowBlur: 20,
      shadowOpacity: 0.8,
    });

    // Torch brackets for rooms (decorative fire glow)
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

    // Hover glow effect for rooms
    group.on("mouseenter", () => {
      if (group.getAttr("disabled")) return; // ignore hover if node is disabled

      outer.stroke(COLORS.torchOrange); // Torch-lit glow
      outer.shadowBlur(30); // Increased glow
      if (group.getStage()) {
        group.getStage()!.container().style.cursor = "pointer";
      }
      group.getLayer()?.batchDraw();
    });

    group.on("mouseleave", () => {
      if (group.getAttr("disabled")) return; // ignore hover if node is disabled

      outer.stroke(COLORS.nodeActive); // Return to normal
      outer.shadowBlur(20);
      if (group.getStage()) {
        group.getStage()!.container().style.cursor = "default";
      }
      group.getLayer()?.batchDraw();
    });

    // Click handler
    if (handleClick) {
      group.on("click", () => {
        if (group.getAttr("disabled")) return; // block click when node locked
        handleClick();
      });
    }

    return { group, unlockIndex, x, y, height, width };
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
    // refresh lock state every time you enter the map
    this.updateNodeLockState();
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }
}
