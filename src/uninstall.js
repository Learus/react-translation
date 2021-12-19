import * as readline from 'readline';
import * as fs from 'fs';;
import { formatConfig } from './util.js';
import * as path from 'path';

export default function uninstall() {
    const __dirname = path.resolve();

    const config = formatConfig();
    const userConfig = JSON.parse(fs.readFileSync(__dirname + '/userConfig.json'));

    const typingsFile = config.typingsDirectory + config.typingsFile;
    const hookFile = config.hookDirectory + config.hookFile;

    fs.unlinkSync(typingsFile);
    fs.unlinkSync(hookFile);

    const rl = readline.createInterface(process.stdin, process.stdout);

    rl.question("Remove translation dictionary data as well? [y]/n: ", (answer) => {
        if (answer !== 'y' && answer !== 'yes') 
        {
            rl.close();
            return;
        }

        fs.rmSync(config.rootDir, { recursive: true });
        rl.close();
        console.log("Done.");
    })

    fs.writeFileSync(__dirname + '/userConfig.json', "{}");
}