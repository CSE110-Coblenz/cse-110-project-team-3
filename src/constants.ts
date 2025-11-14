// Stage dimensions
export const STAGE_WIDTH = 800;
export const STAGE_HEIGHT = 600;

// Color palette
export const COLORS = {
  bg: "#000000",
  nodeStroke: "#e6e6e6",
  nodeFill: "#111111",
  arrow: "#cfd2d6",
  buttonFill: "#e8e8e8",
  buttonStroke: "#cfcfcf",
  buttonText: "#1a1a1a",
  text: "#ffffff",
  black: "#000000",
  ground: "#e6e6e6",
};

export const FONT_FAMILY =
  "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace";

export const SIMULATION_CONSTANTS = {
  ground_level: STAGE_HEIGHT - 200,
  starting_x: 150,
  speed_multiplier: 3.0,
  error_margin: 3.0,
  speed_min: 0,
  speed_max: 200,
  speed_step: 1,
  angle_min: 0,
  angle_max: 90,
  angle_step: 5,
  projectile_speed_min: 0,
  projectile_speed_max: 200,
  projectile_speed_step: 1,
  simulation_min_distance_to_target: 200,
};

export const TOPIC_DEFAULT_STYLES = {
  title: {
    fontSize: 48,
    fontFamily: FONT_FAMILY,
    fill: COLORS.text,
    x: STAGE_WIDTH - STAGE_WIDTH / 2,
    y: 100,
  },
  description: {
    fontSize: 24,
    fontFamily: FONT_FAMILY,
    fill: COLORS.text,
    x: STAGE_WIDTH / 2,
    y: 200,
  },
};

export const NAVIGATION_BUTTON_DEFAULT_STYLES = {
  width: 200,
  height: 60,
  fill: COLORS.buttonFill,
  stroke: COLORS.buttonStroke,
  strokeWidth: 3,
  cornerRadius: 10,
  textFill: COLORS.buttonText,
  fontSize: 24,
  fontFamily: FONT_FAMILY
};