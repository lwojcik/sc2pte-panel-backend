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
]);

export default fp((server, {}, next) => {
  server.get(
    "/v2/viewer/:channelId",
    {
      preValidation: [server.authenticateViewer],
    },
    (request, reply) => {
      const { channelId } = request.params;
      reply.code(200).send({
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
                    name: "",
                    tag: "",
                  },
                  name: "Player name",
                  server: "eu",
                },
              },
              details: {
                snapshot: [
                  ...getSampleSnapshot('bronze', 1),
                  ...getSampleSnapshot('bronze', 9),
                  ...getSampleSnapshot('bronze', 26),
                  ...getSampleSnapshot('bronze', 51),
                  ...getSampleSnapshot('silver', 1),
                  ...getSampleSnapshot('silver', 9),
                  ...getSampleSnapshot('silver', 26),
                  ...getSampleSnapshot('silver', 51),
                  ...getSampleSnapshot('gold', 1),
                  ...getSampleSnapshot('gold', 9),
                  ...getSampleSnapshot('gold', 26),
                  ...getSampleSnapshot('gold', 51),
                  ...getSampleSnapshot('platinum', 1),
                  ...getSampleSnapshot('platinum', 9),
                  ...getSampleSnapshot('platinum', 26),
                  ...getSampleSnapshot('platinum', 51),
                  ...getSampleSnapshot('diamond', 1),
                  ...getSampleSnapshot('diamond', 9),
                  ...getSampleSnapshot('diamond', 26),
                  ...getSampleSnapshot('diamond', 51),
                  ...getSampleSnapshot('master', 1),
                  ...getSampleSnapshot('master', 9),
                  ...getSampleSnapshot('master', 26),
                  ...getSampleSnapshot('master', 51),
                  ...getSampleSnapshot('grandmaster', 1),
                  ...getSampleSnapshot('grandmaster', 17),
                  ...getSampleSnapshot('grandmaster', 51),
                  ...getSampleSnapshot('grandmaster', 101),

                ],
                stats: {
                  totalGames: 100,
                  bonusPool: 24,
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
                  totalGames: 100,
                  bonusPool: 24,
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
                  totalGames: 100,
                  bonusPool: 24,
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
                  totalGames: 100,
                  bonusPool: 24,
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
                  totalGames: 100,
                  bonusPool: 24,
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
          ].slice(0,1),
        },
    });
  });
  next();
});
