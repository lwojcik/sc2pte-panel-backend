const response = {
  200: {
    type: "object",
    properties: {
      channelId: { type: "string" },
      data: {
        type: "object",
        properties: {
          profiles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                heading: {
                  type: "object",
                  properties: {
                    portrait: {
                      type: "object",
                      properties: {
                        url: {
                          type: "string",
                        },
                        frame: {
                          type: "string",
                        },
                      },
                    },
                    player: {
                      type: "object",
                      properties: {
                        clan: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                            },
                            tag: {
                              type: "string",
                            },
                          },
                        },
                        name: {
                          type: "string",
                        },
                        server: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
                details: {
                  type: "object",
                  properties: {
                    snapshot: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          mode: {
                            type: "string",
                          },
                          rank: {
                            type: "string",
                          },
                          wins: {
                            type: "number",
                          },
                          losses: {
                            type: "number",
                          },
                          race: {
                            type: "string",
                          },
                          mmr: {
                            type: "number",
                          },
                          divisionRank: {
                            type: "number",
                          },
                          teamMembers: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                        },
                      },
                    },
                    stats: {
                      type: "object",
                      properties: {
                        highestSoloRank: {
                          type: "string",
                        },
                        highestTeamRank: {
                          type: "string",
                        },
                        totalRankedGamesThisSeason: {
                          type: "number",
                        },
                        seasonWinRatio: {
                          type: "number",
                        },
                        totalCareerGames: {
                          type: "number",
                        },
                      },
                    },
                    history: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          mapName: {
                            type: "string",
                          },
                          mode: {
                            type: "string",
                          },
                          result: {
                            type: "string",
                          },
                          date: {
                            type: "number",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  400: {
    type: "object",
    properties: {
      status: { type: "number" },
    },
  },
  500: {
    type: "object",
    properties: {
      status: { type: "number" },
    },
  },
};

const schema = {
  response,
};

export default schema;
