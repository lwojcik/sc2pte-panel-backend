const getConfig = (enableRedis: boolean) => {
  return {
    app: {
      nodeEnv: 'test',
      port: '8123',
      urlPrefix: 'v2test',
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
      secret: 'fake_client_secret',
      enableOnAuthorized: true,
    },
    redis: {
      enable: enableRedis,
      host: '127.0.0.1',
      port: '6379',
      password: '',
      db: '0',
      ttl: 600000,
    },
    cloudflare: {
      enable: true,
      apiToken: 'test_access_token',
    },
    maxProfiles: 3,
  };
};

export default getConfig;
