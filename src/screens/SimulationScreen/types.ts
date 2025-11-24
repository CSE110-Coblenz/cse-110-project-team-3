import type { Screen } from "../../types";

export type SimulationOptionId = "A" | "B" | "C";

export interface SimulationOptionConfig {
  id: SimulationOptionId; // "A" | "B" | "C"
  label: string;
  isCorrect: boolean;
}

export interface SimulationVideoConfig {
  src: string; // e.g. "/trajectory.mp4"
  loop?: boolean;
  muted?: boolean;
}

export interface SimulationPictureConfig {
  src: string; // e.g. "/force.png"
}

export interface SimulationLayoutConfig {
  rightPanelWidth?: number;
  topOffset?: number;
  bottomOffset?: number;
  leftOffset?: number;
}

export interface SimulationScreenConfig {
  id: string; // "lev1-friction" or "lev2-projectile"

  // Default textual content
  title: string;
  description: string;

  // Visual content: either a looping video OR a static picture.
  video?: SimulationVideoConfig;
  picture?: SimulationPictureConfig;

  // Multiple-choice options
  options: SimulationOptionConfig[];

  // Optional layout/style overrides
  layout?: SimulationLayoutConfig;
  style?: {
    backgroundColor?: string;
    titleColor?: string;
    descriptionColor?: string;
  };

  // Navigation targets for BACK/NEXT buttons
  navigation: {
    backScreen: Screen; // previous topic level
    nextScreen: Screen; // usually the map
  };
}
