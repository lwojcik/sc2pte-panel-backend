import * as http from "http";
import { Db } from "../modules/db";

declare module "fastify" {
  export interface FastifyInstance<
    HttpServer = http.Server,
    HttpRequest = http.IncomingMessage,
    HttpResponse = http.ServerResponse
  > {
    blipp(): void;
    readonly db: Db;
  }
}