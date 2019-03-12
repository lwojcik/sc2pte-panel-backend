/**
 * @file    StarCraft II configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-08-06
 */

const sc2Config = {};

/** Race names */
sc2Config.races = ['ALL', 'RANDOM', 'TERRAN', 'ZERG', 'PROTOSS'];

sc2Config.matchMaking = {};
/** Matchmaking modes as used in Battle.net API */
sc2Config.matchMaking.modes = ['ALL', '1V1', 'ARCHON', '2V2', '3V3', '4V4'];

/** Matchmaking ranks in order specified in https://us.battle.net/forums/en/sc2/topic/20749724960 */
sc2Config.matchMaking.ranks = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER', 'GRANDMASTER'];
/** Matchmaking team types in order specified in https://us.battle.net/forums/en/sc2/topic/20749724960 */
sc2Config.matchMaking.teamTypes = ['ARRANGED', 'RANDOM'];

module.exports = sc2Config;
