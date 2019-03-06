// import { Server as HTTPSServer } from "https";
import { Server as HTTPServer, IncomingMessage, ServerResponse } from "http";
import { Db } from "../modules/db";

declare module "fastify" {
  export interface FastifyInstance<
    HttpServer = HTTPServer,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  > {
    https?: {
      key: string,
      cert: string,
    },
    blipp(): void;
    readonly db: Db;
  }
}