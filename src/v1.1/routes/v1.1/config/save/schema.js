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
  201: {
    type: 'object',
    properties: {
      status: { type: 'number' },
      message: { type: 'string' },
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
