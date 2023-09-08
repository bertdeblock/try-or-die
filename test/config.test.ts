import { Project } from "fixturify-project";
import { join } from "node:path";
import { describe, test } from "vitest";
import { generateConfig, readConfig } from "../src/config.js";

describe("config", () => {
  test("it supports a `try-or-die.config.js` file", async (ctx) => {
    const project = new Project({
      files: {
        "package.json": '{ "type": "module" }',
        "try-or-die.config.js": "export default { packageManager: 'pnpm' };",
      },
    });

    await project.write();

    const config = await readConfig(project.baseDir);

    ctx.expect(config).to.deep.equal(
      generateConfig({
        packageManager: "pnpm",
      }),
    );
  });

  test("it supports a `try-or-die.config.cjs` file", async (ctx) => {
    const project = new Project({
      files: {
        "package.json": '{ "type": "module" }',
        "try-or-die.config.cjs": "module.exports = { packageManager: 'pnpm' };",
      },
    });

    await project.write();

    const config = await readConfig(project.baseDir);

    ctx.expect(config).to.deep.equal(
      generateConfig({
        packageManager: "pnpm",
      }),
    );
  });

  test("it supports a `try-or-die.config.mjs` file", async (ctx) => {
    const project = new Project({
      files: {
        "try-or-die.config.mjs": "export default { packageManager: 'pnpm' };",
      },
    });

    await project.write();

    const config = await readConfig(project.baseDir);

    ctx.expect(config).to.deep.equal(
      generateConfig({
        packageManager: "pnpm",
      }),
    );
  });

  test("it supports a custom relative config path", async (ctx) => {
    const project = new Project({
      files: {
        config: {
          "try-or-die.config.js": "export default { packageManager: 'pnpm' };",
        },
        "package.json": '{ "type": "module" }',
      },
    });

    await project.write();

    const config = await readConfig(
      project.baseDir,
      "config/try-or-die.config.js",
    );

    ctx.expect(config).to.deep.equal(
      generateConfig({
        packageManager: "pnpm",
      }),
    );
  });

  test("it supports a custom absolute config path", async (ctx) => {
    const project = new Project({
      files: {
        config: {
          "try-or-die.config.js": "export default { packageManager: 'pnpm' };",
        },
        "package.json": '{ "type": "module" }',
      },
    });

    await project.write();

    const config = await readConfig(
      project.baseDir,
      join(project.baseDir, "config/try-or-die.config.js"),
    );

    ctx.expect(config).to.deep.equal(
      generateConfig({
        packageManager: "pnpm",
      }),
    );
  });

  test("it throws when the config file could not be found", async (ctx) => {
    const project = new Project();
    const configPath = "config/try-or-die.config.js";

    await project.write();

    let error;
    try {
      await readConfig(project.baseDir, configPath);
    } catch (_error) {
      error = _error;
    }

    ctx
      .expect(error.message)
      .to.equal(
        `Could not find or import config file \`${join(
          project.baseDir,
          configPath,
        )}\`.`,
      );
  });

  test("it supports a sync config factory function", async (ctx) => {
    const project = new Project({
      files: {
        "package.json": '{ "type": "module" }',
        "try-or-die.config.js":
          "export default () => ({ packageManager: 'pnpm' });",
      },
    });

    await project.write();

    const config = await readConfig(project.baseDir);

    ctx.expect(config).to.deep.equal(
      generateConfig({
        packageManager: "pnpm",
      }),
    );
  });

  test("it supports an async config factory function", async (ctx) => {
    const project = new Project({
      files: {
        "package.json": '{ "type": "module" }',
        "try-or-die.config.js":
          "export default async () => ({ packageManager: 'pnpm' });",
      },
    });

    await project.write();

    const config = await readConfig(project.baseDir);

    ctx.expect(config).to.deep.equal(
      generateConfig({
        packageManager: "pnpm",
      }),
    );
  });
});
