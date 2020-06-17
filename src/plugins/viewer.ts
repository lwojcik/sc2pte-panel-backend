import fp from 'fastify-plugin';
import { PlayerObject } from 'starcraft2-api';

export default fp(async (server, {}, next) => {
  const getHeading = () => ({
    portrait: {
      url: 'https://static.starcraft2.com/starport/d0e7c831-18ab-4cd6-adc7-9d4a28f49ec7/portraits/2-14.jpg',
      frame: 'grandmaster',
    },
    player: {
      clan: {
        name: 'name',
        tag: 'nm',
      },
      name: 'Player name',
      server: 'eu',
    },
  });

  // const getLeagueData = () => true;

  const getSnapshot = () => ([
    {
      mode: '1v1',
      rank: 1,
      wins: 101,
      losses: 100,
      race: 'random',
      mmr: 3655,
      divisionRank: 4,
      teamMembers: [
        'Player name 1',
        'Player name 2',
        'Player name 3',
      ],
    },
    {
      mode: '2v2',
      rank: 2,
      wins: 101,
      losses: 100,
      race: 'random',
      mmr: 3655,
      divisionRank: 3,
      teamMembers: [
        'Player name 1',
        'Player name 2',
        'Player name 3',
      ],
    },
  ]);

  const getStats = () => ({
    totalCareerGames: 100,
    totalGamesThisSeason: 101,
    totalRankedGamesThisSeason: 102,
    highestSoloRank: 'silver',
    highestTeamRank: '',
  });

  const getHistory = () => ([
    {
      mapName: 'Kairos Junction LE',
      mode: '1v1',
      result: 'win',
      date: 1562164424000,
    },
    {
      mapName: 'Kairos Junction LE',
      mode: '1v1',
      result: 'loss',
      date: 1562164424000,
    },
    {
      mapName: 'Kairos Junction LE',
      mode: '1v1',
      result: 'win',
      date: 1562164424000,
    },
    {
      mapName: 'Kairos Junction LE',
      mode: '1v1',
      result: 'win',
      date: 1562164424000,
    },
    {
      mapName: 'Kairos Junction LE',
      mode: '1v1',
      result: 'loss',
      date: 1562164424000,
    },
    {
      mapName: 'Kairos Junction LE',
      mode: '1v1',
      result: 'win',
      date: 1562164424000,
    },
    {
      mapName: 'Kairos Junction LE',
      mode: '1v1',
      result: 'win',
      date: 1562164424000,
    },
  ]);

  const getProfileData = (profile?: PlayerObject) => {
    void(profile);
    return {
      heading: getHeading(),
      details: {
        snapshot: getSnapshot(),
        stats: getStats(),
        history: getHistory(),
      },
    };
  };

  const getViewerData = (profiles: PlayerObject[]) => {
    const profileData = profiles.map(profile => getProfileData(profile));
    return {
      profiles: profileData,
    };
  };

  const getData = async (profiles: PlayerObject[]) => {
    try {
      const data = await getViewerData(profiles);
      return data;
    } catch (error) {
      return {
        status: 400,
        message: 'Error fetching data',
      };
    }
  };

  server.decorate('viewer', { getData });

  next();
});
