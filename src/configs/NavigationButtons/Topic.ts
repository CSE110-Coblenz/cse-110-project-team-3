import type { NavButton } from "../../types";

/** 
 * Navigation buttons for the Friction topic screen (back to map 1, go to simulation)
 */
export const FrictionTopicNavigationButtons: NavButton[] = [
  {
    id: "back",
    label: "Back",
    target: { type: "map", mapId: 1 },
    position: {
      x: 0.05,
      y: 0.85,
    },
  },

  {
    id: "simulation",
    label: "Simulation",
    target: { type: "simulation", topic: "friction" },

    position: {
      x: 0.7,
      y: 0.85,
    },
  },
];

/** 
 * Navigation buttons for the Projectile Motion topic screen (back to map 2, go to simulation)
 */
export const ProjMotionTopicNavigationButtons: NavButton[] = [
  {
    id: "back",
    label: "Back",
    target: { type: "map", mapId: 2 },
    position: {
      x: 0.05,
      y: 0.85,
    },
  },
  {
    id: "simulation",
    label: "Simulation",
    target: { type: "simulation", topic: "projectile motion" },
    position: {
      x: 0.7,
      y: 0.85,
    },
  },
];

/** 
 * Navigation buttons for the Force topic screen (back to map 1, go to simulation) 
 */
export const ForceTopicNavigationButtons: NavButton[] = [
  {
    id: "back",
    label: "Back",
    target: { type: "map", mapId: 1 },
    position: {
      x: 0.05,
      y: 0.85,
    },
  },
  {
    id: "simulation",
    label: "Simulation",
    target: { type: "simulation", topic: "force" },
    position: {
      x: 0.7,
      y: 0.85,
    },
  },
];

/** 
 * Navigation buttons for the Distance topic screen (back to map 1, go to simulation)
 */
export const DistanceTopicNavigationButtons: NavButton[] = [
  {
    id: "back",
    label: "Back",
    target: { type: "map", mapId: 1 },
    position: {
      x: 0.05,
      y: 0.85,
    },
  },
  {
    id: "simulation",
    label: "Simulation",
    target: { type: "simulation", topic: "distance" },
    position: {
      x: 0.7,
      y: 0.85,
    },
  },
];

/** 
 * Navigation buttons for the Gravity topic screen (back to map 2, go to simulation)
 */
export const GravityTopicNavigationButtons: NavButton[] = [
  {
    id: "back",
    label: "Back",
    target: { type: "map", mapId: 2 },
    position: {
      x: 0.05,
      y: 0.85,
    },
  },
  {
    id: "simulation",
    label: "Simulation",
    target: { type: "simulation", topic: "gravity" },
    position: {
      x: 0.7,
      y: 0.85,
    },
  },
];

/** 
 * Navigation buttons for the Trajectory topic screen (back to map 2, go to simulation)
 */
export const TrajectoryTopicNavigationButtons: NavButton[] = [
  {
    id: "back",
    label: "Back",
    target: { type: "map", mapId: 2 },
    position: {
      x: 0.05,
      y: 0.85,
    },
  },
  {
    id: "simulation",
    label: "Simulation",
    target: { type: "simulation", topic: "trajectory" },
    position: {
      x: 0.7,
      y: 0.85,
    },
  },
];
