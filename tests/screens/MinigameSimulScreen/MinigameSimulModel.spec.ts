import { MinigameSimulModel } from "../../../src/screens/MinigameSimulScreen/MinigameSimulModel";
import { describe, it, expect } from "vitest";

describe("MinigameSimulModel", () => {
  it("should initialize with correct values", () => {
    const model = new MinigameSimulModel(100, 45, 9.81, 1000, 10, 10);
    expect(model.getInitialSpeed()).toBe(100);
    expect(model.getAngle()).toBe(45);
    expect(model.getGravity()).toBe(9.81);
    expect(model.getDistanceX()).toBe(1000);
    expect(model.getInitialHeight()).toBe(10);
  });

  it("should use default values for initial_height and margin_of_error if not provided", () => {
    const model = new MinigameSimulModel(100, 45, 9.81, 1000);
    expect(model.getInitialHeight()).toBe(0);
    expect(model.isHit(1000)).toBe(true); // Default margin_of_error is 5, so 1000 is a hit
  });

  it("should return the correct initial speed", () => {
    const model = new MinigameSimulModel(120, 30, 9.8, 600, 0, 5);
    expect(model.getInitialSpeed()).toBe(120);
  });

  it("should return the correct angle", () => {
    const model = new MinigameSimulModel(120, 30, 9.8, 600, 0, 5);
    expect(model.getAngle()).toBe(30);
  });

  it("should return the correct gravity", () => {
    const model = new MinigameSimulModel(120, 30, 9.8, 600, 0, 5);
    expect(model.getGravity()).toBe(9.8);
  });

  it("should return the correct initial height", () => {
    const model = new MinigameSimulModel(120, 30, 9.8, 600, 10, 5);
    expect(model.getInitialHeight()).toBe(10);
  });

  it("should return the correct target distance (distance_x)", () => {
    const model = new MinigameSimulModel(120, 30, 9.8, 600, 0, 5);
    expect(model.getDistanceX()).toBe(600);
  });

  it("should return true when landing distance is equal to target distance", () => {
    const model = new MinigameSimulModel(75.22, 60, 9.8, 500, 0, 5);
    expect(model.isHit(500)).toBe(true);
  });

  it("should return true when landing distance is within the margin of error", () => {
    const model = new MinigameSimulModel(75.22, 60, 9.8, 500, 0, 5);
    expect(model.isHit(502.5)).toBe(true);
  });

  it("should return true when landing distance is at the edge of the margin of error", () => {
    const model = new MinigameSimulModel(75.22, 60, 9.8, 500, 0, 5);
    expect(model.isHit(505)).toBe(true);
  });

  it("should return false when landing distance is outside the margin of error", () => {
    const model = new MinigameSimulModel(75.22, 60, 9.8, 500, 0, 5);
    expect(model.isHit(505.1)).toBe(false);
  });

  it("should return true when landing distance is within the margin of error (negative)", () => {
    const model = new MinigameSimulModel(75.22, 60, 9.8, 500, 0, 5);
    expect(model.isHit(497.5)).toBe(true);
  });

  it("should return true when landing distance is at the edge of the margin of error (negative)", () => {
    const model = new MinigameSimulModel(75.22, 60, 9.8, 500, 0, 5);
    expect(model.isHit(495)).toBe(true);
  });

  it("should return false when landing distance is outside the margin of error (negative)", () => {
    const model = new MinigameSimulModel(75.22, 60, 9.8, 500, 0, 5);
    expect(model.isHit(494.9)).toBe(false);
  });

  it("should handle initial_speed of 0", () => {
    const model = new MinigameSimulModel(0, 45, 9.81, 1000);
    expect(model.getInitialSpeed()).toBe(0);
  });

  it("should handle gravity of 0", () => {
    const model = new MinigameSimulModel(100, 45, 0, 1000);
    expect(model.getGravity()).toBe(0);
  });

  it("should handle negative initial_height", () => {
    const model = new MinigameSimulModel(100, 45, 9.81, 1000, -10);
    expect(model.getInitialHeight()).toBe(-10);
  });

  it("should handle negative distance_x", () => {
    const model = new MinigameSimulModel(100, 45, 9.81, -1000);
    expect(model.getDistanceX()).toBe(-1000);
  });

  it("should return true only for exact hit when margin_of_error is 0", () => {
    const model = new MinigameSimulModel(100, 45, 9.81, 500, 0, 0);
    expect(model.isHit(500)).toBe(true);
    expect(model.isHit(500.1)).toBe(false);
    expect(model.isHit(499.9)).toBe(false);
  });

  it("should handle negative landingDistance correctly", () => {
    const model = new MinigameSimulModel(100, 45, 9.81, 10, 0, 5);
    expect(model.isHit(-10)).toBe(false); // -10 is not within 5 of 10
    expect(model.isHit(5)).toBe(true); // 5 is within 5 of 10
    expect(model.isHit(15)).toBe(true); // 15 is within 5 of 10
  });
});
