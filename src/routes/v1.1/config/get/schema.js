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
      channelId: { type: 'number' },
      regionId: { type: 'number' },
      realmId: { type: 'number' },
      playerId: { type: 'number' },
      selectedView: { type: 'string' },
      apiDisabledJanuary2020: { type: 'boolean' },
    },
  },
  404: {
    type: 'object',
    properties: {
      status: { type: 'number' },
      message: { type: 'string' },
      apiDisabledJanuary2020: { type: 'boolean' },
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
