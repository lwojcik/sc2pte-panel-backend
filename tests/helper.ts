const getConfig = (enableRedis: boolean) => {
  return {
    app: {
      nodeEnv: 'test',
      port: '8123',
    },
    sas: {
      url: 'http://localhost:8081',
      statusEndpoint: 'status',
    },
    bnet: {
      region: 'us',
    },
    db: {
      uri: 'http://localhost/db',
    },
    twitch: {
      clientId: 'fake_client_id',
      secret: 'fake_client_secret',
      enableOnAuthorized: true,
    },
    redis: {
      enable: enableRedis,
      host: '127.0.0.1',
      port: '6379',
      password: '',
      db: '0',
      replyCachePeriod: 2000,
      ttl: 20,
    },
    maxProfiles: 3,
  };
};

export default getConfig;