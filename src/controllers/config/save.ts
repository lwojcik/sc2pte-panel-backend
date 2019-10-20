import validateConfig from './validate';
import { ConfigObject } from '../../@types/fastify';
// import { ChannelConfig }  from '../../models';

const saveConfigInDb = (config: ConfigObject) => {
  console.log(config);
  return true;
}

const saveConfig = (config: ConfigObject) => 
  validateConfig(config) && saveConfigInDb(config);

export default saveConfig;