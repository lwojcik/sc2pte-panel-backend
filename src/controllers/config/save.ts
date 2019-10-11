import validateConfig from './validate';
import { ConfigObject } from '../../@types/fastify';

const saveConfigInDb = ({}) => true;

const saveConfig = (config: ConfigObject) => 
  validateConfig(config) && saveConfigInDb(config);

export default saveConfig;