import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import http from 'http';

export interface SasOptions {
  url: String;
  statusEndpoint: String;
}

// interface SASReply {
//   status: number;
//   data: {
//     accessToken: string;
//   };
// }

interface OKReply {
  status: 200;
  message: 'ok';
}

const sas = fp(
  async (
    fastify: FastifyInstance,
    opts: SasOptions,
    next: Function,
  ) => {
    let isUp = false;
    const statusUrl = `${opts.url}/${opts.statusEndpoint}`;

    const sasDown = {
      status: 500,
      message: 'sc2-api-service is down!',
    };

    const get = (url: string): object =>
      new Promise((resolve, reject) => {
        http
          .get(url, (res) => {
            res.setEncoding('utf8');
            let body = '';
            res.on('data', chunk => (body += chunk));
            res.on('end', () => resolve(JSON.parse(body)));
          })
          .on('error', reject);
      });

    const checkIfHostIsUp = async (url: string) => {
      try {
        const response = (await get(url)) as OKReply;
        if (response.status && response.status !== 200) return false;
        return true;
      } catch (error) {
        return false;
      }
    };

    const checkOnStartup = async () => {
      const isSASup = await checkIfHostIsUp(statusUrl);
      isUp = isSASup;
      isSASup
        ? fastify.log.info('sc2-api-service status: running')
        : fastify.log.error('sc2-api-service is down!');
    };

    const foo = () => {
      if (!isUp) return sasDown;
      return 'bar';
    };

    fastify.decorate('sas', {
      foo,
    });

    checkOnStartup();

    next();
  },
);

export default sas;
