import fp from 'fastify-plugin';
import { PlayerObject } from '../@types/fastify';
import StarCraft2API from 'starcraft2-api';

const ranks = [
  'bronze',
  'silver',
  'gold',
  'platinum',
  'diamond',
  'master',
  'grandmaster',
] as string[];

export default fp(async (server, {}, next) => {
  const calculateHighestRank = (soloRank?: string, teamRank?: string) => {
    const soloRankIndex = soloRank
      ? ranks.indexOf(soloRank.toLowerCase())
      : -1;

    const teamRankIndex = teamRank
      ? ranks.indexOf(teamRank.toLowerCase())
      : -1;

    return soloRankIndex > teamRankIndex
      ? soloRank
        ? soloRank.toLowerCase()
        : ''
      : teamRank
        ? teamRank.toLowerCase()
        : '';
  };

  const calculateWins = (seasonSnapshot: any) =>
    Object.keys(seasonSnapshot).map(
      gameMode => seasonSnapshot[gameMode].totalWins,
    ).reduce((sum, value) => sum + value);

  const calculateSeasonWinRatio = (apiData: any) => {
    const wins = calculateWins(apiData.seasonSnapshot);
    console.log(wins);
    const totalGames = apiData.totalRankedSeasonGamesPlayed;
    return Math.round(Number(wins) * 100 / totalGames);
  };

  const getHeading = (apiData: any, regionName: string) => {
    const {
      summary,
      career,
    } = apiData.data;

    return {
      portrait: {
        url: summary.portrait,
        frame: calculateHighestRank(
          career.current1v1LeagueName,
          career.currentBestTeamLeagueName,
        ),
      },
      player: {
        clan: {
          name: summary.clanName,
          tag: summary.clanTag,
        },
        name: summary.displayName,
        server: regionName,
      },
    };
  };

  const getStats = (apiData: any) => {
    const {
      snapshot,
      career,
    } = apiData.data;
    const { seasonSnapshot } = snapshot;
    return {
      totalCareerGames: career.totalCareerGames,
      totalRankedGamesThisSeason: seasonSnapshot.totalRankedSeasonGamesPlayed || 0,
      seasonWinRatio: calculateSeasonWinRatio(snapshot) || 0,
      highestSoloRank: career.best1v1Finish.leagueName.toLowerCase(),
      highestTeamRank: career.bestTeamFinish.leagueName.toLowerCase(),
    };
  };

  const getMatchHistory = (apiData: any) => {
    const data = apiData.data.matches as any[];
    return data.map(matchObject => ({
      mapName: matchObject.map,
      mode: matchObject.type,
      result: matchObject.decision.toLowerCase(),
      date: matchObject.date,
    }));
  };

  const getProfileData = async (profile: PlayerObject) => {
    try {
      const profileData = await server.sas.getProfile(profile);
      const matchHistoryData = await server.sas.getLegacyMatchHistory(profile);
      const regionName = StarCraft2API.getRegionNameById(profile.regionId)[0];
      const heading = getHeading(profileData, regionName);
      const stats = getStats(profileData);
      const history = getMatchHistory(matchHistoryData);
      return {
        heading,
        details: {
          stats,
          history,
        },
      };
    } catch {
      return {
        heading: {},
        details: {
          snapshot: {},
          stats: {},
          history: {},
        },
      };
    }
  };

  const getData = async (profiles: PlayerObject[]) => {
    try {
      const profileData = await Promise.all(
        profiles.map(async profile => await getProfileData(profile)),
      );
      return {
        profiles: profileData,
      };
    } catch {
      return [];
    }
  };

  server.decorate('viewer', { getData });

  next();
});
