/**
 * @file    Battle.net authentication and data retrieval functions.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2017-12-17
 */

const fetch = require('node-fetch');
const diskdb = require('diskdb');

const bnetConfig = require('../../config/v1/api/battlenet');

const db = diskdb.connect('./db', ['accessTokenLegacy']);

/**
 * General method for fetching data from selected Battle.net endpoint.
 * @function
 * @param {string} requestUri - full URL to request from.
 * @returns {Promise} A promise that returns Battle.net data if resolved and error if rejected.
 */
const query = async (requestUri) => {
  try {
    const data = await fetch(`${requestUri}?apikey=${bnetConfig.api.key}`);
    return data.json();
  } catch (error) {
    return error;
  }
};

/**
 * Returns cached token object from file system.
 * @function
 * @param {string} server - Battle.net API server to request data from.
 * @returns {Promise} Promise object representing access token object fetched from Battle.net API.
 */
const getAccessTokenObjectFromLocalDb = () => {
  try {
    const data = db.loadCollections(['accessTokenLegacy']);
    return data.accessTokenLegacy.findOne();
  } catch (error) {
    return error;
  }
};


const updateCachedAccessToken = (accessTokenLegacy) => {
  try {
    const data = db.loadCollections(['accessTokenLegacy']);
    data.accessTokenLegacy.remove({ token_type: 'bearer' }, true);
    data.accessTokenLegacy.update({}, accessTokenLegacy, { upsert: true });
    return accessTokenLegacy;
  } catch (error) {
    return error;
  }
};

/**
 * Returns access token object fetched from Battle.net API.
 * @function
 * @param {string} server - Battle.net API server to request data from.
 * @returns {Promise} Promise object representing access token object fetched from Battle.net API.
 */
const getAccessTokenObjectFromBattleNet = async (server) => {
  const clientId = bnetConfig.api.key;
  const clientSecret = bnetConfig.api.secret;
  const accessTokenRequestServer = bnetConfig.getAccessTokenUri[server];
  const accessTokenApiPath = `/oauth/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;
  const accessTokenRequestUri = `${accessTokenRequestServer}${accessTokenApiPath}`;

  try {
    const data = await fetch(accessTokenRequestUri);
    return data.json();
  } catch (error) {
    return error;
  }
};

const getAccessTokenObject = async (server) => {
  const cachedAccessTokenLegacy = getAccessTokenObjectFromLocalDb();

  if (cachedAccessTokenLegacy === undefined) {
    try {
      const accessTokenLegacy = await getAccessTokenObjectFromBattleNet(server);
      return updateCachedAccessToken(accessTokenLegacy);
    } catch (error) {
      return error;
    }
  }

  return cachedAccessTokenLegacy;
};
/**
 * Fetches data from Battle.net API using provided access token.
 * @function
 * @param {string} accessToken - Battle.net API access token.
 * @param {string} requestPath - API endpoint to request data from.
 * @returns {Promise} Promise object representing data fetched from Battle.net API.
 */
const getDataWithAccessToken = async (accessTokenLegacy, requestPath) => {
  try {
    const data = await fetch(`${requestPath}?access_token=${accessTokenLegacy}`);
    return data.json();
  } catch (error) {
    return error;
  }
};

/**
 * Performs access-key authentication and fetches data from protected Battle.net endpoints.
 * @function
 * @param {string} server - server name abbreviation.
 * @param {string} requestPath - Path to request from.
 * @returns {Promise} Promise object representing data fetched from Battle.net API.
 */
const queryWithAccessToken = async (server, requestPath) => {
  try {
    const accessTokenObject = await getAccessTokenObject(server);
    const accessTokenLegacy = accessTokenObject.access_token;
    const authenticatedRequestUri = bnetConfig.api.url[server];
    const authenticatedRequestPath = `${authenticatedRequestUri}${requestPath}`;

    const data = await getDataWithAccessToken(accessTokenLegacy, authenticatedRequestPath);

    if (data.code === 403) {
      const newAccessTokenObject = await getAccessTokenObjectFromBattleNet(server);
      const updatedCachedAccessToken = updateCachedAccessToken(newAccessTokenObject);
      const newAccessToken = updatedCachedAccessToken.access_token;
      const newData = await getDataWithAccessToken(newAccessToken, authenticatedRequestPath);
      return newData;
    }

    return data;
  } catch (error) {
    return error;
  }
};

module.exports = {
  query,
  queryWithAccessToken,
};
