import json
import os
import pathlib
import sys
import shutil

cwd = os.path.dirname(os.path.realpath(__file__))
os.chdir(cwd)

remove = False
try:
    remove = sys.argv[1] == '-r' or sys.argv[1] == '--remove'
except:
    pass

configFile = './rt_config.json'
config = None

with open(configFile, 'r') as config:
    config = json.load(config)

pathlib.Path(config['hookDirectory']).mkdir(parents=True, exist_ok=True)
pathlib.Path(config['dictionaryDirectory']).mkdir(parents=True, exist_ok=True)
pathlib.Path(config['typingsDirectory']).mkdir(parents=True, exist_ok=True)



typingsFile = config['typingsDirectory'] + config['typingsFile']
hookFile = config['hookDirectory'] + config['hookFile']
# insertionFile = f"{config['insertionDirectory']}/lemma.py"
# installationFile = f"{config['configDirectory']}/rt_install.py"
# configFile = f"{config['configDirectory']}/rt_config.json"

try:
    if remove:
        pathlib.Path(typingsFile).unlink()
        pathlib.Path(hookFile).unlink()
        # pathlib.Path(insertionFile).unlink()
        # pathlib.Path(installationFile).unlink()
        # pathlib.Path(configFile).unlink()
        for lang in config['languages']:
            langfile = f"{config['dictionaryDirectory']}/{lang['label']}.json"
            pathlib.Path(langfile).unlink()
        pathlib.Path(config['dictionaryDirectory']).rmdir()
        pathlib.Path(config['hookDirectory']).rmdir()
        pathlib.Path(config['typingsDirectory']).rmdir()
        
        exit()
except:
    exit()


for lang in config['languages']:
    with open(f"{config['dictionaryDirectory']}/{lang['label']}.json", 'w+') as file:
        file.write('{}')

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
lines.append(f"    return ''")
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

# Copy config & lemma.py to root

# shutil.copy('./lemma.py', insertionFile)
# shutil.copy('./rt_install.py', installationFile)
# shutil.copy('./rt_config.json', configFile)