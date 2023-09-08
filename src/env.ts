import { env } from "node:process";
import { type Scenario } from "./types.js";

/**
 * Apply a scenario's `env` object to `process.env`.
 * Returns a function to restore `process.env`.
 */
export function applyScenarioEnv(scenarioEnv: Scenario["env"]) {
  const originalEnv: Record<string, any> = {};

  Object.keys(scenarioEnv).forEach((key) => {
    if (env[key] !== undefined) {
      originalEnv[key] = env[key];
    }

    env[key] = scenarioEnv[key];
  });

  return () =>
    Object.keys(scenarioEnv).forEach((key) => {
      if (originalEnv[key] === undefined) {
        delete env[key];
      } else {
        env[key] = originalEnv[key];
      }
    });
}
