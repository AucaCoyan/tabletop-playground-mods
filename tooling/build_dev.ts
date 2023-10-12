import * as fs from "npm:fs-extra";
import * as chalk from "npm:colorette";
// @deno-types="npm:@types/node"
// import readline from "node:readline";
import { defaultVariant, projectConfig } from "./projectConfig.ts";
import { common } from "https://deno.land/std@0.203.0/path/common.ts";

// const spawn = require("cross-spawn");
// const { minimatch } = require("minimatch");

console.log(chalk.yellow("Good Morning, Captain"));

if (!fs.pathExists("./config/local.json")) {
  console.error("this workspace has not yet been set up");
  console.error("run 'yarn setup' to begin");
  Deno.exit(1);
}

function buildLangFile(config: projectConfig, variant: defaultVariant) {
  return Promise.all(
    config.variants[variant].lang.map((lang) =>
      JSON.parse(Deno.readTextFileSync(`lang/${lang}.json`))
    ),
  )
    .then((langs) => {
      return langs.reduce((acc, thisLang) => {
        return { ...acc, ...thisLang };
      }, {});
    })
    .then((langDef) => {
      return Deno.writeTextFile(
        `src/lib/langdef.ts`,
        `// System-generated file - do not edit. see lang/x.json\n\nmodule.exports = ${
          JSON.stringify(
            langDef,
            null,
            "\t",
          )
        }`,
      );
    });
}

async function spawnDependencyDeploy(config: projectConfig, variant: string) {
  // const command = new Deno.Command("pnpm", {
  //   args: [
  //     "install",
  //     "--modules-folder",
  //     `dev/${config.variants[variant].slug}_dev/Scripts/node_modules`,
  //     "--prod",
  //   ],
  //   // stdin: "piped",
  //   stdout: "piped",
  // });

  // // const child = command.spawn();
  // const output = await command.spawn().output();
  // return output;
  // // return child.on("close", (code) => (code > 0 ? reject(code) : resolve()));
  // // });
  const command = Deno.run({
    cmd: [
      "yarn",
      "--modules-folder",
      `dev/${config.variants[variant].slug}_dev/Scripts/node_modules`,
      "--prod",
    ],
  });
  const status = await command.status();
}

function spawnBuilder(config: projectConfig, variant: string) {
  if (config.transpile) {
    return new Promise((resolve, reject) => {
      const child = spawn.spawn(
        "babel",
        [
          "src",
          "-d",
          `dev/${config.variants[variant].slug}_dev/Scripts`,
        ],
        { stdio: "pipe" },
      );
      child.on("close", (code) => (code > 0 ? reject(code) : resolve()));
    });
  } else {
    return fs.copy(
      "./src",
      `dev/${config.variants[variant].slug}_dev/Scripts`,
      {},
    );
  }
}

const config: projectConfig = JSON.parse(
  Deno.readTextFileSync("./config/project.json"),
);

function build_dev(config: projectConfig) {
  console.log(Deno.args[2] ?? config.defaultVariant);
  const theVariant = Deno.args[2] ?? config.defaultVariant;
  if (!(theVariant in config.variants)) {
    return Promise.reject(`No such variant '${theVariant}' found`);
  }
  return buildLangFile(config, theVariant).then(() => {
    return spawnBuilder(config, theVariant).then(() => {
      spawnDependencyDeploy(config, theVariant);
      console.log(
        chalk.white(
          `Done building: ${config.variants[theVariant].name} (Dev)`,
        ),
      );
    });
  });
}

build_dev(config);

console.log(chalk.green("Good Hunting"));
// .catch((e) => {
//   console.log(chalk.red("Something went wrong"));
//   console.error(e);
// });
