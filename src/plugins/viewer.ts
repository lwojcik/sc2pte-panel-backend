/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import { StarCraft2API, PlayerObject } from "starcraft2-api";

interface DataObject {
  segment: string;
  data: object;
  ttlTime?: number;
}

interface ViewerOptions {
  ttl: number;
}

const ranks = [
  "bronze",
  "silver",
  "gold",
  "platinum",
  "diamond",
  "master",
  "grandmaster",
] as string[];

const viewerPlugin: FastifyPluginCallback<ViewerOptions> = (
  server,
  { ttl }: ViewerOptions,
  next
) => {
  const cache = server.redis;
  const cacheActive = Boolean(server.redis);

  const cacheObject = async ({ segment, data }: DataObject) => {
    if (!cacheActive) return "Object not cached (Cache disabled)";
    await cache.set(segment, JSON.stringify(data));
    return "Object cached successfully";
  };

  // eslint-disable-next-line no-confusing-arrow
  const getCachedObject = (segment: string) =>
    cacheActive ? server.redis.get(segment) : JSON.stringify({});

  const calculateHighestRank = (soloRank?: string, teamRank?: string) => {
    const soloRankIndex = soloRank ? ranks.indexOf(soloRank.toLowerCase()) : -1;

    const teamRankIndex = teamRank ? ranks.indexOf(teamRank.toLowerCase()) : -1;

    // eslint-disable-next-line no-nested-ternary
    return soloRankIndex > teamRankIndex
      ? soloRank
        ? soloRank.toLowerCase()
        : ""
      : teamRank
      ? teamRank.toLowerCase()
      : "";
  };

  const calculateWins = (seasonSnapshot: any) =>
    Object.keys(seasonSnapshot)
      .map((gameMode) => seasonSnapshot[gameMode].totalWins)
      .reduce((sum, value) => sum + value);

  const calculateSeasonWinRatio = (apiData: any) => {
    const wins = calculateWins(apiData.seasonSnapshot);
    const totalGames = apiData.totalRankedSeasonGamesPlayed;
    return Math.round((Number(wins) * 100) / totalGames);
  };

  const getHeading = (apiData: any, regionName: string) => {
    const { summary, career } = apiData.data;

    return {
      portrait: {
        url: summary.portrait,
        frame: calculateHighestRank(
          career.current1v1LeagueName,
          career.currentBestTeamLeagueName
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
    const { snapshot, career } = apiData.data;

    return {
      totalCareerGames: career?.totalCareerGames || 0,
      totalRankedGamesThisSeason: snapshot?.totalRankedSeasonGamesPlayed,
      seasonWinRatio: calculateSeasonWinRatio(snapshot) || 0,
      highestSoloRank: career?.best1v1Finish?.leagueName?.toLowerCase() || "",
      highestTeamRank: career?.bestTeamFinish?.leagueName?.toLowerCase() || "",
    };
  };

  const getPlayerLadderInfo = (apiData: any, profileId: number) => {
    const { ladderTeams, ranksAndPools, league, currentLadderMembership } =
      apiData.data;

    const { rank, mmr } = ranksAndPools[0];
    const { localizedGameMode } = currentLadderMembership;
    const mode = localizedGameMode.split(" ")[0];
    const rankName = league;

    const playerLadderData = ladderTeams.filter((ladderTeam: any) =>
      ladderTeam.teamMembers.some(
        (teamMember: any) => teamMember.id === profileId
      )
    )[0];

    const { wins, losses, teamMembers } = playerLadderData;
    const teamMemberNames = teamMembers.map(
      (teamMember: any) => teamMember.displayName
    );

    const race = teamMembers.filter(
      (teamMember: any) => teamMember.id === profileId
    )[0].favoriteRace;

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

  const getLadderData = async (profile: PlayerObject, ladderId: number) => {
    const { profileId } = profile;
    const ladderApiData = await server.sas.getLadder(profile, ladderId);
    const playerLadderInfo = getPlayerLadderInfo(
      ladderApiData,
      profileId as number
    );
    return playerLadderInfo;
  };

  const getFallbackSnapshot = (apiData: any) => {
    const { seasonSnapshot } = apiData.data.snapshot;
    const gameModes = Object.keys(seasonSnapshot);
    return gameModes
      .map((mode) => {
        if (seasonSnapshot[mode]?.rank !== -1) {
          return {
            mode,
            rank: seasonSnapshot[mode].leagueName?.toLowerCase() || "",
            wins: seasonSnapshot[mode].totalWins,
            losses:
              seasonSnapshot[mode].totalGames - seasonSnapshot[mode].totalWins,
            race: "n/a",
            mmr: "n/a",
            divisionRank: seasonSnapshot[mode].rank,
          };
        }
        return null;
      })
      .filter((el) => el !== null);
  };

  const getSnapshot = async (apiData: any, profile: any) => {
    const { allLadderMemberships } = apiData.data;
    const ladderIds = allLadderMemberships.map(
      (ladderMembership: any) => ladderMembership.ladderId
    );

    return (
      await Promise.allSettled(
        ladderIds.map((ladderId: any) => getLadderData(profile, ladderId))
      )
    )
      .filter((item) => item.status === "fulfilled")
      .map((item: any) => item.value);
  };

  const getMatchHistory = (apiData: any) => {
    const data = apiData.data.matches as any[];
    const filteredMatchHistory = data.filter(
      (match) => match.type !== "Custom"
    );

    return filteredMatchHistory.map((matchObject) => ({
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
      const snapshot =
        (ladderSummaryData as any)?.data?.allLadderMemberships.length >= 1
          ? await getSnapshot(ladderSummaryData, profile)
          : getFallbackSnapshot(profileData);

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
    } catch (error) {
      return {};
    }
  };

  const getFreshData = async (profiles: PlayerObject[]) => {
    try {
      const profileData = (
        await Promise.allSettled(
          profiles.map((profile) => getProfileData(profile))
        )
      )
        .filter((item) => item.status === "fulfilled")
        .map((item: any) => item.value);

      return {
        profiles: profileData,
      };
    } catch (error) {
      return [];
    }
  };

  interface GetDataParams {
    channelId: string;
    profiles: PlayerObject[];
    refresh?: boolean;
  }

  const getDataAndRefreshCache = async (
    profiles: PlayerObject[],
    cacheSegment: string
  ) => {
    const profileData = await getFreshData(profiles);
    const created = Math.floor(Date.now() / 1000);

    const freshData = {
      created,
      ...profileData,
    };

    if (cacheActive) {
      cacheObject({
        segment: cacheSegment,
        data: freshData,
      });
    }

    return freshData;
  };

  const getData = async ({ channelId, profiles, refresh }: GetDataParams) => {
    const cacheSegment = `viewer:${channelId}`;
    const cachedData = await getCachedObject(cacheSegment);

    const now = Math.floor(Date.now() / 1000);
    const objectCreationDate = Number(cachedData?.created) || 0;
    const staleData = now - objectCreationDate >= ttl;

    if (!cachedData || staleData || refresh) {
      return getDataAndRefreshCache(profiles, cacheSegment);
    }

    return cachedData;
  };

  server.decorate("viewer", {
    getData,
    getFreshData,
  });

  next();
};

export default fp(viewerPlugin);
