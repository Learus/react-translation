import * as fs from 'fs';
import { askQuestion, formatConfig } from "./util.js";

export async function lemma(lemma, remove = false) {
    const config = formatConfig();

    const prefix = config.dictionaryDirectory;
    const lemmaFile = `${config.typingsDirectory}/${config.typingsFile}`;

    // Gather Input and initialize data
    let inputs = {};
    let data = {};

    for (const lang of config.languages) {
        if (!remove)
            inputs[lang.label] = await askQuestion(`Enter your ${lang.label} translation: `);

        data[lang.label] = JSON.parse(fs.readFileSync(`${prefix}/${lang.label}.json`,
                                        { encoding: 'utf-8' }));
    }

    // Update data
    for (const lang of config.languages) {
        if (remove)
            delete data[lang.label][lemma];
        else
            data[lang.label][lemma] = inputs[lang.label];
    }

    // Rewrite data\
    
    for (const lang of config.languages) {

        fs.writeFileSync(`${prefix}/${lang.label}.json`,
            JSON.stringify(data[lang.label]),
            { encoding: 'utf-8' });
    }


    let lemmas = "";
    let i = 0;
    let lang_data = Object.values(data)[0];
    let length = Object.keys(lang_data).length;

    for (const l of Object.keys(lang_data)) {
        lemmas += `"${l}"`;

        if (i !== length - 1)
            lemmas += " | ";
        i++;
    }

    fs.writeFileSync(lemmaFile, `export type Lemma = ${lemmas};`);
}
