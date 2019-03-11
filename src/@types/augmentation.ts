// import { Server as HTTPSServer } from "https";
import { Server as HTTPServer, IncomingMessage, ServerResponse } from "http";
import { Db } from "../modules/db";
import fastify from "fastify";

declare module "fastify" {
  export interface FastifyInstance<
    HttpServer = HTTPServer,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  > {
    blipp(): void;
    readonly db: Db;
    auth(authFns:Function[]): fastify.FastifyMiddleware<HTTPServer, HttpRequest, HttpResponse>[];
  }
}