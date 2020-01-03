import fp from "fastify-plugin";
// import schema from "./schema";

const getSampleSnapshot = (rank: string, divisionRank: number) => ([
  {
    mode: "1v1",
    rank,
    wins: 101,
    losses: 100,
    race: "random",
    mmr: 3655,
    divisionRank,
    teamMembers: [
      'Player name 1',
      'Player name 2',
      'Player name 3',
    ],
  },
  {
    mode: "2v2",
    rank,
    wins: 101,
    losses: 100,
    race: "random",
    mmr: 3655,
    divisionRank,
    teamMembers: [
      'Player name 1',
      'Player name 2',
      'Player name 3',
    ],
  },
]);

export default fp((server, {}, next) => {
  server.get(
    "/v2/viewer/:channelId",
    {
      preValidation: [server.authenticateViewer],
    },
    (request, reply) => {
      const { channelId } = request.params;
      
      const successFn = () => reply.code(200).send({
        channelId,
        data: {
          profiles: [
            {
              heading: {
                portrait: {
                  url: "https://static.starcraft2.com/starport/d0e7c831-18ab-4cd6-adc7-9d4a28f49ec7/portraits/2-14.jpg",
                  frame: "grandmaster",
                },
                player: {
                  clan: {
                    name: "name",
                    tag: "nm",
                  },
                  name: "Player name",
                  server: "eu",
                },
              },
              details: {
              // snapshot: [],
                snapshot: [
                  ...getSampleSnapshot('bronze', 1),
                ],
                stats: {
                  totalCareerGames: 100,
                  totalGamesThisSeason: 101,
                  totalRankedGamesThisSeason: 102,
                  highestSoloRank: "silver",
                  highestTeamRank: "",
                },
                // history: [],
                history: [
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "loss",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "loss",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "loss",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "loss",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "loss",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "loss",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "loss",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                ],
              },
            },
            {
              heading: {
                portrait: {
                  url: "https://static.starcraft2.com/starport/d0e7c831-18ab-4cd6-adc7-9d4a28f49ec7/portraits/2-14.jpg",
                  frame: "grandmaster",
                },
                player: {
                  clan: {
                    name: "",
                    tag: "",
                  },
                  name: "Player name",
                  server: "eu",
                },
              },
              details: {
                snapshot: [
                  {
                    mode: "1v1",
                    rank: "silver",
                    wins: 101,
                    losses: 100,
                    race: "random",
                    mmr: 3655,
                    divisionRank: 3,
                  },
                  {
                    mode: "2v2",
                    rank: "silver",
                    wins: 101,
                    losses: 100,
                    race: "terran",
                    mmr: 3655,
                    divisionRank: 3,
                  },
                ],
                stats: {
                  totalCareerGames: 100,
                  totalGamesThisSeason: 101,
                  totalRankedGamesThisSeason: 102,
                  highestSoloRank: "silver",
                  highestTeamRank: "",
                },
                history: [
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "loss",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                ],
              },
            },
            {
              heading: {
                portrait: {
                  url: "https://static.starcraft2.com/starport/d0e7c831-18ab-4cd6-adc7-9d4a28f49ec7/portraits/2-14.jpg",
                  frame: "grandmaster",
                },
                player: {
                  clan: {
                    name: "",
                    tag: "",
                  },
                  name: "Player name",
                  server: "eu",
                },
              },
              details: {
                snapshot: [
                  {
                    mode: "1v1",
                    rank: "silver",
                    wins: 101,
                    losses: 100,
                    race: "random",
                    mmr: 3655,
                    divisionRank: 3,
                  },
                  {
                    mode: "2v2",
                    rank: "silver",
                    wins: 101,
                    losses: 100,
                    race: "terran",
                    mmr: 3655,
                    divisionRank: 3,
                  },
                ],
                stats: {
                  totalCareerGames: 100,
                  totalGamesThisSeason: 101,
                  totalRankedGamesThisSeason: 102,
                  highestSoloRank: "silver",
                  highestTeamRank: "",
                },
                history: [
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "loss",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                ],
              },
            },
            {
              heading: {
                portrait: {
                  url: "https://static.starcraft2.com/starport/d0e7c831-18ab-4cd6-adc7-9d4a28f49ec7/portraits/2-14.jpg",
                  frame: "grandmaster",
                },
                player: {
                  clan: {
                    name: "",
                    tag: "",
                  },
                  name: "Player name",
                  server: "eu",
                },
              },
              details: {
                snapshot: [
                  {
                    mode: "1v1",
                    rank: "silver",
                    wins: 101,
                    losses: 100,
                    race: "random",
                    mmr: 3655,
                    divisionRank: 3,
                  },
                  {
                    mode: "2v2",
                    rank: "silver",
                    wins: 101,
                    losses: 100,
                    race: "terran",
                    mmr: 3655,
                    divisionRank: 3,
                  },
                ],
                stats: {
                  totalCareerGames: 100,
                  totalGamesThisSeason: 101,
                  totalRankedGamesThisSeason: 102,
                  highestSoloRank: "silver",
                  highestTeamRank: "",
                },
                history: [
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "loss",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                ],
              },
            },
                        {
              heading: {
                portrait: {
                  url: "https://static.starcraft2.com/starport/d0e7c831-18ab-4cd6-adc7-9d4a28f49ec7/portraits/2-14.jpg",
                  frame: "grandmaster",
                },
                player: {
                  clan: {
                    name: "",
                    tag: "",
                  },
                  name: "Player name",
                  server: "eu",
                },
              },
              details: {
                snapshot: [
                  {
                    mode: "1v1",
                    rank: "silver",
                    wins: 101,
                    losses: 100,
                    race: "random",
                    mmr: 3655,
                    divisionRank: 3,
                  },
                  {
                    mode: "2v2",
                    rank: "silver",
                    wins: 101,
                    losses: 100,
                    race: "terran",
                    mmr: 3655,
                    divisionRank: 3,
                  },
                ],
                stats: {
                  totalCareerGames: 100,
                  totalGamesThisSeason: 101,
                  totalRankedSeasonGamesPlayed: 102,
                  highestSoloRank: "silver",
                  highestTeamRank: "",
                },
                history: [
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "loss",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "loss",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "loss",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "loss",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "loss",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "loss",
                    date: 1562164424000,
                  },
                  {
                    mapName: "Kairos Junction LE",
                    mode: "1v1",
                    result: "win",
                    date: 1562164424000,
                  },
                ],
              },
            },
          ].slice(0,3),
        },
    });
    setTimeout(() => {
      successFn();
    }, 3000);
  });
  next();
});
