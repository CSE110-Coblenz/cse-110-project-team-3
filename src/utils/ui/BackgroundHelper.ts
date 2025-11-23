import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT, COLORS } from "../../constants";

export class BackgroundHelper {
  /**
   * Creates a textured dungeon background
   */
  static createDungeonBackground(): Konva.Group {
    const group = new Konva.Group();

    // Base dark rectangle
    const base = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: COLORS.bg,
    });
    group.add(base);

    // Load stone texture (if file exists)
    const textureImg = new Image();
    textureImg.src = "../../../dungeon_wall.jpg"; // Note: Use relative from public folder
    textureImg.onload = () => {
      const textureImage = new Konva.Image({
        x: 0,
        y: 0,
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        image: textureImg,
        opacity: 0.3, // Subtle texture overlay
      });
      group.add(textureImage);
      textureImage.moveToBottom(); // Place under vignette
      base.moveToBottom(); // Keep base at very bottom
      group.getLayer()?.batchDraw();
    };

    // Add vignette effect (darker edges)
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
        "rgba(0,0,0,0)", // Transparent center
        1,
        "rgba(0,0,0,0.6)", // Dark edges
      ],
    });
    group.add(vignette);

    return group;
  }

  /**
   * Creates animated torch flames for corners/edges
   */
  static createTorchLight(x: number, y: number): Konva.Circle {
    const torch = new Konva.Circle({
      x,
      y,
      radius: 60,
      fillRadialGradientStartPoint: { x: 0, y: 0 },
      fillRadialGradientStartRadius: 0,
      fillRadialGradientEndPoint: { x: 0, y: 0 },
      fillRadialGradientEndRadius: 60,
      fillRadialGradientColorStops: [
        0,
        COLORS.torchYellow,
        0.3,
        COLORS.torchOrange,
        1,
        "rgba(255,107,53,0)", // Fade to transparent
      ],
      opacity: 0.4,
    });

    // Flickering animation
    const anim = new Konva.Animation((frame) => {
      if (!frame) return;
      const flicker = Math.sin(frame.time / 100) * 0.1 + 0.9;
      torch.opacity(0.4 * flicker);
      torch.radius(60 + Math.sin(frame.time / 200) * 5);
    }, torch.getLayer());

    anim.start();

    return torch;
  }
}
