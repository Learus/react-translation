# -*- coding: utf-8 -*-
import json
import sys

configFile = './rt_config.json'
config = None

with open(configFile, 'r') as config:
    config = json.load(config)

prefix = config['dictionaryDirectory']
lemmaFile = f"{config['typingsDirectory']}/{config['typingsFile']}"

lemma = input("Enter your lemma (The key you are going to use to access the translations): ")

remove = False
if len(sys.argv) > 1 and sys.argv[1] == "-r":
    remove = True

# Gather Input and initialize data
inputs = {}
data = {}

for lang in config['languages']:
    if not remove:
        inputs[lang['label']] = input(f"Enter your {lang['label']} translation: ")
    with open(f"{prefix}/{lang['label']}.json", 'r', encoding='utf8') as lang_data:
        data[lang['label']] = json.load(lang_data)


# Update data
for lang in config['languages']:
    if remove:
        data[lang['label']].pop(lemma, None)
    else:
        data[lang['label']][lemma] = inputs[lang['label']]

# Rewrite Data
for lang in config['languages']:
    with open(f"{prefix}/{lang['label']}.json", 'w+', encoding='utf8') as lang_fd:
        json.dump(data[lang['label']], lang_fd, ensure_ascii=False)


with open(lemmaFile, 'w+') as lemma:
    lemmas = ""
    i = 0
    lang_data = list(data.values())[0]
    length = len(lang_data.keys())

    for l in lang_data.keys():
        lemmas += f'"{l}"'
        if i != length - 1:
            lemmas += " | "
        i += 1

    lemma.write(f"export type Lemma = {lemmas};")