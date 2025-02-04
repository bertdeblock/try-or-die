import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  copy,
  pathExistsSync,
  readJson,
  remove,
  writeJson,
} from "fs-extra/esm";
import tempDir from "temp-dir";
import { PackageJson } from "type-fest";
import { Scenario } from "./types.js";

/**
 * Apply a scenario's files.
 */
export function applyScenarioFiles(
  cwd: string,
  files: Scenario["files"],
): Promise<void[]> {
  return Promise.all(
    Object.keys(files).map(async (file) => {
      const path = join(cwd, file);
      const newContent = files[file];

      if (typeof newContent === "string") {
        await writeFile(path, newContent);
      } else if (typeof newContent === "function") {
        await writeFile(
          path,
          await newContent(await readFile(path, { encoding: "utf-8" })),
        );
      }
    }),
  );
}

/**
 * Back up multiple files.
 * Returns a function to restore the files.
 */
export async function backUpFiles(cwd: string, filenames: string[]) {
  const hashedDir = createTempHashedDir(cwd);
  const existingFiles = filenames.filter((filename) =>
    pathExistsSync(join(cwd, filename)),
  );

  await Promise.all(
    existingFiles.map((filename) =>
      copy(join(cwd, filename), join(hashedDir, filename)),
    ),
  );

  return async () => {
    await Promise.all(
      existingFiles.map((filename) =>
        copy(join(hashedDir, filename), join(cwd, filename)),
      ),
    );

    await remove(hashedDir);
  };
}

/**
 * Read a `package.json` file.
 */
export function readPackageFile(cwd: string) {
  return readJson(join(cwd, "package.json"));
}

/**
 * Write a `package.json` file.
 */
export function writePackageFile(cwd: string, packageJson: PackageJson) {
  return writeJson(join(cwd, "package.json"), packageJson, { spaces: 2 });
}

/**
 * Create a temp hashed dir based on a provided cwd.
 */
function createTempHashedDir(cwd: string) {
  return join(
    tempDir,
    "try-or-die",
    createHash("sha256").update(cwd).digest("hex"),
  );
}
