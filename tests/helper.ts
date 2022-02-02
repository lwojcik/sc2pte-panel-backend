const getConfig = (enableRedis: boolean) => ({
  app: {
    nodeEnv: "test",
    port: "8123",
    urlPrefix: "v2test",
  },
  sas: {
    url: "http://localhost:8081",
    statusEndpoint: "status",
  },
  bnet: {
    region: "us",
  },
  db: {
    uri: "http://localhost/db",
  },
  twitch: {
    secret: "fake_client_secret",
    enableOnAuthorized: true,
  },
  redis: {
    enable: enableRedis,
    host: "127.0.0.1",
    port: "6379",
    password: "",
    db: "0",
    ttl: 600000,
  },
  cloudflare: {
    enable: true,
    token: "test_access_token",
    zoneId: "test_zone_id",
    productionDomain: "testProductionDomain",
    viewerRoute: "testViewerRoute",
  },
  maxProfiles: 3,
});

export default getConfig;
