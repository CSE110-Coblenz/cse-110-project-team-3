import type { Screen } from "../../types.ts";

/**
 * Button position on the screen
 */
export interface ButtonPosition {
  x?: number; // x position relative to screen width (0-1)
  y?: number; // y position relative to screen height (0-1)
  align?: "left" | "center" | "right";
}

/**
 * Topic screen button configuration
 * - id: Unique identifier for the button
 * - label: Text displayed on the button
 * - target: Screen to navigate to when the button is clicked
 * - position: Optional position of the button on the screen
 * - style: Optional styling for the button
 */
export interface TopicButton {
  id: string;
  label: string;
  target: Screen;
  position?: ButtonPosition;
  style?: {
    fill?: string;
    color?: string;
    textFill?: string;
    stroke?: string;
    width?: number;
    height?: number;
  };
}

/**
 * Configuration for a topic screen
 * - title: Title of the topic screen
 * - description: Description text for the topic
 * - buttons: Array of buttons to display on the screen
 * - style: Optional styling for the screen
 */
export interface TopicScreenConfig {
  title: string;
  description?: string;
  /**
   * Optional richer description made of text segments.
   * Each segment can enable `bold` to indicate this phrase should be rendered bold.
   * If present, `descriptionSegments` will be used in preference to `description`.
   */
  descriptionSegments?: Array<{ text: string; bold?: boolean; color?: string }>;
  buttons: TopicButton[];
  style?: {
    titleColor: string;
    descriptionColor: string;
    backgroundColor: string;
  };
}
