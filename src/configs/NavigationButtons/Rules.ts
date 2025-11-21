import type { NavButton } from "../../types";

export const RulesScreenNavigationButtons: NavButton[] = [
  {
    id: "exit",
    label: "EXIT",
    target: { type: "rules" }, // Placeholder, actual target handled dynamically in controller
    position: {
      x: 0.7,  
      y: 0.85, 
    },
    style: {
      width: 180,
      height: 60,
    },
  },
];