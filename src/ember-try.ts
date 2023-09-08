import { type Scenario } from "./types.js";

/**
 * Check if a scenario is an `ember-try` scenario.
 */
export function isEmberTryScenario(scenario: any) {
  return Boolean(scenario.npm);
}

/**
 * Transform an `ember-try` scenario to a `try-or-die` scenario.
 */
export function transformEmberTryScenario(scenario: any): Scenario {
  return {
    env: scenario.env,
    name: scenario.name,
    packageJson: scenario.npm,
  };
}
