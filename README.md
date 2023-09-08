# try-or-die

[![CI](https://github.com/bertdeblock/try-or-die/workflows/CI/badge.svg)](https://github.com/bertdeblock/try-or-die/actions?query=workflow%3ACI)

An experiment inspired by [ember-try](https://github.com/ember-cli/ember-try),
but decoupled from [ember-cli](https://github.com/ember-cli/ember-cli).

## Configuration

```js
// try-or-die.config.js

import { embroiderOptimized, embroiderSafe } from "@embroider/test-setup";
import emberSourceChannelURL from "ember-source-channel-url";

export default {
  // Type: "bun" | "npm" | "pnpm" | "yarn"
  // Default: "npm"
  packageManager: "pnpm",

  // Type: string[]
  // Default: []
  packageManagerInstallOptions: ["--no-lockfile"],

  // Type: [string, ...string[]]
  // Default: [config.packageManager, "test"]
  testCommand: ["pnpm", "test:ember"],

  // Type: Scenario[]
  // Default: []
  scenarios: [
    {
      name: "ember-lts-4.8",
      packageJson: {
        devDependencies: {
          "ember-source": "~4.8.0",
        },
      },
    },
    {
      name: "ember-lts-4.12",
      packageJson: {
        devDependencies: {
          "ember-source": "~4.12.0",
        },
      },
    },
    {
      name: "ember-release",
      packageJson: {
        devDependencies: {
          "ember-source": await emberSourceChannelURL("release"),
        },
      },
    },
    {
      name: "ember-beta",
      packageJson: {
        devDependencies: {
          "ember-source": await emberSourceChannelURL("beta"),
        },
      },
    },
    {
      name: "ember-canary",
      packageJson: {
        devDependencies: {
          "ember-source": await emberSourceChannelURL("canary"),
        },
      },
    },
    // `ember-try` scenarios are supported as well:
    embroiderSafe(),
    embroiderOptimized(),
  ],
};
```

## Usage

```shell
# Run a single scenario:
try-or-die scenario ember-release

# Run all scenarios:
try-or-die scenarios

# Run multiple scenarios:
try-or-die scenarios --names ember-release ember-beta ember-canary

# Use a custom path to a `try-or-die` config file:
try-or-die scenarios --config-path=config/try-or-die.config.js

# See all options:
try-or-die --help
try-or-die --help scenario
try-or-die --help scenarios
```
