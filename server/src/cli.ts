import yargs from 'yargs';
import {createConnection, getRepository} from 'typeorm';
import {User} from './models/user'
import logger from './util/logger';

const args = yargs.options({
    'name': { type: 'string', demandOption: true, alias: 'n' },
    'email': { type: 'string', demandOption: true, alias: 'e' },
    'password': { type: 'string', demandOption: true, alias: 'p' }
}).argv;

createConnection().then((connection) => {
  const userRepository = getRepository(User);
  const user = new User();
  user.name = args.name;
  user.email = args.email;
  user.password = args.password;
  user.role = 'ADMIN';
  user.hashPassword();
  userRepository.save(user)
      .then((newUser) => {
          logger.info('Created admin user', user)
          process.exit(0)
      })
      .catch((error) => {
          logger.info(error.message);
          process.exit(1)
      })
})
