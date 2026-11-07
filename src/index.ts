import fs from "fs/promises";
import path from "path";
import { simpleGit } from "simple-git";
import { generateReadme } from "./utils/generateReadme.js";
import { workflow } from "./utils/workflow.js";

const main = async () => {
  if (!process.env.CI) {
    (await import("dotenv")).config();
  }
  const { USER_ID: user_id, GITHUB_ID: github_id, GITHUB_EMAIL: github_email } = process.env;
  if (user_id && github_id && github_email) {
    const git = simpleGit(process.cwd());

    await git.addConfig("user.name", github_id).addConfig("user.email", github_email);

    await git.fetch();
    const list = await git.branch();

    const brachName = `atcoder.jp/${user_id}`;

    if (!list.all.includes(`remotes/origin/${brachName}`)) {
      await git.checkout(["--orphan", brachName]);
      await git.reset(["--hard"]);
      const readme = generateReadme(user_id);
      const dir = path.join(process.cwd(), "README.md");
      await fs.writeFile(dir, readme).then(async () => {
        await git.add(dir);
        await git.commit("init: create a README.md");
      });
    } else {
      await git.checkout([brachName]);
    }

    await workflow(git, user_id);

    git.push("origin", brachName);
  } else console.error("設定が完了していません");
};

main();
