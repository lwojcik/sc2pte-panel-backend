const paramsJsonSchema = {
  type: 'object',
  properties: {
    channelId: { type: 'string' },
  },
  required: ['channelId'],
};

const headersJsonSchema = {
  type: 'object',
  properties: {
    token: { type: 'string' },
  },
  required: ['token'],
};

const responseJsonSchema = {
  200: {
    type: 'object',
    properties: {
      status: { type: 'number' },
      message: { type: 'string' },
      selectedView: { type: 'string' },
      player: {
        type: 'object',
        properties: {
          server: { type: 'string' },
          name: { type: 'string' },
          clan: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              tag: { type: 'string' },
            },
          },
          rank: { type: 'string' },
          portrait: { type: 'string' },
        },
      },
      ladders: {
        type: 'object',
        properties: {
          '1v1': {
            type: 'object',
            properties: {
              totalLadders: { type: 'number' },
              topRankId: { type: 'number' },
              topRank: { type: 'string' },
              topPosition: { type: 'number' },
              topMMR: { type: 'number' },
              wins: { type: 'number' },
              losses: { type: 'number' },
            },
          },
          archon: {
            type: 'object',
            properties: {
              totalLadders: { type: 'number' },
              topRankId: { type: 'number' },
              topRank: { type: 'string' },
              topPosition: { type: 'number' },
              topMMR: { type: 'number' },
              wins: { type: 'number' },
              losses: { type: 'number' },
            },
          },
          '2v2': {
            type: 'object',
            properties: {
              totalLadders: { type: 'number' },
              topRankId: { type: 'number' },
              topRank: { type: 'string' },
              topPosition: { type: 'number' },
              topMMR: { type: 'number' },
              wins: { type: 'number' },
              losses: { type: 'number' },
            },
          },
          '3v3': {
            type: 'object',
            properties: {
              totalLadders: { type: 'number' },
              topRankId: { type: 'number' },
              topRank: { type: 'string' },
              topPosition: { type: 'number' },
              topMMR: { type: 'number' },
              wins: { type: 'number' },
              losses: { type: 'number' },
            },
          },
          '4v4': {
            type: 'object',
            properties: {
              totalLadders: { type: 'number' },
              topRankId: { type: 'number' },
              topRank: { type: 'string' },
              topPosition: { type: 'number' },
              topMMR: { type: 'number' },
              wins: { type: 'number' },
              losses: { type: 'number' },
            },
          },
        },
      },
    },
  },
  404: {
    type: 'object',
    properties: {
      status: { type: 'number' },
      message: { type: 'string' },
    },
  },
  400: {
    type: 'object',
    properties: {
      status: { type: 'number' },
      message: { type: 'string' },
    },
  },
  500: {
    type: 'object',
    properties: {
      status: { type: 'number' },
      message: { type: 'string' },
    },
  },
};

const schema = {
  params: paramsJsonSchema,
  headers: headersJsonSchema,
  response: responseJsonSchema,
};


module.exports = schema;
