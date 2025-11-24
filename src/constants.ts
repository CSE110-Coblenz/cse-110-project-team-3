// Stage dimensions
export const STAGE_WIDTH = 800;
export const STAGE_HEIGHT = 600;

// Color palette
export const COLORS = {
  // Dungeon atmosphere
  bg: "#1a1410", // Dark stone brown
  bgDark: "#0f0a08", // Deeper shadow brown for depth

  // Stone textures
  stoneLight: "#4a4238", // Lighter stone for highlights
  stoneMid: "#2d2620", // Mid-tone stone

  arrow: "#cfd2d6",

  // Torch/fire warm accents
  torchOrange: "#ff6b35", // Bright torch flame
  torchYellow: "#ffb84d", // Torch glow
  emberRed: "#d94632", // Hot ember red

  rustBrown: "#8b4513", // Rusted metal

  // Text colors
  text: "#f4e8d0", // Parchment/aged paper color
  textHighlight: "#ffb84d", // Highlighted text (torch yellow)

  // Button colors (stone tablets)
  buttonFill: "#3d3328", // Stone tablet
  buttonStroke: "#6b5d4f", // Chiseled edges
  buttonText: "#f4e8d0", // Carved text
  buttonHover: "#4a4238", // Lit stone

  // Map node colors (dungeon rooms)
  nodeStroke: "#8b7355", // Door frame
  nodeActive: "#ff6b35", // Torch-lit active room

  ground: "#4a4238", // Stone floor

  // Utility
  black: "#000000",
  white: "#ffffff",
};

export const FONTS = {
  // For dungeon-themed text (titles, flavor text)
  dungeon: "Luminari, Papyrus, Georgia, serif",

  // For physics/technical content (formulas, numbers, descriptions)
  physics: "JetBrains Mono, Courier New, monospace",

  topic: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace",

  // For buttons and UI
  ui: "Trebuchet MS, Arial Black, sans-serif",
};

export const SIMULATION_CONSTANTS = {
  ground_level: STAGE_HEIGHT - 110, // og is 200
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
    fontFamily: FONTS.physics,
    fill: COLORS.text,
    x: STAGE_WIDTH - STAGE_WIDTH / 2,
    y: 100,
  },
  description: {
    fontSize: 24,
    fontFamily: FONTS.physics,
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
  fontFamily: FONTS.ui,
};
