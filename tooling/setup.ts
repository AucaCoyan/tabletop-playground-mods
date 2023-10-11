import * as fs from "npm:fs-extra";
import * as chalk from "npm:colorette";
// @deno-types="npm:@types/node"
import readline from "node:readline";
import { ensureDir } from "https://deno.land/std@0.203.0/fs/ensure_dir.ts";

console.log(chalk.yellow("Good Morning, Captain"));
console.log(chalk.green("Welcome to the TTPG dev environment setup"));

interface projectConfig {
  defaultVariant: string;
  assets: Array<Record<string, string>>;
  variants: Record<string, Variant>;
}

interface Variant {
  name: string;
  version: string;
  guid: { dev: string; prd: string };
  slug: string;
}

const projectConfig = JSON.parse(
  await Deno.readTextFile(
    "./config/project.json",
  ),
) as projectConfig;

const theVariant: string = Deno.args[0] ?? projectConfig.defaultVariant;
if (!(theVariant in projectConfig.variants)) {
  console.error(`No such variant '${theVariant}' found`);
  Deno.exit(1);
}
const variantConfig = projectConfig.variants[theVariant];

function getSuggestedFolder(): string {
  if (Deno.build.os === "darwin") {
    return (
      Deno.env.get("HOME") +
      "/Library/Application Support/Epic/TabletopPlayground/Packages"
    );
  } else if (Deno.build.os === "windows") {
    return "C:\\Program Files (x86)\\Steam\\steamapps\\common\\TabletopPlayground\\TabletopPlayground\\PersistentDownloadDir";
  }
  throw new Error("could not get the suggested TabletopPlayground folder!");
}

interface localConfig {
  ttpg_folder: string;
}

function setupWorkspace(localConfig: localConfig) {
  console.log("setting up workspace...");
  const manifest = {
    Name: `${variantConfig.name} (Dev)`,
    Version: variantConfig.version,
    GUID: variantConfig.guid.dev,
  };

  console.log("building 'dev' folder");
  return fs
    .pathExists(`./dev/${variantConfig.slug}_dev`)
    .then((alreadyInPlace: any) => {
      if (alreadyInPlace) {
        return Promise.reject(
          `path './dev/${variantConfig.slug}_dev' already exists. It looks like you've already been set up`,
        );
      } else {
        return fs
          .ensureDir(`./dev/${variantConfig.slug}_dev`, 0o2775)
          .then(() => {
            return fs
              .ensureFile(
                `./dev/${variantConfig.slug}_dev/Manifest.json`,
              )
              .then(() => {
                Deno.writeTextFile(
                  `./dev/${variantConfig.slug}_dev/Manifest.json`,
                  JSON.stringify(manifest),
                ).then(() => {
                  return fs
                    .ensureDir(
                      `./dev/${variantConfig.slug}_dev/Scripts/node_modules`,
                      0o2775,
                    )
                    .then(() => {
                      console.log("'dev' folder built");
                    });
                });
              });
          })
          .then(() => {
            console.log("symlinking assets to dev folder");

            const toLink = [
              ...projectConfig.assets,
              ...("assets" in variantConfig ? variantConfig.assets : []),
            ];

            return Promise.all(
              toLink.map(({ from, to }) => {
                console.log(from, "->", to);
                return fs.createSymlinkSync(
                  `./assets/${from}`,
                  `./dev/${variantConfig.slug}_dev/${to}`,
                  "dir",
                );
              }),
            );
          })
          .then(() => {
            console.log("symlinking to Tabletop Playground");
            return fs
              .createSymlink(
                `./dev/${variantConfig.slug}_dev`,
                `${localConfig.ttpg_folder}/${variantConfig.slug}_dev`,
                "dir",
              )
              .then(() => {
                console.log(
                  "Tabletop Playground is now aware of this project. Huzzah.",
                );
              });
          });
      }
    });
}

const directoriesToMake = [
  ...projectConfig.assets,
  ...Object.values(projectConfig.variants).reduce(
    (acc, { assets }) => (assets ? [...acc, ...assets] : acc),
    [],
  ),
].reduce((acc, { from }) => {
  acc.push(`./assets/${from}`);
  return acc;
}, []);

Promise.all(
  directoriesToMake.map((path: string) => {
    return ensureDir(path);
  }),
).then(() => {
  return fs
    .pathExists("./config/local.json")
    .then((doesExist: any) => {
      if (doesExist) {
        console.log("Local config found, using that");
        const config: localConfig = JSON.parse(
          Deno.readTextFileSync(
            "./config/local.json",
          ),
        );
        return setupWorkspace(config);
      } else {
        console.log("no local config found");
        const input = readline.createInterface({
          input: Deno.stdin,
          output: Deno.stdout,
        });
        return new Promise((resolve, reject) => {
          const suggestedFolder = getSuggestedFolder();
          return input.question(
            `Please enter your Tabletop Playground modding directory${
              suggestedFolder ? ` (${suggestedFolder})` : ""
            }`,
            (ttpg_folder) => {
              ttpg_folder = ttpg_folder || suggestedFolder;
              if (ttpg_folder === "") {
                return reject(
                  "we couldn't determine where your TTPG installation folder is, sorry!",
                );
              }
              return fs
                .pathExists(ttpg_folder)
                .then((doesTtpgFolderExist: boolean) => {
                  if (doesTtpgFolderExist) {
                    const config: localConfig = {
                      ttpg_folder,
                    };
                    return resolve(config);
                  } else {
                    return reject(
                      "couldn't find that path!",
                    );
                  }
                });
            },
          );
        })
          .then((config: localConfig) => {
            input.close();
            return setupWorkspace(config).then(() => {
              return fs
                .writeJson("./config/local.json", config)
                .then(() => {
                  return Promise.resolve(config);
                });
            });
          })
          .catch((e) => {
            input.close();
            throw e;
          });
      }
    })
    .then(() => {
      console.log(chalk.green("You should be good to go. Good Hunting!"));
    })
    .catch((e: string | number) => {
      console.log(chalk.red("Something went wrong..."));
      console.error(chalk.red(e));
    });
});
