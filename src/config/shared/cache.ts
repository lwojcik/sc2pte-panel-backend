/**
 * @file    Cache configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-06-19
 */


const cacheConfig = {
  /** Debug mode */
  debug: env.NODE_ENV !== 'production',
  /** Cache time for static endpoints */
  static: '2 weeks',
  /** Cache time for semi-static endpoints (which get updated very rarely) */
  semistatic: '1 hour',
  /** Cache time for endpoints which update frequently but regenerating them consumes time */
  expensiveRequest: '5 minutes',
  /** Cache time for endpoints which update frequently but regenerating them is cheap */
  request: '5 seconds',
};

export default cacheConfig;
