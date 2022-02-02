/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fastify from "fastify";
import { PlayerObject } from "starcraft2-api";

interface ApiResponse {
  status: number;
  data: object;
}

export interface ConfigObject {
  channelId: string;
  data: PlayerObject[];
}

export interface RouteOptions {
  urlPrefix: string;
}

export interface RouteParams {
  channelId: string;
}

declare module "fastify" {
  export interface FastifyInstance {
    cache: {
      has: (key) => boolean;
      set: (key, value, cachePeriod) => any;
      get: (key) => Promise<{
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
      validateConfig: fastify.FastifyMiddleware;
      validateViewer: fastify.FastifyMiddleware;
    };
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
      validatePermission: (
        token: string,
        channelid: string,
        role: string | string[],
        acceptExpired?: boolean
      ) => boolean;
    };
    sas: {
      getProfile: (object: PlayerObject) => Promise<ApiResponse>;
      getLadderSummary: (
        object: PlayerObject,
        refresh?: boolean
      ) => Promise<ApiResponse>;
      getLadder: (
        object: PlayerObject,
        ladderId: number,
        refresh?: boolean
      ) => Promise<ApiResponse>;
      getLegacyMatchHistory: (
        object: PlayerObject,
        refresh?: boolean
      ) => Promise<ApiResponse>;
    };
    cloudflare: {
      purgeByChannelId: any;
    };
  }
}
