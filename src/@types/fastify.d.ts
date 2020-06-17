import * as fastify from 'fastify';
import * as http from 'http';
import profile from '../routes/profile/profile';

interface ApiResponse {
  status: number;
  data: object;
}

export interface PlayerObject {
  regionId: string;
  realmId: string;
  profileId: string;
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
    };
    authenticateConfig: fastify.FastifyMiddleware,
    authenticateViewer: fastify.FastifyMiddleware,
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
    bas: {
      getAccessToken: (refresh?: Boolean) => Promise<string>;
      refreshAccessToken: () => Promise<string>;
    };
    sc2api: {
      getProfile: (
        object: PlayerObject,
        refresh?: boolean,
      ) => Promise<ApiResponse>;
      getStaticProfileData: (
        regionId,
        refresh?: boolean,
      ) => Promise<ApiResponse>;
      getProfileMetadata: (
        object: PlayerObject,
        refresh?: boolean,
      ) => Promise<ApiResponse>;
      getLadderSummary: (
        object: PlayerObject,
        refresh?: boolean,
      ) => Promise<ApiResponse>;
      getLadder: (
        object: PlayerLadder,
        refresh?: boolean,
      ) => Promise<ApiResponse>;
      getLeague: (
        object: LeagueObject,
        refresh?: boolean,
      ) => Promise<ApiResponse>;
      getGrandmasterLeaderboard: (
        regionId,
        refresh?: boolean,
      ) => Promise<ApiResponse>;
      getSeason: (regionId, refresh?: boolean) => Promise<ApiResponse>;
      getLegacyProfile: (
        object: PlayerObject,
        refresh?: boolean,
      ) => Promise<ApiResponse>;
      getLegacyLadders: (
        object: PlayerObject,
        refresh?: boolean,
      ) => Promise<ApiResponse>;
      getLegacyLadder: (
        regionId,
        ladderId,
        refresh?: boolean,
      ) => Promise<ApiResponse>;
      getLegacyMatchHistory: (
        object: PlayerObject,
        refresh?: boolean,
      ) => Promise<ApiResponse>;
      getLegacyAchievements: (
        regionId,
        refresh?: boolean,
      ) => Promise<ApiResponse>;
      getLegacyRewards: (regionId, refresh?: boolean) => Promise<ApiResponse>;
    };
  }
}
