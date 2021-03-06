import * as fs from 'fs';
import * as appRootPath from 'app-root-dir';
import * as readline from 'readline';
import * as path from 'path';

export function formatConfig()
{
    const __dirname = path.resolve();

    const configFile = __dirname + '/config.json';
    let config = JSON.parse(fs.readFileSync(configFile));
    let rootDir = appRootPath.get() + '/';

    let userConfig = JSON.parse(fs.readFileSync(__dirname + '/userConfig.json'));

    if (userConfig && userConfig.rootDir) 
        rootDir = rootDir + userConfig.rootDir;

    config = {
        ...config,
        rootDir: rootDir + config.rootDir,
        typingsDirectory: rootDir + config.rootDir + config.typingsDirectory,
        hookDirectory: rootDir + config.rootDir + config.hookDirectory,
        dictionaryDirectory: rootDir + config.rootDir + config.dictionaryDirectory
    }

    return config;
}

export function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}