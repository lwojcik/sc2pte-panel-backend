/**
 * @file    Battle.net new API - authentication and data retrieval functions.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-11-17
 */

const fetch = require('node-fetch');
const diskdb = require('diskdb');

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
  try {
    const data = db.loadCollections(['accessToken']);
    return data.accessToken.findOne();
  } catch (error) {
    return error;
  }
};

const updateCachedAccessToken = (accessToken) => {
  try {
    const data = db.loadCollections(['accessToken']);
    data.accessToken.update({}, accessToken, { upsert: true });
    return accessToken;
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
const getAccessTokenObjectFromBattleNet = async (regionId) => {
  const regionName = determineRegionNameById(regionId);
  const clientId = bnetConfig.api.key;
  const clientSecret = bnetConfig.api.secret;
  const accessTokenRequestServer = bnetConfig.getAccessTokenUri[regionName];
  const accessTokenApiPath = `/oauth/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;
  const accessTokenRequestUri = `${accessTokenRequestServer}${accessTokenApiPath}`;

  try {
    const data = await fetch(accessTokenRequestUri);
    return data.json();
  } catch (error) {
    return error;
  }
};

const getAccessTokenObject = async (regionId) => {
  const regionName = determineRegionNameById(regionId);
  const cachedAccessToken = getAccessTokenObjectFromLocalDb();

  if (cachedAccessToken === undefined) {
    try {
      const accessToken = await getAccessTokenObjectFromBattleNet(regionName);
      return updateCachedAccessToken(accessToken);
    } catch (error) {
      return error;
    }
  }

  return cachedAccessToken;
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
const queryWithAccessToken = async (regionId, requestPath) => {
  const regionName = determineRegionNameById(regionId);
  try {
    const accessTokenObject = await getAccessTokenObject(regionName);
    const accessToken = accessTokenObject.access_token;
    const authenticatedRequestUri = bnetConfig.api.url[regionName];
    const authenticatedRequestPath = `${authenticatedRequestUri}${requestPath}`;

    const data = await getDataWithAccessToken(accessToken, authenticatedRequestPath);

    if (data.code === 403) {
      const newAccessTokenObject = await getAccessTokenObjectFromBattleNet(regionName);
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
  queryWithAccessToken,
};
