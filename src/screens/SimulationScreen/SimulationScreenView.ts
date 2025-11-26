import Konva from "konva";
import type { View, NavButton } from "../../types";
import type { SimulationScreenConfig } from "./types";
import { SimulationContentView } from "./SimulationContentView";
import { createKonvaButton } from "../../utils/ui/NavigationButton";

/**
 * View for simulation screens
 * Composes the core simulation content with BACK/NEXT navigation buttons
 * manages the enabled/disabled state of the NEXT button
 */
export class SimulationScreenView implements View {
  private group: Konva.Group;
  private content: SimulationContentView;
  private nextBtn!: Konva.Group; // reference to NEXT button to control its state

  constructor(
    config: SimulationScreenConfig,
    navigationButtons: NavButton[],
    onButtonClick: (buttonId: string) => void,
  ) {
    this.group = new Konva.Group();

    this.content = new SimulationContentView(config, () =>
      // unlock NEXT when answer is correct
      this.setNextEnabled(true),
    );
    this.group.add(this.content.getGroup());

    // Navigation buttons using configuration
    navigationButtons.forEach((buttonConfig) => {
      const buttonGroup = createKonvaButton(buttonConfig, (buttonId) => {
        // Prevent clicks if next button is disabled
        if (buttonId === "next" && buttonGroup.getAttr("disabled")) return;
        onButtonClick(buttonId);
      });

      // Store reference to next button for state management
      if (buttonConfig.id === "next") {
        this.nextBtn = buttonGroup;
      }

      this.group.add(buttonGroup);
    });

    // NEXT starts disabled until the user answers correctly
    this.setNextEnabled(false);
  }

  // Called when the correct answer is selected
  public setNextEnabled(enabled: boolean): void {
    this.nextBtn.setAttr("disabled", !enabled);
    this.nextBtn.opacity(enabled ? 1 : 0.5);
    this.nextBtn.listening(enabled);
    this.nextBtn.getLayer()?.batchDraw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  show(): void {
    this.group.visible(true);
    this.content.show();
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.content.hide();
    this.group.getLayer()?.draw();
  }
}
