#!/usr/bin/env node
// 'use strict';

import meow from 'meow';
import install from './install.js';
import { lemma } from './lemma.js';
import uninstall from './uninstall.js';

const cli = meow(``, {
    importMeta: import.meta,
    allowUnknownFlags: false,
    flags: {
        install: {
            type: 'boolean',
            alias: 'i'
        },
        insert: {
            type: 'string',
            alias: 'l'
        },
        remove: {
            type: 'string',
            alias: 'r'
        },
        uninstall: {
            type: 'boolean',
            alias: 'u'
        },
        rootDir: {
            type: 'string',
            alias: 'rd'
        }
    }
})

if (cli.flags.install) {
    install({ rootDir: cli.flags.rootDir });
}
else if (cli.flags.uninstall) {
    uninstall();
}
else if (cli.flags.insert) {
    if (cli.flags.insert !== '')
        lemma(cli.flags.insert);
}
else if (cli.flags.remove) {
    if (cli.flags.remove !== '')
        lemma(cli.flags.remove, true); // <-- Remove
}