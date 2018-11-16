/**
 * @file    Battle.net configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-11-17
 */

const { env } = process;


const bnetConfig = {};

/** Battle.net API server identifiers */
bnetConfig.servers = ['eu', 'kr', 'us'];

bnetConfig.api = {};
bnetConfig.api.url = {};
/** Battle.net API URL for American region */
bnetConfig.api.url.us = 'https://us.api.battle.net';
/** Battle.net API URL for European region */
bnetConfig.api.url.eu = 'https://eu.api.api.blizzard.com';
/** Battle.net API URL for Korean region */
bnetConfig.api.url.kr = 'https://kr.api.blizzard.com';
/** Battle.net API URL for Taiwanese region */
bnetConfig.api.url.tw = 'https://tw.api.battle.net';
/** Battle.net API URL to use in China */
bnetConfig.api.url.cn = 'https://gateway.battlenet.com.cn/';

/** Battle.net API key */
bnetConfig.api.key = env.API_BATTLENET_KEY;
/** Battle.net API secret */
bnetConfig.api.secret = env.API_BATTLENET_SECRET;

/** Battle.net API URL for checking access token validity */
bnetConfig.checkAccessTokenUri = 'battle.net/oauth/check_token?token=';
/** Battle.net API URL for checking access token validity to use in China */
bnetConfig.checkAccessUriCn = 'https://www.battlenet.com.cn/oauth/check_token?token=';

bnetConfig.getAccessTokenUri = {};
/** Battle.net API URL for getting access token in European region */
bnetConfig.getAccessTokenUri.eu = 'https://eu.battle.net';
/** Battle.net API URL for getting access token in Korean region */
bnetConfig.getAccessTokenUri.kr = 'https://kr.battle.net';
/** Battle.net API URL for getting access token in American region */
bnetConfig.getAccessTokenUri.us = 'https://us.battle.net';
/** Battle.net API URL for getting access token from China */
bnetConfig.getAccessTokenUri.cn = 'https://www.battlenet.com.cn';

module.exports = bnetConfig;
