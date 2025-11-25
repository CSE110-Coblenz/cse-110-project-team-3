import type { TopicScreenConfig } from "../../types";
import { GravityTopicNavigationButtons } from "../../configs/NavigationButtons/Topic";
import { COLORS } from "../../constants";

/**
 * Configuration for the gravity topic screen. Find implementation details in "../../screens/TopicScreen/types"
 */
export const gravityConfig: TopicScreenConfig = {
  title: "Gravity & Vertical Motion",

  descriptionSegments: [
    {
      text: "Near the Earth's surface, gravity pulls all objects downward with approximately the same constant acceleration g ≈ 9.8 m/s².",
    },

    {
      text: "\nThis acceleration does not depend on the object's mass. \nThe weight is the gravitational force: ",
    },
    { text: "W = m g", bold: true, color: "#FFD54F" },

    {
      text: "\n\nIf we choose “upward” as the positive direction, the vertical acceleration is ",
    },
    { text: "-g", bold: true, color: "#FFD54F" },
    {
      text: ". The equations of motion for the vertical position y and vertical velocity v_y as functions of time are:",
    },

    { text: "\nv_y(t) = v_{y0} - g t", bold: true, color: "#FFD54F" },
    { text: "\n" },
    { text: "y(t) = y₀ + v_{y0} t - ½ g t²", bold: true, color: "#FFD54F" },

    {
      text: "\n\nSpecial case: dropped object (no initial vertical speed, v_{y0} = 0) from height h with the ground at y = 0:",
    },
    { text: "y(t) = h - ½ g t²", bold: true, color: "#FFD54F" },

    { text: "\n\nSetting y(t) = 0 to find when it hits the ground gives:\n" },
    { text: "0 = h - ½ g t²  ⇒  t = √(2h / g)", bold: true, color: "#FFD54F" },
  ],

  buttons: GravityTopicNavigationButtons,
  style: {
    titleColor: COLORS.text,
    descriptionColor: COLORS.text,
    backgroundColor: COLORS.bg,
  },
};
