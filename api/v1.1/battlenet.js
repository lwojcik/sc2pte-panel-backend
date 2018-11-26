/**
 * @file    Battle.net new API - authentication and data retrieval functions.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-11-17
 */

const fetch = require('node-fetch');
const diskdb = require('diskdb');


const logging = require('../../config/shared/logging');

const bnetConfig = require('../../config/v1.1/api/battlenet');
const { determineRegionNameById } = require('../../helpers/v1.1/battlenet');

const db = diskdb.connect('./db', ['accessToken']);

/**
 * Returns cached token object from file system.
 * @function
 * @param {string} server - Battle.net API server to request data from.
 * @returns {object} Access token object fetched from Battle.net API.
 */
const getAccessTokenObjectFromLocalDb = () => {
  // logging.info('getAccessTokenObjectFromLocalDb()');
  try {
    const data = db.loadCollections(['accessToken']);
    const accessToken = data.accessToken.findOne();
    // logging.info(JSON.stringify(accessToken));
    return accessToken;
  } catch (error) {
    return error;
  }
};

const updateCachedAccessToken = (newAccessToken) => {
  // logging.info(`updateCachedAccessToken(${JSON.stringify(newAccessToken)})`);
  try {
    if (newAccessToken.access_token && newAccessToken.token_type === 'bearer') {
      const data = db.loadCollections(['accessToken']);
      const accessTokenQuery = { token_type: 'bearer' };
      data.accessToken.remove(accessTokenQuery, true);
      data.accessToken.update(accessTokenQuery, newAccessToken, { upsert: true });
      return newAccessToken;
    }
    return newAccessToken;
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
const getAccessTokenObjectFromBattleNet = async (regionName) => {
  try {
    // logging.info(`getAccessTokenObjectFromBattleNet(${regionName})`);
    const clientId = bnetConfig.api.key;
    // logging.info(clientId);
    const clientSecret = bnetConfig.api.secret;
    const accessTokenRequestServer = bnetConfig.getAccessTokenUri[regionName];
    // logging.info(clientSecret);
    const accessTokenApiPath = `/oauth/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;
    // logging.info(accessTokenApiPath);
    const accessTokenRequestUri = `${accessTokenRequestServer}${accessTokenApiPath}`;
    // logging.info(accessTokenRequestUri);

    const data = await fetch(accessTokenRequestUri);
    const response = await data.json();
    // logging.info('data from fetch(accessTokenRequestUri)');
    // logging.info(`${JSON.stringify(response)}`);
    return response;
  } catch (error) {
    return error;
  }
};

const getAccessTokenObject = async (regionName) => {
  const cachedAccessToken = getAccessTokenObjectFromLocalDb();
  if (typeof cachedAccessToken !== 'undefined' && cachedAccessToken.access_token) {
    return cachedAccessToken;
  }


  try {
    const accessToken = await getAccessTokenObjectFromBattleNet(regionName);
    const accessTokenObject = await accessToken.json();
    const updatedAccessToken = await updateCachedAccessToken(accessTokenObject);
    const updateCachedAccessTokenObject = updatedAccessToken.json();
    return updateCachedAccessTokenObject;
  } catch (error) {
    return error;
  }
};

/**
 * Fetches data from Battle.net API using provided access token.
 * @function
 * @param {string} accessToken - Battle.net API access token.
 * @param {string} requestPath - API endpoint to request data from.
 * @returns {Promise} Promise object representing data fetched from Battle.net API.
 */
const getDataWithAccessToken = async (accessToken, requestPath) => {
  try {
    const data = await fetch(`${requestPath}?access_token=${accessToken}`);
    return data;
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
const queryWithAccessToken = async (regionId, requestPath, newAccessToken) => {
  // logging.info(`queryWithAccessToken(${regionId}, ${requestPath}, ${JSON.stringify(newAccessToken)})`);
  const regionName = determineRegionNameById(regionId);
  try {
    const accessTokenObject = newAccessToken || await getAccessTokenObject(regionName);
    const accessToken = accessTokenObject.access_token;
    const authenticatedRequestUri = bnetConfig.api.url[regionName];
    const authenticatedRequestPath = `${authenticatedRequestUri}${requestPath}`;
    const data = await getDataWithAccessToken(accessToken, authenticatedRequestPath);
    // logging.info(`data.status: ${data.status}`);

    if (data.status === 401) {
      const newAccessTokenObject = await getAccessTokenObjectFromBattleNet(regionName);
      // logging.info('newAccessTokenObject:');
      // logging.info(JSON.stringify(newAccessTokenObject));
      updateCachedAccessToken(newAccessTokenObject);
      const newData = await queryWithAccessToken(regionId, requestPath, newAccessTokenObject);
      return newData;
    }

    const response = await data.json();
    return response;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAccessTokenObjectFromLocalDb,
  queryWithAccessToken,
};
