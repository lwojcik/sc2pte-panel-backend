import fp from "fastify-plugin";
// import schema from "./schema";

export default fp((server, {}, next) => {
  server.get(
    "/viewer/:channelId",
    {
      preValidation: [server.authenticateViewer],
    },
    (request, reply) => {
    const { channelId } = request.params;
    reply.code(200).send({
      status: 200,
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
                  name: "Team Name",
                  tag: "TEAM",
                },
                name: "Player name",
                server: "eu",
              },
            },
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
                date: new Date(),
              },
              {
                mapName: "Kairos Junction LE",
                mode: "1v1",
                result: "loss",
                date: new Date(),
              },
              {
                mapName: "Kairos Junction LE",
                mode: "1v1",
                result: "win",
                date: new Date(),
              },
            ],
          },
          {
            heading: {
              portrait: {
                url: "https://static.starcraft2.com/starport/d0e7c831-18ab-4cd6-adc7-9d4a28f49ec7/portraits/2-14.jpg",
                frame: "grandmaster",
              },
              player: {
                clan: {
                  name: "Team Name",
                  tag: "TEAM",
                },
                name: "Player name",
                server: "eu",
              },
            },
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
                date: new Date(),
              },
              {
                mapName: "Kairos Junction LE",
                mode: "1v1",
                result: "loss",
                date: new Date(),
              },
              {
                mapName: "Kairos Junction LE",
                mode: "1v1",
                result: "win",
                date: new Date(),
              },
            ],
          },
          {
            heading: {
              portrait: {
                url: "https://static.starcraft2.com/starport/d0e7c831-18ab-4cd6-adc7-9d4a28f49ec7/portraits/2-14.jpg",
                frame: "grandmaster",
              },
              player: {
                clan: {
                  name: "Team Name",
                  tag: "TEAM",
                },
                name: "Player name",
                server: "eu",
              },
            },
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
                date: new Date(),
              },
              {
                mapName: "Kairos Junction LE",
                mode: "1v1",
                result: "loss",
                date: new Date(),
              },
              {
                mapName: "Kairos Junction LE",
                mode: "1v1",
                result: "win",
                date: new Date(),
              },
            ],
          },
        ],
      },
    });
  });
  next();
});
