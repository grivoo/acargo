// imports
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as express from 'express';

import { Config } from './common/config';
import { Log } from './common/log';

export class Server {
    private static readonly LOGGER = Log.getLogger('server');
    private _server: http.Server | https.Server;

    get server(): http.Server | https.Server {
        return this._server;
    }

    constructor(
        private handler: (
            req: http.IncomingMessage,
            res: http.ServerResponse
        ) => void
    ) { }

    // função de inicializar o servidor
    public init(): void {
        Server.LOGGER.info('inicializando servidor...');

        let httpsEnabled = false;
        let httpsConfig: any = Config.get('https');

        if (httpsConfig !== undefined && httpsConfig.enabled === true)
            httpsEnabled = true;

        if (httpsEnabled) {
            let options = {
                key: fs.readFileSync(httpsConfig.key).toString(),
                cert: fs.readFileSync(httpsConfig.cert).toString()
            };

            this._server = https.createServer(options, this.handler);
        } else {
            this._server = http.createServer(this.handler);
        }

        this._server.on('listening', () => Server.LOGGER.info('servidor inicializado.'));
    }

    // função start para inicialização
    public start(): void {
        this._server.listen(Config.get('port'));
    }

    // função de fechar o servidor
    public close(): void {
        Server.LOGGER.info('fechando servidor...');

        this._server.close();

        Server.LOGGER.info('servidor fechado.');
    }
}