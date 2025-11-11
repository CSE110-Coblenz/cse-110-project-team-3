export type OptionIndex = 0 | 1 | 2;

export interface MiniGameQuestion {
  prompt: string;
  options: [string, string, string];
  correctIndex: OptionIndex;
}

export interface AnswerResult {
  correct: boolean;
  lives: number;
  gameOver: boolean;
}

/**
 * Encapsulates minigame state: rounds, lives, correctness.
 */
export class MiniGameModel {
  private questions: MiniGameQuestion[];
  private maxLives: number;
  private lives: number;
  private roundIndex = 0;
  private answeredCorrectly = false;

  constructor(questions?: MiniGameQuestion[], maxLives: number = 3) {
    this.questions = questions ?? DEFAULT_MINIGAME_QUESTIONS;
    this.maxLives = maxLives;
    this.lives = maxLives;
  }

  getLives(): number {
    return this.lives;
  }

  getMaxLives(): number {
    return this.maxLives;
  }

  getRoundIndex(): number {
    return this.roundIndex;
  }

  getCurrentQuestion(): MiniGameQuestion | null {
    return this.questions[this.roundIndex] ?? null;
  }

  isAnsweredCorrectly(): boolean {
    return this.answeredCorrectly;
  }

  isFinished(): boolean {
    return this.roundIndex >= this.questions.length;
  }

  /**
   * Process an answer for the current round.
   */
  answer(option: OptionIndex): AnswerResult {
    const q = this.getCurrentQuestion();
    if (!q) {
      return { correct: false, lives: this.lives, gameOver: true };
    }

    if (this.answeredCorrectly) {
      // Already solved; ignore further answers.
      return { correct: true, lives: this.lives, gameOver: this.lives <= 0 };
    }

    if (option === q.correctIndex) {
      this.answeredCorrectly = true;
      return { correct: true, lives: this.lives, gameOver: this.lives <= 0 };
    }

    // Wrong answer reduces a life.
    this.lives = Math.max(0, this.lives - 1);
    const gameOver = this.lives <= 0;
    return { correct: false, lives: this.lives, gameOver };
  }

  /**
   * Advance to the next round if available. Resets correctness.
   * Returns true if advanced to another round; false if finished.
   */
  nextRound(): boolean {
    if (this.isFinished()) return false;

    this.roundIndex += 1;
    this.answeredCorrectly = false;
    return !this.isFinished();
  }

  /** Reset the game to initial state. */
  reset(): void {
    this.lives = this.maxLives;
    this.roundIndex = 0;
    this.answeredCorrectly = false;
  }
}

/**
 * Default two-round minigame content. Replace with real content later.
 */
export const DEFAULT_MINIGAME_QUESTIONS: MiniGameQuestion[] = [
  {
    prompt:
      "Round 1: A 2 kg block slides on a frictionless surface with constant velocity. Which statement is correct?",
    options: [
      "A) Net force is non-zero",
      "B) Net force is zero",
      "C) Kinetic energy is zero",
    ],
    correctIndex: 1,
  },
  {
    prompt:
      "Round 2: A ball is thrown straight up. At the top of its path, which is true?",
    options: [
      "A) Velocity is zero; acceleration is zero",
      "B) Velocity is zero; acceleration is downward",
      "C) Velocity downward; acceleration is zero",
    ],
    correctIndex: 1,
  },
];

