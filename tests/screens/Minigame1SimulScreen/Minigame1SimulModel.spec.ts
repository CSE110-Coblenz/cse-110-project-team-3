import { Minigame1SimulModel } from "../../../src/screens/MiniGameScreens/Minigame1SimulScreen/Minigame1SimulModel";
import { describe, it, expect } from "vitest";

describe("Minigame1SimulModel", () => {
  it("should initialize with correct values", () => {
    const model = new Minigame1SimulModel(100, 0.5, 9.81, 1000, 10, 50, 10);
    expect(model.getInitialSpeed()).toBe(100);
    expect(model.getFrictionCoefficient()).toBe(0.5);
    expect(model.getGravity()).toBe(9.81);
    expect(model.getDistanceX()).toBe(1000);
    expect(model.getMass()).toBe(10);
    expect(model.getGapX()).toBe(50);
    expect(model.getMarginOfError()).toBe(10);
  });

  describe("setInitialSpeed", () => {
    it("should set the initial speed if within range", () => {
      const model = new Minigame1SimulModel(100, 0.5, 9.81, 1000, 10, 50, 10);
      model.setInitialSpeed(150);
      expect(model.getInitialSpeed()).toBe(150);
    });

    it("should clamp the initial speed to 0 if negative", () => {
      const model = new Minigame1SimulModel(100, 0.5, 9.81, 1000, 10, 50, 10);
      model.setInitialSpeed(-10);
      expect(model.getInitialSpeed()).toBe(0);
    });

    it("should clamp the initial speed to 300 if too high", () => {
      const model = new Minigame1SimulModel(100, 0.5, 9.81, 1000, 10, 50, 10);
      model.setInitialSpeed(350);
      expect(model.getInitialSpeed()).toBe(300);
    });

    it("should round the initial speed", () => {
      const model = new Minigame1SimulModel(100, 0.5, 9.81, 1000, 10, 50, 10);
      model.setInitialSpeed(120.5);
      expect(model.getInitialSpeed()).toBe(121);
    });
  });

  describe("isHit", () => {
    const distanceX = 1000;
    const gapX = 50;
    const model = new Minigame1SimulModel(100, 0.5, 9.81, distanceX, 10, gapX, 10);

    it("should return true for a hit at the start of the target range", () => {
      expect(model.isHit(distanceX)).toBe(true);
    });

    it("should return true for a hit at the end of the target range", () => {
      expect(model.isHit(distanceX + gapX)).toBe(true);
    });

    it("should return true for a hit within the target range", () => {
      expect(model.isHit(distanceX + gapX / 2)).toBe(true);
    });

    it("should return false for a miss just before the target range", () => {
      expect(model.isHit(distanceX - 1)).toBe(false);
    });

    it("should return false for a miss just after the target range", () => {
      expect(model.isHit(distanceX + gapX + 1)).toBe(false);
    });
  });
});
