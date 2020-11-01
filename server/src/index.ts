import logger from './util/logger'
import {createConnection} from 'typeorm';
import app from './app';
import config from './config';

createConnection().then((connection) => {
    app.listen(config.port, () => {
        logger.info(`[Server]: Server is running at https://localhost:${config.port}`)
    });
}).catch((err) => {
    logger.error(err.message);
});
