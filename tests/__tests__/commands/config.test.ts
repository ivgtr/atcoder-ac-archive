import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { config } from "../../../src/commands/config.js";
import { Db } from "../../../src/types/DatabaseService";
import { DbService } from "../../utils/databaseService.js";

describe("src/command/config.ts", () => {
  const db = new DbService() as unknown as Db;
  describe("a3 config", () => {
    it("a3 config", async () => {
      const result = await config({ db });
      assert.deepEqual(Object.keys(result ?? {}).sort(), ["github_id", "github_email", "user_id", "archive_dir"].sort());
    });
    it("a3 config user.id hoge", async () => {
      const userId = "hoge";

      const result = await config({ db, userId });
      assert.equal(result?.user_id, userId);
    });
  });
});
