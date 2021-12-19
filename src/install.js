import * as appRootPath from 'app-root-dir';
import * as fs from 'fs';
import * as path from 'path';
import { formatConfig } from './util.js';


export default function install (options) {
    const __dirname = path.resolve();

    // Write User Options
    if (options) 
    {
        if (options.rootDir) options.rootDir = options.rootDir + '/';
        fs.writeFileSync(__dirname + "/userConfig.json", JSON.stringify(options));
    }

    const config = formatConfig();
    
    const templateHookFile = './src/templates/dictionary.tsx';
    const typingsFile = config.typingsDirectory + config.typingsFile;
    const hookFile = config.hookDirectory + config.hookFile;

    const relativePath = (from, to) => {
        const rel = path.relative(from, to);

        if (rel.includes('..')) return rel;
        else return './' + rel;
    }

    fs.mkdirSync(config.dictionaryDirectory, { recursive: true });
    fs.mkdirSync(config.hookDirectory, { recursive: true });
    fs.mkdirSync(config.typingsDirectory, { recursive: true });


    for (const lang of config.languages) {
        fs.writeFileSync(`${config.dictionaryDirectory}/${lang.label}.json`, '{}');
    }


    let lines = [];
    lines = [];
    lines.push('import React, { ReactNode, useContext, useState } from "react";');
    lines.push(`import { Lemma } from '${relativePath(config.hookDirectory, config.typingsDirectory)}/${path.parse(config.typingsFile).name}';`);
    lines.push('');

    for (let lang of config.languages)
        lines.push(`import ${lang.label}_file from '${relativePath(config.hookDirectory, config.dictionaryDirectory)}/${lang.label}.json';`);

    for (let lang of config.languages)
        lines.push(`export const ${lang.label} = '${lang.code}';`);

    lines.push('');

    let types = "";
    let i = 0;
    for (let lang of config.languages) {
        i++;
        types += `typeof ${lang.label}`;

        if (i === config.languages.length)
            continue;

        types += ' | ';
    }
    lines.push(`export type Language = ${types};`);
    lines.push('');

    lines.push('export const locale = (lang: Language): string => {');
    for (let lang of config.languages)
        lines.push(`    if (lang === ${lang.label}) return '${lang.locale}';`);
    lines.push(`    return ''`);
    lines.push('}');
    lines.push('');
    lines.push('/** Translates a Lemma in the given Language */');
    lines.push('const _dict = function(key: Lemma, lang: Language): string {');
    for (let lang of config.languages)
        lines.push(`    if (lang === ${lang.label}) return ${lang.label}_file[key];`);

    lines.push("    return 'ERROR IN TRANSLATION';");
    lines.push('}');
    lines.push('');
    lines.push("export const DictionaryContext = React.createContext<LanguageState>({");
    lines.push(`    lang: ${config.defaultLanguage},`);
    lines.push("    setLang: () => {}");
    lines.push("});");
    lines.push('');
    
    lines.push(`/** A Provider that uses the DictionaryContext to translate Lemmas (keys) into multiple languages.`);
    lines.push(" * * Use `useDictionary` to get the translation function.");
    lines.push(" * * Use `useLang` to get the current language.");
    lines.push(` */`);
    lines.push(`export const DictionaryProvider = ({ lang, children }: { lang?: Language, children: ReactNode }) =>`);
    lines.push(`{`);
    lines.push(`    if (!lang)`);
    lines.push(`        lang = ${config.defaultLanguage};`);
    lines.push(``);
    lines.push(`    const [language, setLanguage] = useState<Language>(lang);`);
    lines.push(`    const state = {`);
    lines.push(`        lang: language,`);
    lines.push(`        setLang: setLanguage`);
    lines.push(`    }`);
    lines.push(``);
    lines.push(``);
    lines.push(`    return (`);
    lines.push(`        <DictionaryContext.Provider value={state}>`);
    lines.push(`            {children}`);
    lines.push(`        </DictionaryContext.Provider>`);
    lines.push(`    )`);
    lines.push(`}`);

    const saved = fs.readFileSync(templateHookFile);
    fs.writeFileSync(hookFile, lines.join("\n") + "\n");
    fs.appendFileSync(hookFile, saved);

    fs.writeFileSync(typingsFile, 'export type Lemma = "";');



}