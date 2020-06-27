import fp from 'fastify-plugin';
import { PlayerObject } from '../@types/fastify';
import StarCraft2API from 'starcraft2-api';
import jsonQuery from 'json-query-next';

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

    return {
      totalCareerGames: career?.totalCareerGames || 0,
      totalRankedGamesThisSeason: snapshot?.totalRankedSeasonGamesPlayed,
      seasonWinRatio: calculateSeasonWinRatio(snapshot) || 0,
      highestSoloRank: career?.best1v1Finish?.leagueName?.toLowerCase() || '',
      highestTeamRank: career?.bestTeamFinish?.leagueName?.toLowerCase() || '',
    };
  };

  const getPlayerLadderInfo = (apiData: any, profileId: number) => {
    const {
      ladderTeams,
      ranksAndPools,
      currentLadderMembership,
    } = apiData.data;

    const {
      rank,
      mmr,
    } = ranksAndPools[0];
    const localizedGameMode = currentLadderMembership.localizedGameMode.split(' ');
    const mode = localizedGameMode[0].toLowerCase();
    const rankName = localizedGameMode[1].toLowerCase();
    console.log(rankName);
    const playerLadderData = ladderTeams[rank - 1];
    const {
      wins,
      losses,
      teamMembers,
    } = playerLadderData;
    const teamMemberNames = teamMembers.map((teamMember:any) => teamMember.displayName);

    const race = jsonQuery(
      `teamMembers[id=${profileId}].favoriteRace`,
      { data: playerLadderData },
    ).value.toLowerCase() || '';

    return {
      mode,
      rank: rankName,
      wins,
      losses,
      race,
      mmr,
      divisionRank: rank,
      teamMembers: teamMemberNames,
    };
  };

  const getLadderData = async (profile: any, ladderId: number) => {
    const { profileId } = profile;
    const ladderApiData = await server.sas.getLadder(profile, ladderId);
    const playerLadderInfo = getPlayerLadderInfo(ladderApiData, profileId);
    return playerLadderInfo;
  };

  const getSnapshot = (apiData: any, profile: any) => {
    const { allLadderMemberships } = apiData.data;
    const ladderIds =
      allLadderMemberships.map((ladderMembership: any) => ladderMembership.ladderId);
    return Promise.all(
      ladderIds.map(
        async (ladderId: any) => await getLadderData(profile, ladderId),
      ),
    );
  };

  const getMatchHistory = (apiData: any) => {
    const data = apiData.data.matches as any[];
    const filteredMatchHistory = data.filter(match => match.type !== 'Custom');

    return filteredMatchHistory.map(matchObject => ({
      mapName: matchObject.map,
      mode: matchObject.type,
      result: matchObject.decision.toLowerCase(),
      date: matchObject.date * 1000,
    }));
  };

  const getProfileData = async (profile: PlayerObject) => {
    try {
      const profileData = await server.sas.getProfile(profile);
      const matchHistoryData = await server.sas.getLegacyMatchHistory(profile);
      const ladderSummaryData = await server.sas.getLadderSummary(profile);
      const regionName = StarCraft2API.getRegionNameById(profile.regionId)[0];
      const heading = getHeading(profileData, regionName);
      const snapshot = await getSnapshot(ladderSummaryData, profile);
      const stats = getStats(profileData);
      const history = getMatchHistory(matchHistoryData);

      return {
        heading,
        details: {
          snapshot,
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
