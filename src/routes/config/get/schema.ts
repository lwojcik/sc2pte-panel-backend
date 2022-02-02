const response = {
  200: {
    type: "object",
    properties: {
      channelId: { type: "string" },
      profiles: {
        type: "array",
        items: {
          type: "object",
          properties: {
            locale: {
              type: "string",
            },
            regionId: {
              type: "string",
            },
            realmId: {
              type: "string",
            },
            profileId: {
              type: "string",
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
