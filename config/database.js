/**
 * @file    Database configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-08-06
 */

const { env } = process;

const dbConfig = {};

dbConfig.connectionString = env.API_MONGODB_CONNECTION_STRING;

module.exports = dbConfig;

