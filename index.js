"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = require("inquirer");
const node_fetch_1 = __importDefault(require("node-fetch"));
(async () => {
    const { username, repo } = (await inquirer_1.prompt([
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
    ]));
    const response = await node_fetch_1.default(`https://api.github.com/repos/${username}/${repo}/branches`);
    if (!response.ok)
        return console.error("Invalid repo");
    const branches = (await response.json()).map((each) => each.name);
    const { branch, path } = (await inquirer_1.prompt([
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
    ]));
    console.log(`https://raw.githubusercontent.com/${username}/${repo}/${branch}/${path.startsWith("/") ? path.slice(1) : path}`);
})();
