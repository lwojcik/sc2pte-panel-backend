import { Model } from "mongoose";
import Mongoose from "mongoose";
import { ChannelConfig, ChannelConfigModel } from "../models/v1.1/ChannelConfig";

import fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from "http";
import fp from "fastify-plugin";

export interface Models {
  ChannelConfig: Model<ChannelConfigModel>;
}

export interface Db {
  models: Models;
}

export default fp(async (fastify, opts: { uri: string }, next) => {
  Mongoose.connection.on("connected", () => {
    fastify.log.info({ actor: "MongoDB" }, "connected");
  });

  Mongoose.connection.on("disconnected", () => {
    fastify.log.error({ actor: "MongoDB" }, "disconnected");
  });

  await Mongoose.connect(
    opts.uri,
    {
      useNewUrlParser: true,
      keepAlive: true,
    }
  );

  const models: Models = {
    ChannelConfig: ChannelConfig
  };

  fastify.decorate("db", { models });

  next();
}) as fastify.Plugin<Server, IncomingMessage, ServerResponse, {}>;
