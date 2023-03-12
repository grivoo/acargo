'use strict';

// imports
import 'reflect-metadata';

/// <reference path="app/typings.d.ts">

import { Application } from './app';
import { Server } from './server';
import { Socket } from './common/socket-util';
import { Log } from './common/log';

const LOGGER = Log.getLogger('main');

let app: Application = new Application();
let server: Server = new Server(app.httpHandler);

let shuttingDown = false;

process.on('SIGINT', () => {
    if (shuttingDown) {
        LOGGER.info('desligando...');

        return;
    }

    shuttingDown = true;

    app.close().then(() => {
        server.close();

        LOGGER.info('desligamento concluído.');

        process.exit();
    });
});

app.start().then(() => {
    server.init();

    app.initSocket(server);

    server.start();
}).then(null, (err) => {
    LOGGER.error(err);
});