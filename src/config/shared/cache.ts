/**
 * @file    Cache configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-06-19
 */

const { env } = process;

interface CacheConfig {
  debug: boolean;
  static: string;
  semistatic: string;
  expensiveRequest: string;
  request: string;
}

const cacheConfig = {} as CacheConfig;

/** Debug mode */
cacheConfig.debug = env.NODE_ENV !== 'production';
/** Cache time for static endpoints */
cacheConfig.static = '2 weeks';
/** Cache time for semi-static endpoints (which get updated very rarely) */
cacheConfig.semistatic = '1 hour';
/** Cache time for endpoints which update frequently but regenerating them consumes time */
cacheConfig.expensiveRequest = '5 minutes';
/** Cache time for endpoints which update frequently but regenerating them is cheap */
cacheConfig.request = '5 seconds';

export default cacheConfig;
