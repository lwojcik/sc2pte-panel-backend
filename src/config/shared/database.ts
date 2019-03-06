/**
 * @file    Database configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-08-06
 */

const { env } = process;

interface DbConfig {
  connectionString: string;
}

const dbConfig = {} as DbConfig;

dbConfig.connectionString = env.API_MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/sc2profile-twitch-extension';

export default dbConfig;
