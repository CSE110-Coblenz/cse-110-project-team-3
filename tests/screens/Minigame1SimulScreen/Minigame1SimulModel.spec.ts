import { Minigame1SimulModel } from "../../../src/screens/MiniGameScreens/Minigame1SimulScreen/Minigame1SimulModel";
import { describe, it, expect } from "vitest";

describe("Minigame1SimulModel", () => {
  it("should initialize with correct values", () => {
    const model = new Minigame1SimulModel(100, 0.5, 9.81, 1000, 10, 10);
    expect(model.getInitialSpeed()).toBe(100);
    expect(model.getFrictionCoefficient()).toBe(0.5);
    expect(model.getGravity()).toBe(9.81);
    expect(model.getDistanceX()).toBe(1000);
    expect(model.getMass()).toBe(10);
    expect(model.getMarginOfError()).toBe(10);
  });

  describe("setInitialSpeed", () => {
    it("should set the initial speed if within range", () => {
      const model = new Minigame1SimulModel(100, 0.5, 9.81, 1000, 10, 10);
      model.setInitialSpeed(150);
      expect(model.getInitialSpeed()).toBe(150);
    });

    it("should clamp the initial speed to 0 if negative", () => {
      const model = new Minigame1SimulModel(100, 0.5, 9.81, 1000, 10, 10);
      model.setInitialSpeed(-10);
      expect(model.getInitialSpeed()).toBe(0);
    });

    it("should clamp the initial speed to 300 if too high", () => {
      const model = new Minigame1SimulModel(100, 0.5, 9.81, 1000, 10, 10);
      model.setInitialSpeed(350);
      expect(model.getInitialSpeed()).toBe(300);
    });

    it("should round the initial speed", () => {
      const model = new Minigame1SimulModel(100, 0.5, 9.81, 1000, 10, 10);
      model.setInitialSpeed(120.5);
      expect(model.getInitialSpeed()).toBe(121);
    });
  });

  describe("isHit", () => {
    it("should return true for a perfect hit", () => {
      const model = new Minigame1SimulModel(100, 0.5, 9.81, 1000, 10, 10);
      expect(model.isHit(1000)).toBe(true);
    });

    it("should return true for a hit within the upper margin of error", () => {
      const model = new Minigame1SimulModel(100, 0.5, 9.81, 1000, 10, 10);
      expect(model.isHit(1005)).toBe(true);
    });

    it("should return true for a hit within the lower margin of error", () => {
      const model = new Minigame1SimulModel(100, 0.5, 9.81, 1000, 10, 10);
      expect(model.isHit(995)).toBe(true);
    });

    it("should return false for a miss outside the upper margin of error", () => {
      const model = new Minigame1SimulModel(100, 0.5, 9.81, 1000, 10, 10);
      expect(model.isHit(1011)).toBe(false);
    });

    it("should return false for a miss outside the lower margin of error", () => {
      const model = new Minigame1SimulModel(100, 0.5, 9.81, 1000, 10, 10);
      expect(model.isHit(989)).toBe(false);
    });
  });
});
