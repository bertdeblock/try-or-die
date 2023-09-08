import { describe, test } from "vitest";
import {
  isEmberTryScenario,
  transformEmberTryScenario,
} from "../src/ember-try.js";

describe("ember-try", () => {
  test("it checks if a scenario is an `ember-try` scenario", async (ctx) => {
    ctx.expect(isEmberTryScenario({ packageJson: {} })).to.be.false;
    ctx.expect(isEmberTryScenario({ npm: {} })).to.be.true;
  });

  test("it transforms an `ember-try` scenario to a `try-or-die` scenario", async (ctx) => {
    ctx
      .expect(
        transformEmberTryScenario({
          env: { FOO: true },
          name: "name",
          npm: { "ember-source": "~4.12.0" },
        }),
      )
      .to.deep.equal({
        env: { FOO: true },
        name: "name",
        packageJson: { "ember-source": "~4.12.0" },
      });
  });
});
