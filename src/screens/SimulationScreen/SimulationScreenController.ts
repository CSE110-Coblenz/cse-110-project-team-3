// SimulationScreenController.ts
// Behavior:
// - Wrong click: flash red, then revert to original fill.
// - Correct click (B): paint green, lock all options (no more clicks), enable NEXT.
// - NEXT stays disabled until B is selected.

import type { ScreenSwitcher } from "../../types";
import { COLORS } from "../../constants";
import { ScreenController } from "../../types";
import { SimulationScreenView } from "./SimulationScreenView";
import Konva from "konva";

export class SimulationScreenController extends ScreenController {
  private view: SimulationScreenView;
  private screenSwitcher: ScreenSwitcher;
  private answeredCorrectly = false;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.view = new SimulationScreenView(
      "Force",
      () => this.handleBackClick(),
      () => this.handleNextClick(),
      (key, node) => this.handleOptionClick(key, node),
    );
    this.screenSwitcher = screenSwitcher;
  }

  private handleBackClick = () => {
    console.log("Simulation: BACK clicked");
  };

  private handleNextClick = () => {
    if (!this.answeredCorrectly) return; 
    console.log("Simulation: NEXT clicked");
  };

  private handleOptionClick = (key: "A" | "B" | "C", node: Konva.Group) => {
    // If already solved, ignore any further option clicks
    if (this.answeredCorrectly) return;

    const rect = node.findOne<Konva.Rect>("Rect");
    if (!rect) return;

    if (key === "B") {
      // Correct: paint green, lock all options, enable NEXT
      rect.fill("#22c55e");
      node.setAttr("locked", true);
      node.listening(false);

      // lock the others as well
      this.view.getAllOptions().forEach((g) => {
        if (g !== node) {
          g.setAttr("locked", true);
          g.listening(false);
        }
      });

      node.getLayer()?.batchDraw();
      this.answeredCorrectly = true;
      this.view.setNextEnabled(true);
    } else {
      // Wrong: flash red briefly, then revert to base
      rect.fill("#ef4444");
      node.getLayer()?.batchDraw();
    }
  };

  getView(): SimulationScreenView {
    return this.view;
  }
}
