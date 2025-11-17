import type { Screen } from "../../types";

export type SimulationOptionId = "A" | "B" | "C";

export interface SimulationOptionConfig {
  id: SimulationOptionId; // "A" | "B" | "C"
  label: string;            
  isCorrect: boolean;
}

export interface SimulationVideoConfig {
  src: string;  // "/Force.mp4"
  loop?: boolean;
  muted?: boolean;
}

export interface SimulationLayoutConfig {
  rightPanelWidth?: number;
  topOffset?: number;
  bottomOffset?: number;
  leftOffset?: number;
}

export interface SimulationScreenConfig {
  id: string; // "lev1-friction" or "lev2-projectile"

  // default content
  title: string;
  description: string;
  video: SimulationVideoConfig;
  options: SimulationOptionConfig[];

  // optional layout/style
  layout?: SimulationLayoutConfig;
  style?: {
    backgroundColor?: string;
    titleColor?: string;
    descriptionColor?: string;
  };

  // navigation buttons
  navigation: {
    backScreen: Screen; // same topic level
    nextScreen: Screen; // map
  };
}
