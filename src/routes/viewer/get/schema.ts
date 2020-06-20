const response = {
  200: {
    type: 'object',
    properties: {
      channelId: { type: 'string' },
      data: {
        type: 'object',
        properties: {
          profiles: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                heading: {
                  type: 'object',
                  properties: {
                    portrait: {
                      type: 'object',
                      properties: {
                        url: {
                          type: 'string',
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
    type: 'object',
    properties: {
      status: { type: 'number' },
    },
  },
  500: {
    type: 'object',
    properties: {
      status: { type: 'number' },
    },
  },
};

const schema = {
  response,
};

export default schema;
