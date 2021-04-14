import json
import os
import pathlib


configFile = './config.json'
config = None

with open(configFile, 'r') as config:
    config = json.load(config)

pathlib.Path(config['hookDirectory']).mkdir(parents=True, exist_ok=True)
pathlib.Path(config['dictionaryDirectory']).mkdir(parents=True, exist_ok=True)
pathlib.Path(config['typingsDirectory']).mkdir(parents=True, exist_ok=True)

for lang in config['languages']:
    with open(f"{config['dictionaryDirectory']}/{lang['label']}.json", 'w+') as file:
        file.write('{}')

typingsFile = config['typingsDirectory'] + config['typingsFile']
hookFile = config['hookDirectory'] + config['hookFile']

# dictionary.tsx
templateHookFile = './templates/dictionary.tsx'


lines = []
lines.append('import React, { ReactNode, useContext } from "react";')
lines.append(f"import {{ Lemma }} from '{os.path.relpath(config['typingsDirectory'], config['hookDirectory'])}/{os.path.splitext(config['typingsFile'])[0]}';")
lines.append('')

for lang in config['languages']:
    lines.append(f"import {lang['label']}_file from '{os.path.relpath(config['dictionaryDirectory'], config['hookDirectory'])}/{lang['label']}.json';")

for lang in config['languages']:
    lines.append(f"export const {lang['label']} = '{lang['code']}';")

lines.append('')
types = ""
i = 0
for lang in config['languages']:
    i += 1
    types += f"typeof {lang['label']}"
    if i == len(config['languages']):
        continue
    types += ' | '
lines.append(f"export type Language = {types};")
lines.append('')

lines.append('export const locale = (lang: Language): string => {')
for lang in config['languages']:
    lines.append(f"    if (lang === {lang['label']}) return '{lang['locale']}';")
lines.append('}')
lines.append('')

lines.append('const dict = function(key: Lemma, lang: Language): string {')
for lang in config['languages']:
    lines.append(f"    if (lang === {lang['label']}) return {lang['label']}_file[key];")
lines.append("    return 'ERROR IN TRANSLATION';")
lines.append('}')
lines.append('')
lines.append(f"export const DictionaryContext = React.createContext({config['defaultLanguage']});")

saved = ''

with open(templateHookFile, 'r') as contents:
    saved = contents.readlines()
with open(hookFile, 'w+') as contents:
    contents.writelines('\n'.join(lines) + '\n')
with open(hookFile, 'a+') as contents:
    contents.writelines(saved)


# lemma.ts
with open(typingsFile, 'w+') as typingsfd:
    typingsfd.write('export type Lemma = "";')