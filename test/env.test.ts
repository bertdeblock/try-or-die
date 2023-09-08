import { env } from "node:process";
import { describe, test } from "vitest";
import { applyScenarioEnv } from "../src/env.js";

describe("env", () => {
  test("it applies a scenario's `env` object to `process.env`", async (ctx) => {
    env.FOO = "true";

    ctx.expect(env.FOO).to.equal("true");
    ctx.expect(env.BAR).to.not.exist;

    const restoreProcessEnv = applyScenarioEnv({
      FOO: false,
      BAR: true,
    });

    ctx.expect(env.FOO).to.equal("false");
    ctx.expect(env.BAR).to.equal("true");

    restoreProcessEnv();

    ctx.expect(env.FOO).to.equal("true");
    ctx.expect(env.BAR).to.not.exist;

    delete env.FOO;

    ctx.expect(env.FOO).to.not.exist;
  });
});
