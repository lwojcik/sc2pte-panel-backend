const response = {
  200: {
    type: 'object',
    properties: {
      status: { type: 'number' },
      message: { type: 'string' },
      timestamp: { type: 'string' },
    },
  },
};

const schema = {
  response,
};

export default schema;
