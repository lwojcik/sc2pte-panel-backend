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
  },
  {
    mode: "archon",
    rank,
    wins: 101,
    losses: 100,
    race: "terran",
    mmr: 3,
    divisionRank,
  },
  {
    mode: "2v2",
    rank,
    wins: 101,
    losses: 100,
    race: "terran",
    mmr: 3655,
    divisionRank,
  },
  {
    mode: "3v3",
    rank,
    wins: 101,
    losses: 100,
    race: "zerg",
    mmr: 3655,
    divisionRank,
  },
  {
    mode: "4v4",
    rank,
    wins: 101,
    losses: 100,
    race: "protoss",
    mmr: 3655,
    divisionRank,
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
                  ...getSampleSnapshot('bronze', 40),
                  ...getSampleSnapshot('bronze', 90),
                  ...getSampleSnapshot('silver', 1),
                  ...getSampleSnapshot('silver', 40),
                  ...getSampleSnapshot('silver', 90),
                  ...getSampleSnapshot('gold', 1),
                  ...getSampleSnapshot('gold', 40),
                  ...getSampleSnapshot('gold', 90),
                  ...getSampleSnapshot('platinum', 1),
                  ...getSampleSnapshot('platinum', 40),
                  ...getSampleSnapshot('platinum', 90),
                  ...getSampleSnapshot('diamond', 1),
                  ...getSampleSnapshot('diamond', 40),
                  ...getSampleSnapshot('diamond', 90),
                  ...getSampleSnapshot('master', 1),
                  ...getSampleSnapshot('master', 40),
                  ...getSampleSnapshot('master', 90),
                  ...getSampleSnapshot('grandmaster', 1),
                  ...getSampleSnapshot('grandmaster', 40),
                  ...getSampleSnapshot('grandmaster', 90),
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
