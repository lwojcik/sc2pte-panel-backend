import * as fastify from 'fastify';
import * as http from 'http';
import profile from '../routes/profile/profile';

interface ApiResponse {
  status: number;
  data: object;
}

export interface PlayerObject {
  [key: string]: string | number;
  regionId: string | number;
  realmId: string | number;
  profileId: string | number;
}

export interface PlayerLadder extends PlayerObject {
  ladderId: string;
}

export interface LeagueObject {
  seasonId: number;
  queueId: number;
  teamType: string;
  leagueId: string;
}

export interface ConfigObject {
  channelId: string;
  data: PlayerObject[];
}

declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = http.Server,
    HttpRequest = http.IncomingMessage,
    HttpResponse = http.ServerResponse,
  > {
    cache: {
      has: (key) => boolean;
      set: (key, value, cachePeriod) => any;
      get: (
        key,
      ) => Promise<{
        item: string;
        stored: number;
        ttl: number;
      }>;
      purge: any;
    };
    db: any;
    playerConfig: {
      save: any;
      get: any;
    };
    viewer: {
      getData: any;
      getFreshData: any;
    };
    twitch: {
      validateConfig: fastify.FastifyMiddleware,
      validateViewer: fastify.FastifyMiddleware,
    },
    log(): void;
    close(): Promise<any>;
    accessToken: {
      getAccessToken: (refresh: boolean) => Promise<string>;
      getFreshAccessToken;
      getCachedAccessToken;
      isAccessTokenCached;
      cacheAccessToken;
    };
    redis: {
      set: (key, value) => Promise<void>;
      get: (key) => Promise<any>;
      expire: (key, value) => Promise<any>;
      ttl: (key) => Promise<number>;
    };
    twitchEbs: {
      verifyBroadcaster: (payload: string) => boolean;
      validatePermission: (token: string, channelid: string, role: string | string[]) => boolean;
    }
    sas: {
      getProfile: (
        object: PlayerObject,
      ) => Promise<ApiResponse>;
      getLadderSummary: (
        object: PlayerObject,
        refresh?: boolean,
      ) => Promise<ApiResponse>;
      getLadder: (
        object: PlayerLadder,
        ladderId: number,
        refresh?: boolean,
      ) => Promise<ApiResponse>;
      getLegacyMatchHistory: (
        object: PlayerObject,
        refresh?: boolean,
      ) => Promise<ApiResponse>;
    };
  }
}
