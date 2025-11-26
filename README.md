# CSE 110 Group Project - **Phungeon**

## Overview

Phungeon is a **level-based** educational game designed for learning **physics** through interactive simulations.
Each level focuses on a core mechanics concept and challenges the player to both learn and apply those concepts to progress.  
The **goal** is to complete all learning stages to unlock two final mini-games.  
Instead of defeating enemies, players defeat physics problems by applying what they’ve learned throughout the game.

## Rules

1. Complete all levels to unlock the final mini-games.
2. Each level has two phases: **Theory** Phase and **Simulation** Phase.
3. In mini-games, you have three lives:
   - Each incorrect answer costs one life.
   - Losing all lives requires restarting the mini-game.
4. The Formula Menu updates automatically after completing a level and it is accessible from the map.
5. You can replay previously completed levels at any time to review the topics.
6. Correct answers and completed levels are saved under your username.
7. Completing all stages and both final mini-games finishes the game.

## Minigames

There are two physics-based mini-games, both accessible from the dungeon map once their prerequisite levels are completed:

- **Friction Minigame**  
  A 1D motion game where you choose the **initial speed** of a box sliding on a rough surface. The goal is to stop the box inside a target interval, accounting for mass, friction coefficient, and stopping distance.

- **Projectile Minigame**  
  A 2D projectile-launch game where you control **speed** and **angle** of a fireball. The target distance is randomized each run, and you must adjust the parameters to hit the target with limited lives.

## Files

- [`public/`](public/): Images, GIFs, videos such as background textures and simulation media.

- [`src/`](src/):
  - [`src/configs/`](src/configs/): Data-only configuration used to build screens.
    - [`src/configs/maps/`](src/configs/maps/): Map layouts, nodes, arrows, and unlock indices for each dungeon map.

    - [`src/configs/NavigationButtons/`](src/configs/NavigationButtons/): Configuration for navigation buttons.

    - [`src/configs/rules/`](src/configs/rules/): Text content for rules shown in rules and minigame-rule screens.

    - [`src/configs/simulations/`](src/configs/simulations/): Simulation screen configs: titles, descriptions, media, options, and navigation targets.

    - [`src/configs/topics/`](src/configs/topics/): Topic screen configs for each physics concept.

  - [`src/screens/`](src/screens/):
    - [`src/screens/StartScreen/`](src/screens/StartScreen/): Main menu with start, resume, rules, and quit.

    - [`src/screens/MapScreen/`](src/screens/MapScreen/): Dungeon map with levels, arrows, map navigation buttons, and level unlock logic.

    - [`src/screens/TopicScreen/`](src/screens/TopicScreen/): Topic/theory screens that introduce physics concepts tied to simulations.

    - [`src/screens/SimulationScreen/`](src/screens/SimulationScreen/): Generic simulation screens used for normal levels.

    - [`src/screens/ReferenceScreens/`](src/screens/ReferenceScreens/): Formula/reference menu accessible from maps and mini-games.

    - [`src/screens/RulesScreen/`](src/screens/RulesScreen/): Global rules screen describing overall gameplay rules.

    - [`src/screens/MiniGameScreens/`](src/screens/MiniGameScreens/): Title, minigame-specific rules, friction minigame, projectile minigame, completed, and game-over screens.

  - [`src/utils/ui/`](src/utils/ui/):
    Shared UI helpers for dungeon backgrounds, torch lights, and the reusable Konva navigation buttons.

  - [`src/constants.ts`](src/constants.ts): Global numeric and style constants (stage size, colors, fonts, simulation parameters).

  - [`src/main.ts`](src/main.ts): Entry point that initializes the Konva stage and screen-switching logic.

  - [`src/types.ts`](src/types.ts): Shared types and base classes for screens, views, navigation, simulations, and minigames.

- [`tests/`](tests/): Vitest test suites for controllers, models, and integration behavior.

- [`index.html`](index.html): Root HTML file.
