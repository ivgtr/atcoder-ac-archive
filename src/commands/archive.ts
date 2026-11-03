import fs from "fs/promises";
import path from "path";
import { simpleGit } from "simple-git";
import type { Db } from "../types/DatabaseService";
import { generateReadme } from "../utils/generateReadme.js";
import { workflow } from "../utils/workflow.js";

type Props = {
  db: Db;
};

export const archive = async ({ db }: Props) => {
  const result = db.getJson();
  if (!result?.user_id) return;
  console.log(`${result.user_id} のデータを取得します`);

  const archiveDir = path.join(result.archive_dir || process.cwd(), "/atcoder-ac-archive");
  await fs.mkdir(archiveDir, { recursive: true });

  const git = simpleGit(archiveDir);

  await git
    .init()
    .addConfig("user.name", result.github_id)
    .addConfig("user.email", result.github_email);

  await git.fetch();
  const brachName = `atcoder.jp/${result.user_id}`;
  const list = await git.branchLocal();

  try {
    if (!list.all.includes(brachName)) {
      await git.checkout(["--orphan", brachName]);
      await git.reset(["--hard"]);
      const readme = generateReadme(result.user_id);
      const dir = path.join(archiveDir, "README.md");
      await fs.writeFile(dir, readme).then(async () => {
        await git.add(dir);
        await git.commit("init: create a README.md");
      });
    } else {
      await git.checkout([brachName]);
    }

    await workflow(git, result.user_id, archiveDir);
  } catch (e) {
    console.log(e);
  }
};
