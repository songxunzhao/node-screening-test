import * as _ from 'lodash';
import dotenv from 'dotenv'

dotenv.config();

const config = {
    env: process.env.NODE_ENV || 'development',
    default: {
        apiPath: process.env.API_PATH || '/api/v1',
        jwtSecret: process.env.JWT_SECRET,
        port: 8000
    },
    development: {
    },
    staging: {
    },
    production: {
    }
};

export default _.assign(config.default, config[config.env]);
