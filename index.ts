import { prompt } from "inquirer";
import fetch from "node-fetch";

interface GHAnswer {
  username: string;
  repo: string;
}

interface GHAnswer2 {
  branch: string;
  path: string;
}

interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

(async () => {
  const { username, repo } = (await prompt([
    {
      type: "input",
      name: "username",
      message: "Username:",
    },
    {
      type: "input",
      name: "repo",
      message: "Repository:",
    },
  ])) as GHAnswer;

  const response = await fetch(
    `https://api.github.com/repos/${username}/${repo}/branches`
  );

  if (!response.ok) return console.error("Invalid repo");

  const branches = ((await response.json()) as Branch[]).map(
    (each) => each.name
  );

  const { branch, path } = (await prompt([
    {
      type: "list",
      choices: branches,
      message: "Branch:",
      name: "branch",
    },
    {
      type: "input",
      message: "Path(e.g. /client/index.ts):",
      name: "path",
    },
  ])) as GHAnswer2;

  console.log(
    `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${
      path.startsWith("/") ? path.slice(1) : path
    }`
  );
})();
