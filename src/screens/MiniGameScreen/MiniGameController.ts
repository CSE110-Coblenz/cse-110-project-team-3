import type { ScreenSwitcher } from "../../types";
import { ScreenController } from "../../types";
import { MiniGameView } from "./MiniGameView";
import {
  MiniGameModel,
  type OptionIndex,
  type MiniGameQuestion,
} from "./MiniGameModel";

/**
 * Controller orchestrating minigame flow across two rounds.
 * Not wired into main yet; export for future integration.
 */
export class MiniGameController extends ScreenController {
  private view: MiniGameView;
  private model: MiniGameModel;
  // Optional: for future navigation when wiring
  private screenSwitcher?: ScreenSwitcher;

  constructor(questions?: MiniGameQuestion[], screenSwitcher?: ScreenSwitcher) {
    super();
    this.model = new MiniGameModel(questions, 3);
    this.view = new MiniGameView(
      () => this.handleBackClick(),
      () => this.handleNextClick(),
      (index, _node) => this.handleOptionClick(index),
    );
    this.screenSwitcher = screenSwitcher;

    // Initialize first round UI
    const q = this.model.getCurrentQuestion();
    if (q) {
      this.view.setQuestion(q);
    }
    this.view.setLives(this.model.getLives());
  }

  private handleBackClick = () => {
    // Placeholder: when wired, navigate back to map or previous screen
    console.log("MiniGame: BACK clicked");
  };

  private handleNextClick = () => {
    if (!this.model.isAnsweredCorrectly()) return;

    // Move to next round or finish
    const advanced = this.model.nextRound();
    if (!advanced) {
      // Finished both rounds
      console.log("MiniGame: Completed");
      // In future: this.screenSwitcher?.switchToScreen({ type: "map" });
      return;
    }

    // Setup next question
    const q = this.model.getCurrentQuestion();
    if (q) this.view.setQuestion(q);
    this.view.setNextEnabled(false);
    this.view.unlockOptions();
  };

  private handleOptionClick = (index: OptionIndex) => {
    if (this.model.isAnsweredCorrectly()) return;

    const result = this.model.answer(index);
    this.view.setLives(result.lives);

    if (result.correct) {
      this.view.markCorrect(index);
      this.view.setNextEnabled(true);
    } else {
      this.view.flashWrong(index);

      if (result.gameOver) {
        console.log("MiniGame: Game Over");
        this.view.lockOptions();
        this.view.setNextEnabled(false);
      }
    }
  };

  getView(): MiniGameView {
    return this.view;
  }
}

