import { Project } from "fixturify-project";
import { describe, test } from "vitest";
import {
  backUpFiles,
  readPackageFile,
  writePackageFile,
} from "../src/files.js";

describe("files", () => {
  test("it backs up and restores multiple files", async (ctx) => {
    const project = new Project("foo");

    await project.write();

    const restoreFiles = await backUpFiles(project.baseDir, ["package.json"]);

    let packageJson = await readPackageFile(project.baseDir);

    ctx.expect(packageJson.name).to.equal("foo");

    packageJson.name = "bar";

    await writePackageFile(project.baseDir, packageJson);

    packageJson = await readPackageFile(project.baseDir);

    ctx.expect(packageJson.name).to.equal("bar");

    await restoreFiles();

    packageJson = await readPackageFile(project.baseDir);

    ctx.expect(packageJson.name).to.equal("foo");
  });
});
