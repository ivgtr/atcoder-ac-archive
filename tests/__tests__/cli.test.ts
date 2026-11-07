import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

describe("CLI", () => {
  it("prints help successfully", () => {
    const result = spawnSync(process.execPath, ["--loader", "ts-node/esm", "src/cli.ts", "--help"], {
      encoding: "utf8",
      env: { ...process.env, NO_UPDATE_NOTIFIER: "1", TS_NODE_TRANSPILE_ONLY: "1" },
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Usage:|Usage|使い方/i);
  });
});
