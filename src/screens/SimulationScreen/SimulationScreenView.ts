import Konva from "konva";

export const STAGE_WIDTH = 800;
export const STAGE_HEIGHT = 600;

const currentText = "Force";

const stage = new Konva.Stage({
  container: "container",
  width: STAGE_WIDTH,
  height: STAGE_HEIGHT,
});

const layer = new Konva.Layer();
stage.add(layer);

// Background
const background = new Konva.Rect({
  width: STAGE_WIDTH,
  height: STAGE_HEIGHT,
  fill: "black",
});
layer.add(background);

// Title
const title = new Konva.Text({
  text: `SIMULATION: ${currentText}`,
  fontStyle: "bold",
  fontSize: 60,
  fontFamily: "Arial",
  fill: "grey",
  x: STAGE_WIDTH / 2,
  y: STAGE_HEIGHT / 2 - 270,
});
title.offsetX(title.width() / 2);
layer.add(title);


function createButton(x: number, y: number, label: string) {
  const group = new Konva.Group({ x, y });

  const button = new Konva.Rect({
    width: 100,
    height: 40,
    fill: "gray",
    cornerRadius: 8,
  });

  const text = new Konva.Text({
    text: label,
    fontSize: 22,
    fontStyle: "bold",
    fontFamily: "Arial",
    fill: "white",
    x: 18,
    y: 10,
  });

  group.add(button);
  group.add(text);
  layer.add(group);

  group.on("click", () => {
    const isGray = button.fill() === "gray";
    button.fill(isGray ? "white" : "gray");
    text.fill(isGray ? "black" : "white");
    layer.batchDraw();
  });

  return group;
}

// Create buttons
createButton(20, STAGE_HEIGHT - 60, "BACK");
createButton(STAGE_WIDTH - 120, STAGE_HEIGHT - 60, "NEXT");

layer.draw();